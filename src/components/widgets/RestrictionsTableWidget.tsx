import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult } from '@/types/agileanCompanies';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RestrictionsTableWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
  backgroundColor?: string;
}

export const RestrictionsTableWidget = ({ data, title, backgroundColor }: RestrictionsTableWidgetProps) => {
  const handlePrint = () => {
    window.print();
  };

  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
      case 'alto':
        return 'destructive';
      case 'medium':
      case 'médio':
        return 'default';
      case 'low':
      case 'baixo':
        return 'secondary';
      default:
        return 'default';
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
      
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Impacto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead className="text-right">Atraso (dias)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.mostDelayedRestrictions.map((restriction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{restriction.title}</TableCell>
                <TableCell>{restriction.sectorName}</TableCell>
                <TableCell>{restriction.responsibleName}</TableCell>
                <TableCell>
                  <Badge variant={getImpactColor(restriction.impactLevel)}>
                    {restriction.impactLevel}
                  </Badge>
                </TableCell>
                <TableCell>{restriction.status}</TableCell>
                <TableCell>
                  {format(new Date(restriction.deadLineDate), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right font-semibold text-danger">
                  {restriction.delayDays || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};
