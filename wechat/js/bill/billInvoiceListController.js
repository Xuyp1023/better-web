
exports.installController = function(mainApp,common){

	mainApp.controller('billInvoiceListController',['$scope','muiSupport','http','$rootScope','$route','cache','wx','$route',function($scope,muiSupport,http,$rootScope,$route,cache,wx,$route){
		/*私有属性区域*/
		
		/*VM绑定区域*/

		$scope.info = {};


		//附件列表
		$scope.upLoadList = [];
		

		/*获取数据区域*/

		//获取到票据详情
		$scope.queryInfo = function(id){
			http.post(BTPATH.QUERY_ONE_BILL/*1*/,{id:id}/*2*/).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data/*3*/;
						//初始化
					});
				}else{
					mui.alert(/*4*/'未查询到对应票据信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//预览图片
		$scope.preImg = function(item){
			cache.put('pre_upload_list',$.extend({},$scope.upLoadList/*1*/));
			window.location.href = '#/preImg/'+item.id+',0'/*2*/;
		};

		//上传图片附件
		$scope.uploadImage = function(flag){
			wx.uploadImage(function(res){
				http.post(BTPATH.SAVE_PLUS_INFO/*1*/,{
					fileTypeName:flag,
					fileMediaId:res.serverId
				}).success(function(data){
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							/*2*/$scope.upLoadList.push(data.data);
						});
					}
				});
			});
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			//文件缓存读取
			$scope.invoiceList = cache.get('invoiceList');
			var test = 'test';
		});
	}]);

};