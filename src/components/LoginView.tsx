import React from 'react';
import { TrendingUp, Mail, Lock, ArrowLeft } from 'lucide-react';
import { cn } from '../utils';

export const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-brand-bg z-[100] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-accent/20">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">مرحباً بك في <span className="text-brand-accent">ألفا تريد</span></h1>
          <p className="text-brand-text-muted text-sm mt-2">سجل دخولك للمتابعة إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider block text-right">البريد الإلكتروني</label>
            <div className="relative">
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-brand-accent transition-all text-right"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider block text-right">كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-brand-accent transition-all text-right"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-accent/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-border text-center">
          <p className="text-xs text-brand-text-muted">
            لا تملك حساباً؟ <span className="text-brand-accent cursor-pointer hover:underline">تواصل مع الإدارة</span>
          </p>
        </div>
      </div>
    </div>
  );
};
