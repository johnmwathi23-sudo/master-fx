import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async submitKyc(userId: string, data: {
    documentType: string;
    documentUrl: string;
    selfieUrl?: string;
    addressProofUrl?: string;
    country?: string;
    dateOfBirth?: string;
  }) {
    const existing = await this.prisma.kYCSubmission.findUnique({ where: { userId } });
    if (existing && ['APPROVED', 'UNDER_REVIEW', 'SUBMITTED'].includes(existing.status)) {
      throw new BadRequestException('KYC already submitted or approved');
    }

    if (existing) {
      return this.prisma.kYCSubmission.update({
        where: { userId },
        data: {
          ...data,
          status: 'SUBMITTED',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          submittedAt: new Date(),
        },
      });
    }

    return this.prisma.kYCSubmission.create({
      data: {
        userId,
        ...data,
        status: 'SUBMITTED',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        submittedAt: new Date(),
      },
    });
  }

  async getKycStatus(userId: string) {
    const kyc = await this.prisma.kYCSubmission.findUnique({ where: { userId } });
    if (!kyc) return { status: 'PENDING', message: 'No KYC submission found' };
    return kyc;
  }

  async reviewKyc(adminId: string, kycId: string, status: 'APPROVED' | 'REJECTED', note?: string) {
    const kyc = await this.prisma.kYCSubmission.findUnique({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException('KYC submission not found');

    const updated = await this.prisma.kYCSubmission.update({
      where: { id: kycId },
      data: {
        status,
        reviewedBy: adminId,
        reviewNote: note,
        reviewedAt: new Date(),
      },
    });

    if (status === 'APPROVED') {
      await this.prisma.user.update({
        where: { id: kyc.userId },
        data: { isEmailVerified: true },
      });
    }

    return updated;
  }

  async getPendingSubmissions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [submissions, total] = await Promise.all([
      this.prisma.kYCSubmission.findMany({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
        skip,
        take: limit,
        include: { user: { select: { email: true, username: true } } },
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.kYCSubmission.count({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      }),
    ]);

    return {
      data: submissions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
