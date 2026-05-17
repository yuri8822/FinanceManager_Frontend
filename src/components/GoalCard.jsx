import { Target } from 'lucide-react';
import { getCurrentBalance, getMonthlyAverages, getMonthlySubscriptionCost } from '../utils/finance';

const fmt = (n) =>
  '₨ ' + Math.abs(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function GoalCard({ transactions, subscriptions, settings }) {
  const goal = settings?.savingsGoal;
  if (!goal) return null;

  const startingBalance = settings?.startingBalance ?? 0;
  const currentBalance = getCurrentBalance(startingBalance, transactions);
  const progress = Math.min(1, Math.max(0, currentBalance / goal));
  const pct = Math.round(progress * 100);

  const { income: monthlyIncome, expenses: monthlyExpenses } = getMonthlyAverages(transactions);
  const monthlySubscriptions = getMonthlySubscriptionCost(subscriptions);
  const monthlyNet = monthlyIncome - monthlyExpenses - monthlySubscriptions;

  let projectedLabel = null;
  if (currentBalance >= goal) {
    projectedLabel = { text: 'Goal reached!', color: '#10b981' };
  } else if (monthlyNet > 0) {
    const monthsLeft = (goal - currentBalance) / monthlyNet;
    const target = new Date();
    target.setMonth(target.getMonth() + Math.ceil(monthsLeft));
    projectedLabel = {
      text: `On track for ${target.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      color: '#a78bfa',
    };
  } else {
    projectedLabel = { text: 'Increase your monthly savings to reach this goal', color: '#f43f5e' };
  }

  const barColor = pct >= 100 ? '#10b981' : pct >= 60 ? '#a78bfa' : pct >= 30 ? '#f59e0b' : '#f43f5e';

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.12)' }}>
            <Target size={14} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Savings Goal</p>
            <p className="text-xs mt-0.5" style={{ color: projectedLabel.color }}>{projectedLabel.text}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-white">{fmt(currentBalance)}</p>
          <p className="text-xs text-gray-600">of {fmt(goal)}</p>
        </div>
      </div>

      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1.5 text-right">{pct}%</p>
    </div>
  );
}
