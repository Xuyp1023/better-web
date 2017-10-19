define(function(require, exports, module) {
	var dialog = require('dialogEx');

	//确认框
	exports.confirm = function(msg,okFun,cancelFun){
		dialog({
			title: '提示信息',
			content: msg || '提示信息',
			width: 300,
			fixed: true,
			zIndex:99999,
			okValue: '确定',
			ok: okFun || function () {},
			cancelValue: '取消',
			cancel: cancelFun || function () {}
		}).showModal();
	};
	//提示框
	exports.tip = function (msg, closeTime, callback,isOutExec){
		var d = dialog({
			title: '提示信息',
			content: msg || '提示信息',
			width: 300,
			fixed: true,
			zIndex:99999,
			close:isOutExec?null:(callback || null)
		}).showModal();
		setTimeout(function () {
            d.close().remove();
            if(isOutExec&&callback) callback();
        }, closeTime * 1000);
	};
	//警告框
	exports.alert = function (msg, fun){
		dialog({
			title: '警告信息',
			content: msg || '警告信息',
			width: 300,
			fixed: true,
			ok:fun || null
		}).showModal();
	};	
	//错误框
	exports.error = function (msg, okfun){
		dialog({
			title: '错误提示',
			content: msg || '错误提示',
			width: 300,
			fixed: true,
			ok: okfun || true
		}).showModal();
	};	
	//成功提示
	exports.success = function (msg,closeTime,callback){
		var d = dialog({
			title: '成功提示',
			content: msg || '成功提示',
			width: 300,
			fixed: true,
			close:callback || null
		}).showModal();
		setTimeout(function () {
            d.close().remove();
        }, closeTime * 1000);
	};
	// 成功提示自定义框
	//成功提示
   /* exports.successful = function (msg,closeTime,callback){
        var d = dialog({
            title: '成功提示',
            content:'<h1 class="content-title-1 content-title-condensed content-title-blue font-size-24">数据解析成功'+
                    '</h1>'+
                    '<table class="table table-condensed div-width-70 div-center search-table">'+
                        '<tr>'+
                            '<td>佣金金额:</td>'+
                            '<td>60522222</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>导入笔数:</td>'+
                            '<td>2000</td>'+
                        '</tr>'+
                    '</table>'+
                    '<a href="javascript:void(0);" ng-click="detailFacBox(item);">查看详情&gt;&gt;</a>'+
                    '<span style="float:right" ng-bind="msg.message"></span>',    

            width: 300,
            height:170, 
            fixed: true,
            close:callback || null
        }).showModal();
        setTimeout(function () {
            d.close().remove();
        }, closeTime * 1000);
    };*/
});