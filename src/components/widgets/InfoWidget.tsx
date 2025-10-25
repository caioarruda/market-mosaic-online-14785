import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult } from '@/types/agilean';
import { Calendar, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InfoWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
}

export const InfoWidget = ({ data, title }: InfoWidgetProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Info className="w-5 h-5" />
        {title}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
          <Calendar className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="text-sm font-medium">Data Final do Projeto</p>
            <p className="text-lg">{formatDate(data.projectEndDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
          <Calendar className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="text-sm font-medium">Data Final Reprogramada</p>
            <p className="text-lg">{formatDate(data.reprogrammingEndDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
          <Clock className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="text-sm font-medium">Atraso</p>
            <p className="text-lg">{Math.abs(data.delay)} dias</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">VA Acumulado</p>
              <p className="font-semibold">{(data.vaAccum * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">VP Acumulado</p>
              <p className="font-semibold">{(data.vpAccum * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Progresso Reprogramado Acumulado</p>
              <p className="font-semibold">{(data.reprogrammedProgressAccum * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">IDP</p>
              <p className="font-semibold">{(data.idp * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
