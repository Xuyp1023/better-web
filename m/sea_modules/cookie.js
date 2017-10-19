define(function(require, exports, module) {
	exports.set = function (name, value, minute, domain) {
		var	minute = minute || 10,
				expire =";expires=" + (new Date((new Date()).getTime() + minute * 60000)).toGMTString();
		//document.cookie = name + "=" + escape(value || "") + expire +";path=/;domain="+(domain || document.domain);
		document.cookie = name + "=" + escape(value || "") + expire +"domain="+(domain || document.domain);
		return this;
	};

	//获取指名称的Cookie值
	exports.get = function (name) {
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		if(arr != null) return unescape(arr[2]); return null;
	};

	//删除指名称的Cookie
	exports.del = function (name){
		this.setCookie(name,null,-1);
		return this;
	};
});