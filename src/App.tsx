import { useState, useEffect, useCallback } from 'react';
import { loadAllData, simulateReduction, type LoadedData } from './dataLoader';
import type { SimulationResult } from './types';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Chatbot } from './components/chatbot/Chatbot';

type Page = 'dashboard' | 'chatbot';

export default function App() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [soglia, setSoglia] = useState(10000); // Default to 10000 like screenshot
  const [riduzione, setRiduzione] = useState(0.5); // Default to 50%
  const [provinciaFiltro, setProvinciaFiltro] = useState<string>('');
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  useEffect(() => {
    loadAllData()
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const result = simulateReduction(data.contribuentiVeicoli, soglia, riduzione, data.fasceReddito, provinciaFiltro);
      setSimulation(result);
    }
  }, [data, soglia, riduzione, provinciaFiltro]);

  const handleSogliaChange = useCallback((val: number) => {
    setSoglia(val);
  }, []);

  const handleRiduzioneChange = useCallback((val: number) => {
    setRiduzione(val);
  }, []);

  const handleProvinciaFiltroChange = useCallback((val: string) => {
    setProvinciaFiltro(val);
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
        <div className="loading-text">Caricamento dati tributari...</div>
        <div className="loading-subtext">Integrazione mondo fiscale e tassa auto</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-overlay">
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <div className="loading-text">Errore nel caricamento</div>
        <div className="loading-subtext">{error}</div>
      </div>
    );
  }

  const pageTitle = {
    dashboard: { title: 'Simulatore Manovre Tributarie', subtitle: 'Dashboard What-If — Analisi impatto riduzione bollo auto' },
    chatbot: { title: 'Assistente IA Tributario', subtitle: 'Agente conversazionale per interrogazione dati' },
  }[page];

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onPageChange={setPage} />
      <div className="main-content">
        <Header title={pageTitle.title} subtitle={pageTitle.subtitle} />
        <div className="page-content">
          {page === 'dashboard' && simulation && data && (
            <Dashboard
              simulation={simulation}
              soglia={soglia}
              riduzione={riduzione}
              provinciaFiltro={provinciaFiltro}
              onSogliaChange={handleSogliaChange}
              onRiduzioneChange={handleRiduzioneChange}
              onProvinciaFiltroChange={handleProvinciaFiltroChange}
              provinceList={data.province.map(p => p.DESC_PROVINCIA)}
            />
          )}
          {page === 'chatbot' && data && (
            <Chatbot data={data} />
          )}
        </div>
      </div>
    </div>
  );
}

