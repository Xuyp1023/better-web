/*
平台开通保理业务受理和审批详情
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('qie.factorDetailController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			//详情
			$scope.info = {};
			// 获取到要传入的客户编号 custNo
			$scope.custInfo = {
				'custNo' :'',
				'relateType':''
			};
			$scope.attachList = [];
			$scope.recordList = [];		

			//返回来源页面配置
			var _originConfig = {
				platCustInfo:{
					name:"返回客户信息查询（平台）页面",
					path:window.BTServerPath + "/scf2/home.html#/plat/custInfo"
				},
				facCustInfo:{
					name:"返回客户信息查询（平台）页面",
					path:window.BTServerPath + "/scf2/home.html#/fac/custInfo"
				},
				whiteListAccept:{
					name:"返回白名单受理列表页面",
					path:window.BTServerPath + "/scf2/views/sfccom/whitelist/whiteListAccept.html"
				},
				whiteListAudit:{
					name:"返回白名单审核列表页面",
					path:window.BTServerPath + "/scf2/views/sfccom/whitelist/whiteListAudit.html"
				}
			};

			

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				$scope.custInfo.custNo=$route.current.pathParams.custNo;
				$scope.custInfo.relateType=cache.get("relateType");

				$scope.findFactorBusinessRequest($scope.custInfo.custNo);
				$scope.findRequestFile($scope.custInfo.custNo);
				$scope.findCustRelateAduitRecord($scope.custInfo.custNo);

				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
				
			});

			//查询基础信息
			$scope.findFactorBusinessRequest = function(custNo){
				$.post(BTPATH.FIND_FACTORBUSINESS_REQUEST,{custNo:custNo,selectCustNo:null},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.info = data.data;
						});
					}
				},'json');
			};
			
			//查询审批记录
			$scope.findCustRelateAduitRecord = function(custNo){
				$.post(BTPATH.FIND_CUST_RELATEADUIT_RECORD,{custNo:custNo,relateType:$scope.custInfo.relateType},function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.recordList = data.data;
						});
					}
				},'json');
			};

			// 查询上传附件的资料
			$scope.findRequestFile = function(custNo){
				return http.post(BTPATH.FIND_RELATEADUIT_TEMP_FILE,{custNo:custNo}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.attachList = data.data;
							$scope.downListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.attachList).extractChildArray("id",true) + "&fileName=保理业务资料包";
							$scope.attachList = ArrayPlus($scope.attachList).addKey4ArrayObj('isChecked',false);
						});	
					}
				});
			};

			
			//返回
			$scope.goBack = function(){
				//根据标志获取来源页
				var origin_flag = cache.get("factor_detail_orgin"),
					origin_path = _originConfig[origin_flag].path;
				//清除缓存
				cache.remove("factor_detail_orgin");
				//返回来源页
				window.location.href = origin_path;
			};

		}]);

	};

});