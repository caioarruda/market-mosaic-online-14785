import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult } from '@/types/agilean';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Activity } from 'lucide-react';

interface KPIWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
}

export const KPIWidget = ({ data, title }: KPIWidgetProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const isPositive = data.idp >= 0.9;

  return (
    <Card className="p-6 h-full flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col justify-center items-center p-4 bg-primary/5 rounded-lg">
          <Activity className="w-8 h-8 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">IDP</span>
          <span className={`text-2xl font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {formatPercentage(data.idp)}
          </span>
        </div>

        <div className="flex flex-col justify-center items-center p-4 bg-primary/5 rounded-lg">
          <Calendar className="w-8 h-8 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Atraso</span>
          <span className="text-2xl font-bold">{data.delay} dias</span>
        </div>

        <div className="flex flex-col justify-center items-center p-4 bg-primary/5 rounded-lg">
          <DollarSign className="w-8 h-8 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Valor Real Acumulado</span>
          <span className="text-xl font-bold">{formatCurrency(data.realValueAccum)}</span>
        </div>

        <div className="flex flex-col justify-center items-center p-4 bg-primary/5 rounded-lg">
          <DollarSign className="w-8 h-8 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Valor Planejado Acumulado</span>
          <span className="text-xl font-bold">{formatCurrency(data.plannedValueAccum)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          {data.advanceDelta >= 0 ? (
            <TrendingUp className="w-5 h-5 text-success" />
          ) : (
            <TrendingDown className="w-5 h-5 text-danger" />
          )}
          <span className="text-sm">
            Variação de Avanço: {formatPercentage(Math.abs(data.advanceDelta))}
          </span>
        </div>
      </div>
    </Card>
  );
};
