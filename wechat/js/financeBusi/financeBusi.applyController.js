
/*
	融资申请
	@author : herb
*/

exports.installController = function(mainApp,common){

	mainApp.controller('financeBusi.applyController',['$scope','muiSupport','http','$rootScope','$route','cache','wx',function($scope,muiSupport,http,$rootScope,$route,cache,wx){

		/*私有属性区域*/
		_creditPicker = {};		//授信单选
		_productPicker = {};	//产品单选
		_unitPicker = {};	//期限单位单选
		_factorPicker = {};		//保理公司

		/*VM绑定区域*/
		//期限单位
		$scope.periodUnits = BTDict.PeriodUnit.toArray('value','text');

		//申请信息
		$scope.info = {};

		//标的物列表
		$scope.subjectMasterList = [];
		//授信列表
		$scope.creditList = [];
		//产品列表
		$scope.productList = [];
		//保理公司列表
		$scope.factorList = [];

		//合同附件列表
		$scope.agreeUploadList = [{
			fileInfoType:'agreeAccessory'
		}];
		//发票附件列表
		$scope.invoiceUploadList = [{
			fileInfoType:'invoiceFile'
		}];



		/*获取数据区域*/
		//切换 授信选择
		$scope.changeCredit = function(){
			_creditPicker.show(function(items){
				$scope.$apply(function(){
					$scope.info.creditMode = items[0].value;
					$scope.info.creditName = items[0].text;
				});
			});
		};

		//切换 产品选择
		$scope.changeProduct = function(){
			_productPicker.show(function(items){
				$scope.$apply(function(){
					$scope.info.productId = items[0].value;
					$scope.info.productName = items[0].text;
				});
			});
		};

		//切换 保理公司
		$scope.changeFactor = function(){
			_factorPicker.show(function(items){
				$scope.$apply(function(){
					$scope.info.factorNo = items[0].value;
					$scope.info.factorName = items[0].text;
					//置空
					$scope.info.credit = '';
					$scope.info.creditName = '';
					$scope.info.productId = '';
					$scope.info.productName = '';

					//查询保理公司列表
					$scope.queryFactorList().success(function(){
						_factorPicker = muiSupport.singleSelect($scope.factorList);//创建单项选择  
						//产品列表
						$scope.queryProductList().success(function(){
							_productPicker = muiSupport.singleSelect($scope.productList);//创建单项选择  
						});
						//授信列表
						$scope.queryCreditList().success(function(){
							_creditPicker = muiSupport.singleSelect($scope.creditList);//创建单项选择
						});
					});

				});
			});
		};

		$scope.changeUnit = function(){
			_unitPicker.show(function(items){
				$scope.$apply(function(){
					$scope.info.periodUnit = items[0].value;
					$scope.info.periodUnitName = items[0].text;
				});
			});
		};



		//获取单个融资详情
		$scope.queryInfo = function(type,id){

		};


		//获取标的物列表
		$scope.querySubjectMasterList = function(id,type){
			var promise = http.post(BTPATH.FIND_SUBJECT_MASTER,{id:id,type:type}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						//从标的物中获取信息
						if(data.data && data.data[0]){ 
							$scope.info = $.extend({},$scope.info,{
								'custNo':data.data[0].holderNo,
								'custName':data.data[0].holder,
								'coreCustNo':data.data[0].coreCustNo,
								'coreCustName':data.data[0].coreCustName
							});
						}
						$scope.subjectMasterList = data.data;
					});
				} 
			});
			return promise;
		};

		//获取保理公司列表
		$scope.queryFactorList = function(){
			var promise = http.post(BTPATH.QUERY_FACTOR_KEY_AND_VALUE,{custNo:$scope.info.custNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.factorList = ArrayPlus(data.data).replaceChildProp("name",'text',true);
					});
				} 
			});
			return promise;
		};

		//获取产品列表
		$scope.queryProductList = function(){
			var promise = http.post(BTPATH.FIND_PRODUCT_LIST,{}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.productList = ArrayPlus(data.data).replaceChildProp("name",'text',true);
					});
				} 
			});
			return promise;
		};

		//获取授信金额
		$scope.queryCreditList = function(){
			var promise = http.post(BTPATH.FIND_CREDIT,{'custNo':$scope.info.custNo,'coreCustNo':$scope.info.coreCustNo,'factorNo':$scope.info.factorNo}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.creditList = ArrayPlus(data.data).replaceChildProp("name",'text',true);
					});
				} 
			});
			return promise;
		};

		

		//获取合同附件列表
		$scope.queryAgreeUploadList = function(){
			http.post(BTPATH.QUERY_UPLOAD_LIST,{batchNo:''}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.agreeUploadList = data.data;
						$scope.agreeUploadList.push({});
					});
				} 
			});
		};

		//获取发票附件列表
		$scope.queryInvoiceUploadList = function(){
			http.post(BTPATH.QUERY_UPLOAD_LIST,{batchNo:''}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.invoiceUploadList = data.data;
						$scope.invoiceUploadList.push({});
					});
				} 
			});
		};


		//融资申请
		$scope.applyFinance = function(){

 			var mergeList = $.merge($scope.agreeUploadList,$scope.invoiceUploadList),
 				filelist = ArrayPlus(mergeList).extractChildArray("id",true);

			//合同附件 ids
			// var agreeIds = ArrayPlus($scope.agreeUploadList).extractChildArray("id",true);
			// //发票附件 ids
			// var invoiceIds = ArrayPlus($scope.invoiceUploadList).extractChildArray("id",true);
			var businessData = $.extend({},$scope.info,{
								'requestType':$scope.info.type,
								'bondBalance':$scope.info.bondBalance,
								'requestFrom':'2',
								'fileList':filelist
							});

			var flowData = {
				//流程名称
				workFlowName :$scope.currRole == "supplier" ? '资金方-供应商融资审批流程':'资金方-经销商融资审批流程' ,
				custNo:$scope.info.factorNo,  		//流程所属公司     在此为 保理公司编号
				startCustNo:$scope.info.custNo,  	//启动流程的公司
				// 流程参与公司
				factorCustNo:$scope.info.factorNo,
				supplierCustNo:$scope.currRole == "supplier" ? $scope.info.custNo : '',
				coreCustNo:$scope.info.coreCustNo,
				sellerCustNo:$scope.currRole == "agency" ? $scope.info.custNo : '',

				data:JSON.stringify(businessData)
			};

			http.post(BTPATH.STAR_TWORK_FLOW,flowData).success(function(data){
				if(common.isCurrentData(data)){
					/*$scope.$apply(function(){
						$scope.agreeUploadList = data.data;
						$scope.agreeUploadList.push({});
					});*/
					mui.alert('申请成功,点击确定返回票据列表','温馨提示',function(){
						window.location.href = '#/billPool';
					});
				} else {
					mui.alert('申请失败,请联系客服人员,服务端\n返回信息:'+data.message,'错误信息');
				}
			});
		};


		//当前用户类型
		$scope.queryCurrentRole = function(){
			http.post(BTPATH.GET_CURRENT_ROLE,{}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						if(data.data==='SELLER_USER '){
							$scope.currRole = "agency";
						}else{
							$scope.currRole ="supplier";
						}
					});
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



		


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

			// @todo 获取申请详情
			/*var id="1001846";//,1001847
			var type="2";*/

			var applyInfo = cache.get("apply_finance_info");
			if(!applyInfo) return ;

			$scope.info.type=applyInfo.type;
			$scope.info.orders=applyInfo.id;

			if (applyInfo.factorNo) {
				$scope.info.factorNo = applyInfo.factorNo;
				$scope.info.factorName = applyInfo.factorName;
				$scope.info.balance = applyInfo.balance;
			}

			//查询标的物列表
			$scope.querySubjectMasterList(applyInfo.id, applyInfo.type).success(function(){
				var balanceTotal = 0;
				for(var i=0 ;i<$scope.subjectMasterList.length; i++ ){
					var item = $scope.subjectMasterList[i];
					balanceTotal += item.balance;
				}
				$scope.info.invoiceBalance = balanceTotal;
				//查询保理公司列表
				$scope.queryFactorList().success(function(){
					_factorPicker = muiSupport.singleSelect($scope.factorList);//创建单项选择  
					//产品列表
					$scope.queryProductList().success(function(){
						_productPicker = muiSupport.singleSelect($scope.productList);//创建单项选择  
					});
					//授信列表
					$scope.queryCreditList().success(function(){
						_creditPicker = muiSupport.singleSelect($scope.creditList);//创建单项选择
					});
				});
				
			});
			

			_unitPicker = muiSupport.singleSelect($scope.periodUnits);

			//查询合同附件列表
			// $scope.queryAgreeUploadList();
			//查询发票附件列表
			// $scope.queryInvoiceUploadList();
			//查询当前用户类型
			$scope.queryCurrentRole();

			//从图片预览页面返回
			var preInfo = cache.get('finance_apply_info');
			var agreeList = cache.get('agree_upload_list');
			var invoiceList = cache.get('invoice_upload_list');
			if(preInfo && preInfo.preImg){
				$scope.agreeUploadList = agreeList;
				$scope.invoiceUploadList = invoiceList;
				$scope.info = preInfo;
				cache.put('agree_upload_list',[]);
				cache.put('invoice_upload_list',[]);
				cache.put('finance_apply_info',{});
			}
			
		});
	}]);

};