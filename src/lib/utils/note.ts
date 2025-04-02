import { GeneratedArticle } from '@/types';
import axios from 'axios';

// Note APIのエンドポイント
const NOTE_API_BASE_URL = 'https://note.com/api';
const NOTE_API_VERSION = 'v1';
const NOTE_DRAFT_ENDPOINT = `${NOTE_API_BASE_URL}/${NOTE_API_VERSION}/text_notes/draft_save`;

// 認証情報
const NOTE_EMAIL = process.env.NOTE_EMAIL;
const NOTE_PASSWORD = process.env.NOTE_PASSWORD;

// セッション情報を保持するためのCookie
let noteCookie: string | null = null;

/**
 * Noteにログインし、セッションCookieを取得する
 */
async function loginToNote(): Promise<string> {
  try {
    if (!NOTE_EMAIL || !NOTE_PASSWORD) {
      throw new Error('Note認証情報が設定されていません');
    }

    // ログインリクエスト
    const response = await axios.post(`${NOTE_API_BASE_URL}/${NOTE_API_VERSION}/login`, {
      email: NOTE_EMAIL,
      password: NOTE_PASSWORD
    });

    // レスポンスからCookieを取得
    const cookies = response.headers['set-cookie'];
    if (!cookies || cookies.length === 0) {
      throw new Error('認証に失敗しました: Cookieが取得できませんでした');
    }

    // _note_session_v3 Cookieを探す
    const sessionCookie = cookies.find((cookie: string) => cookie.includes('_note_session_v3'));
    if (!sessionCookie) {
      throw new Error('認証に失敗しました: セッションCookieが見つかりませんでした');
    }

    // Cookieの値だけを抽出
    const cookieValue = sessionCookie.split(';')[0];
    return cookieValue;
  } catch (error) {
    console.error('Note認証エラー:', error);
    throw new Error('Noteへのログインに失敗しました');
  }
}

/**
 * 記事を下書き状態でNoteに投稿する
 */
export async function publishDraftToNote(article: GeneratedArticle): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    // セッションCookieがない場合はログイン
    if (!noteCookie) {
      noteCookie = await loginToNote();
    }

    // 新しい記事IDを取得するためのリクエスト
    const createResponse = await axios.post(
      `${NOTE_API_BASE_URL}/${NOTE_API_VERSION}/text_notes/create`,
      {},
      {
        headers: {
          'Cookie': noteCookie,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!createResponse.data || !createResponse.data.data || !createResponse.data.data.id) {
      throw new Error('記事IDの取得に失敗しました');
    }

    const noteId = createResponse.data.data.id;

    // 記事の内容を下書き状態で保存
    const draftResponse = await axios.post(
      `${NOTE_DRAFT_ENDPOINT}?id=${noteId}`,
      {
        body: article.content,
        name: article.title,
        tags: article.tags.join(','),
        status: 'draft',
        publish_at: new Date().toISOString(),
        price: 0,
        is_note_intro_enabled: true
      },
      {
        headers: {
          'Cookie': noteCookie,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!draftResponse.data || !draftResponse.data.data || !draftResponse.data.data.result) {
      throw new Error('下書き保存に失敗しました');
    }

    return {
      success: true,
      url: `https://note.com/edit/${noteId}`,
      message: '記事が下書きとして保存されました'
    };
  } catch (error) {
    console.error('Note投稿エラー:', error);
    
    // セッションが切れている可能性があるため、Cookieをリセット
    noteCookie = null;
    
    return {
      success: false,
      message: error instanceof Error ? error.message : '下書き投稿中にエラーが発生しました'
    };
  }
}
