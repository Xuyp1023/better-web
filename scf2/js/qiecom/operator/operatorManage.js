/*
操作员管理
作者:bhg
*/
define(function (require, exports, module) {
	require.async(['dicTool', 'bootstrap', "datePicker", 'easyloader', 'jqueryPaser'], function () {
		require.async(['BTDictData'], function () {
			var validate = require("validate");
			var tipbar = require("tooltip");
			var common = require("common");
			var loading = require("loading");
			var comdirect = require("direct");
			var dialog = require("dialog");
			var comfilter = require("filter");
			var comservice = require("service_s2");
			var BTPATH = require("path_s2");
			var pages = require("pages");
			require('modal');
			require('date');
			require("upload");

			//定义模块
			var mainApp = angular.module('mainApp', ['modal', 'date', 'pagination', 'upload']);

			//扩充公共指令库
			comdirect.direcPlus(mainApp);

			//扩充公共过滤器
			comfilter.filterPlus(mainApp);

			//扩充公共服务
			comservice.servPlus(mainApp);

			//兼容IE模式
			// .config(function($sceProvider){
			// 	$sceProvider.enabled(false);
			// })

			//控制器区域
			mainApp.controller('mainController', ['$scope', 'http', 'commonService', 'form', 'easyPlugin', function ($scope, http, commonService, form, easy) {
				/*VM绑定区域*/
				$scope.statusList = BTDict.CustOperatorStatus.toArray('value', 'name');
				$scope.typeList = BTDict.RoleType.toArray('value', 'name');
				$scope.identType = BTDict.PersonIdentType.toArray('value', 'name');
				$scope.custList = [];
				$scope.coreCustList = [];
				$scope.custInfoList = [];
				//==============================公共操作区 start=================================
				$scope.searchData = {
					operCode: '',
					name: '',
					status: ''
				};
				//分页数据
				$scope.listPage = {
					pageNum: 1,
					pageSize: 10,
					pages: 1,
					total: 1
				};
				//操作员管理列表
				$scope.infoList = [];
				//单个操作员管理信息
				$scope.info = {
				};

				$scope.roleList = [];

				//查询列表
				$scope.searchList = function () {
					$scope.listPage.pageNum = 1;
					$scope.queryList(true);
				};

				//获取操作员管理申请列表
				$scope.queryList = function (flag) {
					//弹出弹幕加载状态
					var $mainTable = $('#search_info .main-list');
					loading.addLoading($mainTable, common.getRootPath());
					$scope.listPage.flag = flag ? 1 : 2;
					http.post(BTPATH.QUERY_LIST_OPERATOR, $.extend({}, $scope.listPage, $scope.searchData))
						.success(function (data) {
							//关闭加载状态弹幕
							loading.removeLoading($mainTable);
							if (common.isCurrentData(data)) {
								$scope.$apply(function () {
									$scope.infoList = common.cloneArrayDeep(data.data);
									if (flag) {
										$scope.listPage = data.page;
									}
								});
							}
						});
				};

				//新增操作员信息
				$scope.addInfo = function (target) {
					var $target = $(target);

					if ($scope.info.clerkMan && (!$scope.BrokerIdHeadFile || !$scope.BrokerIdNationFile)) {
						return tipbar.errorLeftTipbar($target, '经办人身份证信息未上传！', 3000, 9999);
					}

					//================== 参照区域 5 start =========================//
					//设置校验项 | 校验
					var valid = validate.validate($('#add_box'));
					if (!valid) return tipbar.errorLeftTipbar($target, '还有未正确填写项，请修改后提交！', 3000, 9999);
					//================== 参照区域 5 end =========================//
					if (!$scope.info.ruleList) {
						tipbar.errorLeftTipbar($target, '请选择操作员角色！', 3000, 9999);
						return;
					}
					$scope.info.custList = form.getCheckboxValueArray($('#add_box [mapping="checkboxCustGroup"] :checkbox'), true);
					/*if(!$scope.info.custList){
						tipbar.errorLeftTipbar($target,'请选择机构名称！',3000,9999);
						return;
					}*/
					$scope.info.fileList = $scope.BrokerIdHeadFile.id +',' + $scope.BrokerIdNationFile.id;
					http.post(BTPATH.ADD_ONE_OPERATOR, $scope.info)
						.success(function (data) {
							if (common.isCurrentResponse(data)) {
								tipbar.infoTopTipbar('新增操作员成功!', {});
								$scope.closeRollModal("add_box");
								$scope.queryList(true);
							} else {
								tipbar.errorTopTipbar($target, '新增操作员失败:' + data.message, 3000, 6662);
							}
						});
				};

				//上传回调 替换元素
				function callback(list, type, alias) {
					return function () {
						//删除新添加的，并将其值赋给原有的
						var addItem = $scope[list].pop();
						$scope[alias] = addItem;
					};
				}
				$scope['attachList'] = [];
				//上传经办人信息
				$scope.openOperatorUpload = function (event, type, typeName, alias) {
					$scope.uploadConf = {
						//上传触发元素
						event: event.target || event.srcElement,
						//上传附件类型
						type: type,
						//类型名称
						typeName: typeName,
						//存放上传文件
						uploadList: $scope['attachList'],
						//回调
						callback: callback('attachList', type, alias)
					};
				};
				//删除附件项
				$scope.delUploadItem = function (alias) {
					$scope[alias] = null;
				};

				//编辑操作员管理
				$scope.editInfo = function (target) {
					var $target = $(target);

					if ($scope.info.clerkMan && (! $scope.BrokerIdHeadFile || ! $scope.BrokerIdNationFile)) {
						return tipbar.errorLeftTipbar($target, '经办人身份证信息未上传！', 3000, 9999);
					}

					//================== 参照区域 4 start =========================//
					//设置校验项 | 校验
					var valid = validate.validate($('#edit_box'));
					if (!valid) return tipbar.errorLeftTipbar($target, '还有未正确填写项，请修改后提交！', 3000, 9999);
					//================== 参照区域 4 end =========================//

					if ($scope.info.defOper) {
						tipbar.errorLeftTipbar($target, '不能编辑管理员的信息', 3000, 9999);
						return;
					}
					// $scope.info.ruleList = form.getCheckboxValueArray($('#edit_box [mapping="checkboxGroup"] :radio'),true);
					if (!$scope.info.ruleList) {
						tipbar.errorLeftTipbar($target, '请选择操作员角色！', 3000, 9999);
						return;
					}
					$scope.info.custList = form.getCheckboxValueArray($('#edit_box [mapping="checkboxCustGroup"] :checkBox'), true);
					/*if(!$scope.info.custList){
						tipbar.errorLeftTipbar($target,'请选择机构名称！',3000,9999);
						return;
					}*/
					$scope.info.fileList = $scope.BrokerIdHeadFile.id +',' + $scope.BrokerIdNationFile.id;
					http.post(BTPATH.EDIT_ONE_OPERATOR, $scope.info)
						.success(function (data) {
							if (common.isCurrentResponse(data)) {
								tipbar.infoTopTipbar('修改操作员成功!', {});
								$scope.closeRollModal("edit_box");
								$scope.queryList(true);
							} else {
								tipbar.errorTopTipbar($target, '修改操作员失败:' + data.message, 3000, 6662);
							}
						});
				};

				//查询附件列表
				$scope.queryAttachmentList = function () {
					//批次号
					var batchNo = $scope.info.batchNo;
					if (batchNo) {
						http.post(BTPATH.QUERY_ATTACHMENT_LIST, { batchNo: batchNo }).success(function (data) {
							if (common.isCurrentData(data)) {
								$scope.$apply(function () {
									$scope.BrokerIdHeadFile = data.data[0];
									$scope.BrokerIdNationFile = data.data[1];
								});
							}
						});
					}
				};


				//页面初始化
				$scope.initPage = function () {
					commonService.queryBaseInfoList(BTPATH.QUERY_OPENED_ROLE, {}, $scope, 'typeList', 'TypeListDic', {
						name: 'roleName',
						value: 'id',
						isChange: true
					});

					commonService.queryBaseInfoList(BTPATH.QUERY_OPENED_CUST, {}, $scope, 'custList', 'CustListDic');

					$scope.queryList(true);

				};

				/*
				 *模板显隐控制区域
				*/
				//打开操作员管理录入
				$scope.addInfoBox = function () {
					//================== 参照区域 3 start =========================//
					validate.validate($('#add_box'), addValidOption);
					//================== 参照区域 3 end =========================//
					$scope.roleList = ArrayPlus($scope.roleList).addKey4ArrayObj('checked', false);
					$scope.custList = ArrayPlus($scope.custList).addKey4ArrayObj('checked', false);
					$scope.roleList = common.splitArray($scope.typeList, 4);
					$scope.custInfoList = common.splitArray($scope.custList, 3);

					$scope.info = {
						contIdentType: $scope.identType[0].value,
						contCertValidDate: new Date().getSubDate('YYYY', -30).format('YYYY-MM-DD'),
						modiType: 'add',
						clerkMan: 0
					};
					$scope.openRollModal('add_box');
				};

				//打开操作员管理编辑
				$scope.editInfoBox = function (data, target) {
					//================== 参照区域 2 start =========================//
					validate.validate($('#edit_box'), editValidOption);
					//================== 参照区域 2 end =========================//
					var $target = $(target);
					$scope.info = $.extend(data, { modiType: 'edit' });

					$scope.queryAttachmentList();

					$scope.roleList = ArrayPlus($scope.roleList).addKey4ArrayObj('checked', false);
					$scope.custList = ArrayPlus($scope.custList).addKey4ArrayObj('checked', false);

					var roleList = ArrayPlus($scope.typeList).linkAnotherArray(($scope.info.ruleList + '').split(','), 'value', 'checked', true);
					$scope.roleList = common.splitArray(roleList, 4);
					var relationCustList = ArrayPlus($scope.custList).linkAnotherArray(($scope.info.custList + '').split(','), 'value', 'checked', true);
					$scope.custInfoList = common.splitArray(relationCustList, 3);
					$scope.openRollModal('edit_box');
					// 密码置空
					$scope.pwdInfo.password = '';
					$scope.pwdInfo.okPasswd = '';

				};

				//重置密码
				$scope.modiPwd = function (event) {
					var $target = $(event),
						validResult = validate.validate($('#modi_pwd_form'));
					if (validResult) {
						$.post(BTPATH.UPDATE_OPERATE_PASSWORD, $.extend({ id: $scope.info.id }, $scope.pwdInfo), function (data) {
							if (data.code === 200) {
								tipbar.errorTopTipbar($target, '密码重置成功!', 1500, 9999, function () {
									$('#modi_pwd_box').modal('hide');
								});
							} else {
								tipbar.errorTopTipbar($target, '重置失败,原因:' + data.message, 3000, 9999);
							}
						}, 'json');
					} else {
						tipbar.errorTopTipbar($target, '您还有选项未正确填写，请检查!', 3000, 9999);
					}
				};

				//关闭密码框
				$scope.closePwdBox = function (target) {
					common.cleanPageTip();
					$('#modi_pwd_box').modal('hide');
				};

				//==============================公共操作区 end ==================================



				/*=============================== 参照区域 1  表单验证区域  start====================================*/

				validate.validate($('#modi_pwd_form'), {
					elements: [{
						name: 'pwdInfo.password',
						rules: [{
							name: 'required',
							message: '请填写新密码!'
						}],
						events: ['blur']
					}, {
						name: 'pwdInfo.okPasswd',
						rules: [{
							name: 'required',
							message: '请填写确认密码!'
						}, {
							name: 'repwd',
							params: {
								target: $('#modi_pwd_form [ng-model="pwdInfo.password"]')
							},
							message: '您输入的确认密码与新密码不一致，请检查！'
						}],
						events: ['blur']
					}],
					errorPlacement: function (error, element) {
						tipbar.errorTipbar(element, error, 0, 9600);
					}
				});


				//校验配置
				var addValidOption = {
					elements: [{
						name: 'info.name',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.contIdentType',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.contIdentNo',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.contCertValidDate',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.zipCode',
						rules: [{ name: 'required' }, { name: 'zipcode' }],
						events: ['blur']
					}, {
						name: 'info.address',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.phone',
						rules: [{ name: 'required' }, { name: 'phone' }],
						events: ['blur']
					}, {
						name: 'info.faxNo',
						rules: [{ name: 'required' }, { name: 'fax' }],
						events: ['blur']
					}, {
						name: 'info.mobileNo',
						rules: [{ name: 'required' }, { name: 'mobile' }],
						events: ['blur']
					}, {
						name: 'info.operCode',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.password',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.repassword',
						rules: [{
							name: 'repin',
							params: { target: '#add_box [ng-model="info.password"]' },
							message: '请保持确认密码和用户密码一致!'
						}],
						events: ['blur']
					}],
					errorPlacement: function (error, element) {
						var label = element.parents('td').prev().text().substr(0);
						tipbar.errorLeftTipbar(element, label + error, 0, 99999);
					}
				};

				var editValidOption = {
					elements: [{
						name: 'info.name',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.contIdentType',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.contIdentNo',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.contCertValidDate',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.zipCode',
						rules: [{ name: 'required' }, { name: 'zipcode' }],
						events: ['blur']
					}, {
						name: 'info.address',
						rules: [{ name: 'required' }],
						events: ['blur']
					}, {
						name: 'info.phone',
						rules: [{ name: 'required' }, { name: 'phone' }],
						events: ['blur']
					}, {
						name: 'info.faxNo',
						rules: [{ name: 'required' }, { name: 'fax' }],
						events: ['blur']
					}, {
						name: 'info.mobileNo',
						rules: [{ name: 'required' }, { name: 'mobile' }],
						events: ['blur']
					}, {
						name: 'info.operCode',
						rules: [{ name: 'required' }],
						events: ['blur']
					}],
					errorPlacement: function (error, element) {
						var label = element.parents('td').prev().text().substr(0);
						tipbar.errorLeftTipbar(element, label + error, 0, 99999);
					}
				};


				/*===============================表单验证区域  end====================================*/


				/*数据初始区域*/
				$scope.initPage();

			}]);



			//手动装载angular模块
			angular.bootstrap($('#container'), ['mainApp']);
		});
	});
});
