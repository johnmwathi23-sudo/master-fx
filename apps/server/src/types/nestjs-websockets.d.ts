declare module '@nestjs/websockets' {
  import { MiddlewareConsumer } from '@nestjs/common';
  
  export interface OnGatewayInit {
    afterInit(server: any): void;
  }
  export interface OnGatewayConnection {
    handleConnection(client: any, ...args: any[]): void;
  }
  export interface OnGatewayDisconnect {
    handleDisconnect(client: any): void;
  }
  
  export function WebSocketGateway(options?: any): ClassDecorator;
  export function WebSocketServer(): PropertyDecorator;
  export function SubscribeMessage(message: string): MethodDecorator;
  export function ConnectedSocket(): ParameterDecorator;
  export function MessageBody(): ParameterDecorator;
  export function WsException(type?: string): any;
  export function GatewayMiddleware(): any;
  
  export class WsResponse<T = any> {
    event: string;
    data: T;
  }
}
