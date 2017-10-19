/*
* TAB切换效果(反应对像为显示/隐藏)
*	tab_bs 触发TAB效果对像
*	tab_ps 反应事件对像（可以是多个组）例：["#tab1_p li","#tab1_b div.more a"]
*	type	绑定的事件（多个事件用空格 分开如“click focus”）
*	classname	当前TAB标签添加的样式 (可选)
*	moren 激活的标签位置 默认为0  (可选)
*	callBack 回调函数，第一次参数为当前激活的位置 (可选)
* explain:
*	require("tab")("#tab li","#tab>div>li","click",0,function(i){alert(i)});
*/
define(function(require, exports, module) {

	var definedEvent = "csc85E_Tab";
	module.exports = function(tab_bs,tab_ps,type,classname,moren,callBack){
		var $tab_bs = $(tab_bs);
		if($tab_bs.length<=0){return;}
		var $moren = moren || 0;	
		$tab_bs.each(function(i){
			$(this).on((type ? type : "mouseenter")+" "+definedEvent,function(){
				try{
					var thistab=$(this);
					$tab_bs.removeClass(classname);
					thistab.addClass(classname);
					if(tab_ps instanceof Array){
						for (it in tab_ps){
							$($(tab_ps[it]).hide().get(i)).show();
						}
					}else{
						$($(tab_ps).hide().get(i)).show();
					}
					if(typeof(callBack)=="function"){callBack(i,thistab)}
				}catch(e){alert(e);}
				return false;
			})
		});
		$($tab_bs.get($moren)).trigger(type.match(/[^\s\b]+/)[0]);
	};
});