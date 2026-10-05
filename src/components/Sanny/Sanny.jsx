import { useState, useRef, useEffect } from 'react';
import styles from './Sanny.module.css';

const tips = [
  { q: 'hepatite a', a: 'A Hepatite A inflama o fígado e é transmitida por água e alimentos contaminados. Existe vacina com 95% de eficácia — 2 doses e você está protegido! 💉', link: '#doencas' },
  { q: 'hepatite e', a: 'A Hepatite E é transmitida por água contaminada e é especialmente perigosa para gestantes, podendo causar insuficiência hepática grave. ⚠️', link: '#doencas' },
  { q: 'hepatite', a: 'O site aborda Hepatite A e Hepatite E, ambas transmitidas por água contaminada. A Hepatite A tem vacina disponível no SUS! 💉', link: '#doencas' },
  { q: 'colera', a: 'A Cólera causa diarreia intensa e desidratação severa. O Brasil a eliminou em 2000, mas o risco existe onde falta saneamento! 🚨', link: '#doencas' },
  { q: 'leptospirose', a: 'A Leptospirose é transmitida pelo contato com água contaminada com urina de rato. Evite enchentes e use botas em áreas alagadas! 🌊', link: '#doencas' },
  { q: 'febre tifoide', a: 'A Febre Tifoide vem de água e alimentos contaminados. Beber água tratada ou fervida é a principal prevenção! 🦠', link: '#doencas' },
  { q: 'e. coli', a: 'A E. coli pode contaminar carnes mal cozidas e vegetais. Sempre cozinhe bem os alimentos e lave as mãos! 🥩', link: '#doencas' },
  { q: 'giardia', a: 'A Giardíase é causada por um protozoário e afeta o intestino. Os cistos resistem ao cloro — ferva ou filtre a água! 🦠', link: '#doencas' },
  { q: 'prevencao', a: 'As principais formas de prevenção são: lavar as mãos, beber água tratada, vacinar-se e evitar alimentos sem inspeção sanitária! 🛡️', link: '#prevencao' },
  { q: 'mao', a: 'Lavar as mãos por 20 segundos com água e sabão é a forma mais simples de prevenir doenças como hepatite A e E. coli! 🙌', link: '#prevencao' },
  { q: 'vacina', a: 'A Hepatite A tem vacina disponível no SUS! Verifique com seu médico ou UBS mais próxima. 💊', link: '#prevencao' },
  { q: 'quiz', a: 'Já fez o nosso quiz? Role até a seção Quiz e teste o que você aprendeu sobre doenças hídricas! 🧠', link: '#quiz' },
  { q: 'brasil', a: 'No Brasil, 35 milhões de pessoas ainda não têm acesso à rede de esgoto (IBGE 2022). Isso contribui diretamente para doenças hídricas. 🇧🇷', link: '#estatisticas' },
  { q: 'agua', a: 'Água contaminada transmite cólera, hepatite A, febre tifoide e leptospirose. Sempre use água tratada ou fervida! 💧', link: '#prevencao' },
  { q: 'saneamento', a: 'Saneamento básico inclui água tratada, esgoto, coleta de lixo e drenagem. Sem ele, doenças evitáveis matam milhões por ano! 🚰', link: '#historia' },
  { q: 'estatistica', a: 'Temos dados da OMS, OPAS e Ministério da Saúde sobre o impacto das doenças no Brasil. Confira a seção de Estatísticas! 📊', link: '#estatisticas' },
];

const QUICK = [
  { label: '💧 O que é cólera?', text: 'cólera' },
  { label: '🌊 Leptospirose', text: 'leptospirose' },
  { label: '🛡️ Como prevenir?', text: 'prevenção' },
  { label: '🧠 Fazer o quiz', text: 'quiz' },
  { label: '🇧🇷 Brasil e saneamento', text: 'brasil' },
];

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getReply(input) {
  const lower = normalize(input);
  const match = tips.find(t => lower.includes(normalize(t.q)));
  if (match) return { text: match.a, link: match.link };
  if (lower.includes('oi') || lower.includes('ola') || lower.includes('tudo') || lower.includes('boa'))
    return { text: 'Olá! 😊 Posso te ajudar com dúvidas sobre doenças hídricas, prevenção, saneamento ou qualquer tema do site!', link: null };
  return { text: 'Não sei responder isso ainda, mas explore o site! Temos doenças catalogadas, dicas de prevenção e um quiz interativo. 🔍', link: '#doencas' };
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
