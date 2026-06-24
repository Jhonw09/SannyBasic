import styles from './History.module.css';

const timeline = [
  {
    year: 'Séc. XIX',
    icon: '🏙️',
    title: 'A Era das Pandemias Urbanas',
    text: 'Com a Revolução Industrial, milhões migraram para cidades sem infraestrutura. Esgoto corria a céu aberto e a água era retirada dos mesmos rios que recebiam dejetos humanos. Entre 1817 e 1923, seis pandemias de cólera varreram o planeta, matando dezenas de milhões de pessoas.',
  },
  {
    year: '1854',
    icon: '🗺️',
    title: 'John Snow e o Poço da Broad Street',
    text: 'O médico inglês John Snow mapeou casos de cólera em Londres e rastreou a origem até uma bomba d\'água contaminada por esgoto. Ao remover a manivela da bomba, o surto cessou. Foi o primeiro uso da epidemiologia moderna e provou que a doença vinha da água, não do "ar ruim".',
  },
  {
    year: '1883',
    icon: '🔬',
    title: 'Koch Descobre o Vibrio cholerae',
    text: 'Robert Koch isolou a bactéria causadora da cólera no Egito e na Índia. Pela primeira vez um agente biológico específico foi identificado como causa de uma doença hídrica, abrindo caminho para entender que saneamento era questão de sobrevivência.',
  },
  {
    year: '1908',
    icon: '🚰',
    title: 'Cloração da Água Salva Milhões',
    text: 'Jersey City (EUA) foi a primeira cidade a clorar sua rede de abastecimento em larga escala. A mortalidade por febre tifoide caiu 90% em uma década. A cloração da água é considerada a intervenção de saúde pública mais impactante do século XX.',
  },
  {
    year: '1993',
    icon: '🌊',
    title: 'Milwaukee: Quando o Tratamento Falhou',
    text: 'Uma falha nas estações de tratamento de Milwaukee (EUA) permitiu que o parasita Cryptosporidium contaminasse a rede pública. Mais de 403.000 pessoas adoeceram e 69 morreram. O episódio mostrou que mesmo países desenvolvidos são vulneráveis quando o saneamento falha.',
  },
  {
    year: 'Hoje',
    icon: '🌍',
    title: 'A Crise Persiste',
    text: '2,2 bilhões de pessoas ainda não têm acesso a água potável segura e 3,6 bilhões carecem de saneamento básico adequado. No Brasil, apenas 54% dos municípios têm rede de esgoto. Cólera, febre tifoide e leptospirose continuam matando milhares por ano — todas doenças evitáveis.',
  },
];

const context = [
  {
    icon: '🧫',
    title: 'Por que o saneamento importa?',
    text: 'Fezes humanas contêm centenas de patógenos. Sem coleta e tratamento de esgoto, esses microrganismos contaminam rios, lençóis freáticos e solos — a mesma água que populações vulneráveis usam para beber, cozinhar e se higienizar. O ciclo fecal-oral é a principal rota de transmissão de doenças evitáveis no mundo.',
  },
  {
    icon: '👶',
    title: 'Crianças: as maiores vítimas',
    text: 'Doenças diarreicas causadas por água contaminada são a segunda maior causa de morte em crianças menores de 5 anos. A desnutrição que acompanha infecções intestinais repetidas compromete o desenvolvimento cognitivo de forma irreversível, perpetuando ciclos de pobreza.',
  },
  {
    icon: '🇧🇷',
    title: 'O déficit histórico do Brasil',
    text: 'O Brasil tem um dos maiores déficits de saneamento da América Latina. Regiões Norte e Nordeste têm cobertura de esgoto abaixo de 30%. Cidades como Belém e Manaus ainda jogam esgoto bruto em rios. A leptospirose explode a cada temporada de chuvas, especialmente nas periferias.',
  },
];

export default function History() {
  return (
    <section className={styles.section} id="historia">
      <div className="container">

        <div className={styles.header}>
          <span className={styles.pill}>📜 Contexto Histórico</span>
          <h2>Uma História de Descaso e Consequências</h2>
          <p>Séculos de evidências mostram que saneamento básico é a diferença entre vida e morte</p>
        </div>

        <div className={styles.context}>
          {context.map(({ icon, title, text }) => (
            <div key={title} className={styles.contextCard}>
              <span className={styles.contextIcon}>{icon}</span>
              <div>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className={styles.timelineTitle}>Linha do Tempo</h3>
        <div className={styles.timeline}>
          {timeline.map(({ year, icon, title, text }, i) => (
            <div key={year} className={`${styles.item} ${i % 2 === 0 ? styles.left : styles.right}`}>
              <div className={styles.dot}><span>{icon}</span></div>
              <div className={styles.card}>
                <span className={styles.year}>{year}</span>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
