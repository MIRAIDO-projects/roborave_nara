# RoboRAVE Nara サイト エージェント統一ガイド

**プロジェクト:** RoboRAVE Nara 公式Webサイト（奈良県支部）
**ミッション:** 好奇心に火をつけろ。未来を創れ。
**ホスト:** Cloudflare Pages
**最終更新:** 2026-03-20
**Version:** 1.0

---

## プロジェクト概要

### RoboRAVE Nara とは

RoboRAVE International の奈良県支部サイト。若いイノベーターたちが自律型ロボットを設計・製作・プログラミングする国際ロボット競技会の情報発信を行う。

### 技術スタック（package.json 実測値）

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Astro（SSG + React Islands） | 5.17.1 |
| UIライブラリ | React + ReactDOM | 19.2.3 |
| スタイリング | Tailwind CSS（@tailwindcss/vite） | 4.1.18 |
| CMS | microCMS JS SDK | 3.2.0 |
| 3D/WebGL | Three.js + React Three Fiber + Drei | 0.182.0 / 9.5.0 / 10.7.7 |
| アニメーション | GSAP + Lenis | 3.14.2 / 1.3.17 |
| フォーム | React Hook Form + Zod | 7.71.1 / 3.25.76 |
| SEO | astro-seo | 1.1.0 |
| 数学ユーティリティ | maath | 0.10.8 |
| ホスティング | Cloudflare Pages | - |

### アーキテクチャ

Astro をルーティング + レイアウト + SEO の主軸として使い、インタラクティブな部分（3Dシーン、フォーム）のみ React Islands で実装する構成。

```
src/pages/*.astro              -> ルーティング + ページ本体（Astro）
src/layouts/Layout.astro       -> 共通レイアウト（Lenis + GSAP + グローバルスタイル）
src/components/*.astro         -> Astro コンポーネント（Header, Footer, CookieBanner, SEO/Head）
src/components/*.tsx           -> React Islands（ThreeScene, ContactForm）
src/components/Three/*.astro   -> Three.js キャンバスラッパー
src/components/SEO/*.astro     -> メタタグ + JSON-LD
src/data/competitions.ts       -> 競技データ定義
src/lib/microcms.ts            -> CMS クライアント（型 + API + MOCK フォールバック）
src/utils/jsonLdGenerator.ts   -> JSON-LD スキーマ生成
```

**重要:** `src/app/` ディレクトリは存在しない。ページ本体は Astro ファイル内で直接実装されており、React は ThreeScene と ContactForm の 2 コンポーネントのみ。

### コンテンツ構成

- トップページ（Hero + 競技紹介 + ニュース + About + ワークショップ + お問い合わせ）
- 競技詳細ページ 3種（a-MAZE-ing / SumoBot / Line Following）
- ブログ（microCMS 連携）
- ニュース（microCMS 連携）
- お問い合わせフォーム + 送信完了ページ

### 3つの競技（src/data/competitions.ts）

1. **a-MAZE-ing Challenge** -- センサーを使った迷路ナビゲーション
2. **SumoBot Challenge** -- 相手をリングから押し出す相撲バトル
3. **Line Following Challenge** -- ラインを辿りながら物体を運搬

### 関連団体（フッターリンク）

- RoboRAVE International (roborave.org)
- RoboRAVE Osaka, Mie, Kaga, Tokyo, Kobe

---

## エージェント体制

### 基本フロー

```
実装依頼 -> implementer（実装）-> reviewer（レビュー）-> 完了 or 差し戻し
```

- 🔴 重大な指摘がある場合は implementer に差し戻す
- 🟡 軽微 / 💡 提案のみの場合は完了とみなす
- 軽微な修正は直接 implementer -> reviewer で完結可

### implementer（実装担当）

**責務:**
- コードの新規作成・編集・修正
- 変更規模が小さくても必ず使用すること
- 実装前後の Git コミットを必ず行うこと

**対象領域:**
- Astro ページ・レイアウト・コンポーネント（`src/pages/`, `src/layouts/`, `src/components/`）
- React コンポーネント（`src/components/ThreeScene.tsx`, `src/components/ContactForm.tsx`）
- microCMS クライアント（`src/lib/microcms.ts`）
- 競技データ定義（`src/data/competitions.ts`）
- JSON-LD ユーティリティ（`src/utils/jsonLdGenerator.ts`）
- スタイル（`src/styles/global.css`）
- 静的アセット（`public/`）
- 設定ファイル（`astro.config.mjs`, `tsconfig.json`, `package.json`）

### reviewer（レビュー担当）

**役割:** 品質保証・統合テスト・デプロイ検証

