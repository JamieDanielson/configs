module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: true,
					browsers: [
						'>= 1%',
						'last 2 ChromeAndroid versions',
						'last 2 iOS versions',
						'last 2 Edge versions',
						'last 2 Chrome versions',
						'last 2 Safari versions',
						'last 2 Firefox versions',
						'not ie <= 11',
					],
				},
			},
		],
		'@babel/preset-react',
	],
	plugins: [
		'lodash',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-runtime',
		[
			'transform-builtin-extend',
			{
				globals: ['Error'],
			},
		],
		[
			'module-resolver',
			{
				root: ['./static', './src', './test'],
			},
		],
	],
	env: {
		development: {
			plugins: ['react-hot-loader/babel', '@babel/plugin-syntax-dynamic-import'],
		},
		coverage: {
			plugins: ['dynamic-import-node'],
		},
		production: {
			plugins: [
				'transform-react-remove-prop-types',
				'@babel/plugin-syntax-dynamic-import',
				['react-remove-properties', { properties: ['data-testid'] }],
			],
		},
		debug: {
			plugins: ['dynamic-import-node'],
			retainLines: true,
			sourceMaps: true,
		},
	},
};
