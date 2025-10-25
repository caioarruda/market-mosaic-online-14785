import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, token } = await req.json();
    
    if (!token) {
      throw new Error('Token de autenticação não fornecido');
    }

    if (!projectId) {
      throw new Error('ID do projeto não fornecido');
    }

    console.log('Fetching project indicators for project:', projectId);

    const response = await fetch(
      `https://api-support.hmg.agilean.com.br/api/v1/portal/global/project/${projectId}/indicators-long-data`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Agilean API error:', response.status, errorText);
      throw new Error(`Erro ao buscar indicadores: ${response.status}`);
    }

    const data = await response.json();
    console.log('Indicators fetched successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-project-indicators function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({
        error: errorMessage,
        result: null,
        errorMessage: errorMessage,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
