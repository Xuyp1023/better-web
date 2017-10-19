/*
变更审核查询
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

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination']);

	//扩充公共指令库 | 过滤器 | 公共服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
  	comservice.servPlus(mainApp);

    //控制器区域
    mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
    	/*VM绑定区域*/

    	//变更项目类型 对应字典类型 : ChangeItem
    	$scope.infoTypes = ['basic','lawyer',undefined,undefined,'license'];
    	$scope.listTypes = [undefined,undefined,'holder','manager',undefined,'contactor','account'];
    	// $scope.infoTypes.set('0','basic');
    	// $scope.infoTypes.set('1','lawyer');
    	// $scope.infoTypes.set('2','股东信息');
    	// $scope.infoTypes.set('3','高管信息');
    	// $scope.infoTypes.set('4','license');
    	// $scope.infoTypes.set('5','联系人信息');
    	// $scope.infoTypes.set('6','银行账户');

	    //查询条件
	    $scope.searchData = {
	    	LIKEcustName: '',
	    	GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
	    	LTEregDate :new Date().format('YYYY-MM-DD')
	    };
	    //分页数据
	    $scope.listPage = {
	    	pageNum: 1,
	    	pageSize: 10,
	    	pages: 1,
	    	total: 1
	    };

	    //变更列表
	    $scope.changeList = [];
	    //变更申请 是否待审核
	    $scope.changeWaitAudit = false;

	    /*公司基本信息*/
	    $scope.basicInfo = {};
	    $scope.basicUploadList_bef = [];
	    $scope.basicUploadList_now = [];

	    /*法人相关信息*/
	    $scope.lawyerInfo = {};
	    $scope.lawyerUploadList_bef = [];
	    $scope.lawyerUploadList_now = [];

	    /*营业执照相关信息*/
	    $scope.licenseInfo = {};
	    $scope.licenseUploadList_bef = [];
			$scope.licenseUploadList_now = [];
			
			//页面临时变量
			$scope.pageInfo = {};

	     //------------------------------------ 基础配置-操作( 公司|法人|营业执照 ) --------------------------------------

	    /* 配置 */
	    var _infoConfig = {
	    	basic:{
	    		name:'基本信息',
	    		box_id:'basic_change_audite_box',	//模板包裹ID
	    		info_path:BTPATH.FIND_AUDIT_DETAIL_BASIC,	//获取单项变更详情
	    		info_name:'basicInfo',	//基础信息VM名称
	    		before_upload_list:'basicUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'basicUploadList_now'	//变更前附件列表 VM名称
	    	},
	    	lawyer:{
	    		name:'企业法人',
	    		box_id:'lawyer_change_audite_box',//模板包裹ID
	    		info_path:BTPATH.FIND_AUDIT_DETAIL_LAWYER,	//获取单项变更详情
	    		info_name:'lawyerInfo',	//基础信息VM名称
	    		before_upload_list:'lawyerUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'lawyerUploadList_now'	//变更前附件列表 VM名称
	    	},
	    	license:{
	    		name:'营业执照',
	    		box_id:'license_change_audite_box',//模板包裹ID
	    		info_path:BTPATH.FIND_AUDIT_DETAIL_LICENCE,	//获取单项变更详情
	    		info_name:'licenseInfo',	//基础信息VM名称
	    		before_upload_list:'licenseUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'licenseUploadList_now'	//变更前附件列表 VM名称
	    	}
	    };


	    /*事件处理区域*/
	    //查询
	    $scope.searchList = function(){
	    	$scope.queryChangeList(true);
	    };

	    //获取变更审核列表 
	    $scope.queryChangeList = function(flag){
	    	$scope.listPage.flag = flag? 1 : 2;
	    	//弹出弹幕加载状态
	    	loading.addLoading($('#search_info table'),common.getRootPath());
	    	http.post(BTPATH.QUERY_CHANGE_APPLY_LIST,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
	    		//关闭加载状态弹幕
	    		loading.removeLoading($('#search_info table'));
	    		if(common.isCurrentData(data)){
	    			$scope.$apply(function(){
	    				$scope.changeList = common.cloneArrayDeep(data.data);
	    				if(flag){
	    					$scope.listPage = data.page;
	    				}
	    			});
	    		}
	    	});
	    };


	    // 审核 通过 
	    $scope.auditChangePass = function(target,flag){
	    	var config = _infoConfig[flag],
	    		id = $scope[config.info_name].changeApply.id;
	    	http.post(BTPATH.AUDIT_CHANGE_APPLY_PASS,{"id":id,"reason":$scope.pageInfo.reason}).success(function(data){
	    	 	if(data&&(data.code === 200)){
	    	 		tipbar.infoTopTipbar('审核通过!',{});
	    	 		//关闭弹框
	    	 		$scope.closeRollModal(config.box_id);
	    	 		$scope.queryChangeList(false);
	    	 	}else{
	    	 		tipbar.errorTopTipbar($(target),'审核未能通过,服务器返回:'+data.message,3000,9999);
	    	 	}
	    	});
	    };


	    // 审核 驳回 
	    $scope.auditChangeReject = function(target,flag){
	    	var config = _infoConfig[flag],
	    		id = $scope[config.info_name].changeApply.id;
	    	http.post(BTPATH.AUDIT_CHANGE_APPLY_REJECT,{"id":id,"reason":$scope.pageInfo.reason}).success(function(data){
	    	 	if(data&&(data.code === 200)){
	    	 		tipbar.infoTopTipbar('审核驳回!',{});
	    	 		//关闭弹框
	    	 		$scope.closeRollModal(config.box_id);
	    	 		$scope.queryChangeList(false);
	    	 	}else{
	    	 		tipbar.errorTopTipbar($(target),'审核驳回失败,服务器返回:'+data.message,3000,9999);
	    	 	}
	    	});
	    };


	    //查询单项变更详情 
		$scope.queryChangeInfo = function(item,flag){
			var config = _infoConfig[flag];
			http.post(config.info_path ,{"id":item.id}).success(function(data){
	            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	              $scope.$apply(function(){
	              	  $scope[config.info_name] = data.data;
	              });
	            }   
	        }).then(function(){
	        	//附件变更列表
	        	$scope.queryAttachmentList(flag);
	        });
		};



	    //查询附件列表
	    $scope.queryAttachmentList = function(flag){
	    	var config = _infoConfig[flag];
	    	//没有附件，不需要查询
	    	if(!config.before_upload_list){
	    		return;
	    	}
	    	//变更前附件批次
	    	var batchNo = $scope[config.info_name].befData.batchNo;
	    	if(batchNo){
	    		http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
	    			if(common.isCurrentData(data)){
	    				$scope.$apply(function(){
	    					$scope[config.before_upload_list] = common.cloneArrayDeep(data.data);
	    				});
	    			} 	
	    		});
	    	}
	    	//变更后附件批次
	    	batchNo = $scope[config.info_name].nowData.batchNo;
	    	if(batchNo){
	    		http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
	    			if(common.isCurrentData(data)){
	    				$scope.$apply(function(){
	    					$scope[config.now_upload_list] = common.cloneArrayDeep(data.data);
	    				});
	    			} 	
	    		});
	    	}
	    };





	    //------------------------------------ 基础配置-操作( 股东|高管|联系人|银行账户 ) --------------------------------------

	    /*高管相关信息*/
	    $scope.managerList = [];	//列表
	    $scope.managerInfo = {};	//详情
	    $scope.managerUploadList_bef = [];	//变更前附件列表
		$scope.managerUploadList_now = [];	//变更后附件列表

		/*联系人相关信息*/
	    $scope.contactorList = [];	//列表
	    $scope.contactorInfo = {};	//详情
	    $scope.contactorUploadList_bef = [];	//变更前附件列表
		$scope.contactorUploadList_now = [];	//变更后附件列表

		/*股东相关信息*/
	    $scope.holderList = [];	//列表
	    $scope.holderInfo = {};	//详情
	    $scope.holderUploadList_bef = [];	//变更前附件列表
		$scope.holderUploadList_now = [];	//变更后附件列表

		/*银行账户相关信息*/
	    $scope.accountList = [];	//列表
	    $scope.accountInfo = {};	//详情
	    $scope.accountUploadList_bef = [];	//变更前附件列表
		$scope.accountUploadList_now = [];	//变更后附件列表


	    /* 配置 */
	    var _listConfig = {
	    	manager:{
	    		name:'高管信息',
	    		list_box_id:'manager_audite_list_box',	//模板包裹ID
	    		info_box_id:'manager_audite_info_box',
	    		list_path:BTPATH.QUERY_MANAGE_CHANGE_RECORD_LIST,
	    		info_path:BTPATH.QUERY_MANAGE_CHANGE_RECORD_INFO,	//获取单项变更详情
	    		list_name:'managerList',
	    		info_name:'managerInfo',	//基础信息VM名称
	    		before_upload_list:'managerUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'managerUploadList_now'	//变更前附件列表 VM名称
	    	},
	    	contactor:{
	    		name:'联系人信息',
	    		list_box_id:'contactor_audite_list_box',	//模板包裹ID
	    		info_box_id:'contactor_audite_info_box',
	    		list_path:BTPATH.QUERY_CONTACTOR_CHANGE_RECORD_LIST,
	    		info_path:BTPATH.QUERY_CONTACTOR_CHANGE_RECORD_INFO,	//获取单项变更详情
	    		list_name:'contactorList',
	    		info_name:'contactorInfo',	//基础信息VM名称
	    		before_upload_list:'contactorUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'contactorUploadList_now'	//变更前附件列表 VM名称
	    	},
	    	holder:{
	    		name:'股东信息',
	    		list_box_id:'holder_audite_list_box',	//模板包裹ID
	    		info_box_id:'holder_audite_info_box',
	    		list_path:BTPATH.QUERY_SHAREHOLDER_CHANGE_RECORD_LIST,
	    		info_path:BTPATH.QUERY_SHAREHOLDER_CHANGE_RECORD_INFO,	//获取单项变更详情
	    		list_name:'holderList',
	    		info_name:'holderInfo',	//基础信息VM名称
	    		before_upload_list:'holderUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'holderUploadList_now'	//变更前附件列表 VM名称
	    	},
	    	account:{
	    		name:'银行账户信息',
	    		list_box_id:'account_audite_list_box',	//模板包裹ID
	    		info_box_id:'account_audite_info_box',
	    		list_path:BTPATH.QUERY_BANKACCOUNT_CHANGE_RECORD_LIST,
	    		info_path:BTPATH.QUERY_BANKACCOUNT_CHANGE_RECORD_INFO,	//获取单项变更详情
	    		list_name:'accountList',
	    		info_name:'accountInfo',	//基础信息VM名称
	    		before_upload_list:'accountUploadList_bef',	//变更前附件列表 VM名称
	    		now_upload_list:'accountUploadList_now'	//变更前附件列表 VM名称
	    	}
	    };


	    //查询变更记录列表
	    $scope.queryChangeRecordList = function(applyId,flag){
	    	var config = _listConfig[flag];
	    	http.post(config.list_path,{applyId:applyId}).success(function(data){
	    		if(common.isCurrentData(data)){
	    			$scope.$apply(function(){
	    				$scope[config.list_name] = common.cloneArrayDeep(data.data);
	    			});
	    		} 	
	    	});
	    };


	    // 审核 通过 
	    $scope.auditChangeRecordPass = function(target,flag){
	    	var config = _listConfig[flag],
	    		id = $scope[config.list_name][0].parentId;
	    	http.post(BTPATH.AUDIT_CHANGE_APPLY_PASS,{"id":id,"reason":$scope.pageInfo.reason}).success(function(data){
	    	 	if(data&&(data.code === 200)){
	    	 		tipbar.infoTopTipbar('审核通过!',{});
	    	 		//关闭弹框
	    	 		$scope.closeRollModal(config.list_box_id);
	    	 		$scope.queryChangeList(false);
	    	 	}else{
	    	 		tipbar.errorTopTipbar($(target),'审核未能通过,服务器返回:'+data.message,3000,9999);
	    	 	}
	    	});
	    };


	    // 审核 驳回 
	    $scope.auditChangeRecordReject = function(target,flag){
	    	var config = _listConfig[flag],
	    		id = $scope[config.list_name][0].parentId;
	    	http.post(BTPATH.AUDIT_CHANGE_APPLY_REJECT,{"id":id,"reason":$scope.pageInfo.reason}).success(function(data){
	    	 	if(data&&(data.code === 200)){
	    	 		tipbar.infoTopTipbar('审核驳回!',{});
	    	 		//关闭弹框
	    	 		$scope.closeRollModal(config.list_box_id);
	    	 		$scope.queryChangeList(false);
	    	 	}else{
	    	 		tipbar.errorTopTipbar($(target),'审核驳回失败,服务器返回:'+data.message,3000,9999);
	    	 	}
	    	});
	    };


	    //查询变更记录详情
	    $scope.queryChangeRecordInfo = function(data,flag){
	    	var config = _listConfig[flag];
	    	var promise = http.post(config.info_path,{applyId:data.parentId,tmpId:data.id}).success(function(data){
	    		if(common.isCurrentData(data)){
	    			$scope.$apply(function(){
	    				$scope[config.info_name] = data.data;
	    			});
	    		}
	    	});
	    	return promise;
	    };

	    //查询变更前后附件列表
	    $scope.queryChangeRecordAttachList = function(flag){
	    	var config = _listConfig[flag];
	    	//没有附件，不需要查询
	    	if(!config.before_upload_list){
	    		return;
	    	}
	    	//变更前附件批次
	    	var batchNo = $scope[config.info_name].befData.batchNo;
	    	if(batchNo){
	    		http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
	    			if(common.isCurrentData(data)){
	    				$scope.$apply(function(){
	    					$scope[config.before_upload_list] = common.cloneArrayDeep(data.data);
	    				});
	    			} 	
	    		});
	    	}
	    	//变更后附件批次
	    	batchNo = $scope[config.info_name].nowData.batchNo;
	    	if(batchNo){
	    		http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
	    			if(common.isCurrentData(data)){
	    				$scope.$apply(function(){
	    					$scope[config.now_upload_list] = common.cloneArrayDeep(data.data);
	    				});
	    			} 	
	    		});
	    	}
	    };



	    /*
		 *-----------------模板显隐控制区域--------------------------------------
		*/

		//打开变更审核编辑
		$scope.openChangeAudite = function(item){
			// 0:待审核 审核/查看详情
			$scope.changeWaitAudit = item.businStatus*1===0 ? true : false;
			//所有类型
			var allTypes = $.extend($scope.infoTypes,$scope.listTypes);
			//审核类型
			var flag = allTypes[item.changeItem],
				config = _infoConfig[flag];
			//公司|法人|营业执照
			if(config){
				//查询变更详情
				$scope.queryChangeInfo(item,flag);
				$scope.openRollModal(config.box_id);
			}
			//高管|股东|联系人|银行账户
			else{
				config = _listConfig[flag];
				//查询变更记录列表
				$scope.queryChangeRecordList(item.id,flag);
				$scope.openRollModal(config.list_box_id);
			}
		};


		//打开变更审核详情
		$scope.openAuditDetail = function(data,flag){
			var config = _listConfig[flag];
			//查询详情
			$scope.queryChangeRecordInfo(data,flag).success(function(){
				//置空附件列表
				$scope[config.before_upload_list] = [];
				$scope[config.now_upload_list] = [];
				//查询附件列表
				$scope.queryChangeRecordAttachList(flag);
			});
			$scope.openRollModal(config.info_box_id);
		};



	    //页面初始化
	    commonService.initPage(function(){
	    	//获取变更审核列表 
	    	$scope.queryChangeList(true);
	    });


	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

