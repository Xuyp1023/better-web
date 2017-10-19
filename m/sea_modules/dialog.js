define(function(require, exports, module) {
	var dialog = require('l/artDialog/src/dialog');

	//确认框
	exports.confirm = function(msg,okFun,cancelFun,top){
		var d = dialog({
			title: '提示信息',
			content: msg || '提示信息',
			width: 300,
			fixed: true,
			okValue: '确定',
			ok: okFun || function () {},
			cancelValue: '取消',
			cancel: cancelFun || function () {}
		});
		d.showModal();
		//设置绝对定位
		if(top){
			$('[role="alertdialog"]').css('top',top+'px');
		}
	};
	//提示框
	exports.tip = function (msg, closeTime, callback){
		var d = dialog({
			title: '提示信息',
			content: msg || '提示信息',
			width: 300,
			fixed: true,
			close:callback || null
		}).showModal();
		setTimeout(function () {
            d.close().remove();
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
		dialog({
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
});