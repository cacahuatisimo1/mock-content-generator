
import { useState } from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selected: Language) => {
    onChange(selected);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full h-10 pl-3 pr-4 flex items-center gap-2 button-transition">
            <Globe className="h-4 w-4" />
            <span>{language === 'en' ? 'English' : 'Español'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 p-2 animate-fade-in">
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => handleSelect('en')}
          >
            <span className="w-5">🇺🇸</span>
            <span>English</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => handleSelect('es')}
          >
            <span className="w-5">🇪🇸</span>
            <span>Español</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
