import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsNumber, Min, IsString } from 'class-validator';

class DepositDto {
  @IsNumber()
  @Min(10)
  amount: number;

  @IsString()
  paymentMethod: string;
}

class WithdrawDto {
  @IsNumber()
  @Min(10)
  amount: number;

  @IsString()
  walletAddress: string;
}

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.sub);
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@CurrentUser() user: any, @Body() dto: DepositDto) {
    return this.walletService.deposit(user.sub, dto.amount, dto.paymentMethod);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@CurrentUser() user: any, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(user.sub, dto.amount, dto.walletAddress);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.walletService.getTransactions(user.sub, parseInt(page), parseInt(limit));
  }
}
