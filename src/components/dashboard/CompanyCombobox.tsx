import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

export interface CompanyOption {
  id: string;
  name: string;
}

interface CompanyComboboxProps {
  companies: CompanyOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CompanyCombobox: React.FC<CompanyComboboxProps> = ({
  companies,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);

  const selected = companies.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecionar projeto"
          disabled={disabled}
          className="w-[300px] justify-between"
        
        >
          {selected ? selected.name : 'Selecione um projeto'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-popover z-50">
        <Command>
          <CommandInput placeholder="Buscar projeto..." className="h-9" />
          <CommandList className="bg-background">
            <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
            <CommandGroup>
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  value={`${company.name}__${company.id}`}
                  onSelect={() => {
                    onChange(company.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === company.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
