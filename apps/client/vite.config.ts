/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { visualizer } from "rollup-plugin-visualizer";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
	cacheDir: '../../node_modules/.vite/client',

	server: {
		port: 3000,
		host: '0.0.0.0',
		proxy: {
			'/api': 'https://dcm.reffurence.com',
			'/admin-api': 'https://dcm.reffurence.com',
		},
	},

	preview: {
		port: 4300,
		host: 'localhost',
	},

	plugins: [
		federation({
			name: 'dcm',
			remotes: {},
			shared: ['react']
		}),
		react(),
		viteTsConfigPaths({
			root: '../../',
		}),
		visualizer({
			gzipSize: true,
			brotliSize: true,
		}),
	],

	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [
	//    viteTsConfigPaths({
	//      root: '../../',
	//    }),
	//  ],
	// },

	test: {
		globals: true,
		cache: {
			dir: '../../node_modules/.vitest',
		},
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},
});
