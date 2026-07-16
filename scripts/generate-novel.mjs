/**
 * 小說生成腳本
 * 從 Word 檔案生成多篇部落格文章
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

// 讀取 Word 檔案
const result = await mammoth.convertToHtml({ path: wordFile });
const html = result.value;
const textResult = await mammoth.extractRawText({ path: wordFile });
const rawText = textResult.value;

// 提取 Summary（在第一個 Chapter 之前）
let summary = '';
const firstChapterMatch = rawText.match(/Chapter\s+\d+/i);
if (firstChapterMatch) {
  const beforeChapter = rawText.substring(0, firstChapterMatch.index).trim();
  // 移除 "Summary:" 標題
  summary = beforeChapter.replace(/^Summary:\s*/i, '').trim();
}

console.log(`\n📝 Summary: ${summary.substring(0, 100)}...`);

// 分割章節 - 使用 "Chapter XX-章節標題" 格式
const chapterRegex = /Chapter\s+(\d+)\s*[-－]\s*(.+?)(?=\n|$)/gi;
const matches = [...rawText.matchAll(chapterRegex)];

console.log(`\n📚 找到 ${matches.length} 個章節\n`);

// 建立章節資料
const chapters = [];
for (let i = 0; i < matches.length; i++) {
  const match = matches[i];
  const nextMatch = matches[i + 1];
  
  const chapterNum = parseInt(match[1]);
  const chapterTitle = match[2].trim();  // 章節中文名稱
  const startIdx = match.index + match[0].length;
  const endIdx = nextMatch ? nextMatch.index : rawText.length;
  
  const content = rawText.substring(startIdx, endIdx).trim();
  const description = content.substring(0, 80).replace(/[\n\r]+/g, ' ').trim() + '...';
  
  chapters.push({
    num: chapterNum,
    numStr: String(chapterNum).padStart(2, '0'),
    title: chapterTitle,  // 例如: "完美的球體"
    displayTitle: `第${String(chapterNum).padStart(2, '0')}章-${chapterTitle}`,  // 例如: "第01章-完美的球體"
    content,
    description
  });
  
  console.log(`  ${chapterNum}. ${chapterTitle}`);
}

// 生成日期 (今天，每章間隔1分鐘)
const baseDate = new Date();
const formatDate = (d) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// 輸出目錄
const blogDir = 'src/content/blog';

// 生成目錄頁（使用英文 slug）- 包含 Summary
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

${chapters.map(ch => `${ch.num}. [${ch.displayTitle}](/blog/${slug}-ch${ch.numStr}/)`).join('\n')}
`;

const indexPath = path.join(blogDir, `${slug}.md`);
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log(`\n✅ 目錄: ${indexPath}`);

// 生成各章節
for (let i = 0; i < chapters.length; i++) {
  const ch = chapters[i];
  const chapterDate = new Date(baseDate.getTime() + (i + 1) * 60000);
  
  const prevChapter = i > 0 ? chapters[i - 1] : null;
  const nextChapter = i < chapters.length - 1 ? chapters[i + 1] : null;
  
  // 導航區塊（使用英文 slug）
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
  
  // 標題使用 "第XX章-章節名稱" 格式（不含小說名稱前綴）
  const chapterContent = `---
title: '${ch.displayTitle}'
description: '${ch.description}'
pubDate: '${formatDate(chapterDate)}'
category: '${category}'
tags: [${tags.map(t => `'${t}'`).join(', ')}]
---

${ch.content}
${navSection}
`;
  
  // 使用英文 slug 作為檔名
  const chapterPath = path.join(blogDir, `${slug}-ch${ch.numStr}.md`);
  fs.writeFileSync(chapterPath, chapterContent, 'utf8');
  console.log(`✅ ch${ch.numStr}: ${ch.displayTitle}`);
}

// 更新記錄檔
const recordPath = '小說原稿/novels-record.json';
let record = {};
if (fs.existsSync(recordPath)) {
  record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
}

const today = new Date().toISOString().split('T')[0];
if (record[novelName]) {
  record[novelName].lastUpdated = today;
  record[novelName].chapters = chapters.length;
} else {
  record[novelName] = {
    slug,
    category,
    tags,
    chapters: chapters.length,
    firstPublished: today,
    lastUpdated: today
  };
}

fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), 'utf8');
console.log(`\n📝 已更新記錄: ${recordPath}`);

console.log(`\n🎉 完成！共生成 ${chapters.length + 1} 個檔案（含目錄）`);
console.log(`\n🔗 網址：`);
console.log(`   目錄: /blog/${slug}/`);
console.log(`   章節: /blog/${slug}-ch01/ ~ /blog/${slug}-ch${String(chapters.length).padStart(2, '0')}/`);
