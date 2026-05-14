import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPasswordHash = await bcrypt.hash('Admin@123456', 12);
  const userPasswordHash = await bcrypt.hash('User@123456', 12);
  const demoPasswordHash = await bcrypt.hash('Demo@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nextrade.io' },
    update: {},
    create: {
      email: 'admin@nextrade.io',
      username: 'admin',
      passwordHash: adminPasswordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
      isActive: true,
      wallet: { create: { balance: 0, demoBalance: 100000, availableBalance: 0 } },
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@nextrade.io' },
    update: {},
    create: {
      email: 'demo@nextrade.io',
      username: 'trader_demo',
      passwordHash: demoPasswordHash,
      firstName: 'Demo',
      lastName: 'Trader',
      role: 'USER',
      isEmailVerified: true,
      isActive: true,
      wallet: { create: { balance: 50000, demoBalance: 10000, availableBalance: 45000, totalProfit: 5200, totalLoss: 1800 } },
    },
  });

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@nextrade.io` },
      update: {},
      create: {
        email: `user${i}@nextrade.io`,
        username: `trader_${i}`,
        passwordHash: userPasswordHash,
        firstName: `User`,
        lastName: `${i}`,
        role: 'USER',
        isEmailVerified: i <= 7,
        isActive: i <= 9,
        wallet: {
          create: {
            balance: Math.random() * 20000 + 1000,
            demoBalance: 10000,
            availableBalance: Math.random() * 15000 + 500,
            totalProfit: Math.random() * 5000,
            totalLoss: Math.random() * 2000,
          },
        },
      },
    });
    users.push(user);
  }

  console.log('👥 Users created');

  const assets = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'FOREX', currentPrice: 1.08500, previousPrice: 1.08350, dailyChange: 0.14, dailyHigh: 1.08750, dailyLow: 1.08200, volume: 285400, precision: 5, pipSize: 0.0001 },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'FOREX', currentPrice: 1.26500, previousPrice: 1.26300, dailyChange: 0.16, dailyHigh: 1.26700, dailyLow: 1.26100, volume: 198700, precision: 5, pipSize: 0.0001 },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'FOREX', currentPrice: 154.750, previousPrice: 154.500, dailyChange: 0.16, dailyHigh: 155.000, dailyLow: 154.200, volume: 312500, precision: 3, pipSize: 0.01 },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'FOREX', currentPrice: 0.65200, previousPrice: 0.65350, dailyChange: -0.23, dailyHigh: 0.65500, dailyLow: 0.65100, volume: 145600, precision: 5, pipSize: 0.0001 },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'FOREX', currentPrice: 0.90500, previousPrice: 0.90350, dailyChange: 0.17, dailyHigh: 0.90700, dailyLow: 0.90200, volume: 87400, precision: 5, pipSize: 0.0001 },
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'CRYPTO', currentPrice: 67500.00, previousPrice: 66800.00, dailyChange: 1.05, dailyHigh: 68200.00, dailyLow: 66500.00, volume: 42500, precision: 2, pipSize: 0.01 },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'CRYPTO', currentPrice: 3450.00, previousPrice: 3420.00, dailyChange: 0.88, dailyHigh: 3500.00, dailyLow: 3380.00, volume: 28300, precision: 2, pipSize: 0.01 },
    { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'CRYPTO', currentPrice: 145.50, previousPrice: 142.30, dailyChange: 2.25, dailyHigh: 148.00, dailyLow: 141.00, volume: 15200, precision: 2, pipSize: 0.01 },
    { symbol: 'XRP/USD', name: 'Ripple / US Dollar', category: 'CRYPTO', currentPrice: 0.5280, previousPrice: 0.5310, dailyChange: -0.56, dailyHigh: 0.5350, dailyLow: 0.5250, volume: 9800, precision: 4, pipSize: 0.0001 },
    { symbol: 'GOLD', name: 'Gold', category: 'COMMODITIES', currentPrice: 2345.50, previousPrice: 2338.00, dailyChange: 0.32, dailyHigh: 2350.00, dailyLow: 2332.00, volume: 187000, precision: 2, pipSize: 0.01 },
    { symbol: 'SILVER', name: 'Silver', category: 'COMMODITIES', currentPrice: 27.85, previousPrice: 27.60, dailyChange: 0.91, dailyHigh: 28.10, dailyLow: 27.45, volume: 95000, precision: 2, pipSize: 0.01 },
    { symbol: 'OIL', name: 'Crude Oil WTI', category: 'COMMODITIES', currentPrice: 78.40, previousPrice: 77.90, dailyChange: 0.64, dailyHigh: 79.20, dailyLow: 77.50, volume: 245000, precision: 2, pipSize: 0.01 },
    { symbol: 'AAPL', name: 'Apple Inc.', category: 'STOCKS', currentPrice: 189.50, previousPrice: 188.20, dailyChange: 0.69, dailyHigh: 191.00, dailyLow: 187.50, volume: 56200, precision: 2, pipSize: 0.01 },
    { symbol: 'TSLA', name: 'Tesla Inc.', category: 'STOCKS', currentPrice: 245.30, previousPrice: 248.50, dailyChange: -1.29, dailyHigh: 250.00, dailyLow: 243.00, volume: 78400, precision: 2, pipSize: 0.01 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'STOCKS', currentPrice: 875.60, previousPrice: 860.00, dailyChange: 1.81, dailyHigh: 880.00, dailyLow: 855.00, volume: 42300, precision: 2, pipSize: 0.01 },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { symbol: asset.symbol },
      update: {},
      create: asset as any,
    });
  }

  console.log('📊 Assets created');

  const assetRecords = await prisma.asset.findMany();

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const asset = assetRecords[Math.floor(Math.random() * assetRecords.length)];
    const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const amount = Math.floor(Math.random() * 5000) + 100;
    const entryPrice = Number(asset.currentPrice) * (1 + (Math.random() - 0.5) * 0.01);
    const isClosed = Math.random() > 0.3;
    const profitLoss = isClosed ? (Math.random() - 0.45) * amount * 0.1 : null;
    const exitPrice = isClosed ? entryPrice * (1 + (profitLoss! / (amount * entryPrice))) : null;

    await prisma.trade.create({
      data: {
        userId: user.id,
        assetId: asset.id,
        type: type as any,
        status: isClosed ? 'CLOSED' : 'OPEN',
        amount,
        entryPrice,
        exitPrice,
        profitLoss,
        commission: amount * 0.001,
        stopLoss: entryPrice * (type === 'BUY' ? 0.98 : 1.02),
        takeProfit: entryPrice * (type === 'BUY' ? 1.05 : 0.95),
        isDemo: Math.random() > 0.6,
        duration: Math.floor(Math.random() * 60) + 5,
        closedAt: isClosed ? new Date(Date.now() - Math.random() * 86400000 * 7) : null,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 14),
      },
    });
  }

  console.log('📈 Trades created');

  const notificationTypes = [
    { type: 'TRADE_EXECUTED', title: 'Trade Executed', message: 'Your BUY trade on EUR/USD has been executed at 1.08500' },
    { type: 'TRADE_CLOSED', title: 'Trade Closed', message: 'Your SELL trade on BTC/USD closed with +$245.50 profit' },
    { type: 'DEPOSIT_CONFIRMED', title: 'Deposit Confirmed', message: 'Your deposit of $5,000 has been credited to your account' },
    { type: 'AI_INSIGHT', title: 'AI Market Insight', message: 'BTC/USD showing strong bullish momentum above $67,000' },
    { type: 'SYSTEM', title: 'Platform Update', message: 'New trading features have been added to the platform' },
    { type: 'REFERRAL_BONUS', title: 'Referral Bonus', message: 'You earned $25 from your referral signup bonus' },
    { type: 'SECURITY_ALERT', title: 'Security Alert', message: 'New login detected from Chrome on Windows' },
  ];

  for (const user of [demoUser, ...users]) {
    for (let i = 0; i < 5; i++) {
      const notif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: notif.type as any,
          title: notif.title,
          message: notif.message,
          isRead: Math.random() > 0.6,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 3),
        },
      });
    }
  }

  console.log('🔔 Notifications created');

  for (const user of [demoUser, ...users.slice(0, 5)]) {
    await prisma.transaction.createMany({
      data: [
        { userId: user.id, type: 'DEPOSIT', status: 'COMPLETED', amount: 5000 + Math.random() * 10000, fee: 50, balance: 15000, description: 'Deposit via Credit Card', paymentMethod: 'credit_card', createdAt: new Date(Date.now() - 86400000 * 10) },
        { userId: user.id, type: 'DEPOSIT', status: 'COMPLETED', amount: 2000 + Math.random() * 5000, fee: 25, balance: 20000, description: 'Deposit via Bank Transfer', paymentMethod: 'bank_transfer', createdAt: new Date(Date.now() - 86400000 * 5) },
        { userId: user.id, type: 'WITHDRAWAL', status: 'COMPLETED', amount: 1000 + Math.random() * 3000, fee: 15, balance: 17000, description: 'Withdrawal to Bank Account', walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08', createdAt: new Date(Date.now() - 86400000 * 3) },
      ],
    });
  }

  console.log('💰 Transactions created');

  const referralCodes = ['DEMO4K2X', 'TRADE7P4R', 'NEWT8M3K', 'FXPR2O9W'];
  for (let i = 0; i < 4; i++) {
    await prisma.referral.create({
      data: {
        referrerId: demoUser.id,
        refereeId: users[i].id,
        bonusAmount: 25,
        isBonusPaid: i < 3,
        code: referralCodes[i],
      },
    });
  }

  console.log('🤝 Referrals created');

  await prisma.kYCSubmission.createMany({
    data: [
      { userId: users[0].id, status: 'APPROVED', documentType: 'passport', documentUrl: '/uploads/passport1.jpg', country: 'US', reviewedAt: new Date(), submittedAt: new Date(Date.now() - 86400000 * 5) },
      { userId: users[1].id, status: 'SUBMITTED', documentType: 'drivers_license', documentUrl: '/uploads/license2.jpg', country: 'UK', submittedAt: new Date(Date.now() - 86400000) },
      { userId: users[2].id, status: 'REJECTED', documentType: 'national_id', documentUrl: '/uploads/id3.jpg', country: 'CA', reviewNote: 'Document image unclear', reviewedAt: new Date(), submittedAt: new Date(Date.now() - 86400000 * 3) },
      { userId: users[3].id, status: 'UNDER_REVIEW', documentType: 'passport', documentUrl: '/uploads/passport4.jpg', country: 'AU', submittedAt: new Date(Date.now() - 86400000 * 2) },
    ],
  });

  console.log('📋 KYC submissions created');

  const aiConversations = [
    { role: 'user', content: 'What is the current market trend for EUR/USD?' },
    { role: 'assistant', content: 'EUR/USD is currently trading around 1.08500, showing a modest bullish trend with a 0.14% daily gain. The pair found support near 1.08200 and is testing resistance at 1.08750. Key factors to watch include ECB interest rate decisions and US employment data. Consider waiting for a clear breakout above 1.08750 for long positions. Remember, this is not financial advice.' },
    { role: 'user', content: 'How should I manage risk on my trades?' },
    { role: 'assistant', content: 'Essential risk management principles: 1) Never risk more than 1-2% of your total capital per trade. 2) Always set stop-losses before entering. 3) Maintain a risk-reward ratio of at least 1:2. 4) Diversify across different asset classes. 5) Avoid emotional trading - stick to your plan. 6) Use position sizing calculators. 7) Review your trades regularly to identify patterns.' },
  ];

  for (const msg of aiConversations) {
    await prisma.aIConversation.create({
      data: {
        userId: demoUser.id,
        role: msg.role,
        content: msg.content,
        tokens: msg.content.length,
      },
    });
  }

  console.log('🤖 AI conversations created');

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.platformStats.upsert({
      where: { date },
      update: {},
      create: {
        totalUsers: 11 + Math.floor(Math.random() * 3),
        activeUsers: 7 + Math.floor(Math.random() * 4),
        totalTrades: Math.floor(Math.random() * 50) + 20,
        totalVolume: Math.random() * 500000 + 100000,
        totalRevenue: Math.random() * 5000 + 1000,
        totalDeposits: Math.random() * 50000 + 10000,
        totalWithdrawals: Math.random() * 20000 + 5000,
        date,
      },
    });
  }

  console.log('📊 Platform stats created');
  console.log('✅ Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
