/**
 * 從 Word 檔案提取圖片並更新文章
 */

import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('用法: node scripts/extract-images.mjs <word檔案>');
  process.exit(1);
}

const wordFile = args[0];
const novelName = path.basename(wordFile, path.extname(wordFile));
const safeNovelName = novelName.replace(/[\[\]]/g, '');

// 圖片輸出目錄
const imageDir = `src/assets/${safeNovelName}`;
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

console.log(`📖 小說: ${novelName}`);
console.log(`📁 圖片目錄: ${imageDir}`);

let imageIndex = 0;
const imageMap = new Map(); // base64 hash -> filename

// 自定義圖片處理
const options = {
  convertImage: mammoth.images.imgElement(async (image) => {
    const imageBuffer = await image.read();
    const hash = crypto.createHash('md5').update(imageBuffer).digest('hex').substring(0, 8);
    
    // 檢查是否已處理過相同圖片
    if (imageMap.has(hash)) {
      return { src: imageMap.get(hash) };
    }
    
    imageIndex++;
    const ext = image.contentType.split('/')[1] || 'png';
    const filename = `image-${String(imageIndex).padStart(3, '0')}.${ext}`;
    const filepath = path.join(imageDir, filename);
    
    fs.writeFileSync(filepath, imageBuffer);
    console.log(`  📷 ${filename} (${Math.round(imageBuffer.length / 1024)}KB)`);
    
    // 相對路徑用於 markdown
    const relativePath = `../../assets/${safeNovelName}/${filename}`;
    imageMap.set(hash, relativePath);
    
    return { src: relativePath };
  })
};

// 轉換為 HTML（包含圖片）
const result = await mammoth.convertToHtml({ path: wordFile }, options);
const html = result.value;

console.log(`\n✅ 共提取 ${imageIndex} 張圖片`);

// 現在需要重新生成章節，包含圖片
// 按 Chapter XX 分割
const chapterRegex = /Chapter\s+(\d+)/gi;

// 先用 HTML 分割章節
const htmlChapters = [];
let lastIndex = 0;
let match;
const regex = new RegExp(chapterRegex);
const matches = [...html.matchAll(/Chapter\s+(\d+)/gi)];

for (let i = 0; i < matches.length; i++) {
  const currentMatch = matches[i];
  const nextMatch = matches[i + 1];
  
  const chapterNum = parseInt(currentMatch[1]);
  const startIdx = currentMatch.index;
  const endIdx = nextMatch ? nextMatch.index : html.length;
  
  const chapterHtml = html.substring(startIdx, endIdx);
  
  htmlChapters.push({
    num: chapterNum,
    numStr: String(chapterNum).padStart(2, '0'),
    html: chapterHtml
  });
}

console.log(`\n📚 找到 ${htmlChapters.length} 個章節`);

// 輸出帶圖片的 HTML 到臨時檔案，供手動檢查
fs.writeFileSync('temp_with_images.html', html, 'utf8');
console.log(`\n💾 完整 HTML 已輸出到 temp_with_images.html`);
console.log(`\n⚠️ 注意：圖片已提取，但需要手動將圖片標記添加到 markdown 文章中`);
console.log(`   圖片路徑格式: ![](../../assets/${safeNovelName}/image-001.jpeg)`);
