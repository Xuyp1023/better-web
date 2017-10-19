/*
	基础资料
	@anthor : herb
	@联调
	@营业执照: binhg
	@基本信息: herb
	@法人信息: tanp
	@高管|股东|联系人|银行账户信息：herb
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
	mainApp.controller('mainController',['$scope','commonService','http','cache','modalService',function($scope,commonService,http,cache,modalService){

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
			scfAccount:{
				name:"返回开户",
				path:window.BTServerPath + "/scf2/views/supplier/account/scfAccount.html"
			},
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

		/*数据字典列表*/
		$scope.identType = BTDict.IdentType.toArray('value','name');	//证件类型
		$scope.sexType = BTDict.CustSexType.toArray('value','name');	//性别
		$scope.eduLevel = BTDict.EduLevel.toArray('value','name');		//最高学历
		$scope.martialStatus = BTDict.MartialStatus.toArray('value','name');//婚姻状况
		$scope.corpTypes = BTDict.CorpType.toArray('value','name');			//企业类型
		$scope.premisesTypes =BTDict.PremisesType.toArray('value','name');	//场地类型
		$scope.companyPositions =BTDict.CompanyPosition.toArray('value','name');	//公司职位
		$scope.saleBankCodes =BTDict.SaleBankCode.toArray('value','name');	//所属银行
		$scope.investmentTypes = BTDict.InvestmentType.toArray('value','name');	//出资形式
		$scope.provinces = BTDict.Provinces.toArray("value","name");//省份
		$scope.citys = [];//城市

		$scope.basicAttachTypes = BTDict.CustBaseAttachment.toArray("value","name");	//基本信息附件类型
		$scope.lawyerAttachTypes = BTDict.CustLawAttachment.toArray("value","name");	//法人信息附件类型
		$scope.licenseAttachTypes = BTDict.CustBusinLicenseAttachment.toArray("value","name");	//营业执照附件类型
		$scope.holderAttachTypes = BTDict.CustShareholderAttachment.toArray("value","name");	//股东信息附件类型
		$scope.managerAttachTypes = BTDict.CustManagerAttachment.toArray("value","name");	//高管信息附件类型
		$scope.contactorAttachTypes = BTDict.CustContacterAttachment.toArray("value","name");//联系人信息附件类型
		$scope.accountAttachTypes = BTDict.CustBankAccountAttachment.toArray("value","name");//银行账户信息附件类型

		//省市级联
		$scope.provinceChange = function(provinceNo){
			if(!provinceNo || provinceNo.length!==6) return;
			var province = BTDict.Provinces.getItem(provinceNo);
			$scope.citys = province? province.citys.toArray("value","name"):[];
		};

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

		//校验提示方法
		function errorPlacement(error, element) {
          	var label = element.parents('td').prev().text().substr(0);
          	tipbar.errorLeftTipbar(element,label+error,0,99999);
	    }

	    //生成校验配置
	    function generateValidOPtion(modelName,config){
	    	var elements = [];
	    	for(var attrName in config){
	    		var rules=[];
	    		//非自定义属性 跳至下一个
	    		if(!config.hasOwnProperty(attrName)) continue;
	    		for(var i=0 ;i<config[attrName].length; i++){
	    			var validName = config[attrName][i];
	    			rules.push({name:validName});
	    		}
	    		elements.push({
	    			name:modelName + "." + attrName,
	    			events:['blur'],
	    			rules:rules
	    		});
	    	}
	    	//返回配置
	    	return {
	    		elements:elements,
	    		errorPlacement:errorPlacement
	    	};
	    }


		/*营业执照相关VM设置*/
		$scope.licenseChangeList = [];
		$scope.licenseChangeListPage = initPageConf();
		$scope.licenseUploadList = [];
		$scope.licenseUploadList_bef = [];
		$scope.licenseUploadList_now = [];
		$scope.licenseInfo = {};
		$scope.licenseChangeInfo = {};

		/*法人相关信息*/
		$scope.lawyerChangeList = [];
		$scope.lawyerChangeListPage = initPageConf();
		$scope.lawyerUploadList = [];
		$scope.lawyerUploadList_bef = [];
		$scope.lawyerUploadList_now = [];
		$scope.lawyerInfo = {};
		$scope.lawyerChangeInfo = {};

		/*公司基本信息*/
		$scope.basicChangeList = [];
		$scope.basicChangeListPage = initPageConf();
		$scope.basicUploadList = [];
		$scope.basicUploadList_bef = [];
		$scope.basicUploadList_now = [];
		$scope.basicInfo = {};//是否只读
		$scope.basicChangeInfo = {};



		


		/* =====================================公司|法人|营业执照 校验相关 start======================================*/

	    //基础信息 校验信息
	    var basicValidConfig = {
	    	custName:["required"],
	    	corpType:["required"],
	    	// orgCode:["required"],
	    	businLicence:["required"],
	    	regCapital:["required","float"],
	    	paidCapital:["required","float"],	
	    	businScope:["required"],
	    	// setupDate:["required"],
	    	premisesArea:["required","int"],
	    	premisesYear:["required","int"],
	    	premisesType:["required"],
	    	premisesAddress:["required"],
	    	zipCode:["zipcode"],
	    	phone:["phone"],
	    	email:["email"]
	    },validOption_basic =  generateValidOPtion("basicInfo",basicValidConfig);


	    //法人信息 校验信息
	    var lawyerValidConfig = {
	    	name:["required"],
	    	identType:["required"],
	    	identNo:["required"],
	    	validDate:["required"],
	    	sex:["required"],	
	    	birthdate:["required"]
	    },validOption_lawyer =  generateValidOPtion("lawyerInfo",lawyerValidConfig);


	    //营业执照 校验信息
	    var licenseValidConfig = {
	    	regNo:["required"],
	    	corpType:["required"],
	    	address:["required"],
	    	lawName:["required"],
	    	regCapital:["required","int"],	
	    	paidCapital:["required","int"],
	    	setupDate:["required"],
	    	startDate:["required"],
	    	endDate:["required"],
			regBranch :["required"],
			certifiedDate :["required"],
			businScope :["required"]
	    },validOption_license =  generateValidOPtion("licenseInfo",licenseValidConfig);

	    /*===================================公司|法人|营业执照 校验相关 end=====================================*/




		/*================================= 公司|法人|营业执照信息 start ========================================*/
		var _infoConfig = {
			basic:{
				name:'基本信息',
				info_path:BTPATH.QUERY_BASIC_INFO,//获取对应信息
				change_list_path:BTPATH.QUERY_LIST_CHANGE_BASIC,//变更列表
				change_detail_path:BTPATH.FIND_AUDIT_DETAIL_BASIC,	//获取单项变更详情
				add_change_path:BTPATH.ADD_APPLY_CHANGE_BASIC,//新增变更
				box_id:'company_info_tab',//模板包裹ID
				change_box_id:'company_change_detail',//变更详情模板ID
				info_name:'basicInfo',//基础信息VM名称
				change_info_name:'basicChangeInfo',//变更详情VM名称
				change_list_name:'basicChangeList',//变更列表VM名称
				change_page_name:'basicChangeListPage',//变更分页VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'basicUploadList',		//附件列表 VM名称
				before_upload_list:'basicUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'basicUploadList_now',	//变更前附件列表 VM名称
				valid_config:validOption_basic,
				upload_required:false							//必须上传附件
			},
			license:{
				name:'营业执照',
				info_path:BTPATH.QUERY_INFO_LICENSE,//获取对应信息
				change_list_path:BTPATH.QUERY_LIST_CHANGE_LICENSE,//变更列表
				change_detail_path:BTPATH.FIND_AUDIT_DETAIL_LICENCE,	//获取单项变更详情
				add_change_path:BTPATH.ADD_APPLY_CHANGE_LICENSE,//新增变更
				box_id:'business_licence_tab',//模板包裹ID
				change_box_id:'licence_change_detail',//变更详情模板ID
				info_name:'licenseInfo',//基础信息VM名称
				change_info_name:'licenseChangeInfo',//变更详情VM名称
				change_list_name:'licenseChangeList',//变更列表VM名称
				change_page_name:'licenseChangeListPage',//变更分页VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'licenseUploadList',		//附件列表 VM名称
				before_upload_list:'licenseUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'licenseUploadList_now',	//变更前附件列表 VM名称
				valid_config:validOption_license,
				upload_required:true							//必须上传附件
			},
			lawyer:{
				name:'企业法人',
				info_path:BTPATH.QUERY_INFO_LAWYER,//获取对应信息
				change_list_path:BTPATH.QUERY_LIST_CHANGE_LAWYER,//变更列表
				change_detail_path:BTPATH.FIND_AUDIT_DETAIL_LAWYER,	//获取单项变更详情
				add_change_path:BTPATH.ADD_APPLY_CHANGE_LAWYER,//新增变更
				box_id:'corporation_info_tab',//模板包裹ID
				change_box_id:'corp_change_detail',//变更详情模板ID
				info_name:'lawyerInfo',//基础信息VM名称
				change_info_name:'lawyerChangeInfo',//变更详情VM名称
				change_list_name:'lawyerChangeList',//变更列表VM名称
				change_page_name:'lawyerChangeListPage',//变更分页VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'lawyerUploadList',		//附件列表 VM名称
				before_upload_list:'lawyerUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'lawyerUploadList_now',	//变更后附件列表 VM名称
				valid_config:validOption_lawyer,
				upload_required:true							//必须上传附件
			}
		};
		

		/*tab操作区*/
		//查询信息详情
		$scope.queryInfo = function(flag){
			var config = _infoConfig[flag];
			var promise =http.post(config.info_path,{custNo:$scope.custNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.info_name] = $.extend({onlyLook:$scope.onlyLook},data.data);
					});
					modalService.onModalLoaded(function(){
						//if(console) console.log(config.box_id + ' event register!');
						var boxsFilter = ['#'+config.box_id],
							expression = flag+"Info.onlyLook=false";
					  	$scope.$$emiterMultipleBoxEnabled(boxsFilter,expression);
					},config.box_id + '_content');
					$scope.queryAttachmentList(config);
				}
			});
			return promise;
		};


		//查询附件列表
		$scope.queryAttachmentList = function(config){
			//批次号
			var batchNo = $scope[config.info_name].batchNo;
			if(batchNo){
				http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope[config.upload_list] = common.cloneArrayDeep(data.data);
						});
					} 	
				});
			}
		};

		//删除附件
		$scope.deleteAttach = function(id,flag){
			var config = _infoConfig[flag];
			$scope[config.upload_list] = ArrayPlus($scope[config.upload_list]).delChild("id",id);
		};


		//查询历史变更列表
		$scope.queryChangeList = function(pageFlag,flag){
			//弹出弹幕加载状态
			var config = _infoConfig[flag];
			$scope[config.change_page_name].flag = pageFlag? 1 : 2;
			http.post(config.change_list_path,$.extend({},$scope[config.change_page_name],{custNo:$scope.custNo})).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.change_list_name] = common.cloneArrayDeep(data.data);
						if(flag){
							$scope[config.change_page_name] = data.page;
						}
					});
				} 	
			});
		};


		//查询历史变更详情 
		$scope.queryChangeInfo = function(item,flag){
			var config = _infoConfig[flag];
			http.post(config.change_detail_path ,{"id":item.id}).success(function(data){
	            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	              $scope.$apply(function(){
	              	  $scope[config.change_info_name] = data.data;
	              });
	            }   
	        }).then(function(){
	        	//附件变更列表
	        	$scope.queryChangeAttachmentList(flag);
	        });
		};


		//查询变更前后附件列表
		$scope.queryChangeAttachmentList = function(flag){
			var config = _infoConfig[flag];
			//没有附件，不需要查询
			if(!config.before_upload_list){
				return;
			}
			//变更前附件批次
			var batchNo = $scope[config.change_info_name].befData.batchNo;
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
			batchNo = $scope[config.change_info_name].nowData.batchNo;
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


		//新增变更
		$scope.addChange = function(target,flag){
			var config = _infoConfig[flag],
				$target = $(target),
				files = $scope[config.upload_list],
				detailInfo = $scope[config.info_name];

			//如果有校验 ：设置校验项 | 校验
			if(config.valid_config){
				var $box = $("#"+config.box_id);
				validate.validate($box,config.valid_config);
				var valid = validate.validate($box);
				if(!valid) return;
			}

			var fileList = ArrayPlus(files).extractChildArray('id',true);
			//是否 必须上传附件
			if(config.upload_required && !fileList){
				tipbar.errorTopTipbar($(target),'请上传相应的附件!',3000,9992);
				return false;
			}

			//附件列表
			detailInfo.fileList = fileList;
			detailInfo.custNo = detailInfo.custNo || $scope.custNo;
			detailInfo.refId = detailInfo.custNo;	//refId
			http.post(config.add_change_path,detailInfo).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.errorTopTipbar($target,'变更提交成功,请等待审核后正式生效!',3000,9992);
			 		$scope.queryChangeList(true,flag);
			 	}else{
			 		tipbar.errorTopTipbar($target,'变更提交失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};




		/*高管相关信息*/
		$scope.managerChangeApplyList = [];		//变更申请列表
		$scope.managerChangeApplyListPage = initPageConf();
		$scope.managerChangeRecordList = [];//变更记录列表（子项）
		$scope.managerChangeRecordInfo = {};//变更记录信息（子项）
		$scope.managerList = [];			//高管列表
		$scope.managerWaitChangeList = [];	//待变更列表
		$scope.managerInfo = {};			//高管详情
		$scope.managerUploadList = [];		//附件
		$scope.managerUploadList_bef = [];	//变更前附件列表
		$scope.managerUploadList_now = [];	//变更后附件列表


		/*联系人相关信息*/
		$scope.contactorChangeApplyList = [];		//变更申请列表
		$scope.contactorChangeApplyListPage = initPageConf();
		$scope.contactorChangeRecordList = [];//变更记录列表（子项）
		$scope.contactorChangeRecordInfo = {};//变更记录信息（子项）
		$scope.contactorList = [];			//联系人列表
		$scope.contactorWaitChangeList = [];	//待变更列表
		$scope.contactorInfo = {};			//联系人详情
		$scope.contactorUploadList = [];		//附件
		$scope.contactorUploadList_bef = [];	//变更前附件列表
		$scope.contactorUploadList_now = [];	//变更后附件列表


		/*股东相关信息*/
		$scope.holderChangeApplyList = [];		//变更申请列表
		$scope.holderChangeApplyListPage = initPageConf();
		$scope.holderChangeRecordList = [];//变更记录列表（子项）
		$scope.holderChangeRecordInfo = {};//变更记录信息（子项）
		$scope.holderList = [];			//股东列表
		$scope.holderWaitChangeList = [];	//待变更列表
		$scope.holderInfo = {};			//股东详情
		$scope.holderUploadList = [];		//附件
		$scope.holderUploadList_bef = [];	//变更前附件列表
		$scope.holderUploadList_now = [];	//变更后附件列表


		/*银行账户相关信息*/
		$scope.accountChangeApplyList = [];		//变更申请列表
		$scope.accountChangeApplyListPage = initPageConf();
		$scope.accountChangeRecordList = [];//变更记录列表（子项）
		$scope.accountChangeRecordInfo = {};//变更记录信息（子项）
		$scope.accountList = [];			//银行账户列表
		$scope.accountWaitChangeList = [];	//待变更列表
		$scope.accountInfo = {};			//银行账户详情
		$scope.accountUploadList = [];		//附件
		$scope.accountUploadList_bef = [];	//变更前附件列表
		$scope.accountUploadList_now = [];	//变更后附件列表



		/* ===================================== 股东|高管|联系人|银行账户 校验相关 start======================================*/

	    //银行账号 校验信息
	    var accountValidConfig = {
	    	isDefault:["required"],
	    	bankNo:["required"],
	    	bankName:["required"],
	    	bankAcco:["required"],
	    	bankAccoName:["required"],	
	    	cityNo:["required"]
	    },validOption_account =  generateValidOPtion("accountInfo",accountValidConfig);

	    //股东 校验信息
	    var holderValidConfig = {
	    	name:["required"],
	    	identType:["required"],
	    	identNo:["required"],
	    	validDate:["required"],
	    	sex:["required"],	
	    	birthdate:["required"],
	    	eduLevel:["required"],
	    	investmentType:["required"],
	    	investmentRate:["required","float"]
	    },validOption_holder =  generateValidOPtion("holderInfo",holderValidConfig);


	    //联系人 校验信息
	    var contactorValidConfig = {
	    	name:["required"],
	    	sex:["required"],
	    	mobile:["required","mobile"],
	    	phone:["required","phone"],
	    	email:["required","email"],	
	    	address:["required"]
	    },validOption_contactor =  generateValidOPtion("contactorInfo",contactorValidConfig);


	    //高管 校验信息
	    var managerValidConfig = {
	    	name:["required"],
	    	identType:["required"],
	    	identNo:["required"],
	    	sex:["required"],
	    	birthdate:["required"],	
	    	eduLevel:["required"]
	    },validOption_manager =  generateValidOPtion("managerInfo",managerValidConfig);


	    /*================================= 股东|高管|联系人|银行账户 校验相关 end=====================================*/



		/*================================= 股东|高管|联系人|银行账户信息 start ========================================*/

		var _listConfig = {
			manager:{
				name:'高管信息',
				list_path:BTPATH.QUERY_MANAGER_LIST,		//获取高管列表
				wait_list_path:BTPATH.QUERY_MANAGE_TMP_LIST,//获取待变更高管列表
				info_path:BTPATH.QUERY_MANAGER_DETAIL,		//获取高管详情
				add_path:BTPATH.ADD_MANAGE_TMP,				//变更-高管新增
				edit_path:BTPATH.EDIT_MANAGE_TMP,			//变更-高管编辑
				delete_path:BTPATH.DELETE_MANAGE_TMP,		//变更-高管删除
				cancel_change_path:BTPATH.CANCEL_MANAGE_CHANGE_APPLY,//单项撤销变更
				submit_change_path:BTPATH.ADD_MANAGE_CHANGE_APPLY,		 //提交变更
				change_apply_list_path:BTPATH.QUERY_MANAGE_CHANGE_APPLY_LIST,	//获取变更申请列表
				change_record_list_path:BTPATH.QUERY_MANAGE_CHANGE_RECORD_LIST,//获取变更记录列表
				change_record_detail_path:BTPATH.QUERY_MANAGE_CHANGE_RECORD_INFO,//获取变更记录详情
				box_id:'executive_info_tab',//模板包裹ID
				change_list_box_id:'executor_change_list',	//变更列表模板ID
				change_info_box_id:'executor_change_detail',		//变更详情模板ID
				add_box_id:'executor_add_box',	//新增高管模板ID
				edit_box_id:'executor_edit_box',//编辑高管模板ID
				list_name:'managerList',	//高管列表VM名称
				info_name:'managerInfo',	//高管详情VM名称
				wait_list_name:'managerWaitChangeList',//待变更高管列表
				change_apply_list_name:'managerChangeApplyList',	//变更申请列表VM名称
				change_apply_page_name:'managerChangeApplyListPage',//变更申请列表分页VM名称
				change_record_list_name:'managerChangeRecordList',	//变更记录列表VM名称
				change_record_info_name:'managerChangeRecordInfo',	//变更记录详情VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'managerUploadList',			//附件列表 VM名称
				before_upload_list:'managerUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'managerUploadList_now',	//变更后附件列表 VM名称
				valid_config:validOption_manager,
				upload_required:true							//必须上传附件
			},
			contactor:{
				name:'联系人信息',
				list_path:BTPATH.QUERY_CONTACTOR_LIST,		//获取联系人列表
				wait_list_path:BTPATH.QUERY_CONTACTOR_TMP_LIST,//获取待变更联系人列表
				info_path:BTPATH.QUERY_CONTACTOR_DETAIL,		//获取联系人详情
				add_path:BTPATH.ADD_CONTACTOR_TMP,				//变更-联系人新增
				edit_path:BTPATH.EDIT_CONTACTOR_TMP,			//变更-联系人编辑
				delete_path:BTPATH.DELETE_CONTACTOR_TMP,		//变更-联系人删除
				cancel_change_path:BTPATH.CANCEL_CONTACTOR_CHANGE_APPLY,//单项撤销变更
				submit_change_path:BTPATH.ADD_CONTACTOR_CHANGE_APPLY,		 //提交变更
				change_apply_list_path:BTPATH.QUERY_CONTACTOR_CHANGE_APPLY_LIST,	//获取变更申请列表
				change_record_list_path:BTPATH.QUERY_CONTACTOR_CHANGE_RECORD_LIST,//获取变更记录列表
				change_record_detail_path:BTPATH.QUERY_CONTACTOR_CHANGE_RECORD_INFO,//获取变更记录详情
				box_id:'contact_info_tab',//模板包裹ID
				change_list_box_id:'contact_change_list',	//变更列表模板ID
				change_info_box_id:'contact_change_detail',		//变更详情模板ID
				add_box_id:'contact_add_box',	//新增联系人模板ID
				edit_box_id:'contact_edit_box',//编辑联系人模板ID
				list_name:'contactorList',	//联系人列表VM名称
				info_name:'contactorInfo',	//联系人详情VM名称
				wait_list_name:'contactorWaitChangeList',//待变更联系人列表
				change_apply_list_name:'contactorChangeApplyList',	//变更申请列表VM名称
				change_apply_page_name:'contactorChangeApplyListPage',//变更申请列表分页VM名称
				change_record_list_name:'contactorChangeRecordList',	//变更记录列表VM名称
				change_record_info_name:'contactorChangeRecordInfo',	//变更记录详情VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'contactorUploadList',			//附件列表 VM名称
				before_upload_list:'contactorUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'contactorUploadList_now',		//变更后附件列表 VM名称
				valid_config:validOption_contactor,
				upload_required:true							//必须上传附件
			},
			holder:{
				name:'股东信息',
				list_path:BTPATH.QUERY_SHAREHOLDER_LIST,		//获取股东列表
				wait_list_path:BTPATH.QUERY_SHAREHOLDER_TMP_LIST,//获取待变更股东列表
				info_path:BTPATH.QUERY_SHAREHOLDER_DETAIL,		//获取股东详情
				add_path:BTPATH.ADD_SHAREHOLDER_TMP,				//变更-股东新增
				edit_path:BTPATH.EDIT_SHAREHOLDER_TMP,			//变更-股东编辑
				delete_path:BTPATH.DELETE_SHAREHOLDER_TMP,		//变更-股东删除
				cancel_change_path:BTPATH.CANCEL_SHAREHOLDER_CHANGE_APPLY,//单项撤销变更
				submit_change_path:BTPATH.ADD_SHAREHOLDER_CHANGE_APPLY,		 //提交变更
				change_apply_list_path:BTPATH.QUERY_SHAREHOLDER_CHANGE_APPLY_LIST,	//获取变更申请列表
				change_record_list_path:BTPATH.QUERY_SHAREHOLDER_CHANGE_RECORD_LIST,//获取变更记录列表
				change_record_detail_path:BTPATH.QUERY_SHAREHOLDER_CHANGE_RECORD_INFO,//获取变更记录详情
				box_id:'shareholder_info_tab',//模板包裹ID
				change_list_box_id:'holder_change_list',	//变更列表模板ID
				change_info_box_id:'holder_change_detail',		//变更详情模板ID
				add_box_id:'holder_add_box',	//新增股东模板ID
				edit_box_id:'holder_edit_box',//编辑股东模板ID
				list_name:'holderList',	//股东列表VM名称
				info_name:'holderInfo',	//股东详情VM名称
				wait_list_name:'holderWaitChangeList',//待变更股东列表
				change_apply_list_name:'holderChangeApplyList',	//变更申请列表VM名称
				change_apply_page_name:'holderChangeApplyListPage',//变更申请列表分页VM名称
				change_record_list_name:'holderChangeRecordList',	//变更记录列表VM名称
				change_record_info_name:'holderChangeRecordInfo',	//变更记录详情VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'holderUploadList',			//附件列表 VM名称
				before_upload_list:'holderUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'holderUploadList_now',		//变更后附件列表 VM名称
				valid_config:validOption_holder,
				upload_required:true							//必须上传附件
			},
			account:{
				name:'账户信息',
				list_path:BTPATH.QUERY_BANKACCOUNT_LIST,		//获取账户列表
				wait_list_path:BTPATH.QUERY_BANKACCOUNT_TMP_LIST,//获取待变更账户列表
				info_path:BTPATH.QUERY_BANKACCOUNT_DETAIL,		//获取账户详情
				add_path:BTPATH.ADD_BANKACCOUNT_TMP,				//变更-账户新增
				edit_path:BTPATH.EDIT_BANKACCOUNT_TMP,			//变更-账户编辑
				delete_path:BTPATH.DELETE_BANKACCOUNT_TMP,		//变更-账户删除
				cancel_change_path:BTPATH.CANCEL_BANKACCOUNT_CHANGE_APPLY,//单项撤销变更
				submit_change_path:BTPATH.ADD_BANKACCOUNT_CHANGE_APPLY,		 //提交变更
				change_apply_list_path:BTPATH.QUERY_BANKACCOUNT_CHANGE_APPLY_LIST,	//获取变更申请列表
				change_record_list_path:BTPATH.QUERY_BANKACCOUNT_CHANGE_RECORD_LIST,//获取变更记录列表
				change_record_detail_path:BTPATH.QUERY_BANKACCOUNT_CHANGE_RECORD_INFO,//获取变更记录详情
				box_id:'account_info_tab',//模板包裹ID
				change_list_box_id:'account_change_list',	//变更列表模板ID
				change_info_box_id:'account_change_detail',		//变更详情模板ID
				add_box_id:'account_add_box',	//新增账户模板ID
				edit_box_id:'account_edit_box',//编辑账户模板ID
				list_name:'accountList',	//账户列表VM名称
				info_name:'accountInfo',	//账户详情VM名称
				wait_list_name:'accountWaitChangeList',//待变更账户列表
				change_apply_list_name:'accountChangeApplyList',	//变更申请列表VM名称
				change_apply_page_name:'accountChangeApplyListPage',//变更申请列表分页VM名称
				change_record_list_name:'accountChangeRecordList',	//变更记录列表VM名称
				change_record_info_name:'accountChangeRecordInfo',	//变更记录详情VM名称
				upload_type:'aaaa',//上传类型名称
				upload_list:'accountUploadList',			//附件列表 VM名称
				before_upload_list:'accountUploadList_bef',	//变更前附件列表 VM名称
				now_upload_list:'accountUploadList_now',	//变更后附件列表 VM名称
				valid_config:validOption_account,
				upload_required:true							//必须上传附件
			}
		};



		//查询现有列表
		$scope.queryCurrentList = function(flag){
			var config = _listConfig[flag];
			http.post(config.list_path,{custNo:$scope.custNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.list_name] = common.cloneArrayDeep(data.data);
					});
				}
			});
		};

		//查询待变更列表
		$scope.queryWaitChangeList = function(flag){
			var config = _listConfig[flag];
			http.post(config.wait_list_path,{custNo:$scope.custNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.wait_list_name] = common.cloneArrayDeep(data.data);
					});
				}
			});
		};


		//查询单个详情
		$scope.querySingleInfo = function(data,flag){
			var config = _listConfig[flag];
			var promise = http.post(config.info_path,{id:data.id,custNo:$scope.custNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.info_name] = data.data;
					});
				}
			});
			return promise;
		};


		//查询变更申请列表
		$scope.queryChangeApplyList = function(pageFlag,flag){
			var config = _listConfig[flag];
			$scope[config.change_apply_page_name].flag = pageFlag? 1 : 2;
			var promise = http.post(config.change_apply_list_path,$.extend({},$scope[config.change_apply_page_name],{custNo:$scope.custNo})).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.change_apply_list_name] = common.cloneArrayDeep(data.data);
						if(flag){
							$scope[config.change_apply_page_name] = data.page;
						}
					});
				} 	
			});
			return promise;
		};


		//查询变更记录列表
		$scope.queryChangeRecordList = function(applyId,flag){
			var config = _listConfig[flag];
			http.post(config.change_record_list_path,{applyId:applyId}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.change_record_list_name] = common.cloneArrayDeep(data.data);
					});
				} 	
			});
		};


		//查询变更记录详情
		$scope.queryChangeRecordInfo = function(data,flag){
			var config = _listConfig[flag];
			var promise =http.post(config.change_record_detail_path,{applyId:data.parentId,tmpId:data.id}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.change_record_info_name] = data.data;
					});
				}
			});
			return promise;
		};


		//查询附件列表
		$scope.querySingleAttachList = function(data,flag){
			var config = _listConfig[flag];
			//批次号
			var batchNo = data.batchNo;
			if(batchNo){
				http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope[config.upload_list] = common.cloneArrayDeep(data.data);
						});
					} 	
				});
			}
		};


		//查询变更前后附件列表
		$scope.queryChangeRecordAttachList = function(flag){
			var config = _listConfig[flag];
			//没有附件，不需要查询
			if(!config.before_upload_list){
				return;
			}
			//变更前附件批次
			var batchNo = $scope[config.change_record_info_name].befData.batchNo;
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
			batchNo = $scope[config.change_record_info_name].nowData.batchNo;
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


		//变更 -信息删除
		$scope.deleteRecord = function(item,flag){
			var id = item.id,
				config = _listConfig[flag];
			dialog.confirm('是否确认删除该条记录!',function(){
			  	http.post(config.delete_path,{refId:id}).success(function(data){
					if(common.isCurrentData(data)){
						//刷新待变更列表
			 			$scope.queryWaitChangeList(flag);
						tipbar.infoTopTipbar('变更记录添加成功!',{});
					}
				});
			});
		};


		//移除附件
		$scope.removeAttach = function(id,flag){
			var config = _listConfig[flag];
			$scope[config.upload_list] = ArrayPlus($scope[config.upload_list]).delChild("id",id);
		};


		//变更 -信息新增
		$scope.addRecord = function(target,flag){
			var config = _listConfig[flag],
				detailInfo = $scope[config.info_name];

			//如果有校验 ：设置校验项 | 校验
			if(config.valid_config){
				var $addBox = $("#"+config.add_box_id);
				validate.validate($addBox,config.valid_config);
				var valid = validate.validate($addBox);
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
			// 省市|是否默认账户
			if(flag==='account'){
				detailInfo.cityNo = detailInfo.cityNo || detailInfo.provinceNo;
				detailInfo.isDefault = detailInfo.isDefault ? 1 : 0;
			}
			http.post(config.add_path,$.extend({custNo:$scope.custNo},detailInfo)).success(function(data){
			 	if(data&&(data.code === 200)){
			 		//刷新待变更列表
			 		$scope.queryWaitChangeList(flag);
			 		tipbar.infoTopTipbar('变更记录添加成功!',{});
			 		$scope.closeRollModal(config.add_box_id);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'操作失败,服务器返回:'+data.message,3000,9992);
			 	}
			});
		};


		//变更 -信息编辑
		$scope.updateRecord = function(target,flag){
			var config = _listConfig[flag],
				detailInfo = $scope[config.info_name];

			//如果有校验 ：设置校验项 | 校验
			if(config.valid_config){
				var $editBox = $("#"+config.edit_box_id);
				validate.validate($editBox,config.valid_config);
				var valid = validate.validate($editBox);
				if(!valid) return;
			}

			var fileList = ArrayPlus($scope[config.upload_list]).extractChildArray('id',true);
			//是否 必须上传附件
			if(config.upload_required && !fileList){
				tipbar.errorTopTipbar($(target),'请上传相应的附件!',3000,9992);
				return false;
			}

			detailInfo.refId = detailInfo.id;
			// 附件 ID列表
			detailInfo.fileList = fileList;
			// 省市|是否默认账户
			if(flag==='account'){
				detailInfo.cityNo = detailInfo.cityNo || detailInfo.provinceNo;
				detailInfo.isDefault = detailInfo.isDefault ? 1 : 0;
			}
			http.post(config.edit_path,$.extend({custNo:$scope.custNo},detailInfo)).success(function(data){
			 	if(data&&(data.code === 200)){
			 		//刷新待变更列表
			 		$scope.queryWaitChangeList(flag);
			 		tipbar.infoTopTipbar('变更记录添加成功!',{});
			 		$scope.closeRollModal(config.edit_box_id);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'操作失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};


		//变更 -撤销 （单条记录）
		$scope.cancelChange = function(item,flag){
			var config = _listConfig[flag],
				id = item.id;
			http.post(config.cancel_change_path,{id:id}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		$scope.$apply(function(){
			 			$scope[config.wait_list_name] = ArrayPlus($scope[config.wait_list_name]).delChild('id',id);
			 		});
			 	}else{
			 		tipbar.errorTopTipbar($target,'撤销失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};



		//待变更列表 提交
		$scope.submitChange = function(target,flag){
			var config = _listConfig[flag];
			//待变更记录 id集合
			var tmpIds = ArrayPlus($scope[config.wait_list_name]).extractChildArray('id',true);
			if(!tmpIds){
				tipbar.errorTopTipbar($(target),'还没有待变更的记录！',3000,9992);
				return;
			}
			http.post(config.submit_change_path,{custNo:$scope.custNo,tmpIds:tmpIds}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		$scope.$apply(function(){
			 			$scope[config.wait_list_name] = [];
			 		});
			 		//刷新变更申请列表
			 		$scope.queryChangeApplyList(true,flag);
			 		tipbar.infoTopTipbar('变更提交成功,请等待审核后正式生效!',{});
			 	}else{
			 		tipbar.errorTopTipbar($(target),'变更提交失败,服务器返回:'+data.message,3000,9992);
			 	}
			 });
		};


		
		//---------------------------弹板操作开始-------------------------

		//查看变更详情(公司|法人|营业执照)
		$scope.showChangeDetail = function(data,flag){
			var config = _infoConfig[flag];
			//查询变更
			$scope.queryChangeInfo(data,flag);
			$scope.openRollModal(config.change_box_id);
		};


		//查看变更记录列表 	（股东|高管|联系人|银行账户信息）
		$scope.openChangeListBox = function(data,flag){
			var config = _listConfig[flag];
			$scope.queryChangeRecordList(data.id,flag);
			$scope.openRollModal(config.change_list_box_id);
		};


		//查看变更记录详情 	（股东|高管|联系人|银行账户信息）
		$scope.openChangeInfoBox = function(data,flag){
			var config = _listConfig[flag];
			//置空实体和附件列表
			$scope[config.change_record_info_name] = {};
			$scope[config.before_upload_list] = [];
			$scope[config.now_upload_list] = [];
			//查询详情
			$scope.queryChangeRecordInfo(data,flag).success(function(){
				//查询附件列表
				$scope.queryChangeRecordAttachList(flag);
			});
			// $scope.querySingleAttachList(data,flag);
			$scope.openRollModal(config.change_info_box_id);
		};


		//打开新增 box
		$scope.openAddBox = function(flag){
			var config = _listConfig[flag];
			//置空实体和附件列表
			$scope[config.info_name] = {};
			$scope[config.upload_list] = [];
			//置空城市列表
			$scope.citys = [];
			$scope.openRollModal(config.add_box_id);
		};


		//打开编辑 box
		$scope.openEditBox = function(data,flag){
			var config = _listConfig[flag];
			//置空实体和附件列表
			$scope[config.info_name] = {};
			$scope[config.upload_list] = [];
			//置空城市列表
			$scope.citys = [];
			//查询详情
			$scope.querySingleInfo(data,flag).success(function(){
				var info = $scope[config.info_name];
				if(flag==='account' && info.cityNo){
					$scope.$apply(function(){
						//获取 ‘省份’ 信息
						$scope[config.info_name].provinceNo = info.cityNo.substr(0,2)+'0000';
						//刷新城市列表
						$scope.provinceChange($scope[config.info_name].provinceNo);
					});
				}
			});
			//查询附件列表
			$scope.querySingleAttachList(data,flag);
			$scope.openRollModal(config.edit_box_id);
		};





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

		//开启上传(下拉选择附件类型)
	    $scope.openUploadDropdown = function(event,typeList,list){
	      $scope.uploadConf = {
	        //上传触发元素
	        event:event.target||event.srcElement, 
	        //附件类型列表
	        typeList:$scope[typeList],
	        //存放上传文件
	        uploadList:$scope[list]
	      };
	    };


		//切换面板
        $scope.switchTab = function(event) {
            var $target = $(event.srcElement ? event.srcElement : event.target);
			// 标志 Tab数据
			var flag = $target.attr("data-flag");
			
			// 数据已加载
			if(!ArrayPlus($scope.waitload).isContain(flag)){
				// Tab显示
				$target.tab('show');
				return ;
			}
			// 基础|法人|营业执照
			if(flag=='baisc'||flag=='lawyer'||flag=='license'){
				$scope.queryChangeList(true,flag);
				$scope.queryInfo(flag).success(function(){
					$target.tab('show');
				});
			}else{
				$scope.queryCurrentList(flag);
				$scope.queryWaitChangeList(flag);
				$scope.queryChangeApplyList(true,flag).success(function(){
					$target.tab('show');
				});
			}
			
			//从待加载列表中移除
			$scope.waitload = ArrayPlus($scope.waitload).remove(flag);
        };

        //模块执行入口
        commonService.initPage(function(){
        	//待加载数据列表 'basic'初始加载
        	$scope.waitload = ['license','lawyer','manager','contactor','holder','account'];
        	//初始显示 基础信息，加载数据
        	$scope.queryChangeList(true,'basic');
        	$scope.queryInfo('basic');
        });


	}]);

	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});