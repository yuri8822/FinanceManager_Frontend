import { useState } from 'react';
import CategoryPicker from './CategoryPicker';

const RECURRENCES = ['weekly', 'monthly', 'yearly'];

const today = () => new Date().toISOString().split('T')[0];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/40 transition-colors';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

export default function SubscriptionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    amount: initial?.amount ?? '',
    recurrence: initial?.recurrence ?? 'monthly',
    nextBilling: initial?.nextBilling ? initial.nextBilling.split('T')[0] : today(),
    category: initial?.category ?? '',
    categoryColor: initial?.categoryColor ?? '#6b7280',
    isActive: initial?.isActive ?? true,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Service Name</label>
        <input
          className={inputClass}
          placeholder="e.g. Netflix, Spotify..."
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Amount (₨)</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Recurrence</label>
          <select
            className={inputClass}
            value={form.recurrence}
            onChange={(e) => set('recurrence', e.target.value)}
          >
            {RECURRENCES.map((r) => (
              <option key={r} value={r} style={{ background: 'var(--bg-card)' }}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Next Billing</label>
        <input
          className={inputClass}
          type="date"
          value={form.nextBilling}
          onChange={(e) => set('nextBilling', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <CategoryPicker
          scope="subscription"
          selected={form.category}
          onChange={(name, color) => { set('category', name); set('categoryColor', color); }}
        />
      </div>

      <div className="flex items-center gap-3 py-1">
        <button
          type="button"
          onClick={() => set('isActive', !form.isActive)}
          className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ background: form.isActive ? '#8b5cf6' : 'var(--bg-hover)' }}
        >
          <span
            className="absolute left-0 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: form.isActive ? 'translateX(22px)' : 'translateX(2px)' }}
          />
        </button>
        <span className="text-sm text-gray-400">
          {form.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-white/5 hover:bg-white/10 border border-white/[0.06] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors"
        >
          {initial ? 'Save Changes' : 'Add Subscription'}
        </button>
      </div>
    </form>
  );
}
