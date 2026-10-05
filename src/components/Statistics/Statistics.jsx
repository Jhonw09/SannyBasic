import { useEffect, useRef, useState } from 'react';
import { chartData } from '../../data/diseases';
import styles from './Statistics.module.css';

// Dados estáticos atualizados (2023/2024) com fonte e URL
const STATIC_FACTS = [
  {
    icon: '🇧🇷',
    stat: null, // preenchido via API
    statFallback: '35 milhões',
    desc: 'de brasileiros sem rede de esgoto',
    sourceLabel: 'IBGE, Censo 2022',
    sourceUrl: 'https://www.ibge.gov.br/estatisticas/sociais/habitacao/22827-censo-demografico-2022.html',
    apiKey: 'esgoto',
  },
  {
    icon: '💧',
    stat: '54,2%',
    desc: 'da população com acesso à rede de esgoto — meta ODS 6 ainda distante',
    sourceLabel: 'SNIS 2023',
    sourceUrl: 'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/snis',
  },
  {
    icon: '🌊',
    stat: '3.966 casos',
    desc: 'de leptospirose notificados no Brasil em 2023, com letalidade de ~10%',
    sourceLabel: 'MS/SINAN 2023',
    sourceUrl: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/l/leptospirose',
  },
  {
    icon: '🫀',
    stat: '7.541 casos',
    desc: 'de Hepatite A confirmados no Brasil em 2023',
    sourceLabel: 'MS/SINAN 2023',
    sourceUrl: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hepatites-virais/publicacoes/boletins-epidemiologicos',
  },
];

const maxVal = Math.max(...chartData.map(d => d.cases));

export default function Statistics() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [facts, setFacts] = useState(STATIC_FACTS);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  // Busca dado de esgoto via API IBGE
  useEffect(() => {
    async function fetchIBGE() {
      try {
        // Indicador 7396 = % domicílios com esgotamento sanitário adequado (PNAD Contínua)
        const res = await fetch(
          'https://servicodados.ibge.gov.br/api/v3/agregados/7396/periodos/2023|2022/variaveis/7396?localidades=N1[all]',
          { signal: AbortSignal.timeout(5000) }
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        const resultados = json?.[0]?.resultados?.[0]?.series?.[0]?.serie;
        // Pega o ano mais recente disponível
        const anos = resultados ? Object.keys(resultados).sort().reverse() : [];
        const valor = anos.length ? resultados[anos[0]] : null;

        if (valor && valor !== '-') {
          const pct = parseFloat(valor).toFixed(1);
          setFacts(prev => prev.map(f =>
            f.apiKey === 'esgoto'
              ? {
                  ...f,
                  stat: `${pct}%`,
                  desc: `dos domicílios brasileiros com esgotamento sanitário adequado (${anos[0]})`,
                  sourceLabel: `IBGE/PNAD Contínua ${anos[0]}`,
                  sourceUrl: 'https://sidra.ibge.gov.br/tabela/7396',
                }
              : f
          ));
        }
      } catch {
        // mantém fallback
        setFacts(prev => prev.map(f =>
          f.apiKey === 'esgoto' ? { ...f, stat: f.statFallback } : f
        ));
      } finally {
        setLoading(false);
      }
    }
    fetchIBGE();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={styles.section} id="estatisticas" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.pill}>📊 Dados OMS / OPAS / MS / IBGE</span>
          <h2>Estatísticas no Brasil</h2>
          <p>Impacto real das doenças causadas pela falta de saneamento básico no país</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.chart}>
            <h3>Casos/ano por doença no Brasil</h3>
            <div className={styles.bars}>
              {chartData.map((item, i) => {
                const pct = (item.cases / maxVal) * 100;
                return (
                  <div
                    key={item.name}
                    className={styles.barGroup}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className={styles.barWrap}>
                      {hovered === i && (
                        <div className={styles.tooltip}>
                          <strong>{item.name}</strong>
                          <span>{item.cases === 0 ? item.source : `${item.cases.toLocaleString('pt-BR')} casos/ano`}</span>
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
            {facts.map(({ icon, stat, statFallback, desc, sourceLabel, sourceUrl }) => {
              const display = stat ?? statFallback;
              return (
                <div key={sourceLabel} className={styles.factCard}>
                  <span className={styles.factIcon}>{icon}</span>
                  <div>
                    <strong>
                      {loading && !stat ? (
                        <span className={styles.skeleton} />
                      ) : display}
                    </strong>
                    <p>{desc}</p>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sourceLink}
                    >
                      📎 {sourceLabel} ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
