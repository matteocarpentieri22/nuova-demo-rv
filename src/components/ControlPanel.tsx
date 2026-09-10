import { formatCurrency } from '../dataLoader';

interface ControlPanelProps {
  soglia: number;
  riduzione: number;
  provinciaFiltro: string;
  onSogliaChange: (val: number) => void;
  onRiduzioneChange: (val: number) => void;
  onProvinciaFiltroChange: (val: string) => void;
  provinceList: string[];
}

export function ControlPanel({
  soglia,
  riduzione,
  provinciaFiltro,
  onSogliaChange,
  onRiduzioneChange,
  onProvinciaFiltroChange,
  provinceList,
}: ControlPanelProps) {
  return (
    <div className="control-panel fade-in">
      <div className="card-title" style={{ fontSize: '1rem', marginBottom: '24px' }}>
        <span style={{ color: 'var(--blu-italia)', marginRight: '4px' }}>⚙️</span> Parametri della manovra
      </div>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
        
        {/* Ambito Territoriale */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1D1D1F' }}>Ambito territoriale</label>
          </div>
          <select 
            value={provinciaFiltro} 
            onChange={(e) => onProvinciaFiltroChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.9rem',
              outline: 'none',
              background: '#FFFFFF',
              fontFamily: 'Inter',
            }}
          >
            <option value="">Tutta la regione (Veneto)</option>
            {provinceList.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div style={{ fontSize: '0.7rem', color: '#86868B', marginTop: '8px', lineHeight: 1.4 }}>
            Seleziona una provincia per limitare la simulazione a quel territorio, oppure l'intera regione.
          </div>
        </div>

        {/* Soglia */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1D1D1F' }}>Soglia di reddito dichiarato</label>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blu-italia)' }}>{formatCurrency(soglia)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={60000}
            step={1000}
            value={soglia}
            onChange={(e) => onSogliaChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '0.7rem', color: '#86868B', marginTop: '8px', lineHeight: 1.4 }}>
            Chi dichiara meno di questa soglia riceve la riduzione.
          </div>
        </div>

        {/* Riduzione */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1D1D1F' }}>Riduzione del bollo</label>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blu-italia)' }}>{(riduzione * 100).toFixed(0)} %</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={riduzione * 100}
            onChange={(e) => onRiduzioneChange(Number(e.target.value) / 100)}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '0.7rem', color: '#86868B', marginTop: '8px', lineHeight: 1.4 }}>
            Percentuale di sconto applicata ai veicoli coinvolti.
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div style={{ 
        background: '#F0F6FC', 
        borderLeft: '4px solid var(--blu-italia)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-sm)',
        marginTop: '16px'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#1D1D1F', marginBottom: '4px' }}>
          Manovra simulata: <strong>riduzione del {(riduzione * 100).toFixed(0)}%</strong> del bollo per i proprietari di veicoli con <strong>reddito dichiarato inferiore a {formatCurrency(soglia)}</strong>.
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5C6F82' }}>
          Ambito territoriale: {provinciaFiltro ? provinciaFiltro : 'Regione del Veneto'}.
        </div>
      </div>

    </div>
  );
}
