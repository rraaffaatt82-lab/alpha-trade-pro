import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: { amount: number, tp: number, sl: number, dailyStopLoss: number }) => void;
}

export const QuickTradeModal = ({ isOpen, onClose, onConfirm }: QuickTradeModalProps) => {
  const [amount, setAmount] = useState(100);
  const [tp, setTp] = useState(5);
  const [sl, setSl] = useState(2);
  const [dailyStopLoss, setDailyStopLoss] = useState(5);

  const potentialProfit = (amount * tp) / 100;
  const potentialLoss = (amount * sl) / 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-brand-surface border border-brand-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-gradient-to-r from-brand-accent/10 to-transparent flex-row-reverse">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="p-2 bg-brand-accent rounded-lg text-white">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold">إعداد التداول السريع</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} className="text-brand-text-muted" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider block text-right">مبلغ التداول لكل صفقة</label>
              <div className="relative">
                <DollarSign size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-accent" />
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl pr-12 pl-4 py-3 text-lg font-mono focus:outline-none focus:border-brand-accent transition-all text-right"
                />
              </div>
            </div>

            {/* TP & SL Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-success uppercase tracking-wider block text-right">هدف الربح (%)</label>
                <div className="relative">
                  <TrendingUp size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-success" />
                  <input 
                    type="number" 
                    value={tp}
                    onChange={(e) => setTp(Number(e.target.value))}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pr-12 pl-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-success transition-all text-right"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-danger uppercase tracking-wider block text-right">وقف الخسارة (%)</label>
                <div className="relative">
                  <TrendingDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-danger" />
                  <input 
                    type="number" 
                    value={sl}
                    onChange={(e) => setSl(Number(e.target.value))}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pr-12 pl-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-danger transition-all text-right"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-danger uppercase tracking-wider block text-right">وقف الخسارة اليومي (%) - حماية الحساب</label>
              <input 
                type="number" 
                value={dailyStopLoss}
                onChange={(e) => setDailyStopLoss(Number(e.target.value))}
                className="w-full bg-brand-bg border border-brand-danger/30 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-danger transition-all text-right text-brand-danger font-bold"
              />
              <p className="text-[10px] text-brand-text-muted text-right">سيتم إيقاف البوت فوراً إذا وصلت خسارة اليوم لهذه النسبة.</p>
            </div>

            {/* Profit/Loss Preview */}
            <div className="p-4 bg-white/5 border border-brand-border rounded-2xl space-y-3">
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-xs text-brand-text-muted">الربح المتوقع:</span>
                <span className="text-sm font-bold text-brand-success">+{potentialProfit.toLocaleString()}$</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-xs text-brand-text-muted">أقصى خسارة محتملة:</span>
                <span className="text-sm font-bold text-brand-danger">-{potentialLoss.toLocaleString()}$</span>
              </div>
              <div className="pt-2 border-t border-brand-border flex items-center gap-2 flex-row-reverse">
                <AlertTriangle size={12} className="text-yellow-500" />
                <p className="text-[10px] text-brand-text-muted text-right">سيقوم الذكاء الاصطناعي بإغلاق الصفقة تلقائياً عند الوصول لهذه النسب.</p>
              </div>
            </div>

            <button 
              onClick={() => onConfirm({ amount, tp, sl, dailyStopLoss })}
              className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl font-bold shadow-lg shadow-brand-accent/20 transition-all active:scale-95"
            >
              تأكيد وبدء التداول الآلي
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
