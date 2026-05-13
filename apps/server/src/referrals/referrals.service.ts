import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { generateReferralCode } from '../common/utils';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async getReferralCode(userId: string) {
    let referral = await this.prisma.referral.findFirst({
      where: { refereeId: userId },
    });

    if (!referral) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const code = generateReferralCode(user.username);
      referral = await this.prisma.referral.create({
        data: {
          referrerId: userId,
          refereeId: userId,
          code,
          bonusAmount: 0,
        },
      });
    }

    return { code: referral.code };
  }

  async getReferralStats(userId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referee: {
          select: { username: true, avatar: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReferrals = referrals.length;
    const totalBonus = referrals.reduce((sum, r) => sum + Number(r.bonusAmount), 0);
    const paidReferrals = referrals.filter(r => r.isBonusPaid).length;

    return {
      totalReferrals,
      totalBonus,
      paidReferrals,
      referrals: referrals.map(r => ({
        username: r.referee.username,
        avatar: r.referee.avatar,
        bonusAmount: Number(r.bonusAmount),
        isBonusPaid: r.isBonusPaid,
        joinedAt: r.referee.createdAt,
      })),
    };
  }
}
