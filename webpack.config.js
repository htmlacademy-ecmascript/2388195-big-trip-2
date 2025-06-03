const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',  //main.js задана т. входа
  output: {
    filename: 'bundle.[contenthash].js', // файл сборки (бандл) назван bundle.js
    path: path.resolve(__dirname, 'build'), //в качестве директории для сборки указана папка build. Путь должен быть абсолютный. использован path.resolve;
    clean: true, // опция очистки директории для сборки перед новой сборкой активирована
  },
  devtool: 'source-map', // активирована генерация source-maps
  plugins: [
    new HtmlPlugin({
      template: 'public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
    module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ]
  }
};
