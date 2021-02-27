// Native Node Modules
const path = require('path');
const zlib = require('zlib');

// NPM packages
const glob = require('glob');
const Dotenv = require('dotenv-webpack');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Needs to be version 5.0.0-alpha.6 to prevent deprecation warning
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// To purge files from prev builds in dist folder leaving only the latest files from the most current build
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const hashType = isDev ? 'contenthash' : 'chunkhash';

const pluginsObj = {
  common: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      scriptLoading: 'defer',
      hash: !isDev,
      favicon: path.resolve(__dirname, 'public', 'react-temp-favicon.ico'),
    }),

    new CleanWebpackPlugin(),
    new Dotenv(),
  ],

  prod: [
    new MiniCssExtractPlugin({ filename: `[name].bundle.[${hashType}].css` }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
    }),

    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|jsx)$|\.(sc|c)ss$|\.html$|\.jpg$|\.svg$|\.gif$|\.png$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|jsx|scss|css|html|svg|gif|png)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],

  dev: [
    new BundleAnalyzerPlugin({ openAnalyzer: true }),
    new DuplicatePackageCheckerPlugin(),
  ],
};

const finalCSSLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: `[name].bundle.[${hashType}].js`,
    chunkFilename: `[name].${isDev ? 'bundle' : `[${hashType}]`}.js`,
  },

  resolve: {
    extensions: ['.js', '.jsx'], // Files with these extensions will not be required have their extension on import

    // Essentially tells webpack that places where react or any package referenced here, is found should make use of the react in the node_modules folder and not install another one. This helps prevent duplicate modules. However this breaks applications if module A require react v16 but react v17 is installed in the node_modules folder

    alias: {
      react: path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
    },
  },

  module: {
    rules: [
      // Note that for the 'use' property, loaders are applied in reverse: from the last loader to the first ['last', 'first']
      // The last loader must return JS code
      {
        test: /\.(sa|sc|c)ss$/,
        use: [finalCSSLoader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },

      {
        // With Webpack v5 it is no longer necessary to use 'file-loader' for assets as webpack has built its own loader for them
        test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
        type: 'asset/resource',
      },

      {
        // It can also be used for fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },

      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },

  // Source maps make debugging easier because during an error you would be able to see where the error occurred in your source rather than in the compiled webpack code that is being served
  devtool: isDev ? 'inline-source-map' : void 0,

  devServer: {
    contentBase: path.join(__dirname, 'dist'), // Tells webpack dev server where to serve files from
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true, // Fallback 404s to index.html
  },

  optimization: {
    minimize: !isDev,
    // Since we have asked webpack to separate our code into chunks, webpack emits runtime chunk to enable the loading of your defined chunks when needed and in the correct manner
    runtimeChunk: 'single',

    // To prevent the vendor chunk (for node modules) from being rebuilt when local dependencies are changed and assists with long-term caching

    moduleIds: 'deterministic',

    // Can be used to extract common dependencies between chunks, or define chunks
    splitChunks: {
      cacheGroups: {
        // Create chunk for third party dependencies or npm dependencies
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
        },

        common: {
          name: 'common',
          chunks: 'all',
          // Tells webpack to assign a module to this chunk if it is referenced by at least 2 files/modules/chunks.
          minChunks: 2,
          reuseExistingChunk: true,

          // Forces splitChunks plugin to form this chunk irrespective of the size of the chunk
          enforce: true,

          /*
            Used to determine where chunks that match numerous cacheGroups will go.
            The group with the larger priority will be win the chunk
          */
          priority: 10,
        },

        // Chunk for styles
        styles: {
          name: 'styles',
          test: /\.(scss|sass|css)$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  mode: isDev ? 'development' : 'production',
};

module.exports = {
  ...config,
  plugins: [...pluginsObj.common, ...[isDev ? pluginsObj.dev : pluginsObj.prod]].flat(),
};
