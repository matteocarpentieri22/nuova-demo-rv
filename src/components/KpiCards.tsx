import { useEffect, useState } from 'react';
import type { SimulationResult } from '../types';

interface KpiCardsProps {
  simulation: SimulationResult;
}

function useAnimatedNumber(end: number, duration: number = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setValue(end * easeOut);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return value;
}

function formatVal(val: number, isCurrency: boolean = true) {
  return (
    <>
      {Math.round(val).toLocaleString('it-IT')}
      {isCurrency && <span style={{ marginLeft: '4px' }}>€</span>}
    </>
  );
}

export function KpiCards({ simulation }: KpiCardsProps) {
  const agevolazioneMedia = simulation.veicoliCoinvolti > 0 
    ? simulation.perditaGettito / simulation.veicoliCoinvolti 
    : 0;

  const pctString = (simulation.percentualePerdita * 100).toFixed(2).replace('.', ',');
  const pctVeicoli = simulation.veicoliTotali > 0 
    ? ((simulation.veicoliCoinvolti / simulation.veicoliTotali) * 100).toFixed(1).replace('.', ',') 
    : '0,0';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
      
      {/* Card 1: GETTITO */}
      <div className="minimal-card fade-in fade-in-delay-1" style={{ borderTop: '4px solid var(--blu-italia)', padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5C6F82', textTransform: 'uppercase', marginBottom: '16px' }}>
          Gettito (Bollo Stimato)
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
          <span style={{ color: '#5C6F82' }}>Attuale</span>
          <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{formatVal(simulation.gettitoAttuale)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
          <span style={{ color: '#5C6F82' }}>Simulato</span>
          <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{formatVal(simulation.gettitoSimulato)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.9rem' }}>
          <span style={{ color: '#CC5500', fontWeight: 600 }}>Perdita</span>
          <span style={{ color: '#CC5500', fontWeight: 700 }}>{formatVal(simulation.perditaGettito)}</span>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#86868B' }}>
          {pctString}% del gettito - bollo stimato sull'ambito selezionato
        </div>
      </div>

      {/* Card 2: SOGGETTI COINVOLTI */}
      <div className="minimal-card fade-in fade-in-delay-2" style={{ borderTop: '4px solid var(--blu-italia)', padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5C6F82', textTransform: 'uppercase', marginBottom: '16px' }}>
          Soggetti Coinvolti
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', paddingBottom: '8px', borderBottom: '1px dashed #E5E5EA' }}>
          <span style={{ color: '#5C6F82' }}>Veicoli</span>
          <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{formatVal(simulation.veicoliCoinvolti, false)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.9rem' }}>
          <span style={{ color: '#5C6F82' }}>Proprietari</span>
          <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{formatVal(simulation.proprietariCoinvolti, false)}</span>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#86868B', marginTop: 'auto' }}>
          su {simulation.veicoliTotali.toLocaleString('it-IT')} veicoli ({pctVeicoli}%) · su {simulation.proprietariTotali.toLocaleString('it-IT')} proprietari
        </div>
      </div>

      {/* Card 3: AGEVOLAZIONE MEDIA */}
      <div className="minimal-card fade-in fade-in-delay-3" style={{ borderTop: '4px solid var(--blu-italia)', padding: '20px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5C6F82', textTransform: 'uppercase', marginBottom: '16px' }}>
          Agevolazione Media
        </div>

        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '8px', letterSpacing: '-1px' }}>
          {formatVal(agevolazioneMedia)}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#5C6F82' }}>
          risparmio medio per veicolo coinvolto
        </div>
      </div>

    </div>
  );
}
