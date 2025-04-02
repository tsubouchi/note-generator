# Vercelデプロイ手順

このプロジェクトをVercelにデプロイするための手順です。

## 前提条件
- GitHubアカウント
- Vercelアカウント

## デプロイ手順

1. [Vercel](https://vercel.com)にログインします
2. 「Add New...」→「Project」を選択します
3. GitHubリポジトリ「note-generator」をインポートします
4. 以下の環境変数を設定します:
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Gemini APIキー
   - `NOTE_EMAIL`: noteのログインメールアドレス
   - `NOTE_PASSWORD`: noteのパスワード
5. 「Deploy」ボタンをクリックしてデプロイを開始します

## 注意事項
- 環境変数は機密情報なので、安全に管理してください
- Vercelのチーム設定を使用する場合は、チームIDを指定してください:
  - チームID: `team_zj0QHn5EsrQGC9qcDPtkNHIm`
  - チームURL: `vercel.com/bonginkan-projects`
