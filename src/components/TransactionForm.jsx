import { useState } from 'react';
import CategoryPicker from './CategoryPicker';

const RECURRENCES = ['daily', 'weekly', 'biweekly', 'monthly', 'yearly'];

const today = () => new Date().toISOString().split('T')[0];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/40 transition-colors';

const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    amount: initial?.amount ?? '',
    type: initial?.type ?? 'expense',
    category: initial?.category ?? '',
    categoryColor: initial?.categoryColor ?? '#6b7280',
    recurrence: initial?.recurrence ?? 'none',
    date: initial?.date ? initial.date.split('T')[0] : today(),
    notes: initial?.notes ?? '',
  });

  const [isRecurring, setIsRecurring] = useState((initial?.recurrence ?? 'none') !== 'none');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleRecurring = () => {
    const next = !isRecurring;
    setIsRecurring(next);
    set('recurrence', next ? 'monthly' : 'none');
  };

  const handleTypeChange = (type) => {
    set('type', type);
    set('category', '');
    set('categoryColor', '#6b7280');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Type</label>
        <div className="flex gap-2">
          {['income', 'expense'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className="flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={
                form.type === t
                  ? {
                      background: t === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                      color: t === 'income' ? '#10b981' : '#f43f5e',
                      border: `1px solid ${t === 'income' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
                    }
                  : {
                      background: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Name</label>
        <input
          className={inputClass}
          placeholder="e.g. Monthly salary"
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
          <label className={labelClass}>Date</label>
          <input
            className={inputClass}
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <CategoryPicker
          scope={form.type}
          selected={form.category}
          onChange={(name, color) => { set('category', name); set('categoryColor', color); }}
        />
      </div>

      <div>
        <label className={labelClass}>Recurring</label>
        <div className="flex items-center gap-3 h-[42px]">
          <button
            type="button"
            onClick={toggleRecurring}
            className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0"
            style={{ background: isRecurring ? '#8b5cf6' : 'var(--bg-hover)' }}
          >
            <span
              className="absolute left-0 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: isRecurring ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </button>
          {isRecurring && (
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
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          placeholder="Add a note..."
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
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
          {initial ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
