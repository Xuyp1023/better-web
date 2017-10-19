/*
	@herb
	上传认证资料
*/

exports.installController = function(mainApp,common){

	mainApp.controller('open.uploadController',['$scope','muiSupport','http','$rootScope','$route','cache','wx',function($scope,muiSupport,http,$rootScope,$route,cache,wx){

		//公用方法
		function ObjectToArrry(obj){
			var arr = [];
			for(var i in obj){
				if(obj.hasOwnProperty(i)){
					arr.push(obj[i]);
				}
			}
			return arr;
		};


		/*私有属性区域*/
		_statusPicker = {};	
		
		/*VM绑定区域*/

		$scope.info = {};

		$scope.upLoadList = {};

		//向下个界面的fileList
		// $scope.fileList = [];


		//删除附件
		$scope.delUpload = function(item){ 
			http.post(BTPATH.DELETE_SINGLE_FILE,{id:item.id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.upLoadList[data.data.fileInfoType] = data.data;
						$scope.upLoadList[item.fileInfoType]= {fileInfoType:item.fileInfoType};
					});
				}else{
					mui.alert('删除失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};

		//预览图片
		$scope.preImg = function(item){
			cache.put('pre_upload_list',$scope.upLoadList);
			cache.put('account_info',$scope.info);
			// cache.put('file_list',$scope.fileList);
			window.location.href = '#/preImg/'+item.id+',1';
		};

		//上传图片附件
		//上传图片附件
		$scope.uploadImage = function(flag){
			wx.uploadImage(function(res){
				http.post(BTPATH.SAVE_SINGLE_ACCOUNT_FILE/*1*/,{
					fileTypeName:flag,
					fileMediaId:res.serverId,
					id:$scope.info.id
				}).success(function(data){
					if(common.isCurrentResponse(data)){
						$scope.$apply(function(){
							$scope.upLoadList[data.data.fileInfoType] = data.data;
						});
					}else{
						mui.alert('保存失败,服务端\n返回信息:'+data.message,'错误信息');
				}
				});
			});
		};

		//提交，下一步
		$scope.nextStep = function(){
			//缓存开户信息（包括附件Ids）
			var fileList = ObjectToArrry($scope.upLoadList);
			$scope.info.fileList = ArrayPlus(fileList).extractChildArray("id",true);
			cache.put('account_info',$scope.info);
			cache.put('upLoadList',$scope.upLoadList);
			if(!$scope.info.fileList){
				mui.alert('请至少上传一个附件信息！','错误信息');
				return;
			}
			window.location.href = '#/register/passwd';
		};

		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			$scope.info =  cache.get("account_info");
			$scope.upLoadList = cache.get("upLoadList");
			http.post(BTPATH.FIND_CUST_OPEN_ACCOUNT_TMP,{}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = $.extend({},$scope.info,data.data);
					});
					cache.put("account_info",$scope.info);
				}
			});
			http.post(BTPATH.FIND_OPEN_ACCOUNT_FILEITEM,{batchNo:$scope.info.batchNo}).success(function(data){
		 		$scope.$apply(function(){
		 			$scope.upLoadList = data.data;
		 		});
		 	});

			var preUploadList = cache.get('pre_upload_list');
			var preInfo = cache.get('account_info');
			//从图片预览返回
			if((!!preUploadList)&&(!!preInfo)){
				$scope.upLoadList = preUploadList;
				$scope.info = preInfo;
				// $scope.fileList = cache.get("file_list");
				cache.put('pre_upload_list',[]);
				cache.put('account_info',{});
			}

		});
	}]);

};