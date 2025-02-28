
import { useState } from 'react';
import { OutputFormat } from '../types';
import { Button } from '@/components/ui/button';
import { FileJson, FileText, FileSpreadsheet, Database } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OutputFormatSelectorProps {
  format: OutputFormat;
  onChange: (format: OutputFormat) => void;
}

export default function OutputFormatSelector({ format, onChange }: OutputFormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selected: OutputFormat) => {
    onChange(selected);
    setIsOpen(false);
  };

  const getFormatIcon = (format: OutputFormat) => {
    switch (format) {
      case 'json':
        return <FileJson className="h-4 w-4" />;
      case 'csv':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'postgres':
      case 'mysql':
      case 'mongodb':
        return <Database className="h-4 w-4" />;
      default:
        return <FileJson className="h-4 w-4" />;
    }
  };

  const getFormatLabel = (format: OutputFormat) => {
    switch (format) {
      case 'json':
        return 'JSON';
      case 'csv':
        return 'CSV';
      case 'excel':
        return 'Excel';
      case 'postgres':
        return 'PostgreSQL';
      case 'mysql':
        return 'MySQL';
      case 'mongodb':
        return 'MongoDB';
      default:
        return 'JSON';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-md h-10 px-4 flex items-center gap-2 button-transition"
        >
          {getFormatIcon(format)}
          <span>{getFormatLabel(format)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 animate-fade-in">
        <DropdownMenuLabel>Output Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => handleSelect('json')}
          >
            <FileJson className="h-4 w-4" />
            <span>JSON</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => handleSelect('csv')}
          >
            <FileText className="h-4 w-4" />
            <span>CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => handleSelect('excel')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Excel</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Database Formats</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => handleSelect('postgres')}
          >
            <Database className="h-4 w-4" />
            <span>PostgreSQL</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => handleSelect('mysql')}
          >
            <Database className="h-4 w-4" />
            <span>MySQL</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => handleSelect('mongodb')}
          >
            <Database className="h-4 w-4" />
            <span>MongoDB</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
