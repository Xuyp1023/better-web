
exports.installController = function(mainApp,common){

	mainApp.controller('tradeContract.infoController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		
		/*VM绑定区域*/
		//合同详情
		$scope.info = {};

		//提示语配置
		var actionConfig = {
			detail:'',			//查看详情
			audit:'审核生效',	//审核
			cancel:'取消审核',	//取消审核
			disuse:'作废',		//作废
		};

		//当前执行操作
		$scope.actionInfo = {
			actionType:'',
			message:''
		};


		/*获取数据区域*/
		//查询详情
		$scope.queryInfo = function(contractId){
			http.post(BTPATH.FIND_CONTRACT_LEDGER_INFO,{contractId:contractId}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
						//初始化
					});
				}else{
					mui.alert(/*4*/'未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//审核
		$scope.audit = function(){
			$.post(BTPATH.SAVE_CONTRACT_LEDGER_STATUS,{contractId:$scope.info.id,status:'1'},function(data){
				if(data&&(data.code === 200)){	
					mui.toast('审核成功！');			
				}else{
					mui.alert('审核失败，服务端返回信息:'+data.message,'错误信息');
				}
			},'json');
		};

		//取消审核
		$scope.cancelAudit = function(){

			mui.confirm("确定要取消审核吗?","温馨提示",'',function(e){
				if (e.index != 1) return;
				$.post(BTPATH.SAVE_CONTRACT_LEDGER_STATUS,{contractId:$scope.info.id,status:'0'},function(data){
					if(data&&(data.code === 200)){
						mui.toast('取消审核成功！');				
					}else{
						mui.alert('取消审核失败，服务端返回信息:'+data.message,'错误信息');
					}
				},'json');
			});

		};

		//作废
		$scope.disuse = function(){
			mui.confirm("确定要作废合同吗?","温馨提示",'',function(e){
				if (e.index != 1) return;
				$.post(BTPATH.SAVE_CONTRACT_LEDGER_STATUS,{contractId:$scope.info.id,status:'2'},function(data){
					if(data&&(data.code === 200)){
						mui.toast('作废成功！');					
					}else{
						mui.alert('作废失败，服务端返回信息:'+data.message,'错误信息');
					}
				},'json');
			});
		};


		//操作执行
		$scope.action = function(){
			switch($scope.actionInfo.actionType){
				case "audit":
					//审核
					$scope.audit();
					break;
				case "cancel":
					//取消审核
					$scope.cancelAudit();
					break;
				case "disuse":
					//作废
					$scope.disuse();
					break;
				default:
					break;
			}
		};
		

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			/*
			*  获取到传入的申请编号 和 操作类型
			*  操作类型 : 查看|审核|取消审核|作废	(detail|audit|cancel|disuse)
			*/
			var contractId = $route.current.pathParams.contractId,
				actionType = $route.current.pathParams.type;
			// 当前执行操作	
			$scope.actionInfo = {
				actionType:actionType,
				message:actionConfig[actionType]
			};
			//查询合同信息
			$scope.queryInfo(contractId);
		});
	}]);

};