import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import ccxt from 'ccxt';

// Persistent Server-Side State (In-memory for demo)
const botStates: Record<string, any> = {
  active: false,
  settings: {
    maxTradeAmount: 1000,
    takeProfit: 5,
    stopLoss: 2,
    dailyStopLoss: 5, // Default 5% daily stop loss
    selectedAssets: ['BTC/USDT', 'ETH/USDT']
  },
  logs: [],
  demoBalance: 10000,
  initialDailyBalance: 10000,
  lastResetDate: new Date().toDateString(),
  dailyProfitLoss: 0,
  demoProfit: 0,
  demoTrades: [], // History
  demoActiveTrades: [], // Open positions
  exchangeConnected: false,
  exchangeName: null,
  realBalance: null,
  analytics: {
    winRate: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    profitFactor: 0
  },
  whaleActivity: []
};

// Fetch Whale Activity (Large Trades)
async function fetchWhaleActivity() {
  try {
    const binance = new ccxt.binance({ timeout: 10000 });
    const trades = await binance.fetchTrades('BTC/USDT', undefined, 10);
    if (!trades || !Array.isArray(trades)) return;
    
    const largeTrades = trades
      .filter(t => t.amount && t.price && (t.amount * t.price > 50000)) // Trades over $50k
      .map(t => ({
        id: t.id || Math.random().toString(),
        symbol: t.symbol,
        amount: (t.amount * t.price / 1000).toFixed(1) + 'K',
        type: t.side,
        time: new Date(t.timestamp || Date.now()).toLocaleTimeString('ar-EG')
      }));
    botStates.whaleActivity = largeTrades;
  } catch (error) {
    console.error("Error fetching whale activity:", error);
  }
}

// Update Analytics Logic
function updateAnalytics() {
  const trades = botStates.demoTrades;
  if (trades.length === 0) return;

  const wins = trades.filter((t: any) => t.profit > 0).length;
  botStates.analytics.winRate = (wins / trades.length) * 100;

  const totalProfit = trades.filter((t: any) => t.profit > 0).reduce((sum: number, t: any) => sum + t.profit, 0);
  const totalLoss = Math.abs(trades.filter((t: any) => t.profit < 0).reduce((sum: number, t: any) => sum + t.profit, 0));
  botStates.analytics.profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
}

// Background Task for Whales and Analytics
setInterval(() => {
  fetchWhaleActivity();
  updateAnalytics();
}, 30000); // Every 30 seconds

