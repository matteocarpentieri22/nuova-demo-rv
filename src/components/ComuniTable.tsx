import type { ComuneResult } from '../types';
import { formatCurrency, formatNumber } from '../dataLoader';

interface ComuniTableProps {
  data: ComuneResult[];
}

export function ComuniTable({ data }: ComuniTableProps) {
  return (
    <div className="minimal-card full-width fade-in fade-in-delay-3">
      <div className="chart-title">
        <span className="icon">🏛️</span>
        Dettaglio Comuni (Top 25 per perdita di gettito)
      </div>
      
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Comune</th>
              <th>Prov</th>
              <th style={{ textAlign: 'right' }}>Veicoli Totali</th>
              <th style={{ textAlign: 'right' }}>Veicoli Coinvolti</th>
              <th style={{ textAlign: 'right' }}>Gettito Attuale</th>
              <th style={{ textAlign: 'right' }}>Gettito Simulato</th>
              <th style={{ textAlign: 'right' }}>Perdita Gettito</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={`${row.comune}-${i}`}>
                <td style={{ fontWeight: 600 }}>{row.comune}</td>
                <td>{row.provincia}</td>
                <td className="amount" style={{ textAlign: 'right' }}>
                  {formatNumber(row.contribuentiTotali)}
                </td>
                <td className="amount" style={{ textAlign: 'right', color: '#00838F' }}>
                  {formatNumber(row.contribuentiCoinvolti)}
                </td>
                <td className="amount" style={{ textAlign: 'right', color: '#0066CC' }}>
                  {formatCurrency(row.gettitoAttuale)}
                </td>
                <td className="amount" style={{ textAlign: 'right', color: '#008758' }}>
                  {formatCurrency(row.gettitoSimulato)}
                </td>
                <td className="amount negative" style={{ textAlign: 'right', fontWeight: 700 }}>
                  -{formatCurrency(row.perdita)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#A0AAB8' }}>
                  Nessun dato da visualizzare per questa simulazione.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
