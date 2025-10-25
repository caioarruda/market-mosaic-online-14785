import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult, ChartType, MetricKey } from '@/types/agilean';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface ChartWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
  chartType: ChartType;
  metrics: MetricKey[];
}

const metricConfig: Record<MetricKey, { label: string; color: string }> = {
  idp: { label: 'IDP', color: '#8b5cf6' },
  va: { label: 'VA', color: '#10b981' },
  vp: { label: 'VP', color: '#3b82f6' },
  reprogrammedProgress: { label: 'Progresso Reprogramado', color: '#f59e0b' },
  vaAccum: { label: 'VA Acumulado', color: '#10b981' },
  vpAccum: { label: 'VP Acumulado', color: '#3b82f6' },
  reprogrammedProgressAccum: { label: 'Progresso Reprogramado Acumulado', color: '#f59e0b' },
  realValue: { label: 'Valor Real', color: '#10b981' },
  plannedValue: { label: 'Valor Planejado', color: '#3b82f6' },
  reprogrammedValueAccum: { label: 'Valor Reprogramado Acumulado', color: '#f59e0b' },
  realValueAccum: { label: 'Valor Real Acumulado', color: '#10b981' },
  plannedValueAccum: { label: 'Valor Planejado Acumulado', color: '#3b82f6' },
};

export const ChartWidget = ({ data, title, chartType, metrics }: ChartWidgetProps) => {
  const chartData = data.history.map((item) => ({
    month: format(new Date(item.month), 'MMM/yy'),
    ...item,
  }));

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const axes = (
      <>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs" 
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            border: '1px solid hsl(var(--border))' 
          }}
        />
        <Legend />
      </>
    );

    const metricComponents = metrics.map((metric) => {
      const config = metricConfig[metric];
      
      switch (chartType) {
        case 'line':
          return (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              name={config.label}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          );
        case 'area':
          return (
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
              name={config.label}
            />
          );
        case 'bar':
          return (
            <Bar
              key={metric}
              dataKey={metric}
              fill={config.color}
              name={config.label}
            />
          );
        default:
          return (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              name={config.label}
              strokeWidth={2}
            />
          );
      }
    });

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {axes}
            {metricComponents}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {axes}
            {metricComponents}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {axes}
            {metricComponents}
          </BarChart>
        );
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {axes}
            {metricComponents}
          </ComposedChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            {axes}
            {metricComponents}
          </LineChart>
        );
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
