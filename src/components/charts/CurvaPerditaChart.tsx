import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import type { SimulationResult } from '../../types';
import { formatCurrency } from '../../dataLoader';

interface ChartProps {
  simulation: SimulationResult;
}

export function CurvaPerditaChart({ simulation }: ChartProps) {
  const data = simulation.curvaPerdita;

  const formatTooltip = (value: number) => formatCurrency(value);
  const formatYAxis = (value: number) => `€ ${(value / 1000).toFixed(0)}k`;
  const formatXAxis = (value: number) => `€ ${(value / 1000).toFixed(0)}k`;

  return (
    <div className="minimal-card fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '8px' }}>
          Perdita di gettito al variare della soglia di reddito
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          La curva mostra il costo della manovra per ogni soglia, a riduzione corrente. Il punto evidenzia la soglia selezionata.
        </div>
      </div>
      
      <div style={{ height: 250, width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPerdita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#CC5500" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#CC5500" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E5E5EA" />
            <XAxis 
              dataKey="soglia" 
              tickFormatter={formatXAxis} 
              tick={{ fill: '#5C6F82', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fill: '#5C6F82', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              formatter={(val: number) => [formatCurrency(val), 'Perdita di gettito']}
              labelFormatter={(label) => `Soglia di reddito: ${formatCurrency(Number(label))}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="perdita" 
              stroke="#CC5500" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPerdita)" 
              activeDot={{ r: 6, fill: '#0066CC', stroke: '#FFF', strokeWidth: 2 }}
            />
            <ReferenceDot 
              x={simulation.soglia} 
              y={simulation.perditaGettito} 
              r={6} 
              fill="#0066CC" 
              stroke="#FFF" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
