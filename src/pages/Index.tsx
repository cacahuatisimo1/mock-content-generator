
import ContentGenerator from '@/components/ContentGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="app-container pt-10 pb-20">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Language Content Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate mock content in English and Spanish for language learning exercises. 
            Perfect for creating sentence completion and verb tense exercises.
          </p>
        </header>
        
        <main>
          <ContentGenerator />
        </main>
        
        <footer className="text-center text-sm text-muted-foreground mt-20 pt-6 border-t">
          <p>© {new Date().getFullYear()} Language Content Generator</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
