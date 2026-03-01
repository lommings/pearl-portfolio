# Waline 留言系統使用指南

> 日常管理與功能設定

---

## 📋 目錄

1. [管理後台](#管理後台)
2. [環境變數設定](#環境變數設定)
3. [留言設定](#留言設定)
4. [通知功能](#通知功能)
5. [常見問題](#常見問題)

---

## 管理後台

### 登入後台

**網址：** `https://你的waline專案.vercel.app/ui/login`

例如：`https://waline-eight-coral.vercel.app/ui/login`

### 後台功能

| 功能 | 說明 |
|------|------|
| **留言管理** | 查看、審核、刪除留言 |
| **已通過** | 已審核通過的留言 |
| **待審核** | 需要審核的留言 |
| **垃圾** | 標記為垃圾的留言 |
| **用戶管理** | 管理註冊用戶 |

### 管理員帳號

- **第一個註冊的帳號**自動成為管理員
- 管理員可以：
  - 審核/刪除所有留言
  - 設定其他用戶為管理員
  - 查看統計數據

---

## 環境變數設定

在 **Vercel → Settings → Environment Variables** 設定

### ✅ 基本設定

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `SITE_URL` | 你的網站網址 | `https://pearl-portfolio.pages.dev` |
| `SITE_NAME` | 網站名稱 | `Pearl's Blog` |
| `AUTHOR_EMAIL` | 管理員信箱 | `your@email.com` |
| `SECURE_DOMAINS` | 允許的網域（CORS） | `pearl-portfolio.pages.dev` |

### 🔐 留言控制

| 變數名稱 | 說明 | 可選值 | 預設 |
|---------|------|--------|------|
| `COMMENT_MIN_TIME` | 留言最短間隔（秒） | `5`, `10`, `30` | `10` |
| `COMMENT_AUDIT` | 是否需要審核 | `true`, `false` | `false` |
| `AKISMET_KEY` | 垃圾留言過濾 API | Akismet Key | - |

### 📧 郵件通知（可選）

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `SMTP_SERVICE` | 郵件服務 | `gmail`, `outlook` |
| `SMTP_HOST` | SMTP 主機 | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP 埠 | `465` |
| `SMTP_USER` | 郵件帳號 | `your@gmail.com` |
| `SMTP_PASS` | 郵件密碼或應用程式密碼 | `your-app-password` |
| `SENDER_NAME` | 寄件人名稱 | `Pearl's Blog` |
| `SENDER_EMAIL` | 寄件人信箱 | `noreply@pearl-blog.com` |

---

## 留言設定

### 登入設定

在 `src/components/Comments.astro` 修改：

```javascript
Waline.init({
  // ...其他設定
  login: 'enable',  // 可選擇登入或匿名
});
```

**可用選項：**

| 值 | 效果 |
|---|------|
| `'disable'` | 完全停用登入（只能匿名） |
| `'enable'` | 可選登入（預設，推薦） |
| `'force'` | 強制登入才能留言 |

### 必填欄位設定

```javascript
Waline.init({
  meta: ['nick', 'mail', 'link'],       // 顯示的欄位
  requiredMeta: ['nick'],               // 必填欄位（暱稱）
  // requiredMeta: ['nick', 'mail'],   // 暱稱和信箱都必填
});
```

### 留言審核

**在 Vercel 設定：**

```
COMMENT_AUDIT=true
```

開啟後，所有留言需要管理員審核才會顯示。

### 防灌水設定

**在 Vercel 設定：**

```
COMMENT_MIN_TIME=10
```

設定連續留言的最短間隔（秒）。

---

## 通知功能

### 設定郵件通知

#### 1. Gmail 範例

```
SMTP_SERVICE=gmail
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SENDER_NAME=Pearl's Blog
SENDER_EMAIL=your@gmail.com
```

**注意：** Gmail 需要使用**應用程式密碼**，不是你的 Gmail 密碼。

**取得應用程式密碼：**
1. Google 帳戶 → 安全性
2. 開啟「兩步驟驗證」
3. 搜尋「應用程式密碼」
4. 選擇「郵件」→ 產生
5. 複製密碼到 `SMTP_PASS`

#### 2. Outlook 範例

```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your@outlook.com
SMTP_PASS=your-password
```

### 通知類型

設定完成後，會在以下情況發送郵件：

- 有新留言
- 留言被回覆
- 留言被審核通過

---

## 常見問題

### ❓ 如何刪除垃圾留言？

1. 登入後台
2. 勾選垃圾留言
3. 點擊「批次管理」→「標記為垃圾」或「刪除」

### ❓ 如何批次審核留言？

1. 登入後台 → 「待審核」
2. 勾選要通過的留言
3. 點擊「批次管理」→「通過」

### ❓ 如何設定其他管理員？

目前 Waline 沒有直接在後台設定的功能，需要：
1. 讓該用戶先註冊
2. 在資料庫中修改 `wl_users` 表的 `type` 欄位為 `'admin'`

### ❓ 留言沒有通知怎麼辦？

檢查：
1. SMTP 設定是否正確
2. Vercel Logs 有沒有錯誤訊息
3. Gmail 需要使用應用程式密碼，不是一般密碼
4. 防火牆或 ISP 有沒有阻擋 SMTP

### ❓ 如何匯出/備份留言？

1. 登入後台
2. 點擊「匯出」功能（CSV 格式）
3. 或直接從 Neon PostgreSQL 備份資料庫

### ❓ 如何更換網域後保留留言？

1. 更新 Vercel 的 `SITE_URL` 環境變數
2. 留言資料會保留（因為是用路徑識別，不是完整網址）

---

## 🎨 樣式客製化

### 修改留言框樣式

在 `src/components/Comments.astro` 的 `<style>` 區塊：

```css
#waline-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.wl-panel {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
}

/* 自訂顏色 */
.wl-btn {
  background: #3b82f6 !important;
}
```

### 深色模式

```javascript
Waline.init({
  dark: 'auto',  // 自動跟隨系統
  // dark: true, // 強制深色
  // dark: false, // 強制淺色
});
```

---

## 📚 進階設定

### 反應表情

```javascript
Waline.init({
  reaction: true,  // 開啟反應功能
  // reaction: ['👍', '👎', '😄'], // 自訂反應
});
```

### 搜尋功能

```javascript
Waline.init({
  search: true,  // 開啟搜尋
});
```

### 圖片上傳

Waline 預設支援圖片上傳（儲存在資料庫）。

如果要停用：

```javascript
Waline.init({
  uploadImage: false,
});
```

---

## 🔗 相關文件

- [部署指南](./waline-deployment-guide.md) - 完整部署流程
- [Waline 官方文檔](https://waline.js.org/)
- [環境變數完整列表](https://waline.js.org/reference/server.html)

---

**建立日期：** 2026-03-01  
**最後更新：** 2026-03-01
