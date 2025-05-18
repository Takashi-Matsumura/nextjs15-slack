# Next.js & PostgreSQL 学習用テンプレート

このリポジトリは、Next.js と PostgreSQL (Prisma ORM) の組み合わせを学ぶための開発環境テンプレートです。

## 前提条件

- Node.js >= 18.x、npm
- Docker & Docker Compose

## セットアップ手順

1. リポジトリをクローンする
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. 依存パッケージをインストールする
   ```bash
   npm install
   ```
3. 環境変数ファイルを作成する
   プロジェクトルートに `.env` ファイルを作成し、以下の内容を設定します:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs_db"
   ```
4. Docker Compose で PostgreSQL コンテナを起動する
   ```bash
   docker-compose up -d
   ```
5. Prisma Client を生成する
   ```bash
   npx prisma generate
   ```
6. 開発サーバーを起動する
   ```bash
   npm run dev
   ```

ブラウザで http://localhost:3000 にアクセスして、アプリが起動していることを確認してください。

## その他

- マイグレーションを実行する場合:
  ```bash
  npx prisma migrate dev --name init
  ```
- アプリ内での Prisma Client の利用例:
  ```ts
  import { PrismaClient } from "@prisma/client";
  const prisma = new PrismaClient();
  ```
