import { useState, useMemo } from 'react';
import { diseases } from '../../data/diseases';
import styles from './Diseases.module.css';

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'hidrica', label: '💧 Hídricas' },
  { key: 'alimentar', label: '🍽️ Alimentares' },
  { key: 'viral', label: '🦠 Virais' },
  { key: 'bacteriana', label: '🔬 Bacterianas' },
];

function DiseaseModal({ disease, onClose }) {
  if (!disease) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}>{disease.icon}</span>
          <div>
            <h2>{disease.name}</h2>
            <p className={styles.agent}>Agente: <strong>{disease.agent}</strong></p>
            <span
              className={styles.severityBadge}
              style={{ background: disease.severityColor + '22', color: disease.severityColor, border: `1px solid ${disease.severityColor}44` }}
            >
              Gravidade: {disease.severity}
            </span>
          </div>
        </div>

        <p className={styles.modalDesc}>{disease.description}</p>

        <div className={styles.modalGrid}>
          <div className={styles.modalSection}>
            <h4>🤒 Sintomas</h4>
            <ul>{disease.symptoms.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className={styles.modalSection}>
            <h4>🛡️ Prevenção</h4>
            <ul>{disease.prevention.map(p => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>

        <div className={styles.modalMeta}>
          <div><span>💀 Mortalidade Global</span><strong>{disease.globalDeaths}</strong></div>
          <div><span>🔗 Transmissão</span><strong>{disease.transmission}</strong></div>
          <div><span>💊 Tratamento</span><strong>{disease.treatment}</strong></div>
        </div>

        <div className={styles.funFact}>
          <span>💡</span>
          <p><strong>Você sabia?</strong> {disease.funFact}</p>
        </div>

        {disease.brazilData && (
          <div className={styles.funFact} style={{ background: 'rgba(34,197,94,0.07)', borderColor: 'rgba(34,197,94,0.2)', marginTop: '12px' }}>
            <span>🇧🇷</span>
            <p><strong>No Brasil:</strong> {disease.brazilData}</p>
          </div>
        )}

        {disease.alert && (
          <div className={styles.funFact} style={{ background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.25)', marginTop: '12px' }}>
            <span>⚠️</span>
            <p><strong>Quando procurar médico:</strong> {disease.alert}</p>
          </div>
        )}

        {disease.source && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '12px' }}>
            📚 Fonte: {disease.source}
          </p>
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
    return diseases.filter((d) => {
      const matchFilter = activeFilter === 'all' || d.type.includes(activeFilter);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.agent.toLowerCase().includes(q) ||
        d.symptoms.some(s => s.toLowerCase().includes(q)) ||
        d.type.some(t => t.includes(q));
      return matchFilter && matchSearch;
    });
  }, [activeFilter, search]);

  return (
    <section className={styles.section} id="doencas">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>5 Doenças Catalogadas</h2>
          <p className={styles.subtitle}>Clique em uma doença para ver detalhes completos</p>
        </div>

        <div className={styles.searchWrap}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar por doença, sintoma ou agente..."
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

        <div className={styles.count}>
          Exibindo <strong>{filtered.length}</strong> de {diseases.length} doenças
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
              <p className={styles.cardDesc}>{disease.description.slice(0, 90)}...</p>
              <div className={styles.cardTags}>
                {disease.type.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
              <button className={styles.cardBtn}>Ver detalhes →</button>
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
