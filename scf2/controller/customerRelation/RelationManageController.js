/*
核心企业客户关系管理
@author tanp
*/
define(function (require, exports, module) {

	exports.installController = function (mainApp, common, validate, tipbar, loading, comdirect, dialog) {

		mainApp.controller('RelationManageController', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService', '$location', function ($scope, http, $rootScope, $route, cache, commonService, $location) {

			//详情
			$scope.info = {};
			$scope.custRelationList = {};
			$scope.custList = [];
			$scope.custType = "";


			//分页数据
			$scope.listPage = {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};

			//搜索所需信息
			$scope.searchData = {
				custNo: ''
			};

			//打开新增关联模板	
			$scope.assignOperatorBox = function (data) {
				// window.location.href="#/flowTask/assignOperator";
				$location.url("/flowTask/assignOperator");
			};


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess', function () {
				$scope.findCustTypeByLogin();

				//获取当前机构列表
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST, {}, $scope, 'custList').success(function () {
					$scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
					$scope.queryList();
				});
			});

			//查询融资列表
			$scope.queryList = function () {
				return http.post(BTPATH.QUERY_CUST_RELATIONCONFIG, $.extend({ flag: 1 }, $scope.listPage, $scope.searchData)).success(function (data) {
					if (common.isCurrentData(data)) {
						$scope.$apply(function () {
							$scope.custRelationList = data.data;
							$scope.listPage = data.page;
						});
					}
				});
			};

			// 查询当前登录的客户类型
			$scope.findCustTypeByLogin = function () {
				return http.post(BTPATH.FIND_CUST_TYPE_LOGIN, {}).success(function (data) {
					if (common.isCurrentData(data)) {
						$scope.$apply(function () {
							$scope.custType = data.data;
						});
					}
				});
			};

			$scope.openFactorInfo = function (item) {
				var isFac = ArrayPlus(['0', '2', '3']).isContain(item.relateType);
				if (!isFac) return;
				if (item.relateType2 == '2') {
					cache.put('upload_param', {
						'custNo': item.relateCustno,
						'custName': item.custName,
						'disCustName': item.relateCustname,
						'businStatus': item.businStatus,
						'selectCustNo': $scope.searchData.custNo,
						'selectRelateType': item.relateType
					});
				} else {
					cache.put('upload_param', {
						'custNo': item.relateCustno,
						'custName': item.relateCustname,
						'businStatus': item.businStatus,
						'disCustName': item.custName,
						'selectCustNo': $scope.searchData.custNo,
						'selectRelateType': item.relateType
					});
				}
				// window.location.href = '#/customerRelation/facBusiDetail/';
				$location.url("/customerRelation/facBusiDetail");
			};

			$scope.openRelationInfo = function () {
				cache.put('upload_param', {
					'selectCustNo': $scope.searchData.custNo
				});
				$location.url("/customerRelation/coreAddRelation");
			};


		}]);

	};

});