import { Card } from '@/components/ui/card';
import { ProjectIndicatorsResult } from '@/types/agilean';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TableWidgetProps {
  data: ProjectIndicatorsResult;
  title: string;
}

export const TableWidget = ({ data, title }: TableWidgetProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead className="text-right">IDP</TableHead>
              <TableHead className="text-right">Avanço Real Acum.</TableHead>
              <TableHead className="text-right">Avanço Planejado Acum.</TableHead>
              <TableHead className="text-right">Custo Real</TableHead>
              <TableHead className="text-right">Custo Planejado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.history.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {format(new Date(item.month), 'MMM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(item.idp)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(item.vaAccum)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(item.vpAccum)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.realValue)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.plannedValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};
