import { useState } from 'react';
import { Plus } from 'lucide-react';
import SubscriptionCard from './SubscriptionCard';
import SubscriptionForm from './SubscriptionForm';
import Modal from './Modal';

export default function SubscriptionsSection({ subscriptions, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSubmit = async (data) => {
    if (editing) {
      await onUpdate(editing._id, data);
    } else {
      await onAdd(data);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleEdit = (sub) => {
    setEditing(sub);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditing(null);
  };

  const active = subscriptions.filter((s) => s.isActive).length;

  return (
    <>
      <div
        className="rounded-2xl flex flex-col"
        style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <div>
            <h2 className="text-sm font-semibold text-white">Subscriptions</h2>
            <p className="text-xs text-gray-600 mt-0.5">{active} active</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-violet-600/80 hover:bg-violet-600 transition-colors"
          >
            <Plus size={12} />
            Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[480px]">
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Plus size={18} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">No subscriptions yet</p>
              <p className="text-xs text-gray-700 mt-1">Add your first subscription above</p>
            </div>
          ) : (
            subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub._id}
                sub={sub}
                onEdit={handleEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Subscription' : 'New Subscription'}
          onClose={handleClose}
        >
          <SubscriptionForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </Modal>
      )}
    </>
  );
}
