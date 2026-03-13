import React, { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '../utils';

export const ExchangeConnect = ({ onLinkSuccess, isLinked, onUnlink }: { onLinkSuccess: () => void, isLinked: boolean, onUnlink: () => void }) => {
  const [exchange, setExchange] = useState('Binance');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !apiSecret) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/exchange/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchange, apiKey, apiSecret })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus('success');
        setMessage(`تم الربط بنجاح! الرصيد المتاح: $${data.balance?.toLocaleString() || '0'}`);
        onLinkSuccess();
      } else {
        setStatus('error');
        setMessage(data.error || 'فشل الاتصال بالمنصة');
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ في الشبكة');
    }
  };

  if (isLinked && status !== 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-brand-border bg-gradient-to-br from-brand-success/10 to-transparent">
            <div className="flex items-center gap-4 mb-4 flex-row-reverse">
              <div className="p-3 bg-brand-success rounded-xl text-white">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">المنصة مرتبطة</h2>
                <p className="text-sm text-brand-text-muted">حسابك متصل حالياً بمنصة Bybit</p>
              </div>
            </div>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="p-4 bg-white/5 border border-brand-border rounded-xl text-right">
              <div className="flex justify-between items-center flex-row-reverse mb-2">
                <span className="text-xs font-bold text-brand-text-muted uppercase">المنصة</span>
                <span className="text-sm font-bold">Bybit</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse mb-2">
                <span className="text-xs font-bold text-brand-text-muted uppercase">الحالة</span>
                <span className="text-sm font-bold text-brand-success">متصل</span>
              </div>
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-xs font-bold text-brand-text-muted uppercase">آخر مزامنة</span>
                <span className="text-sm font-bold">الآن</span>
              </div>
            </div>
            <button 
              onClick={onUnlink}
              className="w-full py-3 border border-brand-danger/30 text-brand-danger rounded-xl text-sm font-bold hover:bg-brand-danger/5 transition-all"
            >
              إلغاء ربط المنصة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-brand-border bg-gradient-to-br from-brand-accent/10 to-transparent">
          <div className="flex items-center gap-4 mb-4 flex-row-reverse">
            <div className="p-3 bg-brand-accent rounded-xl text-white">
              <Shield size={24} />
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">ربط منصة التداول</h2>
              <p className="text-sm text-brand-text-muted">قم بربط حسابك لبدء التداول الحقيقي بواسطة Alpha Mind</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-brand-success/20 text-brand-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold">{message}</h3>
              <p className="text-sm text-brand-text-muted">تم استيراد رصيدك بنجاح. يمكنك الآن تفعيل البوت للتداول الحقيقي.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="px-6 py-2 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent/90 transition-all"
              >
                العودة للإعدادات
              </button>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">اختر المنصة</label>
                  <select 
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all"
                  >
                    <option value="Binance">Binance (بينانس)</option>
                    <option value="Coinbase">Coinbase (كوين بيس)</option>
                    <option value="Bybit">Bybit (باي بيت)</option>
                    <option value="OKX">OKX</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">نوع الاتصال</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-brand-border rounded-xl text-sm text-brand-text-muted">
                    <Lock size={14} />
                    <span>API Key (مشفر بالكامل)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">API Key</label>
                    <a href="#" className="text-[10px] text-brand-accent hover:underline flex items-center gap-1">
                      <ExternalLink size={10} /> كيف أحصل على المفتاح؟
                    </a>
                  </div>
                  <div className="relative">
                    <Key size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                    <input 
                      type="text" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="أدخل مفتاح API الخاص بك"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">API Secret</label>
                  <div className="relative">
                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                    <input 
                      type="password" 
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      placeholder="أدخل الرمز السري API Secret"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-brand-danger/10 border border-brand-danger/20 rounded-xl flex items-center gap-3 text-brand-danger text-sm">
                  <AlertCircle size={18} />
                  <span>{message}</span>
                </div>
              )}

              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <p className="text-[10px] leading-relaxed text-brand-text-muted">
                  <span className="text-brand-accent font-bold">ملاحظة أمنية:</span> نحن لا نقوم بتخزين مفاتيحك على خوادمنا. يتم تشفير المفاتيح محلياً واستخدامها فقط لإرسال أوامر التداول. تأكد من تعطيل خيار "السحب" (Withdrawal) عند إنشاء مفتاح API.
                </p>
              </div>

              <button 
                type="submit"
                disabled={status === 'loading'}
                className={cn(
                  "w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                  status === 'loading' 
                    ? "bg-brand-accent/50 cursor-not-allowed" 
                    : "bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/20 active:scale-[0.98]"
                )}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    جاري التحقق من المفاتيح...
                  </>
                ) : (
                  'ربط المنصة الآن'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
