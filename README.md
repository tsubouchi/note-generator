# note-generator

ブログ企画からGemini 2.0 Proを使った記事生成、noteへの自動投稿ができるアプリケーション

## 機能

- ブログ企画入力インターフェース（コンテキスト追加機能付き）
- Gemini 2.0 Proを使った高品質な記事生成
- 記事のプレビューと編集
- noteへの下書き自動投稿

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- Gemini API
- Note API (非公式)

## 環境変数

以下の環境変数を設定する必要があります：

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NOTE_EMAIL=your_note_email
NOTE_PASSWORD=your_note_password
```

## 開発方法

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/note-generator.git
cd note-generator

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## デプロイ

このプロジェクトはVercelにデプロイすることを想定しています。

1. Vercelアカウントを作成
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ

## ライセンス

MIT
