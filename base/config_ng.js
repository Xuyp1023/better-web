/**
 * js配置文件
 *
 */

window.BTRootPath = 'https://static.qiejf.com/better/';
window.BTServerPath = function(){//js获取项目根路径，如： http://localhost:8083/uimcardprj
		    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
		    var curWwwPath=window.document.location.href;
		    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
		    var pathName=window.document.location.pathname;
		    var pos=curWwwPath.indexOf(pathName);
		    //获取主机地址，如： http://localhost:8083
		    var localhostPaht=curWwwPath.substring(0,pos);
		    //获取带"/"的项目名，如：/uimcardprj
		    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		    //兼容BFS代理路径
		    var BFSPath = location.href.indexOf('qiejf') === -1?'/better':'';
		    // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
		    // 	BFSPath += '/'+window.parent.pathFlag.path;
		    // }
		    return(localhostPaht+projectName+BFSPath);
		}();
		// window.isBTTest = location.href.indexOf("vip") < 0?true:false;
window.isBTTest = true;

seajs.config({
	// 别名配置
	alias: {
		'jquery': 'l/jquery/jquery.min.js',
		'knockout':'l/knockout/knockout-2.3.0.js',
		'angular' : 'l/angular/1.1.5/angular.min.js',
		'dicTool' : 'l/dicTool/dicTool.js',
		'bootstrap':'l/bootstrap/js/bootstrap.min.js',
		'datePicker':'l/My97DatePicker/4.8-beta4/WdatePicker.js',
		'dialogEx' : 'l/artDialog/src/dialog.js',
		'json3':'l/json3/json3.min.js',
		'webUploader':'l/WebUploader/webuploader.min.js',
		'swfuploader':'l/SWFUpload/v2.2.0.1/swfupload.js',
		'BTDictData' : BTServerPath+'/p/generate/lib/BTDictData.js',
		'jquery-ui':'l/multiselect/jquery-ui.min.js',
		'ui-multiSelect':'l/multiselect/jquery.multiselect.js',
		'easyloader':'l/easyui/easyloader.js',
		'jqueryPaser':'l/easyui/plugins/jquery.parser.js',
		'ngRoute':'l/angular/1.2.5/angular-route.js',

		//scf2
		'path_s2':'m/btdev/path/scf2/commonpath.js',
		'service_s2':'m/btdev/serv/scf2/commonservice.js',

		//常用组件
		'validate':'m/btdev/validate.js',
		'tooltip':'m/btdev/tooltip.js',
		'common':'m/btdev/common.js',
		'loading':'m/btdev/loading.js',
		'pages':'m/btdev/pages.js',
		'upload':'m/btdev/uploads.js',
		'direct':'m/btdev/commondirect.js',
		'filter':'m/btdev/commonfilter.js',
		'dialog':'m/btdev/dialog.js',
		'modal':'m/btdev/modal.js',
		'multiSelect':'m/btdev/multiSelect.js',
		'date':'m/btdev/date.js',
		'editor':'m/btdev/uieditor/editor.js',
		'base64':'m/btdev/base64.js',


		//spa结构相关
		'main':'scf2/controller/main.js',
		'route':'scf2/controller/route.js'
	},
	// 路径配置
	paths: {

	},

	// 映射
	map: [
		['f=','../f=']
	],

	// 预加载项
	preload: [
		window.jQuery ? '' : 'jquery',
		window.angular ? '' :'angular',
		window.JSON ? '':'json3'

	],

	// Sea.js 的基础路径
	/*base: 'E:/workspace/bytterfund/',*/
	// base: 'https://test.qiejf.com/better/',
	base : window.BTRootPath,

	// 调试模式
	debug: false
});
