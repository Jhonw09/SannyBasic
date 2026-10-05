import { useState, useMemo } from 'react';
import { diseases } from '../../data/diseases';
import styles from './Diseases.module.css';

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'hidrica', label: '💧 Hídricas' },
  { key: 'alimentar', label: '🍽️ Alimentares' },
  { key: 'viral', label: '🦠 Virais' },
  { key: 'bacteriana', label: '🔬 Bacterianas' },
  { key: 'parasitaria', label: '🧫 Parasitárias' },
];

const TABS = ['Visão Geral', 'Sintomas', 'Prevenção', 'Tratamento'];

function DiseaseModal({ disease, onClose }) {
  const [tab, setTab] = useState(0);
  if (!disease) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}>{disease.icon}</span>
          <div>
            <h2>{disease.name}</h2>
            <p className={styles.agent}>{disease.agent}</p>
            <span
              className={styles.severityBadge}
              style={{ background: disease.severityColor + '22', color: disease.severityColor, border: `1px solid ${disease.severityColor}44` }}
            >
              {disease.severity}
            </span>
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`${styles.tabBtn} ${tab === i ? styles.tabActive : ''}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {tab === 0 && (
            <div className={styles.overviewTab}>
              <p className={styles.modalDesc}>{disease.description}</p>
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <span>💀</span>
                  <div>
                    <small>Mortalidade Global</small>
                    <strong>{disease.globalDeaths}</strong>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <span>🔗</span>
                  <div>
                    <small>Transmissão</small>
                    <strong>{disease.transmission}</strong>
                  </div>
                </div>
              </div>
              {disease.funFact && (
                <div className={styles.factBox}>
                  <span>💡</span>
                  <p><strong>Você sabia?</strong> {disease.funFact}</p>
                </div>
              )}
              {disease.brazilData && (
                <div className={`${styles.factBox} ${styles.factBrazil}`}>
                  <span>🇧🇷</span>
                  <p><strong>No Brasil:</strong> {disease.brazilData}</p>
                </div>
              )}
            </div>
          )}

          {tab === 1 && (
            <ul className={styles.listTab}>
              {disease.symptoms.map((s, i) => (
                <li key={i}>
                  <span className={styles.listNum}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          )}

          {tab === 2 && (
            <ul className={styles.listTab}>
              {disease.prevention.map((p, i) => (
                <li key={i}>
                  <span className={styles.listCheck}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
          )}

          {tab === 3 && (
            <div className={styles.overviewTab}>
              <p className={styles.modalDesc}>{disease.treatment}</p>
              {disease.alert && (
                <div className={`${styles.factBox} ${styles.factAlert}`}>
                  <span>⚠️</span>
                  <p><strong>Quando procurar médico:</strong> {disease.alert}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {disease.source && (
          disease.sourceUrl
            ? <a href={disease.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.source}>📎 {disease.source} ↗</a>
            : <p className={styles.source}>📎 {disease.source}</p>
        )}
      </div>
    </div>
  );
}

export default function Diseases() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return diseases
      .filter((d) => {
        const matchFilter = activeFilter === 'all' || d.type.includes(activeFilter);
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.agent.toLowerCase().includes(q) ||
          d.type.some(t => t.includes(q));
        return matchFilter && matchSearch;
      })
      .sort((a, b) => (b.riskLevel || 0) - (a.riskLevel || 0));
  }, [activeFilter, search]);

  return (
    <section className={styles.section} id="doencas">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.pill}>🦠 Doenças</span>
          <h2>{diseases.length} Doenças Catalogadas</h2>
          <p>Clique em uma doença para explorar sintomas, prevenção e tratamento</p>
        </div>

        <div className={styles.searchWrap}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar doença ou agente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}>✕</button>}
        </div>

        <div className={styles.filters}>
          {filters.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${activeFilter === key ? styles.active : ''}`}
              onClick={() => setActiveFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((disease) => (
            <div
              key={disease.id}
              className={styles.card}
              onClick={() => setSelected(disease)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{disease.icon}</span>
                <span
                  className={styles.severityTag}
                  style={{ color: disease.severityColor, background: disease.severityColor + '18' }}
                >
                  {disease.severity}
                </span>
              </div>

              <h3 className={styles.cardName}>{disease.name}</h3>
              <p className={styles.cardAgent}>{disease.agent}</p>

              <div className={styles.symptomPills}>
                {disease.symptoms.slice(0, 3).map((s, i) => (
                  <span key={i} className={styles.symptomPill}>
                    {s.split('—')[0].split('(')[0].trim().slice(0, 32)}
                  </span>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.cardTags}>
                  {disease.type.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
                <span className={styles.cardArrow}>→</span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <span>🔎</span>
              <p>Nenhuma doença encontrada para "<strong>{search}</strong>"</p>
            </div>
          )}
        </div>
      </div>

      <DiseaseModal disease={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
