
import { useState } from 'react';
import { ContentType } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface ContentTypeSelectorProps {
  contentTypes: ContentType[];
  onSelect: (contentType: ContentType) => void;
}

export default function ContentTypeSelector({ contentTypes, onSelect }: ContentTypeSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {contentTypes.map(contentType => (
        <Card 
          key={contentType.id}
          className={`border transition-all duration-300 cursor-pointer overflow-hidden ${
            contentType.selected 
              ? 'border-primary ring-2 ring-primary/10' 
              : 'border-border hover:border-primary/50'
          } ${
            hoveredId === contentType.id ? 'transform -translate-y-1' : ''
          }`}
          onClick={() => onSelect(contentType)}
          onMouseEnter={() => setHoveredId(contentType.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg">{contentType.name}</CardTitle>
            <CardDescription>{contentType.description}</CardDescription>
            {contentType.selected && (
              <div className="absolute top-3 right-3">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  <Check className="h-3 w-3 mr-1" /> Selected
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Fields: {contentType.fields.filter(f => f.selected).length} selected / {contentType.fields.length} available
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
