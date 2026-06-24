import { useState, useRef, useEffect } from 'react';
import styles from './Sanny.module.css';

const tips = [
  { q: 'hepatite', a: 'A Hepatite A é transmitida por água e alimentos contaminados. Existe vacina com 95% de eficácia — 2 doses e você está protegido! 💉' },
  { q: 'colera', a: 'A Cólera causa diarreia intensa e desidratação severa. O Brasil a eliminou em 2000, mas o risco existe onde falta saneamento! 🚨' },
  { q: 'cólera', a: 'A Cólera causa diarreia intensa e desidratação severa. O Brasil a eliminou em 2000, mas o risco existe onde falta saneamento! 🚨' },
  { q: 'leptospirose', a: 'A Leptospirose é transmitida pelo contato com água contaminada com urina de rato. Evite enchentes e use botas em áreas alagadas! 🌊' },
  { q: 'febre tifoide', a: 'A Febre Tifoide vem de água e alimentos contaminados. Beber água tratada ou fervida é a principal prevenção! 🦠' },
  { q: 'e. coli', a: 'A E. coli pode contaminar carnes mal cozidas e vegetais. Sempre cozinhe bem os alimentos e lave as mãos! 🥩' },
  { q: 'prevencao', a: 'As principais formas de prevenção são: lavar as mãos, beber água tratada, vacinar-se e evitar alimentos sem inspeção sanitária! 🛡️' },
  { q: 'prevenção', a: 'As principais formas de prevenção são: lavar as mãos, beber água tratada, vacinar-se e evitar alimentos sem inspeção sanitária! 🛡️' },
  { q: 'mao', a: 'Lavar as mãos por 20 segundos com água e sabão é a forma mais simples de prevenir doenças como hepatite A e E. coli! 🙌' },
  { q: 'mão', a: 'Lavar as mãos por 20 segundos com água e sabão é a forma mais simples de prevenir doenças como hepatite A e E. coli! 🙌' },
  { q: 'vacina', a: 'A Hepatite A tem vacina disponível no SUS! Verifique com seu médico ou UBS mais próxima. 💊' },
  { q: 'quiz', a: 'Já fez o nosso quiz? Role até a seção Quiz e teste o que você aprendeu sobre doenças hídricas! 🧠' },
  { q: 'brasil', a: 'No Brasil, 35 milhões de pessoas ainda não têm acesso à rede de esgoto (IBGE 2022). Isso contribui diretamente para doenças hídricas. 🇧🇷' },
  { q: 'agua', a: 'Água contaminada transmite cólera, hepatite A, febre tifoide e leptospirose. Sempre use água tratada ou fervida! 💧' },
  { q: 'água', a: 'Água contaminada transmite cólera, hepatite A, febre tifoide e leptospirose. Sempre use água tratada ou fervida! 💧' },
  { q: 'saneamento', a: 'Saneamento básico inclui água tratada, esgoto, coleta de lixo e drenagem. Sem ele, doenças evitáveis matam milhões por ano! 🚰' },
];

function getReply(input) {
  const lower = input.toLowerCase();
  const match = tips.find(t => lower.includes(t.q));
  if (match) return match.a;
  if (lower.includes('oi') || lower.includes('olá') || lower.includes('ola') || lower.includes('tudo'))
    return 'Olá! 😊 Posso te ajudar com dúvidas sobre doenças hídricas, prevenção, saneamento ou qualquer tema do site!';
  return 'Não sei responder isso ainda, mas explore o site! Temos doenças catalogadas, dicas de prevenção e um quiz interativo. 🔍';
}

export default function Sanny() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'sanny', text: 'Oi! Sou a Sanny, sua assistente de saúde hídrica! 👋 Pergunte sobre qualquer doença do site!' }]);
  const [input, setInput] = useState('');
  const [look, setLook] = useState('frente');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setLook('direita');
    setMessages(m => [...m, { from: 'user', text: trimmed }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'sanny', text: getReply(trimmed) }]);
      setLook('frente');
    }, 700);
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
              <span>Assistente de Saúde Hídrica</span>
            </div>
            <button className={styles.closeChat} onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'sanny' ? styles.msgSanny : styles.msgUser}>
                {m.from === 'sanny' && <img src="/sanny-frente.png" alt="Sanny" className={styles.msgAvatar} />}
                <span className={styles.bubble}>{m.text}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className={styles.inputRow}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Pergunte sobre doenças, prevenção..."
            />
            <button onClick={send}>➤</button>
          </div>
        </div>
      )}
      <button className={styles.toggle} onClick={() => setOpen(o => !o)}>
        <img src={`/sanny-${look}.png`} alt="Sanny" className={styles.avatar} />
        {!open && <span className={styles.badge}>💬</span>}
      </button>
    </div>
  );
}
