import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/40 transition-colors';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

export default function SettingsSection({ settings, onSave }) {
  const [form, setForm] = useState({
    startingBalance: '',
    savingsGoal: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        startingBalance: settings.startingBalance ?? '',
        savingsGoal: settings.savingsGoal ?? '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      startingBalance: parseFloat(form.startingBalance) || 0,
      savingsGoal: form.savingsGoal !== '' ? parseFloat(form.savingsGoal) : null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="rounded-2xl"
      style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}
    >
      <div className="px-5 py-4 border-b border-white/[0.04]">
        <h2 className="text-sm font-semibold text-white">Financial Settings</h2>
        <p className="text-xs text-gray-600 mt-0.5">Set your starting balance and savings target</p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Starting Money (₨)</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500000"
              value={form.startingBalance}
              onChange={(e) => setForm((f) => ({ ...f, startingBalance: e.target.value }))}
            />
            <p className="text-[11px] text-gray-700 mt-1">
              How much money you currently have. This is the baseline for your balance and runway calculations.
            </p>
          </div>

          <div>
            <label className={labelClass}>Savings Goal (₨) — optional</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 1000000"
              value={form.savingsGoal}
              onChange={(e) => setForm((f) => ({ ...f, savingsGoal: e.target.value }))}
            />
            <p className="text-[11px] text-gray-700 mt-1">
              A target balance to work towards. Shows a progress bar and projected date on the dashboard.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: saved ? 'rgba(16,185,129,0.8)' : '#7c3aed' }}
          >
            <Save size={13} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
