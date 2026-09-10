// Core data types matching the CSV structures

export interface Soggetto {
  ID_SOGGETTO: number;
  COGNOME: string;
  NOME: string;
  SESSO: string;
  CODICEFISCALE: string;
  DATA_NASCITA: string;
}

export interface Indirizzo {
  ID_INDIRIZZO: number;
  ID_SOGGETTO: number;
  CAP: string;
  ID_LUOGO: number;
}

export interface Veicolo {
  ID_VEICOLO: number;
  ID_TIPO_VEICOLO: number;
}

export interface TipoVeicolo {
  ID_TIPO_VEICOLO: number;
  CODICE: string;
  DESCRIZIONE: string;
}

export interface DatiTecnici {
  ID_VEICOLO: number;
  TARGA: string;
  KILO_WATT: number;
  POTENZA_FISCALE: number;
  CILINDRATA: number;
  ID_CATEGORIA_EURO: number;
  ID_TIPO_VEICOLO?: number;
}

export interface Posizione {
  ID_POSIZIONE: number;
  ID_PROPRIETARIO: number;
  ID_VEICOLO: number;
  DATA_DECORRENZA: string;
}

export interface Luogo {
  ID_LUOGO: number;
  DENOMINAZIONE: string;
  ID_PROVINCIA: number;
  CAP: string;
}

export interface Provincia {
  ID_PROVINCIA: number;
  SIGLA_PROVINCIA: string;
  DESC_PROVINCIA: string;
}

export interface AnagraficaIrpef {
  id_anagrafica: number;
  cod_fiscale: string;
  fk_comune_residenza: number;
  de_cognome: string;
  de_nome: string;
  flg_sesso: string;
  fk_comune_fiscale: number;
}

export interface PersF {
  id: number;
  cod_fiscale: string;
  fk_comune: number;
  fk_fascia_reddito: number;
  fk_fascia_eta: number;
  fk_anagrafica: number;
  num_persone_carico: number;
  num_r1205_reddito_complessivo: number;
  num_r1302_reddito_imponib_addreg: number;
}

export interface FasciaReddito {
  id_fascia: number;
  de_fascia: string;
  num_reddito_da: number;
  num_reddito_a: number;
}

// Joined/enriched types for simulation
export interface ContribuenteVeicolo {
  codFiscale: string;
  cognome: string;
  nome: string;
  sesso: string;
  reddito: number;
  fasciaRedditoId: number;
  fasciaRedditoDesc: string;
  comuneDenom: string;
  provinciaId: number;
  provinciaSigla: string;
  provinciaNome: string;
  idVeicolo: number;
  targa: string;
  tipoVeicolo: string;
  tipoVeicoloDesc: string;
  kw: number;
  potenzaFiscale: number;
  cilindrata: number;
  categoriaEuro: number;
  bolloCalcolato: number;
}

export interface SimulationResult {
  soglia: number;
  riduzione: number;
  gettitoAttuale: number;
  gettitoSimulato: number;
  perditaGettito: number;
  percentualePerdita: number;
  veicoliTotali: number;
  veicoliCoinvolti: number;
  proprietariTotali: number;
  proprietariCoinvolti: number;
  perProvincia: ProvinciaResult[];
  perFasciaReddito: FasciaResult[];
  perTipoVeicolo: TipoVeicoloResult[];
  perComune: ComuneResult[];
  curvaPerdita: CurvePoint[];
}

export interface CurvePoint {
  soglia: number;
  perdita: number;
}

export interface ProvinciaResult {
  sigla: string;
  nome: string;
  gettitoAttuale: number;
  gettitoSimulato: number;
  perdita: number;
  contribuentiCoinvolti: number;
  contribuentiTotali: number;
}

export interface FasciaResult {
  fascia: string;
  contribuenti: number;
  bolloTotale: number;
  riduzioneTotale: number;
}

export interface TipoVeicoloResult {
  tipo: string;
  count: number;
  bolloTotale: number;
  riduzioneTotale: number;
}

export interface ComuneResult {
  comune: string;
  provincia: string;
  gettitoAttuale: number;
  gettitoSimulato: number;
  perdita: number;
  contribuentiCoinvolti: number;
  contribuentiTotali: number;
}
