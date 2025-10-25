import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult } from '@/types/agileanCompanies';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface RestrictionsKPIWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
  backgroundColor?: string;
}

export const RestrictionsKPIWidget = ({ data, title, backgroundColor }: RestrictionsKPIWidgetProps) => {
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById(`widget-${title}`);
    if (printContent) {
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
              .kpi-card { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
              .kpi-value { font-size: 32px; font-weight: bold; margin: 10px 0; }
              .kpi-label { color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col" style={{ backgroundColor }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4" />
        </Button>
      </div>
      
      <div id={`widget-${title}`} className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col justify-center items-center p-4 bg-primary/10 rounded-lg">
          <TrendingUp className="w-8 h-8 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">IRR</span>
          <span className={`text-2xl font-bold ${data.irr >= 0.9 ? 'text-success' : 'text-danger'}`}>
            {formatPercentage(data.irr)}
          </span>
        </div>

        <div className="flex flex-col justify-center items-center p-4 bg-primary/10 rounded-lg">
          <AlertCircle className="w-8 h-8 mb-2 text-danger" />
          <span className="text-sm text-muted-foreground">Restrições em Atraso</span>
          <span className="text-2xl font-bold text-danger">{data.countOfDelayedRestriction}</span>
        </div>

        <div className="flex flex-col justify-center items-center p-4 bg-primary/10 rounded-lg">
          <Clock className="w-8 h-8 mb-2 text-primary" />
          <span className="text-sm text-muted-foreground">Total de Restrições</span>
          <span className="text-2xl font-bold">{data.countOfRestrictions}</span>
        </div>

        <div className="flex flex-col justify-center items-center p-4 bg-primary/10 rounded-lg">
          <CheckCircle className="w-8 h-8 mb-2 text-success" />
          <span className="text-sm text-muted-foreground">Restrições Resolvidas</span>
          <span className="text-2xl font-bold text-success">{data.countOfResolvedRestrictions}</span>
        </div>
      </div>
    </Card>
  );
};
