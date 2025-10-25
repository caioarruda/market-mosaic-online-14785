import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult } from '@/types/agileanCompanies';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface RestrictionsChartWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
  chartType: 'line' | 'area';
  backgroundColor?: string;
}

export const RestrictionsChartWidget = ({ 
  data, 
  title, 
  chartType = 'line',
  backgroundColor 
}: RestrictionsChartWidgetProps) => {
  const chartData = data.history.map((point) => ({
    date: format(new Date(point.reprogrammingDate), 'MMM/yy', { locale: ptBR }),
    'IRR': point.irr * 100,
    'Planejadas': point.plannedRestrictions,
    'Resolvidas': point.resolvedRestrictions,
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="p-6 h-full flex flex-col" style={{ backgroundColor }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="IRR" stroke="hsl(15 82% 58%)" fill="hsl(15 82% 58%)" strokeWidth={2} name="IRR (%)" />
              <Area type="monotone" dataKey="Planejadas" stroke="hsl(199 93% 73%)" fill="hsl(199 93% 73%)" strokeWidth={2} name="Restrições Planejadas" />
              <Area type="monotone" dataKey="Resolvidas" stroke="hsl(142 72% 52%)" fill="hsl(142 72% 52%)" strokeWidth={2} name="Restrições Resolvidas" />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="IRR" stroke="hsl(15 82% 58%)" strokeWidth={2} name="IRR (%)" />
              <Line type="monotone" dataKey="Planejadas" stroke="hsl(199 93% 73%)" strokeWidth={2} name="Restrições Planejadas" />
              <Line type="monotone" dataKey="Resolvidas" stroke="hsl(142 72% 52%)" strokeWidth={2} name="Restrições Resolvidas" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
