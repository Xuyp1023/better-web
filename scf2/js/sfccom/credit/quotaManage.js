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

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
		/*VM绑定区域*/
		$scope.creditTypeList = BTDict.CreditMode.toArray('value','name');
		$scope.typeList = BTDict.CreditType.toArray('value','name');
		$scope.creditInfo = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			factorNo:'',
			creditType:'',
			GTEregDate:'',
			LTEregDate:''
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
		$scope.info = {
			creditType:$scope.typeList[0].value,
			creditMode:$scope.creditTypeList[0].value,
			custNo : '',
			coreCustNo : ''
		};

		//保理公司列表
		$scope.factorCompList = [];
		//客户列表
		$scope.custList = [];
		//核心企业列表
		$scope.coreCustList = [];
		//保理合同列表
		$scope.contractList = [];
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

		/*事件处理区域*/
		//查询额度
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//客户类型变化 联动 刷新客户列表(供应商|经销商|核心企业)
		$scope.typeSwitch = function(){
			var param = {
				'factorNo':$scope.searchData.factorNo,
				'creditType':$scope.info.creditType
			};
			commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_CUST_RELATION,param,$scope,'custList').success(function(){
				$scope.info.custNo = common.filterArrayFirst($scope.custList);//默认值
				$scope.$apply(function(){
					$scope.custChange();
				});
				
			});
		};

		//选择客户 变化
		$scope.custChange = function(){
			//type ：1|2|3  供应商|经销商|核心企业
			var type = $scope.info.creditType+'';
			var param = {
					custNo:$scope.info.custNo,
					factorNo:$scope.searchData.factorNo,
					agreeType:3	//保理合同
				};
			//查询相关核心企业
			if(type && type==='3'){
				$scope.coreCustList = ArrayPlus($scope.custList).objectChildFilter('value',$scope.info.custNo);
				$scope.info.coreCustNo = $scope.info.custNo;
			}else{
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.info.custNo},$scope,'coreCustList').success(function(){
					$scope.info.coreCustNo = common.filterArrayFirst($scope.coreCustList);
				});
			}
			//查询保理合同列表
			commonService.queryBaseInfoList(BTPATH.FIND_FINANCE_CONTRACT,param,$scope,'contractList').done(function(){
				$scope.$apply(function(){
					$scope.info.agreeId = $scope.contractList[0] ?　$scope.contractList[0].value : '';
				});
			});
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
			//查询不需要factorNo
			var searchData = $.extend({},$scope.searchData);
			delete searchData.factorNo;
			http.post(BTPATH.QUERY_ALL_QUOTALIST,$.extend({},$scope.listPage,searchData))
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


		//增加额度
		$scope.addInfo = function(target){

			//设置校验项 | 校验
			validate.validate($('#add_box'),validOption);
			var valid = validate.validate($('#add_box'));
			if(!valid) return;

			var $target = $(target);
			http.post(BTPATH.ADD_ONE_QUOTALIST,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('新增授信信息成功,若要生效请激活!',{});
				 		$scope.closeRollModal("add_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增授信信息失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//编辑额度
		$scope.editInfo = function(target){

			//设置校验项 | 校验
			validate.validate($('#edit_box'),validOption);
			var valid = validate.validate($('#edit_box'));
			if(!valid) return;

			var $target = $(target);
			http.post(BTPATH.EDIT_ONE_QUOTALIST,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('修改额度成功,若要生效请激活!',{});
				 		$scope.closeRollModal("edit_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改额度失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//激活额度
		$scope.activeInfo = function(target){
			var $target = $(target);

			//激活必须选择 保理合同
			if(!$scope.info.agreeId){
				tipbar.errorTopTipbar($target,'请选择保理合同！',3000,9992);
				return false;
			}
			
			http.post(BTPATH.ACTIVE_ONE_QUOTALIST,{id:$scope.info.id})
				 .success(function(data){
				 	if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
				 		tipbar.infoTopTipbar('激活额度成功,已生效!',{});
				 		$scope.queryList(true);
				 		$scope.$apply(function(){
				 			$scope.info = data.data;
				 		});
				 	}else{
				 		tipbar.bubbleTopTipbar($target,'激活失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//注销额度
		$scope.cancelInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.CANCEL_ONE_QUOTALIST,{id:$scope.info.id})
				 .success(function(data){
				 	if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
				 		tipbar.infoTopTipbar('注销额度成功,已失效!',{});
				 		$scope.queryList(true);
				 		$scope.$apply(function(){
				 			$scope.info = data.data;
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'注销失败，服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		/*
		 *模板显隐控制区域
		*/
		//打开额度录入
		$scope.addQuota = function(){
			$scope.info = {
				creditType:$scope.typeList[0].value,
				creditMode:$scope.creditTypeList[0].value
			};
			//获取客户列表
			$scope.typeSwitch();
			$scope.openRollModal('add_box');
		};

		//打开额度编辑
		$scope.editInfoBox = function(data){
			$scope.info = data;
			//客户类型 ：1|2|3  供应商|经销商|核心企业
			var creditType = $scope.info.creditType+'';
			var param = {
					custNo:$scope.info.custNo,
					factorNo:$scope.searchData.factorNo,
					agreeType:3	//保理合同
				};
			//获取客户列表
			commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_CUST_RELATION,{'factorNo':$scope.searchData.factorNo,'creditType':creditType},$scope,'custList').success(function(){
				//查询相关核心企业
				if(creditType && creditType==='3'){
					$scope.coreCustList = ArrayPlus($scope.custList).objectChildFilter('value',$scope.info.custNo);
				}else{
					commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.info.custNo},$scope,'coreCustList');
				}
				//查询保理合同列表
				commonService.queryBaseInfoList(BTPATH.FIND_FINANCE_CONTRACT,param,$scope,'contractList').done(function(){
					// $scope.info.agreeId = $scope.contractList[0] ?　$scope.contractList[0].value : '';
					$scope.$$emiterBoxEnabled();
				});				
			});
			$scope.openRollModal('edit_box');
		};

		//打开变动详情
		$scope.detaiInfoBox = function(data){
			$scope.info = data;
			$scope.queryQuotaChange(true,function(){
				$scope.openRollModal('detail_box');
			});
		};



		//初始化页面
		commonService.initPage(function(){
		    //当前操作员下机构（保理商列表）
		    commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
			      $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
			      //查询授信列表
			      $scope.queryList(true);
		    });
		});


		//校验配置
		var validOption = {
		      elements: [{
		          name: 'info.custNo',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'info.coreCustNo',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'info.creditLimit',
		          rules: [{name: 'required'},{name: 'float'}],
		          events:['blur']
		      },{
		          name: 'info.startDate',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'info.endDate',
		          rules: [{name: 'required'}],
		          events:['blur']
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

