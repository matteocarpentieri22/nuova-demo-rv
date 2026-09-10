import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SimulationResult } from '../../types';
import { formatCurrency } from '../../dataLoader';

interface ChartProps {
  simulation: SimulationResult;
}

export function PerditaFasciaChart({ simulation }: ChartProps) {
  const data = simulation.perFasciaReddito.map(f => ({
    name: f.fascia,
    perdita: f.riduzioneTotale
  }));

  const formatYAxis = (value: any) => formatCurrency(Number(value));

  return (
    <div className="minimal-card fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '8px' }}>
          Perdita di gettito per fascia di reddito
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          Le fasce effettivamente toccate dalla manovra (in Euro).
        </div>
      </div>
      
      <div style={{ height: 250, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={100}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
            <XAxis dataKey="name" tick={{ fill: '#5C6F82', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatYAxis} tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(val: any) => [formatCurrency(Number(val)), 'Perdita']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="perdita" fill="#008758" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
