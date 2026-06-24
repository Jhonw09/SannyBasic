import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section className={styles.section} id="contato">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.pill}>📋 Informações úteis</span>
          <h2>Recursos e Contatos</h2>
          <p>Emergências, fontes científicas e informações sobre o portal</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.infoCard}>
            <span className={styles.cardIcon}>🏥</span>
            <div>
              <h4>Emergências em Saúde</h4>
              <ul>
                <li><span>SAMU</span><strong>192</strong></li>
                <li><span>Disque Saúde</span><strong>136</strong></li>
                <li><span>CVS</span><strong>0800 771 3541</strong></li>
              </ul>
              <p className={styles.tip}>Ligue gratuitamente 24h por dia, 7 dias por semana.</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.cardIcon}>📚</span>
            <div>
              <h4>Fontes Científicas</h4>
              <ul className={styles.linkList}>
                <li><a href="https://www.who.int/pt/about" target="_blank" rel="noreferrer">🔗 OMS — Organização Mundial da Saúde</a></li>
                <li><a href="https://www.paho.org/pt" target="_blank" rel="noreferrer">🔗 OPAS — Organização Pan-Americana</a></li>
                <li><a href="https://www.gov.br/saude" target="_blank" rel="noreferrer">🔗 Ministério da Saúde do Brasil</a></li>
              </ul>
              <p className={styles.tip}>Todo o conteúde deste site é baseado nessas fontes.</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <span className={styles.cardIcon}>💧</span>
            <div>
              <h4>Sobre o SannyBasic</h4>
              <p className={styles.about}>Portal educativo sobre saúde hídrica e alimentar, com dados baseados em evidências científicas da OMS, OPAS e MS.</p>
              <p className={styles.about}>Desenvolvido como Trabalho de Conclusão de Curso (TCC) por alunas da <strong>FIEB Unidade Engenho Novo — ITB Profª Maria Sylvia Chaluppe Mello</strong>.</p>
              <p className={styles.tip}>O conteúdo é educativo e não substitui consulta médica.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
