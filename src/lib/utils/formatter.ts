import { GeneratedArticle } from '@/types';

/**
 * 記事のフォーマットを整える関数
 * Gemini APIから生成された記事をnoteに投稿できる形式に変換します
 */
export function formatArticleForNote(title: string, content: string, tags: string[]): GeneratedArticle {
  // Markdownの見出しを適切に処理
  let formattedContent = content;
  
  // タイトルが本文の先頭に含まれている場合は削除
  const titlePattern = new RegExp(`^#\\s+${title}\\s*\n`, 'i');
  formattedContent = formattedContent.replace(titlePattern, '');
  
  // 見出しレベルを調整（H1をH2に、H2をH3に変換）
  formattedContent = formattedContent
    .replace(/^# (.+)$/gm, '## $1')
    .replace(/^## (.+)$/gm, '### $1')
    .replace(/^### (.+)$/gm, '#### $1');
  
  // 画像URLがあれば適切に処理
  formattedContent = formattedContent.replace(/!\[(.*?)\]\((.*?)\)/g, '![$1]($2)');
  
  // リンクを適切に処理
  formattedContent = formattedContent.replace(/\[(.*?)\]\((.*?)\)/g, '[$1]($2)');
  
  // 箇条書きを適切に処理
  formattedContent = formattedContent.replace(/^(\s*)-\s+(.+)$/gm, '$1- $2');
  
  // 番号付きリストを適切に処理
  formattedContent = formattedContent.replace(/^(\s*)\d+\.\s+(.+)$/gm, '$1$2');
  
  // コードブロックを適切に処理
  formattedContent = formattedContent.replace(/```(\w*)\n([\s\S]*?)```/g, '```$1\n$2```');
  
  // 強調を適切に処理
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '**$1**');
  formattedContent = formattedContent.replace(/\*(.*?)\*/g, '*$1*');
  
  // 引用を適切に処理
  formattedContent = formattedContent.replace(/^>\s+(.+)$/gm, '> $1');
  
  // 水平線を適切に処理
  formattedContent = formattedContent.replace(/^---$/gm, '---');
  
  // 段落間の空行を確保
  formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');
  
  // タグの処理（#タグ: の形式で書かれている場合）
  const tagsPattern = /#タグ:\s*(.+)$/m;
  const tagsMatch = formattedContent.match(tagsPattern);
  
  let processedTags = [...tags];
  if (tagsMatch) {
    // タグ行を本文から削除
    formattedContent = formattedContent.replace(tagsPattern, '');
    
    // タグを抽出して配列に追加
    const extractedTags = tagsMatch[1]
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    // 重複を排除してタグを結合
    processedTags = [...new Set([...processedTags, ...extractedTags])];
  }
  
  // 末尾の空白行を削除
  formattedContent = formattedContent.trim();
  
  // 記事の先頭に見出しとしてタイトルを追加
  const formattedArticle = `# ${title}\n\n${formattedContent}`;
  
  return {
    title,
    content: formattedArticle,
    tags: processedTags
  };
}

/**
 * プレビュー用にHTMLに変換する関数
 */
export function convertMarkdownToHtml(markdown: string): string {
  // 簡易的なMarkdown→HTML変換（実際のアプリではreact-markdownなどを使用）
  let html = markdown;
  
  // 見出しの変換
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  
  // 段落の変換
  html = html.replace(/^(?!<h[1-6]|<ul|<ol|<li|<blockquote|<pre)(.+)$/gm, '<p>$1</p>');
  
  // 強調の変換
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // リンクの変換
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // 画像の変換
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');
  
  // リストの変換
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  
  // 引用の変換
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // コードブロックの変換
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  
  // インラインコードの変換
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 水平線の変換
  html = html.replace(/^---$/gm, '<hr />');
  
  // 改行の処理
  html = html.replace(/\n\n/g, '</p><p>');
  
  return html;
}
