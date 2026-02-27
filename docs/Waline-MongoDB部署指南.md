# 📝 Waline + MongoDB Atlas 部署指南

本指南使用 **MongoDB Atlas（免費版）** 作為 Waline 的資料庫。

**優勢：**
- ✅ 完全免費（512MB 永久免費）
- ✅ 有上海節點，國內訪問快
- ✅ 全球部署，海外也快
- ✅ 穩定可靠

---

## 📋 部署流程總覽

```
1. 註冊 MongoDB Atlas → 創建免費 Cluster
2. 設定資料庫用戶 → 設定網路白名單 → 取得連接字串
3. 部署 Waline 到 Vercel → 配置 MongoDB
4. 更新本地和 Cloudflare 環境變數 → 測試
```

預計時間：**20-25 分鐘**

---

## 🗄️ 第一步：註冊 MongoDB Atlas

### 1.1 註冊帳號

1. 訪問：https://www.mongodb.com/cloud/atlas/register

2. 可以選擇註冊方式：
   - **Google 帳號**（推薦，最快）
   - Email + 密碼

3. 點擊 **Sign up**

4. 驗證 Email（如果用 Email 註冊）

### 1.2 完成問卷（可跳過）

註冊後會出現一些問題，可以隨便填或點擊 **Skip**。

---

## 🌐 第二步：創建免費 Cluster

### 2.1 選擇部署類型

1. 會看到 "Deploy your database" 頁面

2. 選擇 **M0 (Free)** - 永久免費方案
   ```
   ✅ M0 - Free
   512 MB Storage
   Shared RAM
   ```

3. 點擊 **Create**

### 2.2 選擇雲服務商和區域

**重要：為了國內訪問速度，選擇以下配置：**

1. **Cloud Provider：** 選擇 **Alibaba Cloud**
   - 或選擇 **AWS** 也可以

2. **Region：** 選擇 **Shanghai (cn-shanghai)**
   ```
   🇨🇳 Alibaba Cloud - Shanghai (cn-shanghai)
   ```
   
   如果沒有上海，可以選擇：
   - Hong Kong（香港）
   - Singapore（新加坡）
   - Tokyo（東京）

3. **Cluster Tier：** 確認是 **M0 Sandbox (Free Forever)**

4. **Cluster Name：** 保持預設或改為 `waline-cluster`

5. 點擊 **Create Deployment** 或 **Create Cluster**

### 2.3 等待 Cluster 創建

大約需要 1-3 分鐘，會顯示進度條。

---

## 🔐 第三步：創建資料庫用戶

Cluster 創建完成後，會自動跳出安全設定視窗。

### 3.1 設定資料庫用戶

1. **Authentication Method：** 選擇 **Username and Password**

2. 填寫資訊：
   ```
   Username: waline
   Password: [自動生成] 或自己設定一個強密碼
   ```

3. **重要：複製並保存密碼！** 等等會用到。
   ```
   建議格式：WalineDB2026!@#
   ```

4. 點擊 **Create User** 或 **Create Database User**

### 3.2 設定網路存取（IP Whitelist）

1. 會看到 "Where would you like to connect from?" 

2. **選擇：** My Local Environment

3. **IP Address：** 輸入 `0.0.0.0/0`
   ```
   0.0.0.0/0
   ```
   
   **說明：** 允許所有 IP 訪問（因為 Vercel 的 IP 是動態的）
   
   **安全嗎？** 是的，因為還需要用戶名密碼才能連接。

4. **Description：** `Allow all`

5. 點擊 **Add Entry** 或 **Add IP Address**

6. 點擊 **Finish and Close** 或 **Close**

---

## 🔗 第四步：取得連接字串

### 4.1 打開連接視窗

1. 回到 MongoDB Atlas Dashboard

2. 點擊左側 **Database**

3. 找到你的 Cluster（應該顯示綠色 "Active"）

4. 點擊 **Connect** 按鈕

### 4.2 選擇連接方式

1. 選擇 **Drivers**（應用程式連接）

2. **Driver：** Node.js

3. **Version：** 5.5 or later

### 4.3 複製連接字串

會看到類似這樣的字串：

```
mongodb+srv://waline:<password>@waline-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**重要步驟：**

1. 複製整個字串

2. 將 `<password>` 替換成你剛才設定的密碼
   
   **替換前：**
   ```
   mongodb+srv://waline:<password>@cluster0.xxxxx.mongodb.net/
   ```
   
   **替換後：**
   ```
   mongodb+srv://waline:WalineDB2026!@#@cluster0.xxxxx.mongodb.net/
   ```

3. **注意：** 如果密碼包含特殊字元（如 `@` `#` `!`），需要進行 URL 編碼：
   - `@` → `%40`
   - `#` → `%23`
   - `!` → `%21`
   - `$` → `%24`
   
   **範例：**
   ```
   密碼：WalineDB2026!@#
   編碼後：WalineDB2026%21%40%23
   
   最終連接字串：
   mongodb+srv://waline:WalineDB2026%21%40%23@cluster0.xxxxx.mongodb.net/
   ```

