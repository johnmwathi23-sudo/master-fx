import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TradingService {
  private simulatedPrices: Map<string, number> = new Map();

  constructor(private prisma: PrismaService) {
    this.initializePrices();
  }

  private async initializePrices() {
    const assets = await this.prisma.asset.findMany({ where: { isActive: true } });
    for (const asset of assets) {
      this.simulatedPrices.set(asset.symbol, Number(asset.currentPrice));
    }
  }

  async getAssets(category?: string) {
    const where = category ? { category: category as any, isActive: true } : { isActive: true };
    return this.prisma.asset.findMany({
      where,
      orderBy: { symbol: 'asc' },
    });
  }

  async getAsset(symbol: string) {
    const asset = await this.prisma.asset.findUnique({ where: { symbol } });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async executeTrade(userId: string, dto: {
    assetId: string;
    type: 'BUY' | 'SELL';
    amount: number;
    stopLoss?: number;
    takeProfit?: number;
    duration?: number;
    isDemo?: boolean;
  }) {
    const asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } });
    if (!asset) throw new NotFoundException('Asset not found');

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const balance = dto.isDemo ? wallet.demoBalance : wallet.availableBalance;
    if (Number(balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const currentPrice = this.simulatedPrices.get(asset.symbol) || Number(asset.currentPrice);

    if (dto.isDemo) {
      await this.prisma.wallet.update({
        where: { userId },
        data: { demoBalance: { decrement: dto.amount } },
      });
    } else {
      await this.prisma.wallet.update({
        where: { userId },
        data: { availableBalance: { decrement: dto.amount } },
      });
    }

    const trade = await this.prisma.trade.create({
      data: {
        userId,
        assetId: asset.id,
        type: dto.type,
        amount: dto.amount,
        entryPrice: currentPrice,
        stopLoss: dto.stopLoss,
        takeProfit: dto.takeProfit,
        duration: dto.duration,
        isDemo: dto.isDemo || false,
        status: 'OPEN',
        commission: dto.amount * 0.001,
      },
      include: { asset: true },
    });

    return trade;
  }

  async closeTrade(userId: string, tradeId: string) {
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId, status: 'OPEN' },
      include: { asset: true },
    });
    if (!trade) throw new NotFoundException('Trade not found or already closed');

    const currentPrice = this.simulatedPrices.get(trade.asset.symbol) || Number(trade.asset.currentPrice);
    const exitPrice = currentPrice;

    let profitLoss: number;
    if (trade.type === 'BUY') {
      profitLoss = (exitPrice - Number(trade.entryPrice)) * Number(trade.amount);
    } else {
      profitLoss = (Number(trade.entryPrice) - exitPrice) * Number(trade.amount);
    }

    const closedTrade = await this.prisma.trade.update({
      where: { id: tradeId },
      data: {
        status: 'CLOSED',
        exitPrice,
        profitLoss,
        closedAt: new Date(),
      },
    });

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      const returnAmount = Number(trade.amount) + profitLoss;
      if (trade.isDemo) {
        await this.prisma.wallet.update({
          where: { userId },
          data: {
            demoBalance: { increment: Math.max(0, returnAmount) },
            totalProfit: profitLoss > 0 ? { increment: profitLoss } : undefined,
            totalLoss: profitLoss < 0 ? { increment: Math.abs(profitLoss) } : undefined,
          },
        });
      } else {
        await this.prisma.wallet.update({
          where: { userId },
          data: {
            availableBalance: { increment: Math.max(0, returnAmount) },
            totalProfit: profitLoss > 0 ? { increment: profitLoss } : undefined,
            totalLoss: profitLoss < 0 ? { increment: Math.abs(profitLoss) } : undefined,
          },
        });
      }
    }

    await this.prisma.transaction.create({
      data: {
        userId,
        type: profitLoss >= 0 ? 'TRADE_PROFIT' : 'TRADE_LOSS',
        amount: Math.abs(profitLoss),
        fee: Number(trade.commission),
        balance: Number(wallet?.availableBalance || 0),
        description: `${trade.type} ${trade.asset.symbol} - ${profitLoss >= 0 ? 'Profit' : 'Loss'}`,
      },
    });

    return closedTrade;
  }

  async getTradeHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [trades, total] = await Promise.all([
      this.prisma.trade.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { asset: { select: { symbol: true, name: true, category: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trade.count({ where: { userId } }),
    ]);

    return {
      data: trades,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getActiveTrades(userId: string) {
    return this.prisma.trade.findMany({
      where: { userId, status: 'OPEN' },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Cron('*/5 * * * * *')
  async simulateMarketData() {
    const assets = await this.prisma.asset.findMany({ where: { isActive: true } });

    for (const asset of assets) {
      const currentPrice = this.simulatedPrices.get(asset.symbol) || Number(asset.currentPrice);
      const volatility = asset.category === 'CRYPTO' ? 0.002 : 0.0003;
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      const newPrice = currentPrice + change;

      this.simulatedPrices.set(asset.symbol, newPrice);

      const dailyChange = ((newPrice - Number(asset.previousPrice)) / Number(asset.previousPrice)) * 100;
      const dailyHigh = Math.max(Number(asset.dailyHigh), newPrice);
      const dailyLow = Math.min(Number(asset.dailyLow), newPrice);

      await this.prisma.asset.update({
        where: { id: asset.id },
        data: {
          currentPrice: newPrice,
          dailyChange,
          dailyHigh,
          dailyLow,
        },
      });
    }
  }

  getSimulatedPrice(symbol: string): number {
    return this.simulatedPrices.get(symbol) || 0;
  }

  getAllSimulatedPrices(): Record<string, number> {
    const prices: Record<string, number> = {};
    this.simulatedPrices.forEach((price, symbol) => {
      prices[symbol] = price;
    });
    return prices;
  }
}
