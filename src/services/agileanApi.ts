import { supabase } from '@/integrations/supabase/client';
import { ProjectIndicatorsResponse } from '@/types/agilean';

const getToken = (): string => {
  const token = localStorage.getItem('agilean_token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado. Por favor, configure o token nas configurações.');
  }
  return token;
};

export const fetchProjectIndicators = async (projectId: string): Promise<ProjectIndicatorsResponse> => {
  const token = getToken();
  
  const { data, error } = await supabase.functions.invoke('fetch-project-indicators', {
    body: { projectId, token }
  });

  if (error) {
    console.error('Error fetching project indicators:', error);
    throw new Error(error.message || 'Falha ao buscar indicadores do projeto');
  }

  return data as ProjectIndicatorsResponse;
};