4. 在連接字串末尾加上資料庫名稱：
   ```
   mongodb+srv://waline:密碼@cluster0.xxxxx.mongodb.net/waline
   ```
   
   注意 `.net/` 後面加上 `waline`

5. **保存這個完整的連接字串！** 等等要用。

---

## 🚀 第五步：部署 Waline 到 Vercel

### 5.1 訪問 Vercel 部署頁面

1. 點擊以下連結（在瀏覽器中打開）：

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample)

2. 或直接訪問：
   ```
   https://vercel.com/new/clone?repository-url=https://github.com/walinejs/waline/tree/main/example
   ```

3. 登入 Vercel（用 GitHub 帳號）

### 5.2 配置 Git Repository

1. **Create Git Repository**
   ```
   Repository Name: waline-server
   選擇 Private（私有）
   ```

2. 點擊 **Create**

### 5.3 配置環境變數

展開 **Environment Variables**，加入以下變數：

#### 必填變數：

| Name | Value | 說明 |
|------|-------|------|
| `MONGO_URL` | `mongodb+srv://...` | 你的 MongoDB 連接字串 |

**範例：**
```
MONGO_URL=mongodb+srv://waline:WalineDB2026%21%40%23@cluster0.abcde.mongodb.net/waline
```

**重要：**
- 確保密碼已經過 URL 編碼
- 確保末尾有資料庫名稱 `/waline`
- 確保沒有多餘的空格

#### 可選變數（推薦加上）：

| Name | Value | 說明 |
|------|-------|------|
| `SITE_NAME` | `Pearl's Blog` | 網站名稱 |
| `SITE_URL` | `https://pearl-portfolio.pages.dev` | 網站網址 |
| `AUTHOR_EMAIL` | `your@email.com` | 管理員 Email |

### 5.4 部署

1. 確認所有變數都填對了

2. 點擊 **Deploy**

3. 等待部署完成（約 1-2 分鐘）

4. 看到 **🎉 Congratulations!** 就成功了

### 5.5 取得 Waline 伺服器網址

1. 點擊 **Continue to Dashboard**

2. 會看到你的專案，複製網址：
   ```
   https://waline-server-xxx.vercel.app
   ```

3. **測試是否正常：**
   - 在瀏覽器訪問這個網址
   - 應該會看到 Waline 的歡迎頁面
   - 顯示 "Waline backend is running..." 和版本號

---

## 🔐 第六步：驗證 MongoDB 連接

### 6.1 檢查 Vercel Logs

1. Vercel Dashboard → 你的專案

2. 點擊 **Deployments** 標籤

3. 點擊最新的部署

4. 點擊 **View Function Logs**

5. 應該沒有連接錯誤

### 6.2 檢查 MongoDB

1. 回到 MongoDB Atlas Dashboard

2. 左側選單：**Database** → **Browse Collections**

3. 應該會看到 `waline` 資料庫已自動創建

4. 裡面會有幾個 collection：
   - `Comment`
   - `Counter`
   - `Users`

**如果看到了，表示連接成功！** ✅

---

## ⚙️ 第七步：配置本地環境變數

### 7.1 更新本地 .env

1. 打開 `pearl-portfolio/.env`

2. 更新：
   ```env
   PUBLIC_WALINE_SERVER=https://waline-server-xxx.vercel.app
   ```
   
   **替換成你的實際 Vercel 網址！**

3. 保存

### 7.2 本地測試

```bash
# 啟動開發伺服器
npm run dev
```

訪問 http://localhost:4321，打開文章，測試留言功能。

**按 F12 檢查 Console，應該沒有錯誤。**

---

## ☁️ 第八步：配置 Cloudflare Pages

### 8.1 進入設定

1. 登入 Cloudflare Dashboard

2. **Workers & Pages** → 你的專案 `pearl-portfolio`

3. **Settings** → **Environment variables**

### 8.2 加入環境變數

1. 點擊 **Add variables**

2. **Production** 和 **Preview** 都要加：
   ```
   Variable name: PUBLIC_WALINE_SERVER
   Value: https://waline-server-xxx.vercel.app
   ```

3. 點擊 **Save**

### 8.3 重新部署

```bash
git commit --allow-empty -m "觸發重新部署"
git push
```

或在 Cloudflare Pages → Deployments → Retry deployment

等待 1-2 分鐘部署完成。

---

## ✅ 第九步：測試留言功能

### 9.1 訪問線上網站

```
https://pearl-portfolio.pages.dev
```

### 9.2 測試留言

1. 打開任意文章

2. 滑到留言區

3. 填寫暱稱和留言

4. 點擊 **發送**

5. 應該立即看到留言出現

### 9.3 驗證資料已儲存

1. 回到 MongoDB Atlas

2. Database → Browse Collections

3. 點擊 `waline` 資料庫

4. 點擊 `Comment` collection

5. 應該會看到你剛才的留言！

**成功！** 🎉

---

## 🎨 第十步：設定管理員（可選）

### 10.1 註冊管理員帳號

1. 訪問：`https://waline-server-xxx.vercel.app/ui`

2. 會自動跳轉到註冊頁面

