/* 
资料代录
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


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','form',function($scope,http,commonService,form){
		/*VM绑定区域*/
		$scope.statusList = BTDict.InsteadApplyBusinStatus.toArray('value','name');
		$scope.typeList = BTDict.InsteadType.toArray('value','name').slice(0,1);
		$scope.custList = [];
		$scope.isSelectShow = true;

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

		$scope.$watch('childInfo.provinceNo',function(newNo){
			if (newNo==='') {
			    $scope.cityList = [];
			    $scope.childInfo.bankCityno = '';
			} else if (newNo&& (newNo.length > 0)) {
			    $scope.cityList = BTDict.Provinces.getItem(newNo).citys.toArray('value', 'name');
			    $scope.childInfo.bankCityno = $scope.cityList.length>0?$scope.cityList[0].value:'';
			}
		});

		//==============================公共操作区 start=================================
		$scope.searchData = {
			LIKEcustName:'',
			businStatus:'',
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
		//资料代录列表
		$scope.infoList = [];
		//单个资料代录信息
		$scope.info = {};
		//审批记录列表
		$scope.auditRecordList = [];

		//子信息列表
		$scope.childrenInfoList = [];

		$scope.isShowMore = false;

		$scope.$watch('info.insteadType',function(newValue){
			if(newValue === $scope.typeList[0].value){
				$scope.isShowMore = false;
			}else{
				$scope.isShowMore = true;
			}
		});
 
		//代录附件类型
		$scope.attachTypes = BTDict.CustomerInsteadAttachment.toArray('value','name');
		//开户附件
		$scope.openAttachTypes = BTDict.CustOpenAccountAttachment.toArray('value','name');
		
		//附件列表
		$scope.attachList = [];

		//主列表操作控制
		$scope.mainListCtrl = {
			isCannotMode : function(data){
				var businStatus = data.businStatus;
				return !businStatus||ArrayPlus(['0','1','3','5']).isContain(businStatus);
			},
			isCanConfirm : function(data){
				var businStatus = data.businStatus;
				return businStatus === '4';
			},
			isCanRead:function(data){
				var businStatus = data.businStatus;
				return ArrayPlus(['6','7','8']).isContain(businStatus);
			},
			isCanRedo:function(data){
				var businStatus = data.businStatus;
				return businStatus === '2';
			}
		};

		//子列表操作控制
		$scope.childListCtrl = {
			isCanConfirm : function(data){
				var businStatus = data.businStatus;
				return businStatus === '2';
			},
			isCanRead:function(data){
				var businStatus = data.businStatus;
				return ArrayPlus(['4','5','6']).isContain(businStatus);
			}
		};


		/*事件处理区域*/
		//查询资料代录
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取资料代录申请列表 
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_OWN_INSTEAD_LIST,$.extend({},$scope.listPage,$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data);
							if(flag){
								$scope.listPage = data.page;
							}
						});
					} 	
			});
		};

		//查询审核记录列表
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


		//获取子信息列表 QUERY_CHILDREN_INSTEAD_LIST
		$scope.queryChildList = function(data){
			var promise = http.post(BTPATH.QUERY_CHILDREN_INSTEAD_LIST,{id:data.id})
				.success(function(data){
					//关闭加载状态弹幕
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.childrenInfoList = common.cloneArrayDeep(data.data);
						});
					} 	
			});
			return promise;
		};

		//增加资料代录
		$scope.addInfo = function(target){
			var $target = $(target);
			$scope.info.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);
			if(!$scope.info.fileList){
				tipbar.errorTopTipbar($target,"请先上传代录所需附件",3000,9992);
				return false;
			}
			$scope.info.insteadItems = form.getCheckedList($('#add_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			}).join(',');
			http.post(BTPATH.ADD_INSTEAD_LIST,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('新增资料代录成功,请等待处理!',{});
				 		// tipbar.errorTopTipbar($target,'新增资料代录成功,请等待处理!',3000,9992);
				 		$scope.closeRollModal("add_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增资料代录失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//删除资料代录
		$scope.delInfo = function(target,data){
			var $target = $(target);
			dialog.confirm('请确认是否删除此项资料代录?',function(){
				http.post(BTPATH.DEL_ONE_BLACKLIST,{id:data.id})
					.success(function(data){
						if(data&&(data.code === 200)){
							$scope.queryList(true);
						}else{
							tipbar.errorTopTipbar($target,'删除资料代录失败,服务器返回:'+data.message,3000,9000);
						}
					});
			});
		};

		//编辑资料代录
		$scope.editInfo = function(target){
			var $target = $(target);
			$scope.info.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);
			if(!$scope.info.fileList){
				tipbar.errorTopTipbar($target,"请先上传代录所需附件",3000,9992);
				return false;
			}
			// $scope.info.insteadItems = form.getCheckedList($('#add_box [mapping="checkboxGroup"] input:checkbox'),{
			// 	trueFlag:'1',
			// 	falseFlag:'0'
			// }).join(',');
			$scope.info.applyId = $scope.info.id;
			http.post(BTPATH.QUERY_INSTEADINFO_LIST,{id:$scope.info.id}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.info.insteadItems = data.data.insteadItems;
					http.post(BTPATH.EDIT_INSTEAD_LIST,$scope.info)
						 .success(function(data){
						 	if(common.isCurrentResponse(data)){
						 		tipbar.infoTopTipbar('编辑资料代录成功,请等待处理!',{});
						 		// tipbar.errorTopTipbar($target,'新增资料代录成功,请等待处理!',3000,9992);
						 		$scope.closeRollModal("edit_box");
						 		$scope.queryList(true);
						 	}else{
						 		tipbar.errorTopTipbar($target,'编辑资料代录失败,服务器返回:'+data.message,3000,9992);
						 	}
					});
				}
				
			});
			
		};

		//代录主列表提交
		$scope.submitMainList = function(target){
			var $target = $(target);
			http.post(BTPATH.CONFIRM_MAININSTEAD_LIST,{id:$scope.info.id})
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		$scope.queryList(true);
				 		$scope.closeRollModal('children_box','fast',function(){
				 			dialog.success('您已成功确认代录数据,请等待审核!',3000);
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'确认代录失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};


		//页面初始化
		$scope.initPage = function(){
			var basePromise = commonService.queryBaseInfoList(BTPATH.QUERY_CUST_LIST,{},$scope,'custList','CustListDic',{
				name:'custName',
				value:'custNo'
			});
			basePromise.success(function(){
				$scope.queryList(true);
			});
		};


		//开启上传(下拉选择附件)
	    $scope.openUploadDropdown = function(event,typeList,list){
		     $scope.uploadConf = {
		        //上传触发元素
		        event:event.target||event.srcElement, 
		        //存放上传文件
		        uploadList:$scope[list],
		        //附件类型列表
		        typeList:$scope[typeList],
		     };
	    };

	    //删除附件项
	    $scope.delUploadItem = function(item,listName){
	    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
	    };

		/*
		 *模板显隐控制区域
		*/
		//打开资料代录录入
		$scope.addInfoBox = function(){
			form.setCheckedList($('#add_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},'0,0,0,0,0,0,0'.split(','));
			$scope.info = {
				insteadType:$scope.typeList[0].value,
				custNo:$scope.custList.length>0?$scope.custList[0].custNo:''
			};
			//置空附件列表
			$scope.attachList = [];
			$scope.openRollModal('add_box');
		};


		//打开资料代录编辑
		$scope.editInfoBox = function(data){
			$scope.info = data;
			//查询附件
			$scope.attachList = [];
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'attachList');
			$scope.openRollModal('edit_box');
		};


		//打开子列表
		$scope.childListBox = function(data){
			$scope.info = data;
			$scope.queryChildList(data).success(function(){
				$scope.openRollModal('children_box');
			});
		};


		//打开导入资料代录
		$scope.detailInfoBox = function(data){
			$scope.info = data;
			//查询附件
			$scope.attachList = [];
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'attachList');
			//查询审核记录
			$scope.queryAuditRecordList(data);
			form.setCheckedList($('#detail_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},data.insteadItems.split(','));
			$scope.openRollModal('detail_box');
		};
		//==============================公共操作区 end ==================================


		//=========================================代录操作处理区域 start==========================================
		//公用属性配置
		var _recordConfig = {
			"4":{
				name:'营业执照信息',
				confirm_path:BTPATH.PASS_CONFIRM_INSTEAD_APPLY,
				edit_path:BTPATH.EDIT_INSTAED_LICENSE,
				detail_path:BTPATH.QUERY_DETAIL_INSTEAD_LICENSE,
				info_name : 'childInfo',
				modal_id:'business_record_box'
			},
			"1":{
				name:'企业法人信息',
				add_path:BTPATH.ADD_INSTAED_LAWYER,
				edit_path:BTPATH.EDIT_INSTAED_LAWYER,
				detail_path:BTPATH.QUERY_DETAIL_INSTEAD_LAWYER,
				info_name : 'childInfo',
				modal_id:'lawyer_record_box'
			},
			"0":{
				name:'公司基本信息',
				add_path:BTPATH.ADD_INSTEAD_RECORD_BASIC,
				edit_path:BTPATH.SAVE_INSTEAD_RECORD_BASIC,
				detail_path:BTPATH.FIND_INSTEAD_RECORD_BASIC,
				info_name : 'childInfo',
				modal_id:'base_record_box'
			},
			"7":{
				name:'平台开户信息',
				add_path:BTPATH.ADD_INSTAED_ACCOUNT,
				edit_path:BTPATH.EDIT_INSTAED_ACCOUNT,
				detail_path:BTPATH.QUERY_DETAIL_INSTEAD_ACCOUNT,
				info_name : 'childInfo',
				modal_id:'account_record_box'
			}
		};
		/*数据字典列表*/
		$scope.corpType = BTDict.CorpType.toArray('value','name');
		$scope.identType = BTDict.IdentType.toArray('value','name');
		$scope.sexType = BTDict.CustSexType.toArray('value','name');
		$scope.eduLevel = BTDict.EduLevel.toArray('value','name');
		$scope.martialStatus = BTDict.MartialStatus.toArray('value','name');
		$scope.premisesType = BTDict.PremisesType.toArray('value','name');

		//获取核心企业的列表
		$scope.childCoreList = BTDict.ScfCoreGroup.toArray('value','name');

		/*公用属性列表*/
		$scope.childUploadList = [];
		//子列表信息
		$scope.childInfo = {};


		/*公用处理函数*/
		//确认代录
		$scope.confirmRecord = function(target,flag){
			var $target = $(target),
				$passBtn = $target.parents('.top-box').find('[mapping="passButton"]'),
				$passModal = $target.parents('.top-box').find('[mapping="pass"]');
			var config = _recordConfig[flag];
			http.post(BTPATH.PASS_CONFIRM_INSTEAD_APPLY,$scope.childInfo)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$passModal.slideUp('fast');
				 		tipbar.infoTopTipbar('确认代录操作成功!',{});
				 		$scope.closeRollModal(config.modal_id);
				 		if(flag === '7'){
				 			$scope.closeRollModal('children_box');
				 			$scope.queryList(true);
				 		}else{
				 			$scope.queryChildList($scope.info);
				 		}
				 	}else{
				 		tipbar.errorTopTipbar($passBtn,'操作失败,服务器返回信息'+data.message,3000,9996);
				 		$scope.$emiter('includeModalHide');
				 	}
				 });
		};

		//查询代录详情
		$scope.detailRecord = function(flag,data){
			var config = _recordConfig[flag];
			var promise = http.post(config.detail_path,data);
			return promise;	 
		};

		//确认驳回代录信息
		$scope.rejectRecord = function(target,flag){
			var $target = $(target),
				$rejectBtn = $target.parents('.top-box').find('[mapping="rejectButton"]'),
				$rejectModal = $target.parents('.top-box').find('[mapping="reject"]');
			var config = _recordConfig[flag];
			http.post(BTPATH.REJECT_CONFIRM_INSTEAD_APPLY,$scope.childInfo)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$rejectModal.slideUp('fast');
				 		tipbar.infoTopTipbar('驳回代录操作成功!',{});
				 		$scope.closeRollModal(config.modal_id);
				 		if(flag === '7'){
				 			$scope.closeRollModal('children_box');
				 			$scope.queryList(true);
				 		}else{
				 			$scope.queryChildList($scope.info);
				 		}
				 	}else{
				 		tipbar.errorTopTipbar($rejectBtn,'驳回失败,服务器返回信息'+data.message,3000,9996);
				 		$scope.$emiter('includeModalHide');
				 	}
				 });
		};

		$scope.linkChildCoreList = function(coreList){
			if((coreList === undefined)&&(coreList==='')) return;
			$scope.childCoreList = ArrayPlus($scope.childCoreList).addKey4ArrayObj('isChecked',false);
			var coreList = coreList.split(',');
			$scope.childCoreList = ArrayPlus($scope.childCoreList).linkAnotherArray(coreList,'value','isChecked',true);
		};


		/*模板显隐控制区域*/
		//打开子信息详情查看模板
		$scope.childInfoReadBox = function(item,doFlag){
			var flag = item.insteadItem,
				config = _recordConfig[flag];
			$scope.childUploadList = [];
			$scope.detailRecord(flag,item).success(function(data){
				if(common.isCurrentData(data)){
					if(item.insteadItem === '7'){
						data.data.provinceNo = (typeof data.data.bankCityno === 'string')&&(data.data.bankCityno.length>0)?data.data.bankCityno.substr(0,2)+'0000':'';
						//关联核心企业
						$scope.$apply(function(){
							$scope.linkChildCoreList(data.data.coreList);
						});
					}
					$scope.$apply(function(){
						$scope.childInfo = $.extend(data.data,{
							modiType:doFlag,
							id:item.id
						});
					});
					commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.data.batchNo},$scope,'childUploadList');
				}
				$scope.openRollModal(config.modal_id);
			});
		};

		//打开驳回模板
		$scope.rejectChildInfoModal = function(target){
			var $target = $(target),
				$rejectModal = $target.parents('.top-box').find('[mapping="reject"]');
			$scope.childInfo.rejecting = true;
			$rejectModal.slideDown('fast',function(){
				common.resizeTopBox($rejectModal);
			});
		};

		//打开审核通过模板
		$scope.passChildInfoModal = function(target){
			var $target = $(target),
				$rejectModal = $target.parents('.top-box').find('[mapping="pass"]');
			$scope.childInfo.rejecting = true;
			$rejectModal.slideDown('fast',function(){
				common.resizeTopBox($rejectModal);
			});
		};

		/*模板相关绑定*/
		$scope.$on('includeModalHide',function(){
			$scope.$apply(function(){
				$scope.childInfo.rejecting = false;
			});
		});


		//=========================================代录操作处理区域 end==========================================


		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

