import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import GridLayout, { Layout } from 'react-grid-layout';
import { fetchProjectIndicators } from '@/services/agileanApi';
import { WidgetConfig, DashboardLayout } from '@/types/agilean';
import { KPIWidget } from '@/components/widgets/KPIWidget';
import { ChartWidget } from '@/components/widgets/ChartWidget';
import { InfoWidget } from '@/components/widgets/InfoWidget';
import { TableWidget } from '@/components/widgets/TableWidget';
import { WidgetConfigurator } from '@/components/dashboard/WidgetConfigurator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, Save, LayoutDashboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const DEFAULT_PROJECT_ID = 'd392f81c-6f1d-405a-93b7-00181b951661';

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'kpi-1',
    type: 'kpi',
    title: 'Indicadores Principais',
    x: 0,
    y: 0,
    w: 6,
    h: 3,
  },
  {
    id: 'chart-1',
    type: 'chart',
    title: 'VA vs VP vs Progresso Reprogramado (Acumulado)',
    chartType: 'line',
    metrics: ['vaAccum', 'vpAccum', 'reprogrammedProgressAccum'],
    x: 6,
    y: 0,
    w: 6,
    h: 4,
  },
  {
    id: 'chart-2',
    type: 'chart',
    title: 'Valores Reais vs Planejados',
    chartType: 'area',
    metrics: ['realValueAccum', 'plannedValueAccum'],
    x: 0,
    y: 3,
    w: 6,
    h: 4,
  },
  {
    id: 'info-1',
    type: 'info',
    title: 'Informações do Projeto',
    x: 6,
    y: 4,
    w: 3,
    h: 4,
  },
  {
    id: 'table-1',
    type: 'table',
    title: 'Histórico Mensal',
    x: 9,
    y: 4,
    w: 3,
    h: 4,
  },
];

export default function DynamicDashboard() {
  const [projectId, setProjectId] = useState(DEFAULT_PROJECT_ID);
  const [currentProjectId, setCurrentProjectId] = useState(DEFAULT_PROJECT_ID);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load saved layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`dashboard-layout-${currentProjectId}`);
    if (saved) {
      try {
        const layout: DashboardLayout = JSON.parse(saved);
        setWidgets(layout.widgets);
      } catch (error) {
        console.error('Error loading saved layout:', error);
        setWidgets(DEFAULT_WIDGETS);
      }
    } else {
      setWidgets(DEFAULT_WIDGETS);
    }
  }, [currentProjectId]);

  // Fetch project data
  const { data, isLoading, error } = useQuery({
    queryKey: ['project-indicators', currentProjectId],
    queryFn: () => fetchProjectIndicators(currentProjectId),
    refetchInterval: 60000, // Refetch every minute
  });

  const saveLayout = () => {
    const layout: DashboardLayout = {
      widgets,
      projectId: currentProjectId,
    };
    localStorage.setItem(`dashboard-layout-${currentProjectId}`, JSON.stringify(layout));
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

  const addWidget = (config: WidgetConfig) => {
    setWidgets([...widgets, config]);
  };

  const updateWidget = (config: WidgetConfig) => {
    setWidgets(widgets.map((w) => (w.id === config.id ? config : w)));
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const handleLoadProject = () => {
    setCurrentProjectId(projectId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Carregando dados do projeto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-lg text-danger mb-4">Erro ao carregar dados</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data?.result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Nenhum dado disponível</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Dashboard de Indicadores</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="projectId" className="text-sm">ID do Projeto:</Label>
              <Input
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-[300px]"
                placeholder="ID do projeto"
              />
              <Button onClick={handleLoadProject} variant="outline">
                Carregar
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Button
              variant={isEditMode ? 'default' : 'outline'}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? 'Modo Visualização' : 'Modo Edição'}
            </Button>
            {isEditMode && <WidgetConfigurator onSave={addWidget} isNew />}
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={saveLayout} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar Layout
            </Button>
            <Button
              onClick={() => {
                setWidgets(DEFAULT_WIDGETS);
                toast({
                  title: 'Layout restaurado',
                  description: 'O layout foi restaurado para o padrão.',
                });
              }}
              variant="outline"
            >
              Restaurar Padrão
            </Button>
          </div>
        </div>

        {/* Grid Layout */}
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
                  <WidgetConfigurator widget={widget} onSave={updateWidget} />
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
              
              {widget.type === 'kpi' && (
                <KPIWidget data={data.result} title={widget.title} />
              )}
              {widget.type === 'chart' && (
                <ChartWidget
                  data={data.result}
                  title={widget.title}
                  chartType={widget.chartType!}
                  metrics={widget.metrics!}
                />
              )}
              {widget.type === 'info' && (
                <InfoWidget data={data.result} title={widget.title} />
              )}
              {widget.type === 'table' && (
                <TableWidget data={data.result} title={widget.title} />
              )}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
