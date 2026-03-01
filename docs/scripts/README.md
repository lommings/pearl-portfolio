# Waline 資料庫初始化腳本

這個資料夾包含建立 Waline PostgreSQL 資料表的腳本。

## 📦 檔案說明

- `create-waline-tables.js` - 建立資料表的主要腳本
- `.env.example` - 環境變數範例檔案

## 🚀 使用方法

### 1. 安裝依賴

```bash
npm install pg dotenv
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env`，填入你的 PostgreSQL 連線網址（從 Vercel Environment Variables 取得）：

```env
DATABASE_URL=postgresql://your-connection-string
```

### 3. 執行腳本

```bash
node create-waline-tables.js
```

### 4. 驗證

成功後應該看到：

```
✅ 已連接到 PostgreSQL 資料庫
✅ 資料表建立成功！
   - wl_users (使用者資料)
   - wl_comment (留言資料)
   - wl_counter (計數器)

🎉 現在可以到你的網站測試留言功能了！
```

## 📝 注意事項

- 腳本使用 `CREATE TABLE IF NOT EXISTS`，所以可以安全地重複執行
- 確保你的資料庫連線網址正確
- 建議在本地或安全的環境執行，不要把 `.env` 上傳到 Git

## 🔗 相關文件

詳細的部署說明請參考：[waline-deployment-guide.md](../waline-deployment-guide.md)
