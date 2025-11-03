export type TrendDirection = 'up' | 'down' | 'flat';

export interface TimelineSummary {
  label: string;
  previousLabel: string | null;
  count: number;
  changePercent: number | null;
  previousCount: number | null;
  trend: TrendDirection;
}

export interface ThemeTokens {
  accent: string;
  accentBright: string;
  text: string;
  subtleText: string;
  tooltipBackground: string;
  tooltipBorder: string;
  gridLine: string;
  line: string;
  lineBright: string;
  lineBorder: string;
  lineAreaTop: string;
  lineAreaBottom: string;
}

export interface ChartMetrics {
  topCrimeType: { type: string; count: number } | null;
  timelineSummary: TimelineSummary | null;
}

export const CITIES = [
  { value: 'all', label: 'feature.crimeStats.filters.locations.all' },
  { value: 'Oakville', label: 'feature.crimeStats.filters.locations.oakville' },
  {
    value: 'Burlington',
    label: 'feature.crimeStats.filters.locations.burlington',
  },
  { value: 'Milton', label: 'feature.crimeStats.filters.locations.milton' },
  {
    value: 'Halton Hills',
    label: 'feature.crimeStats.filters.locations.haltonHills',
  },
] as const;

export const CRIME_CATEGORIES = [
  { value: 'all', label: 'feature.crimeStats.filters.categories.all' },
  { value: 'violent', label: 'feature.crimeStats.filters.categories.violent' },
  {
    value: 'break-enter',
    label: 'feature.crimeStats.filters.categories.breakEnter',
  },
  { value: 'theft', label: 'feature.crimeStats.filters.categories.theft' },
  { value: 'traffic', label: 'feature.crimeStats.filters.categories.traffic' },
  {
    value: 'property-damage',
    label: 'feature.crimeStats.filters.categories.propertyDamage',
  },
  { value: 'other', label: 'feature.crimeStats.filters.categories.other' },
] as const;

export const TIMEFRAMES = [
  { value: 'year', label: 'feature.crimeStats.filters.timeframes.year' },
  { value: 'quarter', label: 'feature.crimeStats.filters.timeframes.quarter' },
  { value: 'month', label: 'feature.crimeStats.filters.timeframes.month' },
] as const;

export type TimeframeValue = (typeof TIMEFRAMES)[number]['value'];

export const CRIME_CATEGORY_MAPPING: Record<string, string[]> = {
  all: [],
  violent: ['Attempt Murder', 'Homicide', 'Robbery', 'Offensive Weapons'],
  'break-enter': [
    'Break and Enter House',
    'Break and Enter Other',
    'Break and Enter Shop',
    'Break and Enter School',
  ],
  theft: [
    'Theft of Vehicle',
    'Theft From Auto',
    'Theft of Bicycle',
    'Theft Over',
    'Theft Under',
  ],
  traffic: [
    'Impaired Driving',
    'Dangerous Operation - Traffic',
    'MVC - Fatality',
    'MVC - Hit & Run',
    'MVC - PI',
  ],
  'property-damage': [
    'Arson',
    'Property Damage Over $5,000',
    'Property Damage Under $5,000',
  ],
  other: ['Federal Stats - Drugs', 'Recovered Vehicle Oth Service'],
};

export const CRIME_LABEL_ABBREVIATIONS: Record<string, string> = {
  'Break and Enter House': 'B&E House',
  'Break and Enter Other': 'B&E Other',
  'Break and Enter Shop': 'B&E Shop',
  'Break and Enter School': 'B&E School',
  'Property Damage Over $5,000': 'Prop. Damage >$5K',
  'Property Damage Under $5,000': 'Prop. Damage <$5K',
  'Dangerous Operation - Traffic': 'Dangerous Op. - Traffic',
  'Federal Stats - Drugs': 'Fed. Stats - Drugs',
  'Recovered Vehicle Oth Service': 'Recovered Vehicle',
};
