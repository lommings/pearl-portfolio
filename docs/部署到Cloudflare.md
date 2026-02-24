# 🚀 部署到 Cloudflare Pages

## 📋 部署檢查清單

### ✅ 準備工作

- [ ] 有 GitHub 帳號
- [ ] 有 Cloudflare 帳號（免費註冊）
- [ ] 本地程式碼已提交（`git status` 顯示 clean）

---

## 步驟 1️⃣：建立 GitHub Repository

### 1.1 登入 GitHub

訪問：https://github.com

### 1.2 建立新 Repository

1. 點擊右上角 `+` → `New repository`

2. 填寫資訊：
   ```
   Repository name: pearl-portfolio
   Description: Pearl 的創作空間
   選擇: Public（公開）
   ```

3. **重要：不要勾選任何選項！**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license

4. 點擊 **Create repository**

### 1.3 複製 Repository URL

建立後會顯示一個頁面，複製這個網址：
```
https://github.com/你的帳號/pearl-portfolio.git
```

---

## 步驟 2️⃣：推送程式碼到 GitHub

### 2.1 連接遠端 Repository

在 `pearl-portfolio` 資料夾開啟終端機，執行：

```bash
git remote add origin https://github.com/你的帳號/pearl-portfolio.git
```

**替換成你的實際網址！**

### 2.2 推送程式碼

```bash
git push -u origin master
```

### 2.3 驗證推送成功

回到 GitHub 網頁，重新整理頁面，應該能看到所有檔案了！

---

## 步驟 3️⃣：部署到 Cloudflare Pages

### 3.1 註冊 Cloudflare

1. 訪問：https://dash.cloudflare.com/sign-up
2. 填寫 Email 和密碼
3. 驗證 Email
4. **不需要信用卡！**

### 3.2 建立 Pages 專案

1. 登入後，左側選單選擇 **Workers & Pages**

2. 點擊 **Create application**

3. 選擇 **Pages** 標籤

4. 點擊 **Connect to Git**

### 3.3 連接 GitHub

1. 點擊 **GitHub** 按鈕

2. 會跳出 GitHub 授權視窗：
   - 點擊 **Authorize Cloudflare Pages**

3. 選擇 repository：
   - 找到 `pearl-portfolio`
   - 點擊旁邊的 **Select**

### 3.4 設定建置配置

填寫以下資訊：

```
Project name: pearl-portfolio
Production branch: master

Build settings:
  Framework preset: Astro
  Build command: npm run build
  Build output directory: dist
```

**重要：確認這些設定正確！**

### 3.5 部署

1. 點擊 **Save and Deploy**

2. 等待建置完成（通常 1-2 分鐘）
   - 可以看到即時建置日誌
   - 綠色勾勾 = 成功！

3. 完成後會顯示網址：
   ```
   https://pearl-portfolio-xxx.pages.dev
   ```

4. **點擊網址查看你的網站！** 🎉

---

## 步驟 4️⃣：綁定自訂域名（可選）

如果你有自己的域名（例如：`pearl.com`）：

### 4.1 在 Cloudflare Pages 加入域名

1. 進入你的 Pages 專案
2. **Custom domains** → **Set up a custom domain**
3. 輸入你的域名
4. 按照指示設定 DNS

### 4.2 DNS 設定

如果域名也在 Cloudflare：
- 會自動設定，無需手動操作

如果域名在其他地方：
- 需要手動加入 CNAME 記錄
- 指向：`pearl-portfolio.pages.dev`

---

## 🔄 日常更新流程

### 發佈新文章後更新網站

```bash
# 1. 確認變更
git status

# 2. 加入變更
git add .

# 3. 提交
git commit -m "新增文章：標題"

# 4. 推送到 GitHub
git push

# 5. Cloudflare 會自動重新部署（1-2 分鐘）
```

**就這麼簡單！** 每次 `git push` 後，Cloudflare 會自動：
1. 偵測到新的 commit
2. 重新建置網站
3. 自動部署上線

---

## 🔍 查看建置狀態

### 在 Cloudflare Dashboard

1. **Workers & Pages** → 選你的專案
2. **Deployments** 標籤
3. 可以看到：
   - 所有部署歷史
   - 建置日誌
   - 部署時間
   - 成功/失敗狀態

### 在 GitHub

1. Repository 頁面
2. 上方會顯示綠色勾勾或紅色叉叉
3. 點擊可以看到詳細狀態

---

## ⚠️ 常見問題

### Q: 推送到 GitHub 時要求輸入帳號密碼

**A:** GitHub 已不支援密碼登入，需要使用 Personal Access Token

**解決方法：**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic) → Generate new token
3. 勾選 `repo` 權限
4. 複製 token（只會顯示一次！）
5. 推送時：
   - Username: 你的帳號
   - Password: 貼上 token

**更好的方法：設定 SSH Key**
```bash
# 生成 SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 複製公鑰
cat ~/.ssh/id_ed25519.pub

# 貼到 GitHub → Settings → SSH and GPG keys → New SSH key
```

然後改用 SSH URL：
```bash
git remote set-url origin git@github.com:你的帳號/pearl-portfolio.git
```

---

### Q: Cloudflare 建置失敗

**檢查這些：**

1. **建置指令是否正確**
   - Build command: `npm run build`
   - 不是 `npm run dev`

2. **輸出目錄是否正確**
   - Build output: `dist`
   - 不是 `build` 或其他

3. **Node 版本**
   - 環境變數加入：`NODE_VERSION=18`

4. **查看建置日誌**
   - 點擊失敗的部署
   - 查看詳細錯誤訊息

---

### Q: 網站更新了但沒生效

**可能原因：**

1. **瀏覽器快取**
   - 按 Ctrl+Shift+R 強制重新載入

2. **DNS 快取**
   - 等待 5-10 分鐘

3. **建置還在進行中**
   - 到 Cloudflare 查看部署狀態

---

### Q: 如何回滾到舊版本

1. Cloudflare Dashboard → Deployments
2. 找到想要回滾的版本
3. 點擊 `...` → **Rollback to this deployment**

---

## 📊 部署後檢查清單

部署成功後，檢查這些功能：

- [ ] 首頁載入正常
- [ ] Blog 列表顯示
- [ ] 文章頁面正常
- [ ] 側邊欄顯示
- [ ] 圖片載入正常
- [ ] 留言系統載入（可能還沒設定 Waline）
- [ ] 標籤頁面正常
- [ ] 手機版響應式正常

---

## 🎯 下一步

部署成功後：

1. **設定 Waline 留言系統**
   - 參考：`docs/實作步驟.md` 的「階段4」

2. **更新網站設定**
   - 修改 `astro.config.mjs` 的 `site` 為你的實際網址

3. **開始推廣**
   - 分享你的網站連結
   - 在社群媒體宣傳

4. **定期更新**
   - 持續發表新文章
   - 查看 Cloudflare Analytics

---

## 📞 需要幫助？

**遇到問題時：**

1. 查看建置日誌（Cloudflare Dashboard）
2. 查看 `docs/疑難排解.md`
3. 搜尋錯誤訊息
4. 詢問我！

---

**祝你部署順利！** 🚀✨
