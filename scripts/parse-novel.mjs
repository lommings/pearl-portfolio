/**
 * 小說 Word 檔案解析工具 (ESM版本)
 * 用法: node scripts/parse-novel.mjs <word檔案路徑>
 */

import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

async function parseNovel(wordFilePath) {
  // 檢查檔案是否存在
  if (!fs.existsSync(wordFilePath)) {
    console.error(`❌ 找不到檔案: ${wordFilePath}`);
    process.exit(1);
  }

  // 從檔名取得小說名稱
  const novelName = path.basename(wordFilePath, path.extname(wordFilePath));
  console.log(`📖 小說名稱: ${novelName}`);

  try {
    // 讀取 Word 檔案 - 取得純文字
    const textResult = await mammoth.extractRawText({ path: wordFilePath });
    const rawText = textResult.value;

    // 用 [Chapter X] 分割章節
    const chapterRegex = /\[Chapter\s+(\d+)\]/gi;
    const chapters = [];
    
    const matches = [...rawText.matchAll(chapterRegex)];
    
    console.log(`\n🔍 找到 ${matches.length} 個章節標記\n`);

    // 處理章節前的內容（如果有的話，作為序章或前言）
    if (matches.length > 0 && matches[0].index > 0) {
      const prologueContent = rawText.substring(0, matches[0].index).trim();
      if (prologueContent.length > 50) {
        chapters.push({
          number: 0,
          title: '序章',
          content: prologueContent,
          description: prologueContent.substring(0, 100).replace(/\n/g, ' ').trim() + '...'
        });
      }
    }

    // 處理各章節
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];
      
      const chapterNumber = parseInt(currentMatch[1]);
      const startIndex = currentMatch.index + currentMatch[0].length;
      const endIndex = nextMatch ? nextMatch.index : rawText.length;
      
      const content = rawText.substring(startIndex, endIndex).trim();
      const description = content.substring(0, 100).replace(/\n/g, ' ').trim() + '...';
      
      chapters.push({
        number: chapterNumber,
        title: `第${String(chapterNumber).padStart(2, '0')}章`,
        content: content,
        description: description
      });
    }

    console.log(`📚 共 ${chapters.length} 個章節:\n`);
    
    chapters.forEach((chapter, index) => {
      console.log(`  ${index + 1}. ${chapter.title}`);
      console.log(`     字數: ${chapter.content.length}`);
      console.log(`     描述: ${chapter.description.substring(0, 50)}...`);
      console.log('');
    });

    return {
      novelName,
      chapters,
      rawText
    };

  } catch (error) {
    console.error(`❌ 解析錯誤: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接執行此腳本
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('用法: node scripts/parse-novel.mjs <word檔案路徑>');
  console.log('範例: node scripts/parse-novel.mjs 小說原稿/深寂.docx');
  process.exit(1);
}

parseNovel(args[0]);
