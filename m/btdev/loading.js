/*
遮罩层效果插件
作者: binhg
*/
define(function(require,exports,module){
	//增加遮罩类型加载效果
	exports.addLoading = function(element,basePath){
		var elementPosition = element.css('position'),loadingWidth,loadingHeight,loadingLeft,loadingTop;
		if(elementPosition==='static'){
			element.css('position','relative').attr('isStatic','true');
		}
		if(element.is('table')){
			var tbody = element.find('tbody:visible');
			if(tbody.find('tr td').length<1) return;
			loadingHeight = tbody.height()+'px';
			loadingWidth = (element.width())+'px';
			loadingLeft = tbody.position().left+'px';
			loadingTop = tbody.position().top+'px';
		}else{
			loadingHeight = '100%';
			loadingWidth = '100%';
			loadingLeft = 0;
			loadingTop = 0;
		}
		var loadingElement = $('<div mapping="loading"></div>');
		element.append(loadingElement);
		// loadingElement.hide();
		loadingElement.css({
			opacity:0.2, 
			cursor:'pointer', 
			background:'black', 
			position:'absolute',
			left:loadingLeft,
			top:loadingTop, 
			zIndex:3000, 
			width:loadingWidth,
			height:loadingHeight
		});
		var loginIcon = $('<img src="'+BTRootPath+'/m/btdev/img/loading.gif" alt="正在加载中...." />');
		loadingElement.append(loginIcon);
		loginIcon.css({
			position:'absolute',
			left:'50%',
			top:'50%',
			width:'50px',
			height:'50px'
		})
		.css({
			marginLeft:'-'+(loginIcon.width()/2)+'px',
			marginTop:'-'+(loginIcon.height()/2)+'px'
		});
	};

	exports.removeLoading = function(element,callback){
		setTimeout(function(){
			if(element.attr('isStatic')==='true'){
				element.css('position','static').removeAttr('isStatic');
			}
			element.find('[mapping="loading"]').remove();
			if(callback) callback();
		},200);
	};
});