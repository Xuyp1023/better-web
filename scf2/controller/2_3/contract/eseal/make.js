/*
	自主开户
	@anthor : herb
*/


define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.esealMake',['$scope','http','$rootScope','$route','cache','commonService','$timeout',function($scope,http,$rootScope,$route,cache,commonService,$timeout){

			/*VM绑定区域*/
			//银行
			$scope.bankList = BTDict.SaleBankCode.toArray('value','name');
			//证件类型
			$scope.identtypeList = BTDict.PersonIdentType.toArray('value','name');
			//法人证件类型
			$scope.lawIdentTypeList = BTDict.PersonIdentType.toArray('value','name');
			//省列表
			$scope.provinceList = BTDict.Provinces.toArray('value','name');
			//市列表
			$scope.cityList = [];
			//是否阅读并同意
			$scope.readAndAgreee = false; 

			//附件列表
			$scope.infoFileList = [];

			//附件类别数组
			var typeArr = ArrayPlus(BTDict.CustOpenAccountFile.toArray('value','name')).extractChildArray("value",false);
			//构造附件列表
			(function(){
				for(var i=0 ;i<typeArr.length; i++){
					$scope.infoFileList.push({
						'fileInfoType':typeArr[i]
					});
				}
			})();

			//平台开户信息
			$scope.info = {
	        	bankNo : $scope.bankList[0].value,	//所属银行
	        	lawIdentType : common.filterArrayFirst($scope.lawIdentTypeList),
	        	bankCityno:'',
	        	provinceNo:''
			};

			//初始化信息
			$scope.initInfo = {
				bankNo : $scope.bankList[0].value,	//所属银行
				bankCityno:'',						
				provinceNo:'',
				lawIdentType : common.filterArrayFirst($scope.lawIdentTypeList),
				// businLicenceValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),	//营业执照有效期
				// operValiddate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
				// lawValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD')
			};

			$scope.$watch('info.provinceNo',function(newNo){
				if (newNo==='') {
				    $scope.cityList = [];
				    $scope.info.bankCityno = '';
				} else if (newNo&& (newNo.length > 0)) {
					var province = BTDict.Provinces.getItem(newNo);
				    $scope.cityList = province ? province.citys.toArray('value', 'name'):[];
				}
			});

			//开户申请
			$scope.openAccount = function(target) {
				var $target = $(target);

				$scope.info.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);
				http.post(BTPATH.OPEN_ACCOUNT2,$scope.info)
					.success(function(data){
						if(data&&(data.code === 200)){
							tipbar.infoTopTipbar('开户申请成功!',{});
							window.location.href="#/account/accountAuditing/";
						} else {
							tipbar.errorTopTipbar($target,'开户申请失败,服务器返回:'+data.message,3000,6662);
						}
					});
			};

			//上一步
			$scope.preStep = function() {
				window.location.href="#/account/accountWay/";
			};


			//上传回调 替换元素
			function callback(list,type){
				return function(){
					//如果未上传或上传失败，返回
					if(ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type).length<=1) return;
					//删除新添加的，并将其值赋给原有的
					var addItem = $scope[list].pop();
					$scope[list] = ArrayPlus($scope[list]).replaceChild('fileInfoType',type,addItem);
				};
			}

		    //开启上传
		    $scope.openUpload = function(event,type,list){
		    	var typeName = BTDict["CustOpenAccountFile"] ? BTDict["CustOpenAccountFile"].get(type):'----';
		    	$scope.uploadConf = {
		    		//上传触发元素
		    		event:event.target||event.srcElement,
		    		//上传附件类型
		    		type:type,
		    		//类型名称
		    		typeName:typeName,
		    		//存放上传文件
		    		uploadList:$scope[list],
		    		//图标路径
		    		imgPath:'img/operator.png',
		    		//回调
		    		callback:callback(list,type)
		    	};
		    };


		    //删除附件项
		    $scope.delUploadItem = function(item,listName){
		    	$scope[listName] = ArrayPlus($scope[listName]).replaceChild('id',item.id,{'fileInfoType':item.fileInfoType});
		    };


			/*!入口*/ /*控制器执行入口*/ 
			$scope.$on('$routeChangeSuccess',function(){
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					$timeout(function(){
						common.resizeIframeListener();  
					});
				});
				$scope.info=$.extend({},$scope.initInfo);
				commonService.queryBaseInfoList(BTPATH.FIND_SPECIAL_OPERATOR, {clerk:'1'}, $scope, 'operatorList').success(function(){
					var operator = $scope.operatorList[0];
					if(operator) $scope.info.operId = operator.id;
				});
				common.resizeIframeListener();
			});


		}]);

	};

});