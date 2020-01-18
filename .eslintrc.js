module.exports = {
	extends: [
		'airbnb',
		'plugin:prettier/recommended',
		'prettier/react',
		'plugin:jsx-a11y/recommended',
	],
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: 'module',
	},
	rules: {
		// enforce curly brace usage
		curly: ['error', 'all'],
		// arrow-body-style must be manually enabled because prettier/recommended is disabling it
		// see https://github.com/prettier/eslint-config-prettier/blob/master/CHANGELOG.md v4.0.0
		'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
		// prefer-arrow-callback must be manually enabled because prettier/recommended is disabling it
		// see https://github.com/prettier/eslint-config-prettier/blob/master/CHANGELOG.md v4.0.0
		'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
		// https://github.com/apollographql/eslint-plugin-graphql
		// enforce consistent sort order
		'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
		// enforce convention in import order
		'import/order': [
			'error',
			{
				// aliased paths are assigned into the "unknown" grouping
				groups: [
					['builtin', 'external'],
					['internal', 'unknown'],
				],
				'newlines-between': 'never',
			},
		],
		// Allow use of ForOfStatement - no-restricted-syntax does no allow us to turn off a rule. This block overrides the airbnb rule entirely
		// https://github.com/airbnb/javascript/blob/7152396219e290426a03e47837e53af6bcd36bbe/packages/eslint-config-airbnb-base/rules/style.js#L257-L263
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		// permit spreading of props
		'react/jsx-props-no-spreading': ['off'],
		// we want to allow state initialization in the constructor when it depends on props but do not want
		// to make initialization in the constructor mandatory because we want to move away from class components
		'react/state-in-constructor': ['off'],
		'react/jsx-indent': ['error', 'tab'],
		'react/jsx-indent-props': ['error', 'tab'],
		'react/sort-prop-types': [
			'error',
			{
				callbacksLast: false,
				ignoreCase: false,
				requiredFirst: false,
				sortShapeProp: true,
			},
		],
		'import/no-useless-path-segments': ['off'],
	},
	plugins: ['react', 'jsx-a11y', 'prettier', 'react-hooks'],
	settings: {
		'import/resolver': {
			webpack: {
				config: './webpack.config.js',
			},
		},
	},
};
