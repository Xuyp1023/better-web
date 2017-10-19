/**
*左部导航模块
*作者:binhg
*/
define(function(require,exports,module){
	require('l/jquery-ui/ui/minified/jquery.ui.core.min');
	require('l/jquery-ui/ui/minified/jquery.ui.widget.min');
	require.async('l/jquery-ui/ui/minified/jquery.ui.accordion.min',function(){
		//加载公用模块
		var common = require("p/js/common/common");

		//初始化导航条基本参数
		exports.initNavbar = function(initParams){
			var _defaultParams = {
				containerWidth:'194px',//包裹容器宽度
				navbarWidth:'100%',//navbar宽度
				container_id:'container',//包裹容器ID
				navbar_id:'navbar',//navbarID
				url:common.getRootPath()+(true?'/scf2/testdata/navtree.json':'/Platform/CustOperator/findSysMenuByMenuId'),//导航数据请求地址
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
				var menuIdList = window.top.location.href.split('#');
				var menuId = '';
				if(menuIdList.length>1){
					menuId = menuIdList[0];
				}else{
					menuId = '0';
				}
				$.get(url,{menuId:menuId},function(data){
					currentData.treeData = data;
					viewModel.treeDataBind(currentData.treeData);
					navbarjq.accordion({
						collapsible:true,
						autoHeight:false
					});
				},'json');
			}

		};
		//定义全局属性以及方法、数据初始化
		//链接事件绑定
		$('[mapping="content_link"]').live('click',function(){
			//处理url
			var url = $(this).attr('url'),
			hash = '',
			iframe = $(window.parent.document).find('#content_iframe,#mainshow,[name="mainshow"]');//兼容BFS
			if(url.indexOf('#')!== -1){
				hash = url.split('#')[1];
				url = url.split('#')[0];
			}
			iframe.attr('src',common.getRootPath()+'/scf/app/'+url+'?rn='+Math.random()+(hash === ''?'':('#'+hash)));
		});

		exports.initNavbar({});
		//绑定ViewModel
		ko.applyBindings(viewModel);
	});
});
