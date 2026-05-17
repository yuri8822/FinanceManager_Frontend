import { ArrowUpRight, ArrowDownRight, Repeat, Wallet, Clock } from 'lucide-react';
import {
  getCurrentBalance,
  getMonthlyAverages,
  getMonthlySubscriptionCost,
  getRunway,
} from '../utils/finance';

const fmt = (n) =>
  '₨ ' + Math.abs(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function runwayColor(months) {
  if (months === Infinity) return '#10b981';
  if (months >= 6) return '#10b981';
  if (months >= 3) return '#f59e0b';
  return '#f43f5e';
}

function runwayLabel(months) {
  if (months === Infinity) return '∞';
  if (months >= 24) return `${(months / 12).toFixed(1)}y`;
  if (months < 1) return '< 1 mo';
  return `${months.toFixed(1)} mo`;
}

export default function SummaryCards({ transactions, subscriptions, settings }) {
  const startingBalance = settings?.startingBalance ?? 0;
  const currentBalance = getCurrentBalance(startingBalance, transactions);

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthlySubscriptions = getMonthlySubscriptionCost(subscriptions);

  const { expenses: monthlyExpenses } = getMonthlyAverages(transactions);
  const runway = getRunway(currentBalance, monthlyExpenses, monthlySubscriptions);
  const rwColor = runwayColor(runway);

  const isPositive = currentBalance >= 0;
  const balColor = isPositive ? '#10b981' : '#f43f5e';

  const cards = [
    {
      label: 'Current Balance',
      value: fmt(currentBalance),
      prefix: isPositive ? '+' : '-',
      icon: Wallet,
      color: balColor,
      bg: isPositive ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
      border: isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
      rawValue: true,
    },
    {
      label: 'Total Income',
      value: fmt(totalIncome),
      prefix: '+',
      icon: ArrowUpRight,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.06)',
      border: 'rgba(16,185,129,0.12)',
    },
    {
      label: 'Total Expenses',
      value: fmt(totalExpenses),
      prefix: '-',
      icon: ArrowDownRight,
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.06)',
      border: 'rgba(244,63,94,0.12)',
    },
    {
      label: 'Subscriptions / mo',
      value: fmt(monthlySubscriptions),
      prefix: '',
      icon: Repeat,
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.06)',
      border: 'rgba(167,139,250,0.12)',
    },
    {
      label: 'Runway',
      value: runwayLabel(runway),
      prefix: '',
      icon: Clock,
      color: rwColor,
      bg: `${rwColor}0f`,
      border: `${rwColor}30`,
      rawValue: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map(({ label, value, prefix, icon: Icon, color, bg, border, rawValue }) => (
        <div
          key={label}
          className="rounded-2xl p-5"
          style={{ background: bg, border: `1px solid ${border}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${color}18` }}
            >
              <Icon size={14} style={{ color }} />
            </div>
          </div>
          <p className="text-xl font-bold tracking-tight" style={{ color }}>
            {!rawValue && prefix}
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
