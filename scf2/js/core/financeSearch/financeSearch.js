/*
供应商融资申请查询
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

	//扩充公共服务|指令|过滤器
	comservice.servPlus(mainApp);
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){

		$scope.custList = [];
		$scope.factorList = [];
		$scope.coreCustList = [];
		$scope.supplierList=[];
		$scope.statusList = BTDict.RequestLastStatus.toArray('value','name').slice(2);

		/*VM绑定区域*/
		$scope.searchData = {
			custNo:'',
			coreCustNo:'',
			factorNo:'',
			lastStatus:'2,3,4,5,6,7,8'	//2审批中，3放款中，4还款中， 5逾期，6 展期，7坏帐，8 结清
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//供应商融资申请列表
		$scope.infoList = [];
		//单个供应商融资申请信息
		$scope.financeInfo = {};

		//区分不同库户类型标志
		$scope.custTypeInfo = function(){
		  var custFlag = location.hash.substr(1),
		      custTypeInfo = {},
		      isSupplier = custFlag === 'supplier';
		  custTypeInfo.cust_list_path = isSupplier?BTPATH.QUERY_DIC_SUPPLIERLIST:BTPATH.QUERY_DIC_AGENCYLIST;
		  custTypeInfo.cust_type_name = isSupplier?'供应商':'经销商';
		  custTypeInfo.is_need_repay_notice = isSupplier?false:true;
		  //设置查询条件： 客户类别
		  $scope.searchData.custType = isSupplier?'1':'2';
		  return custTypeInfo;
		}();


		//订单列表
		$scope.orderList = [];
		//应收账款列表
		$scope.recieveList = [];
		//票据列表
		$scope.billList = [];

		/* 关联列表 配置 */
		var _linkedConfig = {
		  1:{
		    type:'order',
		    list_name:'orderList'    //列表VM名称
		  },
		  2:{
		    type:'bill',
		    list_name:'billList'   //列表VM名称
		  },
		  3:{
		    type:'recieve',
		    list_name:'recieveList'    //列表VM名称
		  },
		  4:{ //供应商融资，也是查询订单列表
		    type:'order',
		    list_name:'orderList'    //列表VM名称
		  }
		};
		// 关联类型（即融资申请类型）
		$scope.linkedType = '';




		/*事件处理区域*/
		//查询供应商融资申请
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//改变机构的联动
		$scope.changeCust = function(){
			//供应商列表
			commonService.queryBaseInfoList($scope.custTypeInfo.cust_list_path,{coreCustNo:$scope.searchData.coreCustNo},$scope,'supplierList','supplierListDic').success(function(){
				// $scope.searchData.custNo =common.filterArrayFirst($scope.supplierList);
				$scope.searchData.custNo = '';
           	});
            //保理公司列表
           commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.coreCustNo},$scope,'factorList','factorListDic').success(function(){
				// $scope.searchData.factorNo = common.filterArrayFirst($scope.factorList);
				$scope.searchData.factorNo = '';
            });
		};

		//获取供应商融资申请列表
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			$scope.listPage.flag = flag? 1 : 2;
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.QUERY_FINANCE_LIST,$.extend({},$scope.searchData,$scope.listPage),function(data){
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


		//-------------------------------------融资详情相关操作 start ------------------------------


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


		//---------------------------------提醒还款相关 ------------------------------------

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



		//---------------------------------协议查看相关 ------------------------------------

		//合同相关文件展示
		$scope.getStaticPage = function(){
			$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//获取iframe
					$detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}
			},'json');
		};


		//合同相关文件展示（通过 请求编号和 协议类型 查找）
		$scope.getStaticPageByRequestNo = function(){
			var param={
				requestNo:$scope.financeInfo.requestNo,
				agreeType:1	//'1','债权转让确认书'
			};
			$.post(BTPATH.FIND_AGREE_PAGE_BY_REQUESTNO,param,function(data){
				if(data && data.code === 200){
					//获取iframe
					$detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
					//动态修改iframe中内容
					$detail_iframe.find("body").html(data.data);
				}
			},'json');
		};


		//查看协议详情
		$scope.showAgreeInfo = function(data){
			$scope.AgreementDetail = $.extend({},data);
			//获取静态页面
			if(data){
				$scope.getStaticPage();	//通过appNo
			}else{
				$scope.getStaticPageByRequestNo();//通过requestNo
			}
			$scope.openRollModal("look_agree_info_box");
		};




		/* ============================弹出面板 start ==============================*/
		
		//查看单个供应商融资申请详情
		$scope.showInfoDetail = function(data){
			$scope.queryFinanceInfo(data.requestNo).success(function(){
			  //查询关联列表（订单|应收|汇票）
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



		//页面初始化
		$scope.initPage = function(){
			
			//获取核心企业机构列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','coreCustListDic').success(function(){
				$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
				//供应商列表
				commonService.queryBaseInfoList($scope.custTypeInfo.cust_list_path,{coreCustNo:$scope.searchData.coreCustNo},$scope,'supplierList','supplierListDic').success(function(){
					// $scope.searchData.custNo =common.filterArrayFirst($scope.supplierList);
					$scope.searchData.custNo = '';
					//保理公司列表
					commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.coreCustNo},$scope,'factorList','factorListDic').success(function(){
						// $scope.searchData.factorNo = common.filterArrayFirst($scope.factorList);
						$scope.searchData.factorNo = '';
						//获取融资状态
						/*commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
							name:'nodeCustomName',
							value:'sysNodeId'
						}).success(function(){*/
						$scope.queryList(true);
						// });
					});
				});

			});
		};



		/*数据初始区域*/
		$scope.initPage();


	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});


