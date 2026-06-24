import { useState } from 'react';
import { quizQuestions } from '../../data/diseases';
import styles from './Quiz.module.css';

function playSound(correct) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (correct) {
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      o.type = 'sine';
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.25);
    });
  } else {
    [300, 220].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      o.type = 'sawtooth';
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    });
  }
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showExpl, setShowExpl] = useState(false);

  const q = quizQuestions[current];
  const total = quizQuestions.length;

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExpl(true);
    const correct = idx === q.correct;
    if (correct) setScore(s => s + 1);
    playSound(correct);
  };

  const next = () => {
    if (current + 1 >= total) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExpl(false);
  };

  const restart = () => {
    setCurrent(0); setScore(0); setSelected(null); setFinished(false); setShowExpl(false);
  };

  const pct = Math.round((score / total) * 100);
  const medal = pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : pct >= 40 ? '🥉' : '📚';
  const msg = pct >= 80 ? 'Excelente! Você é um especialista!' : pct >= 60 ? 'Muito bom! Continue aprendendo.' : pct >= 40 ? 'Bom começo. Explore mais o site!' : 'Continue estudando — cada informação salva vidas!';

  if (finished) {
    return (
      <section className={styles.section} id="quiz">
        <div className="container">
          <div className={styles.result}>
            <div className={styles.resultMedal}>{medal}</div>
            <h2>Quiz Concluído!</h2>
            <p className={styles.resultMsg}>{msg}</p>
            <div className={styles.resultScore}>
              <div className={styles.donut} style={{ '--pct': `${pct}` }}>
                <span>{score}/{total}</span>
              </div>
              <p>{pct}% de acertos</p>
            </div>
            <div className={styles.resultBtns}>
              <button className={styles.btnPrimary} onClick={restart}>Tentar Novamente</button>
              <a href="#doencas" className={styles.btnOutline}>Revisar Doenças</a>
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
          <h2>Teste seu Conhecimento</h2>
          <p>Responda {total} perguntas sobre doenças hídricas e alimentares</p>
        </div>

        <div className={styles.quizBox}>
          <div className={styles.meta}>
            <span>Pergunta {current + 1} de {total}</span>
            <span className={styles.scoreTag}>⭐ {score} pontos</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${((current) / total) * 100}%` }} />
          </div>

          <h3 className={styles.question}>{q.question}</h3>

          <div className={styles.options}>
            {q.options.map((opt, i) => {
              let cls = styles.option;
              if (selected !== null) {
                if (i === q.correct) cls = `${styles.option} ${styles.correct}`;
                else if (i === selected) cls = `${styles.option} ${styles.wrong}`;
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                  <span className={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showExpl && (
            <div className={`${styles.explanation} ${selected === q.correct ? styles.explCorrect : styles.explWrong}`}>
              <span>{selected === q.correct ? '✅' : '❌'}</span>
              <p>{q.explanation}</p>
            </div>
          )}

          {selected !== null && (
            <button className={styles.nextBtn} onClick={next}>
              {current + 1 >= total ? 'Ver Resultado 🎉' : 'Próxima →'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
