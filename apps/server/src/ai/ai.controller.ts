import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsString, IsOptional } from 'class-validator';

class ChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  context?: string;
}

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@CurrentUser() user: any, @Body() dto: ChatDto) {
    return this.aiService.chat(user.sub, dto.message, dto.context);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@CurrentUser() user: any) {
    return this.aiService.getConversationHistory(user.sub);
  }

  @Get('insights')
  @UseGuards(JwtAuthGuard)
  async getInsights(@CurrentUser() user: any) {
    return this.aiService.getMarketInsights(user.sub);
  }
}
