const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, opts) => {
  const config = {
    entry: ['./src/index.js'],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { presets: ['@babel/env'] }
        },
        {
          test: /\.(scss|css)$/i,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(csv|tsv)$/i,
          use: ['csv-loader']
        }
      ]
    },
    optimization: {
      usedExports: true
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist',
      port: 8080,
      watchContentBase: true,
      hot: true // toggle between live reload or hot module reloading
      //hotOnly: true,
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'Covid Science Tmp'
      })
    ]
  };

  if (opts.mode === 'development') {
    config.devtool = 'inline-source-map';
  } else {
    config.devtool = 'source-map'; // lighter weight
  }

  return config;
};
