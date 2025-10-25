import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import GridLayout, { Layout } from 'react-grid-layout';
import { fetchCompanies, fetchProjectIndicatorsMedium } from '@/services/agileanCompaniesApi';
import { WidgetConfig, WidgetColor } from '@/types/agilean';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Printer, Settings, Plus, Trash2, LayoutDashboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { TextWidget } from '@/components/widgets/TextWidget';
import { RestrictionsKPIWidget } from '@/components/widgets/RestrictionsKPIWidget';
import { RestrictionsChartWidget } from '@/components/widgets/RestrictionsChartWidget';
import { RestrictionsTableWidget } from '@/components/widgets/RestrictionsTableWidget';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import agileanLogo from '@/assets/agilean-logo.png';
import { WidgetConfigurator } from '@/components/dashboard/WidgetConfigurator';
import { CompanyCombobox } from '@/components/dashboard/CompanyCombobox';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'kpi-1',
    type: 'kpi',
    title: 'Indicadores de Restrições',
    color: 'default',
    x: 0,
    y: 0,
    w: 6,
    h: 3,
  },
  {
    id: 'chart-1',
    type: 'chart',
    title: 'Histórico de IRR e Restrições',
    chartType: 'line',
    color: 'default',
    x: 6,
    y: 0,
    w: 6,
    h: 4,
  },
  {
    id: 'table-1',
    type: 'table',
    title: 'Restrições Mais Atrasadas',
    color: 'default',
    x: 0,
    y: 3,
    w: 12,
    h: 4,
  },
  {
    id: 'text-1',
    type: 'text',
    title: 'Observações',
    content: 'Use este espaço para adicionar observações importantes sobre o projeto.',
    fontSize: 'base',
    color: 'areia',
    x: 0,
    y: 7,
    w: 12,
    h: 2,
  },
];

const colorMap: Record<WidgetColor, string> = {
  telha: 'hsl(15 82% 58%)',
  areia: 'hsl(31 88% 72%)',
  ceu: 'hsl(199 93% 73%)',
  aco: 'hsl(200 4% 38%)',
  solda: 'hsl(14 54% 16%)',
  default: 'hsl(var(--card))',
};

