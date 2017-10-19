/*
额度查询
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    require('modal');
    require('date');
    require("upload");

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//扩充公共服务
	comservice.servPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
		/*VM绑定区域*/
		$scope.coreCustList = [];
		$scope.factorList = [];
		$scope.custList = [];
		$scope.creditInfo = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			custNo:'',
			coreCustNo:'',
			factorNo:'',
			GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEregDate:new Date().format('YYYY-MM-DD')
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//额度列表
		$scope.infoList = [];
		//单个额度信息
		$scope.info = {};

		//授信额度信息
		$scope.creditInfo = {};

		//额度变动信息
		$scope.quotaChangeSearch = {
			GTEoccupyDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEoccupyDate:new Date().format('YYYY-MM-DD')
		};
		$scope.quotaChangeListPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		$scope.quotaChangeList = [];

		//开启上传
		$scope.openUpload = function(event,type,typeName,list){
			$scope.uploadConf = {
				//上传触发元素
				event:event.target||event.srcElement,
				//上传附件类型
				type:type,
				//类型名称
				typeName:typeName,
				//存放上传文件
				uploadList:$scope[list]
			};
		};


		//检查机构类型
		/*$scope.checkOrgType = function(role){
		    var promise = http.post(BTPATH.CHECK_ORG_TYPE,{role:role}).success(function(data){
		        if(data.data){
		            $scope.$apply(function(){
		                //检查成功
		                $scope.currRole = role;
		            });
		        }
		    });
		    return promise;
		};*/

		/*事件处理区域*/
		//查询额度列表
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//查询额度变动
		$scope.searchQuotaChangeList = function(){
			$scope.quotaChangeListPage.pageNum = 1;
			$scope.queryQuotaChange(true);
		};

		//获取额度申请列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_ALL_EXTRAQUOTA,$.extend({},$scope.listPage,$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data);
							if(flag){
								$scope.listPage = data.page;
							}
						});
					} 	
			});
		};


		//当前机构变化
		$scope.changeCust = function(){
			//刷新保理公司列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList').success(function(){
				// $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value : '';
				//判断当前机构是不是“核心企业”
				http.post(BTPATH.CHECK_ORG_TYPE,{role:"CORE_USER"}).success(function(data){
					if(data.data){
						$scope.$apply(function(){
							$scope.coreCustList = [];
						});
						$scope.queryList(true);
						$scope.queryCreditInfo();
						return;
					}
					//查询核心企业列表
					commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList').success(function(){
						// $scope.searchData.coreCustNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
						$scope.queryList(true);
						$scope.queryCreditInfo();
					});
				});
			});
		};


		//获取额度详情
		$scope.queryCreditInfo = function(){
			var $mainTable = $('#quota_part');
			loading.addLoading($mainTable,BTServerPath);
			http.post(BTPATH.QUERY_COMP_QUOTA,{custNo:$scope.searchData.custNo})
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						$scope.$apply(function(){
							$scope.creditInfo = data.data;
						});
					} 	
			});
		};

		//获取额度变动列表
		$scope.queryQuotaChange = function(flag,callback){
			//弹出弹幕加载状态
			var $mainTable = $('#detail_box .detail-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.quotaChangeListPage.flag = flag? 1 : 2;
			$scope.info.creditId = $scope.info.id;
			http.post(BTPATH.QUERY_ALL_QUOTA_CHANGE_LIST,$.extend({},$scope.quotaChangeListPage,$scope.quotaChangeSearch,$scope.info))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						$scope.$apply(function(){
							$scope.quotaChangeList = common.cloneArrayDeep(data.data);
							if(flag){
								$scope.quotaChangeListPage = data.page;
							}
						});
						if(callback) callback();
					} 	
			});
		};

		//页面初始化
		$scope.initPage = function(){
			//当前用户列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
				$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
				//带出其他信息
				$scope.changeCust();
				/*//保理公司列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList').success(function(){
					//判断当前机构是不是“核心企业”
					$scope.checkOrgType("CORE_USER").success(function(data){
						if(data.data==="CORE_USER"){
							$scope.$apply(function(){
								$scope.coreCustList = [];
							});
							$scope.queryList(true);
							$scope.queryCreditInfo();
							return;
						}
						//查询核心企业列表
						commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList').success(function(){
							$scope.queryList(true);
							$scope.queryCreditInfo();
						});
					});
				});*/

			});
			
		};

		/*
		 *模板显隐控制区域
		*/

		//打开变动详情
		$scope.detailInfoBox = function(data){
			$scope.info = data;
			$scope.queryQuotaChange(true,function(){
				$scope.openRollModal('detail_box');
			});
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframeListener();  
		});

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

