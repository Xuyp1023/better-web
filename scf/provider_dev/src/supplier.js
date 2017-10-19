/*
供应商管理
作者：hrb
*/

define(function(require,exports,module){
	require.async(['dicTool','bootstrap','datePicker'],function(){
	require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
    var comfilter = require("./libs/commonfilter");
    var BTPATH = require("./libs/commonpath");
    var pages = require("./libs/pages");

    require('angular');

    //定义模块
    var mainApp = angular.module('mainApp',['pagination']);
	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope',function($scope){

		//分页数据
		$scope.tradeListPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		//搜索所需信息
		$scope.searchData = {
			supplier:'',
			custNo:''
		};

		//供应商列表
		$scope.supplyList = [];
		
		//查看的供应商详情
		$scope.supplyDetail = {};	

		//分页 监听
		$scope.$watch('tradeListPage.pageNum', function(newValue,oldValue){
			if(newValue!==oldValue){
				$scope.reFreshSupplyList(false);
			}
		});

		//刷新供应商列表数据	
		$scope.reFreshSupplyList = function(flag){
			$scope.tradeListPage.flag = flag ? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.SUPPLY_LIST_PATH,$.extend({},$scope.tradeListPage,$scope.searchData),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.supplyList  = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.tradeListPage = data.page;
						}
					});
				}
			},'json');
		};

		//获取核心企业账户列表 测试/正式路径:/ScfRequest/queryCustomer 
		$scope.queryCustList = function(callback){
			$.post(BTPATH.CUST_PATH,{},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.custList = data.data;
						$scope.searchData.custNo = data.data[0].value;
					});
					if(callback) callback();
				}
			},'json');
		};

		//账号切换
		$scope.changeCust = function(){
			$scope.tradeListPage.pageNum = 1;
			$scope.reFreshSupplyList(true);
		};


		//切换面板
        $scope.switchTab = function(event) {
            var $target = $(event.srcElement ? event.srcElement : event.target);
			$target.tab('show');
        };


		//打开供应商详情面板
		$scope.showDetailPanel = function(data){
			$scope.supplyDetail = data;
			$("#supply_detail_show").slideDown('fast');
			//先展示基本信息
			$("[href='#basic_info_tab']").tab("show");
		};


		//关闭详细面板
		$scope.closeDetailPanel = function(){
			$scope.supplyDetail = {};
			$("#supply_detail_show").slideUp();
		};


		/*外部事件绑定*/
		window.dateEmitter = {
			changeDateInfo:function(){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};

		/*公共绑定*/
 		$scope.$on('ngRepeatFinished',function(){
  			common.resizeIframe();  
    	});

    	$('#nav_tabs a').on('shown',function(){
    		common.resizeIframe();
    	});


		//初始化供应商列表
		$scope.queryCustList(function(){
			$scope.reFreshSupplyList(true);
		});


	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);


});
});
});