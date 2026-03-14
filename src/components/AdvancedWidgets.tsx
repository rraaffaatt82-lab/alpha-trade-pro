import React from 'react';
import { Gauge, Share2, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../utils';

export const FearGreedGauge = ({ value = 65 }: { value?: number }) => {
  const getStatus = (v: number) => {
    if (v < 25) return { label: 'خوف شديد', color: 'text-brand-danger' };
    if (v < 45) return { label: 'خوف', color: 'text-orange-500' };
    if (v < 55) return { label: 'محايد', color: 'text-brand-text-muted' };
    if (v < 75) return { label: 'طمع', color: 'text-brand-success' };
    return { label: 'طمع شديد', color: 'text-emerald-500' };
  };

  const status = getStatus(value);

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <Gauge size={16} className="text-brand-accent" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">مؤشر الخوف والطمع</h3>
      </div>
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="#232326"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={364.4}
            strokeDashoffset={364.4 - (364.4 * value) / 100}
            className={cn("transition-all duration-1000", status.color.replace('text-', 'stroke-'))}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono">{value}</span>
          <span className={cn("text-[10px] font-bold uppercase", status.color)}>{status.label}</span>
        </div>
      </div>
    </div>
  );
};

export const SocialSentiment = () => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Share2 size={16} className="text-brand-accent" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">مشاعر التواصل الاجتماعي</h3>
    </div>
    <div className="space-y-3">
      {[
        { platform: 'X (Twitter)', sentiment: 'Positive', count: '12.5k', icon: TrendingUp, color: 'text-brand-success' },
        { platform: 'Reddit', sentiment: 'Neutral', count: '4.2k', icon: Minus, color: 'text-brand-text-muted' },
        { platform: 'Telegram', sentiment: 'Bullish', count: '8.9k', icon: TrendingUp, color: 'text-emerald-500' },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-brand-border/50">
          <div className="flex items-center gap-2">
            <item.icon size={14} className={item.color} />
            <span className="text-xs font-medium">{item.platform}</span>
          </div>
          <div className="text-right">
            <div className={cn("text-[10px] font-bold uppercase", item.color)}>{item.sentiment}</div>
            <div className="text-[10px] text-brand-text-muted">{item.count} إشارة</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BacktestPanel = () => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <History size={16} className="text-brand-accent" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">نتائج الاختبار العكسي</h3>
      </div>
      <span className="text-[10px] font-bold text-brand-success bg-brand-success/10 px-2 py-0.5 rounded">استراتيجية AI v2.1</span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 rounded-xl bg-white/5 border border-brand-border text-center">
        <p className="text-[10px] text-brand-text-muted mb-1">معدل الفوز</p>
        <p className="text-lg font-bold text-brand-success">72.5%</p>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-brand-border text-center">
        <p className="text-[10px] text-brand-text-muted mb-1">إجمالي الربح</p>
        <p className="text-lg font-bold text-brand-success">+24.5%</p>
      </div>
    </div>
    <div className="mt-4 p-3 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
      <div className="flex justify-between items-center text-[10px]">
        <span className="text-brand-text-muted">عامل الربح</span>
        <span className="font-bold">1.85</span>
      </div>
      <div className="flex justify-between items-center text-[10px] mt-1">
        <span className="text-brand-text-muted">أقصى تراجع</span>
        <span className="font-bold text-brand-danger">4.2%</span>
      </div>
    </div>
  </div>
);
