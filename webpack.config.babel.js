import MinifyPlugin from "babel-minify-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";


export default {
  entry: "./src/index.js",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          { loader: "babel-loader" }
        ]
      }
    ]
  },
  externals: {
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_"
    }
  },
  output: {
    filename: "./dist/wook.min.js",
    library: "wook",
    libraryTarget: "umd"
  },
  plugins: [
    new CleanWebpackPlugin(["./dist"]),
    ...(process.env.NODE_ENV === "production"? [new MinifyPlugin()]: [])
  ]
};