import { useState } from 'react';
import { Pencil, Trash2, RefreshCw, CalendarClock, Check, X } from 'lucide-react';

const RECURRENCE_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const fmt = (n) =>
  '₨ ' + n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function getNextDate(tx) {
  const base = new Date(tx.lastProcessed ?? tx.date);
  const now = new Date();
  let next = new Date(base);

  const advance = (d) => {
    switch (tx.recurrence) {
      case 'daily':    d.setDate(d.getDate() + 1);         break;
      case 'weekly':   d.setDate(d.getDate() + 7);         break;
      case 'biweekly': d.setDate(d.getDate() + 14);        break;
      case 'monthly':  d.setMonth(d.getMonth() + 1);       break;
      case 'yearly':   d.setFullYear(d.getFullYear() + 1); break;
    }
    return d;
  };

  next = advance(next);
  while (next <= now) next = advance(next);
  return next;
}

export default function TransactionCard({ tx, onEdit, onDelete, onConfirm, onSkip }) {
  const [confirming, setConfirming] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState(tx.amount);

  const isPending = tx.status === 'pending';
  const isSkipped = tx.status === 'skipped';
  const isIncome = tx.type === 'income';
  const color = isIncome ? '#10b981' : '#f43f5e';
  const categoryColor = tx.categoryColor || color;

  const date = new Date(tx.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const showNextDate = isIncome && tx.recurrence && tx.recurrence !== 'none';
  const nextDate = showNextDate
    ? getNextDate(tx).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const handleConfirm = () => {
    onConfirm(tx._id, parseFloat(confirmAmount) || tx.amount);
    setConfirming(false);
  };

  return (
    <div
      className="group rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: isPending ? 'rgba(99,102,241,0.05)' : isSkipped ? 'var(--bg-section)' : 'var(--bg-card)',
        border: isPending
          ? '1px dashed rgba(99,102,241,0.3)'
          : isSkipped
          ? '1px solid var(--border-sub)'
          : '1px solid var(--border)',
        opacity: isSkipped ? 0.45 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: `${categoryColor}18`, color: isPending ? '#6366f1' : categoryColor }}
          >
            {tx.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white text-sm truncate">{tx.name}</p>
              {isPending && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  pending
                </span>
              )}
              {isSkipped && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                  style={{ background: 'rgba(107,114,128,0.15)', color: '#6b7280' }}>
                  skipped
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-600">{tx.category}</span>
              <span className="text-[11px] text-gray-700">·</span>
              <span className="text-[11px] text-gray-600">{date}</span>
              {tx.recurrence !== 'none' && (
                <>
                  <span className="text-[11px] text-gray-700">·</span>
                  <div className="flex items-center gap-1">
                    <RefreshCw size={9} className="text-gray-600" />
                    <span className="text-[11px] text-gray-600">{RECURRENCE_LABELS[tx.recurrence]}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3 shrink-0">
          <p className="text-sm font-bold" style={{ color: isPending ? '#6366f1' : color }}>
            {isIncome ? '+' : '-'}{fmt(tx.amount)}
          </p>
          {!isPending && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(tx)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/10 transition-colors">
                <Pencil size={11} />
              </button>
              <button onClick={() => onDelete(tx._id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isPending && !confirming && (
        <div className="flex items-center gap-2 mt-3 ml-11">
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
          >
            <Check size={11} /> Confirm
          </button>
          <button
            onClick={() => onSkip(tx._id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}
          >
            <X size={11} /> Skip
          </button>
        </div>
      )}

      {isPending && confirming && (
        <div className="flex items-center gap-2 mt-3 ml-11">
          <span className="text-xs text-gray-500">₨</span>
          <input
            type="number"
            value={confirmAmount}
            onChange={(e) => setConfirmAmount(e.target.value)}
            className="w-32 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            autoFocus
          />
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
          >
            <Check size={11} /> Confirm
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {(tx.notes || nextDate) && (
        <div className="mt-2 ml-11 space-y-1">
          {nextDate && (
            <div className="flex items-center gap-1.5">
              <CalendarClock size={10} className="text-emerald-600 shrink-0" />
              <span className="text-[11px] text-emerald-700">Next salary: {nextDate}</span>
            </div>
          )}
          {tx.notes && <p className="text-[11px] text-gray-600 truncate">{tx.notes}</p>}
        </div>
      )}
    </div>
  );
}
