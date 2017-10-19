/*
	开户 -平台复核
	@anthor : herb
*/

define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('plat.ReviewController',['$scope','http','$rootScope','$route','cache',function($scope,http,$rootScope,$route,cache){

			/*VM绑定区域*/
			//银行
			$scope.bankList = BTDict.SaleBankCode.toArray('value','name');
			//证件类型
			$scope.identtypeList = BTDict.PersonIdentType.toArray('value','name');
			//省列表
			$scope.provinceList = BTDict.Provinces.toArray('value','name');
			//市列表
			$scope.cityList = [];

			//平台开户信息
			$scope.info = {
				xxx:"asdkjfjkjla股",
				xxxxx:2423423,
	        	bankNo : $scope.bankList[0].value,	//所属银行
	        	bankCityno:'',
	        	provinceNo:''
			};

			//初始化信息
			$scope.initInfo = {
				bankNo : $scope.bankList[0].value,	//所属银行
				bankCityno:'',
				provinceNo:''
				// businLicenceValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),	//营业执照有效期
				/*operValiddate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
				lawValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),*/
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
		    		//图标路径
		    		imgPath:'img/operator.png'
		    	};
		    };


		    //删除附件项
		    $scope.delUploadItem = function(item,listName){
		    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
		    };


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
			});


		}]);

	};

});
