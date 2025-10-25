import { supabase } from '@/integrations/supabase/client';
import { CompaniesResponse, ProjectIndicatorsResponse } from '@/types/agileanCompanies';

const getToken = (): string => {
  const token = localStorage.getItem('agilean_token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado. Por favor, configure o token nas configurações.');
  }
  return token;
};

export const fetchCompanies = async (): Promise<CompaniesResponse> => {
  const token = getToken();
  
  const { data, error } = await supabase.functions.invoke('fetch-companies', {
    body: { token }
  });

  if (error) {
    console.error('Error fetching companies:', error);
    throw new Error(error.message || 'Falha ao buscar empresas');
  }

  return data as CompaniesResponse;
};

export const fetchProjectIndicatorsMedium = async (projectId: string): Promise<ProjectIndicatorsResponse> => {
  const token = getToken();
  
  const { data, error } = await supabase.functions.invoke('fetch-project-indicators-medium', {
    body: { projectId, token }
  });

  if (error) {
    console.error('Error fetching project indicators:', error);
    throw new Error(error.message || 'Falha ao buscar indicadores do projeto');
  }

  return data as ProjectIndicatorsResponse;
};
