import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { SimulationResult } from '../../types';
import { formatCurrency } from '../../dataLoader';

interface ChartProps {
  simulation: SimulationResult;
}

export function PerditaProvinciaChart({ simulation }: ChartProps) {
  const data = simulation.perProvincia.map(p => ({
    name: p.nome,
    perdita: p.perdita
  }));

  const formatXAxis = (value: any) => `€ ${(Number(value) / 1000).toFixed(0)}k`;

  return (
    <div className="minimal-card fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '8px' }}>
          Perdita di gettito per provincia
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          Dove si concentra l'agevolazione in termini economici.
        </div>
      </div>
      
      <div style={{ height: 250, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 20, bottom: 5 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5EA" />
            <XAxis type="number" tickFormatter={formatXAxis} tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(val: any) => [formatCurrency(Number(val)), 'Perdita']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="perdita" fill="#6699CC" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="perdita" position="right" formatter={(val: any) => formatCurrency(Number(val))} style={{ fill: '#1D1D1F', fontSize: 11, fontWeight: 500 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
