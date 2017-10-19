/*
还款融资申请查询
作者:tanp
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
    var date = require("date");
    require('modal');
    require('date');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date']);

	//扩充公共服务
	comservice.servPlus(mainApp);
	//扩充公共指令库
	comdirect.direcPlus(mainApp);
	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){
		$scope.custList = [];
		$scope.factorList = [];
		$scope.coreCustList = [];
		/*VM绑定区域*/
		$scope.searchData = {
			custNo:'',
			coreCustNo:'',
			factorNo:'',
			GTEactualDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEactualDate :new Date().format('YYYY-MM-DD')
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//还款融资申请列表
		$scope.infoList = [];
		//单个还款融资申请信息
		$scope.financeInfo = {};


		//订单各元素单个详情
		$scope.anInfo = {};
		$scope.anInfoMoreList = [];
		$scope.anUploadList = [];


		$scope.contractList = [];		//合同列表
		$scope.paymentRecordList = [];	//还款记录列表
		$scope.pressMoneyList = [];		//催收列表
		$scope.exemptList = [];			//豁免列表

		/*关联 VM*/
		$scope.orderList = [];	//订单列表
		$scope.recieveList = [];//应收账款列表
		$scope.billList = [];	//票据列表

		/* 关联列表 配置 */
		var _linkedConfig = {
			1:{
				type:'order',
				list_name:'orderList'		//列表VM名称
			},
			2:{
				type:'bill',
				list_name:'billList'		//列表VM名称
			},
			3:{
				type:'recieve',
				list_name:'recieveList'	  	//列表VM名称
			},
			4:{	//供应商融资，也是查询订单列表
				type:'order',
				list_name:'orderList'		//列表VM名称
			}
		};
		// 关联类型（即融资申请类型）
		$scope.linkedType = '';

		//重置数据
		function resetData(){
			//置空关联列表
			$scope.orderList = [];
			$scope.recieveList = [];
			$scope.billList = [];
		}

		//当前登录角色
		$scope.currRole = "";
		//检查机构类型 是否是供应商
		$scope.checkOrgType = function(){
		    http.post(BTPATH.CHECK_ORG_TYPE,{role:'SUPPLIER_USER'}).success(function(data){
		        if(data.data){
		            $scope.$apply(function(){
		                //检查成功
		                $scope.currRole = "supplier";
		            });
		        }
		    });
		};


		/*事件处理区域*/
		//查询还款融资申请
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//改变机构的联动
		$scope.changeCust = function(){
			//核心企业列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
				$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);

			});
			//保理公司列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList','FactorListDic').success(function(){
				$scope.searchData.factorNo = common.filterArrayFirst($scope.factorList);
			});
		};

		//获取还款融资申请列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			$scope.listPage.flag = flag? 1 : 2;
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.QUERY_REPAYMENTREQUEST,$.extend({},$scope.searchData,$scope.listPage),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.infoList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			},'json');
		};


		//提醒还款
		$scope.notifyPay = function(item){
			var promise = http.post(BTPATH.NOTIFY_REPAYMENT,{"requestNo":item.requestNo}).success(function(data){
			    if(data.code === 200){
			       tipbar.infoTopTipbar('提醒还款成功!',{});
			    }else{
			    	tipbar.infoTopTipbar('提醒还款失败，服务端返回信息:'+data.message,{
		            msg_box_cls : 'alert alert-warning alert-block',
		            during:4000
		        });
			    }
			});
			return promise;
		};


		//查询融资详情 传入申请单编号
		$scope.queryFinanceInfo = function(requestNo){
			var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope.financeInfo = data.data;
			      });
			    }
			});
			return promise;
		};


		//查询关联列表（订单|应收账款|票据）
		$scope.querySelectList = function(data){
		  //置空关联类型
		  $scope.linkedType = '';
		  var requestType = data.requestType,
		      	requestNo = data.requestNo,
		      	config = _linkedConfig[requestType];
		  if(requestType && config){
		    //设置关联类型
		    $scope.linkedType = config.type;
		    http.post(BTPATH.FIANACE_REQUEST_LINKED_LIST,{"requestType":requestType,"requestNo":requestNo}).success(function(data){
		        if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		          $scope.$apply(function(){
		              $scope[config.list_name] = common.cloneArrayDeep(data.data);
		          });
		        }
		    });
		  }
		};


		//查看单个还款融资申请详情
		$scope.showInfoDetail = function(data){
			//查询融资详情
			$scope.queryFinanceInfo(data.requestNo).success(function(){
				resetData();
				//查询关联列表（订单|应收账款|票据）
				$scope.querySelectList(data);
				//还款记录列表
				commonService.queryBaseInfoList(BTPATH.FIND_PAYMENT_RECORD_LIST,{requestNo:data.requestNo},$scope,'paymentRecordList');
				//豁免列表
				commonService.queryBaseInfoList(BTPATH.FIND_EXEMPT_LIST,{requestNo:data.requestNo},$scope,'exemptList');
				//催收列表
				commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{requestNo:data.requestNo},$scope,'pressMoneyList');
				//合同列表(协议列表)
				commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
			});
			$scope.openRollModal('fix_operator_info_box');
		};


		// 融资依赖详情查看
		$scope.showfactorProofDetail = function(type,data){
		    detailShow.getFinanceCredentialDetail($scope,type,data.id);
		};


		//---------------------------------协议查看相关 ------------------------------------

		//合同相关文件展示
		$scope.getStaticPage = function(){
			//获取iframe
			var $detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
			$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}else{
					//动态修改iframe中内容
					$detail_iframe.find("body").html("");
				}
			},'json');
		};


		//查看协议详情
		$scope.showAgreeInfo = function(data){
			$scope.AgreementDetail = $.extend({},data);
			//获取静态页面
			$scope.getStaticPage();
			$scope.openRollModal("look_agree_info_box");
		};


		//查看 订单 汇票 应收 各个关联项详情
		$scope.showAllInfoDetail = function(data,type){
			var box_id = '';
			$scope.anInfo = $.extend({},data);
			if(type === 'contract'){
				$scope.anInfo.status = '1';
				box_id = 'contract_detail_box';
			}else if(type === 'invoice'){
				$scope.anInfo.modiType = 'read';
				box_id = 'invoice_detail_box';
			}else if (type === 'transport') {
				$scope.anInfo.modiType = 'read';
				box_id = 'transport_detail_box';
			}

			$scope.emiterBoxEnabled();
			//获取附件信息
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'anUploadList').success(function(){
				$scope.openRollModal(box_id);
			});
		};



		//页面初始化
		$scope.initPage = function(){
			//获取机构列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList','CustListDic').success(function(){
				$scope.searchData.custNo = common.filterArrayFirst($scope.custList);
				//核心企业列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
					$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
					//保理公司列表
					commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList','FactorListDic').success(function(){
						$scope.searchData.factorNo = common.filterArrayFirst($scope.factorList);
						//获取融资状态
						commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
							name:'nodeCustomName',
							value:'sysNodeId'
						}).success(function(){
							$scope.queryList(true);
						});
					});
				});
			});
			//检查当前机构类型
			$scope.checkOrgType();
		};

		/*数据初始区域*/
		$scope.initPage();


	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});
