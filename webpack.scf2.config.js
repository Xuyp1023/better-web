var webpack = require('webpack');
var path = require('path');

var BTServerPath = 'https://static.qiejf.com/better'; 

module.exports = {
  context:path.resolve(__dirname),
  entry:{
    index: './wechat/index.js',
    dicTool:'./m/wechat/dicTool.js',
  },
  output: {
    path: __dirname+'/wechat/dist',
    filename: '[name].js',
    publicPath:'https://static.qiejf.com/better/wechat/dist/'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by binhg at'+new Date()),
    // new HtmlWebpackPlugin({
    //   fileName:['index.html','./views/main.html']
    // })*,
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ],
  resolve:{
    // root:[
    //   path.resolve(__dirname)
    // ],
    // modulesDirectories:[
    //   '../'
    // ],
    root:path.resolve(__dirname),
    alias:{
      /*lib配置 别名请勿使用相对位置*/
      jquery: 'l/jquery/jquery-1.8.3.js',
      angular:'l/angular/1.1.5/angular.js',
      ngRoute:'l/angular/1.2.5/angular-route.js',

      /*前端架构整体加载*/
      'direct':'m/wechat/commondirect.js',
      'filter':'m/wechat/commonfilter.js',
      'common':'m/wechat/common.js',
      'path_wechat':'m/wechat/commonpath.js',
      'service_wechat':'m/wechat/commonservice.js',

      /*wechat相关配置*/
      main:'scf2/js/main.js',
      route:'scf2/js/route.js'
    }
  },
  watch:true
}