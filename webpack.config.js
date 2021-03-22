const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'scoped-css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
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
        },
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: ['raw-loader', 'glslify-loader']
        }
      ]
    },
    optimization: {
      usedExports: true
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        '@bmfonts': path.resolve(__dirname, 'static/bmfonts')
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './static',
      port: 8080,
      watchContentBase: true,
      hot: true // toggle between live reload or hot module reloading
      //hotOnly: true,
    },
    plugins: [
      new Dotenv(),
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new webpack.HotModuleReplacementPlugin(),
      new CopyWebpackPlugin({
        patterns: [{ from: './static' }]
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'Following the Science',
        favicon: './src/favicon.svg'
      }),
      new webpack.ProvidePlugin({
        THREE: 'three'
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
