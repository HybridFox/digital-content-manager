const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const eol = require('eol');
const VirtualFile = require('vinyl');
const flattenObjectKeys = require('i18next-scanner/lib/flatten-object-keys').default;
const omitEmptyObject = require('i18next-scanner/lib/omit-empty-object').default;

function getFileJSON(resPath) {
	try {
		return JSON.parse(fs.readFileSync(fs.realpathSync(path.join(__dirname, 'public/assets', resPath))).toString('utf-8'));
	} catch (e) {
		return {};
	}
}

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
			let obj = namespaces[ns];

			const resPath = parser.formatResourceSavePath(lng, ns);

			// if not defaultLng then Get, Merge & removeUnusedKeys of old JSON content
			if (lng !== options.defaultLng) {
				let resContent = getFileJSON(resPath);
				console.log(resContent)

				if (options.removeUnusedKeys) {
					const namespaceKeys = flattenObjectKeys(obj);
					const resContentKeys = flattenObjectKeys(resContent);
					const unusedKeys = _.differenceWith(resContentKeys, namespaceKeys, _.isEqual);

					for (let i = 0; i < unusedKeys.length; ++i) {
						_.unset(resContent, unusedKeys[i]);
					}

					resContent = omitEmptyObject(resContent);
				}

				obj = { ...obj, ...resContent };
			}

			let text = `${JSON.stringify(obj, null, jsonIndent)}\n`;

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

			this.push(
				new VirtualFile({
					path: resPath,
					contents: Buffer.from(text),
				})
			);
		});
	});

	done();
}

module.exports = {
	input: [
		'apps/client/**/*.{ts,tsx}',
		// Use ! to filter out files or directories
		'!apps/**/*.spec.{ts,tsx}',
		'!apps/**/i18n/**',
		'!**/node_modules/**',
	],
	output: './apps/client/public/assets',
	options: {
		debug: false,
		removeUnusedKeys: true,
		sort: true,
		func: {
			list: ['i18next.t', 'i18n.t', 't'],
			extensions: ['.ts', '.tsx'],
		},
		trans: {
			component: 'Trans',
			i18nKey: 'i18nKey',
			defaultsKey: 'defaults',
			extensions: ['.ts', '.tsx'],
			fallbackKey: function (ns, value) {
				return value;
			},
			acorn: {
				ecmaVersion: 2020,
				sourceType: 'module', // defaults to 'module'
				// Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
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
	flush,
};
