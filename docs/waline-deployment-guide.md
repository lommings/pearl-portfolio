# Waline 留言系統部署指南 (PostgreSQL + Vercel)

> 本文件記錄了在 Vercel 上使用 PostgreSQL (Neon) 部署 Waline 留言系統的完整過程。

## 📋 目錄

1. [環境準備](#環境準備)
2. [資料庫設定](#資料庫設定)
3. [常見問題與解決方法](#常見問題與解決方法)
4. [環境變數配置](#環境變數配置)
5. [驗證部署](#驗證部署)

---

## 環境準備

### 需要的服務

- **Vercel** - 部署 Waline 後端
- **PostgreSQL** - 資料庫（推薦使用 Neon）
- **Node.js** - 本地執行腳本（v20+）

### Vercel 上已有的環境變數

部署 Waline 到 Vercel 後，PostgreSQL (Neon) 會自動產生以下變數：

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_HOST
POSTGRES_DATABASE
```

---

## 資料庫設定

### 問題：資料表未自動建立

Waline 在 Vercel 部署時**不會自動建立 PostgreSQL 資料表**，需要手動執行。

### 解決方法：手動建立資料表

#### Step 1: 建立本地專案

```bash
mkdir waline-migration
cd waline-migration
npm init -y
npm install pg dotenv
```

#### Step 2: 建立 `.env` 檔案

複製 Vercel 中的 `POSTGRES_PRISMA_URL`（或 `POSTGRES_URL`）到 `.env`：

```env
DATABASE_URL=postgresql://username:password@host/database?connect_timeout=15&sslmode=require
```

#### Step 3: 建立資料表腳本

建立 `create-tables.js`：

```javascript
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  try {
    await client.connect();
    console.log('✅ 已連接到 PostgreSQL 資料庫');

    // wl_users 表
    await client.query(`
      CREATE TABLE IF NOT EXISTS wl_users (
        id SERIAL PRIMARY KEY,
        display_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        type VARCHAR(50) DEFAULT 'guest',
        label VARCHAR(255),
        url VARCHAR(255),
        avatar VARCHAR(255),
        github VARCHAR(255),
        twitter VARCHAR(255),
        facebook VARCHAR(255),
        google VARCHAR(255),
        weibo VARCHAR(255),
        qq VARCHAR(255),
        "2fa" VARCHAR(32),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // wl_comment 表
    await client.query(`
      CREATE TABLE IF NOT EXISTS wl_comment (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        comment TEXT,
        insertedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(100),
        link VARCHAR(255),
        mail VARCHAR(255),
        nick VARCHAR(255),
        pid INTEGER,
        rid INTEGER,
        status VARCHAR(50) DEFAULT 'approved',
        ua TEXT,
        url VARCHAR(255),
        sticky BOOLEAN DEFAULT FALSE,
        "like" INTEGER DEFAULT 0,
        avatar VARCHAR(255),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // wl_counter 表
    await client.query(`
      CREATE TABLE IF NOT EXISTS wl_counter (
        id SERIAL PRIMARY KEY,
        time INTEGER DEFAULT 0,
        reaction0 INTEGER DEFAULT 0,
        reaction1 INTEGER DEFAULT 0,
        reaction2 INTEGER DEFAULT 0,
        reaction3 INTEGER DEFAULT 0,
        reaction4 INTEGER DEFAULT 0,
        reaction5 INTEGER DEFAULT 0,
        reaction6 INTEGER DEFAULT 0,
        reaction7 INTEGER DEFAULT 0,
        reaction8 INTEGER DEFAULT 0,
        url VARCHAR(255) UNIQUE,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ 資料表建立成功！');
    console.log('   - wl_users');
    console.log('   - wl_comment');
    console.log('   - wl_counter');
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
  } finally {
    await client.end();
  }
}

createTables();
```

#### Step 4: 執行腳本

```bash
node create-tables.js
```

成功後應該看到：

```
✅ 已連接到 PostgreSQL 資料庫
✅ 資料表建立成功！
   - wl_users
   - wl_comment
   - wl_counter
```

---

## 常見問題與解決方法

### ❌ 錯誤 1: `relation "wl_users" does not exist`

**原因：** 資料庫中沒有建立資料表。

**解決：** 執行上方的 `create-tables.js` 腳本。

---

### ❌ 錯誤 2: `column "insertedAt" does not exist`

**原因：** PostgreSQL 欄位名稱大小寫問題。Waline 使用**全小寫**欄位名稱（`insertedat`），但如果用引號包住駝峰式（`"insertedAt"`）會出錯。

**解決：** 確保所有欄位名稱都是**全小寫**（除了 `2fa` 和 `like` 因為是保留字需要加引號）。

---

### ❌ 錯誤 3: `column "id" does not exist`

**原因：** 主鍵名稱錯誤。Waline 需要 `id` 作為主鍵，不能用 `objectid` 或其他名稱。

**解決：** 確保主鍵名稱為 `id SERIAL PRIMARY KEY`。

---

### ⚠️ 警告: "Leancloud 即將停止對外服務"

**原因：** Waline 給所有用戶的全域提示（LeanCloud 國際版已停止服務）。

**解決：** 
- 這個警告不影響使用（你用的是 PostgreSQL）
- 可以到 Vercel Environment Variables 檢查是否有 `LEAN_ID` 或 `LEAN_KEY`，有的話刪除即可

---

### ⚠️ 提示: "Comment too fast!"

**原因：** Waline 防灌水機制，預設 **10 秒內不能連續留言**。

**解決（可選）：**

在 Vercel Environment Variables 新增：

```
COMMENT_MIN_TIME=5
```

（調整為 5 秒，或其他數值）

---

## 環境變數配置

### 必須設定的變數

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `POSTGRES_URL` | PostgreSQL 連線網址 | 自動產生（Neon） |
| `SECURE_DOMAINS` | 允許的網域（CORS） | `example.com,www.example.com` |

### 推薦設定的變數

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `SITE_NAME` | 網站名稱 | `Pearl's Blog` |
| `SITE_URL` | 網站網址 | `https://pearl-portfolio.pages.dev` |
| `AUTHOR_EMAIL` | 管理員信箱 | `your@email.com` |

### 可選變數

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `COMMENT_MIN_TIME` | 留言最短間隔（秒） | `5` |
| `COMMENT_AUDIT` | 是否需要審核留言 | `false` |
| `SMTP_HOST` | 郵件伺服器（通知功能） | `smtp.gmail.com` |

---

## 驗證部署

### 測試步驟

1. **訪問管理後台**
   ```
   https://your-waline-project.vercel.app/ui/register
   ```

2. **註冊第一個帳號**
   - 第一個註冊的帳號會自動成為管理員

3. **訪問你的網站並測試留言**
   - 確認可以發送留言
   - 確認留言會顯示在頁面上

4. **檢查資料庫**
   - 登入 Neon 控制台
   - 確認 `wl_comment` 表中有資料

---

## 前端配置範例

在你的網站中初始化 Waline：

```javascript
import Waline from '@waline/client';
import '@waline/client/style';

Waline.init({
  el: '#waline',
  serverURL: 'https://your-waline-project.vercel.app',
  lang: 'zh-TW',
  locale: {
    placeholder: '留下你的想法...',
  },
});
```

---

## 總結

✅ **成功部署 Waline 的關鍵步驟：**

1. 在 Vercel 部署 Waline 專案
2. 連接 PostgreSQL (Neon) 資料庫
3. **手動執行腳本建立資料表**（最重要！）
4. 設定 `SECURE_DOMAINS` 環境變數
5. 測試註冊和留言功能

🎉 **完成後就可以正常使用留言系統了！**

---

## 參考資源

- [Waline 官方文檔](https://waline.js.org/)
- [Vercel 環境變數](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon PostgreSQL](https://neon.tech/)

---

*文件建立日期: 2026-03-01*  
*最後更新: 2026-03-01*
