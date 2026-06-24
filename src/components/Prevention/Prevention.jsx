import { useEffect, useRef, useState } from 'react';
import styles from './Prevention.module.css';

const tips = [
  {
    icon: '🙌',
    title: 'Lave as Mãos Corretamente',
    desc: 'A lavagem das mãos é a medida mais simples e eficaz contra todas as 5 doenças do site. O vírus da Hepatite A e as bactérias da Cólera, Febre Tifoide e E. coli sobrevivem nas mãos por horas.',
    pct: 95,
    pctLabel: 'Eficácia: redução de infecções fecal-orais (OMS)',
    diseases: ['Hepatite A', 'Cólera', 'Febre Tifoide', 'E. coli'],
    steps: [
      'Lave com água e sabão por pelo menos 20 segundos — o tempo de cantar "Parabéns pra você" duas vezes',
      'Esfregue entre os dedos, as palmas, o dorso das mãos e embaixo das unhas',
      'Lave sempre antes de comer, antes de preparar alimentos e após usar o banheiro',
      'Lave após contato com lixo, animais, terra, água de enchente ou qualquer superfície suspeita',
      'Se não houver água e sabão, use álcool em gel 70% — mas ele não substitui a lavagem com água',
      'Ensine as crianças desde cedo: a maioria das infecções por E. coli e Hepatite A ocorre por mãos sujas',
    ],
  },
  {
    icon: '💧',
    title: 'Trate e Armazene a Água com Segurança',
    desc: 'A água é a principal via de transmissão da Cólera, Hepatite A, Febre Tifoide e Leptospirose. Água com aparência limpa pode estar contaminada — vírus e bactérias são invisíveis a olho nu.',
    pct: 99,
    pctLabel: 'Eficácia: eliminação de patógenos pela fervura (OMS)',
    diseases: ['Cólera', 'Hepatite A', 'Febre Tifoide', 'Leptospirose'],
    steps: [
      'Ferva a água por pelo menos 1 minuto — isso elimina 100% dos vírus e bactérias causadores dessas doenças',
      'Use filtro com vela cerâmica ou carvão ativado, trocando a vela a cada 6 meses',
      'Se não tiver filtro nem gás, use 2 gotas de água sanitária (2,5% de cloro) por litro d\'água e aguarde 30 minutos',
      'Armazene a água filtrada em recipiente limpo, tampado e fora do alcance de insetos e animais',
      'Nunca use a mesma vasilha para pegar água tratada e água bruta',
      'Em áreas alagadas, descarte toda a água que entrou em contato com a enchente — mesmo que pareça limpa',
      'Não beba água de poços, rios ou nascentes sem tratamento, especialmente após chuvas',
    ],
  },
  {
    icon: '🥦',
    title: 'Higiene e Preparo dos Alimentos',
    desc: 'Alimentos mal higienizados e mal cozidos são a porta de entrada da E. coli, Salmonella (Febre Tifoide), Cólera e Hepatite A. A bactéria não muda o cheiro, o sabor nem a aparência do alimento.',
    pct: 88,
    pctLabel: 'Eficácia: redução de surtos por alimentos contaminados (ANVISA)',
    diseases: ['E. coli', 'Febre Tifoide', 'Cólera', 'Hepatite A'],
    steps: [
      'Lave frutas, verduras e legumes em água corrente e deixe de molho por 15 minutos em solução de hipoclorito: 1 colher de sopa de água sanitária para 1 litro de água',
      'Cozinhe carnes até que não haja partes rosadas — a temperatura interna deve atingir no mínimo 70°C',
      'Nunca consuma leite cru ou não pasteurizado, nem queijos artesanais de origem duvidosa',
      'Evite frutos do mar crus (ostras, mariscos, camarão): concentram naturalmente vírus e bactérias da água',
      'Use tábuas e facas separadas para carnes cruas e alimentos já prontos para consumo (contaminação cruzada)',
      'Não deixe alimentos fora da geladeira por mais de 2 horas — bactérias dobram a cada 20 minutos em temperatura ambiente',
      'Descarte alimentos com cheiro ou aparência alterados — mas lembre-se: contaminação por E. coli e Salmonella é frequentemente imperceptível',
      'Tampe sempre os alimentos para proteger de moscas e insetos — que transportam bactérias nas patas',
    ],
  },
  {
    icon: '💉',
    title: 'Vacinação em Dia',
    desc: 'A vacina é a forma mais eficaz de proteção individual. Contra a Hepatite A, uma das doenças mais comuns por falta de saneamento, a eficácia da vacina é superior a 95%.',
    pct: 96,
    pctLabel: 'Eficácia: vacina contra Hepatite A (MS/SUS)',
    diseases: ['Hepatite A', 'Febre Tifoide'],
    steps: [
      'Vacina contra Hepatite A: 2 doses, disponível gratuitamente no SUS para crianças a partir de 15 meses — protege por toda a vida',
      'Adultos não vacinados também devem se vacinar, especialmente quem trabalha com alimentos ou em áreas de risco',
      'Vacina contra Febre Tifoide: recomendada para quem vai viajar para regiões endêmicas (Norte e Nordeste do Brasil, África, Ásia)',
      'Não existe vacina disponível no Brasil para Cólera, Leptospirose ou E. coli — a prevenção depende de higiene e saneamento',
      'Mantenha a carteira de vacinação sempre atualizada e guarde-a em local seguro',
      'Leve seus filhos às consultas de puericultura — o médico avalia quais vacinas estão faltando',
    ],
  },
  {
    icon: '🦺',
    title: 'Proteção em Enchentes e Áreas de Risco',
    desc: 'Enchentes são o principal cenário de surtos de Leptospirose no Brasil. A água mistura esgoto, urina de rato e lama — criando condições ideais para a Leptospira entrar pelo corpo.',
    pct: 85,
    pctLabel: 'Eficácia: redução de risco com uso de EPI em enchentes (MS)',
    diseases: ['Leptospirose'],
    steps: [
      'Nunca entre em água de enchente sem proteção — use botas de borracha cano alto e luvas',
      'Cubra todos os ferimentos, cortes e arranhões com curativo impermeável antes de qualquer contato com água suspeita',
      'Após contato inevitável com água de enchente, lave imediatamente o corpo com água limpa e sabão',
      'Não nade em rios, córregos ou lagoas após chuvas fortes — a água pode estar contaminada com urina de roedores',
      'Lave e desinfete com água sanitária pisos e superfícies que ficaram alagados',
      'Fique atento nos dias seguintes: febre alta com dor intensa nas panturrilhas após contato com enchente são sinais de alerta da Leptospirose',
      'Se necessário trabalhar em área alagada, informe a empresa — ela é obrigada a fornecer EPI (Equipamento de Proteção Individual)',
    ],
  },
  {
    icon: '🐀',
    title: 'Controle de Roedores e Vetores',
    desc: 'O rato é o principal reservatório da Leptospira — ele carrega a bactéria sem adoecer e contamina o ambiente pela urina. Moscas e baratas transportam bactérias da Cólera, Febre Tifoide e E. coli nas patas.',
    pct: 80,
    pctLabel: 'Eficácia: redução de casos com controle de roedores (FUNASA)',
    diseases: ['Leptospirose', 'Cólera', 'Febre Tifoide', 'E. coli'],
    steps: [
      'Mantenha lixeiras sempre tampadas — lixo a céu aberto é o principal atrativo para ratos',
      'Descarte o lixo em sacos fechados e nos horários de coleta — não deixe acumular',
      'Tampe buracos em paredes, rodapés e ralos — ratos entram por espaços menores que 2 cm',
      'Não deixe restos de comida ou água acumulados — nem no quintal nem dentro de casa',
      'Guarde alimentos (inclusive ração de animais) em recipientes plásticos ou de vidro com tampa',
      'Mantenha o quintal limpo, sem entulho, madeiras empilhadas ou objetos que sirvam de abrigo para roedores',
      'Em caso de infestação, acione a prefeitura (CCZ — Centro de Controle de Zoonoses) — o serviço é gratuito',
      'Mantenha telas nas janelas e portas para evitar entrada de moscas e baratas',
    ],
  },
  {
    icon: '🚽',
    title: 'Saneamento e Descarte Correto',
    desc: 'A ausência de rede de esgoto é a raiz de todas as doenças desta página. 35 milhões de brasileiros ainda não têm acesso à rede de esgoto (IBGE 2022), expondo comunidades inteiras a Cólera, Hepatite A e Febre Tifoide.',
    pct: 82,
    pctLabel: 'Eficácia: redução de doenças com saneamento adequado (IBGE)',
    diseases: ['Cólera', 'Hepatite A', 'Febre Tifoide', 'Leptospirose'],
    steps: [
      'Use sempre o banheiro — nunca defèque a céu aberto, perto de rios, poços ou fontes de água',
      'Se não houver rede de esgoto, instale uma fossa séptica adequada — a Funasa oferece orientação gratuita',
      'Nunca jogue lixo em rios, córregos ou terrenos baldios — resíduos contaminam a água que abastece outras comunidades',
      'Descarte medicamentos vencidos em farmácias — não os jogue na pia ou no vaso sanitário',
      'Apoie e cobre dos representantes eleitos investimentos em saneamento básico no seu bairro',
      'Limpeza coletiva do bairro reduz a infestação de ratos e insetos — organize mutirões com vizinhos',
    ],
  },
  {
    icon: '🩺',
    title: 'Reconheça os Sinais de Alerta',
    desc: 'Saber identificar os primeiros sintomas faz a diferença entre um tratamento simples e uma internação grave. Muitas dessas doenças têm cura fácil se tratadas nas primeiras 48 a 72 horas.',
    pct: 78,
    pctLabel: 'Eficácia: redução de mortalidade com diagnóstico precoce (MS)',
    diseases: ['Hepatite A', 'Leptospirose', 'Cólera', 'Febre Tifoide', 'E. coli'],
    steps: [
      'Febre acima de 38°C que não cede após 2 dias — especialmente com dor de cabeça intensa, procure médico',
      'Urina muito escura (cor de chá ou Coca-Cola) com olhos amarelados: sinal de hepatite — vá ao pronto-socorro',
      'Diarreia intensa e frequente com vômitos: risco de desidratação grave — comece a reidratação oral e procure atendimento',
      'Dor muito forte nas panturrilhas com febre alta após contato com enchente ou água suspeita: pode ser leptospirose — urgência médica',
      'Febre alta por mais de 3 dias com dor abdominal — pode ser febre tifoide, não tome antibiótico por conta própria',
      'Diarreia com sangue em crianças: emergência — leve imediatamente ao pronto-socorro (risco de insuficiência renal)',
      'Informe sempre ao médico: o que comeu nos últimos dias, se teve contato com água de enchente e quais remédios tomou',
    ],
  },
  {
    icon: '🧼',
    title: 'Higiene Doméstica e Ambiental',
    desc: 'A limpeza do ambiente onde vivemos reduz a presença de vetores (moscas, baratas, ratos) que transportam patógenos causadores de Cólera, Febre Tifoide e E. coli diretamente para os alimentos.',
    pct: 76,
    pctLabel: 'Eficácia: redução de vetores com higiene ambiental (FUNASA)',
    diseases: ['Cólera', 'Febre Tifoide', 'E. coli', 'Leptospirose'],
    steps: [
      'Limpe a casa com água sanitária diluída (1 copo para 1 balde d\'água) em pisos, bancadas e banheiros regularmente',
      'Mantenha a cozinha limpa após cada refeição — migalhas e restos atraem baratas e moscas',
      'Lave louças, talheres e utensílios imediatamente após o uso — não deixe de molho por horas',
      'Mantenha telas em janelas e portas para impedir entrada de moscas e mosquitos',
      'Não acumule entulho, caixas velhas ou objetos sem uso — são abrigo para baratas e ratos',
      'Limpe e desinfete geladeira a cada 15 dias — verifiifique alimentos vencidos e remóva restos',
      'Em caso de infestação de baratas ou ratos, acione a prefeitura (CCZ) — o serviço é gratuito',
    ],
  },
];

