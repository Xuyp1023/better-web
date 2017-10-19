/**
*左部导航模块
*作者:binhg
*/
define(function(require,exports,module){
	require('l/jquery-ui/ui/minified/jquery.ui.core.min');
	require('l/jquery-ui/ui/minified/jquery.ui.widget.min');
	require.async('l/jquery-ui/ui/minified/jquery.ui.accordion.min',function(){
		//加载公用模块
		var common = require('p/js/common/common');

		//初始化导航条基本参数
		exports.initNavbar = function(initParams){
			var _defaultParams = {
				containerWidth:'194px',//包裹容器宽度
				navbarWidth:'100%',//navbar宽度
				container_id:'container',//包裹容器ID
				navbar_id:'navbar',//navbarID
				url:common.getRootPath()+'/Platform/CustOperator/findSysMenuByMenuId',//导航数据请求地址
				isAutoHeight : true
			};
			var newParams = $.extend(_defaultParams,initParams===null?{}:initParams),
			navbarjq = $('#'+newParams.navbar_id);

			//设置各项参数
			$('#'+newParams.container_id).css('width',newParams.containerWidth);
			navbarjq.css('width',newParams.navbarWidth);
			//构建导航树数据以及DOM结构、进行插件绑定
			_personModule.refreshNavDom(newParams.url,navbarjq);
		};

		//模块数据声明和初始化(Model)
		window.currentData = {
			treeData : []
		};

		//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
		var viewModel = {
			treeDataBind : ko.observable(),
			csspreBind : ko.observable()

			//事件绑定
		};

		//定义私有属性以及方法
		var _personModule = {
			//获取菜单数据并且提供生成DOM结构所需数据
			refreshNavDom : function(url,navbarjq){
				var menuid = location.href.split('#')[1];
					$.post(url,{menuId:menuid},function(data){
						if(common.isCurrentData(data)&&common.isNoEmptyArray(data.data)){
							currentData.treeData = data;
							//初始化右侧内容区
							if(menuid === '2'){
								_personModule.setContent('fundInfo/fundInfo.html');
							}else{
								_personModule.setContent(data.data[0].children[0].url);
							}
							viewModel.treeDataBind(currentData.treeData);
							navbarjq.accordion({
								collapsible:true,
								autoHeight:false
							});
						}else {
							if(console) console.log('未得到正确的菜单结果,现得结果为:'+JSON.stringify(data)+',现入参为menuId:'+menuid);
						}
					},'json');
			},
			//设置内容区
			setContent : function(url){
				var hash = '',
				iframe = $(window.parent.document).find('#content_iframe,#mainshow,[name="mainshow"]');//兼容BFS
				if(url.indexOf('#')!== -1){
					hash = url.split('#')[1];
					url = url.split('#')[0];
				}
				iframe.attr('src',common.getRootPath()+'/p/pages/'+url+'?rn='+Math.random()+(hash === ''?'':('#'+hash)));
			}

		};
		//定义全局属性以及方法、数据初始化
		//链接事件绑定
		$('[mapping="content_link"]').live('click',function(){
			//处理url
			var url = $(this).attr('url');
			_personModule.setContent(url);

		});



		exports.initNavbar({});
		//绑定ViewModel
		ko.applyBindings(viewModel);
	});
});
