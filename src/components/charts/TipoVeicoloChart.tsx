import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { TipoVeicoloResult } from '../../types';

interface TipoVeicoloChartProps {
  data: TipoVeicoloResult[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
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
        <p style={{ fontWeight: 700, marginBottom: '4px', color: '#17324D' }}>{label}</p>
        <p style={{ color: '#00838F' }}>Veicoli: <strong style={{ color: '#0066CC' }}>{payload[0].value}</strong></p>
      </div>
    );
  }
  return null;
};

export function TipoVeicoloChart({ data }: TipoVeicoloChartProps) {
  const top10 = data.slice(0, 10);

  return (
    <div className="minimal-card fade-in fade-in-delay-2">
      <div className="chart-title">
        <span className="icon">🚗</span>
        Coinvolti per Tipo Veicolo
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={top10} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" horizontal={false} />
          <XAxis 
            type="number" 
            tick={{ fill: '#5C6F82', fontSize: 11, fontFamily: 'Titillium Web' }}
            axisLine={{ stroke: '#D4DAE2' }}
          />
          <YAxis 
            dataKey="tipo" 
            type="category" 
            width={120}
            tick={{ fill: '#5C6F82', fontSize: 10, fontFamily: 'Titillium Web' }}
            axisLine={{ stroke: '#D4DAE2' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            name="Veicoli" 
            fill="#4A90D9" 
            radius={[0, 4, 4, 0]} 
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
