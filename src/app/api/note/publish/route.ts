import { NextRequest, NextResponse } from 'next/server';
import { publishDraftToNote } from '@/lib/utils/note';
import { GeneratedArticle } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const article: GeneratedArticle = await request.json();
    
    // 入力データの検証
    if (!article.title || !article.content) {
      return NextResponse.json(
        { error: 'タイトルと本文は必須です' },
        { status: 400 }
      );
    }
    
    // noteに下書き投稿
    const result = await publishDraftToNote(article);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: result.message,
      url: result.url
    });
  } catch (error) {
    console.error('note投稿エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'noteへの投稿中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
