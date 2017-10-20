/**=========================================================
 * 供应链金融-应收账款提前付款申请
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('scf.prepay.apply2', MainController);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService', '$q', 'BtTipbar', 'BtPopInfo', 'BtRouterService'];
	function MainController($scope, configVo, BtUtilService, $q, BtTipbar, BtPopInfo, BtRouterService) {
		
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
							$scope.preCreditInfoData = jsonData.data.elecAgreement;	//提前付款合同信息

							$scope.basicInfo = jsonData.data; //基本信息
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
							$scope.basicInfo.cStartDate = new Date().format('YYYY-MM-DD'); //初始时间
							$scope.basicInfo.cEndDate = new Date().getCommonDate($scope.basicInfo.endDate)
								.getSubDate('DD', 1).format('YYYY-MM-DD');//截止日期

							BtUtilService
								.post(configVo.BTServerPath.Query_Factory_List, { custNo: $scope.basicInfo.custNo })
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										$scope.factoryList = jsonData.data; //资金方列表
										if ($scope.basicInfo.factoryNo) {
											for (var i = jsonData.data.length - 1; i >= 0; i--) {
												if (jsonData.data[i].coreCustNo == $scope.basicInfo.factoryNo) {
													$scope.pageInfo.factoryVo = jsonData.data[i];
													break;
												}
											}
										} else {
											$scope.pageInfo.factoryVo = jsonData.data[0];
										}

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
				src: configVo.modulePaht + '/' + (configVo.btParams.src || '/1.html')
			};
			$scope.toPage1 = function () {

				//页面2跳转到页面1
				$scope.pageInfo.src = configVo.modulePaht + '/1.html';
			};

			// 应收账款表格配置
			$scope.tableCreditParams = {
				rowSelection: true,
				paginationControls: true,
				cols: [
					{
						title: '凭证编号',
						field: 'refNo',
						width: '15%'
					}, {
						title: '账单编号',
						field: 'receivableNo',
						width: '14%'
					}, {
						title: '账单金额',
						field: 'balance',
						width: '14%'
					}, {
						title: '账款余额',
						field: 'surplusBalance',
						width: '14%'
					}, {
						title: '结算日期',
						field: 'endDate',
						width: '14%'
					}, {
						title: '发票号',
						field: 'invoiceNos',
						width: '14%'
					}, {
						title: '贸易合同',
						field: 'agreeNo',
						width: '15%'
					}
				]
			};

			// 添加新的应收账款
			$scope.newCreditItem = function () {

				$scope.tableCreditParams.initOver = $q.defer();

				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/queryCredit.html', scope: $scope
				}, function () {
					$scope.tableCreditParams.initOver
						.promise.then(function (params) {

							BtUtilService
								.post(configVo.BTServerPath.Query_Credit)
								.then(function (jsonData) {
									$scope.tableCreditParams.setRowData(jsonData.data);
								});

						});
				});
			};
			// 计算保理机构的值
			$scope.mathFactoryValue = function (factoryVo) {

				$scope.basicInfo.factoryNo = factoryVo.factoryNo;
				$scope.basicInfo.factoryName = factoryVo.factoryName;

				var coreCustRate = factoryVo.coreCustRate;

				$scope.basicInfo.custCoreRate = coreCustRate;

				var dateValue = new Date().getCommonDate($scope.basicInfo.endDate + ' 00:00:00').getTime() -
					new Date().getCommonDate($scope.basicInfo.requestPayDate + ' 00:00:00').getTime();
				dateValue = dateValue / (1000 * 60 * 60 * 24);

				var benefitS = (coreCustRate * dateValue) / (365 * 100);

				var requestPayBalance = $scope.basicInfo.balance * (1 - benefitS);
				$scope.basicInfo.requestPayBalance = Number(requestPayBalance).toFixed(2);
			}

			// 选择应收账款信息
			$scope.selectCredit = function ($event) {
				var itemAttr = $scope.tableCreditParams.getRowSelection();

				if (itemAttr.length == 1) {
					$scope.creditInfoData = itemAttr;
					BtUtilService.close();
				} else {
					BtTipbar.tipbarWarning($event.target, '请选择一条应收账款');
				}

			};

			$scope.toPage2 = function ($event) {

				delete $scope.pageInfo.validTime;//页面跳转的时候，消除验证剩余时间 

				if ($scope.basicInfo.businStatus != 0) {
					$scope.pageInfo.src = configVo.modulePaht + '/2.html';
					return;
				}

				BtUtilService
					.post(configVo.BTServerPath.Save_Contract, {
						requestNo: $scope.basicInfo.requestNo,
						requestPayDate: $scope.basicInfo.requestPayDate,
						description: $scope.basicInfo.description
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							//页面1跳转到页面2
							$scope.basicInfo = jsonData.data; //基本信息
							$scope.pageInfo.src = configVo.modulePaht + '/2.html';
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});
			};
			//获取验证码
			$scope.QueryValidCode = function (dataAppno, $event) {
				BtUtilService
					.post(configVo.BTServerPath.QueryValidCode, { appNo: dataAppno, custType: '0' })
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							//页面1跳转到页面2
							var time = 60;

							var validCode = document.getElementById('validCode');
							validCode.innerHTML = '剩余' + time + '秒';
							var inTime = setInterval(function () {
								validCode.innerHTML = '剩余' + (--time) + '秒';
								if (time < 1) {
									clearTimeout(inTime);
									$scope.$apply(function () {
										delete $scope.pageInfo.validTime;//页面跳转的时候，消除验证剩余时间 
									});
								}
							}, 1000);

							$scope.pageInfo.validTime = true;

						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});
			};
			// 供应商签署合同
			$scope.saveSupplierSign = function ($event, dataAppNo, dataVcode) {

				BtUtilService
					.post(configVo.BTServerPath.SendValidCode, { appNo: dataAppNo, custType: '0', vCode: dataVcode })
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							BtUtilService
								.post(configVo.BTServerPath.Save_Supplier_Sign, { requestNo: $scope.basicInfo.requestNo })
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										//页面1跳转到页面2
										//$scope.basicInfo.businStatus = jsonData.businStatus;
										$scope.goBackIndexQuery();
										//123
									} else {
										BtTipbar.tipbarWarning($event.target, jsonData.message);
									}
								});
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});


			};
			//页面2的提交按钮
			$scope.saveConfirmPage2 = function ($event, dataInfo) {

				BtUtilService
					.post(configVo.BTServerPath.Save_Confirm_Page2, {
						requestNo: dataInfo.requestNo,
						requestPayDate: dataInfo.requestPayDate,
						description: dataInfo.description
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							//页面1跳转到页面2
							BtTipbar.pop('success', '平台信息', '提交成功！');
							setTimeout(function () {
								history.go(-2)
							}, 1000 * 1);
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});

			}
			// 采购方签署合同
			$scope.saveCoreSign = function ($event, dataAppNo, dataVcode) {

				BtUtilService
					.post(configVo.BTServerPath.SendValidCode, { appNo: dataAppNo, custType: '0', vCode: dataVcode })
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							BtUtilService
								.post(configVo.BTServerPath.Save_Core_Sign, { requestNo: $scope.basicInfo.requestNo })
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										//页面1跳转到页面2
										$scope.basicInfo.businStatus = jsonData.businStatus;
										$scope.preCreditInfoData = jsonData.data.elecAgreement;	//提前付款合同信息
									} else {
										BtTipbar.tipbarWarning($event.target, jsonData.message);
									}
								});
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});


			};
			//判断按钮状态
			$scope.confirmButtonStatus = function () {

				return !$scope.signAgreement2 && !$scope.confirm2;

			}
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
			//页面3的提交按钮
			$scope.saveConfirmPage3 = function ($event, dataInfo) {

				BtUtilService
					.post(configVo.BTServerPath.Save_Confirm_Page3, {
						requestNo: dataInfo.requestNo,
						requestPayDate: dataInfo.requestPayDate,
						description: dataInfo.description
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							//页面1跳转到页面2

							BtTipbar.pop('success', '平台信息', '提交成功！');
							setTimeout(function () {
								history.back();
							}, 1000 * 1);
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});
			}
			// 结算中心签署合同
			$scope.saveCoreSign4 = function ($event, dataAppNo, dataVcode) {

				BtUtilService
					.post(configVo.BTServerPath.SendValidCode, { appNo: dataAppNo, custType: '0', vCode: dataVcode })
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							BtUtilService
								.post(configVo.BTServerPath.Save_Core_Sign4, { requestNo: $scope.basicInfo.requestNo })
								.then(function (jsonData) {
									if (jsonData.code == 200) {
										//页面1跳转到页面2
										$scope.basicInfo.businStatus = jsonData.businStatus;
										$scope.preCreditInfoData = jsonData.data.elecAgreement;	//提前付款合同信息
									} else {
										BtTipbar.tipbarWarning($event.target, jsonData.message);
									}
								});
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});


			};
			//页面4的提交按钮
			$scope.saveConfirmPage4 = function ($event, dataInfo) {

				BtUtilService
					.post(configVo.BTServerPath.Save_Confirm_Page4, {
						requestNo: dataInfo.requestNo,
						requestPayDate: dataInfo.requestPayDate,
						description: dataInfo.description
					})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							//页面1跳转到页面2

							BtTipbar.pop('success', '平台信息', '提交成功！');
							setTimeout(function () {
								history.back();
							}, 1000 * 1);
						} else {
							BtTipbar.tipbarWarning($event.target, jsonData.message);
						}
					});
			}

			// 返回
			$scope.goBack = function () {
				history.back();
			};

			// 根据状态进行返回
			$scope.goBackIndexQuery = function () {
				if (configVo.btParams.go == 2) {
					history.go(-2);
				} else {
					history.back();
				}
			}

			// 查看应收账款信息
			$scope.lookCredit = function (item) {

				$scope.loanInfo = item;

				BtUtilService.open({
					templateUrl: configVo.modulePaht + '/creditDetail.html', scope: $scope
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
				//附件信息  /Platform/CustFile/fileListByBatchNo
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
					templateUrl: configVo.modulePaht + '/commercialDetail.html', scope: $scope
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
					templateUrl: configVo.modulePaht + '/invoiceDetail.html', scope: $scope
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
