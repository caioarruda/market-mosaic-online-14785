import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { WidgetConfig, ChartType, MetricKey } from '@/types/agilean';
import { Plus, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WidgetConfiguratorProps {
  widget?: WidgetConfig;
  onSave: (config: WidgetConfig) => void;
  isNew?: boolean;
}

const metricOptions: { value: MetricKey; label: string }[] = [
  { value: 'idp', label: 'IDP' },
  { value: 'va', label: 'VA (Valor Agregado)' },
  { value: 'vp', label: 'VP (Valor Planejado)' },
  { value: 'reprogrammedProgress', label: 'Progresso Reprogramado' },
  { value: 'vaAccum', label: 'VA Acumulado' },
  { value: 'vpAccum', label: 'VP Acumulado' },
  { value: 'reprogrammedProgressAccum', label: 'Progresso Reprog. Acumulado' },
  { value: 'realValue', label: 'Valor Real' },
  { value: 'plannedValue', label: 'Valor Planejado' },
  { value: 'realValueAccum', label: 'Valor Real Acumulado' },
  { value: 'plannedValueAccum', label: 'Valor Planejado Acumulado' },
];

export const WidgetConfigurator = ({ widget, onSave, isNew = false }: WidgetConfiguratorProps) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<WidgetConfig>(
    widget || {
      id: `widget-${Date.now()}`,
      type: 'chart',
      title: 'Novo Widget',
      chartType: 'line',
      metrics: ['vaAccum', 'vpAccum'],
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    }
  );

  useEffect(() => {
    if (open && widget) {
      setConfig(widget);
    } else if (open && isNew) {
      setConfig({
        id: `widget-${Date.now()}`,
        type: 'chart',
        title: 'Novo Widget',
        chartType: 'line',
        metrics: ['vaAccum', 'vpAccum'],
        x: 0,
        y: 0,
        w: 6,
        h: 4,
      });
    }
  }, [open, widget, isNew]);

  const handleSave = () => {
    onSave(config);
    setOpen(false);
  };

  const toggleMetric = (metric: MetricKey) => {
    const currentMetrics = config.metrics || [];
    const newMetrics = currentMetrics.includes(metric)
      ? currentMetrics.filter((m) => m !== metric)
      : [...currentMetrics, metric];
    setConfig({ ...config, metrics: newMetrics });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isNew ? (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Widget
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[60]">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Novo Widget' : 'Configurar Widget'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Widget</Label>
            <Select
              value={config.type}
              onValueChange={(value: WidgetConfig['type']) =>
                setConfig({ ...config, type: value })
              }
            >
              <SelectTrigger id="type" aria-label="Tipo de Widget">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground z-[70]">
                <SelectItem value="kpi">KPI</SelectItem>
                <SelectItem value="chart">Gráfico</SelectItem>
                <SelectItem value="info">Informações</SelectItem>
                <SelectItem value="table">Tabela</SelectItem>
                <SelectItem value="text">Texto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.type === 'chart' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="chartType">Tipo de Gráfico</Label>
                <Select
                  value={config.chartType}
                  onValueChange={(value: ChartType) =>
                    setConfig({ ...config, chartType: value })
                  }
                >
                  <SelectTrigger id="chartType" aria-label="Tipo de Gráfico">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground z-[70]">
                    <SelectItem value="line">Linha</SelectItem>
                    <SelectItem value="area">Área</SelectItem>
                    <SelectItem value="bar">Barras</SelectItem>
                    <SelectItem value="composed">Composto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Métricas</Label>
                <div className="grid grid-cols-2 gap-3">
                  {metricOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={config.metrics?.includes(option.value)}
                        onCheckedChange={() => toggleMetric(option.value)}
                      />
                      <label
                        htmlFor={option.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Largura (colunas)</Label>
              <Input
                id="width"
                type="number"
                min={2}
                max={12}
                value={config.w}
                onChange={(e) => setConfig({ ...config, w: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (linhas)</Label>
              <Input
                id="height"
                type="number"
                min={2}
                max={10}
                value={config.h}
                onChange={(e) => setConfig({ ...config, h: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
