import React from 'react';
import { Trade } from '../types';
import { formatCurrency, cn } from '../utils';

const mockTrades: Trade[] = [
  { id: '1', price: 64231.50, amount: 0.024, time: '14:22:01', side: 'buy' },
  { id: '2', price: 64230.12, amount: 0.150, time: '14:21:58', side: 'sell' },
  { id: '3', price: 64232.00, amount: 0.005, time: '14:21:55', side: 'buy' },
  { id: '4', price: 64229.45, amount: 1.200, time: '14:21:52', side: 'sell' },
  { id: '5', price: 64231.10, amount: 0.088, time: '14:21:49', side: 'buy' },
  { id: '6', price: 64230.80, amount: 0.420, time: '14:21:45', side: 'buy' },
  { id: '7', price: 64228.90, amount: 0.012, time: '14:21:42', side: 'sell' },
];

export const RecentTrades = () => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col h-full">
    <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-brand-text-muted text-right">أحدث التداولات</h3>
    <div className="flex-1 overflow-y-auto pl-2">
      <div className="grid grid-cols-3 text-[10px] font-bold text-brand-text-muted uppercase mb-2 text-right">
        <span>السعر</span>
        <span className="text-left">الكمية</span>
        <span className="text-left">الوقت</span>
      </div>
      <div className="space-y-1">
        {mockTrades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 text-xs py-1.5 border-b border-brand-border/50 last:border-0 hover:bg-white/5 transition-colors rounded px-1 text-right">
            <span className={cn("font-mono", trade.side === 'buy' ? "text-brand-success" : "text-brand-danger")}>
              {trade.price.toLocaleString()}
            </span>
            <span className="text-left font-mono">{trade.amount.toFixed(3)}</span>
            <span className="text-left text-brand-text-muted">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AIAnalysis = () => (
  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col h-full text-right">
    <div className="flex items-center gap-2 mb-4 flex-row-reverse">
      <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-muted">تحليل إشارات الذكاء الاصطناعي</h3>
    </div>
    
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
        <div className="flex justify-between items-center mb-2 flex-row-reverse">
          <span className="text-xs font-medium text-brand-accent">درجة التفاؤل</span>
          <span className="text-lg font-bold">84/100</span>
        </div>
        <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-accent w-[84%] float-right" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-brand-text-muted leading-relaxed">
          يظهر البيتكوين تباعداً صعودياً قوياً على الإطار الزمني لـ 4 ساعات. تتوقع نماذج الذكاء الاصطناعي احتمالاً بنسبة 65% لاختبار مقاومة 66 ألف دولار خلال 12 ساعة.
        </p>
        <div className="flex gap-2 flex-row-reverse">
          <span className="px-2 py-1 bg-brand-success/10 text-brand-success text-[10px] rounded font-bold uppercase">شراء قوي</span>
          <span className="px-2 py-1 bg-white/5 text-brand-text-muted text-[10px] rounded font-bold uppercase">مخاطر منخفضة</span>
        </div>
      </div>
    </div>
  </div>
);
