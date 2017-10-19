/*
资料复核查询
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
	mainApp.controller('mainController',['$scope','http','commonService','form',function($scope,http,commonService,form){
		/*VM绑定区域*/

		/* 基础数据 */
		/*数据字典列表*/
		$scope.identType = BTDict.IdentType.toArray('value','name');	//证件类型
		$scope.sexType = BTDict.CustSexType.toArray('value','name');	//性别
		$scope.eduLevel = BTDict.EduLevel.toArray('value','name');		//最高学历
		$scope.martialStatus = BTDict.MartialStatus.toArray('value','name');//婚姻状况
		$scope.corpTypes = BTDict.CorpType.toArray('value','name');			//企业类型
		$scope.premisesTypes =BTDict.PremisesType.toArray('value','name');	//场地类型

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

		//打包下载地址
		$scope.downListUrl = undefined;

		$scope.$watch('accountInfo.provinceNo',function(newNo){
			if (newNo==='') {
			    $scope.cityList = [];
			    $scope.accountInfo.bankCityno = '';
			} else if (newNo&& (newNo.length > 0)) {
			    $scope.cityList = BTDict.Provinces.getItem(newNo).citys.toArray('value', 'name');
			    $scope.accountInfo.bankCityno = $scope.cityList.length>0?$scope.cityList[0].value:'';
			}
		});

		//待录信息类型 对应字典类型 : InsteadItem
		$scope.infoTypes = new ListMap();
		$scope.infoTypes.set('0','basic');
		$scope.infoTypes.set('1','lawyer');
		// $scope.infoTypes.set('2','股东信息');
		// $scope.infoTypes.set('3','高管信息');
		$scope.infoTypes.set('4','license');
		// $scope.infoTypes.set('5','联系人信息');
		// $scope.infoTypes.set('6','银行账户');
		$scope.infoTypes.set('7','account');
		
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

		//资料复核单个申请详情
		$scope.applyDetail = {};
		//复核 相关附件列表
		$scope.attachmentList = [];
		//复核 审批记录列表
		$scope.auditRecordList = [];


		//资料复核申请列表
		$scope.applyList = [];
		//资料复核子项列表
		$scope.recordList = [];


		/*公司基本信息*/
		$scope.basicInfo = {};
		$scope.basicUploadList = [];

		/*法人相关信息*/
		$scope.lawyerInfo = {};
		$scope.lawyerUploadList = [];

		/*营业执照信息*/
		$scope.licenseInfo = {};
		$scope.licenseUploadList = [];

		/*开户信息*/
		$scope.accountInfo = {};
		$scope.accountUploadList = [];

		//获取核心企业的列表
		$scope.childCoreList = BTDict.ScfCoreGroup.toArray('value','name');
		
		

		/* 配置 */
		var _infoConfig = {
			basic:{
				name:'基本信息',
				info_path:BTPATH.FIND_INSTEAD_RECORD_BASIC,//获取单项信息详情
				box_id:'basic_change_audite_box',//模板包裹ID
				info_name:'basicInfo',//基础信息VM名称
				upload_list:'basicUploadList'//附件列表VM名称
			},
			lawyer:{
				name:'企业法人',
				info_path:BTPATH.QUERY_DETAIL_INSTEAD_LAWYER,//获取单项信息详情
				box_id:'lawyer_change_audite_box',//模板包裹ID
				info_name:'lawyerInfo',//基础信息VM名称
				upload_list:'lawyerUploadList'//附件列表VM名称
			},
			license:{
				name:'营业执照',
				info_path:BTPATH.QUERY_DETAIL_INSTEAD_LICENSE,//获取单项信息详情
				box_id:'business_change_audite_box',//模板包裹ID
				info_name:'licenseInfo',//基础信息VM名称
				upload_list:'licenseUploadList'//附件列表VM名称
			},
			account:{
				name:'平台开户信息',
				info_path:BTPATH.QUERY_DETAIL_INSTEAD_ACCOUNT,
				box_id:"account_change_audit_box",
				info_name:'accountInfo',
				upload_list:'accountUploadList'
			}
		};
		
		/*事件处理区域*/
		//查询
		$scope.searchList = function(){
			$scope.queryReviewList(true);
		};


		//获取资料复核列表 
		$scope.queryReviewList = function(flag){
			$scope.listPage.flag = flag? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			http.post(BTPATH.QUERY_INFO_REVIEW_LIST,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.applyList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			});
		};


		//查询申请相关附件列表
		$scope.queryApplyAttachmentList = function(apply){
			//批次号
			var batchNo = apply.batchNo;
			if(!batchNo) return;
			http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.attachmentList = common.cloneArrayDeep(data.data);
						$scope.downListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.attachList).extractChildArray("id",true) + "&fileName=代录资料包";
					});
				} 	
			});
		};


		//查询申请审核记录列表
		$scope.queryAuditRecordList = function(data){
			var promise = http.post(BTPATH.QUERY_AUDIT_RECORD_LIST,{businId:data.id}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.auditRecordList = common.cloneArrayDeep(data.data);
					});
				} 	
			});
			return promise;
		};


		//获取复核子项列表
		$scope.queryApplyRecordList = function(applyId){
			http.post(BTPATH.QUERY_RECORD_LIST_BY_APPLY,{"id":applyId}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.recordList = common.cloneArrayDeep(data.data);
					});
				}
			});
		};


		//查询 复核子项 附件列表
		$scope.queryRecordAttachmentList = function(flag){
			var config = _infoConfig[flag];
			//没有附件，不需要查询
			if(!config.upload_list){
				return;
			}
			//批次号
			var batchNo = $scope[config.info_name].batchNo;
			if(!batchNo) return;
			http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope[config.upload_list] = common.cloneArrayDeep(data.data);
					});
				} 	
			});
		};


		//查询单项记录详情 id:记录Id
		$scope.queryRecordInfo = function(record,flag){
			var config = _infoConfig[flag];
			var promise = http.post(config.info_path ,{id:record.id}).success(function(data){
	            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	              $scope.$apply(function(){
	              	  //通过城市编号获取省份编号
		              if(flag === 'account'){
		              		data.data.provinceNo = (typeof data.data.bankCityno === 'string')&&(data.data.bankCityno.length>0)?data.data.bankCityno.substr(0,2)+'0000':'';
		              }
	              	  //记录 的id ,businStatus 等字段不能被覆盖
	              	  $scope[config.info_name] = $.extend({},data.data,{
	              	  	 id:record.id,
	              	  	 applyId:record.applyId,
	              	  	 businStatus:record.businStatus,
	              	  	 modiType:"read"	//只读
	              	  });
	              });
	            }   
	        });
	        return promise;
		};


		//子项 复核通过 
		$scope.recordReviewSubmit = function(target,flag){
			var config = _infoConfig[flag],
				id = $scope[config.info_name].id,
				applyId = $scope[config.info_name].applyId;


			http.post(BTPATH.PASS_REVIEW_RECORD,{"id":id,"reason":$scope.auditReason}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('复核通过!',{});
			 		//关闭弹框
			 		$scope.closeRollModal(config.box_id);
			 		$scope.queryApplyRecordList(applyId);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'复核未能通过,服务器返回:'+data.message,3000,9999);
			 	}
			});
		};


		//子项 复核驳回 
		$scope.recordReviewReject = function(target,flag){
			var config = _infoConfig[flag],
				id = $scope[config.info_name].id,
				applyId = $scope[config.info_name].applyId;


			http.post(BTPATH.REJECT_REVIEW_RECORD,{"id":id,"reason":$scope.auditReason}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('复核驳回!',{});
			 		//关闭弹框
			 		$scope.closeRollModal(config.box_id);
			 		$scope.queryApplyRecordList(applyId);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'复核驳回失败,服务器返回:'+data.message,3000,9999);
			 	}
			});
		};


		//复核申请 确认提交
		$scope.applyReviewSubmit = function(target){
			var id = $scope.recordList[0].applyId;
			http.post(BTPATH.SUBMIT_REVIEW_APPLY,{"id":id}).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.infoTopTipbar('复核提交成功!',{});
			 		//关闭弹框
			 		$scope.closeRollModal("data_review_action_box");
			 		$scope.queryReviewList(false);
			 	}else{
			 		tipbar.errorTopTipbar($(target),'复核提交失败,服务器返回:'+data.message,3000,9999);
			 	}
			});
		};


		/* =================弹出框操作==================== */
		//打开资料复核详情
		$scope.openDataRecord = function(apply){
			$scope.applyDetail = apply;
			//查询审批列表
			$scope.queryAuditRecordList(apply);
			//查询附件列表
			$scope.queryApplyAttachmentList(apply);
			form.setCheckedList($('#data_review_detail_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},'1,1,0,0,1,0,0'.split(','));
			$scope.openRollModal("data_review_detail_box");
		};

		//打开资料复核 子项列表
		$scope.openReviewAction = function(apply){
			//查询子项列表
			$scope.queryApplyRecordList(apply.id);
			$scope.openRollModal("data_review_action_box");
		};

		$scope.linkChildCoreList = function(coreList){
			if((coreList === undefined)&&(coreList==='')) return;
			$scope.childCoreList = ArrayPlus($scope.childCoreList).addKey4ArrayObj('isChecked',false);
			var coreList = coreList.split(',');
			$scope.childCoreList = ArrayPlus($scope.childCoreList).linkAnotherArray(coreList,'value','isChecked',true);
		};

		//打开资料复核 单项操作
		$scope.openRecordReview = function(record){
			//类型
			var flag = $scope.infoTypes.get(record.insteadItem),
				config = _infoConfig[flag];
			//记录详情
			$scope.queryRecordInfo(record,flag).success(function(data){
				if(common.isCurrentData(data)){
					if(flag === 'account'){
						//关联核心企业
						$scope.$apply(function(){
							$scope.linkChildCoreList(data.data.coreList);
						});
					}
				}
				//附件列表
				$scope.queryRecordAttachmentList(flag);
			});
			
			$scope.openRollModal(config.box_id);
		};

		//页面初始化
		commonService.initPage(function(){
			//复核列表 
			$scope.queryReviewList(true);
		});
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

