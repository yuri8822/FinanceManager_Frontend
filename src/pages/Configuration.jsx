import SettingsSection from '../components/SettingsSection';
import SubscriptionsSection from '../components/SubscriptionsSection';
import TransactionsSection from '../components/TransactionsSection';

export default function Configuration({
  subscriptions,
  transactions,
  settings,
  onAddSubscription,
  onUpdateSubscription,
  onDeleteSubscription,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onConfirmTransaction,
  onSkipTransaction,
  onSaveSettings,
}) {
  return (
    <div className="px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Configuration</h1>
        <p className="text-sm text-gray-600 mt-0.5">Manage your subscriptions and transactions</p>
      </div>

      <SettingsSection settings={settings} onSave={onSaveSettings} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionsSection
          subscriptions={subscriptions}
          onAdd={onAddSubscription}
          onUpdate={onUpdateSubscription}
          onDelete={onDeleteSubscription}
        />

        <TransactionsSection
          transactions={transactions}
          onAdd={onAddTransaction}
          onUpdate={onUpdateTransaction}
          onDelete={onDeleteTransaction}
          onConfirm={onConfirmTransaction}
          onSkip={onSkipTransaction}
        />
      </div>
    </div>
  );
}
