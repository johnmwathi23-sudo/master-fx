import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TradingService } from './trading.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, IsUUID } from 'class-validator';

class CreateTradeDto {
  @IsUUID()
  assetId: string;

  @IsEnum(['BUY', 'SELL'])
  type: 'BUY' | 'SELL';

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsNumber()
  stopLoss?: number;

  @IsOptional()
  @IsNumber()
  takeProfit?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsBoolean()
  isDemo?: boolean;
}

@Controller('trading')
export class TradingController {
  constructor(private tradingService: TradingService) {}

  @Get('assets')
  async getAssets(@Query('category') category?: string) {
    return this.tradingService.getAssets(category);
  }

  @Get('assets/:symbol')
  async getAsset(@Param('symbol') symbol: string) {
    return this.tradingService.getAsset(symbol);
  }

  @Get('prices')
  async getLivePrices() {
    return this.tradingService.getAllSimulatedPrices();
  }

  @Post('execute')
  @UseGuards(JwtAuthGuard)
  async executeTrade(@CurrentUser() user: any, @Body() dto: CreateTradeDto) {
    return this.tradingService.executeTrade(user.sub, dto);
  }

  @Post('close/:id')
  @UseGuards(JwtAuthGuard)
  async closeTrade(@CurrentUser() user: any, @Param('id') tradeId: string) {
    return this.tradingService.closeTrade(user.sub, tradeId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getTradeHistory(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.tradingService.getTradeHistory(user.sub, parseInt(page), parseInt(limit));
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  async getActiveTrades(@CurrentUser() user: any) {
    return this.tradingService.getActiveTrades(user.sub);
  }
}
