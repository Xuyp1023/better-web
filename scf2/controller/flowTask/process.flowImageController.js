/*
	流程图
	@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		require("jquery-ui");
		require("l/svgDrawer/js/raphael-min");
		require.async(['l/svgDrawer/js/snaker/snaker.designer'],function(){
			// require("l/svgDrawer/js/snaker/snaker.designer");
			require("l/svgDrawer/js/snaker/snaker.model");
			require("l/svgDrawer/js/snaker/snaker.editors");

			mainApp.controller('process.flowImageController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){


				//返回
				$scope.goBack = function(){
					window.history.back();
				};


				function display(process, state) {
					$('#snakerflow').snakerflow($.extend(true,{
						basePath : "https://static.qiejf.com/better/l/svgDrawer/js/snaker/",
			            /* ctxPath : "${ctx}",
			            businessId : "${businessId}", */
						restore : eval("(" + process + ")"),
						editable : false
						},eval("(" + state + ")")
					));
				}


				/*!入口*/ /*控制器执行入口*/ 
				$scope.$on('$routeChangeSuccess',function(){
					common.resizeIframeListener();

					var info = cache.get("flowImageInfo"),
						orderId = info.orderId;

					var param = "orderId="+orderId;

					$.ajax({
						type:'GET',
						url:BTPATH.FIND_WEB_FLOW_JSON,
						data:param,
						dataType:'json',
						async: false,
						globle:false,
						error: function(){
							if(console) console.log('flowImage:后台数据处理错误！');
							return false;
						},
						success: function(result){
							display(result.data.process, result.data.state);
						}
					});


					/*公共绑定*/
					$scope.$on('ngRepeatFinished',function(){
						common.resizeIframeListener();  
					});
					
				});






			}]);

		});

	};

});