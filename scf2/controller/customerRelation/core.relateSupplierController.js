/*
核心企业客户关联供应商
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('core.relateSupplierController',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){

			//详情
			$scope.info = {};

			//供应商列表
			$scope.supplierList = [];

			//已选列表
			$scope.checkedList = [];

			//客户列表
			$scope.custList=[];

			//搜索所需信息
			$scope.searchData = {
				custNo:'',
				custName:''
			};

  			// 添加关系
			$scope.addCustData = {
				custNo:'',
				relationCustStr:'',
				custType:""
			};


			//选中|反选
			$scope.checkedSelect = function(target,item){
				if($(target).is(":checked")){
					$scope.checkedList.push(item);
				}else{
					$scope.checkedList = ArrayPlus($scope.checkedList).delChild('value',item.value);
				}
			};



			//确定添加
			$scope.ensureAdd = function(target){
				//已选 IDS
				$scope.addCustData.relationCustStr = ArrayPlus($scope.checkedList).extractChildArray('value',true);
				$scope.addCustData.custNo = $scope.searchData.custNo;
				$.post(BTPATH.ADD_CUST_RELATION,$scope.addCustData,function(data){
					if((data && data.code === 200)){
						tipbar.infoTopTipbar('新增成功!',{});	
						//$scope.findCustInfo();
						window.location.href = '#/customerRelation/coreRelationManage/';
					}else{
						tipbar.errorTopTipbar($(target),'新增失败，服务端返回信息:'+data.message,3000,99999);
					}
				},'json');	

			};


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				//获取当前机构列表
				$scope.addCustData.custType = cache.get("related_cust_type");
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
					$scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
					$scope.findCustInfo();
					common.resizeIframeListener();
				});

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});

			//查询类型列表
			$scope.findCustInfo = function(){
				return http.post(BTPATH.FIND_CUST_INFO,$.extend({custType:cache.get("related_cust_type")},$scope.searchData)).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.supplierList = data.data;
						});
					}
				});
			};

		}]);

	};

});