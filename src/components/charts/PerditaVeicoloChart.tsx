import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SimulationResult } from '../../types';
import { formatCurrency } from '../../dataLoader';

interface ChartProps {
  simulation: SimulationResult;
}

const COLORS = ['#CC5500', '#0066CC', '#008758', '#A16928', '#28A197'];

export function PerditaVeicoloChart({ simulation }: ChartProps) {
  const data = simulation.perTipoVeicolo.map(t => ({
    name: t.tipo,
    value: t.riduzioneTotale
  }));

  return (
    <div className="minimal-card fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '8px' }}>
          Perdita per tipologia di veicolo
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          Composizione dell'agevolazione per categoria di veicolo.
        </div>
      </div>
      
      <div style={{ height: 250, width: '100%', display: 'flex' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(val: any) => [formatCurrency(Number(val)), 'Perdita']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#5C6F82', borderTop: '1px solid #E5E5EA', paddingTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {data.map((d, i) => (
          <span key={d.name}>
            <strong>{d.name}</strong> {formatCurrency(d.value)} {i < data.length - 1 ? '·' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
