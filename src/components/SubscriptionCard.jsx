import { Pencil, Trash2, Calendar } from 'lucide-react';

const RECURRENCE_LABEL = { weekly: '/wk', monthly: '/mo', yearly: '/yr' };

const fmt = (n) =>
  '₨ ' + n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function SubscriptionCard({ sub, onEdit, onDelete }) {
  const color = sub.categoryColor || '#6b7280';
  const billingDate = sub.nextBilling
    ? new Date(sub.nextBilling).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div
      className="group relative rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between pl-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-white text-sm truncate">{sub.name}</p>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
              style={
                sub.isActive
                  ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' }
                  : { background: 'rgba(107,114,128,0.12)', color: '#6b7280' }
              }
            >
              {sub.isActive ? 'Active' : 'Paused'}
            </span>
          </div>
          <p className="text-xs text-gray-600">{sub.category}</p>
          {billingDate && (
            <div className="flex items-center gap-1 mt-1.5">
              <Calendar size={10} className="text-gray-600" />
              <span className="text-[11px] text-gray-600">Next: {billingDate}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 ml-3 shrink-0">
          <p className="text-sm font-bold" style={{ color }}>
            {fmt(sub.amount)}
            <span className="text-xs font-normal text-gray-600 ml-0.5">
              {RECURRENCE_LABEL[sub.recurrence]}
            </span>
          </p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(sub)}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Pencil size={11} />
            </button>
            <button
              onClick={() => onDelete(sub._id)}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
