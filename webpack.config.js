const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

// const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);


module.exports = (env) => {
  const config = {
    entry: {
      sfirPlayer: './src/app.jsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: env.production ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: env.production ? '[name].[chunkhash].js' : '[name].js',
      publicPath: '/',
      library: '[name]',
      libraryExport: 'default',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            plugins: ['lodash'],
          },
        },
        {
          test: /\.scss$/,
          use: [
            !env.production ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                minimize: {
                  safe: true,
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                autoprefixer: {
                  // browsers: ["last 2 versions"]
                },
                plugins: () => [autoprefixer],
              },
            },
            {
              loader: 'sass-loader',
              options: {},
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif)$/i, // to support eg. background-image property
          // loader: "file-loader",
          loader: 'url-loader',
          query: {
            name: '[name].[ext]',
            // outputPath: 'images/'
            // the images will be emmited to public/assets/images/ folder
            // the images will be put in the DOM <style> tag as eg.
            // background: url(assets/images/image.png);
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, // to support @font-face rule
          loader: 'url-loader',
          query: {
            limit: '10000',
            name: '[name].[ext]',
            outputPath: 'fonts/',
            // the fonts will be emmited to public/assets/fonts/ folder
            // the fonts will be put in the DOM <style> tag as eg.
            // @font-face{ src:url(assets/fonts/font.ttf); }
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
    },
    plugins: [],
    target: 'web',
  };
  if (env.production) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
    config.devServer = {
      contentBase: './',
      // publicPath: '/',
      port: 9001,
      hot: true,
      clientLogLevel: 'info',
      inline: true,
      overlay: true,
      // open: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      // proxy: {
      //   "/aparat.com/": {
      //     target: "https://www.aparat.com/",
      //     pathRewrite: {
      //       "^/aparat.com/": ""
      //     },
      //     logLevel: "debug",
      //     changeOrigin: true,
      //     secure: false
      //   },
      //   headers: {
      //     "Access-Control-Allow-Origin": "*",
      //     Referer: "https://www.aparat.com/"
      //   }
      // },
    };
    config.devtool = 'eval-cheap-module-source-map';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-dev.ejs'),
      hash: true,
      // externalDependencies,
      filename: 'index.html',
    }));
  }
  return config;
};
