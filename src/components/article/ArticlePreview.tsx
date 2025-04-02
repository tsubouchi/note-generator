'use client';

import { useState } from 'react';
import { GeneratedArticle } from '@/types';
import { convertMarkdownToHtml } from '@/lib/utils/formatter';

interface ArticlePreviewProps {
  article: GeneratedArticle;
  onBack: () => void;
  onPublish: () => void;
}

export default function ArticlePreview({ article, onBack, onPublish }: ArticlePreviewProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Markdownをプレビュー用HTMLに変換
  const htmlContent = convertMarkdownToHtml(article.content);
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
      
      <div className="prose max-w-none mb-6">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          disabled={isPublishing}
        >
          戻る
        </button>
        
        <button
          onClick={() => {
            setIsPublishing(true);
            onPublish();
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          disabled={isPublishing}
        >
          {isPublishing ? '投稿中...' : 'noteに下書き投稿'}
        </button>
      </div>
    </div>
  );
}
