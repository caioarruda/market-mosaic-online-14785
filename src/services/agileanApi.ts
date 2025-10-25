import { supabase } from '@/integrations/supabase/client';
import { ProjectIndicatorsResponse } from '@/types/agilean';

export const fetchProjectIndicators = async (projectId: string): Promise<ProjectIndicatorsResponse> => {
  const { data, error } = await supabase.functions.invoke('fetch-project-indicators', {
    body: { projectId }
  });

  if (error) {
    console.error('Error fetching project indicators:', error);
    throw new Error(error.message || 'Failed to fetch project indicators');
  }

  return data as ProjectIndicatorsResponse;
};
