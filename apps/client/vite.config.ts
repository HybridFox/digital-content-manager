/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
	cacheDir: '../../node_modules/.vite/client',

	server: {
		port: 3000,
		host: '0.0.0.0',
		proxy: {
			'/api': 'https://dcm.reffurence.com',
			'/admin-api': 'https://dcm.reffurence.com',
			'/modules': {
				target: 'http://127.0.0.1:8080',
				rewrite: (path) => path.replace(/^\/modules/, ''),
			},
			'^/node_modules': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: path => [process.cwd(), path].join(''),
			}
		},
	},

	preview: {
		port: 4300,
		host: 'localhost',
	},

	plugins: [
		react(),
		viteTsConfigPaths({
			root: '../../',
		}),
		federation({
			name: 'dynamic-remote',
			remotes: {
				dummyApp: 'dummy.js',
			},
			shared: ["react", "react-dom", "react-router-dom"],
		})
	],

	build: {
		modulePreload: false,
		target: "esnext",
		minify: false,
		cssCodeSplit: false,
	},

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
