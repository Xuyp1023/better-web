/*

@author herb
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('step.listController',['$scope','http','$rootScope','$route','cache','$location',function($scope,http,$rootScope,$route,cache,$location){

			//步骤列表
			$scope.stepList = [{xxx:54875}];
			$scope.selectNode = {};
			$scope.selectFlow = {};
			$scope.selectStep = null;
			$scope.stepList = [];

			$scope.info = {};

			$scope.readonly = false;


			//审批方式 下拉列表
			$scope.auditWayList = [{
				value:'0',
				name:'串行审批'
			},{
				value:'1',
				name:'并行审批'
			}];

			//是否金额段审批 下拉列表
			$scope.moneyEnableList = [{
				value:'0',
				name:'启用'
			},{
				value:'1',
				name:'禁用'
			}];

			//返回
			$scope.goBack = function(){
				//window.history.back();
				$location.path('/process/nodeDefine');
				// window.location.href="home.html#/process/nodeDefine";
			};

			//复选 选中|反选
			$scope.toggleCheckItem = function(item){
			   	var isChecked = item.isChecked;
			   	for(var i=0; i< $scope.stepList.length; i++){
			   		$scope.stepList[i].isChecked = false;
			   	}

			   	item.isChecked = !isChecked;
			  	$scope.selectStep = item.isChecked ? item: null;
			};

			$scope.resetCheckItem = function() {
				if (!$scope.selectStep) return;
				$scope.stepList = ArrayPlus($scope.stepList).setKeyArrayObj("isChecked",true,"id",$scope.selectStep.id);

				/*for(var i=0; i< $scope.stepList.length; i++){
					if ($scope.stepList[i].id === $scope.selectStep.id) {
						$scope.stepList[i].isChecked = true;
						//$scope.selectStep = $scope.stepList[i];
					} else {
			   			$scope.stepList[i].isChecked = false;
			   		}
			   	}*/
			}

			$scope.queryList = function(target) {
				var $target = $(target);
				return http.post(BTPATH.QUERY_WORKFLOW_STEP_LIST,{nodeId:$scope.selectNode.id}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.stepList = data.data;
						});
					} else {
						tipbar.errorTopTipbar($target,'添加流程步骤失败,服务器返回:'+data.message,3000,9992);
					}
				});
			};

			//打开 新增面板
			$scope.openAddBox = function(){
				$scope.info.nickname = '';
				$scope.openRollModal("step_add_box");
			};

			//添加步骤
			$scope.addStep = function(){
				http.post(BTPATH.ADD_WORKFLOW_STEP,{baseId:$scope.selectFlow.id,nodeId:$scope.selectNode.id,nickname:$scope.info.nickname}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('添加步骤成功!',{});
							$scope.queryList().success(function(){
								$scope.resetCheckItem();	
							});
							
							$scope.closeRollModal("step_add_box");
						});
					}
				});
				
			};

			// 删除步骤
			$scope.deleteStep = function(item) {
				http.post(BTPATH.DEL_WORKFLOW_STEP,{baseId:$scope.selectFlow.id,nodeId:$scope.selectNode.id,stepId:item.id}).success(function(data){
					if(common.isCurrentResponse(data)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('删除步骤成功!',{});
							$scope.queryList().success(function(){
								$scope.resetCheckItem();	
							});
							
						});
					}
				});
			};

			// 上移流程步骤
			$scope.moveUpStep = function() {
				if (!$scope.selectStep) return;
				http.post(BTPATH.MOVE_UP_WORKFLOW_STEP,{baseId:$scope.selectFlow.id,nodeId:$scope.selectNode.id,stepId:$scope.selectStep.id}).success(function(data){
					if(common.isCurrentResponse(data)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('上移步骤成功!',{});
							$scope.queryList().success(function(){
								$scope.resetCheckItem();	
							});
							
						});
					}

				});
			};

			// 下移流程步骤 
			$scope.moveDownStep = function() {
				if (!$scope.selectStep) return;
				http.post(BTPATH.MOVE_DOWN_WORKFLOW_STEP,{baseId:$scope.selectFlow.id,nodeId:$scope.selectNode.id,stepId:$scope.selectStep.id}).success(function(data){
					if(common.isCurrentResponse(data)){
						$scope.$apply(function(){
							tipbar.infoTopTipbar('下移步骤成功!',{});
							$scope.queryList().success(function(){
								$scope.resetCheckItem();	
							});
							
						});
					}
				});
			};

			$scope.defineStep = function(item) {
				cache.put('select_step', item);
				$location.path('/process/stepDefine');
				// window.location.href = '#/process/stepDefine/';
			};			

			$scope.showStep = function(item) {
				cache.put('select_step', item);
				$location.path('/process/stepDefine');
				// window.location.href = '#/process/stepDefine/';
			};

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){

				$scope.selectNode = cache.get("select_node");
				$scope.selectFlow = cache.get("selected_flow").item;
				$scope.readonly = !!cache.get("selected_flow").readonly;

				$scope.queryList();

				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});
		}]);

	};

});