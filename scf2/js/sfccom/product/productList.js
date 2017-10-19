/*
产品查询
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
		//状态类型
		$scope.statusList = BTDict.FinanceProductStatus.toArray('value','name');
		//融资类型
		$scope.financeTypeList = BTDict.FinanceType.toArray('value','name');
		//保理类型
		$scope.factorTypeList = BTDict.FactorType.toArray('value','name');
		//保理公司列表
		$scope.factorCompList = [];

		//获取客户类型

		//核心企业列表
		$scope.coreCustList = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			factorNo:'',
			coreCustNo:'',
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
		//产品列表
		$scope.infoList = [];
		//单个产品信息
		$scope.info = {};
		
		//产品初始值
		$scope.initInfo = {
			coreCustNo:'',
			financeType:$scope.financeTypeList[0].value,
			factorType:$scope.factorTypeList[0].value
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


		//改变当前操作企业（机构）
		$scope.changeCust = function(){
		  //根据保理公司刷新核心企业列表
		  commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList').success(function(){
		  	$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
		  });
		};



		/*事件处理区域*/
		//查询产品
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取产品申请列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_ALL_PRODUCTLIST,$.extend({},$scope.listPage,$scope.searchData))
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

		//增加产品
		$scope.addInfo = function(target){
			//设置校验项 | 校验
			validate.validate($('#add_box'),validOption);
			var valid = validate.validate($('#add_box'));
			if(!valid) return;

			var $target = $(target);
			http.post(BTPATH.ADD_ONE_PRODUCTLIST,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('新增产品成功,若要生效请上架!',{});
				 		$scope.closeRollModal("add_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增产品失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//编辑产品
		$scope.editInfo = function(target){
			//设置校验项 | 校验
			validate.validate($('#edit_box'),validOption);
			var valid = validate.validate($('#edit_box'));
			if(!valid) return;

			var $target = $(target);
			http.post(BTPATH.EDIT_ONE_PRODUCTLIST,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('修改产品成功,可以进行上架!',{});
				 		$scope.closeRollModal("edit_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改产品失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//激活产品
		$scope.activeInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.SHLVE_ONE_PRODUCTLIST,{id:$scope.info.id})
				 .success(function(data){
				 	if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
				 		tipbar.infoTopTipbar('上架产品成功,已生效!',{});
				 		$scope.queryList(true);
				 		$scope.$apply(function(){
				 			$scope.info = data.data;
				 		});
				 	}else{
				 		tipbar.bubbleTopTipbar($target,'上架失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//注销产品
		$scope.cancelInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.OFFLINE_ONE_PRODUCTLIST,{id:$scope.info.id})
				 .success(function(data){
				 	if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
				 		tipbar.infoTopTipbar('下架产品成功,已失效!',{});
				 		$scope.queryList(true);
				 		$scope.$apply(function(){
				 			$scope.info = data.data;
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'下架失败，服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//删除企业产品信息
		$scope.delInfo = function(data){
			dialog.confirm('请问是否确定删除该条产品信息？',function(){
				http.post(BTPATH.DEL_ONE_PRODUCTLIST,{id:data.id})
					 .success(function(data){
					 	if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					 		$scope.queryList(true);
					 		$scope.$apply(function(){
					 			$scope.info = data.data;
					 		});
					 	}else{
					 		tipbar.infoTopTipbar('删除失败,服务器返回:'+data.message,{msg_box_cls : 'alert alert-warning alert-block'});
					 	}
					 });
			});
		};

		/*
		 *模板显隐控制区域
		*/
		//打开产品录入
		$scope.addInfoBox = function(){
			$scope.info = $.extend({},$scope.initInfo,{
				// coreCustNo:$scope.searchData.coreCustNo
			});
			$scope.openRollModal('add_box');
		};

		//打开产品编辑
		$scope.editInfoBox = function(data){
			$scope.info = [];
			$scope.info = data;
			$scope.openRollModal('edit_box');
		};


		//初始化页面
		commonService.initPage(function(){
		    //当前操作员下机构（保理商列表）
		    commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList','FactorDict').success(function(){
		      $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
		      //核心企业列表
		      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList').success(function(){
		      		$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
		      		//查询产品列表
		      		$scope.queryList(true);
		      });
		    });
		    
		});


		//校验配置
		var validOption = {
		      elements: [{
		          name: 'info.coreCustNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.productCode',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.productName',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.financeType',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.ratio',
		          rules: [{name: 'float'},{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.minLoanDays',
		          rules: [{name: 'int'},{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.maxLoanDays',
		          rules: [{name: 'int'},{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.factorType',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.minFactorAmmount',
		          rules: [{name: 'int'},{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.maxFactorAmmount',
		          rules: [{name: 'int'},{name: 'required'}],
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

