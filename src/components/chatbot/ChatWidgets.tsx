import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import type { LoadedData } from '../../dataLoader';
import { formatCurrency, formatNumber } from '../../dataLoader';

interface ChatWidgetProps {
  data: LoadedData;
}

// ==========================================
// SCENARIO 1: Equità Fiscale
// ==========================================
export function WidgetEquitaFiscale({ data }: ChatWidgetProps) {
  // Mock logic to simulate "Chi paga meno", "Uguale", "Di più" based on income vs kW
  // In a real scenario, this would be a complex calculation across the integrated dataset.
  let meno = 0, uguale = 0, diPiu = 0;
  
  data.contribuentiVeicoli.forEach(cv => {
    // Basic heuristic for demo purposes:
    // Low income (< 20k) and low kW (< 70) -> pays less
    // High income (> 50k) and high kW (> 100) or low Euro -> pays more
    // Others -> same
    if (cv.reddito < 20000 && cv.kw < 70) {
      meno++;
    } else if ((cv.reddito > 50000 && cv.kw > 100) || cv.categoriaEuro <= 3) {
      diPiu++;
    } else {
      uguale++;
    }
  });

  const chartData = [
    { name: 'Risparmio (Riduzione bollo)', value: meno, color: '#008758' }, // Green
    { name: 'Invariato', value: uguale, color: '#A0AAB8' }, // Grey
    { name: 'Maggiorazione (Aumento bollo)', value: diPiu, color: '#D9364F' }, // Red
  ];

  const total = meno + uguale + diPiu;

  return (
    <div className="chat-widget-card fade-in">
      <h4 style={{ color: '#003580', marginBottom: '8px' }}>⚖️ Impatto Equità Fiscale</h4>
      <p style={{ fontSize: '0.8rem', color: '#5C6F82', marginBottom: '16px' }}>
        Confronto platea: Modello Attuale (solo kW) vs Modello Integrato (kW + Capacità Fiscale)
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip 
            formatter={(value: number) => [formatNumber(value) + ' contribuenti', 'Platea']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '0.75rem', fontFamily: 'Titillium Web' }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '12px', padding: '12px', background: '#F5F7FA', borderRadius: '8px', fontSize: '0.85rem' }}>
        <strong>Sintesi:</strong> Il nuovo modello avvantaggia il <span style={{ color: '#008758', fontWeight: 'bold' }}>{Math.round((meno/total)*100)}%</span> dei contribuenti (fasce deboli), penalizzando il <span style={{ color: '#D9364F', fontWeight: 'bold' }}>{Math.round((diPiu/total)*100)}%</span> (veicoli inquinanti o altospendenti), lasciando invariata la maggioranza.
      </div>
    </div>
  );
}


// ==========================================
// SCENARIO 2: Invarianza di Gettito (Redistribuzione)
// ==========================================
export function WidgetRedistribuzione({ data }: ChatWidgetProps) {
  // Group by rough income brackets to show diverging bars
  const brackets = [
    { label: '< 15k', diff: -250000, desc: 'Riduzione agevolata' },
    { label: '15k - 25k', diff: -120000, desc: 'Riduzione parziale' },
    { label: '25k - 35k', diff: -40000, desc: 'Lieve sconto' },
    { label: '35k - 50k', diff: 0, desc: 'Invariato' },
    { label: '50k - 75k', diff: 80000, desc: 'Lieve aumento' },
    { label: '75k - 100k', diff: 150000, desc: 'Maggiorazione' },
    { label: '> 100k', diff: 180000, desc: 'Tassazione piena' },
  ];

  return (
    <div className="chat-widget-card fade-in">
      <h4 style={{ color: '#003580', marginBottom: '8px' }}>🔄 Redistribuzione Invarianza di Gettito</h4>
      <p style={{ fontSize: '0.8rem', color: '#5C6F82', marginBottom: '16px' }}>
        Variazione del carico fiscale per fascia di reddito (Valori stimati di compensazione)
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={brackets}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
          <XAxis 
            type="number" 
            tickFormatter={(v) => `€${v/1000}k`}
            tick={{ fontSize: 11, fontFamily: 'Titillium Web' }}
          />
          <YAxis 
            dataKey="label" 
            type="category" 
            tick={{ fontSize: 11, fontFamily: 'Titillium Web', fontWeight: 600 }}
          />
          <RechartsTooltip 
            formatter={(val: number) => formatCurrency(Math.abs(val))}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <ReferenceLine x={0} stroke="#17324D" strokeWidth={2} />
          <Bar dataKey="diff" radius={[0, 4, 4, 0]}>
            {brackets.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.diff < 0 ? '#00C853' : '#FF6B81'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: '#5C6F82' }}>
        <span>← Minore carico fiscale (Risparmio)</span>
        <span>Maggiore carico fiscale (Compensazione) →</span>
      </div>
    </div>
  );
}


// ==========================================
// SCENARIO 3: Vulnerabilità Fiscale (Radar)
// ==========================================
export function WidgetVulnerabilita({ data }: ChatWidgetProps) {
  // In a real scenario, these scores would be computed by analyzing the data
  // and normalizing risks (0-100 score).
  const radarData = [
    { subject: 'Basso Reddito', A: 85, fullMark: 100 },
    { subject: 'Veicoli Vetusti (Euro 0-2)', A: 70, fullMark: 100 },
    { subject: 'Aree Periferiche', A: 60, fullMark: 100 },
    { subject: 'Soggetti Anziani', A: 75, fullMark: 100 },
    { subject: 'Posizioni Debitorie', A: 40, fullMark: 100 },
  ];

  return (
    <div className="chat-widget-card fade-in">
      <h4 style={{ color: '#003580', marginBottom: '8px' }}>🎯 Mappa di Vulnerabilità Fiscale</h4>
      <p style={{ fontSize: '0.8rem', color: '#5C6F82', marginBottom: '16px' }}>
        Identificazione dei fattori di rischio prevalenti (Indice 0-100) per potenziali insolvenze
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="#E8ECF1" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontFamily: 'Titillium Web', fill: '#5C6F82' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
          <Radar
            name="Rischio Insolvenza"
            dataKey="A"
            stroke="#EB8317"
            fill="#EB8317"
            fillOpacity={0.4}
          />
          <RechartsTooltip />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '8px', padding: '12px', background: '#FFF3E0', borderRadius: '8px', fontSize: '0.85rem' }}>
        <strong>Insight:</strong> Il cluster di rischio primario è rappresentato dai <strong>soggetti a basso reddito (Indice 85)</strong>, frequentemente associati a veicoli inquinanti e vetusti, dove un aumento lineare del bollo causerebbe maggiore evasione/insolvenza.
      </div>
    </div>
  );
}
