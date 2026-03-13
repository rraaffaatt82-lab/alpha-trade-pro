import React from 'react';
import { Anchor, Globe, Zap, ShieldAlert, BarChart3 } from 'lucide-react';
import { cn } from '../utils';
import { motion } from 'motion/react';

export const WhaleTracker = ({ data }: { data?: any[] }) => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Anchor size={16} className="text-brand-accent" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">متتبع الحيتان (On-Chain)</h3>
    </div>
    <div className="space-y-3">
      {(data && data.length > 0 ? data : [
        { type: 'خروج من منصة', amount: '2,500 BTC', from: 'Binance', impact: 'Bullish', color: 'text-brand-success' },
        { type: 'تحويل ضخم', amount: '50,000 ETH', from: 'Unknown', impact: 'Bearish', color: 'text-brand-danger' },
      ]).map((item: any, i: number) => (
        <div key={i} className="p-3 rounded-xl bg-white/5 border border-brand-border/50 flex justify-between items-center flex-row-reverse">
          <div className="text-right">
            <p className="text-xs font-bold">{item.amount}</p>
            <p className="text-[10px] text-brand-text-muted">{item.symbol || 'BTC/USDT'}</p>
          </div>
          <div className="text-left">
            <p className={cn("text-[10px] font-bold uppercase", 
              item.type === 'buy' ? 'text-brand-success' : 'text-brand-danger'
            )}>{item.type === 'buy' ? 'Bullish' : 'Bearish'}</p>
            <p className="text-[10px] text-brand-text-muted">{item.time || 'الآن'}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MacroCorrelation = ({ data }: { data?: any }) => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Globe size={16} className="text-brand-accent" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">الارتباط بالأسواق العالمية</h3>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: 'DXY', value: data?.dxy || '103.4', change: '-0.2%', status: 'Bullish' },
        { label: 'S&P 500', value: data?.sp500 || '5,123', change: '+0.4%', status: 'Bullish' },
        { label: 'Gold', value: data?.gold || '$2,150', change: '+0.1%', status: 'Neutral' },
      ].map((item, i) => (
        <div key={i} className="p-2 rounded-lg bg-white/5 border border-brand-border text-center">
          <p className="text-[10px] text-brand-text-muted font-bold">{item.label}</p>
          <p className="text-xs font-bold my-1">{item.value}</p>
          <p className={cn("text-[9px] font-bold", item.change.startsWith('+') ? 'text-brand-success' : 'text-brand-danger')}>
            {item.change}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export const IntelligenceStatus = ({ confidence = 85, kelly = "12%", isAnalyzing = false }: { confidence?: number, kelly?: string, isAnalyzing?: boolean }) => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 bg-gradient-to-br from-brand-accent/5 to-transparent">
    <div className="flex items-center gap-2 mb-4">
      <Zap size={16} className={cn("text-brand-accent", isAnalyzing && "animate-pulse")} />
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">حالة الذكاء الاصطناعي (Alpha Mind)</h3>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-row-reverse">
        <span className="text-xs text-brand-text-muted">مستوى الثقة</span>
        <span className="text-lg font-bold text-brand-accent">{confidence}%</span>
      </div>
      <div className="flex justify-between items-center flex-row-reverse">
        <span className="text-xs text-brand-text-muted">حجم الصفقة المقترح (Kelly)</span>
        <span className="text-lg font-bold text-emerald-500">{kelly}</span>
      </div>
      <div className="pt-4 border-t border-brand-border flex items-center gap-3 flex-row-reverse">
        <div className="flex-1 h-1 bg-brand-border rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: isAnalyzing ? '100%' : '92%' }}
            transition={{ duration: isAnalyzing ? 2 : 0.5, repeat: isAnalyzing ? Infinity : 0 }}
            className="h-full bg-brand-accent" 
          />
        </div>
        <span className="text-[10px] font-bold text-brand-accent uppercase">
          {isAnalyzing ? 'جاري تحليل البيانات العميقة...' : 'تم تحديث البيانات'}
        </span>
      </div>
    </div>
  </div>
);

export const NewsFeed = () => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Globe size={16} className="text-brand-accent" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">أخبار الأسواق العاجلة</h3>
    </div>
    <div className="space-y-4">
      {[
        { title: 'بيتكوين يقترب من قمة تاريخية جديدة وسط تفاؤل المؤسسات', source: 'CoinDesk', time: 'منذ 10 دقائق', url: 'https://www.coindesk.com' },
        { title: 'تحديث إيثيريوم القادم قد يقلل الرسوم بنسبة 90%', source: 'CoinTelegraph', time: 'منذ 30 دقيقة', url: 'https://cointelegraph.com' },
        { title: 'صناديق الاستثمار المتداولة للذهب تشهد تدفقات خارجة قياسية', source: 'Bloomberg', time: 'منذ ساعة', url: 'https://www.bloomberg.com/markets' },
      ].map((news, i) => (
        <a 
          key={i} 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block p-3 rounded-xl bg-white/5 border border-brand-border/50 hover:border-brand-accent/50 transition-all group"
        >
          <div className="flex justify-between items-start mb-1 flex-row-reverse">
            <span className="text-[10px] text-brand-accent font-bold">{news.source}</span>
            <span className="text-[10px] text-brand-text-muted">{news.time}</span>
          </div>
          <p className="text-xs font-medium group-hover:text-brand-accent transition-colors text-right">{news.title}</p>
        </a>
      ))}
    </div>
  </div>
);
