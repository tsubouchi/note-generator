import { NextRequest, NextResponse } from 'next/server';
import { generateArticleWithGemini } from '@/lib/utils/gemini';
import { BlogIdea } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const blogIdea: BlogIdea = await request.json();
    
    // 入力データの検証
    if (!blogIdea.title || !blogIdea.description) {
      return NextResponse.json(
        { error: 'タイトルと説明は必須です' },
        { status: 400 }
      );
    }
    
    // Gemini APIを使用して記事を生成
    const generatedArticle = await generateArticleWithGemini(blogIdea);
    
    return NextResponse.json(generatedArticle);
  } catch (error) {
    console.error('記事生成エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '記事の生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
