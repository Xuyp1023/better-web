/*
保理材料
@author tanp
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('fac.UploadDataController',['$scope','http','$rootScope','$route','cache','$location','$window',function($scope,http,$rootScope,$route,cache,$location,$window){

			//详情
			$scope.info = {};

			//客户信息
			$scope.custInfo = {
				'custNo':'',
				'custType':'',
				'custName':'',
				'businStatus':'',
				'disCustName':'',
				'disRelateCustName':'',
				'selectCustNo':''
			};

			$scope.attachList = [];

			// 查询上传附件的资料
			$scope.findRequestFile = function(custNo){
				return http.post(BTPATH.FIND_REQUEST_FILE,{relateCustNo:custNo,selectCustNo:$scope.custInfo.selectCustNo}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.attachList = data.data;
						});	
					}
				});
			};
			

			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				// 获取到要传入的客户编号 custNo
				$scope.custInfo = {
					'custNo' : $route.current.pathParams.custNo,
					'custType' : $route.current.pathParams.custType,
					'disRelateCustName' : $route.current.pathParams.disRelateCustName
				}

				if(cache.get('upload_param')!=null){
					$scope.custInfo.custName=cache.get('upload_param').custName;
					$scope.custInfo.businStatus=cache.get('upload_param').businStatus;
					$scope.custInfo.disCustName=cache.get('upload_param').disCustName;
					$scope.custInfo.selectCustNo=cache.get('upload_param').selectCustNo;
				}
				$scope.findRequestFile($scope.custInfo.custNo);

				common.resizeIframeListener();	

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();  
				});
			});


			//上传回调 替换元素
			function callback(list,type){
				return function(){
					//如果未上传或上传失败，返回
					if(ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type).length<=1) return;
					//删除新添加的，并将其值赋给原有的
					var addItem = $scope[list].pop(),
						preItem = ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type)[0];
					$scope[list] = ArrayPlus($scope[list]).replaceChild('fileInfoType',type,$.extend(addItem,{
						'fileDescription':preItem.fileDescription	//类型名称
					}));
				};
			}


		    //开启上传
		    $scope.openUpload = function(event,type,typeName,list){
		    	$scope.uploadConf = {
		    		//上传触发元素
		    		event:event.target||event.srcElement,
		    		//上传附件类型
		    		type:type,
		    		//类型名称
		    		typeName:typeName,
		    		//存放上传文件
		    		uploadList:$scope[list],
		    		//回调
		    		callback:callback(list,type)
		    	};
		    };


		    //删除附件项
		    $scope.delUploadItem = function(item,listName){
		    	$scope[listName] = ArrayPlus($scope[listName]).replaceChild('id',item.id,{
		    		'fileInfoType':item.fileInfoType,
		    		'fileDescription':item.fileDescription
		    	});
		    };


		    //关联附件
		    $scope.linkAttach = function(){
		    	var custNo = $scope.custInfo.custNo,
		    		custType = $scope.custInfo.custType;
		    	var ids = ArrayPlus($scope.attachList).extractChildArray('id',true);

		    	//关联  @todo
		    	http.post(BTPATH.SAVE_CUSTADUIT_TEMP_FILE,{relateCustNo:custNo,fileIds:ids,custType:custType,custNo:$scope.custInfo.selectCustNo})
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('确认成功!',{});
							if($scope.custInfo.custName){
								$window.location.href = '#/customerRelation/facBusiDetail/';
								// $location.url("/customerRelation/facBusiDetail");
							}else{
								$window.location.href="#/customerRelation/openFactorBusi/";
								// $location.url("/customerRelation/openFactorBusi");
							}
						} else {
							tipbar.errorTopTipbar($target,'确认失败,服务器返回:'+data.message,3000,6662);
						}
				});
		    };



			//返回
			$scope.goBack = function(flag){
				//关联附件
				if(flag){
					$scope.linkAttach();
				}else{
					if($scope.custInfo.custName){
						// window.location.href = '#/customerRelation/facBusiDetail/';
						$location.url("/customerRelation/facBusiDetail");
					}else{
						// window.location.href="#/customerRelation/openFactorBusi/";
						$location.url("/customerRelation/openFactorBusi");
					}
				}
			};



		}]);

	};

});