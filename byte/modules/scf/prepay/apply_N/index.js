/**=========================================================
 * 供应链金融-应收账款提前付款申请
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('scf.prepay.apply_N', MainController);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService', '$q', 'BtTipbar', 'BtPopInfo'];
	function MainController($scope, configVo, BtUtilService, $q, BtTipbar, BtPopInfo) {

		$scope.agreeUploadList = [];

		$scope.invoiceUploadList = [];
		activate();

		switch (configVo.btParams.src) {
			default:
				BtUtilService
					.post(configVo.BTServerPath.Query_All_FIND, { requestNo: configVo.btParams.id })
					.then(function (jsonData) {
						if (jsonData.code == 200) { 
							$scope.creditInfoData = jsonData.data.asset.basedataMap.receivableList; //应收账款信息
							$scope.commercialInfoData = jsonData.data.asset.basedataMap.agreementList;	//贸易合同信息
							$scope.invoiceInfoData = jsonData.data.asset.basedataMap.invoiceList;	//发票清单信息
							$scope.preCreditInfoData = jsonData.data.coreAgreement;	//提前付款合同信息
							// 从wx端上传的资料(合同和发票)
							if(jsonData.data.asset.goodsBatchNo){
								BtUtilService
								.post(configVo.BTServerPath.QUERY_ATTACHMENT_LIST[1]+"?time="+Math.random(1,2), { batchNo: jsonData.data.asset.goodsBatchNo})
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										$scope.agreeUploadList = jsonData.data; 										
									}
								});
								
							}
							if(jsonData.data.asset.statementBatchNo){ 
								BtUtilService
								.post(configVo.BTServerPath.QUERY_ATTACHMENT_LIST[1]+"?time="+new Date().getTime(), { batchNo: jsonData.data.asset.statementBatchNo})
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										$scope.invoiceUploadList = jsonData.data; 										
									}
								});
							
							}
								
							$scope.basicInfo = jsonData.data; //基本信息


							$scope.basicInfo.cStartDate = new Date().format('YYYY-MM-DD'); //初始时间
							$scope.basicInfo.cEndDate = new Date().getCommonDate($scope.basicInfo.endDate)
								.getSubDate('DD', 1).format('YYYY-MM-DD');//截止日期

							BtUtilService
								.post(configVo.BTServerPath.Query_Bank_List, { custNo: $scope.basicInfo.custNo })
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										$scope.bankList = jsonData.data; //资金方列表
										$scope.basicInfo.custBankAccount = jsonData.data[0].value;
										$scope.refreshBankList($scope.basicInfo.custBankAccount);
									}
								});

							BtUtilService
								.post(configVo.BTServerPath.Query_Product_List, { requestNo: configVo.btParams.id })
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										$scope.factoryList = jsonData.data; //资金方列表
										$scope.pageInfo.productVo = jsonData.data[0];
										$scope.basicInfo.productCode = jsonData.data[0].productCode;
										$scope.refreshProductList($scope.basicInfo.productCode);
									}
								});

							$scope.refreshPage();
						}
					});
				break;
		}




		////////////////
		//初始化方法开始
		function activate() {

			$scope.pageInfo = {
				src: configVo.modulePaht + '/temp/' + (configVo.btParams.src || '/1.html')
			};

			$scope.toPage2 = function ($event) {

				if ($scope.basicInfo.businStatus != 0) {
					$scope.pageInfo.src = configVo.modulePaht + '/2.html';
					return;
				}

				if($scope.pageInfo.productVo.receivableRequestType !='1' && $scope.pageInfo.productVo.receivableRequestType !='2'){
					BtTipbar.tipbarWarning($event.target, '模式不匹配！');
					return;
				}

				BtUtilService
					.post(configVo.BTServerPath.Save_Contract, {
						requestNo: $scope.basicInfo.requestNo,
						requestPayDate: $scope.basicInfo.requestPayDate,
						description: $scope.basicInfo.description,
						requestProductCode:$scope.pageInfo.productVo.productCode,
						custBankAccount:$scope.basicInfo.custBankAccount,
						custBankAccountName:$scope.basicInfo.custBankAccountName,
						custBankName:$scope.basicInfo.custBankName
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							//页面1跳转到页面2
							$scope.basicInfo = jsonData.data; //基本信息
							if($scope.basicInfo.receivableRequestType==1){
								window.location.href='./home1.html?bt_v='+new Date().getTime()+'#/scf/prepay/apply?id='+$scope.basicInfo.requestNo+'&src=2.html&go=2';
							}else if($scope.basicInfo.receivableRequestType==2){
								window.location.href='./home1.html?bt_v='+new Date().getTime()+'#/scf/prepay/apply2?id='+$scope.basicInfo.requestNo+'&src=2.html&go=2';
							}
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});
			};

			//	刷新银行显示信息
			$scope.refreshBankList = function(custBankAccount){
				BtUtilService
				.post(configVo.BTServerPath.Query_BankInfo, { bankAcco: custBankAccount})
				.then(function (jsonData) {
					if (jsonData.code == 200) {
						$scope.basicInfo.custBankAccountName = jsonData.data.bankAccoName;
						$scope.basicInfo.custBankName = jsonData.data.bankName;
					}
				});
			};

			//	刷新产品列表
			$scope.refreshProductList = function(productCode){

				BtUtilService
				.post(configVo.BTServerPath.Query_Asset_Dict, { productCode: productCode})
				.then(function (jsonData) {
					if (jsonData.code == 200) {
						var assetType = {};
						angular.forEach(jsonData.data,function(row){
							assetType[row.dictType] = true;
						});
						$scope.pageInfo.assetType = assetType;
						$scope.refreshPage();
					}
				});
			};

			//计算收益金额
			$scope.setPayBalance = function () {

				var coreCustRate = $scope.basicInfo.custCoreRate;

				var dateValue = new Date().getCommonDate($scope.basicInfo.endDate + ' 00:00:00').getTime() -
					new Date().getCommonDate($scope.basicInfo.requestPayDate + ' 00:00:00').getTime();
				dateValue = dateValue / (1000 * 60 * 60 * 24);

				var benefitS = (coreCustRate * dateValue) / (365 * 100);

				var requestPayBalance = $scope.basicInfo.balance * (1 - benefitS);
				$scope.basicInfo.requestPayBalance = Number(requestPayBalance).toFixed(2);
			}


			// 返回
			$scope.goBack = function () {
				history.back();
			};

			// 查看应收账款信息
			$scope.lookCredit = function (item) {

				$scope.loanInfo = item;

				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/temp/creditDetail.html', scope: $scope
				});
			};

			// 查看贸易合同信息
			$scope.lookCommercial = function (item) {

				$scope.info = item;
				//买方信息
				BtUtilService
					.post(configVo.BTServerPath.Query_Contract_Buy, {
						custNo: item.buyerNo,
						contractId: item.id
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							$scope.info.buyerInfo = jsonData.data;
						}
					});
				//卖方信息
				BtUtilService
					.post(configVo.BTServerPath.Query_Contract_Sell, {
						custNo: item.supplierNo,
						contractId: item.id
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							$scope.info.supplierInfo = jsonData.data;
						}
					});
				//附件信息
				BtUtilService
					.post(configVo.BTServerPath.Query_Invoice_Files, {
						batchNo: item.batchNo
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							$scope.info.uploadList = jsonData.data;
						}
					});

				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/temp/commercialDetail.html', scope: $scope
				}, addBodyHeight);
			};

			// 查看发票清单信息
			$scope.lookInvoice = function (item) {

				$scope.info = item;
				var invoiceDate = item.invoiceDate.split('-');
				$scope.info.invoiceDateInfo = invoiceDate;

				//附件信息
				BtUtilService
					.post(configVo.BTServerPath.Query_Invoice_Files, {
						batchNo: item.batchNo
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							$scope.info.uploadList = jsonData.data;
						}
					});

				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/temp/invoiceDetail.html', scope: $scope
				});
			};

			// 查看提前付款合同信息
			$scope.lookPreCredit = function (item) {
				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/../public/preCreditDetail.html', scope: $scope
				}, function () {

					//附件信息
					BtUtilService
						.post(configVo.BTServerPath.Query_ElecAgree_Files, {
							appNo: item.appNo
						})
						.then(function (jsonData) {
							if (jsonData.code == 200) {
								if(jsonData.data.signed){
									var imgUrlData = [];
									angular.forEach(jsonData.data.data, function(row){
										var imgUrl = '../Scf/ElecAgree/downloadAgreeImage?appNo='+item.appNo+'&batchNo='+row.batchNo+'&id='+row.id;
										// var imgUrl = configVo.modulePaht + '/../public/img/'+row.id+'.jpeg';
										imgUrlData.push(imgUrl);
									});
									$scope.imgUrlData = imgUrlData;
								}else{
									var o = document.getElementById("detail_iframe");
									var ed = document.all ? o.contentWindow.document : o.contentDocument;
									o.height ='100%';
									ed.open();
									ed.write(jsonData.data.data);
									ed.close();
								}
							}
						});
				});
			};



			// 高度自适应
			$scope.refreshPage = function () {
				setTimeout(function () {
					setTimeout(function () {
						BtUtilService.freshIframe();
					}, 100);
				}, 100);
			}

		} // 初始化结束

		function addBodyHeight() {
			setTimeout(function () {
				// 兼容老系统的自适应高度
				var href = window.parent.location.href;
				var frameOld = href && (href.indexOf('scf2') || href.indexOf('p') || href.indexOf('scf'));
				if (frameOld) {
					var ifm = angular.element(window.parent.document.getElementsByName('content_iframe'));
					var height = angular.element(document).find("html")[0].scrollHeight;
					if (ifm[0].scrollHeight < height) {
						$scope.refreshPage();
					}
				}
			}, 100);
		}
	}

})();
