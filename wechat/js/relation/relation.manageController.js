
exports.installController = function(mainApp,common){

	mainApp.controller('relation.manageController',['$scope','muiSupport','http','$rootScope','cache',function($scope,muiSupport,http,$rootScope,cache){

		
		/*私有属性区域*/
		_statusPicker = {};
		_statusList =  []; 
		
		$scope.custType="";
		
		//VM绑定区域
		$scope.searchData = {
			relationType:''
		};

		//关系列表
		$scope.relationList=[];
		/*$scope.relationList=[{
			relateCustname:'广东德豪润达电气股份有限公司',
			relateType:'1'
		},{
			relateCustname:'广东德豪润达电气股份有限公司',
			relateType:'0'
		}];*/

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};


		//查看详情
		$scope.lookDetail = function(item){
			cache.put('detail_info',item);
			//跳转到详情
			if($scope.custType=='SUPPLIER_USER'){
				if(item.relateType+''==='0'){
					location.href = '#/relation/factor/detail';
				}else{
					location.href = '#/relation/core/detail';
				}
			}else if($scope.custType=='SELLER_USER'){
				if(item.relateType+''==='3'){
					location.href = '#/relation/factor/detail';
				}else{
					location.href = '#/relation/core/detail';
				}
			}else if($scope.custType=='CORE_USER'){
				if(item.relateType+''==='2'){
					location.href = '#/relation/factor/detail';
				}else{
					location.href = '#/relation/core/detail';
				}
			}
		};

		
		/*获取数据区域*/

		//查询关系列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUER_CUST_RELATION,$.extend($scope.listPage,{flag:1},$scope.searchData)).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.relationList = data.data;
						$scope.listPage = data.page;
					});
				}
			});
		};


		//切换查询条件 
		$scope.changeStatus = function(){
			_statusPicker.show(function(items){
				$scope.$apply(function(){
					$scope.searchData.relationType = items[0].value;
				});
				$scope.relationList = [];
				$scope.listPage.pageNum = 1;
				$scope.queryList();
			});
		};

		// 查询当前登录的客户类型
		$scope.findCustTypeByLogin = function(){
			return http.post(BTPATH.FIND_CUST_TYPE_LOGIN,{}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){			
						$scope.custType = data.data;
					});
				}
			});
		};
		
		
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			// debugger;
			$scope.findCustTypeByLogin().success(function(){

				if($scope.custType=='SUPPLIER_USER'){
					_statusList=BTDict.SupplierStatus.toArray('value','text');
				}else if($scope.custType=='SELLER_USER'){
					_statusList=BTDict.SellerStatus.toArray('value','text');
				}else if($scope.custType=='CORE_USER'){
					_statusList=BTDict.CoreStatus.toArray('value','text');
				}
				//创建单项选择
				_statusPicker = muiSupport.singleSelect(_statusList);
				$scope.queryList();
			});
			
		});
	}]);

};