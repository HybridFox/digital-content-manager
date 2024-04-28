const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { ModuleFederationPlugin } = require('webpack').container;

const deps = require('../../package.json').dependencies;

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
	config.devServer.proxy = [
		{
			context: ['/api'],
			target: 'http://localhost:8000',
			secure: false,
			changeOrigin: true,
		},
		{
			context: ['/admin-api'],
			target: 'http://localhost:8000',
			secure: false,
			changeOrigin: true,
		},
		{
			context: ['/modules'],
			target: 'http://127.0.0.1:8080',
			secure: false,
			pathRewrite: { '^/modules': '' },
		},
	];

	config.plugins.push(
		new ModuleFederationPlugin({
			name: 'client',
			shared: {
				...deps,
				react: { singleton: true, eager: true, requiredVersion: deps['react'] },
				'react-dom': {
					singleton: true,
					eager: true,
					requiredVersion: deps['react-dom'],
				},
				'react-router': {
					singleton: true,
					eager: true,
					requiredVersion: deps['react-router'],
				},
				'react-router-dom': {
					singleton: true,
					eager: true,
					requiredVersion: deps['react-router-dom'],
				},
				i18next: {
					singleton: true,
					eager: true,
					requiredVersion: deps['i18next'],
				},
				'react-i18next': {
					singleton: true,
					eager: true,
					requiredVersion: deps['react-i18next'],
				},
				'react-modal': {
					singleton: true,
					eager: true,
					requiredVersion: deps['react-modal'],
				},
				'dayjs': {
					singleton: true,
					eager: true,
					requiredVersion: deps['dayjs'],
				},
				'i18next-http-backend': {
					singleton: true,
					eager: true,
					requiredVersion: deps['i18next-http-backend'],
				},
				'zustand': {
					singleton: true,
					eager: true,
					requiredVersion: deps['zustand'],
				},
			},
		})
	);

	return config;
});
