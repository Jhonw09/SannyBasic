import { useEffect, useRef, useState } from 'react';
import { heroStats } from '../../data/diseases';
import styles from './Hero.module.css';

function CountUp({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setVal(target); clearInterval(timer); }
          else setVal(parseFloat(current.toFixed(1)));
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Hero() {
  const canvasRef = useRef(null);

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

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.6 - 0.2,
        o: Math.random() * 0.5 + 0.1,
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

  return (
    <section className={styles.hero} id="inicio">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.glow} />

      <div className={styles.content}>
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
          <a href="#doencas" className={styles.btnPrimary}>Explorar Doenças</a>
          <a href="#quiz" className={styles.btnOutline}>Fazer o Quiz →</a>
        </div>

        <div className={styles.stats}>
          {heroStats.map(({ value, suffix, label }) => (
            <div key={label} className={styles.statCard}>
              <strong><CountUp target={value} suffix={suffix} /></strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.orb} />
        <div className={styles.dropContainer}>
          <span className={styles.dropEmoji}>💧</span>
          <div className={styles.ring} />
          <div className={`${styles.ring} ${styles.ring2}`} />
          <div className={`${styles.ring} ${styles.ring3}`} />
        </div>
        <div className={styles.floatCard}>
          <span>🦠</span>
          <div><strong>5 doenças</strong><small>catalogadas</small></div>
        </div>
        <div className={`${styles.floatCard} ${styles.floatCard2}`}>
          <span>💀</span>
          <div><strong>58.9 mil</strong><small>mortes/ano por leptospirose</small></div>
        </div>
      </div>
    </section>
  );
}
