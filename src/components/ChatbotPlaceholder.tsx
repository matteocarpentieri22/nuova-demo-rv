export function ChatbotPlaceholder() {
  return (
    <div className="chatbot-placeholder fade-in">
      <div className="chatbot-icon">🤖</div>
      <h2>Assistente IA Tributario</h2>
      <p>
        Questo modulo è in fase di sviluppo. Permetterà agli operatori della
        Regione Veneto di interrogare i dati tributari in linguaggio naturale
        (es. "Quanti veicoli Euro 3 ci sono a Padova tra chi dichiara meno di 15.000€?").
      </p>
      
      <div style={{ 
        marginTop: '32px', 
        padding: '24px', 
        background: 'rgba(255,255,255,0.8)', 
        borderRadius: '16px',
        border: '1px dashed #A0AAB8',
        maxWidth: '600px',
        textAlign: 'left'
      }}>
        <h4 style={{ color: '#5C6F82', marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Funzionalità previste:
        </h4>
        <ul style={{ paddingLeft: '20px', color: '#17324D', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <li>Interrogazione diretta dei dati sintetici IRPEF e Tassa Auto</li>
          <li>Generazione automatica di insight e anomalie</li>
          <li>Integrazione con il sistema di data warehousing regionale</li>
          <li>Esportazione rapida dei dati richiesti in formato tabellare</li>
        </ul>
      </div>
    </div>
  );
}
