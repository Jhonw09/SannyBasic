import { useState, useMemo, useEffect, useRef } from 'react';
import { quizQuestions } from '../../data/diseases';
import styles from './Quiz.module.css';

const TOTAL = 10;
const TIMER_SECONDS = 20;
const DIFFICULTY_CONFIG = {
  1: { label: 'Iniciante', stars: 1, color: '#22c55e', bg: '#dcfce7', border: '#86efac' },
  2: { label: 'Intermediário', stars: 2, color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' },
  3: { label: 'Avançado', stars: 3, color: '#ef4444', bg: '#fef2f2', border: '#fca5a5' },
};

function DiffBadge({ level }) {
  const cfg = DIFFICULTY_CONFIG[level];
  return (
    <span
      className={styles.diffTag}
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border, border: `1px solid ${cfg.border}` }}
      title={`Nível ${cfg.label}`}
    >
      {'★'.repeat(cfg.stars)}{'☆'.repeat(3 - cfg.stars)} {cfg.label}
    </span>
  );
}

function playSound(correct) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (correct) {
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type = 'sine';
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.25);
    });
  } else {
    [300, 220].forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type = 'sawtooth';
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    });
  }
}

function Confetti() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      r: Math.random() * 8 + 4,
      color: ['#fb923c','#0ea5e9','#22c55e','#f59e0b','#6366f1','#ec4899'][Math.floor(Math.random()*6)],
      dx: (Math.random() - 0.5) * 3,
      dy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      drot: (Math.random() - 0.5) * 8,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
        p.x += p.dx; p.y += p.dy; p.rot += p.drot;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={canvasRef} className={styles.confetti} />;
}

function pickQuestion(used, difficulty) {
  const pool = quizQuestions.filter((q, i) => !used.has(i) && q.difficulty === difficulty);
  if (pool.length === 0) {
    const fallback = quizQuestions.map((q, i) => ({ q, i })).filter(({ i }) => !used.has(i));
    if (fallback.length === 0) return null;
    const pick = fallback[Math.floor(Math.random() * fallback.length)];
    return { question: pick.q, index: pick.i };
  }
  const idx = Math.floor(Math.random() * pool.length);
  const globalIndex = quizQuestions.indexOf(pool[idx]);
  return { question: pool[idx], index: globalIndex };
}

