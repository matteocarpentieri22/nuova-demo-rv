import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { SimulationResult } from '../../types';
import { formatCurrency } from '../../dataLoader';

interface ChartProps {
  simulation: SimulationResult;
}

export function GettitoConfrontoChart({ simulation }: ChartProps) {
  const data = [
    { name: 'Scenario attuale', value: simulation.gettitoAttuale, color: '#0066CC' },
    { name: 'Scenario simulato', value: simulation.gettitoSimulato, color: '#CC5500' },
  ];

  const formatTooltip = (value: any) => formatCurrency(Number(value));
  const formatYAxis = (value: any) => `€ ${(Number(value) / 1000).toFixed(0)}k`;

  return (
    <div className="minimal-card fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '8px' }}>
          Gettito: scenario attuale e scenario simulato
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          Confronto diretto fra il gettito invariato e quello risultante dalla manovra.
        </div>
      </div>
      
      <div style={{ height: 250, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={80}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
            <XAxis dataKey="name" tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatYAxis} tick={{ fill: '#5C6F82', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={formatTooltip} 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="top" formatter={(val: any) => formatCurrency(Number(val))} style={{ fill: '#1D1D1F', fontSize: 12, fontWeight: 500 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
