interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="institutional-header">
      <div className="gov-top-bar">
        <span>REPUBBLICA ITALIANA</span>
        <span>Regione del Veneto</span>
      </div>
      <div className="main-header-content">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo_veneto.png" alt="Logo Regione del Veneto" style={{ height: '64px', marginRight: '24px' }} />
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
