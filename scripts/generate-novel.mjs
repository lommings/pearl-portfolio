/**
 * 小說生成腳本
 * 從 Word 檔案生成多篇部落格文章（保留圖片和格式）
 * 
 * 用法: node scripts/generate-novel.mjs <word檔案> <英文網址> <分類> <標籤>
 * 範例: node scripts/generate-novel.mjs "小說原稿/小說.docx" "my-novel" "小說創作" "標籤1,標籤2"
 */

import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length < 4) {
  console.log('用法: node scripts/generate-novel.mjs <word檔案> <英文網址> <分類> <標籤>');
  console.log('範例: node scripts/generate-novel.mjs "小說原稿/[相二]直線與迷宮.docx" "straight-line-and-maze" "[相二]直線與迷宮" "相葉雅紀,二宮和也"');
  process.exit(1);
}

const [wordFile, slug, category, tagsStr] = args;
const tags = tagsStr.split(/[,，]/).map(t => t.trim());

// 從檔名取得小說名稱（中文，用於顯示）
const novelName = path.basename(wordFile, path.extname(wordFile));

console.log(`📖 小說: ${novelName}`);
console.log(`🔗 網址: ${slug}`);
console.log(`📂 分類: ${category}`);
console.log(`🏷️ 標籤: ${tags.join(', ')}`);

// 圖片儲存目錄
const imageDir = `public/images/novels/${slug}`;
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

let imageIndex = 0;

// 圖片處理選項
const options = {
  convertImage: mammoth.images.imgElement(function(image) {
    return image.read("base64").then(function(imageBuffer) {
      imageIndex++;
      const extension = image.contentType.split('/')[1] || 'png';
      const filename = `img-${String(imageIndex).padStart(3, '0')}.${extension}`;
      const imagePath = path.join(imageDir, filename);
      
      // 儲存圖片
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer, 'base64'));
      console.log(`  🖼️ 儲存圖片: ${filename}`);
      
      return {
        src: `/images/novels/${slug}/${filename}`
      };
    });
  })
};

// 讀取 Word 檔案 - 使用 HTML 轉換保留格式
const result = await mammoth.convertToHtml({ path: wordFile }, options);

let html = result.value;
console.log(`\n📄 已轉換 HTML (${html.length} 字元)`);
console.log(`🖼️ 已處理 ${imageIndex} 張圖片`);

if (result.messages.length > 0) {
  console.log('⚠️ 轉換訊息:', result.messages.slice(0, 3));
}

// 同時取得純文字版本（用於 description）
const textResult = await mammoth.extractRawText({ path: wordFile });
const rawText = textResult.value;

// 提取 Summary（在第一個 Chapter 之前）- 從純文字版本
let summary = '';
const firstChapterMatch = rawText.match(/Chapter\s+\d+/i);
if (firstChapterMatch) {
  const beforeChapter = rawText.substring(0, firstChapterMatch.index).trim();
  summary = beforeChapter.replace(/^Summary:\s*/i, '').trim();
}

console.log(`\n📝 Summary: ${summary.substring(0, 100)}...`);

// 用 HTML 版本分割章節
const chapterRegex = /Chapter\s+(\d+)\s*[-－]\s*(.+?)(?=\n|$)/gi;
const textMatches = [...rawText.matchAll(chapterRegex)];

console.log(`\n📚 找到 ${textMatches.length} 個章節\n`);

// 在 HTML 中找對應的章節分割點
const htmlChapterRegex = /Chapter\s+(\d+)\s*[-－]\s*([^<]+)/gi;
const htmlMatches = [...html.matchAll(htmlChapterRegex)];

// 建立章節資料
const chapters = [];

for (let i = 0; i < htmlMatches.length; i++) {
  const match = htmlMatches[i];
  const nextMatch = htmlMatches[i + 1];
  
  const chapterNum = parseInt(match[1]);
  const chapterTitle = match[2].trim();
  
  // 取得 HTML 內容
  const startIdx = match.index + match[0].length;
  const endIdx = nextMatch ? nextMatch.index : html.length;
  let content = html.substring(startIdx, endIdx).trim();
  
  // 清理 HTML - 移除開頭的 </p> 等殘留標籤
  content = content.replace(/^<\/p>\s*/i, '');
  
  // 從純文字取得 description
  const textMatch = textMatches[i];
  const nextTextMatch = textMatches[i + 1];
  if (textMatch) {
    const textStartIdx = textMatch.index + textMatch[0].length;
    const textEndIdx = nextTextMatch ? nextTextMatch.index : rawText.length;
    const textContent = rawText.substring(textStartIdx, textEndIdx).trim();
    var description = textContent.substring(0, 80).replace(/[\n\r]+/g, ' ').trim() + '...';
  } else {
    var description = chapterTitle;
  }
  
  chapters.push({
    num: chapterNum,
    numStr: String(chapterNum).padStart(2, '0'),
    title: chapterTitle,
    shortTitle: `第${String(chapterNum).padStart(2, '0')}章-${chapterTitle}`,
    displayTitle: `${novelName} 第${String(chapterNum).padStart(2, '0')}章-${chapterTitle}`,
    content: content,
    description: description
  });
  
  console.log(`  ${chapterNum}. ${chapterTitle}`);
}

