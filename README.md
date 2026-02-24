# Pearl 的創作空間 🎨

個人創作網站，用於發表故事、遊戲與畫作。

## ✨ 特色功能

- 📝 **Markdown 寫作** - 輕鬆撰寫故事和文章
- 🎬 **影片整合** - 支援 YouTube 和 Bilibili（自動切換）
- 🎮 **遊戲嵌入** - 展示 HTML5 遊戲
- 💬 **留言系統** - Waline 讀者互動
- 🌏 **中國友好** - 針對中文用戶優化
- ⚡ **超快速度** - Astro 靜態生成
- 🎨 **響應式設計** - 完美支援手機和電腦

## 🚀 快速開始

```bash
# 啟動開發伺服器
npm run dev

# 開啟瀏覽器訪問
http://localhost:4321
```

**詳細說明：** 看 [快速啟動.md](./快速啟動.md)

## 📝 撰寫文章

1. 在 `src/content/blog/` 建立新的 `.md` 檔案
2. 加上 frontmatter：

```markdown
---
title: '文章標題'
description: '簡短描述'
pubDate: 'Feb 24 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

你的內容...
```

3. 儲存後網站自動更新！

**完整教學：** 看 [使用說明.md](./使用說明.md)

## 📚 文檔

所有文檔在 `docs/` 資料夾：

- **[docs/INDEX.md](./docs/INDEX.md)** - 文檔導航（從這裡開始）
- **[docs/實作步驟.md](./docs/實作步驟.md)** - 完整建站教學
- **[docs/程式碼範例.md](./docs/程式碼範例.md)** - 實用組件範例
- **[docs/疑難排解.md](./docs/疑難排解.md)** - 問題解決
- **[docs/快速參考.md](./docs/快速參考.md)** - 指令速查表
- **[docs/建站檢查清單.md](./docs/建站檢查清單.md)** - 進度追蹤

## 🧞 常用指令

| 指令                | 說明                               |
| :------------------ | :--------------------------------- |
| `npm install`       | 安裝依賴                            |
| `npm run dev`       | 啟動開發伺服器 (localhost:4321)      |
| `npm run build`     | 建置生產版本到 `./dist/`            |
| `npm run preview`   | 預覽建置結果                         |
| `npm run astro ...` | 執行 Astro CLI 指令                 |

## 📁 專案結構

```
pearl-portfolio/
├── docs/              # 📚 文檔（教學、範例、疑難排解）
├── src/
│   ├── components/    # 🧩 可重用組件
│   │   ├── Comments.astro       # 留言系統
│   │   ├── VideoPlayer.astro    # 影片播放器
│   │   └── GameEmbed.astro      # 遊戲嵌入
│   ├── content/
│   │   └── blog/     # ✍️ 你的文章（在這裡寫！）
│   ├── layouts/      # 📐 頁面版型
│   └── pages/        # 📄 路由頁面
├── public/           # 🖼️ 靜態資源（圖片、遊戲）
├── 快速啟動.md       # 🚀 新手指南
├── 使用說明.md       # 📖 日常使用
└── package.json      # 📦 專案設定
```

## 🎯 核心組件使用

### 嵌入影片

```markdown
import VideoPlayer from '../../components/VideoPlayer.astro';

<VideoPlayer 
  youtube="影片ID"
  bilibili="BV號"
  title="影片標題"
/>
```

### 嵌入遊戲

```markdown
import GameEmbed from '../../components/GameEmbed.astro';

<GameEmbed 
  src="/games/my-game/index.html"
  title="我的遊戲"
/>
```

## 🌐 部署

### Cloudflare Pages（推薦）

1. 推送到 GitHub
2. 在 Cloudflare Pages 連接 repository
3. 建置設定：
   - Framework: **Astro**
   - Build command: `npm run build`
   - Output: `dist`

**詳細步驟：** 看 [docs/實作步驟.md](./docs/實作步驟.md)

## 💬 留言系統

使用 Waline，部署到 Vercel（免費）。

**設定教學：** 看 [docs/實作步驟.md](./docs/實作步驟.md) 的「階段4」

## 🆘 需要幫助？

1. **查看文檔** - `docs/` 資料夾有完整教學
2. **疑難排解** - [docs/疑難排解.md](./docs/疑難排解.md)
3. **範例參考** - [docs/程式碼範例.md](./docs/程式碼範例.md)

## 📞 相關資源

- [Astro 官方文檔](https://docs.astro.build)
- [Waline 文檔](https://waline.js.org)
- [Cloudflare Pages](https://pages.cloudflare.com)

---

**建立日期：** 2026-02-24  
**基於：** Astro Blog Template  
**授權：** MIT

**Happy Creating!** ✨
