import { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionCard from './TransactionCard';
import TransactionForm from './TransactionForm';
import Modal from './Modal';

const FILTERS = ['all', 'income', 'expense'];

export default function TransactionsSection({ transactions, onAdd, onUpdate, onDelete, onConfirm, onSkip }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const pendingCount = transactions.filter((t) => t.status === 'pending').length;
  const filtered = (filter === 'all' ? transactions : transactions.filter((t) => t.type === filter))
    .filter((t) => t.status !== 'skipped' || filter !== 'all');

  const handleSubmit = async (data) => {
    if (editing) {
      await onUpdate(editing._id, data);
    } else {
      await onAdd(data);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleEdit = (tx) => {
    setEditing(tx);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditing(null);
  };

  const filterColors = {
    all: { active: '#a78bfa', activeBg: 'rgba(167,139,250,0.15)' },
    income: { active: '#10b981', activeBg: 'rgba(16,185,129,0.15)' },
    expense: { active: '#f43f5e', activeBg: 'rgba(244,63,94,0.15)' },
  };

  return (
    <>
      <div
        className="rounded-2xl flex flex-col"
        style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <div>
            <h2 className="text-sm font-semibold text-white">Transactions</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-600">{transactions.length} total</p>
              {pendingCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  {pendingCount} pending
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-input)' }}>
              {FILTERS.map((f) => {
                const isActive = filter === f;
                const { active, activeBg } = filterColors[f];
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-150"
                    style={
                      isActive
                        ? { background: activeBg, color: active }
                        : { color: 'var(--text-muted)' }
                    }
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-violet-600/80 hover:bg-violet-600 transition-colors"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[480px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Plus size={18} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">No transactions yet</p>
              <p className="text-xs text-gray-700 mt-1">Add your first transaction above</p>
            </div>
          ) : (
            filtered.map((tx) => (
              <TransactionCard
                key={tx._id}
                tx={tx}
                onEdit={handleEdit}
                onDelete={onDelete}
                onConfirm={onConfirm}
                onSkip={onSkip}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Transaction' : 'New Transaction'}
          onClose={handleClose}
        >
          <TransactionForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </Modal>
      )}
    </>
  );
}
