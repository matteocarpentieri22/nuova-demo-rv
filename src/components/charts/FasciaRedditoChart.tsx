import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { FasciaResult } from '../../types';

interface FasciaRedditoChartProps {
  data: FasciaResult[];
}

const COLORS = ['#0066CC', '#00838F', '#008758', '#EB8317', '#D9364F', '#5C6F82'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,102,204,0.15)',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,53,128,0.12)',
        fontFamily: 'Titillium Web, sans-serif',
        fontSize: '0.82rem',
      }}>
        <p style={{ fontWeight: 700, marginBottom: '4px', color: '#17324D' }}>{data.fascia}</p>
        <p style={{ color: '#5C6F82' }}>Coinvolti: <strong style={{ color: '#0066CC' }}>{data.contribuenti}</strong></p>
      </div>
    );
  }
  return null;
};

export function FasciaRedditoChart({ data }: FasciaRedditoChartProps) {
  // Take top 5 and group rest as 'Altre'
  const sorted = [...data].sort((a, b) => b.contribuenti - a.contribuenti);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  
  if (rest.length > 0) {
    top.push({
      fascia: 'Altre Fasce',
      contribuenti: rest.reduce((sum, item) => sum + item.contribuenti, 0),
      bolloTotale: rest.reduce((sum, item) => sum + item.bolloTotale, 0),
      riduzioneTotale: rest.reduce((sum, item) => sum + item.riduzioneTotale, 0),
    });
  }

  return (
    <div className="minimal-card fade-in fade-in-delay-1">
      <div className="chart-title">
        <span className="icon">📈</span>
        Coinvolti per Fascia di Reddito
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={top}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={2}
            dataKey="contribuenti"
            nameKey="fascia"
            stroke="none"
          >
            {top.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontFamily: 'Titillium Web', fontSize: '0.75rem' }}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
