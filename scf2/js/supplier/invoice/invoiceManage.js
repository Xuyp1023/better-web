/*
发票查询
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
		$scope.corpVocateType = BTDict.InvestCorpVocate.toArray('value','name');
		$scope.searchData = {
			custNo:'',
			GTEinvoiceDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEinvoiceDate:new Date().format('YYYY-MM-DD')
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//发票列表
		$scope.infoList = [];

		$scope.info = {};
		//发票详情列表
		$scope.infoMoreList = [];

		$scope.infoMore = {};


		//上传文件列表
		$scope.uploadList = [];

		/*//单个发票信息
		$scope.info = {
			custType:$scope.typeList[1].value
		};*/


		$scope.$watch('infoMore.unit',function(newObj){
			$scope.infoMore.balance = Number(Number(!isNaN($scope.infoMore.unit)?$scope.infoMore.unit:0)*Number(!isNaN($scope.infoMore.amount)?$scope.infoMore.amount:0)).toFixed(2);
		});

		$scope.$watch('infoMore.amount',function(newObj){
			$scope.infoMore.balance = Number(Number(!isNaN($scope.infoMore.unit)?$scope.infoMore.unit:0)*Number(!isNaN($scope.infoMore.amount)?$scope.infoMore.amount:0)).toFixed(2);
		});


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
		//查询发票
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取发票申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_INVOICE,$.extend({},$scope.listPage,$scope.searchData))
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

		//增加发票
		$scope.addInfo = function(target){
			var $target = $(target);
			//设置校验项 | 校验
            var valid = validate.validate($('#add_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
			$scope.info.invoiceItemIds = ArrayPlus($scope.infoMoreList).extractChildArray('id',true);
			http.post(BTPATH.ADD_INFO_INVOICE,$scope.info).success(function(data){
				if(data&&(data.code === 200)){
					//tipbar.errorTopTipbar($target,'新增发票成功!',3000,9992);
					tipbar.infoTopTipbar('新增发票成功!', {});
					$scope.closeRollModal('add_box');
					$scope.queryList(true);
				}else{
					tipbar.errorTopTipbar($target,'新增发票失败,服务器返回:'+data.message,3000,9992);
				}
			});
		};


		//修改发票
		$scope.editInfo = function(target){
			var $target = $(target);
			//设置校验项 | 校验
            var valid = validate.validate($('#edit_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
			$scope.info.invoiceItemIds = ArrayPlus($scope.infoMoreList).extractChildArray('id',true);
			http.post(BTPATH.EDIT_INFO_INVOICE,$scope.info)
			.success(function(data){
				if(data&&(data.code === 200)){
					tipbar.infoTopTipbar('修改发票成功!',{});
					$scope.closeRollModal('edit_box');
					$scope.queryList(true);
				}else{
					tipbar.errorTopTipbar($target,'修改发票失败,服务器返回:'+data.message,3000,9992);
				}
			});
		};

		//删除发票
		$scope.delInfo = function(target,data){
			var $target = $(target);
			dialog.confirm('请确认是否删除此项发票?',function(){
				http.post(BTPATH.DEL_INFO_INVOICE,{id:data.id})
				.success(function(data){
					if(data&&(data.code === 200)){
						$scope.queryList(true);
					}else{
						tipbar.errorTopTipbar($target,'删除发票失败,服务器返回:'+data.message,3000,9000);
					}
				});
			});
		};

		//新增发票详情
		$scope.addInfoMore = function(target){
			var $target = $(target);
			//设置校验项 | 校验
            var valid = validate.validate($('#infoMore_box'));
            if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			http.post(BTPATH.ADD_ONE_INVOICE_MORE,$scope.infoMore).success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.$apply(function(){
				 			$scope.infoMoreList.push(data.data);
				 		})
				 		tipbar.infoTopTipbar('新增发票详情成功!',{});
				 		$scope.closeRollModal('infoMore_box');
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增发票详情失败,服务器返回:'+data.message,3000,7050);
				 	}
				 });
		};

		//本地删除发票详情
		$scope.delinfoMore = function(item){
			$scope.infoMoreList = ArrayPlus($scope.infoMoreList).delChild('id',item.id);
		};


		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList','CustListDic').success(function(){
				$scope.searchData.custNo = common.filterArrayFirst($scope.custList);
				$scope.queryList(true);
			});
		};

		//删除附件项
	    $scope.delUploadItem = function(item,listName){
	    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
	    };

		/*
		 *模板显隐控制区域
		 */
		//打开发票录入
		$scope.addInfoBox = function(){
			validate.validate($('#add_box'),addValidOption);

			$scope.info = {
				modiType:'add',
				infoMoreImBox:[],
				corpVocate:common.filterArrayFirst($scope.corpVocateType, 'name'),
				custNo:common.filterArrayFirst($scope.custList),
				invoiceDate:new Date().format('YYYY-MM-DD')
			};
			$scope.uploadList = [];
			$scope.infoMoreList = [];
			$scope.$$emiterBoxEnabled();
			$scope.openRollModal('add_box');
		};

		//打开发票编辑
		$scope.editInfoBox = function(data){
			validate.validate($('#edit_box'),addValidOption);

			$scope.info = $.extend(true, {},data,{modiType:'edit'});
			$scope.infoMoreList = $scope.info.invoiceItemList;
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
					$scope.$$emiterBoxEnabled();
					$scope.openRollModal('edit_box');
			});
		};

		//打开发票详情
		$scope.detailInfoBox = function(data){
			$scope.info = $.extend(true, {},data,{modiType:'read'});
			$scope.infoMoreList = $scope.info.invoiceItemList;
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
					$scope.$$emiterBoxEnabled();
					$scope.openRollModal('edit_box');
			});
		};

		//添加发票详情
		$scope.infoMoreImBox = function(){
			validate.validate($('#infoMore_box'),infoMoreImValid);
			$scope.openRollModal('infoMore_box');
		};


		//日期处理
		$scope.dateEmitter = {
			changeDateInfo : function(event){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};

		/*数据初始区域*/
		$scope.initPage();


		//校验配置
        var addValidOption = {
              elements: [{
                  name: 'info.custNo',
                  rules: [ {name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.invoiceNo',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.invoiceCode',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.invoiceDate',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.balance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              },{
                  name: 'info.drawer',
                  rules: [{name: 'required'}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };

        var infoMoreImValid = {
              elements: [{
                  name: 'infoMore.subject',
                  rules: [ {name: 'required'}],
                  events: ['blur']
              },{
                  name: 'infoMore.balance',
                  rules: [{name: 'required'},{name: 'money'}],
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

