interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="institutional-header">
      <div className="main-header-content">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo_veneto.png" alt="Logo Regione del Veneto" style={{ height: '84px', marginRight: '32px' }} />
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
