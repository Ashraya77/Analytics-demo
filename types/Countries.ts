export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Language {
  iso639_1: string;
  iso639_2: string;
  name: string;
  nativeName: string;
}

export interface Flags {
  svg: string;
  png: string;
}

export interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  flag: string;
  flags: Flags;
  nativeName: string;
  demonym: string;
  currencies: Currency[];
  languages: Language[];
  callingCodes: string[];
  independent: boolean;
  timezones: string[];
  borders: string[];
}

export type SortKey =
  | "name"
  | "capital"
  | "region"
  | "subregion"
  | "population"
  | "area";

export const SORT_KEYS: SortKey[] = [
  "name",
  "capital",
  "region",
  "subregion",
  "population",
  "area",
];