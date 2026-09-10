type Page = 'dashboard' | 'chatbot';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '4px', borderRadius: '6px' }}>
          <img src="/logo_veneto.png" alt="RV" style={{ width: '56px', height: 'auto' }} />
        </div>
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
    </aside>
  );
}
