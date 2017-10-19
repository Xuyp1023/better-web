
/*
	编辑贸易合同
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('tradeContract.editController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){

		/*私有属性区域*/
		$scope.beginPicker = {};
		$scope.endPicker = {};
		$scope.signPicker = {};
		_coreCustPicker = {};		//核心企业（买方）单选

		//合同信息
		$scope.info = {
			agreeName:'',
			id:'',
			balance:'',
			buyerNo:'',
			buyer:'',
			supplierNo:'',
			supplier:'',
			agreeStartDate:'',
			agreeEndDate:''	
		};

		//核心企业列表（买方）
		$scope.coreCustList = [];

		/*获取数据区域*/
		//切换查询条件
		$scope.changeDate = function(flag){
			if(flag === 'begin'){
		        $scope.beginPicker.beginShow($scope,'endPicker',$scope.info.agreeStartDate,function(res){
		          	$scope.$apply(function(){
		            	$scope.info.agreeStartDate = res.text;
		          	});
		        });
	      	}else if(flag === 'end'){
	        	$scope.endPicker.endShow($scope,'beginPicker',$scope.info.agreeEndDate,function(res){
		          	$scope.$apply(function(){
		            	$scope.info.agreeEndDate = res.text;
		         	});
	        	});
	      	}else if(flag === 'sign'){
	      		var config = {
	      			value:$scope.info.signDate,
	      			type:'date'
	      		};
	      		var picker = muiSupport.dateSelect(config);
	      		picker.show(function(res){
	      			$scope.$apply(function(){
	      				$scope.info.signDate = res.text;
	      			});
	      		});
	      	}
		};

		
		//切换 核心企业
		$scope.changeCore = function(){
			_coreCustPicker.show(function(items){
				$scope.$apply(function(){
					$scope.info.buyerNo = items[0].value;
					$scope.info.buyer = items[0].text;
				});
			});
		};

		//查询合同信息 @todo
		$scope.queryContractInfo = function(){
			http.post(BTPATH.FIND_CONTRACT_LEDGER_INFO,{contractId:$scope.info.id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;
					});
				}else{
					mui.alert(/*4*/'未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};


		//下一步（提交）
		$scope.nextStep = function(){

			$.post(BTPATH.SAVE_CONTRACT_LEDGER,$scope.info,function(data){
				if(data&&(data.code === 200)){
					mui.toast('修改成功！');
					window.location.href = '#/tradeContract/upload/'+data.data.id;
				}else{
					mui.alert('修改失败，服务端返回信息:'+data.message,'错误信息');
				}
			},'json');
		};



		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			//创建联动型日期选择
			var datePicker = muiSupport.crtLinkDate($scope.info.agreeStartDate,$scope.info.agreeEndDate);
			$scope.beginPicker = datePicker.begin;
      		$scope.endPicker = datePicker.end;

      		//申请编号
      		$scope.info.id = $route.current.pathParams.contractId;
      		// 查询客户信息
			$scope.findCustInfo().success(function(){
				$scope.queryCoreCustList();
			});
			$scope.queryContractInfo();

		});


		// 查询当前的客户信息(卖方信息)
		$scope.findCustInfo = function(){
			return $.post(BTPATH.QUERY_CUST_INFO,function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.info.supplierNo = data.data.custNo;
						$scope.info.supplier = data.data.custName;
					});
				}
			},'json');
		};

		// 查询对应的核心企业列表信息
		$scope.queryCoreCustList = function(){
			return $.post(BTPATH.FIND_RELATION_CORE_CUST,{custNo:$scope.info.supplierNo},function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.coreCustList =  ArrayPlus(data.data).replaceChildProp("name",'text',true);
						_coreCustPicker = muiSupport.singleSelect($scope.coreCustList);//创建单项选择
					});
				}
			},'json');
		};

	}]);

};