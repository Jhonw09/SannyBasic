import { useEffect, useRef, useState } from 'react';
import { diseases } from '../../data/diseases';
import styles from './Hero.module.css';

export default function Hero() {
  const canvasRef = useRef(null);
  const visualRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: -Math.random() * 0.7 - 0.2,
        o: Math.random() * 0.6 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14,165,233,${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const parallaxX = (mouse.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mouse.y / window.innerHeight - 0.5) * 20;

  return (
    <section className={styles.hero} id="inicio">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.glow} />

      <div
        className={styles.content}
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <span className={styles.badge}>🚰 Saneamento Básico</span>
        <h1 className={styles.title}>
          Doenças causadas pela{' '}
          <span className={styles.highlight}>ausência de</span>{' '}
          <span className={styles.highlight}>saneamento básico</span>
        </h1>
        <p className={styles.subtitle}>
          Sem água tratada, esgoto adequado e coleta de lixo, doenças evitáveis matam
          milhões de pessoas todo ano — a maioria crianças em países em desenvolvimento.
        </p>
        <div className={styles.actions}>
          <a href="#doencas" className={styles.btnPrimary}>
            Explorar Doenças
            <span className={styles.btnArrow}>→</span>
          </a>
          <a href="#quiz" className={styles.btnOutline}>
            Fazer o Quiz
            <span>→</span>
          </a>
        </div>
      </div>

      <div
        ref={visualRef}
        className={styles.visual}
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
      >
        <div className={styles.orb} />
        <div className={styles.dropContainer}>
          <span
            className={`${styles.dropEmoji} ${hovered ? styles.dropHovered : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >💧</span>
          <div className={styles.ring} />
          <div className={`${styles.ring} ${styles.ring2}`} />
          <div className={`${styles.ring} ${styles.ring3}`} />
        </div>
        <div className={styles.floatCard}>
          <span>🦠</span>
          <div><strong>{diseases.length} doenças</strong><small>catalogadas</small></div>
        </div>
        <div className={`${styles.floatCard} ${styles.floatCard2}`}>
          <span>💀</span>
          <div><strong>58.9 mil</strong><small>mortes/ano por leptospirose</small></div>
        </div>
      </div>

      <a href="#doencas" className={styles.scrollHint}>
        <span>Rolar para baixo</span>
        <div className={styles.scrollDot} />
      </a>
    </section>
  );
}
