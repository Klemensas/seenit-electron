import path from 'path';
import webpack from 'webpack';

export default {
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          'ts-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json']
  },
};
