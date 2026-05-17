import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { getCategories, createCategory } from '../services/api';

const COLOR_PALETTE = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#f43f5e',
  '#06b6d4', '#ec4899', '#f97316', '#6366f1', '#84cc16',
  '#14b8a6', '#6b7280',
];

export default function CategoryPicker({ scope, selected, onChange }) {
  const [categories, setCategories] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLOR_PALETTE[0]);

  useEffect(() => {
    setAdding(false);
    getCategories(scope).then((res) => {
      setCategories(res.data);
    });
  }, [scope]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const res = await createCategory({ name: newName.trim(), color: newColor, scope });
    const cat = res.data;
    setCategories((prev) => [...prev, cat]);
    onChange(cat.name, cat.color);
    setAdding(false);
    setNewName('');
    setNewColor(COLOR_PALETTE[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => {
          const isSelected = selected === cat.name;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => onChange(cat.name, cat.color)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={
                isSelected
                  ? { background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}50` }
                  : { background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.color }} />
              {cat.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-400 transition-colors"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
        >
          <Plus size={10} />
          New
        </button>
      </div>

      {adding && (
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <input
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            autoFocus
          />
          <div className="flex gap-1 shrink-0">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className="w-4 h-4 rounded-full transition-all duration-150"
                style={{
                  background: c,
                  transform: newColor === c ? 'scale(1.35)' : 'scale(1)',
                  boxShadow: newColor === c ? `0 0 0 2px var(--bg-card), 0 0 0 3px ${c}` : 'none',
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-6 h-6 shrink-0 flex items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors"
          >
            <Check size={11} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
