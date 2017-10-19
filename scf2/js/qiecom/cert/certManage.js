/*
数字证书查询
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
	mainApp.controller('mainController',['$scope','http','commonService',function($scope,http,commonService){
		/*VM绑定区域*/
		$scope.statusList = BTDict.CertX509Status.toArray('value','name');
		$scope.typeList = BTDict.BlacklistType.toArray('value','name');
		$scope.creditInfo = [];
		$scope.signerList = [];
		$scope.isSelectShow = true;
		$scope.searchData = {
			businStatus:'',
			//MM代表月 YYYY年 DD日
			GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEregDate:new Date().format('YYYY-MM-DD'),
			GTEcreateDate:new Date().getSubDate('YYYY',1).format('YYYY-MM-DD'),
			LTEvalidDate:new Date().getSubDate('YYYY',-10).format('YYYY-MM-DD')
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//数字证书列表
		$scope.infoList = [];
		//单个数字证书信息
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
		//查询数字证书
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;/*1*/
			$scope.queryList(true);
		};

		//获取数字证书申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag/*1*/){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;/*1*/
			$scope.searchData.certStatus = $scope.searchData.businStatus;
			http.post(BTPATH.QUERY_X509_CERTLIST/*2*/,$.extend({},$scope.listPage, $scope.searchData))
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

		//增加数字证书
		$scope.addInfo = function(target){
			var $target = $(target);

			//设置校验项 | 校验
            var valid = validate.validate($('#add_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);
			
			http.post(BTPATH.ADD_ONE_X509_CERT/*1*/,$scope.info/*2*/)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){	
				 		tipbar.infoTopTipbar('新增数字证书成功!',{});
				 		$scope.closeRollModal('add_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增数字证书失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};


		//修改数字证书
		$scope.editInfo = function(target){
			var $target = $(target);

			//设置校验项 | 校验
            var valid = validate.validate($('#add_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);
			
			http.post(BTPATH.EDIT_ONE_X509_CERT,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('修改数字证书成功!',{});
				 		$scope.closeRollModal('add_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改数字证书失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

	
		//注销数字证书
		$scope.cancelInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.CANCEL_ONE_X509_CERT,{id:$scope.info.id, serialNo:$scope.info.serialNo})
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('作废数字证书成功!',{});
				 		$scope.closeRollModal('add_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.bubbleTopTipbar($target,'作废数字证书失败，服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//获取企业数字证书信息 测试/正式路径:/ScfRequest/queryCredit
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


		$scope.$watch('info.year',function(newValue,oldValue){
			if(!$scope.info || $scope.info.modiFlag!=="add"){
				return false;
			}
			$scope.info.validDate = '';

			var numReg = /^[1-9]\d*$/;
			if(!newValue || !numReg.test(newValue))  return false;
			
			if(newValue && newValue!==oldValue){
				$scope.info.validDate = new Date().getSubDate('YYYY',newValue*-1).format('YYYY-MM-DD')
			}
		});

		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_X509_SIGNERLIST,{},$scope,'signerList');
			$scope.queryList(true);
		};

		/*
		 *模板显隐控制区域
		*/
		//打开数字证书录入
		$scope.addInfoBox = function(){
			$scope.info = {
				signer:common.filterArrayFirst($scope.signerList/*1*/),
				modiFlag:'add',
				createDate:new Date().format('YYYY-MM-DD')
			};
			validate.validate($('#add_box'),addValidOption);
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal('add_box');
		};

		//打开数字证书详情
		$scope.showInfoBox = function(data){
			$scope.info = $.extend({},data);
			$scope.info.modiFlag='show';
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal('add_box');
		};

		//打开数字证书编辑
		$scope.editInfoBox = function(data){
			$scope.info = $.extend({},data);
			$scope.info.modiFlag='edit';
			validate.validate($('#add_box'),addValidOption);
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal('add_box');
		};

		//制作
		$scope.makeInfoBox = function(data){
			window.location.href = 'custCertManage.html#'+data.id;
		};

		//打开导入数字证书
		$scope.importBlackList = function(){
			$('#import_box').slideDown('fast');
		};


				//校验配置
        var addValidOption = {//新增表单的写法
              elements: [{
                  name: 'info.signer',
                  rules: [
                    {name: 'required'}
                  ],
                  events: ['blur']
              },{
                  name: 'info.commName',
                  rules: [{name: 'required'}, {name:'strmin', params:{strmin:8}}],
                  events: ['blur']
              },{
                  name: 'info.orgName',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.email',
                  rules: [{name: 'required'}, {name:'email'}],
                  events: ['blur']
              },{
                  name: 'info.year',
                  rules: [{name: 'required'}, {name:'int'}, {name:'min', params:{min:1}}, {name:'max', params:{max:10}}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
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

