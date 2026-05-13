import { Module } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingController } from './trading.controller';
import { MarketGateway } from './market.gateway';

@Module({
  controllers: [TradingController],
  providers: [TradingService, MarketGateway],
  exports: [TradingService],
})
export class TradingModule {}
