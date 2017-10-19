/*
客户数字证书查询
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
    var multiple = require("multiSelect");
    require("upload");

	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload','multiple']);

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
	mainApp.controller('mainController',['$scope','http', 'commonService',function($scope,http, commonService){
		/*VM绑定区域*/
		$scope.statusList = BTDict.CustCertStatus.toArray('value','name');
		$scope.certList = [];
		$scope.revokeReasonList = BTDict.CustCertRevokeReason.toArray('value', 'name');
		$scope.ruleList = BTDict.CustCertRuleList.toArray('value', 'name');
		$scope.publishModeList = BTDict.CustCertPublishMode.toArray('value', 'name');
		$scope.certInfo = {};
		$scope.orginSerialNo = "";
		$scope.orginCertId = 0;
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

		//客户数字证书列表
		$scope.infoList = [];
		//单个客户数字证书信息
		$scope.info = {
			
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
		//查询客户数字证书
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;/*1*/
			$scope.queryList(true);
		};

		//获取客户数字证书申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag/*1*/){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;/*1*/
			$scope.searchData.status = $scope.searchData.businStatus;
			http.post(BTPATH.QUERY_CUST_CERTLIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

		//增加客户数字证书
		$scope.addInfo = function(target){
			var $target = $(target);

			//设置校验项 | 校验
            var valid = validate.validate($('#add_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			http.post(BTPATH.ADD_ONE_CUST_CERT/*1*/,$scope.info/*2*/)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		tipbar.infoTopTipbar('新增客户数字证书成功,若要生效请发布该证书!',{});
				 		$scope.closeRollModal('add_box');
				 		commonService.queryBaseInfoList(BTPATH.QUERY_X509_CERT_UNUSEDLIST,{},$scope,'certList');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增客户数字证书失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//删除客户数字证书
		$scope.cancelInfo = function(target){
			var $target = $(target);
			dialog.confirm(/*1*/'请确认是否作废此客户数字证书?',function(){
				http.post(BTPATH.CANCEL_ONE_CUST_CERT/*2*/,{serialNo:$scope.info.serialNo}/*2*/)
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('作废客户数字证书成功!',{});
				 			$scope.closeRollModal('add_box');
							$scope.queryList(true);
						}else{
							tipbar.errorTopTipbar($target,'废此客户数字证书失败,服务器返回:'+data.message,3000,9000);
						}
					});
			});
		};

		//修改客户数字证书
		$scope.editInfo = function(target) {
		    var $target = $(target);

		    //设置校验项 | 校验
            var valid = validate.validate($('#add_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

		    if ($scope.info.status === '8') {
		    	$scope.info.orginSerialNo = $scope.orginSerialNo;
		        http.post(BTPATH.EDIT_ONE_WECHAT_CERT, $scope.info)
		            .success(function(data) {
		                if (data && (data.code === 200)) {
		                    tipbar.infoTopTipbar('修改客户数字证书成功,若要生效请发布!', {});
		                    $scope.closeRollModal('add_box');
		                    $scope.queryList(true);
		                } else {
		                    tipbar.errorTopTipbar($target, '修改客户数字证书失败,服务器返回:' + data.message, 3000, 9992);
		                }
		            });
		    } else {
		    	http.post(BTPATH.EDIT_ONE_CUST_CERT, $scope.info)
			        .success(function(data) {
			            if (data && (data.code === 200)) {
			                tipbar.infoTopTipbar('修改客户数字证书成功,若要生效请发布!', {});
			                $scope.closeRollModal('add_box');
			                $scope.queryList(true);
			            } else {
			                tipbar.errorTopTipbar($target, '修改客户数字证书失败,服务器返回:' + data.message, 3000, 9992);
			            }
			        });
			}
		};


		//修改客户数字证书
		$scope.publishInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.PUBLISH_ONE_CUST_CERT,{serialNo:$scope.info.serialNo, publishMode:$scope.info.publishMode})
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('客户数字证书发布成功!',{});
				 		$scope.closeRollModal('add_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'客户数字证书发布失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//回收客户数字证书
		$scope.revokeInfo = function(target){
			var $target = $(target);
			dialog.confirm(/*1*/'请确认是否作回收客户数字证书?回收后此客户将不能登陆系统！',function(){
				http.post(BTPATH.REVOKE_ONE_CUST_CERT/*2*/,{serialNo:$scope.info.serialNo, reason:$scope.info.reason}/*2*/)
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('回收客户数字证书成功!',{});
				 			$scope.closeRollModal('add_box');
							$scope.queryList(true);
						}else{
							tipbar.errorTopTipbar($target,'回收客户数字证书失败,服务器返回:'+data.message,3000,9000);
						}
					});
			});
		};
		

		//获取企业客户数字证书信息 测试/正式路径:/ScfRequest/queryCredit
		$scope.queryCert = function(){
			var id = $scope.info.certId;
			// if($scope.flag !== 'core') custNo = '0';
			$.post(BTPATH.QUERY_ONE_X509_CERT,{id:id},function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.certInfo = data.data;
					});
				}else{
					$scope.$apply(function(){
						$scope.certInfo = {};
					});
				}
			},'json');
		};

		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_X509_CERT_UNUSEDLIST,{},$scope,'certList');
			$scope.queryList(true);
			var id =  window.location.hash;
			if((!!id)&&(id.length>=1)){
				$scope.info.certId = id.substr(1);
				$scope.info.modiFlag = 'make';
				$scope.$$$MODAL_EVENT_QUEUE = [];
				$scope.$$$MODAL_EVENT_QUEUE.push(function(modal_id){
					if(modal_id === 'add_box'){
						$scope.addInfoBox(true);
					}
				});
			}

		};

		/*
		 *模板显隐控制区域
		*/
		//打开客户数字证书录入
		$scope.addInfoBox = function(flag){
			if(!flag){
				$scope.info = {
					certId:common.filterArrayFirst($scope.certList/*1*/),
					modiFlag:'add'
				};
			}
			$scope.queryCert();
			$scope.$$emiterBoxEnabled();

			validate.validate($('#add_box'),addValidOption);

			$scope.openRollModal("add_box",null,function(){
	          multiple.resizeWidth();
	      	});		
		};

		// 打开回收原因
		$scope.revokeInfoBox = function(){
			$scope.info.reason = common.filterArrayFirst($scope.revokeReasonList/*1*/);
			$scope.info.modiFlag = 'revoke';
		};

		//打开客户数字证书
		$scope.showInfoBox = function(data){
			$scope.info = $.extend({},data);
			$scope.info.modiFlag = 'show';
			// var selArr= $scope.info.ruleList.split(",");
			var selStr= $scope.info.ruleList;
			var selNameArr= [];
			for(var i= 0 ; i<$scope.ruleList.length ; i++){
				var temp = $scope.ruleList[i];
				if(selStr.indexOf(temp.value)!==-1)	selNameArr.push(temp.name);
			}
			$scope.info.ruleListName = selNameArr.toString();
			$scope.queryCert();
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal("add_box",null,function(){
	          // multiple.resizeWidth();
	      	});		
		};

		//打开客户数字证书
		$scope.publishInfoBox = function(data){
			$scope.info = $.extend({},data);
			$scope.info.modiFlag = 'publish';
			// var selArr= $scope.info.ruleList.split(",");
			var selStr= $scope.info.ruleList;
			var selNameArr= [];
			for(var i= 0 ; i<$scope.ruleList.length ; i++){
				var temp = $scope.ruleList[i];
				if(selStr.indexOf(temp.value)!==-1)	selNameArr.push(temp.name);
			}
			$scope.info.publishMode = common.filterArrayFirst($scope.publishModeList/*1*/);
			$scope.info.ruleListName = selNameArr.toString();
			$scope.queryCert();
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal("add_box",null,function(){
	          multiple.resizeWidth();
	      	});		
		};


		//打开客户数字证书编辑
		$scope.editInfoBox = function(data){
			$scope.info = $.extend({},data);
			$scope.info.modiFlag = 'edit';
			$scope.orginSerialNo = $scope.info.serialNo;
			$scope.orginCertId = $scope.info.certId;

			if ($scope.info.status === '8' && $scope.info.certId === -1) {
				$scope.info.certId = common.filterArrayFirst($scope.certList/*1*/);
			}
			var selStr= $scope.info.ruleList;
			var selNameArr= [];
			for(var i= 0 ; i<$scope.ruleList.length ; i++){
				var temp = $scope.ruleList[i];
				if(selStr.indexOf(temp.value)!==-1)	selNameArr.push(temp.name);
			}
			$scope.info.ruleListName = selNameArr.toString();
			
			$scope.queryCert();
			$scope.$$emiterBoxEnabled();

			validate.validate($('#add_box'),addValidOption);

			$scope.openRollModal("add_box",null,function(){
	          multiple.resizeWidth();
	      	});		
		};


		//打开导入客户数字证书
		$scope.importBlackList = function(){
			$('#import_box').slideDown('fast');
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframe();  
		});


          var addValidOption = {//新增表单的写法
              elements: [{
                  name: 'info.certId',
                  rules: [
                    {name: 'required'}
                  ],
                  events: ['blur']
              },{
                  name: 'info.custName',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.identNo',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.contName',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.contPhone',
                  rules: [{name: 'required'}, {name:'mobile'}],
                  events: ['blur']
              },{
                  name: 'info.email',
                  rules: [{name: 'required'}, {name:'email'}],
                  events: ['blur']
              },{
                  name: 'info.operOrg',
                  rules: [{name: 'required'}, {name:'strmin', params:{strmin:5}}],
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

