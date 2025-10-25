import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TextWidgetProps {
  title: string;
  content?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  textColor?: string;
  backgroundColor?: string;
}

const fontSizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const TextWidget = ({ 
  title, 
  content = 'Digite seu texto aqui...', 
  fontSize = 'base',
  textColor,
  backgroundColor 
}: TextWidgetProps) => {
  return (
    <Card 
      className="p-6 h-full flex flex-col"
      style={{ backgroundColor }}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="flex-1 overflow-auto">
        <p 
          className={cn(fontSizeClasses[fontSize], "whitespace-pre-wrap")}
          style={{ color: textColor }}
        >
          {content}
        </p>
      </div>
    </Card>
  );
};