function Bar({ pct, visible }) {
  return (
    <div className={styles.barTrack}>
      <div className={styles.barFill} style={{ width: visible ? `${pct}%` : '0%' }} />
    </div>
  );
}

export default function Prevention() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={styles.section} id="prevencao" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.pill}>🛡️ Prevenção</span>
          <h2>Como se Prevenir</h2>
          <p>Medidas comprovadas que protegem contra todas as doenças desta página — clique em um card para ver o passo a passo completo</p>
        </div>

        <div className={styles.grid}>
          {tips.map(({ icon, title, desc, pct, pctLabel, diseases, steps }, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={title}
                className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <button className={styles.cardHeader} onClick={() => setExpanded(isOpen ? null : i)}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIcon}>{icon}</span>
                    <div className={styles.cardMeta}>
                      <h3>{title}</h3>
                      <div className={styles.diseaseTags}>
                        {diseases.map(d => <span key={d} className={styles.diseaseTag}>{d}</span>)}
                      </div>
                    </div>
                    <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                  <p className={styles.cardDesc}>{desc}</p>
                  <div className={styles.barRow}>
                    <Bar pct={pct} visible={visible} />
                    <span className={styles.pctLabel}>Eficácia: {pct}%</span>
                  </div>
                  <small className={styles.effectLabel}>{pctLabel}</small>
                </button>

                {isOpen && (
                  <ul className={styles.stepsList}>
                    {steps.map((step, j) => (
                      <li key={j} className={styles.stepItem}>
                        <span className={styles.stepNum}>{j + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.alert}>
          <span className={styles.alertIcon}>⚠️</span>
          <div>
            <strong>Sintomas? Procure atendimento médico imediatamente.</strong>
            <p>Febre alta que não cede, diarreia intensa, urina escura, olhos amarelados ou dor muscular forte após contato com enchente são sinais de alerta. Informe ao médico quais alimentos consumiu e se teve contato com água suspeita nos últimos 30 dias.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