**チェックリスト:**
```
- npm run build 成功（エラー・警告なし）
- npm run preview で全ページ表示確認
- Lighthouse 90+（Performance, SEO, Accessibility, Best Practices）
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- microCMS API 応答確認（MOCK フォールバック動作も）
- ThreeScene: デスクトップ + モバイル Safari での動作
- メタタグ: og:title, og:description, og:image 全ページ
- JSON-LD 構文チェック（Organization, WebSite, Article, BreadcrumbList）
- sitemap.xml: /thanks 除外、microCMS コンテンツ含む
- robots.txt: AI クローラー許可設定
- Cookie バナー（GTM Consent Mode v2）
- フォーム -> /thanks 遷移
- Git コミット整合性
```

---

## ファイル構成（実測）

```
roborave_nara/
├── astro.config.mjs           <- Astro + React + Tailwind 設定
├── package.json
├── tsconfig.json
├── CLAUDE.md
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── hero_bg.png
│       ├── logo.png, logo_new.jpg
│       ├── amazing_challenge.png
│       ├── sumobot_challenge.png
│       ├── line_following_challenge.png
│       ├── roborave_international_logo.jpg
│       └── roborave_{osaka,mie,kaga,tokyo,kobe}_logo.jpg
└── src/
    ├── env.d.ts
    ├── lib/
    │   └── microcms.ts            <- CMS クライアント（Blog, News 型 + MOCK）
    ├── data/
    │   └── competitions.ts        <- 3 競技定義データ
    ├── utils/
    │   └── jsonLdGenerator.ts     <- JSON-LD スキーマ生成
    ├── layouts/
    │   └── Layout.astro           <- 共通レイアウト（Lenis + GSAP）
    ├── components/
    │   ├── Header.astro           <- 固定ナビ + ハンバーガーメニュー
    │   ├── Footer.astro           <- ダークブルーフッター + 関連団体リンク
    │   ├── CookieBanner.astro     <- Cookie 同意（GTM Consent Mode v2）
    │   ├── Welcome.astro          <- 未使用（デフォルト）
    │   ├── ThreeScene.tsx         <- R3F パーティクル背景（React Island）
    │   ├── ContactForm.tsx        <- React Hook Form + Zod バリデーション
    │   ├── SEO/
    │   │   └── Head.astro         <- メタタグ + JSON-LD 注入
    │   └── Three/
    │       └── AccessibleCanvas.astro  <- キャンバスラッパー + セマンティックフォールバック
    ├── pages/
    │   ├── index.astro            <- トップページ（Hero + 全セクション）
    │   ├── contact.astro          <- お問い合わせフォーム
    │   ├── thanks.astro           <- 送信完了
    │   ├── sitemap.xml.ts         <- 動的サイトマップ生成
    │   ├── robots.txt.ts          <- クローラー指示
    │   ├── competitions/
    │   │   └── [id].astro         <- 競技詳細（3ページ: amazing, sumobot, line-following）
    │   ├── blog/
    │   │   ├── index.astro        <- ブログ一覧（microCMS）
    │   │   └── [...slug].astro    <- ブログ詳細（microCMS）
    │   └── news/
    │       ├── index.astro        <- ニュース一覧（microCMS）
    │       └── [...slug].astro    <- ニュース詳細（microCMS）
    └── styles/
        └── global.css             <- Tailwind インポート
```

---

## microCMS 連携

- クライアント一元管理: `src/lib/microcms.ts`
- 2 エンドポイント: `blogs`（ブログ）, `news`（ニュース）
- 型定義: id, title, content, eyecatch, category, tags, publishedAt 等
- API キー未設定時の MOCK フォールバック内蔵

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `MICROCMS_SERVICE_DOMAIN` | microCMS サービスドメイン |
| `MICROCMS_API_KEY` | microCMS API キー |
| `SITE` | サイト URL（sitemap 生成用） |

**注意:** `.env` ファイルは絶対にコミットしない。`.gitignore` で除外されていることを必ず確認する。

## SEO / GEO 実装

- **astro-seo** によるメタタグ管理（OG, Twitter Card）
- **JSON-LD** 構造化データ: Organization, WebSite, Article, BreadcrumbList, SpeakableSpecification
- **Geo ターゲティング:** 奈良県（JP-29 / 座標 34.6851, 135.8048）
- **sitemap.xml:** microCMS コンテンツを含む動的生成、/thanks 除外
- **robots.txt:** AI クローラー明示的許可
- セマンティック HTML（article, section, nav 等）の徹底

## パフォーマンス目標

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Lighthouse 全カテゴリ 90+

---

## デプロイメント

```bash
npm run dev       # localhost:4321
npm run build     # dist/ 出力
npm run preview   # ビルド結果確認
```

Cloudflare Pages: GitHub main ブランチ push で自動デプロイ

---

## 大原則

- 作業前後は必ず Git コミットすること
- コミットなしの大規模変更は禁止
- `.env` やシークレットをコミットしない
- 入力値は必ずバリデーション・サニタイズする（ContactForm.tsx は Zod で実装済み）
- エラーメッセージに内部情報を含めない
