/**=========================================================
 * 企鹅宝-天天基金
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('p.fund.peng.tiantian', MainController)
		.filter('businTypef' ,function(){
			return function(data){
				var rowElement = '';
				switch (data) {
				case '01':
				  rowElement += '开户';
				  break;
				case '22':
				  rowElement += '申购';
				  break;
				case '24':
				  rowElement += '赎回';
				  break;
				}
				return rowElement;
			};
		})
		.filter('businStatusf' ,['$sce',function($sce){

			return function(data,pros){

				var show = (pros=='show');
				var rowElement = '';
				switch (data) {
				case '3':
					rowElement += '失败';
					if(show){
						rowElement = '<span class="bt-table-status error"></span>'+rowElement;
					}
		          break;
		        case '2':
		        	rowElement += '已过期';
		        	if(show){
						rowElement = '<span class="bt-table-status warning"></span>'+rowElement;
					}
		          break;
		        case '0':
		        	rowElement += '未发送';
		        	if(show){
						rowElement = '<span class="bt-table-status default"></span>'+rowElement;
					}
		          break;
		        case '1':
		        	rowElement += '成功';
		        	if(show){
						rowElement = '<span class="bt-table-status success"></span>'+rowElement;
					}
		          break;
				}
				return $sce.trustAsHtml(rowElement);
			};
		}]);

	MainController.$inject = ['$scope', 'configVo', 'BtUtilService', '$timeout','BtTipbar','businTypefFilter'];

	function MainController($scope, configVo, BtUtilService, $timeout,BtTipbar,businTypef) {

		activate();

		// 初始化机构
		BtUtilService
			.post(configVo.BTServerPath.TRADE_ACCOUNT_LIST)
			.then(function (jsonData) {
				if (jsonData.code === 200) {
					$scope.AccountList = jsonData.data;
				}
			});
		$scope.queryList();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.tableParams = {
				parentScope: $scope,
				paginationControls: true,
				cols: [
					{
						title: '机构名称',
						type: 'template',
						cellTemplate: '<a class="bt-table-button" ng-click="lookDetail({{id}})">{{custName}}</a>',
						width: '12%'
					}, {
						title: '产品名称',
						field: 'productName',
						width: '10%'
					}, {
						title: '申请单号',
						field: 'requestNo',
						width: '17%'
					}, {
						title: '业务类型',
						field: 'businType',
						filter: 'custom',
						getStatusHtml:function getStatusHtml(status) {
					      return businTypef(status);
					    },
						width: '10%'
					}, {
						title: 'ContextId',
						field: 'contextId',
						width: '17%'
					}, {
						title: '手机号',
						field: 'mobileNo',
						width: '12%'
					}, {
						title: '状态',
						field: 'businStatus',
						filter: 'custom',
						getStatusHtml:function getStatusHtml(status) {
					      var rowElement = '';
					      switch (status) {
					        case '3':
					          rowElement += '<span class="bt-table-status error"></span>失败';
					          break;
					        case '2':
					          rowElement += '<span class="bt-table-status warning"></span>已过期';
					          break;
					        case '0':
					          rowElement += '<span class="bt-table-status default"></span>未发送';
					          break;
					        case '1':
					          rowElement += '<span class="bt-table-status success"></span>成功';
					          break;
					      }
					      return rowElement;
					    },
						width: '12%'
					}, {
						title: '操作',
						type: 'buttons',
						width: '7%',
						config: [{ title: '验证', event: 'validate', show: "row.businStatus =='0'" }]
					}
				]
			};
			// 查询按钮事件
			$scope.queryList = function () {
				if ($scope.tableParams.setDatasource) {
					$scope.queryList = setDatasource;
					setDatasource();
				} else {
					$timeout(function () {
						$scope.queryList();
					}, 50);
				}

			}
			// 验证按钮事件
			$scope.validate = function (item, $event) {

				BtUtilService
					.post(configVo.BTServerPath.FIND_DAYFUND_INFO,{"smsDayId":item.id})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.DayFundInfo = jsonData.data;
							BtUtilService.open({
								templateUrl: configVo.modulePaht + '/validate.html', scope: $scope
							});
						}
					});
			}
			// 查看详情
			$scope.lookDetail = function (id) {

				BtUtilService
					.post(configVo.BTServerPath.FIND_DAYFUND_INFO,{"smsDayId":id})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							$scope.DayFundInfo = jsonData.data;
							BtUtilService.open({
								templateUrl: configVo.modulePaht + '/lookDetail.html', scope: $scope
							});
						}
					});
			}
			// 提交验证码
			$scope.validateSubmit = function () {

				BtUtilService
					.post(configVo.BTServerPath.Validate_Submit,{"smsDayId":$scope.DayFundInfo.id,"verifyCode":$scope.DayFundInfo.verifyCode})
					.then(function (jsonData) {
						if (jsonData.code === 200) {
							// 刷新主界面
							$scope.queryList();
							// 关闭对话框
							BtUtilService.close();
							BtTipbar.pop('success','提示信息','修改成功');
						}
					});
			};

		} // 初始化结束

		function setDatasource() {
			$scope.tableParams.setDatasource({
				searchUrl: configVo.BTServerPath.Query_List_Info,
				queryVo: {custNo:$scope.custNo}
			});
		}

	}

})();
