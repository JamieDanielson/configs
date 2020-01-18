/* eslint-disable no-console */
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path'); // known issue: https://github.com/benmosher/eslint-plugin-import/issues/1396
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const useAnalyzer = process.env.USE_ANALYZER;
const useLocalConfig = process.env.USE_LOCAL_CONFIG || false;

// prepare mapping of .config.local.json attributes
let configuration = {};

if (useLocalConfig) {
	const configFile = '.config.local.json';
	try {
		const content = fs.readFileSync(path.resolve(__dirname, configFile));
		configuration = JSON.parse(content);
		console.log(`Using ${configFile}`);
	} catch (e) {
		// unable to read local config
		if (isProd) {
			throw new Error(`Build failed: unable to read ${configFile}`);
		} else if (!isTest) {
			console.log(`Unable to read ${configFile}, no configuration will be applied`, e);
		}
	}
} else {
	// use the runtime configured environment
	configuration = { OVERRIDE_ENVIRONMENT: null };
}

const defines = Object.keys(configuration).reduce(
	(accumulator, key) => {
		const retAccumulator = accumulator;
		const val = JSON.stringify(configuration[key]);
		retAccumulator[`__${key.toUpperCase()}__`] = val;
		return retAccumulator;
	},
	{
		'process.env': {
			NODE_ENV: JSON.stringify(NODE_ENV),
		},
	},
);

const config = {
	mode: isDev ? 'development' : 'production',
	entry: {
		app: [path.resolve(__dirname, 'src', 'index.js')],
	},
	output: {
		filename: useLocalConfig ? '[name].js' : '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)?$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
	optimization: {
		minimizer: [],
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins: [
		new webpack.DefinePlugin(defines),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.NamedModulesPlugin(),
	],
	resolve: {
		modules: [
			path.resolve(__dirname, 'test'),
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'static'),
			path.resolve(__dirname, 'node_modules'),
			'node_modules',
		],
		extensions: ['.js', '.jsx'],
	},
};

config.devtool = 'source-map';
if (useLocalConfig) {
	config.devServer = {
		historyApiFallback: true,
		host: '0.0.0.0',
		port: 4000,
		disableHostCheck: true,
	};
	if (isDev) {
		config.entry.app.unshift('react-hot-loader/patch', 'webpack/hot/only-dev-server');
		config.plugins.push(new webpack.HotModuleReplacementPlugin());
		config.devServer.hot = true;
	}
} else {
	config.optimization.minimizer.push(
		new TerserPlugin({
			sourceMap: true,
		}),
	);
}

if (useAnalyzer) {
	config.plugins.push(
		new BundleAnalyzerPlugin({ analyzerMode: 'static', reportFileName: 'bundle.html' }),
	);
}

module.exports = config;
/* eslint-enable no-console */
