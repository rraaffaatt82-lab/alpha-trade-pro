import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  History, 
  Settings, 
  Bell, 
  Search,
  ChevronDown,
  Cpu,
  Key,
  PieChart,
  BarChart3,
  Menu
} from 'lucide-react';
import { cn } from '../utils';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    type="button"
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 group text-right relative border-none outline-none appearance-none",
      active ? "bg-brand-accent/10 text-brand-accent" : "text-brand-text-muted hover:text-white hover:bg-white/5"
    )}
  >
    {active && <div className="absolute inset-y-0 right-0 w-1 bg-brand-accent rounded-l-full" />}
    <Icon size={20} className={cn(active ? "text-brand-accent" : "group-hover:text-white")} />
    <span className="text-sm font-medium whitespace-nowrap">{label}</span>
  </button>
);

export const Sidebar = ({ currentView, setCurrentView }: { currentView: string, setCurrentView: (view: string) => void }) => {
  return (
    <aside className="w-64 border-l border-brand-border h-screen flex flex-col bg-brand-surface z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
          <TrendingUp size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">ألفا تريد<span className="text-brand-accent"> برو</span></h1>
      </div>

      <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-2 text-[10px] uppercase tracking-wider text-brand-text-muted font-bold text-right">الرئيسية</div>
        <SidebarItem icon={LayoutDashboard} label="لوحة التحكم" active={currentView === 'لوحة التحكم'} onClick={() => setCurrentView('لوحة التحكم')} />
        <SidebarItem icon={TrendingUp} label="الأسواق" active={currentView === 'الأسواق'} onClick={() => setCurrentView('الأسواق')} />
        <SidebarItem icon={Cpu} label="تحليل الذكاء الاصطناعي" active={currentView === 'تحليل الذكاء الاصطناعي'} onClick={() => setCurrentView('تحليل الذكاء الاصطناعي')} />
        <SidebarItem icon={BarChart3} label="التحليلات" active={currentView === 'التحليلات'} onClick={() => setCurrentView('التحليلات')} />
        <SidebarItem icon={PieChart} label="التداول التجريبي" active={currentView === 'التداول التجريبي'} onClick={() => setCurrentView('التداول التجريبي')} />
        
        <div className="px-4 mt-8 mb-2 text-[10px] uppercase tracking-wider text-brand-text-muted font-bold text-right">الحساب</div>
        <SidebarItem icon={Wallet} label="المحفظة" active={currentView === 'المحفظة'} onClick={() => setCurrentView('المحفظة')} />
        <SidebarItem icon={History} label="السجل" active={currentView === 'السجل'} onClick={() => setCurrentView('السجل')} />
        <SidebarItem icon={Bell} label="التنبيهات" active={currentView === 'التنبيهات'} onClick={() => setCurrentView('التنبيهات')} />
        <SidebarItem icon={Settings} label="الإعدادات" active={currentView === 'الإعدادات'} onClick={() => setCurrentView('الإعدادات')} />
      </nav>

      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-purple-500" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-sm font-medium truncate">رأفت</p>
          </div>
        </div>
        <div className="text-[9px] text-brand-text-muted text-center font-mono opacity-40 mt-2">
          v2.0.1-stable.20260314
        </div>
      </div>
    </aside>
  );
};

export const Header = ({ currentView, setCurrentView, onTradeNow, onMenuClick }: { currentView?: string, setCurrentView: (view: string) => void, onTradeNow?: () => void, onMenuClick?: () => void }) => (
  <header className="h-16 border-b border-brand-border flex items-center justify-between px-4 md:px-8 bg-brand-surface/50 backdrop-blur-md sticky top-0 z-30">
    <div className="flex items-center gap-4 md:gap-8">
      <button 
        onClick={onMenuClick}
        className="p-2 hover:bg-white/5 rounded-lg lg:hidden text-brand-text-muted transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-brand-accent/10 rounded-xl border border-brand-accent/20">
        <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
        <span className="text-xs font-bold text-brand-accent">{currentView || 'لوحة التحكم'}</span>
      </div>

      <div className="relative group hidden md:block">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-accent transition-colors" />
        <input 
          type="text" 
          placeholder="ابحث..." 
          className="bg-brand-bg border border-brand-border rounded-lg py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-brand-accent w-32 md:w-48 transition-all text-right"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-brand-text-muted uppercase font-bold tracking-widest">BTC/USD</span>
          <div className="flex items-center gap-2 flex-row-reverse">
            <span className="font-mono font-medium text-xs md:text-sm">$64,231</span>
            <span className="text-[10px] md:text-xs text-brand-success">+2.4%</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-4">
      <button 
        onClick={() => setCurrentView('المحفظة')}
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 hover:bg-white/10 text-brand-text-muted border border-brand-border rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer active:scale-95"
      >
        <Key size={16} className="text-brand-accent hidden xs:block" />
        ربط
      </button>
      <button 
        onClick={onTradeNow}
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-lg text-xs md:text-sm font-medium transition-all shadow-lg shadow-brand-accent/20 cursor-pointer active:scale-95"
      >
        تداول
      </button>
    </div>
  </header>
);
