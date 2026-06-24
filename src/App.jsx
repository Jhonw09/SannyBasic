import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Diseases from './components/Diseases/Diseases';
import Prevention from './components/Prevention/Prevention';
import Statistics from './components/Statistics/Statistics';
import Quiz from './components/Quiz/Quiz';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import './App.css';

export default function App() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Diseases />
        <Prevention />
        <Statistics />
        <Quiz />
        <Contact />
      </main>
      <Footer />
      <a
        href="https://www.instagram.com/sanny_basic?igsh=OWpubjF3M3MzOXZy"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        style={{
          position: 'fixed', bottom: '74px', right: '20px',
          width: '44px', height: '44px',
          background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
          color: '#fff', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(220,39,67,0.4)',
          zIndex: 998, transition: 'all 0.3s ease',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '44px', height: '44px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff', border: 'none', borderRadius: '50%',
            cursor: 'pointer', fontSize: '1.1rem',
            boxShadow: '0 4px 20px rgba(14,165,233,0.4)',
            zIndex: 998, transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </>
  );
}
