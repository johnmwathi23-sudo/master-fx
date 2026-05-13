import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TradingService } from './trading.service';
import { AfterProviderInit } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true },
})
export class MarketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private priceUpdateInterval: NodeJS.Timeout | null = null;

  constructor(private tradingService: TradingService) {}

  afterInit() {
    this.startPriceBroadcast();
  }

  handleConnection(client: Socket) {
    console.log(`Market client connected: ${client.id}`);
    const prices = this.tradingService.getAllSimulatedPrices();
    client.emit('prices', prices);
  }

  handleDisconnect(client: Socket) {
    console.log(`Market client disconnected: ${client.id}`);
  }

  startPriceBroadcast() {
    if (this.priceUpdateInterval) return;

    this.priceUpdateInterval = setInterval(() => {
      if (this.server) {
        const prices = this.tradingService.getAllSimulatedPrices();
        this.server.emit('price-update', prices);
      }
    }, 5000);
  }

  stopPriceBroadcast() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
    }
  }
}
