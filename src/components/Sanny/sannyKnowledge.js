import { diseases, chartData, heroStats } from '../../data/diseases.js';

// Gera tips dinamicamente a partir do diseases.js
function buildDiseasesTips() {
  const tips = [];

  diseases.forEach(d => {
    const name = d.name.toLowerCase();
    const icon = d.icon;

    // Tip geral da doença
    tips.push({
      q: name,
      a: `${d.description} ${icon} — Fonte: ${d.source}`,
      link: '#doencas',
      source: d.source,
    });

    // Sintomas
    tips.push({
      q: `sintomas ${name}`,
      a: `Sintomas de ${d.name}: ${d.symptoms.slice(0, 4).join('; ')}. ${d.alert} — Fonte: ${d.source}`,
      link: '#doencas',
      source: d.source,
    });

    // Transmissão
    tips.push({
      q: `transmissao ${name}`,
      a: `Como se pega ${d.name}: ${d.transmission} — Fonte: ${d.source}`,
      link: '#doencas',
      source: d.source,
    });

    // Prevenção
    tips.push({
      q: `prevencao ${name}`,
      a: `Como prevenir ${d.name}: ${d.prevention.slice(0, 3).join('; ')}. — Fonte: ${d.source}`,
      link: '#prevencao',
      source: d.source,
    });

    // Tratamento
    tips.push({
      q: `tratamento ${name}`,
      a: `Tratamento de ${d.name}: ${d.treatment} — Fonte: ${d.source}`,
      link: '#doencas',
      source: d.source,
    });

    // Dados do Brasil
    if (d.brazilData) {
      tips.push({
        q: `brasil ${name}`,
        a: `${d.name} no Brasil: ${d.brazilData} 🇧🇷 — Fonte: ${d.source}`,
        link: '#estatisticas',
        source: d.source,
      });
    }

    // Alerta
    if (d.alert) {
      tips.push({
        q: `alerta ${name}`,
        a: `⚠️ Alerta sobre ${d.name}: ${d.alert} — Fonte: ${d.source}`,
        link: '#doencas',
        source: d.source,
      });
    }

    // Agente causador
    tips.push({
      q: `agente ${name}`,
      a: `${d.name} é causada por: ${d.agent}. Período de incubação: ${d.incubation}. ${icon}`,
      link: '#doencas',
      source: d.source,
    });

    // Mortalidade global
    if (d.globalDeaths) {
      tips.push({
        q: `mortalidade ${name}`,
        a: `Mortalidade global de ${d.name}: ${d.globalDeaths} — Fonte: ${d.source}`,
        link: '#estatisticas',
        source: d.source,
      });
    }
  });

  return tips;
}

// Tips de estatísticas gerais a partir do chartData e heroStats
function buildStatsTips() {
  const casesStr = chartData
    .filter(c => c.cases > 0)
    .map(c => `${c.name}: ${c.cases.toLocaleString('pt-BR')} casos (${c.source})`)
    .join('; ');

  return [
    {
      q: 'estatisticas casos brasil',
      a: `Casos notificados no Brasil em 2023: ${casesStr}. 📊`,
      link: '#estatisticas',
      source: 'MS/SINAN 2023, ANVISA 2023',
    },
    {
      q: 'saneamento brasil',
      a: `${heroStats[0].value} milhões de brasileiros sem rede de esgoto (${heroStats[0].label}). Sem saneamento, doenças como cólera, hepatite A e febre tifoide se espalham facilmente. 🚰`,
      link: '#historia',
      source: 'IBGE Censo 2022',
    },
  ];
}

