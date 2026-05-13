import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('user-growth')
  async getUserGrowth(@Query('days') days = '30') {
    return this.adminService.getUserGrowth(parseInt(days));
  }

  @Get('trading-volume')
  async getTradingVolume(@Query('days') days = '30') {
    return this.adminService.getTradingVolume(parseInt(days));
  }

  @Get('revenue')
  async getRevenueMetrics(@Query('days') days = '30') {
    return this.adminService.getRevenueMetrics(parseInt(days));
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(parseInt(page), parseInt(limit), search);
  }

  @Put('users/:id/toggle-status')
  async toggleUserStatus(@CurrentUser() user: any, @Param('id') userId: string) {
    return this.adminService.toggleUserStatus(user.sub, userId);
  }

  @Put('users/:id/role')
  async updateUserRole(
    @CurrentUser() user: any,
    @Param('id') userId: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(user.sub, userId, role);
  }

  @Get('deposits')
  async getDeposits(
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.adminService.getDeposits(status, parseInt(page), parseInt(limit));
  }

  @Get('withdrawals')
  async getWithdrawals(
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.adminService.getWithdrawals(status, parseInt(page), parseInt(limit));
  }

  @Put('withdrawals/:id/:action')
  async processWithdrawal(
    @CurrentUser() user: any,
    @Param('id') transactionId: string,
    @Param('action') action: 'approve' | 'reject',
  ) {
    return this.adminService.processWithdrawal(user.sub, transactionId, action);
  }

  @Get('referrals')
  async getReferralStats() {
    return this.adminService.getReferralStats();
  }

  @Get('activity')
  async getRecentActivity(@Query('limit') limit = '50') {
    return this.adminService.getRecentActivity(parseInt(limit));
  }
}
