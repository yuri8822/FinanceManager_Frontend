import IncomeExpensesChart from './charts/IncomeExpensesChart';
import ExpenseBreakdownChart from './charts/ExpenseBreakdownChart';
import CashFlowChart from './charts/CashFlowChart';
import SubscriptionBreakdownChart from './charts/SubscriptionBreakdownChart';

function ChartCard({ title, subtitle, children }) {
  return (
    <div
      className="rounded-2xl"
      style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}
    >
      <div className="px-5 py-4 border-b border-white/[0.04]">
        <p className="text-sm font-semibold text-white">{title}</p>
        {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function ChartsSection({ transactions, subscriptions, settings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard title="Income vs Expenses" subtitle="Last 6 months">
        <IncomeExpensesChart transactions={transactions} />
      </ChartCard>

      <ChartCard title="Expense Breakdown" subtitle="By category, all time">
        <ExpenseBreakdownChart transactions={transactions} />
      </ChartCard>

      <ChartCard title="Cash Flow" subtitle="Actual balance + 6-month projection">
        <CashFlowChart transactions={transactions} subscriptions={subscriptions} settings={settings} />
      </ChartCard>

      <ChartCard title="Subscription Costs" subtitle="Active subscriptions, monthly equivalent">
        <SubscriptionBreakdownChart subscriptions={subscriptions} />
      </ChartCard>
    </div>
  );
}
