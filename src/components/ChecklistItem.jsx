// ChecklistItem - reusable checklist row
import { useLanguage } from '../context/LanguageContext';

export default function ChecklistItem({ item, onToggle, onRemove }) {
  const { t } = useLanguage();

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(item.id);
    }
  }

  return (
    <li className={`checklist-item ${item.done ? 'is-done' : ''}`}>
      <label className="checklist-label">
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggle(item.id)}
          onKeyDown={handleKey}
          aria-label={item.text}
        />
        <span className="checklist-text">{item.text}</span>
      </label>
      <button
        type="button"
        className="btn-remove"
        onClick={() => onRemove(item.id)}
        aria-label={`${t('common.remove')} ${item.text}`}
        title={t('common.remove')}
      >
        ✕
      </button>
    </li>
  );
}
