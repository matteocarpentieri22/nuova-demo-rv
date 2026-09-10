import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import type { ProvinciaResult } from '../../types';
import { formatCurrency } from '../../dataLoader';

interface ProvinceChartProps {
  data: ProvinciaResult[];
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
        <p style={{ fontWeight: 700, marginBottom: '8px', color: '#17324D' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProvinceChart({ data }: ProvinceChartProps) {
  const veneto = data.filter(d => !['XX', 'TN'].includes(d.sigla));

  return (
    <div className="minimal-card fade-in">
      <div className="chart-title">
        <span className="icon">🏛️</span>
        Gettito per Provincia — Attuale vs Simulato
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={veneto} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
          <XAxis
            dataKey="sigla"
            tick={{ fill: '#5C6F82', fontSize: 12, fontFamily: 'Titillium Web' }}
            axisLine={{ stroke: '#D4DAE2' }}
          />
          <YAxis
            tick={{ fill: '#5C6F82', fontSize: 11, fontFamily: 'Titillium Web' }}
            axisLine={{ stroke: '#D4DAE2' }}
            tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: 'Titillium Web', fontSize: '0.8rem' }}
          />
          <Bar
            dataKey="gettitoAttuale"
            name="Gettito Attuale"
            fill="#0066CC"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="gettitoSimulato"
            name="Gettito Simulato"
            fill="#00C853"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
