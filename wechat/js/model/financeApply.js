
exports.installController = function(mainApp,common){

	mainApp.controller('financeApplyCtrl',['$scope','muiSupport','http','$rootScope','$route','cache','commonService','$routeParams','wx',function($scope,muiSupport,http,$rootScope,$route,cache,commonService,$routeParams,wx){
		/*私有属性区域*/
		$scope.beginPicker = {};
		_statusPicker = {};
		_factorPicker = {};
		_accountPicker = {};
		_statusList = BTDict.BillNoteStatus.toArray('value','text');
		/*VM绑定区域*/
		$scope.searchData = {
	      
	      
		};
		$scope.info = {};

		$scope.pageInfo = {};
		$scope.pageInfo.assetType = {};


		$scope.factorProList = [];

		$scope.infoList = [];

		//合同附件列表
		$scope.agreeUploadList = [{
			fileInfoType:'agreeAccessory'
		}];
		//发票附件列表
		$scope.invoiceUploadList = [{
			fileInfoType:'invoiceFile'
		}];

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10 
		};
		$scope.changeDate = function(flag){
			$scope.datePicker.show(function(res){
	          $scope.$apply(function(){ 	          	
	            $scope.info.requestPayDate = res.text;	            
	          });
	          	
	      });
		}   
		
		/*获取数据区域*/
		//切换查询条件
		$scope.changeFac = function(){
			_factorPicker.show(function(items){
					
				$scope.covertProductToRequest(items[0]);
				
			});
		};
		// 切换账户
		$scope.changeAccount = function(){
			_accountPicker.show(function(items){
				$scope.$apply(function(){					
					$scope.info.custBankAccount = items[0].value; 
					$scope.info.custBankName = items[0].text.split("-")[1];
					$scope.refreshBankList($scope.info.custBankAccount);
				});
				
			});
		};
		//根据账户号刷新开户行信息
		$scope.refreshBankList = function(accountNo){
			http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVESUBMITREQUESTTOTAL,{ bankAcco: accountNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){						
						$scope.info.custBankAccountName = data.data.bankAccoName;
						$scope.info.custBankName = data.data.bankName;
					})
					
				}
			})
		}


		
		
		// 转化为键值对形式方法
		function toArrayValueName(list,v,k){
			var arr = [];
			for(var i=0,len=list.length;i<len;i++){
				var temp =list[i];
				arr.push({
					value: temp[v],
					text : temp[k]
				})
			}
			return arr;
		}
		// 日期验证方法
		function IsNull(id){    
		    var str = document.getElementById(id).value.trim();    
		    if(str.length==0){    
		        mui.alert('请选择期望付款日期');
		        return;    
		    }    
		}    

		//申请融资
		$scope.submit = function(){
				// 验证是否选择了日期
				IsNull("ipt");
				if($scope.pageInfo.assetType && $scope.pageInfo.assetType['3'] && $scope.agreeUploadList.length == 1) {
					mui.alert('请上传合同附件');
					return;
				} 

				if($scope.pageInfo.assetType && $scope.pageInfo.assetType['4'] && $scope.invoiceUploadList.length == 1) {
					mui.alert('请上传发票附件');
					return;
				} 
 				var agreeList = ArrayPlus($scope.agreeUploadList).extractChildArray("id",true);
 				var invoiceList = ArrayPlus($scope.invoiceUploadList).extractChildArray("id",true); 				

			http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVESUBMITREQUESTTOTAL,$.extend({},$scope.info,{
				wechaMarker:'1',
				requestProductCode:$scope.info.productCode,
				goodsBatchNo:agreeList,
				statementBatchNo:invoiceList
			})).success(function(data){
				
				if(common.isCurrentData(data)){

					window.location.href = '#/sign'; 
				}else{
					mui.alert('申请失败,请联系客服人员,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
			
		};

		//====================================== 附件相关操作 start ===========================================
		//上传配置
		var upload_config = {
			'agree':{
				upload_path:BTPATH.SAVE_REHISTERPLUS_INFO,
				fileInfoType:'agreeAccessory',
				listName:'agreeUploadList',
			},
			'invoice':{
				upload_path:BTPATH.SAVE_REHISTERPLUS_INFO,
				fileInfoType:'invoiceFile',
				listName:'invoiceUploadList',
			}
		};

		//上传图片附件
		$scope.uploadImage = function(flag){
			//获取配置			
			var config = upload_config[flag];
			wx.uploadImage(function(res){
				http.post(config.upload_path,{
					'fileTypeName':config.fileInfoType,
					'fileMediaId':res.serverId
				}).success(function(data){
					if(common.isCurrentData(data)){						
						$scope.$apply(function(){
							var length = $scope[config.listName].length;
							//用上传返回的数据替换
							$scope[config.listName][length-1] = data.data;
							$scope[config.listName].push({
								fileInfoType:config.fileInfoType
							});
						});
					}
				});
			},true);
		}; 


		//删除附件
		$scope.delUpload = function(item,flag){ 
			//获取配置
			var config = upload_config[flag];
			$scope[config.listName] = ArrayPlus($scope[config.listName]).delChild("id",item.id);

			/*http.post(BTPATH.XXXXX,{id:item.id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope[config.listName] = ArrayPlus($scope[config.listName]).delChild("id",id);
					});
				}else{
					mui.alert('删除失败,服务端\n返回信息:'+data.message,'错误信息');
				}
			});*/
		};


		//预览图片
		$scope.preImg = function(item){
			//缓存数据
			cache.put('agree_upload_list',$scope.agreeUploadList);
			cache.put('invoice_upload_list',$scope.invoiceUploadList);
			cache.put('finance_apply_info',$.extend({preImg:true},$scope.info));
			window.location.href = '#/preImg/'+item.id;
		};

		//====================================== 附件相关操作 end ===========================================
		
		$scope.f={};
		$scope.covertProductToRequest = function (data){

			for(var i=0,len=$scope.factorProList.length;i<len;i++){
				if($scope.factorProList[i].productCode==data.value){

					$scope.$apply(function(){
						$scope.info.productName=$scope.factorProList[i].productName;

						$scope.info.productCode=$scope.factorProList[i].productCode;
						$scope.info.factoryName=$scope.factorProList[i].factoryName;
						$scope.info.receivableRequestType=$scope.factorProList[i].receivableRequestType;
					});
					
					
				}
			}
			$scope.queryAssectType($scope.info.productCode);
		}
		// 查询融资类型
		$scope.queryAssectType = function(productCode){
			$scope.pageInfo.assetType={};
			http.post(BTPATH.FIND_COREPRODUCTCUST_FINDASSETDICTBYPRODUCT,{productCode: productCode}).success(function(data){
				if(common.isCurrentData(data)){						
						$scope.$apply(function(){
							angular.forEach(data.data,function(row){
								$scope.pageInfo.assetType[row.dictType] = true;
							});
							
						});
					}					
					
			})
		}
		
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){			
			// var id = (cache.get('apply_finance_info')).requestNo;
			var id = $routeParams.id;
			
			http.post(BTPATH.FIND_RECEIVABLE_REQUEST_FINDONEYBYREQUESTNO,{requestNo:id}).success(function(data){
				if(common.isCurrentResponse(data)){
					$scope.$apply(function(){
						$scope.info = data.data;						
						// 查询下拉融资产品
						commonService.queryBaseInfoList(BTPATH.QUERY_COREPRODUCTCUST_QUERYCANUSEPRODUCT,{custNo:$scope.info.custNo,coreCustNo:$scope.info.coreCustNo},$scope,'factorProList').success(function(){						
							
								
							$scope.f = toArrayValueName($scope.factorProList,'productCode','productName');
							
													
							
							// 刷新融资产品
							$scope.covertProductToRequest($scope.f[0]);
							 
							_factorPicker = muiSupport.singleSelect($scope.f);

								
						})
						// 查询下拉银行账户列表
						commonService.queryBaseInfoList(BTPATH.QUERY_ACCOUNT_QUERYACCOUNTKEYANDVALUE,{custNo: $scope.info.custNo},$scope,'accountList').success(function(){
							

							
							$scope.accountList = toArrayValueName($scope.accountList,'value','name');
							_accountPicker = muiSupport.singleSelect($scope.accountList);
							

							
							$scope.$apply(function(){
							
								$scope.info.custBankAccount = $scope.accountList? $scope.accountList[0].value : '';
								$scope.info.custBankName = $scope.accountList? $scope.accountList[0].text.split("-")[1] : '';
								// 刷新账户列表
								$scope.refreshBankList($scope.info.custBankAccount);
							});
							
		
						})
				
					});
				}else{
					mui.alert('未查询到对应信息,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
			//创建时间选择				
			$scope.datePicker = muiSupport.dateSelect({type:'date'});			
			   		
		});
	}]);

}
