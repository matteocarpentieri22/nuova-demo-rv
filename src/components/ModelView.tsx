import type { LoadedData } from '../dataLoader';
import { formatNumber } from '../dataLoader';

interface ModelViewProps {
  data: LoadedData;
}

export function ModelView({ data }: ModelViewProps) {
  return (
    <div className="fade-in">
      <div className="control-panel">
        <div className="control-panel-title">
          🔗 Modello Dati Integrato
        </div>
        <p style={{ color: '#5C6F82', fontSize: '0.9rem', maxWidth: '800px', lineHeight: '1.6' }}>
          La dashboard unisce due silos di dati precedentemente separati attraverso il <strong>Codice Fiscale</strong> del contribuente.
          Questa operazione di data integration permette di simulare scenari complessi incrociando attributi demografici/reddituali 
          con gli asset (veicoli) posseduti.
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-header">
            <span className="kpi-label">Dati IRPEF Caricati</span>
            <div className="kpi-icon blue">📄</div>
          </div>
          <div className="kpi-value">500</div>
          <div className="kpi-subtitle">Anagrafiche Fiscali</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-header">
            <span className="kpi-label">Veicoli Registrati</span>
            <div className="kpi-icon green">🚗</div>
          </div>
          <div className="kpi-value">378</div>
          <div className="kpi-subtitle">Dati tecnici e posizioni</div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-header">
            <span className="kpi-label">Match Riusciti</span>
            <div className="kpi-icon orange">🔗</div>
          </div>
          <div className="kpi-value">{formatNumber(data.contribuentiVeicoli.length)}</div>
          <div className="kpi-subtitle">Relazioni Soggetto-Veicolo create</div>
        </div>
      </div>

      <div className="model-section">
        <h3 style={{ color: '#003580', marginBottom: '16px' }}>Struttura dell'Integrazione (Join Relazionale)</h3>
        
        <div className="model-card">
          <div className="model-grid">
            
            {/* Mondo Fiscale */}
            <div className="model-world fiscal">
              <div className="model-world-title">
                🏦 MONDO FISCALE (IRPEF)
              </div>
              <ul className="model-table-list">
                <li><strong>dwa37_anagrafica_irpef</strong> <span>(Dati demografici, Residenza)</span></li>
                <li><strong>dwa37_pers_f</strong> <span>(Redditi, Fasce reddito)</span></li>
                <li><strong>dwa37_fascia_reddito</strong> <span>(Decodifica fasce reddituali)</span></li>
              </ul>
              <div style={{ marginTop: '16px', padding: '12px', background: '#fff', borderRadius: '8px', fontSize: '0.8rem', borderLeft: '4px solid #0066CC' }}>
                <span style={{ color: '#A0AAB8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Chiave Primaria di estrazione</span>
                <strong style={{ color: '#17324D' }}>cod_fiscale</strong>
              </div>
            </div>

            {/* Link Symbol */}
            <div className="model-connector" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginTop: '60px' }}>
              ⟷
            </div>

            {/* Mondo Auto */}
            <div className="model-world auto">
              <div className="model-world-title">
                🚗 MONDO TASSA AUTO
              </div>
              <ul className="model-table-list">
                <li><strong>TAU_DTS_T_SOGGETTO</strong> <span>(Proprietari, Codice Fiscale)</span></li>
                <li><strong>TAU_T_POSIZIONE</strong> <span>(Relazione Proprietario-Veicolo)</span></li>
                <li><strong>TAU_T_VEICOLO</strong> <span>(Identificativi veicolo)</span></li>
                <li><strong>TAU_T_DATI_TECNICI</strong> <span>(kW, Categoria Euro, Cilindrata)</span></li>
              </ul>
              <div style={{ marginTop: '16px', padding: '12px', background: '#fff', borderRadius: '8px', fontSize: '0.8rem', borderLeft: '4px solid #008758' }}>
                <span style={{ color: '#A0AAB8', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Punto di giunzione</span>
                <strong style={{ color: '#17324D' }}>TAU_DTS_T_SOGGETTO.CODICEFISCALE</strong>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
