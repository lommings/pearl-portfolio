# Pearl 個人網站文檔

## 📚 文檔導航

### 🚀 快速開始
- **[README.md](./README.md)** - 專案總覽與技術架構
- **[快速參考.md](./快速參考.md)** - 指令與設定速查表

### 📖 建站指南
- **[實作步驟.md](./實作步驟.md)** - 從零到上線的完整步驟
- **[建站檢查清單.md](./建站檢查清單.md)** - 進度追蹤清單
- **[部署到Cloudflare.md](./部署到Cloudflare.md)** - Cloudflare Pages 部署指南

### 🎨 功能與開發
- **[程式碼範例.md](./程式碼範例.md)** - 組件與功能範例
- **[分類功能說明.md](./分類功能說明.md)** - 文章分類系統說明
- **[網站統計說明.md](./網站統計說明.md)** - 訪客統計功能
- **[日常更新流程.md](./日常更新流程.md)** - 日常維護與更新

### 💬 留言系統
- **[waline-deployment-guide.md](./waline-deployment-guide.md)** - Waline 留言系統部署指南 (PostgreSQL + Vercel)
- **[scripts/](./scripts/)** - Waline 資料庫初始化腳本

### 🔧 疑難排解
- **[疑難排解.md](./疑難排解.md)** - 常見問題解決方案

---

## 🎯 根據需求查找

### 我想要...

**開始建站**
→ 看 [實作步驟.md](./實作步驟.md)

**部署到 Cloudflare**
→ 看 [部署到Cloudflare.md](./部署到Cloudflare.md)

**設定留言系統**
→ 看 [waline-deployment-guide.md](./waline-deployment-guide.md)

**撰寫文章**
→ 看 [日常更新流程.md](./日常更新流程.md)

**嵌入影片/遊戲**
→ 看 [程式碼範例.md](./程式碼範例.md)

**遇到錯誤**
→ 看 [疑難排解.md](./疑難排解.md)

**忘記指令**
→ 看 [快速參考.md](./快速參考.md)

**客製化分類或統計**
→ 看 [分類功能說明.md](./分類功能說明.md) 或 [網站統計說明.md](./網站統計說明.md)

---

## 📁 專案結構

```
pearl-portfolio/
├── docs/                          ← 你現在在這裡（文檔）
│   ├── INDEX.md                  ← 本文件（導航）
│   ├── README.md                 ← 專案總覽
│   │
│   ├── 🚀 快速開始
│   │   └── 快速參考.md
│   │
│   ├── 📖 建站指南
│   │   ├── 實作步驟.md
│   │   ├── 建站檢查清單.md
│   │   └── 部署到Cloudflare.md
│   │
│   ├── 🎨 功能與開發
│   │   ├── 程式碼範例.md
│   │   ├── 分類功能說明.md
│   │   ├── 網站統計說明.md
│   │   └── 日常更新流程.md
│   │
│   ├── 💬 留言系統
│   │   ├── waline-deployment-guide.md
│   │   └── scripts/
│   │       ├── create-waline-tables.js
│   │       ├── .env.example
│   │       └── README.md
│   │
│   └── 🔧 疑難排解
│       └── 疑難排解.md
│
├── src/                          ← 網站原始碼
│   ├── components/              ← 組件
│   ├── content/blog/            ← 文章（在這裡寫！）
│   ├── layouts/                 ← 版型
│   └── pages/                   ← 頁面
│
├── public/                      ← 靜態資源（圖片、遊戲）
└── package.json                 ← 專案設定
```

---

## 🚀 常用指令

```bash
# 開發
npm run dev              # 啟動開發伺服器（http://localhost:4321）
npm run build            # 建置網站
npm run preview          # 預覽建置結果

# 部署
git add .
git commit -m "更新內容"
git push                 # 推送到 GitHub（自動觸發 Cloudflare 部署）
```

---

## 🆘 需要幫助？

1. **先看對應的文檔** - 用上面的「我想要...」找到相關章節
2. **查疑難排解** - 看 [疑難排解.md](./疑難排解.md)
3. **檢查錯誤訊息** - 瀏覽器 F12 或終端機的錯誤

---

## 📝 最近更新

- **2026-03-01** - 新增 Waline 留言系統部署指南（PostgreSQL 版本）
- **2026-02-24** - 建立完整文檔系統

---

**祝你建站順利！** 🎉
