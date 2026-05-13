import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(userId: string, type: string, title: string, message: string, link?: string) {
    return this.prisma.notification.create({
      data: { userId, type: type as any, title, message, link },
    });
  }

  async sendToAll(title: string, message: string, specificUserId?: string) {
    if (specificUserId) {
      return this.prisma.notification.create({
        data: { userId: specificUserId, type: 'ADMIN', title, message },
      });
    }

    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const result = await this.prisma.notification.createMany({
      data: users.map(u => ({
        userId: u.id,
        type: 'ADMIN',
        title,
        message,
      })),
    });

    return { sent: result.count };
  }
}
