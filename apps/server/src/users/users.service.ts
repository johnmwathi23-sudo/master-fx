import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, twoFactorSecret, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(id: string, data: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash, twoFactorSecret, ...result } = user;
    return result;
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Password changed successfully' };
  }

  async getDashboardStats(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const trades = await this.prisma.trade.findMany({
      where: { userId, status: 'CLOSED' },
    });

    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profitLoss && Number(t.profitLoss) > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalProfit = trades.reduce((sum, t) => sum + (Number(t.profitLoss) || 0), 0);
    const activeTrades = await this.prisma.trade.count({
      where: { userId, status: 'OPEN' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTrades = trades.filter(t => new Date(t.closedAt!) >= today);
    const todayPnL = todayTrades.reduce((sum, t) => sum + (Number(t.profitLoss) || 0), 0);

    return {
      totalBalance: wallet ? Number(wallet.balance) + Number(wallet.demoBalance) : 0,
      totalProfit: Number(wallet?.totalProfit || 0),
      totalLoss: Number(wallet?.totalLoss || 0),
      winRate,
      totalTrades,
      activeTrades,
      todayPnL,
      portfolioChange: totalTrades > 0 ? (totalProfit / totalTrades) * 100 : 0,
    };
  }

  async searchUsers(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
