import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getMonthlyAverages, getMonthlySubscriptionCost, getCurrentBalance } from '../../utils/finance';
import { useTheme } from '../../context/ThemeContext';

const fmtAxis = (n) =>
  (n < 0 ? '-₨' : '₨') + (Math.abs(n) >= 1000 ? (Math.abs(n) / 1000).toFixed(0) + 'k' : Math.abs(n));

const fmtFull = (n) =>
  '₨ ' + n.toLocaleString('en-PK', { maximumFractionDigits: 0 });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const real = payload.find((p) => p.dataKey === 'balance');
  const proj = payload.find((p) => p.dataKey === 'projected');
  const val = real?.value ?? proj?.value;
  const isProjected = !real?.value && proj?.value != null;
  return (
    <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 10, padding: '8px 12px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 2 }}>
        {label} {isProjected && <span style={{ color: '#6366f1', fontSize: 10 }}>projected</span>}
      </p>
      <p style={{ color: val >= 0 ? '#6366f1' : '#f43f5e', fontSize: 12, fontWeight: 600 }}>
        {fmtFull(val)}
      </p>
    </div>
  );
};

export default function CashFlowChart({ transactions, subscriptions, settings }) {
  const { theme } = useTheme();
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  const tickColor = theme === 'light' ? '#64748b' : '#6b7280';
  const refLineColor = theme === 'light' ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.08)';

  const startingBalance = settings?.startingBalance ?? 0;

  const sorted = transactions
    .filter((t) => !t.status || t.status === 'confirmed')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = startingBalance;
  const realData = sorted.map((tx) => {
    balance += tx.type === 'income' ? tx.amount : -tx.amount;
    return {
      date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.round(balance),
      projected: null,
    };
  });

  const { income: monthlyIncome, expenses: monthlyExpenses } = getMonthlyAverages(transactions);
  const monthlySubscriptions = getMonthlySubscriptionCost(subscriptions);
  const monthlyNet = monthlyIncome - monthlyExpenses - monthlySubscriptions;

  const projectionData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      balance: null,
      projected: Math.round(balance + monthlyNet * i),
    };
  });
  if (realData.length) {
    projectionData[0].balance = realData[realData.length - 1].balance;
  }

  const data = realData.length ? [...realData, ...projectionData.slice(1)] : projectionData;

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-sm text-gray-700">Add more transactions to see cash flow</p>
      </div>
    );
  }

  const lastBalance = realData.length ? realData[realData.length - 1].balance : startingBalance;
  const isPositive = lastBalance >= 0;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data}>
        <defs>
          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isPositive ? '#6366f1' : '#f43f5e'} stopOpacity={0.25} />
            <stop offset="95%" stopColor={isPositive ? '#6366f1' : '#f43f5e'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtAxis} width={48} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: refLineColor }} />
        <ReferenceLine y={0} stroke={refLineColor} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={isPositive ? '#6366f1' : '#f43f5e'}
          strokeWidth={2}
          fill="url(#balGrad)"
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="projected"
          stroke="#6366f1"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          dot={false}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
