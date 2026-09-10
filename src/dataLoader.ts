import Papa from 'papaparse';
import type {
  Soggetto, Indirizzo, Veicolo, TipoVeicolo, DatiTecnici,
  Posizione, Luogo, Provincia, AnagraficaIrpef, PersF,
  FasciaReddito, ContribuenteVeicolo, SimulationResult,
  ProvinciaResult, FasciaResult, TipoVeicoloResult, ComuneResult
} from './types';

const DATA_BASE = './fake_data';

async function loadCSV<T>(filename: string): Promise<T[]> {
  const response = await fetch(`${DATA_BASE}/${filename}`);
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse<T>(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });
}

// Calculate bollo based on kW and Euro category
function calcolaBollo(kw: number, categoriaEuro: number): number {
  if (!kw || kw <= 0) return 0;
  const tariffa_base = 2.58;
  const tariffa_extra = 3.87;
  let bollo: number;

  if (kw <= 100) {
    bollo = kw * tariffa_base;
  } else {
    bollo = 100 * tariffa_base + (kw - 100) * tariffa_extra;
  }

  // Maggiorazione per veicoli Euro 0-3
  if (categoriaEuro && categoriaEuro <= 3) {
    bollo *= 1.10;
  }

  return Math.round(bollo * 100) / 100;
}

export interface LoadedData {
  contribuentiVeicoli: ContribuenteVeicolo[];
  fasceReddito: FasciaReddito[];
  tipiVeicolo: TipoVeicolo[];
  province: Provincia[];
}

