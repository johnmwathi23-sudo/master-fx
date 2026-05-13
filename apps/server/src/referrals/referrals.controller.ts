import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('code')
  @UseGuards(JwtAuthGuard)
  async getReferralCode(@CurrentUser() user: any) {
    return this.referralsService.getReferralCode(user.sub);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getReferralStats(@CurrentUser() user: any) {
    return this.referralsService.getReferralStats(user.sub);
  }
}
