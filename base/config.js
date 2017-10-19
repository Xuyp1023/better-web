/**
 * js配置文件
 *
 */

window.BTRootPath = 'https://static.qiejf.com/better/';
window.BTServerPath = function() { //js获取项目根路径，如： http://localhost:8083/uimcardprj
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //兼容BFS代理路径
    var BFSPath = location.href.indexOf('qiejf') === -1 ? '/better' : '';
    // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
    // 	BFSPath += '/'+window.parent.pathFlag.path;
    // }
    return (localhostPaht + projectName + BFSPath);
}();

seajs.config({
    // 别名配置
    alias: {
        'jquery': 'l/jquery/jquery.min.js',
        'knockout': 'l/knockout/knockout-2.3.0.js',
        'angular': 'l/angular/angular.js',
        'json3': 'l/json3/json3.min.js',
        'webUploader': 'l/WebUploader/webuploader.min.js',
        'swfuploader': 'l/SWFUpload/v2.2.0.1/swfupload.js',
        'BTDictData': BTServerPath + '/p/generate/lib/BTDictData.js'
    },
    // 路径配置
    paths: {

    },

    // 映射
    map: [
        ['f=', '../f=']
    ],

    // 预加载项
    preload: [
        window.jQuery ? '' : 'jquery',
        window.ko ? '' : 'knockout',
        window.JSON ? '' : 'json3'

    ],

    // Sea.js 的基础路径
    /*base: 'E:/workspace/bytterfund/',*/
    // base: 'https://test.qiejf.com/better/',
    base: window.BTRootPath,

    // 调试模式
    debug: false
});
