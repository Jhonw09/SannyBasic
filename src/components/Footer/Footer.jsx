import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>💧 SannyBasic</div>
            <p>Portal educativo dedicado à conscientização sobre saúde hídrica e alimentar.</p>
            <div className={styles.social}>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="https://www.instagram.com/sanny_basic?igsh=OWpubjF3M3MzOXZy" target="_blank" rel="noreferrer" aria-label="Instagram">📸</a>
              <a href="#" aria-label="WhatsApp">💬</a>
              <a href="#" aria-label="Twitter">🐦</a>
            </div>
          </div>
          <div className={styles.col}>
            <h4>Navegação</h4>
            <ul>
              {['#inicio', '#doencas', '#prevencao', '#estatisticas', '#quiz', '#contato'].map((href) => (
                <li key={href}><a href={href}>{href.replace('#', '').charAt(0).toUpperCase() + href.slice(2)}</a></li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Categorias</h4>
            <ul>
              <li><a href="#doencas">💧 Hídricas</a></li>
              <li><a href="#doencas">🍽️ Alimentares</a></li>
              <li><a href="#doencas">🦠 Virais</a></li>
              <li><a href="#doencas">🔬 Bacterianas</a></li>
              <li><a href="#doencas">🧫 Parasitárias</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Recursos</h4>
            <ul>
              <li><a href="https://www.who.int/pt" target="_blank" rel="noreferrer">OMS</a></li>
              <li><a href="https://www.paho.org/pt" target="_blank" rel="noreferrer">OPAS</a></li>
              <li><a href="https://www.gov.br/saude" target="_blank" rel="noreferrer">Min. da Saúde</a></li>
              <li><a href="#quiz">Quiz Interativo</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2025 SannyBasic. Conteúdo educativo. Não substitui consulta médica profissional.</p>
        </div>
      </div>
    </footer>
  );
}
