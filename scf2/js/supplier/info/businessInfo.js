/*
	经营信息
*/

define(function(require,module,exports){

	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var dialog = require('dialog');
    var comdirect = require("direct");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var upload = require("upload");
    var date = require('date');
    require('modal');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','upload','date']);
	//扩充公共指令库|过滤器|服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
	comservice.servPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','commonService','http','cache',function($scope,commonService,http,cache){

		/*基础数据*/
		var hash = location.href.split('#')[1];
		var custInfo = cache.get("custInfo");
		cache.put("custInfo",{});
		//从机构列表过来
		if(custInfo && custInfo.origin+''==='agencyList'){
			$scope.custNo = custInfo.custNo;	//客户编号
			$scope.onlyLook = false;			//只看
		}
		//从其他页面跳转而来，查看详情
		else{
			$scope.custNo = hash.indexOf("_")==-1 ? hash : hash.split("_")[0];	//客户编号
			$scope.origin = hash.indexOf("_")==-1 ? '' : hash.split("_")[1];	//跳转来源
			$scope.onlyLook = true;				//只看
		}
		
		//返回跳转页面配置
		var _originConfig = {
			whiteListAccept:{
				name:"返回受理页面",
				path:window.BTServerPath + "/scf2/home.html#/customerRelation/openFactorAccept/"+$scope.custNo
			},
			whiteListAudit:{
				name:"返回审核页面",
				path:window.BTServerPath + "/scf2/home.html#/customerRelation/openFactorAudit/"+$scope.custNo
			},
			qiefactorDetail:{
				name:"返回详情页面",
				path:window.BTServerPath + "/scf2/home.html#/customerRelation/qiefactorDetail/"+$scope.custNo
			}
		};
		//返回跳转页面信息
		$scope.originInfo = $scope.origin ? _originConfig[$scope.origin]:{};

		//返回跳转页面
		$scope.goBack = function(){
			// window.location.href = $scope.originInfo.path;
			window.location.replace($scope.originInfo.path);
		};

		
		/*字典数据*/
		$scope.reportTypes = BTDict.ReportType.toArray("value","name");			//报表类型
		$scope.taxInfoTypes = BTDict.TaxInfoType.toArray("value","name");		//纳税信息类型
		$scope.guaranteeTypes = BTDict.GuaranteeType.toArray("value","name");	//担保方式
		$scope.cooperationTypes = BTDict.CooperationType.toArray("value","name");	//合作方式
		$scope.settlementTypes = BTDict.SettlementType.toArray("value","name");		//结算方式
		$scope.downLoadUrls = BTDict.BusinessInfoDownload.toArray("value","name");	//模板下载地址

		/*公用方法*/
		//初始分页数据
		function initPageConf(){
			return {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};
		}

		//财务信息
		$scope.financeList = [];
		$scope.financePage = initPageConf();
		$scope.financeAttach = [];
		$scope.financeInfo = {};

		//纳税信息
		$scope.taxList = [];
		$scope.taxPage = initPageConf();
		$scope.taxAttach = [];
		$scope.taxInfo = {};

		//融资信息
		$scope.financingList = [];
		$scope.financingPage = initPageConf();
		$scope.financingAttach = [];
		$scope.financingInfo = {};

		//合作企业
		$scope.cooperationList = [];
		$scope.cooperationPage = initPageConf();
		$scope.cooperationAttach = [];
		$scope.cooperationInfo = {};

		//贸易记录
		$scope.tradeRecordList = [];
		$scope.tradeRecordPage = initPageConf();
		$scope.tradeRecordAttach = [];
		$scope.tradeRecordInfo = {};

		//银行流水
		$scope.bankFlowList = [];
		$scope.bankFlowPage = initPageConf();
		$scope.bankFlowAttach = [];
		$scope.bankFlowInfo = {};

		//校验提示方法
		var errorPlacement = function(error, element) {
	          var label = element.parents('td').prev().text().substr(0);
	          tipbar.errorLeftTipbar(element,label+error,0,99999);
	    };

		//校验配置	财务信息
		var validOption_Finance = {
		      elements: [{
		          name: 'financeInfo.reportName',rules: [{name: 'required'}],events: ['blur']
		      },{
		          name: 'financeInfo.reportType',rules: [{name: 'required'}],events: ['blur']
		      }],
		      errorPlacement: errorPlacement
		};

		//校验配置	纳税信息
		var validOption_Tax = {
		      elements: [{
		          name: 'taxInfo.taxType',rules: [{name: 'required'}],events: ['blur']
		      }],
		      errorPlacement: errorPlacement
		};

		//校验配置	融资情况
		var validOption_Financing = {
		      elements: [{
		          name: 'financingInfo.creditLimit',rules: [{name: 'required'},{name: 'float'}],events: ['blur']
		      },{
		          name: 'financingInfo.balance',rules: [{name: 'required'},{name: 'float'}],events: ['blur']
		      },{
		          name: 'financingInfo.guaranteeType',rules: [{name: 'required'}],events: ['blur']
		      },{
		          name: 'financingInfo.financingOrg',rules: [{name: 'required'}],events: ['blur']
		      },{
		          name: 'financingInfo.expireDate',rules: [{name: 'required'}],events: ['blur']
		      }],
		      errorPlacement: errorPlacement
		};

		//校验配置	合作企业
		var validOption_Cooperation = {
		      elements: [{
		          name: 'cooperationInfo.corpName',rules: [{name: 'required'}],events: ['blur']
		      },{
		          name: 'cooperationInfo.coopType',rules: [{name: 'required'}],events: ['blur']
		      },{
		          name: 'cooperationInfo.payType',rules: [{name: 'required'}],events: ['blur']
		      }],
		      errorPlacement: errorPlacement
		};


		//----------------------- 配置 -----------------------------
		var _infoConfig = {
			finance:{
				name:'财务信息',
				list_path:BTPATH.QUERY_OPERATE_FINANCE_LIST,	//获取列表
				add_path:BTPATH.ADD_OPERATE_FINANCE_INFO,		//新增
				delete_path:BTPATH.DELETE_OPERATE_FINANCE_INFO,	//删除
				add_box_id:'finance_add_box',
				list_name:'financeList',	
				page_name:'financePage',
				upload_list:'financeAttach',
				info_name:'financeInfo',
				valid_config:validOption_Finance,				//校验配置
				upload_required:true							//必须上传附件
			},
			tax:{
				name:'纳税信息',
				list_path:BTPATH.QUERY_OPERATE_TAX_LIST,	//获取列表
				add_path:BTPATH.ADD_OPERATE_TAX_INFO,		//新增
				delete_path:BTPATH.DELETE_OPERATE_TAX_INFO,	//删除
				add_box_id:'tax_add_box',
				list_name:'taxList',	
				page_name:'taxPage',
				upload_list:'taxAttach',
				info_name:'taxInfo',
				valid_config:validOption_Tax,
				upload_required:true
			},
			financing:{
				name:'融资情况',
				list_path:BTPATH.QUERY_OPERATE_FINANCING_LIST,	//获取列表
				add_path:BTPATH.ADD_OPERATE_FINANCING_INFO,		//新增
				delete_path:BTPATH.DELETE_OPERATE_FINANCING_INFO,	//删除
				edit_path:BTPATH.UPDATE_OPERATE_FINANCING_INFO,	//修改
				add_box_id:'financing_add_box',
				edit_box_id:'financing_edit_box',
				list_name:'financingList',	
				page_name:'financingPage',
				upload_list:'financingAttach',
				info_name:'financingInfo',
				valid_config:validOption_Financing
			},
			cooperation:{
				name:'合作企业',
				list_path:BTPATH.QUERY_OPERATE_COOPERATION_LIST,	//获取列表
				add_path:BTPATH.ADD_OPERATE_COOPERATION_INFO,		//新增
				delete_path:BTPATH.DELETE_OPERATE_COOPERATION_INFO,	//删除
				edit_path:BTPATH.UPDATE_OPERATE_COOPERATION_INFO,	//修改
				add_box_id:'cooperation_add_box',
				edit_box_id:'cooperation_edit_box',
				list_name:'cooperationList',	
				page_name:'cooperationPage',
				upload_list:'cooperationAttach',
				info_name:'cooperationInfo',
				valid_config:validOption_Cooperation
			},
			tradeRecord:{
				name:'贸易记录',
				list_path:BTPATH.QUERY_OPERATE_TRADERECORD_LIST,	//获取列表
				add_path:BTPATH.ADD_OPERATE_TRADERECORD_INFO,		//新增
				delete_path:BTPATH.DELETE_OPERATE_TRADERECORD_INFO,	//删除
				add_box_id:'tradeRecord_add_box',
				list_name:'tradeRecordList',	
				page_name:'tradeRecordPage',
				upload_list:'tradeRecordAttach',
				info_name:'tradeRecordInfo',
				upload_required:true
			},
			bankFlow:{
				name:'银行流水',
				list_path:BTPATH.QUERY_OPERATE_BANKFLOW_LIST,	//获取列表
				add_path:BTPATH.ADD_OPERATE_BANKFLOW_INFO,		//新增
				delete_path:BTPATH.DELETE_OPERATE_BANKFLOW_INFO,	//删除
				add_box_id:'bankFlow_add_box',
				list_name:'bankFlowList',	
				page_name:'bankFlowPage',
				upload_list:'bankFlowAttach',
				info_name:'bankFlowInfo',
				upload_required:true
			}
		};



		//-------------------------------- 公用方法 -----------------------------------------

		//查询列表
		$scope.queryOperateList = function(pageFlag,flag){
			//弹出弹幕加载状态
			var config = _infoConfig[flag];
			$scope[config.page_name].flag = pageFlag? 1 : 2;
			http.post(config.list_path,$.extend({},$scope[config.page_name],{custNo:$scope.custNo})).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.list_name] = common.cloneArrayDeep(data.data);
						if(flag){
							$scope[config.page_name] = data.page;
						}
					});
				} 	
			});
		};
		

		//新增记录
		$scope.addRecord = function(target,flag){
			var config = _infoConfig[flag],
				detailInfo = $scope[config.info_name];

			//如果有校验 ：设置校验项 | 校验
			if(config.valid_config){
				var $add_box = $("#"+config.add_box_id);
				validate.validate($add_box,config.valid_config);
				var valid = validate.validate($add_box);
				if(!valid) return;
			}

			var fileList = ArrayPlus($scope[config.upload_list]).extractChildArray('id',true);
			//是否 必须上传附件
			if(config.upload_required && !fileList){
				tipbar.errorTopTipbar($(target),'请上传相应的附件!',3000,9992);
				return false;
			}

			// 附件 ID列表
			detailInfo.fileList = fileList;
			http.post(config.add_path,$.extend({custNo:$scope.custNo},detailInfo)).success(function(data){
			 	if(data&&(data.code === 200)){
			 		//刷新列表
			 		$scope.queryOperateList(true,flag);
			 		tipbar.infoTopTipbar('信息添加成功!',{});
			 		$scope.closeRollModal(config.add_box_id);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'信息添加失败,服务器返回:'+data.message,3000,9992);
			 	}
			});
		};


		//修改记录
		$scope.updateRecord = function(target,flag){
			var config = _infoConfig[flag],
				detailInfo = $scope[config.info_name];

			//如果有校验 ：设置校验项 | 校验
			if(config.valid_config){
				var $edit_box = $("#"+config.edit_box_id);
				validate.validate($edit_box,config.valid_config);
				var valid = validate.validate($edit_box);
				if(!valid) return;
			}

			var fileList = ArrayPlus($scope[config.upload_list]).extractChildArray('id',true);
			//是否 必须上传附件
			/*if(config.upload_required && !fileList){
				tipbar.errorTopTipbar($(target),'请上传相应的附件!',3000,9992);
				return false;
			}*/

			// 附件 ID列表
			detailInfo.fileList = fileList;
			http.post(config.edit_path,$.extend({custNo:$scope.custNo},detailInfo)).success(function(data){
			 	if(data&&(data.code === 200)){
			 		//刷新列表
			 		$scope.queryOperateList(true,flag);
			 		tipbar.infoTopTipbar('信息修改成功!',{});
			 		$scope.closeRollModal(config.edit_box_id);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'信息修改失败,服务器返回:'+data.message,3000,9992);
			 	}
			});
		};



		//删除记录
		$scope.deleteRecord = function(item,flag){
			var id = item.id;
				config = _infoConfig[flag];
			dialog.confirm('是否确认删除该条信息!',function(){
			  	http.post(config.delete_path,{id:id}).success(function(data){
					if(common.isCurrentData(data)){
						//刷新列表
			 			$scope.queryOperateList(true,flag);
						tipbar.infoTopTipbar('信息删除成功!',{});
					}
				});
			});
		};



		//---------------------------弹板操作开始-------------------------

		//公用 打开新增 面板
		$scope.openAddBox = function(flag){
			var config = _infoConfig[flag];
			//置空实体
			$scope[config.info_name] = {};
			$scope[config.upload_list] = [];
			$scope.openRollModal(config.add_box_id);
		};

		$scope.openEditBox = function(data,flag){
			var config = _infoConfig[flag];
			$scope[config.info_name] = data;
			$scope.openRollModal(config.edit_box_id);
		};

		
		//---------------------------弹板操作结束-------------------------


		///开启上传
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

		//移除附件
		$scope.removeAttach = function(id,listName){
			$scope[listName] = ArrayPlus($scope[listName]).delChild("id",id);
		};



		//切换面板
        $scope.switchTab = function(event) {
            var $target = $(event.srcElement ? event.srcElement : event.target);
			$target.tab('show');
        };


        //页面初始化
        commonService.initPage(function(){
        	var typeArray = ['finance','tax','financing','cooperation','tradeRecord','bankFlow'];
        	for (var i = 0; i < typeArray.length; i++) {
        		var flag = typeArray[i];
        		//查询列表
        		$scope.queryOperateList(true,flag);
        	}
        });


        



	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});