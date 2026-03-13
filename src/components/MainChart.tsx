import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { formatCurrency } from '../utils';

export const MainChart = () => {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/market/history?symbol=BTC/USDT');
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="text-right">
          <h3 className="text-lg font-bold">بيتكوين / دولار</h3>
          <p className="text-xs text-brand-text-muted">حركة سعر البيتكوين في الوقت الفعلي</p>
        </div>
        <div className="flex gap-2">
          {['1 ساعة', '4 ساعات', '1 يوم', '1 أسبوع', '1 شهر'].map((t) => (
            <button 
              key={t} 
              className={t === '1 يوم' ? "px-3 py-1 bg-brand-accent text-xs rounded-md font-medium" : "px-3 py-1 hover:bg-white/5 text-xs rounded-md text-brand-text-muted transition-colors"}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center text-brand-text-muted text-xs">جاري جلب بيانات السوق المباشرة...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#232326" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#71717A" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                reversed={true}
              />
              <YAxis 
                stroke="#71717A" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `$${val/1000}k`}
                domain={['dataMin - 500', 'dataMax + 500']}
                orientation="right"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141416', border: '1px solid #232326', borderRadius: '8px', textAlign: 'right' }}
                itemStyle={{ color: '#3B82F6' }}
                formatter={(value: number) => [formatCurrency(value), 'السعر']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
