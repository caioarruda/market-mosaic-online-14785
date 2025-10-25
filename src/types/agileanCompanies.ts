export interface Company {
  id: string;
  name: string;
}

export interface CompaniesResponse {
  result: {
    data: Company[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
  };
  errorMessage: string | null;
  timeGenerated: string;
}

export interface Restriction {
  title: string;
  impactLevel: string;
  status: string;
  deadLineDate: string;
  responsibleName: string;
  sectorName: string;
  delayDays?: number;
}

export interface HistoryPoint {
  reprogrammingDate: string;
  plannedRestrictions: number;
  resolvedRestrictions: number;
  irr: number;
}

export interface ProjectIndicatorsResult {
  irr: number;
  countOfDelayedRestriction: number;
  countOfRestrictions: number;
  countOfResolvedRestrictions: number;
  mostDelayedRestrictions: Restriction[];
  history: HistoryPoint[];
}

export interface ProjectIndicatorsResponse {
  result: ProjectIndicatorsResult;
  errorMessage: string | null;
  timeGenerated: string;
}
