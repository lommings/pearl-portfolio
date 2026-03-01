// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://your-domain.com', // 部署後改成你的域名
	integrations: [mdx(), sitemap()],
	vite: {
		define: {
			'import.meta.env.PUBLIC_WALINE_SERVER': JSON.stringify(
				process.env.PUBLIC_WALINE_SERVER || 'https://waline-eight-coral.vercel.app'
			)
		}
	}
});
