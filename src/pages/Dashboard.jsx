import SummaryCards from '../components/SummaryCards';
import ChartsSection from '../components/ChartsSection';
import GoalCard from '../components/GoalCard';

export default function Dashboard({ transactions, subscriptions, settings }) {
  return (
    <div className="px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-0.5">Your financial overview</p>
      </div>

      <SummaryCards transactions={transactions} subscriptions={subscriptions} settings={settings} />
      <GoalCard transactions={transactions} subscriptions={subscriptions} settings={settings} />
      <ChartsSection transactions={transactions} subscriptions={subscriptions} settings={settings} />
    </div>
  );
}
