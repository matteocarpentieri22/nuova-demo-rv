import { useState } from 'react';

type Page = 'dashboard' | 'chatbot';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '280px', transition: 'width 0.3s ease' }}>
      <div className="sidebar-header" style={{ padding: isCollapsed ? '24px 12px' : '32px 24px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
        <div style={{ marginRight: isCollapsed ? '0' : '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '4px', borderRadius: '6px' }}>
          <img src="/logo_veneto.png" alt="RV" style={{ width: isCollapsed ? '40px' : '56px', height: 'auto', transition: 'width 0.3s ease' }} />
        </div>
        {!isCollapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div className="sidebar-title">Regione del Veneto</div>
            <div className="sidebar-subtitle">Piattaforma Tributaria</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {!isCollapsed && <div className="sidebar-section-label">Analisi</div>}
        {isCollapsed && <div style={{ height: '32px' }} />}

        <div
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onPageChange('dashboard')}
          title={isCollapsed ? "Dashboard What-If" : ""}
          style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <span className="nav-item-icon">📊</span>
          {!isCollapsed && <span>Dashboard What-If</span>}
        </div>

        {!isCollapsed && <div className="sidebar-section-label">Strumenti</div>}
        {isCollapsed && <div style={{ height: '32px' }} />}

        <div
          className={`nav-item ${activePage === 'chatbot' ? 'active' : ''}`}
          onClick={() => onPageChange('chatbot')}
          title={isCollapsed ? "Assistente IA" : ""}
          style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <span className="nav-item-icon">🤖</span>
          {!isCollapsed && <span>Assistente IA</span>}
        </div>
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '1.2rem', padding: '4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          title={isCollapsed ? "Espandi" : "Riduci"}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>
    </aside>
  );
}
