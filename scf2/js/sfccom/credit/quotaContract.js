/*
授信合同管理
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
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);
	//扩充公共服务
	comservice.servPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){

		//保理合同状态
		$scope.signStatusList = BTDict.BusinDataStatus.toArray("value","name");

		/*VM绑定区域*/
		$scope.searchData = {
			factorNo:'',
			agreeType:9,	//合同类型 3保理合同
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

		//合同列表
		$scope.contractList = [];
		//合同详情
		$scope.contractInfo = {};

		//保理公司列表
		$scope.factorCompList = [];
		//客户列表
		$scope.custList = [];
		//附件列表
		$scope.attachList = [];

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
		//查询额度
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

	

		//查询保理合同列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_FINANCE_CONTRACT_LIST,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
				//关闭加载状态弹幕
				loading.removeLoading($mainTable);
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.contractList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				} 	
			});
		};


		//查询地址
		$scope.findAddress = function(custNo){
			if(!custNo){
				$scope.contractInfo.resrepentAddr = '';
				return;
			}
			http.post(BTPATH.QUERY_BASIC_INFO,{custNo:custNo}).success(function(data){
				$scope.$apply(function(){
					$scope.contractInfo.resrepentAddr = data.data.address;
				});
			});
		};

		//查询联系人
		$scope.findLinkman = function(custNo){
			if(!custNo){
				$scope.contractInfo.resrepentName = '';
				return;
			}
			http.post(BTPATH.QUERY_INFO_LAWYER,{custNo:custNo}).success(function(data){
				$scope.$apply(function(){
					$scope.contractInfo.resrepentName = data.data.name;
				});
			});
		};



		//合同新增
		$scope.addContract = function(target){
			var $target = $(target);
			//设置校验项 | 校验
			validate.validate($('#add_contra_box'),validOption);
			var valid = validate.validate($('#add_contra_box'));
			if(!valid) return;

			//附件
			if($scope.attachList.length===0){
			  tipbar.errorLeftTipbar($target,'请添加相关的合同附件！',3000,999999);
			  return false;
			}

			//附件列表
			$scope.contractInfo.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);
			http.post(BTPATH.ADD_FINANCE_CONTRACT,$scope.contractInfo).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('新增合同成功,若要生效请激活!',{});
			 		$scope.closeRollModal("add_box");
			 		$scope.queryList(true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'新增合同失败,服务器返回:'+data.message,3000,9992);
			 	}
			});
		};



		//合同编辑
		$scope.editContract = function(target){
			var $target = $(target);
			//设置校验项 | 校验
			validate.validate($('#edit_contra_box'),validOption);
			var valid = validate.validate($('#edit_contra_box'));
			if(!valid) return;

			//附件
			if($scope.attachList.length===0){
			  tipbar.errorLeftTipbar($target,'请添加相关的合同附件！',3000,999999);
			  return false;
			}
			//附件列表
			$scope.contractInfo.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);
			http.post(BTPATH.EDIT_FINANCE_CONTRACT,$scope.contractInfo).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('编辑合同成功,若要生效请激活!',{});
			 		$scope.closeRollModal("edit_box");
			 		$scope.queryList(true);
			 	}else{
			 		tipbar.errorTopTipbar($target,'编辑合同失败,服务器返回:'+data.message,3000,9992);
			 	}
			});
		};



		//启用 合同
		$scope.activeContract = function(target){
			var $target = $(target);
			http.post(BTPATH.ACTION_FINANCE_CONTRACT,{appNo:$scope.contractInfo.appNo,signStatus:1})
				 .success(function(data){
				 	if((data!==undefined)&&(data.code === 200)){
				 		tipbar.infoTopTipbar('启用合同成功,合同已生效!',{});
				 		$scope.queryList(true);
				 		$scope.closeRollModal("edit_box");
				 	}else{
				 		tipbar.bubbleTopTipbar($target,'启用失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};


		//禁用 合同
		$scope.disableContract = function(target){
			var $target = $(target);
			http.post(BTPATH.ACTION_FINANCE_CONTRACT,{appNo:$scope.contractInfo.appNo,signStatus:2})
				 .success(function(data){
				 	if((data!==undefined)&&(data.code === 200)){
				 		tipbar.infoTopTipbar('禁用合同成功,合同已失效!',{});
				 		$scope.queryList(true);
				 		$scope.closeRollModal("edit_box");
				 	}else{
				 		tipbar.bubbleTopTipbar($target,'禁用失败,服务器返回:'+data.message,3000,9992);
				 	}
			});
		};


		//客户变化 带出地址和联系人
		$scope.custChange = function(){
			var supplierNo = $scope.contractInfo.supplierNo;
			$scope.findAddress(supplierNo);
			$scope.findLinkman(supplierNo);
		};


		//删除附件项
	    $scope.delUploadItem = function(item,listName){
	    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
	    };


		/*
		 *模板显隐控制区域
		*/
		//	新增合同 box
		$scope.addContractBox = function(){
			$scope.attachList = [];
			//查询客户列表
			commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_ALL_CUST,{factorNo:$scope.searchData.factorNo},$scope,'custList').success(function(data){
				var supplierNo = common.filterArrayFirst($scope.custList);
				$scope.$apply(function(){
					$scope.contractInfo = {
						factorNo:$scope.searchData.factorNo,
						supplierNo:supplierNo
					};
				});
				//带出地址和联系人
				$scope.findAddress(supplierNo);
				$scope.findLinkman(supplierNo);
			});
			$scope.openRollModal('add_box');
		};


		// 维护合同 box
		$scope.editContractBox = function(item){
			//置空 查询附件列表
			$scope.attachList = [];
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:item.batchNo},$scope,'attachList');
			//查询客户列表
			commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_ALL_CUST,{factorNo:item.factorNo},$scope,'custList').success(function(){
				//0 草稿状态 可编辑
				var flag = item.signStatus*1 ===0 ? "edit" : "read";
				$scope.$apply(function(){
					$scope.contractInfo = $.extend(item,{action:flag});
				});
			});
			$scope.openRollModal('edit_box');
		};



		//初始化页面
		commonService.initPage(function(){
		    //当前操作员下机构（保理商列表）
		    commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
			      $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
			      //查询授信合同列表
			      $scope.queryList(true);
		    });
		});



		//校验配置
		var validOption = {
		      elements: [{
		          name: 'contractInfo.factorNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.agreeName',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.agreeNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.balance',
		          rules: [{name: 'required'},{name: 'float'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.supplierNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.resrepentName',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.resrepentAddr',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.agreeStartDate',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'contractInfo.agreeEndDate',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      }],
		      errorPlacement: function(error, element) {
		          var label = element.parents('td').prev().text().substr(0);
		          tipbar.errorLeftTipbar(element,label+error,0,99999);
		      }
		};
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

