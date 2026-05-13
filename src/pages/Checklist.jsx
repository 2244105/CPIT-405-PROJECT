// Checklist - bilingual checklist with templates (incl. Hospitality)
import { useEffect, useState } from 'react';
import ChecklistItem from '../components/ChecklistItem';
import { fetchWeather, evaluateKashtaSafety } from '../services/weatherApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Template definitions per language
// Each template has a translation key for its name and a language-specific item list
const TEMPLATES = {
  bbq: {
    nameKey: 'tplBbq',
    icon: '🔥',
    items: {
      en: [
        'Firewood / Charcoal',
        'BBQ grill',
        'Meat & marinades',
        'Aluminum foil & skewers',
        'Lighter / matches',
        'Drinks (water, juice)',
        'Disposable plates & cups',
        'Trash bags',
      ],
      ar: [
        'حطب / فحم',
        'منقل (شواية)',
        'لحم وتتبيلات',
        'قصدير وأسياخ',
        'ولّاعة / كبريت',
        'مشروبات (ماء، عصير)',
        'صحون وكاسات للاستعمال',
        'أكياس قمامة',
      ],
    },
  },
  camp: {
    nameKey: 'tplCamp',
    icon: '⛺',
    items: {
      en: [
        'Tent & pegs',
        'Sleeping bags / blankets',
        'Carpets / floor mats',
        'Flashlights / lanterns',
        'Power bank',
        'First aid kit',
        'Warm clothing',
        'Food & water (2 days)',
        'Trash bags',
      ],
      ar: [
        'خيمة وأوتاد',
        'أكياس نوم / بطانيات',
        'فرش / موكيت',
        'كشّافات / فوانيس',
        'باور بانك',
        'حقيبة إسعافات أولية',
        'ملابس دافية',
        'طعام وماء (يومين)',
        'أكياس قمامة',
      ],
    },
  },
  tea: {
    nameKey: 'tplTea',
    icon: '☕',
    items: {
      en: [
        'Tea / coffee / cardamom',
        'Sugar',
        'Kettle',
        'Cups',
        'Dates / sweets',
        'Small carpet',
        'Charcoal & coals',
      ],
      ar: [
        'شاهي',
        'سكر',
        'براد شاهي',
        'فناجيل وكاسات',
        'تمر / حلى',
        'فرشة صغيرة',
        'فحم وجمر',
      ],
    },
  },
  hospitality: {
    nameKey: 'tplHospitality',
    icon: '☕',
    items: {
      en: [
        'Coffee pot (Dallah)',
        'Cardamom',
        'Tea',
        'Tea kettle',
        'Cups (Fanjeel)',
      ],
      ar: [
        'دلة قهوة',
        'هيل',
        'شاهي',
        'براد شاهي',
        'فناجيل',
      ],
    },
  },
};

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export default function Checklist() {
  const { currentUser } = useAuth();
  const { t, lang } = useLanguage();
  const storageKey = `kashta-checklist-${currentUser?.uid || 'guest'}`;
  const tripNameKey = `kashta-tripname-${currentUser?.uid || 'guest'}`;

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [tripName, setTripName] = useState(() => {
    return localStorage.getItem(tripNameKey) || '';
  });
  const [newItem, setNewItem] = useState('');
  const [shareLocation, setShareLocation] = useState('');
  const [shareError, setShareError] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  useEffect(() => {
    localStorage.setItem(tripNameKey, tripName);
  }, [tripName, tripNameKey]);

  function addItem(text) {
    const tx = text.trim();
    if (!tx) return;
    setItems((prev) => [...prev, { id: newId(), text: tx, done: false }]);
  }

  function handleAddSubmit(e) {
    e.preventDefault();
    addItem(newItem);
    setNewItem('');
  }

  function toggleItem(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function loadTemplate(key) {
    const tpl = TEMPLATES[key];
    if (!tpl) return;
    // Use current language's items; avoid duplicates
    const tplItems = tpl.items[lang] || tpl.items.en;
    const existingTexts = new Set(items.map((i) => i.text.toLowerCase()));
    const additions = tplItems
      .filter((tx) => !existingTexts.has(tx.toLowerCase()))
      .map((tx) => ({ id: newId(), text: tx, done: false }));
    setItems((prev) => [...prev, ...additions]);
  }

  function clearAll() {
    if (items.length === 0) return;
    if (window.confirm(t('checklist.clearConfirm'))) setItems([]);
  }

  // Build WhatsApp share text using current language and given weather
  function buildShareText(weatherData) {
    const lines = [];
    const header = t('checklist.shareHeader');
    lines.push(`🏕️ *${header}${tripName ? `: ${tripName}` : ''}*`);
    lines.push('');

    if (weatherData) {
      const safety = evaluateKashtaSafety(weatherData);
      const safetyMsg =
        safety.level === 'good'
          ? t('dashboard.safetyGood')
          : safety.level === 'caution'
          ? t('dashboard.safetyCaution')
          : t('dashboard.safetyDanger');
      lines.push(`📍 *${t('checklist.shareLocation')}:* ${weatherData.city}`);
      lines.push(`🌡️ *${t('checklist.shareTemp')}:* ${weatherData.temperature}°C`);
      lines.push(`💨 *${t('checklist.shareWind')}:* ${weatherData.windSpeed} km/h`);
      lines.push(`👁️ *${t('checklist.shareVis')}:* ${weatherData.visibility} km`);
      lines.push(`☁️ *${t('checklist.shareCond')}:* ${weatherData.description}`);
      const safetyIcon = safety.level === 'good' ? '✅' : safety.level === 'caution' ? '⚠️' : '🚫';
      lines.push(`${safetyIcon} ${safetyMsg}`);
      lines.push('');
    }

    if (items.length > 0) {
      lines.push(`*🧰 ${t('checklist.shareGearChecklist')}:*`);
      items.forEach((it) => lines.push(`${it.done ? '✅' : '⬜'} ${it.text}`));
      lines.push('');
      const done = items.filter((i) => i.done).length;
      lines.push(`_${t('checklist.shareProgress')}: ${done}/${items.length}_`);
    }

    lines.push('');
    lines.push(t('checklist.shareSentVia'));
    return lines.join('\n');
  }

  async function handleShare() {
    setShareError('');
    if (items.length === 0 && !shareLocation.trim()) {
      setShareError(t('checklist.errAddItems'));
      return;
    }

    try {
      setSharing(true);
      let weatherData = null;
      if (shareLocation.trim()) {
        weatherData = await fetchWeather(shareLocation, lang);
      }
      const text = buildShareText(weatherData);
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      // Use simple translated error
      let msg;
      switch (err.message) {
        case 'NOT_FOUND': msg = t('dashboard.errLocationNotFound'); break;
        case 'MISSING_KEY': msg = t('dashboard.errMissingKey'); break;
        case 'NETWORK': msg = t('dashboard.errNetwork'); break;
        default: msg = err.message;
      }
      setShareError(msg);
    } finally {
      setSharing(false);
    }
  }

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <main className="checklist-page">
      <header className="page-header">
        <h1 className="page-title">{t('checklist.title')} 📋</h1>
        <input
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder={t('checklist.tripNamePlaceholder')}
          className="trip-name-input"
          aria-label={t('checklist.tripNamePlaceholder')}
          maxLength={50}
        />
      </header>

      {/* Templates */}
      <section className="templates-section" aria-labelledby="tpl-title">
        <h2 id="tpl-title" className="section-subtitle">{t('checklist.templatesTitle')}</h2>
        <div className="templates-grid">
          {Object.entries(TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              type="button"
              className="template-btn"
              onClick={() => loadTemplate(key)}
              aria-label={`${t('common.add')} ${t('checklist.' + tpl.nameKey)}`}
            >
              <span className="template-icon" aria-hidden="true">{tpl.icon}</span>
              <span className="template-name">{t('checklist.' + tpl.nameKey)}</span>
              <span className="template-count">
                {(tpl.items[lang] || tpl.items.en).length} {t('checklist.items')}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Progress */}
      {items.length > 0 && (
        <section className="progress-section" aria-label="Progress">
          <div className="progress-header">
            <span>{t('checklist.progressPacked')}: {doneCount} / {items.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </section>
      )}

      {/* Add new item */}
      <form className="add-item-form" onSubmit={handleAddSubmit}>
        <label htmlFor="new-item" className="visually-hidden">{t('checklist.addItemPlaceholder')}</label>
        <input
          id="new-item"
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={t('checklist.addItemPlaceholder')}
          className="add-item-input"
          maxLength={80}
        />
        <button type="submit" className="btn btn-primary" disabled={!newItem.trim()}>
          {t('checklist.addBtn')}
        </button>
      </form>

      {/* List */}
      <section aria-labelledby="list-title">
        <div className="list-header">
          <h2 id="list-title" className="section-subtitle">{t('checklist.gearList')}</h2>
          {items.length > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
              {t('checklist.clearAll')}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">🎒</div>
            <p>{t('checklist.empty')}</p>
          </div>
        ) : (
          <ul className="checklist" aria-label={t('checklist.gearList')}>
            {items.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onToggle={toggleItem}
                onRemove={removeItem}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Share */}
      <section className="share-section" aria-labelledby="share-title">
        <h2 id="share-title" className="section-subtitle">{t('checklist.shareTitle')} 💬</h2>
        <p className="share-help">{t('checklist.shareHelp')}</p>
        <div className="share-controls">
          <input
            type="text"
            value={shareLocation}
            onChange={(e) => setShareLocation(e.target.value)}
            placeholder={t('checklist.shareLocationPlaceholder')}
            className="share-location-input"
            aria-label={t('checklist.shareLocationPlaceholder')}
          />
          <button
            type="button"
            className="btn btn-whatsapp"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? t('checklist.sharing') : `📲 ${t('checklist.shareBtn')}`}
          </button>
        </div>
        {shareError && (
          <div className="error-banner" role="alert">⚠️ {shareError}</div>
        )}
      </section>
    </main>
  );
}
