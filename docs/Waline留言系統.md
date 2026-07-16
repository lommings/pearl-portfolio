# Waline 留言系統

## 📍 管理後台

**登入網址**：`https://你的waline.vercel.app/ui`

例如：`https://waline-eight-coral.vercel.app/ui`

### 後台功能

| 功能 | 說明 |
|------|------|
| **留言管理** | 查看、審核、刪除留言 |
| **已通過** | 已審核通過的留言 |
| **待審核** | 需要審核的留言 |
| **用戶管理** | 管理註冊用戶 |

**注意**：第一個註冊的帳號自動成為管理員

---

## ⚙️ 環境變數設定

在 **Vercel → Settings → Environment Variables** 設定

### 基本設定

| 變數 | 說明 | 範例 |
|------|------|------|
| `SITE_URL` | 網站網址 | `https://pearl-portfolio.pages.dev` |
| `SITE_NAME` | 網站名稱 | `Pearl's Blog` |
| `AUTHOR_EMAIL` | 管理員信箱 | `you@email.com` |
| `SECURE_DOMAINS` | 允許的網域 | `pearl-portfolio.pages.dev` |

### 留言控制

| 變數 | 說明 | 預設 |
|------|------|------|
| `COMMENT_AUDIT` | 是否需審核 | `false` |
| `COMMENT_MIN_TIME` | 留言最短間隔（秒） | `10` |

### 郵件通知（可選）

| 變數 | 說明 |
|------|------|
| `SMTP_SERVICE` | `gmail` 或 `outlook` |
| `SMTP_USER` | 郵件帳號 |
| `SMTP_PASS` | 應用程式密碼 |

---

## 🗄️ 資料庫設定

使用 PostgreSQL (Neon) + Vercel 部署

### 環境變數（自動產生）

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_HOST
POSTGRES_DATABASE
```

### 如需手動建立資料表

腳本位置：`docs/scripts/create-waline-tables.js`

使用方式：
```bash
cd docs/scripts
npm install
# 設定 .env 中的 DATABASE_URL
node create-waline-tables.js
```

---

## 🔧 常見問題

### 留言無法顯示
1. 確認 `SECURE_DOMAINS` 設定正確
2. 確認資料表已建立
3. 檢查瀏覽器 Console 錯誤

### 郵件通知失敗
1. Gmail 需使用「應用程式密碼」
2. 確認 SMTP 設定正確
3. 檢查 Vercel 函數日誌

### 管理員無法登入
- 第一個註冊的帳號才是管理員
- 確認使用正確的密碼

---

## 📂 相關檔案

- **前端組件**：`src/components/Comments.astro`
- **資料庫腳本**：`docs/scripts/create-waline-tables.js`

---

**最後更新：2026-07-16**