export async function loadAllData(): Promise<LoadedData> {
  const [
    soggetti,
    indirizzi,
    veicoli,
    tipiVeicolo,
    datiTecnici,
    posizioni,
    luoghi,
    province,
    anagraficheIrpef,
    persF,
    fasceReddito,
  ] = await Promise.all([
    loadCSV<Soggetto>('TAU_DTS_T_SOGGETTO.csv'),
    loadCSV<Indirizzo>('TAU_DTS_T_INDIRIZZO.csv'),
    loadCSV<Veicolo>('TAU_T_VEICOLO.csv'),
    loadCSV<TipoVeicolo>('TAU_D_TIPOVEICOLO.csv'),
    loadCSV<DatiTecnici>('TAU_T_DATI_TECNICI.csv'),
    loadCSV<Posizione>('TAU_T_POSIZIONE.csv'),
    loadCSV<Luogo>('CMN_D_LUOGO.csv'),
    loadCSV<Provincia>('CMN_D_PROVINCIA.csv'),
    loadCSV<AnagraficaIrpef>('dwa37_anagrafica_irpef_2012-2023.csv'),
    loadCSV<PersF>('dwa37_pers_f_2012-2023.csv'),
    loadCSV<FasciaReddito>('dwa37_fascia_reddito.csv'),
  ]);

  // Build lookup maps
  const soggettoMap = new Map<number, Soggetto>();
  soggetti.forEach(s => soggettoMap.set(s.ID_SOGGETTO, s));

  const indirizzoMap = new Map<number, Indirizzo>();
  indirizzi.forEach(i => {
    if (!indirizzoMap.has(i.ID_SOGGETTO)) {
      indirizzoMap.set(i.ID_SOGGETTO, i);
    }
  });

  const veicoloMap = new Map<number, Veicolo>();
  veicoli.forEach(v => veicoloMap.set(v.ID_VEICOLO, v));

  const tipoVeicoloMap = new Map<number, TipoVeicolo>();
  tipiVeicolo.forEach(t => tipoVeicoloMap.set(t.ID_TIPO_VEICOLO, t));

  const datiTecniciMap = new Map<number, DatiTecnici>();
  datiTecnici.forEach(d => datiTecniciMap.set(d.ID_VEICOLO, d));

  const luogoMap = new Map<number, Luogo>();
  luoghi.forEach(l => luogoMap.set(l.ID_LUOGO, l));

  const provinciaMap = new Map<number, Provincia>();
  province.forEach(p => provinciaMap.set(p.ID_PROVINCIA, p));

  const fasciaRedditoMap = new Map<number, FasciaReddito>();
  fasceReddito.forEach(f => fasciaRedditoMap.set(f.id_fascia, f));

  // Build CF -> reddito map from pers_f
  const cfRedditoMap = new Map<string, { reddito: number; fasciaId: number }>();
  persF.forEach(p => {
    if (p.cod_fiscale) {
      cfRedditoMap.set(p.cod_fiscale, {
        reddito: p.num_r1205_reddito_complessivo || 0,
        fasciaId: p.fk_fascia_reddito || 0,
      });
    }
  });

  // Join: for each posizione, link proprietario -> soggetto -> veicolo -> dati tecnici
  const contribuentiVeicoli: ContribuenteVeicolo[] = [];

  posizioni.forEach(pos => {
    const soggetto = soggettoMap.get(pos.ID_PROPRIETARIO);
    if (!soggetto || !soggetto.CODICEFISCALE) return;

    const veicolo = veicoloMap.get(pos.ID_VEICOLO);
    if (!veicolo) return;

    const dt = datiTecniciMap.get(pos.ID_VEICOLO);
    if (!dt) return;

    const redditoInfo = cfRedditoMap.get(soggetto.CODICEFISCALE);
    if (!redditoInfo) return;

    const indirizzo = indirizzoMap.get(pos.ID_PROPRIETARIO);
    const luogo = indirizzo ? luogoMap.get(indirizzo.ID_LUOGO) : null;
    const prov = luogo ? provinciaMap.get(luogo.ID_PROVINCIA) : null;

    const tv = tipoVeicoloMap.get(veicolo.ID_TIPO_VEICOLO);
    const fascia = fasciaRedditoMap.get(redditoInfo.fasciaId);

    const kw = dt.KILO_WATT || 0;
    const bolloCalcolato = calcolaBollo(kw, dt.ID_CATEGORIA_EURO || 6);

    contribuentiVeicoli.push({
      codFiscale: soggetto.CODICEFISCALE,
      cognome: soggetto.COGNOME || '',
      nome: soggetto.NOME || '',
      sesso: soggetto.SESSO || '',
      reddito: redditoInfo.reddito,
      fasciaRedditoId: redditoInfo.fasciaId,
      fasciaRedditoDesc: fascia ? fascia.de_fascia.trim() : 'N/D',
      comuneDenom: luogo ? luogo.DENOMINAZIONE : 'N/D',
      provinciaId: prov ? prov.ID_PROVINCIA : 0,
      provinciaSigla: prov ? prov.SIGLA_PROVINCIA : 'XX',
      provinciaNome: prov ? prov.DESC_PROVINCIA : 'ALTRA',
      idVeicolo: pos.ID_VEICOLO,
      targa: dt.TARGA || '',
      tipoVeicolo: tv ? tv.CODICE : 'XX',
      tipoVeicoloDesc: tv ? tv.DESCRIZIONE : 'Altro',
      kw,
      potenzaFiscale: dt.POTENZA_FISCALE || 0,
      cilindrata: dt.CILINDRATA || 0,
      categoriaEuro: dt.ID_CATEGORIA_EURO || 0,
      bolloCalcolato,
    });
  });

  return {
    contribuentiVeicoli,
    fasceReddito: fasceReddito.sort((a, b) => (a.num_reddito_da || 0) - (b.num_reddito_da || 0)),
    tipiVeicolo: tipiVeicolo,
    province: province.filter(p => p.SIGLA_PROVINCIA !== 'XX' && p.SIGLA_PROVINCIA !== 'TN'),
  };
}

