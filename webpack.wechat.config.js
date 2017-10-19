var webpack = require('webpack');
var path = require('path');

var BTServerPath = 'https://static.qiejf.com/better';


module.exports = {
  context:path.resolve(__dirname),
  //页面入口文件配置
  entry:{
    index: './wechat/index.js',
    flow:'./wechat/flow.js',
    dicTool:'./m/wechat/dicTool.js',
  },
  //入口文件输出配置
  output: {
    path: __dirname+'/wechat/dist',
    filename: '[name].js',
    publicPath:'https://static.qiejf.com/better/wechat/dist/'
  },
  module: {
    //加载器配置
    loaders: [
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  //插件项
  plugins: [
    new webpack.BannerPlugin('This file is created by binhg at'+new Date()),
    // new HtmlWebpackPlugin({
    //   fileName:['index.html','./views/main.html']
    // })*,
    //引用DLL
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./wechat/dist/libs-mainfest.json')
    }),
    //压缩打包的文件
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
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
      mui:'l/mui/js/mui.js',
      muiPicker:'l/mui/js/mui.picker.js',
      muiDtPicker:'l/mui/js/mui.dtpicker.js',
      muiPopPicker:'l/mui/js/mui.poppicker.js',
      jquery: 'l/jquery/jquery-1.8.3.js',
      zepto:'l/zepto/1.2.0/zepto.js',
      angular:'l/angular/1.2.5/angular.js',
      ngRoute:'l/angular/1.2.5/angular-route.js',
      ngTouch:'l/angular/1.2.5/angular-touch.js',
      ngAnimate:'l/angular/1.2.5/angular-animate.js',
      wx_sdk:'l/weixin/1.1.0/jweixin.js',


      /*前端架构整体加载*/
      'direct':'m/wechat/commondirect.js',
      'filter':'m/wechat/commonfilter.js',
      'common':'m/wechat/common.js',
      'path_wechat':'m/wechat/commonpath.js',
      'service_wechat':'m/wechat/commonservice.js',
      'wx':'m/wechat/wx.js',
      'base64':'m/wechat/base64.js',

      /*wechat相关配置*/
      main:'wechat/js/main.js',
      route:'wechat/js/route.js',
      fmain:'wechat/flowScript/main.js',
      froute:'wechat/flowScript/route.js'
    }
  },
  watch:true
};
