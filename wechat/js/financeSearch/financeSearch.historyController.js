
/*
	历史融资
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('financeSearch.historyController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){

		/*私有属性区域*/
		$scope.beginPicker = {};
    	$scope.endPicker = {};

    	//分页数据
    	$scope.listPage = {
    		pageNum: 1,
    		pageSize: 10
    	};


		/*VM绑定区域*/
		$scope.searchData = {
	      GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
	      LTErequestDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
	      lastStatus:'8'	//8 结清
		};
			
		//融资列表
		$scope.financeList = [];

		//重新查询 从首页开始
		$scope.queryList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryFinanceList();
		};
		

		//查询融资列表
		$scope.queryFinanceList = function(flag){
			muiSupport.showBar();
			$scope.listPage.flag = flag ? 1 : 2;
			return http.post(BTPATH.QUERY_REQUEST,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.financeList = $scope.financeList.concat(data.data);
						if(flag){
							$scope.listPage = data.page;
						}
					});
				}
			});
		};


		/*获取数据区域*/
		//切换查询条件
		$scope.changeStatus = function(flag){
			if(flag === 'begin'){
		        $scope.beginPicker.beginShow($scope,'endPicker',$scope.searchData.LTErequestDate,function(res){
		          $scope.$apply(function(){
		            $scope.searchData.GTErequestDate = res.text;
		            $scope.financeList=[];
		          });
		          $scope.queryList();
		        });
		      }else{
		        $scope.endPicker.endShow($scope,'beginPicker',$scope.searchData.GTErequestDate,function(res){
		          $scope.$apply(function(){
		            $scope.searchData.LTErequestDate = res.text;
		            $scope.financeList=[];
		          });
		          $scope.queryList();
		        });
		      }
		};

		//查看融资详情
		$scope.lookDetail = function(item){
			window.location.href = '#/financeBusi/detail/' + item.requestNo;
		};



		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			
			//创建联动型日期选择
			var datePicker = muiSupport.crtLinkDate($scope.searchData.GTErequestDate,$scope.searchData.LTErequestDate);
			$scope.beginPicker = datePicker.begin;
      		$scope.endPicker = datePicker.end;
			
			//查询融资列表
			$scope.queryFinanceList(true);

			//从图片预览页面返回
			/*var preInfo = cache.get('finance_apply_i	nfo');
			var agreeList = cache.get('agree_upload_list');
			var invoiceList = cache.get('invoice_upload_list');
			if(preInfo && preInfo.preImg){
				$scope.agreeUploadList = agreeList;
				$scope.invoiceUploadList = invoiceList;
				$scope.info = preInfo;
				cache.put('agree_upload_list',[]);
				cache.put('invoice_upload_list',[]);
				cache.put('finance_apply_info',{});
			}*/
			
		});
	}]);

};