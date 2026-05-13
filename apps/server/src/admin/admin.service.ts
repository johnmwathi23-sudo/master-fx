import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalTrades,
      deposits,
      withdrawals,
      pendingKyc,
      openTrades,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.trade.count(),
      this.prisma.transaction.aggregate({
        where: { type: 'DEPOSIT', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: 'WITHDRAWAL', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.kYCSubmission.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
      this.prisma.trade.count({ where: { status: 'OPEN' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalTrades,
      totalDeposits: Number(deposits._sum.amount || 0),
      totalWithdrawals: Number(withdrawals._sum.amount || 0),
      pendingKyc,
      openTrades,
      revenue: Number(deposits._sum.amount || 0) * 0.01,
    };
  }

  async getUserGrowth(days = 30) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await this.prisma.user.count({
        where: { createdAt: { gte: date, lt: nextDate } },
      });

      data.push({ date: date.toISOString().split('T')[0], count });
    }
    return data;
  }

  async getTradingVolume(days = 30) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const result = await this.prisma.trade.aggregate({
        where: { createdAt: { gte: date, lt: nextDate } },
        _sum: { amount: true },
        _count: true,
      });

      data.push({
        date: date.toISOString().split('T')[0],
        volume: Number(result._sum.amount || 0),
        count: result._count,
      });
    }
    return data;
  }

  async getRevenueMetrics(days = 30) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [depositFees, tradeCommissions, withdrawalFees] = await Promise.all([
        this.prisma.transaction.aggregate({
          where: { type: 'DEPOSIT', status: 'COMPLETED', createdAt: { gte: date, lt: nextDate } },
          _sum: { fee: true },
        }),
        this.prisma.trade.aggregate({
          where: { createdAt: { gte: date, lt: nextDate } },
          _sum: { commission: true },
        }),
        this.prisma.transaction.aggregate({
          where: { type: 'WITHDRAWAL', status: 'COMPLETED', createdAt: { gte: date, lt: nextDate } },
          _sum: { fee: true },
        }),
      ]);

      const totalRevenue =
        Number(depositFees._sum.fee || 0) +
        Number(tradeCommissions._sum.commission || 0) +
        Number(withdrawalFees._sum.fee || 0);

      data.push({ date: date.toISOString().split('T')[0], revenue: totalRevenue });
    }
    return data;
  }

  async getAllUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { username: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
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
          wallet: { select: { balance: true, totalProfit: true, totalLoss: true } },
          kycSubmission: { select: { status: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async toggleUserStatus(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    await this.logAdminAction(adminId, 'TOGGLE_USER_STATUS', 'User', userId, {
      previousStatus: user.isActive,
      newStatus: updated.isActive,
    });

    return updated;
  }

  async updateUserRole(adminId: string, userId: string, role: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });

    await this.logAdminAction(adminId, 'UPDATE_USER_ROLE', 'User', userId, { newRole: role });

    const { passwordHash, twoFactorSecret, ...result } = updated;
    return result;
  }

  async getDeposits(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { type: 'DEPOSIT' as const, status: status as any } : { type: 'DEPOSIT' as const };

    const [deposits, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { email: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: deposits,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getWithdrawals(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { type: 'WITHDRAWAL' as const, status: status as any } : { type: 'WITHDRAWAL' as const };

    const [withdrawals, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { email: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: withdrawals,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async processWithdrawal(adminId: string, transactionId: string, action: 'approve' | 'reject') {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction || transaction.type !== 'WITHDRAWAL') {
      throw new Error('Withdrawal transaction not found');
    }

    const status = action === 'approve' ? 'COMPLETED' : 'CANCELLED';
    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });

    if (action === 'reject') {
      await this.prisma.wallet.update({
        where: { userId: transaction.userId },
        data: {
          availableBalance: { increment: Number(transaction.amount) + Number(transaction.fee) },
          lockedBalance: { decrement: Number(transaction.amount) },
        },
      });
    }

    await this.logAdminAction(adminId, action === 'approve' ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL', 'Transaction', transactionId);

    return updated;
  }

  async getReferralStats() {
    const totalReferrals = await this.prisma.referral.count();
    const paidReferrals = await this.prisma.referral.count({ where: { isBonusPaid: true } });
    const totalBonus = await this.prisma.referral.aggregate({ _sum: { bonusAmount: true } });

    const topReferrers = await this.prisma.user.findMany({
      where: { referredUsers: { some: {} } },
      take: 10,
      select: {
        id: true,
        username: true,
        email: true,
        _count: { select: { referredUsers: true } },
      },
      orderBy: { referredUsers: { _count: 'desc' } },
    });

    return {
      totalReferrals,
      paidReferrals,
      totalBonus: Number(totalBonus._sum.bonusAmount || 0),
      topReferrers,
    };
  }

  async getRecentActivity(limit = 50) {
    const [recentTrades, recentDeposits, recentRegistrations] = await Promise.all([
      this.prisma.trade.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { username: true } }, asset: { select: { symbol: true } } },
      }),
      this.prisma.transaction.findMany({
        where: { type: 'DEPOSIT' },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { username: true } } },
      }),
      this.prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, username: true, email: true, createdAt: true },
      }),
    ]);

    return { recentTrades, recentDeposits, recentRegistrations };
  }

  private async logAdminAction(adminId: string, action: string, entity: string, entityId: string, details?: any) {
    await this.prisma.adminLog.create({
      data: { adminId, action, entity, entityId, details: details || {} },
    });
  }
}
