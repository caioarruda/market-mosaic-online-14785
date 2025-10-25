export interface MonthlyHistoryData {
  month: string;
  idp: number;
  vaAccum: number;
  vpAccum: number;
  reprogrammedProgressAccum: number;
  reprogrammedValueAccum: number;
  realValueAccum: number;
  plannedValueAccum: number;
  va: number;
  vp: number;
  reprogrammedProgress: number;
  realValue: number;
  plannedValue: number;
  reprogrammedContribution: number;
  realContribution: number;
  plannedContribution: number;
  reprogrammedContributionAccum: number;
  realContributionAccum: number;
  plannedContributionAccum: number;
}

export interface ProjectIndicatorsResult {
  idp: number;
  history: MonthlyHistoryData[];
  vaAccum: number;
  vpAccum: number;
  realValueAccum: number;
  plannedValueAccum: number;
  projectEndDate: string;
  reprogrammingEndDate: string;
  reprogrammedProgressAccum: number;
  reprogrammedValueAccum: number;
  advanceDelta: number;
  delay: number;
}

export interface ProjectIndicatorsResponse {
  result: ProjectIndicatorsResult;
  errorMessage: string | null;
  timeGenerated: string;
}

export type ChartType = 'line' | 'area' | 'bar' | 'composed';

export type MetricKey = 
  | 'idp'
  | 'va' | 'vp' | 'reprogrammedProgress'
  | 'vaAccum' | 'vpAccum' | 'reprogrammedProgressAccum'
  | 'realValue' | 'plannedValue' | 'reprogrammedValueAccum'
  | 'realValueAccum' | 'plannedValueAccum';

export type WidgetColor = 'telha' | 'areia' | 'ceu' | 'aco' | 'solda' | 'default';

export interface WidgetConfig {
  id: string;
  type: 'kpi' | 'chart' | 'info' | 'table' | 'text';
  title: string;
  chartType?: ChartType;
  metrics?: MetricKey[];
  color?: WidgetColor;
  content?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textColor?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  projectId: string;
}
