/*
资料审核查询
作者:herb
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
	var mainApp = angular.module('mainApp',['pagination','modal','date','upload']);

	//扩充公共指令库|过滤器|服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
	comservice.servPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','commonService','http',function($scope,commonService,http){

		/*VM绑定区域*/
		//银行
		$scope.bankList = BTDict.SaleBankCode.toArray('value','name');
		//经办人证件类型
		$scope.operIdenttypeList = BTDict.PersonIdentType.toArray('value','name');
		//法人证件类型
		$scope.lawIdentTypeList = BTDict.PersonIdentType.toArray('value','name');
		//省列表
		$scope.provinceList = BTDict.Provinces.toArray('value','name');
		//市列表
		$scope.cityList = [];

		$scope.$watch('info.provinceNo',function(newNo){
			if (newNo==='') {
			    $scope.cityList = [];
			    $scope.info.bankCityno = '';
			} else if (newNo&& (newNo.length > 0)) {
			    $scope.cityList = BTDict.Provinces.getItem(newNo).citys.toArray('value', 'name');
			    $scope.info.bankCityno = $scope.cityList.length>0?$scope.cityList[0].value:'';
			}
		});

		/*$scope.searchData = {
			custNo : '',
			GTEtradeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEtradeDate :new Date().format('YYYY-MM-DD')
		};*/
		
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
	
		/*事件处理区域*/
		//查询资料审核
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//开户待审核列表
		$scope.accountList = [];
		//开户详情
		$scope.info = {};
		//附件列表
		$scope.attachList = [];
		//审批意见
		$scope.auditView = '';

		//子附件列表
		$scope.childUploadList = [];


		//开启上传
	    $scope.openUploadCopy = function(event,type,list){
	    	var typeName = BTDict["CustOpenAccountFile"] ? BTDict["CustOpenAccountFile"].get(type):'----';
	    	$scope.uploadConf = $.extend({},{
	    		//上传触发元素
	    		event:event.target||event.srcElement,
	    		//上传附件类型
	    		type:type,
	    		//类型名称
	    		typeName:typeName,
	    		//存放上传文件
	    		uploadList:$scope[list],
	    		//图标路径
	    		imgPath:'../../../img/operator.png',
	    		//回调
	    		callback:callback(list,type)
	    	});
	    };

	    //上传回调 替换元素
		function callback(list,type){
			return function(){
				//如果未上传或上传失败，返回
				if(ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type).length<=1) return;
				//删除新添加的，并将其值赋给原有的
				var addItem = $scope[list].pop();
				$scope[list] = ArrayPlus($scope[list]).replaceChild('fileInfoType',type,addItem);
			};
		}

	    //删除附件项
	    $scope.delUploadItemCopy = function(item,listName){
	    	for (var i = 0; i < $scope[listName].length; i++) {
	    		var tempUpload = $scope[listName][i];
	    		if(tempUpload.fileInfoType === item.fileInfoType){
	    			$scope[listName][i] = {
	    				fileInfoType:item.fileInfoType,
	    				name:item.name
	    			};
	    		}
	    	}
	    };


		//获取开户待审核列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			$.post(BTPATH.QUERY_OPENACCOUNT_AUDIT_LIST,$scope.listPage,function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.accountList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			},'json');
		};



		//开户信息读取
		$scope.findAccountInfo = function(id){
			http.post(BTPATH.FIND_OPENACCOUNT_INFO,{id:id}).success(function(data){
				if(common.isCurrentData(data)){
					var bankCityno = data.data.bankCityno;
					if(bankCityno&&(bankCityno.length>1)){
						var provinceNo = bankCityno.substr(0,2)+'0000';
						data.data.provinceNo = provinceNo;
						//设置字典（城市列表）
						var tempDic = BTDict.Provinces.getItem(provinceNo);
						if(tempDic) BTDict.CitysDict = tempDic.citys;
					}
					$scope.$apply(function(){
						$scope.info= data.data;
					});
					//查询附件列表
					// commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'attachList');
					var tmpUploadList = BTDict.CustOpenAccountFile.toArray('fileInfoType','name');
					http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo}).success(function(data){
						if(common.isCurrentData(data)){
							var tempServerUploadList = data.data;
							$scope.$apply(function(){
								$scope.childUploadList = ArrayPlus(tmpUploadList).extendObjectArray(tempServerUploadList,'fileInfoType');
							});
						}else{
							$scope.$apply(function(){
								$scope.childUploadList = common.cloneArrayDeep(tmpUploadList);
							});
						}
					});

				} 	
			});
		};


		//  保存开户信息
		$scope.saveAccountInfo = function(target){
			$scope.info.fileList = ArrayPlus($scope.childUploadList).extractChildArray('id',true);
			http.post(BTPATH.SAVE_OPENACCOUNT_TEMP,$scope.info).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('保存成功!',{});
			 	}else{
			 		tipbar.errorTopTipbar($(target),'保存失败,服务器返回:'+data.message,3000,9999);
			 	}
			});
		};

		// 审核 通过
		$scope.auditAccountPass = function(target){
			//先进行保存
			var id = $scope.info.id;
			//$scope.saveAccountInfo(target);
			http.post(BTPATH.SAVE_OPENACCOUNT_PASS,{"id":id,"auditOpinion":$scope.auditView}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('审核通过!',{});
			 		//关闭弹框
			 		$scope.closeRollModal("audit_detail_box");
			 		$scope.queryList(false);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'审核未能通过,服务器返回:'+data.message,3000,9999);
			 	}
			});
		};


		// 审核 驳回 
		$scope.auditAccountReject = function(target){
			var id = $scope.info.id;
			http.post(BTPATH.SAVE_OPENACCOUNT_REFUSE,{"id":id,"auditOpinion":$scope.auditView}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('审核驳回!',{});
			 		//关闭弹框
			 		$scope.closeRollModal("audit_detail_box");
			 		$scope.queryList(false);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'审核驳回失败,服务器返回:'+data.message,3000,9999);
			 	}
			});
		};



		//------------------------模板显隐控制区域---------------------------

		//审核 box
		$scope.openDetailBox = function(item){
			$scope.findAccountInfo(item.id);
			$scope.openRollModal("audit_detail_box");
		};

		
		//模块执行入口
		commonService.initPage(function(){
			//查询待审核列表
			$scope.queryList();
		});


	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

