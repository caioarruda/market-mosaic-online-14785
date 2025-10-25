export interface Company {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  branchOfficeId: string;
  companyId: string;
  companyName: string;
  branchOfficeName: string;
  cep: string;
  street: string;
  district: string;
  number: string;
  complement: string;
  city: string;
  uf: string;
  phone: string;
  email: string;
  totalArea: number;
  privativeArea: number;
  startDate: string | null;
  endDate: string | null;
  plan: number;
  permissions: Array<{
    id: string;
    projectId: string;
    permission: string;
  }>;
  cnpj: string;
  usersCount: number | null;
  customerXId: string | null;
  isActive: boolean;
  idcActualCostReferenceDate: string | null;
}

export interface CompaniesResponse {
  result: {
    data: Company[];
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
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
