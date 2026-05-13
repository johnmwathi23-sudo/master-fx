import { Controller, Get, Put, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.sub);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getDashboardStats(@CurrentUser() user: any) {
    return this.usersService.getDashboardStats(user.sub);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: any,
    @Body() data: { firstName?: string; lastName?: string; phone?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(user.sub, data);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('q') query: string, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.usersService.searchUsers(query, parseInt(page), parseInt(limit));
  }
}
