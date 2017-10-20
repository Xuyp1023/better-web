/**=========================================================
 * 基金-编辑/添加-方案
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.peng.editplan', MainController);

	MainController.$inject = ['$scope', '$timeout', 'BtUtilService', 'configVo', 'BtTipbar'];
	function MainController($scope, $timeout, BtUtilService, configVo, BtTipbar) {

		activate();

		if (configVo.btParams.id) {
			BtUtilService
				.post(configVo.BTServerPath.findComMoneySchemeBySchemeId, { schemeId: configVo.btParams.id })
				.then(function (jsonData) {
					if (jsonData.code = 200) {
						$scope.basicInfo = jsonData.data;
					}
				});
		}else{	
			BtUtilService
			.post(configVo.BTServerPath.findComMoneySchemeTemp, {})
			.then(function (jsonData) {
				if (jsonData.code = 200) {
					$scope.basicInfo = jsonData.data;
				}
			});
		}


		////////////////
		//初始化方法开始
		function activate() {

			$scope.pageInfo = {
				src: configVo.modulePaht + '/temp/' + (configVo.btParams.src || '/1.html')
			};

			// 投资类型字典数据
			$scope.investType = BTDict.ContractStamperBusinStatus.toArray('value', 'name');
			$scope.basicInfo = {};
			$scope.basicInfo.type1 = $scope.investType[0].key;


			// 高度自适应
			$scope.refreshPage = function () {
				setTimeout(function () {
					setTimeout(function () {
						BtUtilService.freshIframe();
					}, 100);
				}, 100);
			}

			$scope.toPage2 = function () {
				// if (!$scope.formParams.getValid()) {
				// 	BtTipbar.tipbarWarning($event.target, '请输入投资期限！');
				// 	return;
				// }
				if (!$scope.formParams.getValid()) {
					BtTipbar.tipbarWarning($event.target, '表单有错误');
					return;
				}
				BtUtilService
					.post(configVo.BTServerPath.addComMoneySchemeTemp,$scope.basicInfo)
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							if(!$scope.basicInfo.id){
								BtUtilService
								.post(configVo.BTServerPath.findComMoneySchemeTemp, {})
								.then(function (jsonData) {
									if (jsonData.code = 200) {
										$scope.basicInfo = jsonData.data;
										
										queryProductList(function () {
											$scope.goPage(2);
										});
									}
								});
							}else{
								queryProductList(function () {
									$scope.goPage(2);
								});
							}
						}
					})
			};

			// 查看详情
			$scope.lookProductDetail = function (item) {

				BtUtilService.openModal('p/basic/fundInfo',item);

			};
			// 删除
			$scope.deleteCreditItem = function (item) {
				BtUtilService
					.post(configVo.BTServerPath.deleteSchemeFundCombin, {schemeid:item.id})
					.then(function (jsonData) {
						if (jsonData.code == 200) {
							queryProductList(function () {
							});
						}
					})
			}

			// 新增 / 编辑
			$scope.newCreditItem = function (item) {
				debugger;
				if(item){
				BtUtilService
					.post(configVo.BTServerPath.findSchemeFund, {ID:item.id})
					.then(function (jsonData) {
						$scope.fundDatas=jsonData.data;
						debugger;
						
						BtUtilService.open({ templateUrl: configVo.modulePaht + '/temp/product.html', scope: $scope }, addBodyHeight);
						
						$scope.fundDatas.agencyName= BTDict.SaleAgency.get($scope.fundDatas.agencyNo);
						
					})
				}
				else
				BtUtilService.open({ templateUrl: configVo.modulePaht + '/temp/product.html', scope: $scope }, addBodyHeight);
			}
			// 保存产品
			$scope.saveProduct = function ($event) {
				$scope.basicInfo.agencyNo='303';
				$scope.basicInfo.fundName='华夏薪金宝货币基金';
				$scope.basicInfo.fundCode='000645';
				$scope.basicInfo.incomeUnit='1.025';
				$scope.basicInfo.incomeRatio='4.075';
				$scope.basicInfo.minBalance='100';
				$scope.basicInfo.maxBalance='50000000.00';
				$scope.basicInfo.maxProportion='50';
				$scope.basicInfo.investmentProportion='40';
				$scope.basicInfo.schemeId=$scope.basicInfo.id;

				BtUtilService
				.post(configVo.BTServerPath.addSchemeFundCombin, $scope.basicInfo)
				.then(function (jsonData) {
					if (jsonData.code == 200) {
						
						queryProductList(function () {
							BtUtilService.close();
						});
					}
				})
				
			};
			
			//保存方案
			$scope.save = function ($event) {

				BtUtilService
				.post(configVo.BTServerPath.saveComMoneyScheme, {schemeTempId: $scope.basicInfo.id})
				.then(function (jsonData) {
					if (jsonData.code == 200) {
						
						$scope.goPage(3);
					}
				})
				
			};

			// $scope.toPage3 = function () {
			// 	$scope.goPage(3);
			// };

			//初始化基金
			$scope.initfund = function (){
				if(document.getElementById("search_fund_company").length<=2){
					initInfo(document.getElementById("search_fund_company"),
					BTDict.SaleAgency.toArray('value','name'),
					'----全部----',
					"","");
				}
			}

			$scope.basicInfo.pageNum=1;
			$scope.basicInfo.pageSize=10;
			$scope.basicInfo.pages=1;
			$scope.basicInfo.total=1;
			$scope.basicInfo.businFlag=22;

			//查找有效基金
			$scope.searchFund = function (){
				
				$scope.basicInfo.agencyNo=document.getElementById("search_fund_company").value;

				BtUtilService
				.post(configVo.BTServerPath.queryFundDays, $scope.basicInfo)
				.then(function (jsonData) {
					if (jsonData.code == 200) {
						effectiveFund(document.getElementById("search_fund_name"),jsonData.data);
					}
				})
			}

			//查询基金详情信息
			$scope.queryFundDay= function () {
				queryFundDay();
			};
			

			$scope.goSchemeList = function () {
				BtUtilService.go('p/fund/peng/scheme');
			};

			$scope.goPage = function (index) {
				$scope.pageInfo.src = configVo.modulePaht + '/temp/' + index + '.html';
			}

			$scope.formParams = {};


		} // 初始化结束

		// 查询产品
		function queryProductList(callback) {

			BtUtilService
				.post(configVo.BTServerPath.Query_Product_List, {schemeId: $scope.basicInfo.id,businStatus:''})
				.then(function (jsonData) {
					if (jsonData.code == 200) {
						$scope.rowDatas = jsonData.data;
						if (callback) {
							callback();
						}
					}
				})
		}

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
		

		
		//初始化基金
		function initInfo(targetElement,dicData,defaultElement,textName,valueName){
			var text = textName || 'key',
			value =  valueName || 'value',
			dicArray = dicData,
			defaultHtml = defaultElement||''; 
			for (var i = 0; i < dicArray.length; i++) {
				var tempDic = dicArray[i];
				targetElement.add(new Option(tempDic[value],tempDic[text]));
			}
		}

		//赋值基金
		function effectiveFund(targetElement,dicData){
			targetElement.options.length=0;
			var text = 'fundCode',
			value =  'fundName',
			dicArray = dicData
			if(dicArray.length>0){
				targetElement.options[0]=new Option(dicArray[0][value],dicArray[0][text])
				for (var i = 1; i < dicArray.length; i++) {
					var tempDic = dicArray[i];
					targetElement.add(new Option(tempDic[value],tempDic[text]));
				}
				queryFundDay();
			}
			else{
				targetElement.options[0]=new Option("暂无可购买基金","")
			}
			
		}

		////查询基金详情信息
		function queryFundDay(){
			$scope.basicInfo.fundCode=document.getElementById("search_fund_name").value;
			$scope.basicInfo.endDate="2017-09-28";
			$scope.basicInfo.beginDate="2017-08-29";
			BtUtilService
			.post(configVo.BTServerPath.queryFundDayByFundCode, $scope.basicInfo)
			.then(function (jsonData) {
				if (jsonData.code == 200) {
					$scope.fundDatas=jsonData.data[0];
					$scope.basicInfo.fundCode="";
				}
			})
		}
	}

})();