// 日期格式化
const formatDate = (d) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// 輸出目錄
const blogDir = 'src/content/blog';

// 讀取現有章節的日期（保留舊章節日期）
const existingDates = {};
for (const ch of chapters) {
  const chapterPath = path.join(blogDir, `${slug}-ch${ch.numStr}.md`);
  if (fs.existsSync(chapterPath)) {
    const content = fs.readFileSync(chapterPath, 'utf8');
    const dateMatch = content.match(/pubDate:\s*['"]([^'"]+)['"]/);
    if (dateMatch) {
      existingDates[ch.numStr] = dateMatch[1];
    }
  }
}

const existingCount = Object.keys(existingDates).length;
const newCount = chapters.length - existingCount;
console.log(`\n📅 現有章節: ${existingCount}, 新章節: ${newCount}`);

// 新章節使用當前日期
const baseDate = new Date();

// 生成目錄頁
const indexContent = `---
title: '${novelName}-目錄'
description: '${novelName} 全章節目錄'
pubDate: '${formatDate(baseDate)}'
category: '${category}'
tags: [${tags.map(t => `'${t}'`).join(', ')}]
---

# ${novelName}

${summary ? `> ${summary.split('\n').join('\n> ')}\n\n` : ''}

## 📚 章節目錄

${chapters.map(ch => `${ch.num}. [${ch.shortTitle}](/blog/${slug}-ch${ch.numStr}/)`).join('\n')}
`;

const indexPath = path.join(blogDir, `${slug}.md`);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log(`\n✅ 目錄: ${indexPath}`);

// 生成各章節
let newChapterIndex = 0;
for (let i = 0; i < chapters.length; i++) {
  const ch = chapters[i];
  
  // 如果章節已存在，保留原日期；否則用新日期
  let chapterDateStr;
  if (existingDates[ch.numStr]) {
    chapterDateStr = existingDates[ch.numStr];
  } else {
    // 新章節用當前時間，每章間隔1分鐘
    const chapterDate = new Date(baseDate.getTime() + (newChapterIndex + 1) * 60000);
    chapterDateStr = formatDate(chapterDate);
    newChapterIndex++;
  }
  
  const prevChapter = i > 0 ? chapters[i - 1] : null;
  const nextChapter = i < chapters.length - 1 ? chapters[i + 1] : null;
  
  // 導航區塊
  let navSection = `\n---\n\n<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">\n`;
  
  if (prevChapter) {
    navSection += `  <a href="/blog/${slug}-ch${prevChapter.numStr}/" style="text-decoration: none;">⬅️ 上一章</a>\n`;
  } else {
    navSection += `  <span style="opacity: 0.5;">⬅️ 已是第一章</span>\n`;
  }
  
  navSection += `  <a href="/blog/${slug}/" style="text-decoration: none;">📖 目錄</a>\n`;
  
  if (nextChapter) {
    navSection += `  <a href="/blog/${slug}-ch${nextChapter.numStr}/" style="text-decoration: none;">下一章 ➡️</a>\n`;
  } else {
    navSection += `  <span style="opacity: 0.5;">已是最新章節 ➡️</span>\n`;
  }
  
  navSection += `</div>`;
  
  // 章節內容（HTML 格式，保留斜體、粗體、圖片）
  const isNew = !existingDates[ch.numStr];
  const chapterContent = `---
title: '${ch.displayTitle}'
description: '${ch.description}'
pubDate: '${chapterDateStr}'
category: '${category}'
tags: [${tags.map(t => `'${t}'`).join(', ')}]
---

<article class="novel-content">

${ch.content}

</article>
${navSection}
`;
  
  const chapterPath = path.join(blogDir, `${slug}-ch${ch.numStr}.md`);
  fs.writeFileSync(chapterPath, chapterContent, 'utf8');
  console.log(`${isNew ? '🆕' : '✅'} ch${ch.numStr}: ${ch.displayTitle}`);
}

// 更新記錄檔
const recordPath = '小說原稿/novels-record.json';
let record = {};
if (fs.existsSync(recordPath)) {
  record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
}

const today = new Date().toISOString().split('T')[0];
record[novelName] = {
  slug,
  category,
  tags,
  chapters: chapters.length,
  images: imageIndex,
  firstPublished: record[novelName]?.firstPublished || today,
  lastUpdated: today
};

fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), 'utf8');
console.log(`\n📝 已更新記錄: ${recordPath}`);

console.log(`\n🎉 完成！`);
console.log(`   📄 ${chapters.length + 1} 個文章檔案（含目錄）`);
console.log(`   🖼️ ${imageIndex} 張圖片`);
console.log(`\n🔗 網址：`);
console.log(`   目錄: /blog/${slug}/`);
console.log(`   章節: /blog/${slug}-ch01/ ~ /blog/${slug}-ch${String(chapters.length).padStart(2, '0')}/`);