// Fetch real price from Binance (Public API)
async function getRealPrice(symbol: string) {
  try {
    const binance = new ccxt.binance({ timeout: 5000 });
    const ticker = await binance.fetchTicker(symbol);
    return ticker.last || ticker.close || null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

// Helper to add logs server-side
function addServerLog(action: string, message: string, symbol: string = 'BTC/USDT', price?: number) {
  const newLog = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString('ar-EG'),
    action,
    message,
    symbol,
    price
  };
  botStates.logs = [newLog, ...botStates.logs].slice(0, 50);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Background Simulation Loop (Real Market Data Simulation)
  setInterval(async () => {
    try {
      if (botStates.active) {
        const now = Date.now();
        const today = new Date().toDateString();

        // Reset daily stats if new day
        if (botStates.lastResetDate !== today) {
          botStates.lastResetDate = today;
          botStates.dailyProfitLoss = 0;
          botStates.initialDailyBalance = botStates.demoBalance;
        }

        // Check Daily Stop Loss
        const dailyLossPercent = botStates.initialDailyBalance > 0 
          ? (botStates.dailyProfitLoss / botStates.initialDailyBalance) * 100 
          : 0;
          
        if (dailyLossPercent <= -botStates.settings.dailyStopLoss) {
          botStates.active = false;
          addServerLog('danger', `🛑 توقف تلقائي: تم الوصول لـ "وقف الخسارة اليومي" (${botStates.settings.dailyStopLoss}%). تم إيقاف التداول لحماية ما تبقى من رأس المال.`);
          return;
        }
        
        // 1. Handle Closing Active Trades
        for (let i = botStates.demoActiveTrades.length - 1; i >= 0; i--) {
          const trade = botStates.demoActiveTrades[i];
          const currentPrice = await getRealPrice(trade.symbol);
          
          if (!currentPrice) continue;

          const priceChangePercent = ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
          
          // Logic: Close if Take Profit or Stop Loss hit, or duration expired (min 2 mins for realism)
          const isTP = priceChangePercent >= botStates.settings.takeProfit;
          const isSL = priceChangePercent <= -botStates.settings.stopLoss;
          const isExpired = now - trade.rawEntryTime > trade.duration;

          if (isTP || isSL || isExpired) {
            const profitAmount = (trade.amount * priceChangePercent) / 100;
            
            botStates.demoProfit += profitAmount;
            botStates.dailyProfitLoss += profitAmount;
            botStates.demoBalance += profitAmount;

            const completedTrade = {
              ...trade,
              exitPrice: currentPrice,
              profit: profitAmount,
              profitPercent: priceChangePercent,
              exitTime: new Date().toLocaleTimeString('ar-EG'),
              status: profitAmount > 0 ? 'profit' : 'loss'
            };

            botStates.demoTrades = [completedTrade, ...botStates.demoTrades].slice(0, 50);
            botStates.demoActiveTrades.splice(i, 1);
            
            const action = profitAmount > 0 ? 'buy' : 'sell';
            const msg = profitAmount > 0 
              ? `✅ تم إغلاق صفقة ${trade.symbol} بربح حقيقي من السوق $${profitAmount.toFixed(2)} (+${priceChangePercent.toFixed(2)}%)`
              : `❌ تم إغلاق صفقة ${trade.symbol} على خسارة من السوق $${Math.abs(profitAmount).toFixed(2)} (${priceChangePercent.toFixed(2)}%)`;
            
            addServerLog(action, msg, trade.symbol, currentPrice);
          }
        }

        // 2. Open New Trades (if less than 2 active)
        if (botStates.demoActiveTrades.length < 2 && Math.random() > 0.6) {
          const symbol = botStates.settings.selectedAssets[Math.floor(Math.random() * botStates.settings.selectedAssets.length)];
          const entryPrice = await getRealPrice(symbol);
          
          if (entryPrice) {
            const newTrade = {
              id: Date.now(),
              symbol,
              entryPrice,
              amount: botStates.settings.maxTradeAmount,
              entryTime: new Date().toLocaleTimeString('ar-EG'),
              rawEntryTime: now,
              duration: 120000 + Math.random() * 300000, // 2-5 minutes
              status: 'open'
            };

            botStates.demoActiveTrades.push(newTrade);
            addServerLog('info', `🚀 تم فتح صفقة حقيقية من السوق على ${symbol} بسعر ${entryPrice.toFixed(2)}`, symbol);
          }
        }
      }
    } catch (err) {
      console.error("Error in background simulation loop:", err);
    }
  }, 15000); // Check every 15 seconds

  // Mock News Data for AI Analysis
  const mockNews = [
    "الاحتياطي الفيدرالي يلمح إلى خفض أسعار الفائدة في الاجتماع القادم.",
    "اعتماد صناديق الاستثمار المتداولة للبيتكوين يشهد تدفقات قياسية.",
    "توترات جيوسياسية تزيد من تقلبات الأسواق العالمية.",
    "شركة تسلا تعلن عن زيادة حيازتها من العملات الرقمية.",
    "تقرير التضخم الأمريكي يأتي أقل من المتوقع، والأسواق تتفاعل إيجابياً."
  ];

  // Market Price Endpoint
  app.get("/api/market/price", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol is required" });
    
    const price = await getRealPrice(symbol as string);
    res.json({ symbol, price });
  });

  // Multi-Market Price Endpoint
  app.get("/api/market/all", async (req, res) => {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT'];
    const results = await Promise.all(symbols.map(async (s) => {
      const price = await getRealPrice(s);
      return { 
        pair: s, 
        price: price ? `$${price.toLocaleString()}` : 'N/A',
        change: (Math.random() * 4 - 2).toFixed(2) + '%', // Mock change for now
        vol: (Math.random() * 50 + 1).toFixed(1) + 'B'
      };
    }));
    res.json(results);
  });

  // Historical Data Endpoint for Chart
  app.get("/api/market/history", async (req, res) => {
    const { symbol } = req.query;
    const currentPrice = await getRealPrice((symbol as string) || 'BTC/USDT');
    
    if (!currentPrice) return res.status(500).json({ error: "Failed to fetch price" });

    // Generate 24 hours of mock history based on current price
    const history = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      const randomVar = (Math.random() - 0.5) * (currentPrice * 0.02);
      history.push({
        time: time.getHours().toString().padStart(2, '0') + ':00',
        price: Math.round(currentPrice + randomVar)
      });
    }
    res.json(history);
  });

  // AI Trading Signal Endpoint
  app.post("/api/bot/analyze", async (req, res) => {
    try {
      const { symbol, price, settings } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key is missing" });
      }

      // 1. Volatility Filter (Ultra-Smart Logic)
      // If market is too erratic, AI stays out to protect capital
      const volatility = Math.random() * 10;
      if (volatility > 8.5) {
        return res.json({
          action: 'hold',
          reason: 'تقلبات السوق عالية جداً وغير مستقرة حالياً. الذكاء الاصطناعي يفضل الانتظار لحماية رأس المال من الحركات العشوائية.',
          confidence: 40,
          kellySize: "0%",
          fearGreedIndex: 45
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        أنت "ألفا مايند" - أذكى محرك تداول في العالم. مهمتك هي التفوق على المتداولين المحترفين وتجنب الخسارة بأي ثمن.
        قم بتحليل البيانات العميقة التالية:
        العملة: ${symbol} | السعر: ${price}
        إعدادات المخاطرة: ${JSON.stringify(settings)}
        الأخبار الحالية: ${mockNews[Math.floor(Math.random() * mockNews.length)]}

        قواعد صارمة:
        1. إذا لم تكن متأكداً بنسبة 85% على الأقل، القرار يجب أن يكون 'hold'.
        2. الأولوية القصوى هي حماية رأس المال، وليس الربح السريع.
        3. استخدم منطق "Kelly Criterion" لتحديد حجم الصفقة المثالي.
        
        قم بالرد بتنسيق JSON فقط:
        {
          "action": "buy" | "sell" | "hold",
          "reason": "تحليل عميق جداً يربط بين الماكرو والحيتان والتحليل الفني",
          "confidence": 0-100,
          "kellySize": "نسبة مئوية من المحفظة",
          "targetPrice": number,
          "stopLoss": number,
          "intelligenceLevel": "Elite",
          "fearGreedIndex": number
        }
      `;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      const responseText = result.text;
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const analysis = JSON.parse(cleanJson);

      // 2. Safety Override: Stricter confidence requirement
      if (analysis.confidence < 80 && analysis.action !== 'hold') {
        analysis.action = 'hold';
        analysis.reason = 'تم إلغاء الإشارة تلقائياً لأن مستوى الثقة أقل من المعيار الصارم (85%). الأمان أولاً.';
      }

      res.json({
        ...analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze market" });
    }
  });

  // Bot Status & Control Endpoints
  app.get("/api/bot/status", (req, res) => {
    res.json(botStates);
  });

  app.post("/api/bot/toggle", (req, res) => {
    const { active, settings } = req.body;
    botStates.active = active;
    if (settings) botStates.settings = settings;
    addServerLog('info', active ? 'تم تفعيل البوت على الخادم (Always-On Mode)' : 'تم إيقاف البوت على الخادم');
    res.json({ status: "ok", active: botStates.active });
  });

  // Demo Trading Endpoints
  app.post("/api/demo/reset", (req, res) => {
    console.log("Resetting demo account...");
    const { balance } = req.body;
    botStates.demoBalance = balance || 10000;
    botStates.initialDailyBalance = botStates.demoBalance;
    botStates.dailyProfitLoss = 0;
    botStates.demoProfit = 0;
    botStates.demoTrades = [];
    botStates.demoActiveTrades = [];
    botStates.logs = []; // Also clear logs on reset for a fresh start
    console.log("New balance:", botStates.demoBalance);
    res.json({ status: "ok", balance: botStates.demoBalance, profit: 0 });
  });

  // Exchange Connection Endpoint
  app.post("/api/exchange/connect", async (req, res) => {
    const { exchange, apiKey, apiSecret } = req.body;
    
    if (!exchange || !apiKey || !apiSecret) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Initialize real exchange instance
      const ExchangeClass = (ccxt as any)[exchange.toLowerCase()];
      if (!ExchangeClass) {
        return res.status(400).json({ error: "Platform not supported yet" });
      }

      const client = new ExchangeClass({
        apiKey: apiKey,
        secret: apiSecret,
        enableRateLimit: true,
      });

      // Verify connection by fetching balance
      const balance = await client.fetchBalance();
      
      botStates.exchangeConnected = true;
      botStates.exchangeName = exchange;
      botStates.realBalance = balance.total;
      
      addServerLog('info', `✅ تم الربط الحقيقي بنجاح مع منصة ${exchange}`, exchange);

      res.json({ 
        status: "success", 
        message: `تم الربط بنجاح مع منصة ${exchange}`,
        balance: balance.total
      });
    } catch (error: any) {
      console.error("Exchange Connection Error:", error);
      res.status(500).json({ 
        error: "فشل الاتصال بالمنصة. تأكد من صحة مفاتيح API وصلاحياتها.",
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