// Tips manuais com dados de fontes específicas (OPAS, OMS, ANVISA, MS)
const manualTips = [
  // OPAS
  { q: 'opas colera americas', a: 'A OPAS alerta: 95% da América Latina ainda tem risco de surtos de cólera pelo déficit de saneamento. Em 2023, foram 700 mil casos nas Américas. 🌎 — Fonte: OPAS Alerta Epidemiológico Cólera 2024', link: '#doencas', source: 'OPAS 2024' },
  { q: 'opas saneamento', a: 'Segundo a OPAS, o déficit de saneamento básico é o principal fator de risco para doenças hídricas nas Américas. 35 milhões de brasileiros ainda não têm rede de esgoto. — Fonte: OPAS 2024', link: '#historia', source: 'OPAS 2024' },
  // OMS
  { q: 'oms colera mortalidade', a: 'A OMS estima 21.000 a 143.000 mortes por cólera por ano no mundo — a variação reflete subnotificação em países pobres. Com reidratação adequada, a mortalidade cai de 50% para menos de 1%! 💧 — Fonte: OMS Weekly Epidemiological Record 2024', link: '#doencas', source: 'OMS 2024' },
  { q: 'oms giardia mundo', a: 'A OMS estima 280 milhões de infecções por giardíase por ano — é a parasitose intestinal mais comum do mundo. — Fonte: OMS Diarrhoeal Diseases Fact Sheet 2024', link: '#doencas', source: 'OMS 2024' },
  { q: 'oms hepatite e', a: 'A OMS estima 20 milhões de infecções por HEV por ano, com 44.000 mortes. Em gestantes, a mortalidade pode chegar a 25%. — Fonte: OMS Hepatitis E Fact Sheet 2024', link: '#doencas', source: 'OMS 2024' },
  { q: 'oms leptospirose', a: 'A OMS estima 58.900 mortes por leptospirose por ano no mundo. É a zoonose mais disseminada globalmente. — Fonte: OMS Leptospirosis Burden Epidemiology Reference Group', link: '#doencas', source: 'OMS 2023' },
  { q: 'oms febre tifoide', a: 'A OMS estima 128.000 mortes por febre tifoide por ano. A resistência a antibióticos é crescente e preocupante globalmente. — Fonte: OMS 2019', link: '#doencas', source: 'OMS 2019' },
  { q: 'oms ecoli alimentos', a: 'A OMS estima que doenças de origem alimentar (incluindo E. coli) causam 420.000 mortes por ano no mundo. — Fonte: OMS 2015', link: '#doencas', source: 'OMS 2015' },
  // ANVISA
  { q: 'anvisa surtos alimentares', a: 'A ANVISA registrou 1.030 surtos de doenças transmitidas por alimentos no Brasil em 2023, com E. coli entre os principais agentes. — Fonte: ANVISA Surtos de DTA 2023', link: '#estatisticas', source: 'ANVISA 2023' },
  { q: 'anvisa ecoli shu', a: 'Segundo a ANVISA, a SHU causada pela E. coli O157 é a principal causa de insuficiência renal aguda adquirida na comunidade em crianças no Brasil. — Fonte: ANVISA 2023', link: '#doencas', source: 'ANVISA 2023' },
  // MS / SINAN
  { q: 'ms hepatite a vacinacao', a: 'Após a inclusão da vacina contra Hepatite A no calendário infantil em 2014, os casos em crianças caíram mais de 70% no Brasil. — Fonte: MS Boletim Epidemiológico Hepatites Virais 2024', link: '#prevencao', source: 'MS 2024' },
  { q: 'ms leptospirose rs', a: 'Em 2024, as enchentes do RS geraram surto de leptospirose com mais de 600 casos notificados. — Fonte: MS/SINAN 2024', link: '#doencas', source: 'MS/SINAN 2024' },
  { q: 'ms norte nordeste', a: 'Norte e Nordeste concentram 70% dos casos de febre tifoide e 40% dos casos de Hepatite A no Brasil — reflexo direto do menor acesso ao saneamento. — Fonte: MS/SINAN 2023', link: '#estatisticas', source: 'MS/SINAN 2023' },
  // IBGE / SNIS
  { q: 'ibge saneamento esgoto', a: 'O IBGE (Censo 2022) aponta que 35 milhões de brasileiros ainda não têm acesso à rede de esgoto. O SNIS 2023 mostra que apenas 55% do esgoto gerado no Brasil é tratado. 🚰', link: '#historia', source: 'IBGE Censo 2022 / SNIS 2023' },
  // Prevenção geral
  { q: 'lavar maos', a: 'Lavar as mãos por 20 segundos com água e sabão é a medida mais eficaz contra hepatite A, E. coli, giardíase e febre tifoide. Faça isso antes de comer e após o banheiro! 🙌 — Fonte: OMS / MS', link: '#prevencao', source: 'OMS / MS' },
  { q: 'agua tratada fervida', a: 'Ferver a água por 1 minuto elimina vírus, bactérias e cistos de Giardia. Filtros com poros < 1 micrômetro também eliminam cistos. O cloro convencional NÃO elimina Giardia! 💧 — Fonte: OMS / MS', link: '#prevencao', source: 'OMS / MS' },
  { q: 'vacina hepatite a sus', a: 'A vacina contra Hepatite A está disponível no SUS para crianças de 15 meses. Após 2014, os casos em crianças caíram mais de 70%! 💉 — Fonte: MS 2024', link: '#prevencao', source: 'MS 2024' },
];

export const knowledgeBase = [
  ...buildDiseasesTips(),
  ...buildStatsTips(),
  ...manualTips,
];
