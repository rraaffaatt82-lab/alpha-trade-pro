import React, { useState, useEffect } from 'react';
import { Bot, Play, Square, Settings, Activity, MessageSquare, Volume2, VolumeX, CheckSquare } from 'lucide-react';
import { cn } from '../utils';
import { BotSettings, BotLog } from '../types';

export const SmartBotPanel = ({ 
  onAnalysis, 
  externalSettings, 
  onSettingsApplied,
  botStatus
}: { 
  onAnalysis?: (data: any) => void,
  externalSettings?: any,
  onSettingsApplied?: () => void,
  botStatus?: any
}) => {
  const [settings, setSettings] = useState<BotSettings>({
    maxTradeAmount: 1000,
    takeProfit: 5,
    stopLoss: 2,
    dailyStopLoss: 5,
    isActive: false,
    isVoiceEnabled: true,
    selectedAssets: ['BTC/USDT', 'ETH/USDT']
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (externalSettings) {
      setSettings(prev => ({
        ...prev,
        maxTradeAmount: externalSettings.amount,
        takeProfit: externalSettings.tp,
        stopLoss: externalSettings.sl,
        dailyStopLoss: externalSettings.dailyStopLoss || 5,
        isActive: true // Auto-start when settings are applied from external
      }));
      
      addLog('info', `تم تطبيق إعدادات التداول السريع: مبلغ ${externalSettings.amount}$ | ربح ${externalSettings.tp}% | خسارة ${externalSettings.sl}% | وقف يومي ${externalSettings.dailyStopLoss}%`);
      speak('تم تطبيق الإعدادات الجديدة. بدأ التداول الآلي.');
      
      if (onSettingsApplied) onSettingsApplied();
    }
  }, [externalSettings]);

  const [logs, setLogs] = useState<BotLog[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fearGreed, setFearGreed] = useState(65);

  // Sync with botStatus from props
  useEffect(() => {
    if (botStatus && !isDirty) {
      setSettings(botStatus.settings);
      setLogs(botStatus.logs);
    } else if (botStatus) {
      setLogs(botStatus.logs);
    }
  }, [botStatus, isDirty]);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/bot/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      if (response.ok) {
        setIsDirty(false);
        addLog('info', 'تم حفظ الإعدادات الجديدة بنجاح');
        speak('تم حفظ الإعدادات');
      }
    } catch (error) {
      addLog('info', 'فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const speak = (text: string) => {
    if (!settings.isVoiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  const addLog = (action: BotLog['action'], message: string, symbol: string = 'BTC/USDT', price?: number) => {
    // We still keep local logs for immediate feedback, but server is source of truth
    const newLog: BotLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      action,
      message,
      symbol,
      price
    };
    setLogs(prev => [newLog, ...prev].slice(0, 20));
    if (action === 'buy' || action === 'sell') {
      speak(`تنبيه تداول: ${message}`);
    }
  };

  const toggleBot = async () => {
    const newState = !settings.isActive;
    try {
      const response = await fetch('/api/bot/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newState, settings: { ...settings, isActive: newState } })
      });
      const data = await response.json();
      setSettings(prev => ({ ...prev, isActive: data.active }));
      setIsDirty(false);
      
      const msg = data.active ? 'تم تفعيل البوت على الخادم. سيعمل حتى لو أغلقت المتصفح.' : 'تم إيقاف البوت.';
      addLog('info', msg);
      speak(msg);
    } catch (error) {
      addLog('info', 'فشل الاتصال بالخادم لتفعيل البوت');
    }
  };

  const settingsRef = React.useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    let interval: any;
    if (settings.isActive) {
      const runAnalysis = async () => {
        setIsAnalyzing(true);
        if (onAnalysis) onAnalysis({ isAnalyzing: true });
        try {
          // Use current settings from ref to avoid dependency loop
          const currentSettings = settingsRef.current;
          for (const asset of currentSettings.selectedAssets) {
            // Get real price first
            const priceResponse = await fetch(`/api/market/price?symbol=${encodeURIComponent(asset)}`);
            const priceData = await priceResponse.json();
            const currentPrice = priceData.price;

            if (!currentPrice) {
              addLog('info', `فشل جلب السعر المباشر لـ ${asset}. تخطي التحليل...`, asset);
              continue;
            }

            const response = await fetch('/api/bot/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                symbol: asset,
                price: currentPrice,
                settings: currentSettings
              })
            });
            const data = await response.json();
            
            if (onAnalysis) onAnalysis({ ...data, isAnalyzing: false });
            if (data.fearGreedIndex) setFearGreed(data.fearGreedIndex);

            if (data.action !== 'hold') {
              addLog(data.action, `قرار AI لـ ${asset}: ${data.reason}`, asset, currentPrice);
            } else {
              addLog('info', `تحليل ${asset}: ${data.reason.substring(0, 40)}... القرار: انتظار`, asset);
            }
          }
        } catch (error) {
          addLog('info', 'خطأ في الاتصال بمحرك الذكاء الاصطناعي');
          if (onAnalysis) onAnalysis({ isAnalyzing: false });
        } finally {
          setIsAnalyzing(false);
        }
      };

      runAnalysis(); // Run immediately
      interval = setInterval(runAnalysis, 30000); // Run every 30 seconds (less frequent to avoid hangs)
    }
    return () => clearInterval(interval);
  }, [settings.isActive, onAnalysis]);

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-accent/5">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            settings.isActive ? "bg-brand-success/20 text-brand-success" : "bg-brand-text-muted/20 text-brand-text-muted"
          )}>
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">بوت التداول الذكي V2</h3>
            <p className="text-[10px] text-brand-text-muted">تحليل متعدد الأصول + تنبيهات صوتية</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSettings(prev => ({ ...prev, isVoiceEnabled: !prev.isVoiceEnabled }))}
            className={cn(
              "p-2 rounded-lg transition-colors",
              settings.isVoiceEnabled ? "text-brand-accent bg-brand-accent/10" : "text-brand-text-muted bg-white/5"
            )}
          >
            {settings.isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button 
            onClick={toggleBot}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95",
              settings.isActive 
                ? "bg-brand-danger/10 text-brand-danger hover:bg-brand-danger/20" 
                : "bg-brand-success/10 text-brand-success hover:bg-brand-success/20"
            )}
          >
            {settings.isActive ? <><Square size={14} /> إيقاف</> : <><Play size={14} /> تشغيل</>}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-brand-border rtl:divide-x-reverse overflow-hidden">
        {/* Settings */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 text-brand-text-muted mb-2">
            <Settings size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">إعدادات التداول المتقدمة</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-brand-text-muted block mb-2">الأصول المراقبة</label>
              <div className="flex flex-wrap gap-2">
                {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'].map(asset => (
                  <button
                    key={asset}
                    onClick={() => {
                      const assets = settings.selectedAssets.includes(asset)
                        ? settings.selectedAssets.filter(a => a !== asset)
                        : [...settings.selectedAssets, asset];
                      setSettings(prev => ({ ...prev, selectedAssets: assets }));
                      setIsDirty(true);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
                      settings.selectedAssets.includes(asset)
                        ? "bg-brand-accent text-white"
                        : "bg-white/5 text-brand-text-muted border border-brand-border"
                    )}
                  >
                    {settings.selectedAssets.includes(asset) && <CheckSquare size={12} />}
                    {asset}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-text-muted block mb-2">الحد الأقصى للصفقة ($)</label>
              <input 
                type="number" 
                value={settings.maxTradeAmount}
                onChange={(e) => {
                  setSettings(prev => ({ ...prev, maxTradeAmount: Number(e.target.value) }));
                  setIsDirty(true);
                }}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-brand-text-muted block mb-2">أخذ الربح (%)</label>
                <input 
                  type="number" 
                  value={settings.takeProfit}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, takeProfit: Number(e.target.value) }));
                    setIsDirty(true);
                  }}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="text-xs text-brand-text-muted block mb-2">وقف الخسارة (%)</label>
                <input 
                  type="number" 
                  value={settings.stopLoss}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, stopLoss: Number(e.target.value) }));
                    setIsDirty(true);
                  }}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-danger font-bold block mb-2">وقف الخسارة اليومي (%) - حماية الحساب</label>
              <input 
                type="number" 
                value={settings.dailyStopLoss}
                onChange={(e) => {
                  setSettings(prev => ({ ...prev, dailyStopLoss: Number(e.target.value) }));
                  setIsDirty(true);
                }}
                className="w-full bg-brand-bg border border-brand-danger/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-danger text-brand-danger font-bold"
              />
              <p className="text-[9px] text-brand-text-muted mt-1">سيتم إيقاف البوت فوراً إذا وصلت خسارة اليوم لهذه النسبة من الرصيد.</p>
            </div>
            
            {isDirty && (
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="w-full py-2 bg-brand-accent text-white rounded-lg text-xs font-bold hover:bg-brand-accent/80 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات الجديدة'}
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-brand-border">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-brand-accent" />
              <span className="text-xs font-bold">حالة النظام الذكي</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-brand-text-muted">تحليل المشاعر الاجتماعية</span>
                <span className="text-brand-success underline">نشط</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-brand-text-muted">مؤشر الخوف والطمع</span>
                <span className="text-brand-success underline">نشط</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="p-6 flex flex-col overflow-hidden bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-brand-text-muted">
              <MessageSquare size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">سجل النشاط</span>
            </div>
            {isAnalyzing && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <Bot size={32} className="text-brand-border mb-2" />
                  <p className="text-xs text-brand-text-muted">لا يوجد نشاط حالياً. قم بتشغيل البوت للبدء.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-3 rounded-lg bg-white/5 border border-brand-border/50 text-right"
                  >
                    <div className="flex justify-between items-start mb-1 flex-row-reverse">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                        log.action === 'buy' ? "bg-brand-success/10 text-brand-success" :
                        log.action === 'sell' ? "bg-brand-danger/10 text-brand-danger" :
                        "bg-brand-accent/10 text-brand-accent"
                      )}>
                        {log.action === 'buy' ? 'شراء' : log.action === 'sell' ? 'بيع' : 'معلومات'}
                      </span>
                      <span className="text-[10px] text-brand-text-muted font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{log.message}</p>
                    {log.price && (
                      <div className="mt-2 text-[10px] font-mono text-brand-text-muted">
                        السعر: ${log.price.toLocaleString()} | الرمز: {log.symbol}
                      </div>
                    )}
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