export function simulateReduction(
  allData: ContribuenteVeicolo[],
  soglia: number,
  riduzione: number, // 0.25, 0.50, 0.75, 1.0
  fasceReddito: FasciaReddito[],
  provinciaFiltro?: string,
): SimulationResult {
  const data = provinciaFiltro ? allData.filter(d => d.provinciaNome === provinciaFiltro) : allData;
  const gettitoAttuale = data.reduce((sum, cv) => sum + cv.bolloCalcolato, 0);

  // Find contribuenti with reddito <= soglia
  const coinvolti = data.filter(cv => cv.reddito <= soglia && cv.reddito >= 0);
  const nonCoinvolti = data.filter(cv => cv.reddito > soglia || cv.reddito < 0);

  const riduzioneTotale = coinvolti.reduce((sum, cv) => sum + cv.bolloCalcolato * riduzione, 0);
  const gettitoSimulato = gettitoAttuale - riduzioneTotale;

  // Calculate unique proprietari
  const proprietariTotaliSet = new Set(data.map(d => d.codFiscale));
  const proprietariCoinvoltiSet = new Set(coinvolti.map(d => d.codFiscale));
  
  // Calculate curve points
  const curvaPerdita = [];
  for (let s = 0; s <= 60000; s += 2000) {
    const coinv = data.filter(cv => cv.reddito <= s && cv.reddito >= 0);
    const perd = coinv.reduce((sum, cv) => sum + cv.bolloCalcolato * riduzione, 0);
    curvaPerdita.push({ soglia: s, perdita: perd });
  }

  // Per Provincia
  const provMap = new Map<string, ProvinciaResult>();
  data.forEach(cv => {
    const key = cv.provinciaSigla;
    if (!provMap.has(key)) {
      provMap.set(key, {
        sigla: cv.provinciaSigla,
        nome: cv.provinciaNome,
        gettitoAttuale: 0,
        gettitoSimulato: 0,
        perdita: 0,
        contribuentiCoinvolti: 0,
        contribuentiTotali: 0,
      });
    }
    const r = provMap.get(key)!;
    r.gettitoAttuale += cv.bolloCalcolato;
    r.contribuentiTotali++;

    const isCoinvolto = cv.reddito <= soglia && cv.reddito >= 0;
    if (isCoinvolto) {
      r.gettitoSimulato += cv.bolloCalcolato * (1 - riduzione);
      r.contribuentiCoinvolti++;
    } else {
      r.gettitoSimulato += cv.bolloCalcolato;
    }
    r.perdita = r.gettitoAttuale - r.gettitoSimulato;
  });

  // Per Fascia Reddito (only coinvolti, grouped by fascia)
  const fasciaMap = new Map<string, FasciaResult>();
  coinvolti.forEach(cv => {
    const key = cv.fasciaRedditoDesc;
    if (!fasciaMap.has(key)) {
      fasciaMap.set(key, {
        fascia: key,
        contribuenti: 0,
        bolloTotale: 0,
        riduzioneTotale: 0,
      });
    }
    const r = fasciaMap.get(key)!;
    r.contribuenti++;
    r.bolloTotale += cv.bolloCalcolato;
    r.riduzioneTotale += cv.bolloCalcolato * riduzione;
  });

  // Per Tipo Veicolo
  const tipoMap = new Map<string, TipoVeicoloResult>();
  coinvolti.forEach(cv => {
    const key = cv.tipoVeicoloDesc;
    if (!tipoMap.has(key)) {
      tipoMap.set(key, {
        tipo: key,
        count: 0,
        bolloTotale: 0,
        riduzioneTotale: 0,
      });
    }
    const r = tipoMap.get(key)!;
    r.count++;
    r.bolloTotale += cv.bolloCalcolato;
    r.riduzioneTotale += cv.bolloCalcolato * riduzione;
  });

  // Per Comune
  const comuneMap = new Map<string, ComuneResult>();
  data.forEach(cv => {
    const key = cv.comuneDenom;
    if (!comuneMap.has(key)) {
      comuneMap.set(key, {
        comune: cv.comuneDenom,
        provincia: cv.provinciaSigla,
        gettitoAttuale: 0,
        gettitoSimulato: 0,
        perdita: 0,
        contribuentiCoinvolti: 0,
        contribuentiTotali: 0,
      });
    }
    const r = comuneMap.get(key)!;
    r.gettitoAttuale += cv.bolloCalcolato;
    r.contribuentiTotali++;

    const isCoinvolto = cv.reddito <= soglia && cv.reddito >= 0;
    if (isCoinvolto) {
      r.gettitoSimulato += cv.bolloCalcolato * (1 - riduzione);
      r.contribuentiCoinvolti++;
    } else {
      r.gettitoSimulato += cv.bolloCalcolato;
    }
    r.perdita = r.gettitoAttuale - r.gettitoSimulato;
  });

  return {
    soglia,
    riduzione,
    gettitoAttuale,
    gettitoSimulato,
    perditaGettito: riduzioneTotale,
    percentualePerdita: gettitoAttuale > 0 ? riduzioneTotale / gettitoAttuale : 0,
    veicoliTotali: data.length,
    veicoliCoinvolti: coinvolti.length,
    proprietariTotali: proprietariTotaliSet.size,
    proprietariCoinvolti: proprietariCoinvoltiSet.size,
    perProvincia: Array.from(provMap.values()).sort((a, b) => b.perdita - a.perdita),
    perFasciaReddito: Array.from(fasciaMap.values()).sort((a, b) => b.riduzioneTotale - a.riduzioneTotale),
    perTipoVeicolo: Array.from(tipoMap.values()).sort((a, b) => b.riduzioneTotale - a.riduzioneTotale),
    perComune: Array.from(comuneMap.values()).sort((a, b) => b.perdita - a.perdita).slice(0, 25),
    curvaPerdita,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('it-IT').format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + '%';
}
