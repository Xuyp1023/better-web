/*
黑名单查询
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
	mainApp.controller('mainController',['$scope','http',function($scope,http){
		/*VM绑定区域*/
		$scope.statusList = BTDict.BlacklistStatus.toArray('value','name');
		$scope.typeList = BTDict.BlacklistType.toArray('value','name');
		$scope.creditInfo = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			businStatus:'',
			//MM代表月 YYYY年 DD日
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
		//黑名单列表
		$scope.infoList = [];
		//单个黑名单信息
		$scope.info = {
			custType:$scope.typeList[1].value
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

		/*事件处理区域*/
		//查询黑名单
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;/*1*/
			$scope.queryList(true);
		};

		//获取黑名单申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag/*1*/){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;/*1*/
			http.post(BTPATH.QUERY_ALL_BLACKLIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
							if(flag/*1*/){
								$scope.listPage = data.page;/*4*/
							}
						});
					} 	
			});
		};

		//增加黑名单
		$scope.addInfo = function(target){
			var $target = $(target);
			//设置校验项 | 校验
			var valid = validate.validate($('#add_box'));
			if(!valid) return tipbar.errorTopTipbar($target,'还有未正确填写项，请修改后提交！',3000,9992);
			
			if($scope.info.custType === '1'){
				$scope.info.identNo = $scope.info.corpIdentNo;
			}
			http.post(BTPATH.ADD_ONE_BLACKLIST/*1*/,$scope.info/*2*/)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('新增黑名单成功,若要生效请激活',{});
				 		$scope.closeRollModal('add_box');
				 		// tipbar.errorTopTipbar($target,/*3*/'新增黑名单成功,若要生效请激活!',3000,9992);
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增黑名单失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//删除黑名单
		$scope.delInfo = function(target,data){
			var $target = $(target);

			dialog.confirm(/*1*/'请确认是否删除此项黑名单?',function(){
				http.post(BTPATH.DEL_ONE_BLACKLIST/*2*/,{id:data.id}/*2*/)
					.success(function(data){
						if(data&&(data.code === 200)){
							$scope.queryList(true);
						}else{
							tipbar.infoTopTipbar('删除黑名单失败,服务器返回:'+data.message,{});
						}
					});
			});
		};

		//修改黑名单
		$scope.editInfo = function(target){
			var $target = $(target);
			//设置校验项 | 校验
			var valid = validate.validate($('#edit_box'));
			if(!valid) return tipbar.errorTopTipbar($target,'还有未正确填写项，请修改后提交！',3000,9992);

			if($scope.info.custType === '1'){
				$scope.info.identNo = $scope.info.corpIdentNo;
			}
			http.post(BTPATH.EDIT_ONE_BLACKLIST,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.errorTopTipbar($target,'修改黑名单成功,若要生效请激活!',3000,9992);
				 		// tipbar.infoTopTipbar('新增'+config.name+'代录成功,请等待复核生效!',{});
				 		// $scope.closeRollModal(config.modal_id);
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改黑名单失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//激活黑名单
		$scope.activeInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.ACTIVE_ONE_BLACKLIST,{id:$scope.info.id})
				 .success(function(data){
				 	if(common.isCurrentData(data)){
				 		tipbar.infoTopTipbar('激活黑名单成功,已生效!',{});
				 		$scope.queryList(true);
				 		$scope.$apply(function(){
				 			$scope.info = data.data;
				 			if($scope.info.custType === '1'){
								$scope.info.corpIdentNo = $scope.info.identNo;
							}
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'激活失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//注销黑名单
		$scope.cancelInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.CANCEL_ONE_BLACKLIST,{id:$scope.info.id})
				 .success(function(data){
				 	if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
				 		tipbar.infoTopTipbar('注销黑名单成功,若要重新生效请激活!',{});
				 		$scope.queryList(true);
				 		$scope.$apply(function(){
				 			$scope.info = data.data;
				 			if($scope.info.custType === '1'){
								$scope.info.corpIdentNo = $scope.info.identNo;
							}
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'注销失败，服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//获取企业黑名单信息 测试/正式路径:/ScfRequest/queryCredit
		$scope.queryCredit = function(){
			var custNo = $scope.searchData.custNo;
			// if($scope.flag !== 'core') custNo = '0';
			$.post(BTPATH.CREDIT_PATH,{custNo:custNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.creditInfo = data.data;
					});
				}
			},'json');
		};

		//切换校验效果
		$scope.resetValid = function(wrap_id){
			$('body').trigger('close_tip_active','#'+wrap_id);
		};

		//页面初始化
		$scope.initPage = function(){
			$scope.queryList(true);
		};

		/*
		 *模板显隐控制区域
		*/
		//打开黑名单录入
		$scope.addInfoBox = function(){
			validate.validate($('#add_box'),validOption);
			$scope.info = {
				custType:common.filterArrayFirst($scope.typeList/*1*/)
			};
			$scope.openRollModal('add_box');
		};

		//打开黑名单编辑
		$scope.editInfoBox = function(data){
			validate.validate($('#edit_box'),validOption);
			$scope.info = $.extend({},data);
			if($scope.info.custType === '1'){
				$scope.info.corpIdentNo = $scope.info.identNo;
			}
			$scope.openRollModal('edit_box');
		};

		//打开导入黑名单
		$scope.importBlackList = function(){
			$('#import_box').slideDown('fast');
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframe();  
		});

		//新增校验规则
		var validOption = {
			elements: [{
			  name: 'info.name',
			  rules: [{name: 'required'}],
			  events: ['keyup']
			},{
			  name: 'info.identNo',
			  rules: [{name: 'required'},{name:'identNo'}],
			  events: ['keyup']
			},{
			  name: 'info.corpIdentNo',
			  rules: [{name: 'required'},{name:'corpCode'}],
			  events: ['keyup']
			},{
			  name: 'info.lawName',
			  rules: [{name: 'required'},{name:'name'}],
			  events: ['keyup']
			},{
			  name: 'info.disBehavior',
			  rules: [{name: 'required'}],
			  events: ['keyup']
			}],
			errorPlacement: function(error, element) {
			  var label = element.parents('td').prev().text().substr(0);
			  tipbar.tdTipbar(element,label+':'+error);
			  // tipbar.errorLeftTipbar(element,label+':'+error,0,99999);
			}
		};

		/*数据初始区域*/
		$scope.initPage();
		

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

