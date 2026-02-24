---
title: '歡迎來到我的創作空間'
description: '這是一篇示範文章，展示如何使用各種功能'
pubDate: 'Feb 24 2026'
heroImage: '/blog-placeholder-3.jpg'
---

歡迎來到我的創作世界！這裡會分享我的故事、遊戲和畫作。

## 關於這個網站

這個網站使用 Astro 建置，具有以下特色：

- 📝 **故事創作** - 用 Markdown 輕鬆撰寫
- 🎮 **遊戲展示** - 可嵌入 HTML5 遊戲
- 🎬 **影片分享** - 支援 YouTube 和 Bilibili
- 💬 **讀者互動** - 留言討論功能
- 🌏 **中國友好** - 針對中文用戶優化

## 如何使用組件

### 嵌入影片

你可以在文章中嵌入 YouTube 或 Bilibili 影片：

```astro
import VideoPlayer from '../../components/VideoPlayer.astro';

<VideoPlayer 
  youtube="dQw4w9WgXcQ"
  bilibili="BV1xx411c7XZ"
  title="影片標題"
/>
```

### 嵌入遊戲

如果你製作了 HTML5 遊戲，可以這樣嵌入：

```astro
import GameEmbed from '../../components/GameEmbed.astro';

<GameEmbed 
  src="/games/my-game/index.html"
  title="我的遊戲"
/>
```

## Markdown 基本語法

### 標題

使用 `#` 符號建立標題，從 `#` 到 `######` 代表不同層級。

### 文字格式

- **粗體文字** - 使用 `**文字**`
- *斜體文字* - 使用 `*文字*`
- ~~刪除線~~ - 使用 `~~文字~~`

### 列表

無序列表：
- 項目 1
- 項目 2
  - 子項目 2.1
  - 子項目 2.2

有序列表：
1. 第一步
2. 第二步
3. 第三步

### 連結與圖片

[這是連結文字](https://example.com)

![這是圖片說明](/blog-placeholder-1.jpg)

### 引用

> 這是引用文字。
> 可以跨多行。

### 程式碼

行內程式碼：`const hello = "world";`

程式碼區塊：

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Pearl");
```

## 下一步

開始創作你的第一篇文章吧！只要在 `src/content/blog/` 資料夾建立新的 `.md` 檔案即可。

記得在文章開頭加上 frontmatter：

```markdown
---
title: '文章標題'
description: '文章摘要'
pubDate: 'Feb 24 2026'
heroImage: '/blog-placeholder.jpg'
---

文章內容從這裡開始...
```

祝你創作愉快！✨