export default function AgileanDynamicDashboard() {
  const [token, setToken] = useState(localStorage.getItem('agilean_token') || '');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`agilean-dashboard-layout`);
    if (saved) {
      try {
        const layout = JSON.parse(saved);
        const widgetsFromStorage = Array.isArray(layout.widgets) ? layout.widgets : [];
        setWidgets(widgetsFromStorage.length > 0 ? widgetsFromStorage : DEFAULT_WIDGETS);
      } catch (error) {
        console.error('Error loading saved layout:', error);
        setWidgets(DEFAULT_WIDGETS);
      }
    } else {
      setWidgets(DEFAULT_WIDGETS);
    }
  }, []);

  const { data: companiesData, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    enabled: !!token,
  });

  const { data: indicatorsData, isLoading: indicatorsLoading } = useQuery({
    queryKey: ['project-indicators-medium', selectedCompanyId],
    queryFn: () => fetchProjectIndicatorsMedium(selectedCompanyId),
    enabled: !!selectedCompanyId && !!token,
    refetchInterval: 60000,
  });

  const saveToken = () => {
    if (token.trim()) {
      localStorage.setItem('agilean_token', token.trim());
      setTokenDialogOpen(false);
      toast({
        title: 'Token salvo',
        description: 'Token de autenticação configurado com sucesso.',
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um token válido.',
        variant: 'destructive',
      });
    }
  };

  const saveLayout = () => {
    const layout = { widgets };
    localStorage.setItem(`agilean-dashboard-layout`, JSON.stringify(layout));
    toast({
      title: 'Layout salvo',
      description: 'Suas configurações foram salvas com sucesso.',
    });
  };

  const handleLayoutChange = (layout: Layout[]) => {
    const updatedWidgets = widgets.map((widget) => {
      const layoutItem = layout.find((l) => l.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return widget;
    });
    setWidgets(updatedWidgets);
  };

  const handlePrint = () => {
    window.print();
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const addTextWidget = () => {
    const newWidget: WidgetConfig = {
      id: `text-${Date.now()}`,
      type: 'text',
      title: 'Novo Texto',
      content: 'Digite seu texto aqui...',
      fontSize: 'base',
      color: 'default',
      x: 0,
      y: Infinity,
      w: 6,
      h: 2,
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleAddWidget = (config: WidgetConfig) => {
    const generatedId = (config as any).id || `${config.type}-${Date.now()}`;
    const newWidget: WidgetConfig = {
      ...config,
      id: generatedId,
      x: 0,
      y: Infinity,
      w: config.w || 6,
      h: config.h || 3,
      color: config.color || 'default',
    } as WidgetConfig;
    setWidgets([...widgets, newWidget]);
  };

  const layout: Layout[] = widgets.map((widget) => ({
    i: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
    minW: 2,
    minH: 2,
  }));

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1800px] mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={agileanLogo} alt="Agilean logo" className="h-8 w-auto" />
              <h1 className="text-3xl font-heading font-bold text-primary">Agilean Dashboard Pro</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar Token
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurar Token de Autenticação</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="token">Token Bearer</Label>
                      <Input
                        id="token"
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Cole seu token aqui"
                      />
                    </div>
                    <Button onClick={saveToken} className="w-full">
                      Salvar Token
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Dashboard
              </Button>
            </div>
          </div>

          {!token ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-lg mb-4">Configure o token de autenticação para começar</p>
                <Button onClick={() => setTokenDialogOpen(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Token
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Label htmlFor="company-select" className="text-sm whitespace-nowrap">Projeto:</Label>
                  {companiesLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CompanyCombobox
                      companies={companiesData?.result?.data || []}
                      value={selectedCompanyId}
                      onChange={setSelectedCompanyId}
                      disabled={companiesLoading}
                    />
                  )}

                  <Button
                    variant={isEditMode ? 'default' : 'outline'}
                    onClick={() => setIsEditMode(!isEditMode)}
                    size="sm"
                  >
                    {isEditMode ? 'Modo Visualização' : 'Modo Edição'}
                  </Button>

                  {isEditMode && (
                    <div className="flex items-center gap-2">
                      <WidgetConfigurator isNew onSave={handleAddWidget} />
                      <Button size="sm" variant="outline" onClick={addTextWidget}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Texto
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button onClick={saveLayout} variant="outline" size="sm">
                  Salvar Layout
                </Button>
              </div>

              {!selectedCompanyId ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <p className="text-lg text-muted-foreground">Selecione uma empresa para visualizar os indicadores</p>
                </div>
              ) : indicatorsLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg">Carregando indicadores...</p>
                  </div>
                </div>
              ) : indicatorsData?.errorMessage ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center max-w-md">
                    <p className="text-lg text-danger mb-4">Erro ao carregar dados</p>
                    <p className="text-sm text-muted-foreground">{indicatorsData.errorMessage}</p>
                  </div>
                </div>
              ) : (
                <GridLayout
                  className="layout"
                  layout={layout}
                  cols={12}
                  rowHeight={100}
                  width={1740}
                  onLayoutChange={handleLayoutChange}
                  isDraggable={isEditMode}
                  isResizable={isEditMode}
                  draggableHandle=".drag-handle"
                >
                  {widgets.map((widget) => (
                    <div key={widget.id} className="relative">
                      {isEditMode && (
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <div className="drag-handle cursor-move bg-background/80 p-1 rounded border">
                            <LayoutDashboard className="w-4 h-4" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWidget(widget.id)}
                            className="bg-background/80"
                          >
                            <Trash2 className="w-4 h-4 text-danger" />
                          </Button>
                        </div>
                      )}

                      {widget.type === 'kpi' && indicatorsData?.result && (
                        <RestrictionsKPIWidget
                          data={indicatorsData.result}
                          title={widget.title}
                          backgroundColor={widget.color ? colorMap[widget.color] : undefined}
                        />
                      )}
                      {widget.type === 'chart' && indicatorsData?.result && (
                        <RestrictionsChartWidget
                          data={indicatorsData.result}
                          title={widget.title}
                          chartType={widget.chartType as 'line' | 'area' || 'line'}
                          backgroundColor={widget.color ? colorMap[widget.color] : undefined}
                        />
                      )}
                      {widget.type === 'table' && indicatorsData?.result && (
                        <RestrictionsTableWidget
                          data={indicatorsData.result}
                          title={widget.title}
                          backgroundColor={widget.color ? colorMap[widget.color] : undefined}
                        />
                      )}
                      {widget.type === 'text' && (
                        <TextWidget
                          title={widget.title}
                          content={widget.content}
                          fontSize={widget.fontSize}
                          textColor={widget.textColor}
                          backgroundColor={widget.color ? colorMap[widget.color] : undefined}
                        />
                      )}
                    </div>
                  ))}
                </GridLayout>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