export default function Quiz() {
  const initialPick = useMemo(() => pickQuestion(new Set(), 1), []);

  const [current, setCurrent] = useState(initialPick.question);
  const [currentIndex, setCurrentIndex] = useState(initialPick.index);
  const [difficulty, setDifficulty] = useState(1);
  const [used, setUsed] = useState(new Set([initialPick.index]));
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showExpl, setShowExpl] = useState(false);
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (selected !== null || finished) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          setSelected(-1);
          setShowExpl(true);
          playSound(false);
          streakRef.current = 0;
          setStreak(0);
          setDifficulty(d => Math.max(1, d - 1));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [animKey, finished, selected]);

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setShowExpl(true);
    const correct = idx === current.correct;
    playSound(correct);
    if (correct) {
      setScore(s => s + 1);
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      setStreak(newStreak);
      setDifficulty(d => Math.min(3, d + (newStreak >= 2 ? 1 : 0)));
    } else {
      streakRef.current = 0;
      setStreak(0);
      setDifficulty(d => Math.max(1, d - 1));
    }
  };

  const next = () => {
    const nextAnswered = answered + 1;
    if (nextAnswered >= TOTAL) { setFinished(true); return; }
    const newUsed = new Set(used).add(currentIndex);
    const nextDiff = selected === current.correct
      ? Math.min(3, difficulty + (streakRef.current >= 2 ? 1 : 0))
      : Math.max(1, difficulty - 1);
    const pick = pickQuestion(newUsed, nextDiff);
    if (!pick) { setFinished(true); return; }
    setUsed(newUsed);
    setCurrent(pick.question);
    setCurrentIndex(pick.index);
    setAnswered(nextAnswered);
    setSelected(null);
    setTimedOut(false);
    setShowExpl(false);
    setAnimKey(k => k + 1);
  };

  const restart = () => {
    const pick = pickQuestion(new Set(), 1);
    setCurrent(pick.question);
    setCurrentIndex(pick.index);
    setDifficulty(1);
    setUsed(new Set([pick.index]));
    setScore(0);
    setAnswered(0);
    setSelected(null);
    setFinished(false);
    setShowExpl(false);
    streakRef.current = 0;
    setStreak(0);
    setTimedOut(false);
    setAnimKey(k => k + 1);
  };

  const pct = Math.round((score / TOTAL) * 100);
  const medal = pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : pct >= 40 ? '👏' : '📚';
  const msg = pct >= 80 ? 'Excelente desempenho! Você domina muito bem o tema.' : pct >= 60 ? 'Muito bom! Continue explorando para ampliar seus conhecimentos.' : pct >= 40 ? 'Você começou bem. Revise os conteúdos e tente novamente.' : 'Continue aprendendo: informação confiável ajuda a cuidar da saúde.';

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 10 ? '#22c55e' : timeLeft > 5 ? '#f59e0b' : '#ef4444';

  if (finished) {
    return (
      <section className={styles.section} id="quiz">
        <div className="container">
          <div className={styles.result}>
            {pct >= 60 && <Confetti />}
            <div className={styles.resultMedal}>{medal}</div>
            <p className={styles.resultEyebrow}>Resultado final</p>
            <h2>Quiz concluído!</h2>
            <p className={styles.resultMsg}>{msg}</p>
            <div className={styles.resultScore}>
              <div className={styles.donut} style={{ '--pct': `${pct}` }}>
                <span>{score}/{TOTAL}</span>
              </div>
              <p>{pct}% de respostas corretas</p>
            </div>
            <div className={styles.resultBtns}>
              <button className={styles.btnPrimary} onClick={restart}>Tentar novamente</button>
              <a href="#doencas" className={styles.btnOutline}>Revisar doenças</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="quiz">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.pill}>🧠 Quiz</span>
          <h2>Teste seus conhecimentos</h2>
          <p>Responda a 10 perguntas. O nível se ajusta de acordo com o seu desempenho.</p>
        </div>

        <div className={styles.quizBox} key={animKey}>
          <div className={styles.meta}>
            <span className={styles.questionCount}>Questão {answered + 1} de {TOTAL}</span>
            <DiffBadge level={difficulty} />
            <span className={styles.scoreTag}>{score} {score === 1 ? 'acerto' : 'acertos'}</span>
          </div>

          {streak >= 2 && (
            <div className={styles.streakBanner}>
              🔥 Você acertou {streak} questões seguidas!
            </div>
          )}

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${(answered / TOTAL) * 100}%` }} />
          </div>

          <div className={styles.timerRow}>
            <div className={styles.timerTrack}>
              <div
                className={styles.timerFill}
                style={{
                  width: `${timerPct}%`,
                  background: timerColor,
                  transition: selected !== null ? 'none' : 'width 1s linear, background 0.3s ease',
                }}
              />
            </div>
            <span className={styles.timerNum} style={{ color: timerColor }} aria-live="polite">
              {timeLeft} s
            </span>
          </div>

          <h3 className={styles.question}>{current.question}</h3>

          <div className={styles.options}>
            {current.options.map((opt, i) => {
              let cls = styles.option;
              if (selected !== null) {
                if (i === current.correct) cls = `${styles.option} ${styles.correct}`;
                else if (i === selected && i !== current.correct) cls = `${styles.option} ${styles.wrong}`;
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
                  <span className={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                  {selected !== null && i === current.correct && <span className={styles.optCheck}>✓</span>}
                  {selected !== null && i === selected && i !== current.correct && <span className={styles.optX}>✗</span>}
                </button>
              );
            })}
          </div>

          {timedOut && !showExpl && null}

          {showExpl && (
            <div className={`${styles.explanation} ${(selected === current.correct) ? styles.explCorrect : styles.explWrong}`}>
              <span>{selected === current.correct ? '✅' : timedOut ? '⏱️' : '❌'}</span>
              <p>{timedOut ? `Tempo esgotado! A resposta correta era: "${current.options[current.correct]}". ` : ''}{current.explanation}</p>
            </div>
          )}

          {selected !== null && (
            <button className={styles.nextBtn} onClick={next}>
              {answered + 1 >= TOTAL ? 'Ver resultado' : 'Próxima questão'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
