const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const eol = require('eol');
const VirtualFile = require('vinyl');
const flattenObjectKeys = require('i18next-scanner/lib/flatten-object-keys').default;
const omitEmptyObject = require('i18next-scanner/lib/omit-empty-object').default;
const typescriptTransform = require('i18next-scanner-typescript');

function flush(done) {
	const { parser } = this;
	const { options } = parser;

	// Flush to resource store
	const resStore = parser.get({ sort: options.sort });
	const { jsonIndent } = options.resource;
	const lineEnding = String(options.resource.lineEnding).toLowerCase();

	Object.keys(resStore).forEach((lng) => {
		const namespaces = resStore[lng];

		Object.keys(namespaces).forEach((ns) => {
			const resPath = parser.formatResourceSavePath(lng, ns);
			let resContent;
			try {
				resContent = JSON.parse(fs.readFileSync(fs.realpathSync(path.join(__dirname, 'src/public/assets', resPath))).toString('utf-8'));
			} catch (e) {
				resContent = {};
			}
			const obj = { ...namespaces[ns], ...resContent };
			let text = JSON.stringify(obj, null, jsonIndent) + '\n';

			if (lineEnding === 'auto') {
				text = eol.auto(text);
			} else if (lineEnding === '\r\n' || lineEnding === 'crlf') {
				text = eol.crlf(text);
			} else if (lineEnding === '\n' || lineEnding === 'lf') {
				text = eol.lf(text);
			} else if (lineEnding === '\r' || lineEnding === 'cr') {
				text = eol.cr(text);
			} else {
				// Defaults to LF
				text = eol.lf(text);
			}

			let contents = null;

			try {
				// "Buffer.from(string[, encoding])" is added in Node.js v5.10.0
				contents = Buffer.from(text);
			} catch (e) {
				// Fallback to "new Buffer(string[, encoding])" which is deprecated since Node.js v6.0.0
				contents = new Buffer(text);
			}

			this.push(
				new VirtualFile({
					path: resPath,
					contents: contents,
				})
			);
		});
	});

	done();
}

module.exports = {
	input: [
		'apps/client/**/*.{ts,tsx}',
		'libs/**/*.{ts,tsx}',
		// Use ! to filter out files or directories
		'!apps/**/*.spec.{ts,tsx}',
		'!apps/**/i18n/**',
		'!**/node_modules/**',
	],
	output: './apps/client/src/public/assets',
	options: {
		debug: false,
		removeUnusedKeys: true,
		sort: true,
		func: {
			list: ['i18next.t', 'i18n.t', 't'],
			extensions: ['.js', '.jsx'],
		},
		trans: {
			component: 'Trans',
			i18nKey: 'i18nKey',
			defaultsKey: 'defaults',
			extensions: ['.js', '.jsx'],
			fallbackKey: function (ns, value) {
				return value;
			},
		},
		lngs: ['en_GB'],
		defaultLng: 'template',
		defaultNs: 'translations',
		defaultValue: '__STRING_NOT_TRANSLATED__',
		resource: {
			loadPath: 'i18n/{{lng}}.json',
			savePath: 'i18n/{{lng}}.json',
			jsonIndent: 4,
			lineEnding: '\n',
		},
		nsSeparator: false, // namespace separator
		keySeparator: false, // key separator
		interpolation: {
			prefix: '{{',
			suffix: '}}',
		},
	},
	transform: typescriptTransform({
		// default value for extensions
		extensions: ['.ts', '.tsx'],
		// optional ts configuration
		tsOptions: {
			target: 'es2017',
		},
	}),
	flush,
};
