type Page = 'dashboard' | 'chatbot';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">RV</div>
        <div>
          <div className="sidebar-title">Regione del Veneto</div>
          <div className="sidebar-subtitle">Piattaforma Tributaria</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Analisi</div>

        <div
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onPageChange('dashboard')}
        >
          <span className="nav-item-icon">📊</span>
          <span>Dashboard What-If</span>
        </div>

        <div className="sidebar-section-label">Strumenti</div>

        <div
          className={`nav-item ${activePage === 'chatbot' ? 'active' : ''}`}
          onClick={() => onPageChange('chatbot')}
        >
          <span className="nav-item-icon">🤖</span>
          <span>Assistente IA</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        Demo Prototipale · Dati Sintetici
      </div>
    </aside>
  );
}
