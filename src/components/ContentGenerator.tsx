
import { useState, useEffect } from 'react';
import { ContentType, GeneratedItem, Language, OutputFormat } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, RotateCw, Settings, Globe } from 'lucide-react';
import { getContentTypes } from '../utils/mockDataGenerator';
import { DictionaryService } from '../services/DictionaryService';
import ContentTypeSelector from './ContentTypeSelector';
import LanguageSelector from './LanguageSelector';
import OutputFormatSelector from './OutputFormatSelector';
import ResultDisplay from './ResultDisplay';
import { useToast } from '@/hooks/use-toast';

export default function ContentGenerator() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>(getContentTypes());
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(contentTypes[0]);
  const [language, setLanguage] = useState<Language>('en');
  const [count, setCount] = useState<number>(10);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();

  useEffect(() => {
    // Select the first content type by default
    const initialContentTypes = getContentTypes();
    
    // Add a new "definition" field to vocabulary content type
    const updatedContentTypes = initialContentTypes.map(ct => {
      if (ct.id === 'vocabulary') {
        return {
          ...ct,
          fields: [
            ...ct.fields,
            { id: 'definition', name: 'Definition', type: 'text' as const, selected: true }
          ]
        };
      }
      return ct;
    });
    
    setContentTypes(updatedContentTypes);
    setSelectedContentType(updatedContentTypes[0]);
  }, []);

  // Update the selected content type when contentTypes changes
  useEffect(() => {
    const selected = contentTypes.find(ct => ct.selected);
    if (selected) {
      setSelectedContentType(selected);
    }
  }, [contentTypes]);

  const handleContentTypeSelect = (contentType: ContentType) => {
    setContentTypes(contentTypes.map(ct => ({
      ...ct,
      selected: ct.id === contentType.id
    })));
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedContentType({
      ...selectedContentType,
      fields: selectedContentType.fields.map(field => 
        field.id === fieldId ? { ...field, selected: !field.selected } : field
      )
    });
  };

  const handleCountChange = (value: number[]) => {
    setCount(value[0]);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleOutputFormatChange = (format: OutputFormat) => {
    setOutputFormat(format);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Usar siempre la API del diccionario
      const items = await DictionaryService.generateContentItems(selectedContentType, count, language);
      
      toast({
        title: language === 'en' ? "Content generated" : "Contenido generado",
        description: language === 'en' 
          ? `Generated ${items.length} items using dictionary API.` 
          : `Generados ${items.length} elementos usando la API de diccionario.`,
      });
      
      setGeneratedItems(items);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: language === 'en' ? "Generation failed" : "Falló la generación",
        description: language === 'en' 
          ? "An error occurred while generating content." 
          : "Se produjo un error al generar el contenido.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const contentTypeText = language === 'en' 
    ? {
        title: "Content Generator",
        description: "Generate language content for learning exercises",
        contentTypesTab: "Content Types",
        fieldsTab: "Fields",
        settingsTab: "Settings",
        fieldsTitle: "Configure Fields",
        fieldsDescription: "Select which fields to include in the generated content",
        generateButton: "Generate Content",
        regenerateButton: "Regenerate",
        countLabel: "Number of items to generate:",
        noFieldsSelected: "Please select at least one field to generate content.",
        dataSourceLabel: "Data Source:",
        realData: "Dictionary API"
      }
    : {
        title: "Generador de Contenido",
        description: "Genera contenido de lenguaje para ejercicios de aprendizaje",
        contentTypesTab: "Tipos de Contenido",
        fieldsTab: "Campos",
        settingsTab: "Configuración",
        fieldsTitle: "Configurar Campos",
        fieldsDescription: "Selecciona qué campos incluir en el contenido generado",
        generateButton: "Generar Contenido",
        regenerateButton: "Regenerar",
        countLabel: "Número de elementos a generar:",
        noFieldsSelected: "Por favor, selecciona al menos un campo para generar contenido.",
        dataSourceLabel: "Fuente de datos:",
        realData: "API de Diccionario"
      };

  return (
    <div className="w-full animate-fade-in">
      <Card className="border shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold">{contentTypeText.title}</CardTitle>
              <CardDescription>{contentTypeText.description}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <LanguageSelector language={language} onChange={handleLanguageChange} />
              <OutputFormatSelector format={outputFormat} onChange={handleOutputFormatChange} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="content" className="flex items-center gap-1.5">
                <Wand2 className="h-4 w-4" />
                <span>{contentTypeText.contentTypesTab}</span>
              </TabsTrigger>
              <TabsTrigger value="fields" className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                <span>{contentTypeText.fieldsTab}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                <span>{contentTypeText.settingsTab}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="animate-slide-down">
              <ContentTypeSelector 
                contentTypes={contentTypes} 
                onSelect={handleContentTypeSelect}
              />
            </TabsContent>
            
            <TabsContent value="fields" className="animate-slide-down">
              <Card className="border">
                <CardHeader>
                  <CardTitle>{contentTypeText.fieldsTitle}</CardTitle>
                  <CardDescription>{contentTypeText.fieldsDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedContentType.fields.map(field => (
                      <div 
                        key={field.id}
                        className="flex items-center space-x-3 py-2"
                      >
                        <Checkbox 
                          id={field.id} 
                          checked={field.selected}
                          onCheckedChange={() => handleFieldToggle(field.id)}
                        />
                        <Label 
                          htmlFor={field.id}
                          className="cursor-pointer flex flex-col"
                        >
                          <span className="font-medium">{field.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {field.type === 'text' ? 'Text' : 
                             field.type === 'number' ? 'Number' : 
                             field.type === 'date' ? 'Date' : 'Select'}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="animate-slide-down">
              <Card className="border">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="count">{contentTypeText.countLabel} {count}</Label>
                      <Slider
                        id="count"
                        min={1}
                        max={50}
                        step={1}
                        value={[count]}
                        onValueChange={handleCountChange}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      <Label>{contentTypeText.dataSourceLabel}</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5">
                            <Globe className="h-4 w-4 text-blue-500" />
                            {contentTypeText.realData}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {language === 'en' 
                          ? "Using Free Dictionary API for real-world language data."
                          : "Usando API de Diccionario Gratis para datos reales de lenguaje."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="flex items-center gap-2"
            disabled={isGenerating || selectedContentType.fields.filter(f => f.selected).length === 0}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                <span>{language === 'en' ? 'Generating...' : 'Generando...'}</span>
              </>
            ) : generatedItems.length > 0 ? (
              <>
                <RotateCw className="h-4 w-4" />
                <span>{contentTypeText.regenerateButton}</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>{contentTypeText.generateButton}</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {selectedContentType.fields.filter(f => f.selected).length === 0 && (
        <div className="mt-4 text-sm text-orange-500">
          {contentTypeText.noFieldsSelected}
        </div>
      )}

      {generatedItems.length > 0 && (
        <ResultDisplay 
          items={generatedItems} 
          format={outputFormat} 
          language={language === 'en' ? 'english' : 'spanish'}
        />
      )}
    </div>
  );
}
