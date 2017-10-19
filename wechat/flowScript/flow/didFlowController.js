
exports.installController = function(mainApp,common){

	mainApp.controller('didFlowController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		$scope.beginPicker = {};
    	$scope.endPicker = {};
		_statusList = BTDict.BillNoteStatus.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
	      GTEauditDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
	      LTEauditDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD')
		};

		$scope.infoList = [];

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10
		};


		/*获取数据区域*/
		//切换查询条件
		$scope.changeStatus = function(flag){
			// _statusPicker.show(function(items){
      //   if(console) console.log(items);
			// 	$scope.$apply(function(){
			// 		$scope.searchData.businStatus = items[0].value;
			// 	});
			// 	$scope.infoList = [];
			// 	$scope.listPage.pageNum = 1;
			// 	$scope.queryList();
			// });
			if(flag === 'begin'){
		        $scope.beginPicker.beginShow($scope,'endPicker',$scope.searchData.LTEauditDate,function(res){
		          $scope.$apply(function(){
		            $scope.searchData.GTEauditDate = res.text;
		          });
		          $scope.infoList=[];
		          $scope.queryList();
		        });
		      }else{
		        $scope.endPicker.endShow($scope,'beginPicker',$scope.searchData.GTEauditDate,function(res){
		          $scope.$apply(function(){
		            $scope.searchData.LTEauditDate = res.text;
		          });
		          $scope.infoList=[];
		          $scope.queryList();
		        });
		      }
		};

		//查询融资列表
		$scope.queryList = function(){
			muiSupport.showBar();
			return http.post(BTPATH.QUERY_WORKFLOW_HISTORY_TASK,$.extend({},$scope.listPage,$scope.searchData,{flag:1})).success(function(data){
				muiSupport.hideBar();
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.infoList = $scope.infoList.concat(data.data);
						$scope.listPage = data.page;
					});
				}
			});
		};

		//打开详情
		$scope.showDetail = function(item){
			cache.put("WORKFLOW_TASK_FLAG", {readonly:'readonly'});
			cache.put("currentTask", item);
			debugger;
			window.location.href="flow.html#" + item.workFlowBase.wechatForm;
			//window.location.href="flow.html#/finance/detail";
		};

		$scope.goTodoFlow = function() {
			window.location.href="#/flow/todoList";
		}

		//

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//创建联动型日期选择
			var datePicker = muiSupport.crtLinkDate($scope.searchData.GTEauditDate,$scope.searchData.LTEauditDate);
			$scope.beginPicker = datePicker.begin;
      		$scope.endPicker = datePicker.end;

			$scope.queryList();
		});
	}]);

}
