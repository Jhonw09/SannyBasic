import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

const links = [
  { href: '#inicio', label: 'Início' },
  { href: '#doencas', label: 'Doenças' },
  { href: '#prevencao', label: 'Prevenção' },
  { href: '#estatisticas', label: 'Estatísticas' },
  { href: '#quiz', label: 'Quiz' },
  { href: '#contato', label: 'Contato' },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState('#inicio');
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      setSolid(y > 50);
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
      links.forEach(({ href }) => {
        const el = document.querySelector(href);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= 80 && r.bottom >= 80) setActive(href);
      });
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <nav
      className={styles.nav}
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)', background: solid ? 'rgba(15,23,42,0.95)' : 'transparent' }}
    >
      <div className={styles.inner}>
        <a href="#inicio" className={styles.brand}>💧 SannyBasic</a>

        <ul className={`${styles.links} ${open ? styles.open : ''}`}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={active === href ? styles.active : ''} onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button className={styles.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span style={{ transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>
    </nav>
  );
}
