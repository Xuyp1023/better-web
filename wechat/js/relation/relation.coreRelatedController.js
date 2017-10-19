
exports.installController = function(mainApp,common){

	mainApp.controller('relation.coreRelatedController',['$scope','muiSupport','http','$rootScope','cache','commonService',function($scope,muiSupport,http,$rootScope,cache,commonService){

		//VM绑定区域

		//查询条件
		$scope.searchData = {
			custName:''
		};

		//关联的客户类型
		// $scope.custType = '';

		//核心企业列表
		$scope.coreCustList=[];

		/*$scope.coreCustList=[{
			value:12,
			name:'深圳市新洲文化传媒股份有限公司'
		},{
			value:13,
			name:'深圳市博雅科技股份有限公司'
		},{
			value:14,
			name:'广东德豪润达电气股份有限公司'
		}];*/

		//已选中列表
		$scope.selectedList = [];

		// 添加关系
		$scope.addCustData = {
			relationCustStr:'',
			custType:''
		};
		
		/*获取数据区域*/

		//切换选择
		$scope.toggleCheckItem = function(item){
			item.isChecked = !item.isChecked;
			if(item.isChecked)
				$scope.selectedList.push(item);
			else
				$scope.selectedList = ArrayPlus($scope.selectedList).delChild('value',item.value);
		};


		//删除提示操作
		$scope.delThisItem = function(item){
			mui.confirm("是否确认删除此项?","温馨提示",'',function(e){
				if (e.index != 1) return;
				$scope.$apply(function(){
					item.isChecked = false;
					$scope.selectedList = ArrayPlus($scope.selectedList).delChild('value',item.value);
				});
			});
		};

		//搜索点击选中
		$scope.clickcChekedItem = function(item){
			item.isChecked =true;
			mui('#search_popover').popover('hide');
			if(ArrayPlus($scope.selectedList).objectChildFilter('value',item.value).length>=1) return;
			$scope.selectedList.push(item);
		};	


		//申请关联
		$scope.applyAction = function(target){
			//缓存申请列表
			cache.put("apply_related_core",$scope.selectedList);
			$scope.addCustData.relationCustStr= ArrayPlus($scope.selectedList).extractChildArray('value',true);
			if(!$scope.addCustData.relationCustStr){
				mui.alert("请至少选择一个关联机构!","温馨提示");
			}
			$scope.addCustData.custType=cache.get("related_cust").value;
			$.post(BTPATH.ADD_CUST_RELATION,$scope.addCustData,function(data){
					if((data && data.code === 200)){
						//跳转到显示结果
						location.href = '#/relation/core/show';
					}else{
						mui.alert('申请失败:'+data.message,'错误信息');
					}
			},'json');	
		};

		//打开搜索弹出框
		$scope.openPanel = function(){
			mui('#search_popover').popover('show');
			$("#search_key").focus();
		};

		
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//查询核心企业列表 
			$scope.findCustInfo();
		});

		//查询类型列表
		$scope.findCustInfo = function(){
			// console.info("param" + cache.get("related_cust").value);
			// $.extend({custType:cache.get("related_cust").value},$scope.searchData)
			return http.post(BTPATH.FIND_CUST_INFO,{custType:cache.get("related_cust").value}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.coreCustList = data.data;
					});
				}
			});
		};


	}]);

};