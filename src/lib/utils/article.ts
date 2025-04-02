import { formatArticleForNote } from '@/lib/utils/formatter';
import { GeneratedArticle } from '@/types';

/**
 * Gemini APIのレスポンスから記事を抽出し、フォーマットする
 */
export function processGeminiResponse(responseText: string): GeneratedArticle {
  // タイトルの抽出（# で始まる最初の行）
  const titleMatch = responseText.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '無題の記事';
  
  // タグの抽出（#タグ: の形式で書かれた行）
  const tagsMatch = responseText.match(/#タグ:\s*(.+)$/m);
  const tagsText = tagsMatch ? tagsMatch[1] : '';
  const tags = tagsText
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  
  // 記事本文の整形
  const formattedArticle = formatArticleForNote(title, responseText, tags.length > 0 ? tags : ['AI', 'エージェント']);
  
  return formattedArticle;
}

/**
 * プレビュー用に記事を整形する
 */
export function formatArticleForPreview(article: GeneratedArticle): GeneratedArticle {
  // 記事のタイトルと内容を整形
  const formattedArticle = formatArticleForNote(article.title, article.content, article.tags);
  
  return formattedArticle;
}
