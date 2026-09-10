import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SimulationResult } from '../../types';

interface ChartProps {
  simulation: SimulationResult;
}

export function CoinvoltiProvinciaChart({ simulation }: ChartProps) {
  const data = simulation.perProvincia.map(p => ({
    name: p.nome,
    'Veicoli non coinvolti': p.contribuentiTotali - p.contribuentiCoinvolti,
    'Veicoli coinvolti': p.contribuentiCoinvolti
  }));

  const formatTooltip = (value: any) => Math.round(Number(value)).toLocaleString('it-IT');

  return (
    <div className="minimal-card fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '8px' }}>
          Veicoli coinvolti sul totale, per provincia
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          Quanta parte del parco veicoli è interessata in ciascun territorio.
        </div>
      </div>
      
      <div style={{ height: 250, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5EA" />
            <XAxis type="number" tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} iconType="square" />
            <Bar dataKey="Veicoli non coinvolti" stackId="a" fill="#D2E3FC" />
            <Bar dataKey="Veicoli coinvolti" stackId="a" fill="#CC5500" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
