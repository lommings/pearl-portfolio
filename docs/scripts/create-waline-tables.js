/**
 * Waline PostgreSQL 資料表建立腳本
 * 
 * 使用方法：
 * 1. npm install pg dotenv
 * 2. 建立 .env 檔案，加入 DATABASE_URL=你的PostgreSQL連線網址
 * 3. node create-waline-tables.js
 */

require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  try {
    await client.connect();
    console.log('✅ 已連接到 PostgreSQL 資料庫');

    // wl_users 表 - 使用者資料
    await client.query(`
      CREATE TABLE IF NOT EXISTS wl_users (
        id SERIAL PRIMARY KEY,
        display_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        type VARCHAR(50) DEFAULT 'guest',
        label VARCHAR(255),
        url VARCHAR(255),
        avatar VARCHAR(255),
        github VARCHAR(255),
        twitter VARCHAR(255),
        facebook VARCHAR(255),
        google VARCHAR(255),
        weibo VARCHAR(255),
        qq VARCHAR(255),
        "2fa" VARCHAR(32),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // wl_comment 表 - 留言資料
    await client.query(`
      CREATE TABLE IF NOT EXISTS wl_comment (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        comment TEXT,
        insertedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(100),
        link VARCHAR(255),
        mail VARCHAR(255),
        nick VARCHAR(255),
        pid INTEGER,
        rid INTEGER,
        status VARCHAR(50) DEFAULT 'approved',
        ua TEXT,
        url VARCHAR(255),
        sticky BOOLEAN DEFAULT FALSE,
        "like" INTEGER DEFAULT 0,
        avatar VARCHAR(255),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // wl_counter 表 - 計數器（瀏覽數、反應數）
    await client.query(`
      CREATE TABLE IF NOT EXISTS wl_counter (
        id SERIAL PRIMARY KEY,
        time INTEGER DEFAULT 0,
        reaction0 INTEGER DEFAULT 0,
        reaction1 INTEGER DEFAULT 0,
        reaction2 INTEGER DEFAULT 0,
        reaction3 INTEGER DEFAULT 0,
        reaction4 INTEGER DEFAULT 0,
        reaction5 INTEGER DEFAULT 0,
        reaction6 INTEGER DEFAULT 0,
        reaction7 INTEGER DEFAULT 0,
        reaction8 INTEGER DEFAULT 0,
        url VARCHAR(255) UNIQUE,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ 資料表建立成功！');
    console.log('   - wl_users (使用者資料)');
    console.log('   - wl_comment (留言資料)');
    console.log('   - wl_counter (計數器)');
    console.log('');
    console.log('🎉 現在可以到你的網站測試留言功能了！');
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
    console.error('');
    console.error('請確認：');
    console.error('1. .env 檔案中的 DATABASE_URL 是否正確');
    console.error('2. 資料庫是否可以連接');
    console.error('3. 是否已安裝 pg 和 dotenv 套件');
  } finally {
    await client.end();
  }
}

createTables();
