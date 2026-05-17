import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Configuration from './pages/Configuration';
import * as api from './services/api';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    Promise.all([api.getTransactions(), api.getSubscriptions(), api.getSettings()])
      .then(([txRes, subRes, settingsRes]) => {
        setTransactions(txRes.data);
        setSubscriptions(subRes.data);
        setSettings(settingsRes.data);
      })
      .catch(() => setError('Could not connect to the server. Make sure the backend is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  const addTransaction = async (data) => {
    const res = await api.createTransaction(data);
    setTransactions((prev) => [res.data, ...prev]);
  };

  const updateTransaction = async (id, data) => {
    const res = await api.updateTransaction(id, data);
    setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTransaction = async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const confirmTransaction = async (id, amount) => {
    const res = await api.updateTransaction(id, { status: 'confirmed', amount });
    setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const skipTransaction = async (id) => {
    const res = await api.updateTransaction(id, { status: 'skipped' });
    setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const addSubscription = async (data) => {
    const res = await api.createSubscription(data);
    setSubscriptions((prev) => [res.data, ...prev]);
  };

  const updateSubscription = async (id, data) => {
    const res = await api.updateSubscription(id, data);
    setSubscriptions((prev) => prev.map((s) => (s._id === id ? res.data : s)));
  };

  const deleteSubscription = async (id) => {
    await api.deleteSubscription(id);
    setSubscriptions((prev) => prev.filter((s) => s._id !== id));
  };

  const saveSettings = async (data) => {
    const res = await api.updateSettings(data);
    setSettings(res.data);
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-app)' }}>
      <Sidebar page={page} onNavigate={setPage} />

      <main className="flex-1 ml-56 min-h-screen">
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="m-8 rounded-2xl px-5 py-4 text-sm text-red-400" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {page === 'dashboard' && (
              <Dashboard
                transactions={transactions}
                subscriptions={subscriptions}
                settings={settings}
              />
            )}
            {page === 'configuration' && (
              <Configuration
                subscriptions={subscriptions}
                transactions={transactions}
                settings={settings}
                onAddSubscription={addSubscription}
                onUpdateSubscription={updateSubscription}
                onDeleteSubscription={deleteSubscription}
                onAddTransaction={addTransaction}
                onUpdateTransaction={updateTransaction}
                onDeleteTransaction={deleteTransaction}
                onConfirmTransaction={confirmTransaction}
                onSkipTransaction={skipTransaction}
                onSaveSettings={saveSettings}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
