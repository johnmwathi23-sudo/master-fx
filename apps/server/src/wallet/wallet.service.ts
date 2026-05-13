import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async deposit(userId: string, amount: number, paymentMethod: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const fee = amount * 0.01;

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        amount,
        fee,
        balance: Number(wallet.balance) + amount - fee,
        description: `Deposit via ${paymentMethod}`,
        paymentMethod,
      },
    });

    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: { increment: amount - fee },
        availableBalance: { increment: amount - fee },
      },
    });

    return transaction;
  }

  async withdraw(userId: string, amount: number, walletAddress: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.availableBalance) < amount) {
      throw new BadRequestException('Insufficient available balance');
    }
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const fee = Math.max(amount * 0.005, 5);

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        amount,
        fee,
        balance: Number(wallet.balance) - amount - fee,
        description: `Withdrawal to ${walletAddress.slice(0, 10)}...`,
        walletAddress,
      },
    });

    await this.prisma.wallet.update({
      where: { userId },
      data: {
        availableBalance: { decrement: amount + fee },
        lockedBalance: { increment: amount },
      },
    });

    return transaction;
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      data: transactions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
