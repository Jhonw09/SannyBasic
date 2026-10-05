import { useState, useRef, useEffect } from 'react';
import styles from './Sanny.module.css';
import { knowledgeBase } from './sannyKnowledge.js';

const tips = knowledgeBase;

const QUICK = [
  { label: '💧 O que é cólera?', text: 'cólera' },
  { label: '🌊 Leptospirose', text: 'leptospirose' },
  { label: '🛡️ Como prevenir?', text: 'prevenção' },
  { label: '🧠 Fazer o quiz', text: 'quiz' },
  { label: '🇧🇷 Brasil e saneamento', text: 'brasil' },
];

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '');
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function detectIntent(lower) {
  if (/sintoma|sinal|como saber|como identificar|manifesta/.test(lower)) return 'sintoma';
  if (/como pegar|transmit|contagi|contamin|como se pega/.test(lower)) return 'transmissao';
  if (/como tratar|tratamento|remedio|cura|antibiotico/.test(lower)) return 'tratamento';
  if (/como prevenir|prevencao|evitar|proteger|vacina/.test(lower)) return 'prevencao';
  if (/o que e|o que eh|o que sao|definicao|explica/.test(lower)) return 'definicao';
  return null;
}

const intentMap = {
  sintoma: ['febre', 'ictericia', 'diarreia', 'vomito', 'urina', 'panturrilha'],
  transmissao: ['transmissao', 'contaminacao', 'agua', 'carne', 'rato'],
  tratamento: ['tratamento', 'antibiotico', 'medico', 'desidratacao'],
  prevencao: ['prevencao', 'vacina', 'higiene', 'agua', 'filtro', 'ferve'],
};

function scoreTip(tip, words) {
  const kw = normalize(tip.q);
  let score = 0;
  for (const w of words) {
    if (kw.includes(w) || w.includes(kw)) score += 3;
  }
  for (const w of words) {
    if (w.length < 4) continue;
    const dist = levenshtein(w, kw);
    const threshold = kw.length <= 5 ? 1 : kw.length <= 8 ? 2 : 3;
    if (dist <= threshold) score += 1;
  }
  return score;
}

let lastContext = null;

function getReply(input) {
  const lower = normalize(input);
  const words = lower.split(' ').filter(w => w.length > 1);
  const intent = detectIntent(lower);

  if (/^(oi|ola|hey|hello|bom dia|boa tarde|boa noite|tudo bem|tudo bom|oi sanny)/.test(lower))
    return { text: 'Olá! 😊 Sou a Sanny, sua assistente de saúde hídrica! Posso te ajudar com doenças, prevenção, saneamento, estatísticas ou o quiz. O que você quer saber?', link: null };
  if (/obrigad|valeu|thanks|grat/.test(lower))
    return { text: 'De nada! 😊 Se tiver mais dúvidas, é só perguntar!', link: null };

  const isFollowUp = words.length <= 3 && lastContext && !tips.some(t => lower.includes(normalize(t.q)));
  const searchWords = isFollowUp ? [...words, lastContext] : words;
  const intentWords = intent ? (intentMap[intent] || []) : [];
  const allWords = [...new Set([...searchWords, ...intentWords])];

  const scored = tips
    .map(t => ({ tip: t, score: scoreTip(t, allWords) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    if (/ajuda|help|o que|como|nao sei/.test(lower))
      return { text: 'Posso te ajudar com: doenças (hepatite A/E, cólera, leptospirose, E. coli, giardíase, febre tifoide), prevenção, saneamento, estatísticas ou o quiz! O que você quer saber? 😊', link: '#doencas' };
    return { text: 'Não encontrei essa informação. Tente perguntar sobre uma doença específica, prevenção, saneamento ou o quiz! 🔍', link: '#doencas' };
  }

  const best = scored[0].tip;

  const doencaKeywords = ['hepatite', 'colera', 'leptospirose', 'ecoli', 'coli', 'giardia', 'tifoide', 'salmonella'];
  const foundDoenca = doencaKeywords.find(d => normalize(best.q).includes(d) || allWords.some(w => w.includes(d)));
  if (foundDoenca) lastContext = foundDoenca;

  if (intent && scored.length > 1) {
    const intentTip = scored.find(x => intentWords.some(iw => normalize(x.tip.q).includes(iw)));
    if (intentTip && intentTip.tip !== best) {
      return { text: `${best.a}\n\n${intentTip.tip.a}`, link: best.link };
    }
  }

  return { text: best.a, link: best.link };
}

export default function Sanny() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'sanny', text: 'Oi! Sou a Sanny, sua assistente de saúde hídrica! 👋 Pergunte sobre qualquer doença do site ou clique em uma sugestão abaixo!', link: null }]);
  const [input, setInput] = useState('');
  const [look, setLook] = useState('frente');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setUnread(1), 3000);
      return () => clearTimeout(t);
    } else {
      setUnread(0);
    }
  }, [open]);

  const send = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setLook('direita');
    setMessages(m => [...m, { from: 'user', text: trimmed, link: null }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(trimmed);
      setMessages(m => [...m, { from: 'sanny', ...reply }]);
      setLook('frente');
      setTyping(false);
    }, 900);
  };

  const handleKey = (e) => { if (e.key === 'Enter') send(); };

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.chat}>
          <div className={styles.chatHeader}>
            <img src="/sanny-frente.png" alt="Sanny" className={styles.headerAvatar} />
            <div>
              <strong>Sanny</strong>
              <span className={styles.onlineDot}>● Online</span>
            </div>
            <button className={styles.closeChat} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'sanny' ? styles.msgSanny : styles.msgUser}>
                {m.from === 'sanny' && <img src="/sanny-frente.png" alt="Sanny" className={styles.msgAvatar} />}
                <div className={styles.bubbleWrap}>
                  <span className={styles.bubble}>{m.text}</span>
                  {m.link && (
                    <a href={m.link} className={styles.bubbleLink} onClick={() => setOpen(false)}>
                      Ver no site →
                    </a>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className={styles.msgSanny}>
                <img src="/sanny-frente.png" alt="Sanny" className={styles.msgAvatar} />
                <span className={styles.bubble}>
                  <span className={styles.typingDots}>
                    <span /><span /><span />
                  </span>
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.quickRow}>
            {QUICK.map(q => (
              <button key={q.text} className={styles.quickBtn} onClick={() => send(q.text)}>
                {q.label}
              </button>
            ))}
          </div>

          <div className={styles.inputRow}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Pergunte sobre doenças, prevenção..."
            />
            <button onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
      <button className={styles.toggle} onClick={() => setOpen(o => !o)}>
        <img src={`/sanny-${look}.png`} alt="Sanny" className={styles.avatar} />
        {!open && unread > 0 && <span className={styles.badge}>{unread}</span>}
        {!open && <span className={styles.toggleLabel}>Fale com a Sanny</span>}
      </button>
    </div>
  );
}
