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
        <div className="header-left">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
