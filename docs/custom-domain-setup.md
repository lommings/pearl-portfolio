# 自訂網域設定指南

> 將 Cloudflare Pages 網站綁定到自己的網域

---

## 📋 目錄

1. [前置準備](#前置準備)
2. [方式 A：網域在 Cloudflare](#方式-a網域在-cloudflare)
3. [方式 B：網域在其他註冊商](#方式-b網域在其他註冊商)
4. [添加自訂網域到 Pages](#添加自訂網域到-pages)
5. [後續設定](#後續設定)
6. [疑難排解](#疑難排解)

---

## 前置準備

### 你需要：

- ✅ 已註冊的網域（例如：`lizzyamano.com`）
- ✅ Cloudflare Pages 網站已部署
- ✅ 網域註冊商的帳號權限

### 確認網域註冊商

常見註冊商：
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare Registrar
- 其他

---

## 方式 A：網域在 Cloudflare

如果你的網域已經在 Cloudflare 註冊或管理：

### 步驟超簡單 ✨

1. 登入 Cloudflare
2. 進入 Pages 專案
3. Custom domains → Set up a custom domain
4. 輸入網域名稱
5. 點擊 **Activate domain**
6. 完成！（自動設定 DNS）

**等待時間：** 幾分鐘

---

## 方式 B：網域在其他註冊商

### 概覽

將網域的 **DNS 管理權**轉移到 Cloudflare，但**網域註冊商**保持不變。

**好處：**
- 免費使用 Cloudflare DNS 和 CDN
- 自動設定 SSL 憑證
- 更好的管理介面
- 續費還是跟原註冊商

---

### Step 1: 在 Cloudflare 添加網站

1. **登入 Cloudflare**
   - 前往：https://dash.cloudflare.com

2. **添加網站**
   - 點擊 **Add a Site**
   - 輸入你的網域（例如：`lizzyamano.com`）
   - 點擊 **Add site**

3. **選擇方案**
   - 選擇 **Free** 方案
   - 點擊 **Continue**

4. **掃描 DNS 記錄**
   - Cloudflare 會自動掃描現有的 DNS 記錄
   - 檢查記錄是否正確
   - 點擊 **Continue**

5. **取得 Nameservers**
   
   Cloudflare 會顯示兩個 nameserver，例如：
   ```
   amanda.ns.cloudflare.com
   buck.ns.cloudflare.com
   ```
   
   **記下這兩個 nameserver！**（或保持頁面開著）

---

### Step 2: 修改網域註冊商的 Nameservers

#### GoDaddy 範例

1. **登入 GoDaddy**
   - 前往：https://www.godaddy.com

2. **進入網域管理**
   - 點擊右上角 → **My Products**
   - 找到你的網域
   - 點擊 **DNS**

3. **修改 Nameservers**
   - 點擊 **Nameservers** 區塊
   - 選擇 **Change Nameservers** 或 **Use custom nameservers**
   - 選擇 **I'll use my own nameservers**
   
4. **輸入 Cloudflare Nameservers**
   ```
   Nameserver 1: amanda.ns.cloudflare.com （改成你的）
   Nameserver 2: buck.ns.cloudflare.com （改成你的）
   ```

5. **儲存**
   - 點擊 **Save**
   - 確認變更

---

#### Namecheap 範例

1. 登入 Namecheap
2. Domain List → 點擊網域 → Manage
3. 找到 **Nameservers** 區塊
4. 選擇 **Custom DNS**
5. 輸入 Cloudflare 的兩個 nameserver
6. 儲存

---

#### 其他註冊商

步驟類似：
1. 登入註冊商
2. 找到網域管理
3. 找到 Nameservers 或 DNS 設定
4. 改為「自訂 nameserver」
5. 輸入 Cloudflare 提供的 nameserver
6. 儲存

---

### Step 3: 等待 DNS 生效

1. **回到 Cloudflare**
   - 點擊 **Done, check nameservers**

2. **等待驗證**
   - DNS 傳播需要時間：**幾分鐘到 48 小時**
   - 通常 1-2 小時內完成

3. **收到通知**
   - Cloudflare 會發 Email 通知
   - Dashboard 會顯示綠色勾勾 ✅
   - 狀態變成「Active」

---

## 添加自訂網域到 Pages

### Step 1: 進入 Pages 專案

1. 在 Cloudflare Dashboard
2. 左側選單 → **Workers & Pages**
3. 點擊你的專案（例如：`pearl-portfolio`）

---

### Step 2: 添加自訂網域

1. **點擊 Custom domains 標籤**

2. **添加主網域**
   - 點擊 **Set up a custom domain**
   - 輸入：`lizzyamano.com`（改成你的網域）
   - 點擊 **Continue**
   - Cloudflare 會自動配置 DNS
   - 點擊 **Activate domain**

3. **添加 www 子網域（推薦）**
   - 重複上面步驟
   - 輸入：`www.lizzyamano.com`
   - 這樣兩個網址都能訪問

---

### Step 3: 等待設定完成

1. **狀態：Verifying（驗證中）**
   - DNS 記錄正在配置
   - SSL 憑證正在申請

2. **狀態：Active（完成）**
   - 網域已成功綁定
   - SSL 憑證已啟用
   - 可以開始使用！

**通常需要：** 幾分鐘到幾小時

---

## 後續設定

### 1. 測試網站

訪問你的新網域：
- `https://你的網域.com`
- `https://www.你的網域.com`

確認：
- ✅ 網站正常顯示
- ✅ 有 🔒 安全鎖頭（HTTPS）
- ✅ 圖片和樣式正常載入

---

### 2. 更新 Waline 環境變數

如果你有使用 Waline 留言系統：

1. **前往 Vercel**
   - 登入 Vercel
   - 進入 Waline 專案
   - Settings → Environment Variables

2. **更新變數**
   
   修改或新增：
   ```
   SITE_URL=https://你的網域.com
   ```

3. **重新部署**
   - Deployments → 最新部署 → ⋯ → Redeploy

---

### 3. 更新社交分享連結

如果有設定社交媒體連結：
- 更新 Facebook、Twitter 等個人檔案
- 更新簡歷中的網站連結
- 更新名片資訊

---

### 4. 設定 301 重定向（可選）

讓舊網址自動跳轉到新網域：

**在 Cloudflare Pages 設定：**

建立 `_redirects` 檔案（放在專案根目錄或 `public/`）：

```
https://pearl-portfolio.pages.dev/* https://你的網域.com/:splat 301!
```

這樣訪問舊的 `.pages.dev` 網址會自動跳轉到新網域。

---

## 疑難排解

### ❓ 網域一直顯示 "Verifying"

**可能原因：**
- DNS 還在傳播中（等待更久）
- Nameserver 設定錯誤

**解決方法：**
1. 檢查 GoDaddy 的 nameserver 是否正確
2. 用 DNS 查詢工具確認：https://www.whatsmydns.net/
3. 等待 24-48 小時

---

### ❓ 顯示 "DNS 錯誤" 或 "無法連線"

**解決方法：**

1. **確認 DNS 記錄**
   - Cloudflare → DNS → 確認有 A 或 CNAME 記錄
   - 應該會自動產生，如果沒有請聯繫 Cloudflare 支援

2. **清除瀏覽器快取**
   - Ctrl+Shift+Delete → 清除快取

3. **使用無痕模式測試**

4. **用其他裝置測試**
   - 手機
   - 其他電腦
   - 行動網路

---

### ❓ SSL 憑證錯誤（不安全的連線）

**解決方法：**

1. **等待 SSL 憑證生效**
   - 通常需要幾分鐘到幾小時

2. **檢查 Cloudflare SSL 設定**
   - Cloudflare → SSL/TLS
   - 確認設定為 **Full** 或 **Full (strict)**

3. **強制 HTTPS**
   - Cloudflare → SSL/TLS → Edge Certificates
   - 開啟 **Always Use HTTPS**

---

### ❓ www 和沒有 www 只有一個能用

**解決方法：**

確認兩個網域都有添加：
- `lizzyamano.com`
- `www.lizzyamano.com`

在 Cloudflare Pages → Custom domains 應該會看到兩個。

---

### ❓ 大陸地區無法訪問或很慢

**原因：**
- Cloudflare 在大陸沒有優化線路
- 網域沒有 ICP 備案

**解決方法：**

1. **短期方案**
   - 使用 Cloudflare China Network（需要企業方案）
   - 或接受速度較慢

2. **長期方案**
   - 申請 ICP 備案（需要大陸主機和公司資質）
   - 使用國內 CDN（七牛雲、又拍雲）

3. **測試速度**
   - 使用工具：https://www.17ce.com/
   - 請大陸朋友實測

---

### ❓ 郵件服務受影響

**注意：**

轉移 DNS 到 Cloudflare 後，如果你的網域有使用：
- 企業郵件（Gmail、Outlook）
- 自訂郵件伺服器

**請確認：**

1. Cloudflare 在掃描 DNS 時有抓到 MX 記錄
2. 如果沒有，手動添加 MX 記錄

---

## 📊 DNS 傳播檢查工具

- https://www.whatsmydns.net/ - 全球 DNS 傳播查詢
- https://dnschecker.org/ - DNS 記錄檢查
- https://www.17ce.com/ - 大陸地區速度測試

---

## 💰 費用說明

| 項目 | 費用 |
|------|------|
| Cloudflare DNS | 免費 |
| Cloudflare CDN | 免費 |
| SSL 憑證 | 免費 |
| Pages 託管 | 免費 |
| 網域續費 | 向原註冊商付費 |

**總結：** 除了網域年費，其他都免費！

---

## 🎯 完整流程總結

### 如果網域在 GoDaddy

1. ✅ Cloudflare 添加網站
2. ✅ 取得 nameservers
3. ✅ GoDaddy 修改 nameservers
4. ⏰ 等待 DNS 生效（1-24h）
5. ✅ Pages 添加自訂網域
6. ✅ 更新 Waline 環境變數
7. ✅ 測試所有功能

---

## 📚 相關文件

- [部署到 Cloudflare](./部署到Cloudflare.md)
- [Waline 使用指南](./waline-usage-guide.md)
- [Cloudflare 官方文檔](https://developers.cloudflare.com/pages/platform/custom-domains/)

---

## 🎉 完成！

恭喜你成功設定自訂網域！

你的網站現在可以透過自己的網域訪問了 🚀

---

**建立日期：** 2026-03-02  
**最後更新：** 2026-03-02  
**範例網域：** lizzyamano.com
