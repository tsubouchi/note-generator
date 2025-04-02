'use client';

import { useState } from 'react';
import { BlogIdea, GeneratedArticle } from '@/types';
import BlogIdeaForm from '@/components/blog/BlogIdeaForm';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (blogIdea: BlogIdea) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogIdea),
      });
      
      if (!response.ok) {
        throw new Error('記事の生成に失敗しました');
      }
      
      const data = await response.json();
      setGeneratedArticle(data);
    } catch (err) {
      console.error('Error generating article:', err);
      setError(err instanceof Error ? err.message : '記事の生成中にエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToNote = async () => {
    if (!generatedArticle) return;
    
    try {
      const response = await fetch('/api/note/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedArticle),
      });
      
      if (!response.ok) {
        throw new Error('noteへの投稿に失敗しました');
      }
      
      const data = await response.json();
      alert('noteに下書きとして投稿されました！');
    } catch (err) {
      console.error('Error publishing to note:', err);
      setError(err instanceof Error ? err.message : 'noteへの投稿中にエラーが発生しました');
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Note Generator</h1>
        
        {!generatedArticle ? (
          <BlogIdeaForm onSubmit={handleSubmit} />
        ) : (
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{generatedArticle.title}</h2>
            
            <div className="prose max-w-none mb-6 text-foreground">
              <div dangerouslySetInnerHTML={{ __html: generatedArticle.content.replace(/\n/g, '<br/>') }} />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {generatedArticle.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setGeneratedArticle(null)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
              >
                戻る
              </button>
              
              <button
                onClick={handlePublishToNote}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                noteに下書き投稿
              </button>
            </div>
          </div>
        )}
        
        {isGenerating && (
          <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <p className="text-lg">AIが記事を生成中です...</p>
              <div className="mt-4 w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="animate-pulse h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
