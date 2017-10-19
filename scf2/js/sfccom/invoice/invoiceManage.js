/*
发票查询
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
		$scope.corpVocateType = BTDict.InvestCorpVocate.toArray('value','name');
		$scope.searchData = {
			factorNo:'',
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//发票列表
		$scope.infoList = [];

		$scope.info = {};
		//发票详情列表
		$scope.infoMoreList = [];

		$scope.infoMore = {};


		//上传文件列表
		$scope.uploadList = [];

		/*//单个发票信息
		$scope.info = {
			custType:$scope.typeList[1].value
		};*/


		$scope.$watch('infoMore.unit',function(newObj){
			$scope.infoMore.balance = Number(Number(!isNaN($scope.infoMore.unit)?$scope.infoMore.unit:0)*Number(!isNaN($scope.infoMore.amount)?$scope.infoMore.amount:0)).toFixed(2);
		});

		$scope.$watch('infoMore.amount',function(newObj){
			$scope.infoMore.balance = Number(Number(!isNaN($scope.infoMore.unit)?$scope.infoMore.unit:0)*Number(!isNaN($scope.infoMore.amount)?$scope.infoMore.amount:0)).toFixed(2);
		});


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


		/*事件处理区域*/
		//查询发票
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取发票申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_UNCOMPLETED_INVOICE,$.extend({},$scope.listPage,$scope.searchData))
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

		$scope.changeQueryCust = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList').success(function(){
				$scope.$apply(function(){
					$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
				});
			});
		};


		//修改发票
		$scope.editInfo = function(target){
			var $target = $(target);
			$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
			$scope.info.invoiceItemIds = ArrayPlus($scope.infoMoreList).extractChildArray('id',true);
			http.post(BTPATH.EDIT_INFO_INVOICE,$scope.info)
			.success(function(data){
				if(data&&(data.code === 200)){
					//tipbar.errorTopTipbar($target,'修改发票成功!',3000,9992);
					tipbar.infoTopTipbar('修改发票成功!', {});
					$scope.closeRollModal('edit_box');
					$scope.queryList(true);
				}else{
					tipbar.errorTopTipbar($target,'修改发票失败,服务器返回:'+data.message,3000,9992);
				}
			});
		};

		//本地删除发票详情
		$scope.delinfoMore = function(item){
			$scope.infoMoreList = ArrayPlus($scope.infoMoreList).delChild('id',item.id);
		};

		//新增发票详情
		$scope.addInfoMore = function(target){
			var $target = $(target);
			http.post(BTPATH.ADD_ONE_INVOICE_MORE,$scope.infoMore).success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.$apply(function(){
				 			$scope.infoMoreList.push(data.data);
				 		})
				 		tipbar.infoTopTipbar('新增发票详情成功!',{});
				 		$scope.closeRollModal('infoMore_box');
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增发票详情失败,服务器返回:'+data.message,3000,7050);
				 	}
				 });
		};


		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
				$scope.searchData.factorNo = common.filterArrayFirst($scope.factorList);
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList').success(function(){
					$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
					$scope.queryList(true);
				})
			});
		};

		//删除附件项
	    $scope.delUploadItem = function(item,listName){
	    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
	    };

		/*
		 *模板显隐控制区域
		 */

		//打开发票编辑
		$scope.editInfoBox = function(data){
			$scope.info = $.extend(true, {},data,{modiType:'edit'});
			if(!$scope.info.corpVocate) {
				$scope.info.corpVocate = common.filterArrayFirst($scope.corpVocateType, 'name');
			}
			$scope.infoMoreList = $scope.info.invoiceItemList;
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
					$scope.$$emiterBoxEnabled();
					$scope.openRollModal('edit_box');
			});
		};

		//打开发票详情
		$scope.detailInfoBox = function(data){
			$scope.info = $.extend(true, {},data,{modiType:'read'});
			$scope.infoMoreList = $scope.info.invoiceItemList;
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
					$scope.$$emiterBoxEnabled();
					$scope.openRollModal('edit_box');
			});
		};

		//添加发票详情
		$scope.infoMoreImBox = function(){
			$scope.openRollModal('infoMore_box');
		};


		//日期处理
		$scope.dateEmitter = {
			changeDateInfo : function(event){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

