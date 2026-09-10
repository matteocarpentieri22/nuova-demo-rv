import { ControlPanel } from './ControlPanel';
import { KpiCards } from './KpiCards';
import { GettitoConfrontoChart } from './charts/GettitoConfrontoChart';
import { CurvaPerditaChart } from './charts/CurvaPerditaChart';
import { PerditaProvinciaChart } from './charts/PerditaProvinciaChart';
import { PerditaFasciaChart } from './charts/PerditaFasciaChart';
import { PerditaVeicoloChart } from './charts/PerditaVeicoloChart';
import { CoinvoltiProvinciaChart } from './charts/CoinvoltiProvinciaChart';
import { ComuniTable } from './ComuniTable';
import type { SimulationResult } from '../types';

interface DashboardProps {
  simulation: SimulationResult;
  soglia: number;
  riduzione: number;
  provinciaFiltro: string;
  onSogliaChange: (val: number) => void;
  onRiduzioneChange: (val: number) => void;
  onProvinciaFiltroChange: (val: string) => void;
  provinceList: string[];
}

export function Dashboard({
  simulation,
  soglia,
  riduzione,
  provinciaFiltro,
  onSogliaChange,
  onRiduzioneChange,
  onProvinciaFiltroChange,
  provinceList
}: DashboardProps) {
  return (
    <>
      <ControlPanel
        soglia={soglia}
        riduzione={riduzione}
        provinciaFiltro={provinciaFiltro}
        onSogliaChange={onSogliaChange}
        onRiduzioneChange={onRiduzioneChange}
        onProvinciaFiltroChange={onProvinciaFiltroChange}
        provinceList={provinceList}
      />
      
      <KpiCards simulation={simulation} />

      <div className="charts-grid">
        <GettitoConfrontoChart simulation={simulation} />
        <CurvaPerditaChart simulation={simulation} />
      </div>

      <div className="charts-grid">
        <PerditaProvinciaChart simulation={simulation} />
        <PerditaFasciaChart simulation={simulation} />
      </div>

      <div className="charts-grid">
        <PerditaVeicoloChart simulation={simulation} />
        <CoinvoltiProvinciaChart simulation={simulation} />
      </div>

      <ComuniTable data={simulation.perComune} />
    </>
  );
}
