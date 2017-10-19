	/*
	融资录单
	@anthor : herb
*/

define(function(require,module,exports){

	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var date = require("date");
    require('modal');


	//定义模块
	var mainApp = angular.module('mainApp',['pagination','date','modal']);

	//扩充公共指令库/过滤器/服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
	comservice.servPlus(mainApp);


	//控制器区域
	mainApp.controller('orderEntry',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){

		//当前用户角色
		$scope.currRole ='';  //supplier|agency
		//从其他页面跳转而来
		$scope.skipForm = false;

		//基础数据
		$scope.creditModes = BTDict.CreditMode.toArray('value','name');			//授信方式
		$scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name').slice(0,3);//融资类型
		$scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');		//期限单位

		//融资企业列表
		$scope.financeCustList = [];
		//保理公司列表
		$scope.factorList = [];
		//核心企业列表
		$scope.coreCustList = [];
		//保理产品列表
		$scope.productList = [];
		//保理产品详情
		$scope.productDetail = {};

		//融资详细
		$scope.financeInfo = {};
		//授信额度信息
		$scope.credit = {};
		//已选中的订单
		$scope.checkOrderList =[];
		//客户订单列表
		$scope.orderList = [];
		//应收账款列表
		$scope.recieveList = [];
		//汇票列表
		$scope.billList = [];

		/* 融资相关文件列表 配置 */
		var _linkedConfig = {
			1:{
				type:'order',
				title:'2.客户订单列表（供选）',
				query_path:BTPATH.QUERY_ORDER_LIST_NORMAL,//获取订单无分页列表
				table_id:'order_list_table',		//模板包裹ID
				list_name:'orderList'			//列表VM名称
			},
			2:{
				type:'bill',
				title:'2.汇票列表（供选）',
				query_path:BTPATH.QUERY_BILL_LIST_NORMAL,//获取票据无分页列表
				table_id:'bill_list_table',		//模板包裹ID
				list_name:'billList'			//列表VM名称
			},
			3:{
				type:'recieve',
				title:'2.应收账款列表（供选）',
				query_path:BTPATH.QUERY_RECIEVE_LIST_NORMAL,//获取应收账款无分页列表
				table_id:'recieve_list_table',		//模板包裹ID
				list_name:'recieveList'			//列表VM名称
			},
			4:{	//经销商融资
				type:'order',
				title:'2.客户订单列表（供选）',
				query_path:BTPATH.QUERY_ORDER_LIST_NORMAL,//获取订单无分页列表
				table_id:'order_list_table',		//模板包裹ID
				list_name:'orderList'			//列表VM名称
			}
		};

		//当前配置
		$scope.currConfig = _linkedConfig[1];



		//根据角色 初始化基础数据
		(function(){
			//url #参数
			var flag = location.hash ? location.hash.substr(1):'';
			if(flag==="agency"|| flag==="supplier"){
				$scope.currRole = flag;
			}
			else{
				//从询价页面申请融资，只有供应商才有询价
				$scope.currRole = "supplier";
				$scope.skipForm = true;
			}

			//经销商
			if($scope.currRole==="agency"){
				$scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name').slice(3,4);//融资类型
				$scope.currConfig = _linkedConfig[4];	//当前关联配置
			}
		})();




		//融资类型变化 改变配置和关联列表
		$scope.reqTypeChange = function(){
			//融资类型
			var type = $scope.financeInfo.requestType;
			//当前配置
			$scope.currConfig = _linkedConfig[type];
			//清空已选
			$scope.checkOrderList = [];
			//刷新关联列表
			$scope.querySelectList();
		};


		//查询关联列表（订单|应收账款|票据）
		$scope.querySelectList = function(){
			//当前配置
			var config = $scope.currConfig;
			// isOnlyNormal 1：未融资 0：查询所有
			var promise = http.post(config.query_path,{isOnlyNormal:1,custNo:$scope.financeInfo.custNo,coreCustNo:$scope.financeInfo.coreCustNo}).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      $scope.$apply(function(){
			          $scope[config.list_name] = common.cloneArrayDeep(data.data);
			      });
			    }
			});
			return promise;
		};


		//关联列表 选中|反选
		$scope.checkedSelect = function(target,sel){
			if($(target).is(":checked")){
				$scope.checkOrderList.push(sel);
			}else{
				$scope.checkOrderList = ArrayPlus($scope.checkOrderList).remove(sel);
			}
		};


		//查询报价详情(根据报价构建融资申请)
	    $scope.findPrice = function(data){
	        var param = {
	          enquiryNo:data[0],
	          factorNo:data[1]
	        };
	        var promise = http.post(BTPATH.QUERY_OFFER_DETAIL,param).success(function(data){
	            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	              	$scope.$apply(function(){
	            		$scope.financeInfo = {
	            			"offerId":data.data.id,	//报价编号
	            			"custNo":data.data.custNo,
	              	        "coreCustNo":data.data.coreCustNo,
	              	        "factorNo":data.data.factorNo,
	              	        "period":data.data.period,
	              	        "periodUnit":2,//期限单位 ：月
	              	        "balance":data.data.balance,
	              	        //获取 融资类型
	              	        "requestType":data.data.enquiry.requestType,
	              	        "creditMode":''
	                	};
	                	//设置已选
	                	var orders = data.data.enquiry.orders;
	                	if(orders){
	                		$scope.checkOrderList = orders.split(",");
	                	}
	              	});
	            }
	        });
	        return promise;
	    };



	    //查询授信额度
	    $scope.queryCredit = function(){
	  		if(!$scope.financeInfo.coreCustNo || !$scope.financeInfo.creditMode) return false;
			var promise = http.post(BTPATH.FIND_CREDIT_DETAIL,$scope.financeInfo).success(function(data){
			    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
			      	$scope.$apply(function(){
			        	$scope.credit = data.data;
			      	});
			    }else{
			    	//当前未授信
			    	$scope.$apply(function(){
			    		$scope.credit = {};
			    	});
			    }
			});
			return promise;
	    };


		//新增融资申请
		$scope.addFinanceReq = function(target){
			//设置校验项 | 校验
			validate.validate($('#financeApply_form'),validOption);
			var valid = validate.validate($('#financeApply_form'));
			if(!valid) return;

			//是否授信 以及 授信额度
			/*if(!$scope.credit.creditLimit || !$scope.credit.creditBalance){
				tipbar.errorLeftTipbar($(target),'当前操作企业尚未授信！',3000,999999);
				return false;
			}
			if($scope.credit.creditBalance < $scope.financeInfo.balance){
				tipbar.errorLeftTipbar($(target),'当前授信余额不足！',3000,999999);
				return false;
			}*/

			//融资依据
			var orders = $scope.checkOrderList.toString();
			if(!orders || orders.length===0){
			  tipbar.errorLeftTipbar($(target),'请选择（订单|票据|应收款项）作为融资依据！',3000,999999);
			  return false;
			}
			//已选依据
			$scope.financeInfo.orders = orders;

			//业务数据
			var businessData = $.extend({},$scope.financeInfo,{"requestFrom":1}),	//requestFrom 请求来源 - PC
				custNo = $scope.financeInfo.custNo,
				coreCustNo = $scope.financeInfo.coreCustNo,
				factorNo = $scope.financeInfo.factorNo;

			//流程启动传递参数
			var flowData = {
				//流程名称
				workFlowName :$scope.currRole == "supplier" ? '资金方-供应商融资审批流程':'资金方-经销商融资审批流程' ,
				custNo:factorNo,  		//流程所属公司     在此为 保理公司编号
				startCustNo:custNo,  	//启动流程的公司
				// 流程参与公司
				factorCustNo:factorNo,
				supplierCustNo:$scope.currRole == "supplier" ? custNo : '',
				coreCustNo:coreCustNo,
				sellerCustNo:$scope.currRole == "agency" ? custNo : '',
				platformCustNo:'',
				data:JSON.stringify(businessData)
			};

			//根据角色切换请求
			// var postUrl = ($scope.currRole == "supplier") ? BTPATH.ADD_SUPPLIER_FINANCE_REQUEST:BTPATH.ADD_AGENCY_FINANCE_REQUEST;

			loading.addLoading($("#content"),common.getRootPath());
			//启动融资流程
		    http.post(BTPATH.START_WORKFLOW_TASK,flowData).success(function(data){
		        if(data && data.code === 200){
		          $scope.$apply(function(){
		              tipbar.infoTopTipbar('新增融资申请成功!',{});
		              //刷新数据
		              $scope.financeInfo = {
			  			"custNo":$scope.financeCustList[0] ? $scope.financeCustList[0].value:'',
				        "coreCustNo":$scope.coreCustList[0] ? $scope.coreCustList[0].value:'',
				        "factorNo":$scope.factorList[0] ? $scope.factorList[0].value:'',
				        "productId":$scope.productList[0] ? $scope.productList[0].value:'',
				        "periodUnit":$scope.periodUnits[0].value,
				        "requestType":$scope.requestTypes[0].value,
				        "creditMode":''
			  		  };
			  		  //置空授信信息
			  		  $scope.credit = {};
			  		  //申请类型重置，刷新关联配置 和 关联列表
			  		  $scope.reqTypeChange();
		              $scope.skipForm = false;
		              loading.removeLoading($("#content"));
		          });
		        }else{
		            tipbar.errorTopTipbar($(target),'新增融资申请失败,服务器返回:'+data.message,3000,9999);
		            loading.removeLoading($("#content"));
		        }
		    });
		};


		//融资企业切换 查询对应的保理公司和核心企业
		$scope.custSwitch = function(){
			var custNo = $scope.financeInfo.custNo;
			//保理商列表
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:custNo},$scope,'factorList').success(function(){
				//核心企业列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:custNo},$scope,'coreCustList').success(function(){
					$scope.$apply(function(){
						$scope.financeInfo = $.extend($scope.financeInfo,{
							"coreCustNo":$scope.coreCustList[0] ? $scope.coreCustList[0].value:'',
							"factorNo":$scope.factorList[0] ? $scope.factorList[0].value:''
						});
						//刷新关联列表
						$scope.querySelectList();
					});
					//刷新保理产品列表
					$scope.searchProduct();
				});
			});
			//置空已选
			$scope.checkOrderList = [];
		};


		//核心企业切换
		$scope.coreCustSwitch = function(){
			//刷新关联列表
			$scope.querySelectList();
			//刷新产品列表
			$scope.searchProduct();
		};


		//保理公司和核心企业变化 则 保理产品列表变化
		$scope.searchProduct = function(){
			var param ={
				"coreCustNo":$scope.financeInfo.coreCustNo,
				"factorNo":$scope.financeInfo.factorNo
			};
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_PRODUCTLIST,param,$scope,'productList').success(function(data){
				$scope.$apply(function(){
					$scope.financeInfo.productId = $scope.productList[0] ? $scope.productList[0].value:'';
				});
			});
		};

		//查询保理产品详情
		$scope.findProduct = function(productId){
		    http.post(BTPATH.FIND_PRODUCT_DETAIL_BYID,{id:productId}).success(function(data){
		        if(data && data.code === 200){
		          $scope.$apply(function(){
		             $scope.productDetail = data.data;
		          });
		        }
		    });
		};


		/* ============================弹出面板 start ==============================*/

		// 融资依赖详情查看
		$scope.showfactorProofDetail = function(type,data){
		    detailShow.getFinanceCredentialDetail($scope,type,data.id);
		};


		//产品详情模板
		$scope.openProductDetail = function(productId){
			if(!productId) return;
			//查询产品详情
			$scope.findProduct(productId);
			$scope.openRollModal("product_detail_box");
		};


		//页面初始化
		commonService.initPage(function(){

			//当前操作员下机构（融资机构列表）
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'financeCustList').success(function(data){
				var custNo = $scope.financeCustList[0] ? $scope.financeCustList[0].value:'';
				//保理商列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:custNo},$scope,'factorList').success(function(){
					//核心企业列表
					commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:custNo},$scope,'coreCustList').success(function(){

						//从其他页面跳转（询价）
						if($scope.skipForm){
							//询价编号-保理公司编号
							var searchInfo = location.hash.substr(1).split("=")[1].split("-");
							//查询报价,通过报价信息构建融资申请
							$scope.findPrice(searchInfo).success(function(){
								//查询保理产品列表
								$scope.searchProduct();

								//当前融资类型
								var currType = $scope.financeInfo.requestType,
									checkedStr = $scope.checkOrderList.toString();	//已选
								//设置关联可选配置
								$scope.currConfig = _linkedConfig[currType];

								//刷新关联可选列表，过滤未选
								$scope.querySelectList().success(function(){
									if(!checkedStr) return;
									var config = $scope.currConfig,
										list= $scope[config.list_name],
										filterList = [];
									for(var i=0 ;i<list.length ;i++ ){
										var item = list[i];
										if(checkedStr.indexOf(item.id)!==-1){
										    filterList.push(item);
										}
									}
									//获取过滤后列表
									$scope[config.list_name] = filterList;
								});
							});
						}
						//普通融资申请
						else{
					  		$scope.financeInfo = {
					  			"custNo":$scope.financeCustList[0] ? $scope.financeCustList[0].value:'',
						        "coreCustNo":$scope.coreCustList[0] ? $scope.coreCustList[0].value:'',
						        "factorNo":$scope.factorList[0] ? $scope.factorList[0].value:'',
						        "periodUnit":$scope.periodUnits[0].value,
						        "requestType":$scope.requestTypes[0].value,
						        "creditMode":''
					  		};
							//查询保理产品列表
							$scope.searchProduct();
							//查询关联可选列表
							$scope.querySelectList();
						}

					});
				});
			});
		});


		//校验配置
		var validOption = {
		      elements: [{
		          name: 'financeInfo.custNo',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'financeInfo.balance',
		          rules: [{name: 'required'},{name: 'money'}],
		          events:['blur']
		      },{
		          name: 'financeInfo.period',
		          rules: [{name: 'required'},{name: 'int'}],
		          events:['blur']
		      },{
		          name: 'financeInfo.factorNo',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'financeInfo.coreCustNo',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'financeInfo.productId',
		          rules: [{name: 'required'}],
		          events:['blur']
		      },{
		          name: 'financeInfo.creditMode',
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