3. 填寫資訊：
   ```
   Email: your@email.com
   Display Name: Pearl
   密碼: [設定一個強密碼]
   ```

4. 點擊 **註冊**

5. **第一個註冊的帳號會自動成為管理員！**

### 10.2 管理後台功能

登入後可以：
- 查看所有留言
- 審核/刪除留言
- 查看統計資料
- 管理使用者
- 配置通知

---

## 🔍 疑難排解

### Q1: 連接 MongoDB 失敗

**錯誤訊息（Vercel Logs）：**
```
MongoServerError: bad auth : authentication failed
```

**解決方法：**

1. **檢查密碼是否正確**
   - 回 MongoDB Atlas → Database Access
   - 可以點擊 **Edit** 重設密碼

2. **檢查 URL 編碼**
   - 特殊字元必須編碼（`@` → `%40`）

3. **檢查資料庫名稱**
   - 連接字串末尾應該是 `.net/waline`

4. **重新部署 Vercel**
   - 更新環境變數後要重新部署

---

### Q2: IP 白名單錯誤

**錯誤訊息：**
```
MongoServerError: IP address is not allowed
```

**解決方法：**

1. MongoDB Atlas → Network Access

2. 確認有 `0.0.0.0/0` 的規則

3. 如果沒有，點擊 **Add IP Address**
   - 輸入：`0.0.0.0/0`
   - 描述：Allow all
   - 點擊 **Confirm**

---

### Q3: Vercel 部署失敗

**檢查：**

1. 環境變數名稱是否正確：`MONGO_URL`（不是 `MONGODB_URL`）

2. 連接字串格式是否正確

3. 查看 Vercel Deployment Logs 的錯誤訊息

---

### Q4: 留言框不顯示

**檢查：**

1. 瀏覽器 Console 有錯誤嗎？

2. `PUBLIC_WALINE_SERVER` 環境變數是否正確？

3. Waline 伺服器能訪問嗎？（直接在瀏覽器打開網址）

4. Cloudflare Pages 的環境變數設定了嗎？

---

### Q5: CORS 錯誤

**錯誤訊息：**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**解決方法：**

在 Vercel 的 Waline 專案加入環境變數：

```
CORS_ALLOWED_ORIGINS=https://pearl-portfolio.pages.dev
```

然後重新部署。

---

## 💰 MongoDB Atlas 免費額度

### M0 Free Tier 限制：

- **儲存空間：** 512 MB
- **RAM：** 共享
- **連接數：** 500 個同時連接
- **備份：** 無自動備份

### 夠用嗎？

對於個人部落格，**完全足夠**！

**估算：**
- 每則留言約 1-2 KB
- 512 MB ≈ 25萬-50萬則留言
- 除非你的部落格超級火紅，否則用不完 😄

### 如何監控用量？

1. MongoDB Atlas → Metrics

2. 查看：
   - Data Size
   - Connections
   - Operations/Second

3. 如果接近上限，可以：
   - 升級到付費版
   - 刪除舊留言
   - 導出備份

---

## 📊 維護與備份

### 定期備份留言

MongoDB Atlas 免費版沒有自動備份，建議手動備份：

#### 方法 1：使用 MongoDB Compass（推薦）

1. 下載 MongoDB Compass：https://www.mongodb.com/try/download/compass

2. 使用連接字串連接到資料庫

3. 選擇 `waline` 資料庫

4. Export collection → 選擇 JSON 格式

5. 保存到本地

#### 方法 2：使用 mongodump（進階）

```bash
mongodump --uri="mongodb+srv://waline:密碼@cluster0.xxxxx.mongodb.net/waline"
```

### 監控 Vercel 用量

1. Vercel Dashboard → Usage

2. 免費版限制：
   - 執行時間：100 GB-Hours/月
   - 頻寬：100 GB/月
   - 函數執行：1M/月

3. 個人部落格完全足夠

---

## 🎯 完成檢查清單

- [ ] MongoDB Atlas Cluster 創建成功
- [ ] 資料庫用戶已設定
- [ ] IP 白名單設定為 `0.0.0.0/0`
- [ ] 連接字串已取得並正確編碼
- [ ] Vercel 部署成功
- [ ] `MONGO_URL` 環境變數設定正確
- [ ] Waline 伺服器可訪問
- [ ] MongoDB 中已自動創建資料庫和 collections
- [ ] 本地環境變數已更新
- [ ] Cloudflare Pages 環境變數已設定
- [ ] 線上留言功能正常
- [ ] 留言已成功儲存到 MongoDB
- [ ] （可選）管理員帳號已註冊

---

## 🎉 完成！

恭喜你完成部署！現在你的留言系統：

✅ 使用 MongoDB Atlas（免費、穩定）  
✅ 部署在 Vercel（全球 CDN）  
✅ 國內外訪問都快  
✅ 完全免費  

---

## 📞 需要幫助？

如果遇到問題：

1. 查看上面的「疑難排解」
2. 檢查 Vercel Logs
3. 檢查瀏覽器 Console
4. 查看 MongoDB Atlas Metrics
5. 參考 Waline 官方文檔：https://waline.js.org
6. 隨時問我！

---

**祝你使用愉快！** 🎊✨
