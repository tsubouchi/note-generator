import { BlogIdea, GeneratedArticle } from '@/types';

export async function generateArticleWithGemini(blogIdea: BlogIdea): Promise<GeneratedArticle> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API キーが設定されていません');
  }

  const prompt = createPrompt(blogIdea);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API エラー: ${errorData.error?.message || '不明なエラー'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini APIからの応答が空です');
    }

    const content = data.candidates[0].content;
    
    if (!content || !content.parts || content.parts.length === 0) {
      throw new Error('Gemini APIからの応答が不正な形式です');
    }

    const articleText = content.parts[0].text;
    
    // 記事のパース処理
    const parsedArticle = parseArticleContent(articleText);
    
    return {
      title: parsedArticle.title || blogIdea.title,
      content: parsedArticle.content,
      tags: parsedArticle.tags
    };
  } catch (error) {
    console.error('Gemini API エラー:', error);
    throw error;
  }
}

function createPrompt(blogIdea: BlogIdea): string {
  const contextsText = blogIdea.contexts
    .map(context => context.content)
    .filter(content => content.trim() !== '')
    .join('\n\n');

  return `
あなたは、AIエージェント関連の高品質な記事を書くプロの執筆者です。以下の情報をもとに、多段で深みのある記事を作成してください。

# ブログ企画情報
タイトル: ${blogIdea.title}
説明: ${blogIdea.description}
ターゲットオーディエンス: ${blogIdea.targetAudience}
重要なポイント: ${blogIdea.keyPoints}

# 追加コンテキスト
${contextsText}

# 執筆指示
1. 記事は「# タイトル」から始め、その後に「## 見出し」を使って構造化してください。
2. 記事は深い洞察と具体的な例を含む、多段階の詳細な内容にしてください。
3. AIエージェントの技術的側面と実用的な応用の両方をカバーしてください。
4. 最新の研究や動向を反映させ、未来への展望も含めてください。
5. 読者が実際に行動できる具体的なアドバイスや次のステップを提供してください。
6. 記事の最後に、関連するタグを5つ程度、以下の形式で提案してください:
   「#タグ: AI, エージェント, 技術, ...」

# 記事の構成
- 導入部: 読者の関心を引く魅力的な導入
- 本文: 複数のセクションに分けて詳細に説明
- 結論: 主要なポイントをまとめ、読者に行動を促す

記事の長さは3000〜5000文字程度を目安にしてください。
`;
}

function parseArticleContent(text: string): { title: string; content: string; tags: string[] } {
  // タイトルの抽出（# で始まる最初の行）
  const titleMatch = text.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  // タグの抽出（#タグ: の形式で書かれた行）
  const tagsMatch = text.match(/#タグ:\s*(.+)$/m);
  const tagsText = tagsMatch ? tagsMatch[1] : '';
  const tags = tagsText
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');
  
  // タグ行を除いた本文を抽出
  let content = text;
  if (tagsMatch) {
    content = text.replace(tagsMatch[0], '');
  }
  
  return {
    title,
    content: content.trim(),
    tags: tags.length > 0 ? tags : ['AI', 'エージェント']
  };
}
