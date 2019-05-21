const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const isDev = process.env.NODE_ENV !== "production";

const outputPath = path.join(__dirname, "dist");

const plugins = [
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, "css/*")
    },
    {
      from: path.join(__dirname, "src/index.html")
    },
    {
      from: path.join(__dirname, "pages/*.html")
    }
  ])
];

module.exports = {
  mode: isDev ? "development" : "production",
  entry: {
    script: path.join(__dirname, "./src/index.js")
  },
  devtool: isDev ? "source-map" : false,
  watch: isDev,
  devServer: {
    contentBase: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".svg"]
  },
  output: {
    filename: "index.js",
    path: outputPath
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  plugins
};
