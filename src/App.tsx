import React from 'react';
import { Sidebar, Header } from './components/Layout';
import { MainChart } from './components/MainChart';
import { RecentTrades, AIAnalysis } from './components/Widgets';
import { SmartBotPanel } from './components/SmartBotPanel';
import { cn } from './utils';

import { FearGreedGauge, SocialSentiment, BacktestPanel } from './components/AdvancedWidgets';

import { WhaleTracker, MacroCorrelation, IntelligenceStatus, NewsFeed } from './components/EliteWidgets';
import { ExchangeConnect } from './components/ExchangeConnect';
import { HistoryView, AlertsView, SettingsView, MarketsView, AIAnalysisView, DemoTradingView, AnalyticsView } from './components/OtherViews';
import { QuickTradeModal } from './components/QuickTradeModal';

import { LoginView } from './components/LoginView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    try {
      return localStorage.getItem('is_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [botAnalysis, setBotAnalysis] = React.useState<any>(null);
  const [currentView, setCurrentView] = React.useState('لوحة التحكم');
  const [isQuickTradeOpen, setIsQuickTradeOpen] = React.useState(false);
  const [pendingSettings, setPendingSettings] = React.useState<any>(null);
  const [botStatus, setBotStatus] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const botPanelRef = React.useRef<HTMLDivElement>(null);
  const [isLinked, setIsLinked] = React.useState(() => {
    try {
      return localStorage.getItem('exchange_linked') === 'true';
    } catch (e) {
      return false;
    }
  });

  React.useEffect(() => {
    console.log('App mounted, currentView:', currentView);
  }, [currentView]);

  const handleNavigate = React.useCallback((view: string) => {
    console.log('Navigating to:', view);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const handleAnalysis = React.useCallback((data: any) => {
    setBotAnalysis(data);
  }, []);

  const handleSettingsApplied = React.useCallback(() => {
    setPendingSettings(null);
  }, []);

  const fetchStatus = React.useCallback(async () => {
    try {
      const response = await fetch('/api/bot/status');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBotStatus(data);
      if (data.exchangeConnected) {
        setIsLinked(true);
        localStorage.setItem('exchange_linked', 'true');
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }, []);

  React.useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleLinkSuccess = () => {
    setIsLinked(true);
    localStorage.setItem('exchange_linked', 'true');
    fetchStatus();
  };

  const handleUnlink = () => {
    setIsLinked(false);
    localStorage.removeItem('exchange_linked');
  };

  const handleTradeNow = () => {
    if (!isLinked) {
      setCurrentView('المحفظة');
      return;
    }
    setIsQuickTradeOpen(true);
  };

  const handleConfirmTrade = (settings: any) => {
    setIsQuickTradeOpen(false);
    setPendingSettings(settings);
    
    if (currentView !== 'لوحة التحكم') {
      setCurrentView('لوحة التحكم');
      setTimeout(() => {
        botPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      botPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderView = () => {
    try {
      if (!currentView) {
        console.warn('currentView is null or undefined, defaulting to لوحة التحكم');
        setCurrentView('لوحة التحكم');
        return null;
      }
      
      console.log('Rendering view:', currentView);
      switch (currentView) {
        case 'المحفظة':
          return <ExchangeConnect onLinkSuccess={handleLinkSuccess} isLinked={isLinked} onUnlink={handleUnlink} />;
        case 'السجل':
          return <HistoryView />;
        case 'التنبيهات':
          return <AlertsView />;
        case 'الإعدادات':
          return <SettingsView isLinked={isLinked} onUnlink={handleUnlink} onNavigate={setCurrentView} />;
        case 'الأسواق':
          return <MarketsView />;
        case 'تحليل الذكاء الاصطناعي':
          return <AIAnalysisView botStatus={botStatus} />;
        case 'التحليلات':
          return <AnalyticsView botStatus={botStatus} />;
        case 'التداول التجريبي':
          return <DemoTradingView botStatus={botStatus} onRefresh={fetchStatus} />;
        case 'لوحة التحكم':
          return (
            <>
              {/* Elite Intelligence Row - NEW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <IntelligenceStatus 
                  confidence={botAnalysis?.confidence} 
                  kelly={botAnalysis?.kellySize} 
                  isAnalyzing={botAnalysis?.isAnalyzing}
                />
                <WhaleTracker data={botStatus?.whaleActivity} />
                <MacroCorrelation data={botAnalysis?.macroData} />
              </div>

              {/* News and Bot Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" ref={botPanelRef}>
                <div className="lg:col-span-8 h-[450px]">
                  <SmartBotPanel 
                    botStatus={botStatus}
                    onAnalysis={handleAnalysis} 
                    externalSettings={pendingSettings}
                    onSettingsApplied={handleSettingsApplied}
                  />
                </div>
                <div className="lg:col-span-4">
                  <NewsFeed />
                </div>
              </div>

              {/* Advanced Widgets Grid - NEW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FearGreedGauge value={botAnalysis?.fearGreedIndex} />
                <SocialSentiment />
                <BacktestPanel />
              </div>

              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    label: 'إجمالي الرصيد', 
                    value: isLinked && botStatus?.realBalance ? `$${botStatus.realBalance.toLocaleString()}` : '$124,592.00', 
                    change: '+12.5%', 
                    positive: true 
                  },
                  { 
                    label: 'أرباح 24 ساعة', 
                    value: isLinked && botStatus?.realBalance ? `$${(botStatus.realBalance * 0.012).toFixed(2)}` : '$3,450.12', 
                    change: '+2.4%', 
                    positive: true 
                  },
                  { 
                    label: 'المراكز المفتوحة', 
                    value: botStatus?.activeTradesCount || '8', 
                    change: 'نشط', 
                    positive: true 
                  },
                  { 
                    label: 'معدل فوز الذكاء الاصطناعي', 
                    value: '72.4%', 
                    change: '+1.2%', 
                    positive: true 
                  },
                ].map((stat, i) => (
                  <div 
                    key={i}
                    className="bg-brand-surface border border-brand-border p-5 rounded-2xl hover:border-brand-accent/50 transition-colors cursor-pointer group text-right"
                  >
                    <p className="text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                    <div className="flex items-end justify-between flex-row-reverse">
                      <h4 className="text-2xl font-bold font-mono">{stat.value}</h4>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        stat.positive ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"
                      )}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <MainChart />
                </div>
                <div className="lg:col-span-4">
                  <AIAnalysis />
                </div>
              </div>

              {/* Bottom Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <RecentTrades />
                </div>
                <div className="lg:col-span-8">
                  <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 h-full text-right">
                    <div className="flex items-center justify-between mb-6 flex-row-reverse">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-muted">توزيع المحفظة</h3>
                      <button className="text-xs text-brand-accent hover:underline">عرض الكل</button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { coin: 'بيتكوين', symbol: 'BTC', amount: '1.24', value: '$79,642', color: 'bg-orange-500' },
                        { coin: 'إيثيريوم', symbol: 'ETH', amount: '12.5', value: '$43,150', color: 'bg-blue-500' },
                        { coin: 'سولانا', symbol: 'SOL', amount: '450', value: '$1,800', color: 'bg-purple-500' },
                      ].map((asset, i) => (
                        <div key={i} className="flex items-center gap-4 group flex-row-reverse">
                          <div className={cn("w-1 h-8 rounded-full", asset.color)} />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1 flex-row-reverse">
                              <span className="text-sm font-medium">{asset.coin} <span className="text-brand-text-muted text-xs mr-1">{asset.symbol}</span></span>
                              <span className="text-sm font-mono font-medium">{asset.value}</span>
                            </div>
                            <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full float-right", asset.color)} 
                                style={{ width: i === 0 ? '60%' : i === 1 ? '30%' : '10%' }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        default:
          return (
            <div className="p-12 text-center bg-brand-surface border border-brand-border rounded-2xl">
              <h3 className="text-lg font-bold mb-2">عذراً، الشاشة غير متوفرة</h3>
              <p className="text-brand-text-muted">يبدو أنك تحاول الوصول إلى شاشة غير موجودة أو قيد التطوير.</p>
              <button 
                onClick={() => setCurrentView('لوحة التحكم')}
                className="mt-4 px-6 py-2 bg-brand-accent text-white rounded-lg text-sm font-bold"
              >
                العودة للرئيسية
              </button>
            </div>
          );
      }
    } catch (error) {
      console.error('Render error in App:', error);
      return (
        <div className="p-12 text-center bg-brand-surface border border-brand-border rounded-2xl text-brand-danger">
          <h3 className="text-lg font-bold mb-2">حدث خطأ أثناء تحميل هذه الشاشة</h3>
          <p className="text-xs opacity-70 mb-4">{error instanceof Error ? error.message : 'خطأ غير معروف'}</p>
          <button 
            onClick={() => setCurrentView('لوحة التحكم')}
            className="px-6 py-2 bg-brand-accent text-white rounded-lg text-sm font-bold"
          >
            العودة للوحة التحكم
          </button>
        </div>
      );
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_auth', 'true');
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-brand-bg text-white overflow-x-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar currentView={currentView} setCurrentView={handleNavigate} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-64 z-50 transform transition-transform duration-300 lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <Sidebar currentView={currentView} setCurrentView={handleNavigate} />
      </div>
      
      <div className="flex-1 flex flex-col min-h-0 relative">
        <Header 
          currentView={currentView}
          setCurrentView={handleNavigate} 
          onTradeNow={handleTradeNow} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-brand-bg">
          <div key={currentView} className="max-w-7xl mx-auto space-y-6 pb-12 min-h-[500px]">
            {renderView()}
          </div>
        </main>
      </div>

      <QuickTradeModal 
        isOpen={isQuickTradeOpen} 
        onClose={() => setIsQuickTradeOpen(false)} 
        onConfirm={handleConfirmTrade} 
      />
    </div>
  );
}

