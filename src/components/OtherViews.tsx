import React from 'react';
import { History, Bell, Settings, Shield, User, CreditCard, Lock, Globe, Moon, TrendingUp, Cpu, Zap, BarChart3, PieChart, Play, Square, Power, Target, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils';

export const AnalyticsView = () => {
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/bot/status');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-12 text-center text-brand-text-muted">جاري تحميل التحليلات العميقة...</div>;

  const stats = [
    { label: 'معدل الفوز (Win Rate)', value: `${analytics?.winRate?.toFixed(1)}%`, icon: Target, color: 'text-brand-success' },
    { label: 'عامل الربح (Profit Factor)', value: analytics?.profitFactor?.toFixed(2), icon: Activity, color: 'text-brand-accent' },
    { label: 'أقصى تراجع (Max Drawdown)', value: `${analytics?.maxDrawdown?.toFixed(1)}%`, icon: ArrowDownRight, color: 'text-brand-danger' },
    { label: 'نسبة شارب (Sharpe Ratio)', value: analytics?.sharpeRatio?.toFixed(2), icon: ArrowUpRight, color: 'text-brand-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
          <BarChart3 size={20} />
        </div>
        <h2 className="text-xl font-bold">تحليلات الأداء العميقة</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
            <div className="flex items-center gap-3 mb-3 flex-row-reverse">
              <stat.icon size={18} className={stat.color} />
              <span className="text-xs font-bold text-brand-text-muted uppercase">{stat.label}</span>
            </div>
            <h4 className="text-2xl font-bold font-mono">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
          <h3 className="text-lg font-bold mb-6">منحنى نمو رأس المال (Equity Curve)</h3>
          <div className="h-64 flex items-end gap-1 border-b border-l border-brand-border p-4">
            {[40, 45, 42, 50, 55, 52, 60, 65, 62, 70, 75, 80, 78, 85, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-brand-accent/20 hover:bg-brand-accent transition-all rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="text-[10px] text-brand-text-muted mt-4 text-center">يمثل هذا الرسم البياني نمو المحفظة الافتراضي بناءً على آخر 15 صفقة</p>
        </div>
        <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
          <h3 className="text-lg font-bold mb-6">توزيع الأرباح حسب الأصل</h3>
          <div className="space-y-4">
            {[
              { asset: 'BTC', profit: 65, color: 'bg-orange-500' },
              { asset: 'ETH', profit: 25, color: 'bg-blue-500' },
              { asset: 'SOL', profit: 10, color: 'bg-purple-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs flex-row-reverse">
                  <span className="font-bold">{item.asset}</span>
                  <span className="text-brand-text-muted">{item.profit}%</span>
                </div>
                <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: `${item.profit}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarketsView = () => {
  const [markets, setMarkets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchMarkets = async () => {
    try {
      const response = await fetch('/api/market/all');
      const data = await response.json();
      setMarkets(data);
    } catch (error) {
      console.error('Failed to fetch markets:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-xl font-bold">الأسواق المباشرة</h2>
      </div>

      {loading ? (
        <div className="p-12 text-center text-brand-text-muted text-xs">جاري جلب أسعار السوق المباشرة...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map((m, i) => (
            <div key={i} className="bg-brand-surface border border-brand-border p-5 rounded-2xl text-right">
              <p className="text-xs text-brand-text-muted font-bold mb-1">{m.pair}</p>
              <h4 className="text-xl font-bold font-mono mb-2">{m.price}</h4>
              <div className="flex justify-between items-center flex-row-reverse">
                <span className={cn("text-xs font-bold", m.change.startsWith('+') ? "text-brand-success" : "text-brand-danger")}>
                  {m.change}
                </span>
                <span className="text-[10px] text-brand-text-muted">حجم التداول: {m.vol}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AIAnalysisView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
          <Cpu size={20} />
        </div>
        <h2 className="text-xl font-bold">مركز تحليل الذكاء الاصطناعي</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
          <h3 className="text-lg font-bold mb-4">توقعات الاتجاه القادم</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-brand-border rounded-xl">
            <p className="text-brand-text-muted">جاري معالجة البيانات الضخمة...</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl text-right">
            <div className="flex items-center gap-3 mb-3 flex-row-reverse">
              <Zap size={18} className="text-yellow-500" />
              <h4 className="text-sm font-bold">قوة الإشارة</h4>
            </div>
            <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-brand-accent" />
            </div>
            <p className="text-[10px] text-brand-text-muted mt-2">قوة إشارة الشراء: 85%</p>
          </div>
          <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl text-right">
            <div className="flex items-center gap-3 mb-3 flex-row-reverse">
              <BarChart3 size={18} className="text-blue-500" />
              <h4 className="text-sm font-bold">الارتباط الماكرو</h4>
            </div>
            <p className="text-xs text-brand-text-muted">ارتباط قوي مع مؤشر DXY (سلبي) والذهب (إيجابي).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HistoryView = () => {
  const trades = [
    { id: 1, pair: 'BTC/USDT', type: 'شراء', amount: '0.05', price: '$64,200', time: '10:45 AM', status: 'مكتمل' },
    { id: 2, pair: 'ETH/USDT', type: 'بيع', amount: '1.2', price: '$3,450', time: '09:30 AM', status: 'مكتمل' },
    { id: 3, pair: 'SOL/USDT', type: 'شراء', amount: '15', price: '$145', time: 'أمس', status: 'مكتمل' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
          <History size={20} />
        </div>
        <h2 className="text-xl font-bold">سجل التداولات</h2>
      </div>
      
      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-white/5 border-b border-brand-border">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الزوج</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">النوع</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الكمية</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">السعر</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الوقت</th>
              <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{trade.pair}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold",
                    trade.type === 'شراء' ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"
                  )}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono">{trade.amount}</td>
                <td className="px-6 py-4 text-sm font-mono">{trade.price}</td>
                <td className="px-6 py-4 text-sm text-brand-text-muted">{trade.time}</td>
                <td className="px-6 py-4 text-sm text-brand-success">{trade.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AlertsView = () => {
  const [btcPrice, setBtcPrice] = React.useState<string>('$71,140');

  React.useEffect(() => {
    const fetchBtc = async () => {
      try {
        const response = await fetch('/api/market/price?symbol=BTC/USDT');
        const data = await response.json();
        if (data.price) setBtcPrice(`$${data.price.toLocaleString()}`);
      } catch (e) {}
    };
    fetchBtc();
  }, []);

  const alerts = [
    { id: 1, title: 'تنبيه سعر BTC', message: `وصل سعر البيتكوين إلى السعر الحالي: ${btcPrice}`, time: 'الآن', type: 'price' },
    { id: 2, title: 'نشاط حيتان', message: 'تم رصد تحويل 5,000 BTC من محفظة مجهولة إلى Binance', time: 'منذ ساعة', type: 'whale' },
    { id: 3, title: 'تحديث النظام', message: 'تم تحديث محرك Alpha Mind إلى النسخة 2.1', time: 'منذ يومين', type: 'system' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
          <Bell size={20} />
        </div>
        <h2 className="text-xl font-bold">التنبيهات</h2>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex items-start gap-4 flex-row-reverse">
            <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-xl">
              <Bell size={18} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex justify-between items-center mb-1 flex-row-reverse">
                <h4 className="text-sm font-bold">{alert.title}</h4>
                <span className="text-[10px] text-brand-text-muted">{alert.time}</span>
              </div>
              <p className="text-xs text-brand-text-muted">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DemoTradingView = () => {
  const [balance, setBalance] = React.useState(10000);
  const [profit, setProfit] = React.useState(0);
  const [trades, setTrades] = React.useState<any[]>([]);
  const [activeTrades, setActiveTrades] = React.useState<any[]>([]);
  const [isResetting, setIsResetting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [botActive, setBotActive] = React.useState(false);
  const [isToggling, setIsToggling] = React.useState(false);

  const fetchDemoData = async () => {
    try {
      const response = await fetch('/api/bot/status');
      const data = await response.json();
      setBalance(data.demoBalance);
      setProfit(data.demoProfit || 0);
      setTrades(data.demoTrades);
      setActiveTrades(data.demoActiveTrades || []);
      setBotActive(data.active);
    } catch (error) {
      console.error('Failed to fetch demo data:', error);
    }
  };

  React.useEffect(() => {
    fetchDemoData();
    const interval = setInterval(fetchDemoData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleBot = async () => {
    setIsToggling(true);
    const newState = !botActive;
    try {
      const response = await fetch('/api/bot/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newState })
      });
      const data = await response.json();
      setBotActive(data.active);
    } catch (error) {
      console.error('Failed to toggle bot:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/demo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: 10000 })
      });
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchDemoData();
      }
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
            <PieChart size={20} />
          </div>
          <h2 className="text-xl font-bold">التداول التجريبي (Demo)</h2>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="text-xs text-brand-success font-bold animate-pulse">تم التصفير بنجاح!</span>
          )}
          
          <button 
            onClick={toggleBot}
            disabled={isToggling}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all flex-row-reverse",
              botActive 
                ? "bg-brand-danger/10 text-brand-danger hover:bg-brand-danger/20" 
                : "bg-brand-success/10 text-brand-success hover:bg-brand-success/20"
            )}
          >
            {botActive ? <Square size={16} /> : <Play size={16} />}
            {botActive ? 'إيقاف التداول' : 'بدء التداول التجريبي'}
          </button>

          <button 
            onClick={handleReset}
            disabled={isResetting}
            className="px-4 py-2 bg-white/5 text-brand-text-muted rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
          >
            {isResetting ? 'جاري التصفير...' : 'تصفير الحساب'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
          <p className="text-xs text-brand-text-muted font-bold mb-1 uppercase">الرصيد الوهمي</p>
          <h4 className="text-2xl font-bold font-mono text-brand-accent">${balance.toLocaleString()}</h4>
        </div>
        <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
          <p className="text-xs text-brand-text-muted font-bold mb-1 uppercase">الأرباح المحققة</p>
          <h4 className={cn(
            "text-2xl font-bold font-mono",
            profit >= 0 ? "text-brand-success" : "text-brand-danger"
          )}>
            {profit >= 0 ? '+' : ''}${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
        </div>
        <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
          <p className="text-xs text-brand-text-muted font-bold mb-1 uppercase">نسبة النجاح</p>
          <h4 className="text-2xl font-bold font-mono">
            {trades.length > 0 
              ? Math.round((trades.filter(t => t.status === 'profit').length / trades.length) * 100)
              : 0}%
          </h4>
        </div>
      </div>

      {/* Active Trades Section */}
      {botActive && activeTrades.length > 0 && (
        <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden border-brand-accent/30">
          <div className="p-4 border-b border-brand-border bg-brand-accent/5 flex items-center justify-between flex-row-reverse">
            <h3 className="text-sm font-bold text-brand-accent">الصفقات المفتوحة حالياً (Live)</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-ping"></span>
              <span className="text-[10px] text-brand-accent font-bold uppercase">مباشر</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-white/5 border-b border-brand-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الرمز</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">سعر الدخول</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">المبلغ</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">وقت البدء</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {activeTrades.map((trade) => (
                  <tr key={trade.id} className="bg-brand-accent/5">
                    <td className="px-6 py-4 text-sm font-medium">{trade.symbol}</td>
                    <td className="px-6 py-4 text-sm font-mono">${trade.entryPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-mono">${trade.amount}</td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">{trade.entryTime}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-brand-accent font-bold animate-pulse">جاري التداول...</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-brand-border bg-white/5 text-right">
          <h3 className="text-sm font-bold">سجل الصفقات التجريبية المكتملة</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-white/5 border-b border-brand-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الرمز</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">سعر الدخول</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">سعر الإغلاق</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">الربح/الخسارة</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">وقت الدخول</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-text-muted uppercase">وقت الإغلاق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    {botActive && activeTrades.length === 0 ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-brand-accent font-bold text-sm animate-pulse">جاري البحث عن صفقات مربحة حالياً...</p>
                        <p className="text-xs text-brand-text-muted">يتم تحليل تدفقات السيولة وتحركات الحيتان في الوقت الفعلي</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Power size={32} className="text-brand-text-muted opacity-20 mb-2" />
                        <p className="text-brand-text-muted text-sm">لا توجد صفقات مكتملة حالياً.</p>
                        <p className="text-xs text-brand-text-muted">قم بتفعيل البوت لبدء المحاكاة والبحث عن فرص</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{trade.symbol}</td>
                    <td className="px-6 py-4 text-sm font-mono">${trade.entryPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-mono">${trade.exitPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={cn(
                        "font-bold",
                        trade.status === 'profit' ? "text-brand-success" : "text-brand-danger"
                      )}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)} ({trade.profitPercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">{trade.entryTime}</td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted">{trade.exitTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SettingsView = ({ isLinked, onUnlink, onNavigate }: { isLinked: boolean, onUnlink: () => void, onNavigate: (view: string) => void }) => {
  const sections = [
    { icon: User, label: 'الملف الشخصي', desc: 'إدارة معلوماتك الشخصية وحسابك' },
    { icon: Shield, label: 'الأمان', desc: 'كلمة المرور، التحقق بخطوتين، وجلسات النشاط' },
    { icon: CreditCard, label: 'الاشتراك', desc: 'خطة برو، طرق الدفع، والفواتير' },
    { icon: Globe, label: 'اللغة والمنطقة', desc: 'تغيير لغة الواجهة والتوقيت المحلي' },
    { icon: Moon, label: 'المظهر', desc: 'الوضع الداكن، الوضع الفاتح، وتخصيص الألوان' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg">
          <Settings size={20} />
        </div>
        <h2 className="text-xl font-bold">الإعدادات</h2>
      </div>

      {/* Exchange Connection Status */}
      <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl text-right">
        <div className="flex items-center justify-between flex-row-reverse mb-4">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className={cn(
              "p-2 rounded-lg",
              isLinked ? "bg-brand-success/10 text-brand-success" : "bg-brand-accent/10 text-brand-accent"
            )}>
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold">اتصال المنصة</h3>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            isLinked ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"
          )}>
            {isLinked ? 'متصل' : 'غير متصل'}
          </span>
        </div>
        
        <p className="text-sm text-brand-text-muted mb-6">
          {isLinked 
            ? 'حسابك مرتبط حالياً بمنصة Bybit. يتم مزامنة البيانات والصفقات تلقائياً.' 
            : 'لم يتم ربط أي منصة تداول بعد. قم بربط حسابك لتفعيل التداول الآلي.'}
        </p>

        <div className="flex gap-3 flex-row-reverse">
          <button 
            onClick={() => onNavigate('المحفظة')}
            className="px-6 py-2 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent/90 transition-all"
          >
            {isLinked ? 'إدارة الاتصال' : 'ربط منصة الآن'}
          </button>
          {isLinked && (
            <button 
              onClick={onUnlink}
              className="px-6 py-2 border border-brand-danger/30 text-brand-danger rounded-lg text-sm font-bold hover:bg-brand-danger/5 transition-all"
            >
              إلغاء الربط
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <div key={i} className="bg-brand-surface border border-brand-border p-5 rounded-2xl hover:border-brand-accent/50 transition-all cursor-pointer group text-right">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="p-3 bg-white/5 text-brand-text-muted group-hover:text-brand-accent group-hover:bg-brand-accent/10 rounded-xl transition-all">
                <section.icon size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-1">{section.label}</h4>
                <p className="text-xs text-brand-text-muted">{section.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
