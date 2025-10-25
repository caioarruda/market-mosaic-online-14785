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
    const { token } = await req.json();
    
    if (!token) {
      throw new Error('Token de autenticação não fornecido');
    }

    console.log('Fetching all projects from Agilean API with pagination...');

    let allProjects: any[] = [];
    let nextPageUrl: string | null = 'https://api-support.hmg.agilean.com.br/api/v1/projects?pageSize=100';

    while (nextPageUrl) {
      const response: Response = await fetch(nextPageUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Agilean API error:', response.status, errorText);
        throw new Error(`Erro ao buscar projetos: ${response.status}`);
      }

      const data: any = await response.json();
      
      if (data.result?.data) {
        allProjects = [...allProjects, ...data.result.data];
      }

      // Check for next page link
      const nextLink: any = data.result?.links?.find((link: any) => link.rel === 'nextPage');
      nextPageUrl = nextLink?.href || null;

      console.log(`Fetched ${data.result?.data?.length || 0} projects. Total so far: ${allProjects.length}`);
    }

    console.log('All projects fetched successfully:', allProjects.length);

    // Return all projects in the same format
    const finalResponse = {
      result: {
        data: allProjects,
        links: []
      },
      errorMessage: null,
      timeGenerated: new Date().toISOString()
    };

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-companies function:', error);
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
