
import { useState, useEffect } from 'react';
import { GeneratedItem, OutputFormat } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DownloadCloud, Copy, Check, FileJson, FileText, FileSpreadsheet, Database } from 'lucide-react';
import { formatAsJson, formatAsCsv, formatAsPostgres, formatAsMysql, formatAsMongodb, downloadContent } from '../utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface ResultDisplayProps {
  items: GeneratedItem[];
  format: OutputFormat;
  language: string;
}

export default function ResultDisplay({ items, format, language }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [copied, setCopied] = useState(false);
  const [previewText, setPreviewText] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    let text = '';
    
    switch (format) {
      case 'json':
        text = formatAsJson(items);
        break;
      case 'csv':
        text = formatAsCsv(items);
        break;
      case 'postgres':
        text = formatAsPostgres(items);
        break;
      case 'mysql':
        text = formatAsMysql(items);
        break;
      case 'mongodb':
        text = formatAsMongodb(items);
        break;
      default:
        text = formatAsJson(items);
    }
    
    setPreviewText(text);
  }, [items, format]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewText);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Copy failed",
        description: "Could not copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    downloadContent(items, format, language);
    toast({
      title: "Download started",
      description: `Your ${format.toUpperCase()} file is being downloaded.`,
    });
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

  return (
    <Card className="mt-6 animate-fade-in border shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          {getFormatIcon(format)}
          <span className="font-medium">
            {format === 'json' ? 'JSON' : 
             format === 'csv' ? 'CSV' : 
             format === 'excel' ? 'Excel' : 
             format === 'postgres' ? 'PostgreSQL' : 
             format === 'mysql' ? 'MySQL' : 'MongoDB'} Output
          </span>
          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
            {items.length} items
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1 h-8" 
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button 
            size="sm" 
            className="flex items-center gap-1 h-8" 
            onClick={handleDownload}
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </div>
      </div>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-10 mt-0 bg-transparent border-0 gap-4">
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2"
              >
                Code Preview
              </TabsTrigger>
              <TabsTrigger 
                value="table" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2"
              >
                Table View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="preview" className="mt-0">
            <pre className="bg-secondary/50 rounded-md p-4 overflow-x-auto text-sm font-mono h-[400px] overflow-y-auto">
              {previewText}
            </pre>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <div className="overflow-x-auto h-[400px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary/60 sticky top-0">
                    {items.length > 0 && Object.keys(items[0]).map((key) => (
                      <th key={key} className="p-3 text-left text-sm font-medium text-foreground">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-secondary/20'}`}
                    >
                      {Object.values(item).map((value, i) => (
                        <td key={i} className="p-3 text-sm">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
