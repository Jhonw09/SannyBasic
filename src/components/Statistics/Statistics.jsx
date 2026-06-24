import { useEffect, useRef, useState } from 'react';
import { chartData } from '../../data/diseases';
import styles from './Statistics.module.css';

const facts = [
  { icon: '🇧🇷', stat: '35 milhões', desc: 'de brasileiros sem rede de esgoto (IBGE, Censo 2022)' },
  { icon: '💧', stat: '83% de cobertura', desc: 'de água tratada no Brasil — mas apenas 54% têm rede de esgoto (SNIS 2022)' },
  { icon: '👶', stat: '6 milhões', desc: 'de crianças brasileiras infectadas por Ascaris lumbricoides (FIOCRUZ)' },
  { icon: '🌊', stat: '10% de letalidade', desc: 'da leptospirose no Brasil — 3.800 casos/ano (MS/SINAN 2022)' },
];

const maxVal = Math.max(...chartData.map(d => d.deaths));

export default function Statistics() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={styles.section} id="estatisticas" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.pill}>📊 Dados OMS / OPAS / MS</span>
          <h2>Estatísticas no Brasil</h2>
          <p>Impacto real das doenças causadas pela falta de saneamento básico no país</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.chart}>
            <h3>Óbitos estimados por doença no Brasil (casos/ano)</h3>
            <div className={styles.bars}>
              {chartData.map((item, i) => {
                const pct = (item.deaths / maxVal) * 100;
                return (
                  <div
                    key={item.name}
                    className={styles.barGroup}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={styles.barWrap}>
                      {hovered === i && (
                        <div className={styles.tooltip}>
                          <strong>{item.name}</strong>
                          <span>{item.deaths} casos/ano</span>
                        </div>
                      )}
                      <div
                        className={styles.bar}
                        style={{
                          height: visible ? `${Math.max(pct, 4)}%` : '0%',
                          background: item.color,
                          boxShadow: hovered === i ? `0 0 20px ${item.color}88` : 'none',
                        }}
                      />
                    </div>
                    <span className={styles.barLabel}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.facts}>
            {facts.map(({ icon, stat, desc }) => (
              <div key={stat} className={styles.factCard}>
                <span className={styles.factIcon}>{icon}</span>
                <div>
                  <strong>{stat}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
