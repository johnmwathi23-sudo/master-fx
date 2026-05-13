import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const apiKey = this.config.get('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'sk-your-openai-api-key-here') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async chat(userId: string, message: string, context?: string) {
    const recentHistory = await this.prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const systemPrompt = `You are NexTrade AI, an intelligent trading assistant for the NexTrade platform. 
You help users with:
- Market analysis and trading insights
- Risk management advice
- Platform navigation and features
- Trading education for beginners
- Portfolio analysis
- Technical and fundamental analysis explanations

Be concise, professional, and helpful. Always remind users that this is not financial advice.
${context ? `\nAdditional context: ${context}` : ''}`;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.reverse().map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    await this.prisma.aIConversation.create({
      data: { userId, role: 'user', content: message, tokens: message.length },
    });

    let assistantResponse: string;

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: this.config.get('OPENAI_MODEL', 'gpt-4o'),
          messages,
          max_tokens: parseInt(this.config.get('OPENAI_MAX_TOKENS', '1024')),
          temperature: 0.7,
        });

        assistantResponse = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
      } catch {
        assistantResponse = this.getFallbackResponse(message);
      }
    } else {
      assistantResponse = this.getFallbackResponse(message);
    }

    await this.prisma.aIConversation.create({
      data: { userId, role: 'assistant', content: assistantResponse, tokens: assistantResponse.length },
    });

    return { message: assistantResponse, timestamp: new Date().toISOString() };
  }

  async getConversationHistory(userId: string) {
    return this.prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  async getMarketInsights(userId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { isActive: true },
      take: 10,
      orderBy: { volume: 'desc' },
    });

    const insights = assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      currentPrice: Number(asset.currentPrice),
      dailyChange: Number(asset.dailyChange),
      sentiment: this.analyzeSentiment(Number(asset.dailyChange)),
      recommendation: this.getRecommendation(Number(asset.dailyChange), asset.category),
    }));

    return insights;
  }

  private analyzeSentiment(dailyChange: number): 'bullish' | 'bearish' | 'neutral' {
    if (dailyChange > 0.5) return 'bullish';
    if (dailyChange < -0.5) return 'bearish';
    return 'neutral';
  }

  private getRecommendation(dailyChange: number, category: string): string {
    if (dailyChange > 1) return 'Strong upward momentum. Consider taking profits on existing positions.';
    if (dailyChange > 0.3) return 'Moderate upward trend. Watch for continuation patterns.';
    if (dailyChange > -0.3) return 'Sideways movement. Wait for a clear breakout direction.';
    if (dailyChange > -1) return 'Downward pressure. Consider stop-loss adjustments.';
    return 'Strong selling pressure. Exercise caution and manage risk.';
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m NexTrade AI, your trading assistant. I can help you with market analysis, trading strategies, risk management, and platform features. What would you like to know?';
    }
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('trend')) {
      return 'Based on current market conditions, major forex pairs are showing moderate volatility. EUR/USD is consolidating near key support levels, while GBP/USD shows bullish momentum. Crypto markets are experiencing a relief rally. Remember: this is analysis, not financial advice.';
    }
    if (lowerMessage.includes('risk') || lowerMessage.includes('stop loss') || lowerMessage.includes('manage')) {
      return 'Key risk management principles: 1) Never risk more than 2% of your capital per trade. 2) Always set stop-losses. 3) Maintain a risk-reward ratio of at least 1:2. 4) Diversify across asset classes. 5) Avoid overleveraging your positions.';
    }
    if (lowerMessage.includes('deposit') || lowerMessage.includes('withdraw') || lowerMessage.includes('wallet')) {
      return 'To manage your wallet: Go to Dashboard > Wallet. You can deposit funds using various payment methods (processing fee: 1%). Withdrawals are processed within 24-48 hours with a 0.5% fee (minimum $5). Your demo account starts with $10,000 virtual funds.';
    }
    if (lowerMessage.includes('trade') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
      return 'To place a trade: 1) Select an asset from the Markets page. 2) Choose BUY or SELL direction. 3) Enter your trade amount. 4) Optionally set Stop Loss and Take Profit levels. 5) Confirm the trade. Your profit/loss is calculated based on the price difference between entry and exit.';
    }
    if (lowerMessage.includes('referral') || lowerMessage.includes('refer') || lowerMessage.includes('invite')) {
      return 'Our referral program rewards you for inviting new traders. Share your unique referral code, and when your referral makes their first deposit, you\'ll both receive a bonus. Go to Dashboard > Referrals to find your code and track your referrals.';
    }
    return 'I\'m here to help with your trading journey! You can ask me about market analysis, trading strategies, risk management, platform features, or account management. What specific topic interests you?';
  }
}
