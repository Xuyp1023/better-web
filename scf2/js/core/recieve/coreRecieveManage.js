/*
应付账款管理
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
	mainApp.controller('mainController',['$scope','http','commonService','form','easyPlugin',function($scope,http,commonService,form,easyPlugin){
		/*VM绑定区域*/
		$scope.statusList = BTDict.BillNoteStatus.toArray('value','name');
		$scope.typeList = BTDict.BillNoteType.toArray('value','name');
		$scope.modeType = BTDict.BillFlowMode.toArray('value','name');
		$scope.markType = BTDict.FinancingMark.toArray('value','name');
		$scope.custList = [];
		$scope.coreCustList = [];
		//附件类型
		$scope.uploadType = ArrayPlus(BTDict.BaseInfoFile.toArray('value','name')).extractChildArrayByindexArray([1,2,3,4,5,6]);
		//==============================公共操作区 start=================================
		$scope.searchData = {
			custNo:'',
			coreCustNo:'',
			receivableNo:'',
			GTEendDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEendDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
			isOnlyNormal:'0'
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//应收账款管理列表
		$scope.infoList = [];
		//单个应收账款管理信息
		$scope.info = {};
		//文件列表
		$scope.otherFileList = [];
		$scope.infoFileList = [];



		//主列表操作控制
		$scope.mainListCtrl = {
			isCanDo : function(data){
				var businStatus = data.businStatus;
				var aduit = data.aduit;
				if(!aduit || aduit*1===1) return false;
				return !businStatus||ArrayPlus(['0']).isContain(businStatus);
			},
			isCanRead:function(data){
				var businStatus = data.businStatus;
				return ArrayPlus(['0','1','2']).isContain(businStatus);
			}
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

		/*事件处理区域*/
		//查询应收账款管理
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//根据机构联动查询条件
		$scope.changeQueryCust = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'custList','CustListDic').success(function(){
				$scope.$apply(function(){
					$scope.searchData.custNo = common.filterArrayFirst($scope.custList);
				});
			});
		};

		//根据机构联动新增页面
		$scope.changeCust = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.info.coreCustNo},$scope,'supplierList').success(function(){
				$scope.$apply(function(){
					$scope.info.custNo = common.filterArrayFirst($scope.supplierList);
				});
			});
		};

		//获取应收账款管理申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_RECIEVE,$.extend({},$scope.listPage,$scope.searchData))
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

		//添加应收账款
		$scope.addInfo = function(target){
			var $target = $(target);

			var valid = validate.validate($('#add_box'));
			if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			$scope.info.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);
			$scope.info.otherFileList = ArrayPlus($scope.otherFileList).extractChildArray('id',true);
			http.post(BTPATH.ADD_INFO_RECIEVE,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('添加应付账款成功!',{});
				 		$scope.closeRollModal('add_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'添加应付账款失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//编辑应付账款管理
		$scope.editInfo = function(target){
			var $target = $(target);

			var valid = validate.validate($('#edit_box'));
			if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			$scope.info.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);
			$scope.info.otherFileList = ArrayPlus($scope.otherFileList).extractChildArray('id',true);
			http.post(BTPATH.EDIT_INFO_RECIEVE,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('修改应付账款成功!',{});
				 		$scope.closeRollModal('edit_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改应付账款失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//审核应付账款
		$scope.aduitInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.ADUIT_INFO_RECIEVE,{id:$scope.info.id}).success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('应付账款审核成功!',{});
				 		$scope.closeRollModal('detail_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'应付账款审核失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
				$scope.searchData.coreCustNo = $scope.coreCustList[0].value;
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'custList','CustListDic').success(function(){
					$scope.searchData.custNo = $scope.custList[0].value;
					$scope.queryList(true);
				});
			});

		};

		/*
		 *模板显隐控制区域
		*/

		//新增应付账款
		$scope.addInfoBox = function(){
			validate.validate($('#add_box'),addValidOption);

			$scope.supplierList = [];
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'supplierList');
			$scope.info = {
				endDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
				custNo:$scope.searchData.custNo,
				coreCustNo:$scope.searchData.coreCustNo,
				modiType:'add'
			};
			$scope.openRollModal('add_box');
		};

		//打开应付账款详情
		$scope.detailInfoBox = function(data){
			$scope.info = data;
			// $scope.$$emiterBoxEnabled();
			$scope.openRollModal('detail_box');
			// commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{id:data.batchNo},$scope,'infoFileList').success(function(){
			// 	commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{id:data.otherBatchNo},$scope,'otherFileList').success(function(){

			// 	});
			// });
		};

		//打开应付账款详情
		$scope.aduitInfoBox = function(data){
			$scope.info = $.extend(data,{modiType:'aduit'});
			// $scope.$$emiterBoxEnabled();
			$scope.openRollModal('detail_box');
		};

		//打开应付账款编辑
		$scope.editInfoBox = function(data){
			validate.validate($('#edit_box'),addValidOption);

			$scope.supplierList = [];
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:data.coreCustNo},$scope,'supplierList');
			$scope.info = $.extend(data,{modiType:'edit'});
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal('edit_box');
		};

		//==============================公共操作区 end ==================================


		/*数据初始区域*/
		$scope.initPage();

		var addValidOption = {
		      elements: [{
		          name: 'info.coreCustNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.custNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.receivableNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.debtor',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.creditor',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.endDate',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.balance',
		          rules: [{name: 'required'},{name: 'money'}],
		          events: ['blur']
		      },{
		          name: 'info.unit',
		          rules: [{name: 'money'}],
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
