var webpack = require("webpack");
var path = require("path");


var libs = [
	'mui','muiPicker','muiDtPicker','muiPopPicker',
	'jquery',
	'angular','ngRoute','ngTouch'
];

module.exports = {

	entry:{
		libs:libs
	},
	output:{
		path:path.join(__dirname,'wechat/dist'),
		filename:'[name].dll.js',
		//当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
		library:'[name]_library'
	},
	module:{
		//加载器配置
		loaders:[
			{test:/\.css$/,loader:'style!css'}
		]
	},
	plugins:[
		new webpack.DllPlugin({
			// 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
			path:path.join(__dirname,'wechat/dist','[name]-mainfest.json'),
			// name 是 dll 暴露的对象名，要跟 output.library 保持一致
			name:'[name]_library',
			//context 是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致
			context:path.resolve(__dirname)
		}),
		//压缩打包的文件
	    new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false
	      }
	    })
	],
	resolve:{
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
	    }
	  },

};