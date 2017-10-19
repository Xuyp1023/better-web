/*
整体项目的路由导航
@author binhg
*/

define(function(require,exports,module){
	exports.installRoute = function(mainApp){
		var moduleList = arguments;
		mainApp.config(['$httpProvider','$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function($httpProvider,$routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

			/*	扩展区域	*/
			$.extend(mainApp, {
					controller: $controllerProvider.register,
					directive: $compileProvider.directive,
					filter: $filterProvider.register,
					factory: $provide.factory,
					service: $provide.service
			});
			mainApp.asyncjs = function(js) {
					return ["$q", "$route", "$rootScope", function($q, $route, $rootScope) {
							var deferred = $q.defer();
							var dependencies = angular.copy(js);
							require.async(dependencies, function() {
									var ctrl = arguments[0];
									//装载独立加载的组件
									if(!moduleList.push) moduleList.push = Array.prototype.push;
									for (var i = 0; i < arguments.length; i++) {
										if(i>0){
											moduleList.push(arguments[i]);
										}
									}
									ctrl.installController.apply(window,moduleList);
									if(!$rootScope.$$phase){
										$rootScope.$apply(function() {
											deferred.resolve();
										});
									}else{
										deferred.resolve();
									}

							});
							return deferred.promise;
					}];
			};

			$httpProvider.defaults.transformRequest = function(obj){  
			     var str = [];  
			     for(var p in obj){  
			       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
			     }  
			     return str.join("&");  
		   }  
		  
		   $httpProvider.defaults.headers.post = {  
		        'Content-Type': 'application/x-www-form-urlencoded'  
		   }

			/*	route配置区域	*/
			$routeProvider
			.when('/temp',{
				templateUrl: 'template/temp/temp.html',
				controller: 'tempController',
				title:'企e金服供应链金融'
			})
			/*核心企业端*/
			.when('/prePay_2/set.customer',{
                templateUrl: 'template/prePay_2/eterrace/customer.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/customer')
                },
                controller: 'set.customer',
                title:'客户关系列表'
			})
			/*提前支付1*/
			.when('/prePay_1/finance.apply',{
                templateUrl: 'template/prePay_1/purchaser/finance.apply.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/finance/finance.apply')
                },
                controller: 'finance.apply',
                title:'银行保理融资申请'
			})
			.when('/prePay_1/submit.apply',{
                templateUrl: 'template/prePay_1/purchaser/submit.apply.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/finance/submit.apply')
                },
                controller: 'submit.apply',
                title:'提交申请'
			})
			.when('/prePay_1/set.yeild',{
                templateUrl: 'template/prePay_1/purchaser/yeildSet.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/set/yeildSet')
                },
                controller: 'set.yeild',
                title:'收益设置'
			})
			.when('/prePay_1/pay.account',{
                templateUrl: 'template/prePay_1/purchaser/accountPay.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/pay/accountPay')
                },
                controller: 'pay.account',
                title:'应付账款批量导入'
            })
            .when('/prePay_1/bill.audit',{
                templateUrl: 'template/prePay_1/purchaser/bill.audit.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/bill/bill.audit')
                },
                controller: 'bill.audit',
                title:'应付账款审核'
            })
            .when('/prePay_1/prepay.detail',{
                templateUrl: 'template/prePay_1/purchaser/prepay.detail.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/prepay.detail')
                },
                controller: 'prepay.detail',
                title:'提前付款明细'
            })
            //付款指令管理 
            .when('/prePay_1/pay.order',{
                templateUrl: 'template/prePay_1/purchaser/pay.order.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/pay.order')
                },
                controller: 'pay.order',
                title:'付款指令管理'
            })
            .when('/prePay_1/order.detail',{
                templateUrl: 'template/prePay_1/purchaser/order.detail.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/order.detail')
                },
                controller: 'order.detail',
                title:'付款指令详情'
            })
            .when('/prePay_1/pay.result',{
                templateUrl: 'template/prePay_1/purchaser/pay.result.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/pay.result')
                },
                controller: 'pay.result',
                title:'付款指令结果'
            })
            .when('/prePay_1/upload.result',{
                templateUrl: 'template/prePay_1/purchaser/upload.result.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/upload.result')
                },
                controller: 'upload.result',
                title:'付款结果上传'
            })

            .when('/prePay_1/contract.manger',{
                templateUrl: 'template/prePay_1/purchaser/contract.manger.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/contract.manger')
                },
                controller: 'contract.manger',
                title:'电子合同管理'
            })
            .when('/prePay_1/account.details',{
                templateUrl: 'template/prePay_1/purchaser/account.details.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/account/account.details')
                },
                controller: 'account.details',
                title:'应付账款提前确认'
            })
            .when('/prePay_1/pay.manger',{
                templateUrl: 'template/prePay_1/purchaser/prepay.detail.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/prepay.detail')
                },
                controller: 'prepay.detail',
                title:'提前付款明细'
            })
            .when('/prePay_1/contract.manger1',{
                templateUrl: 'template/prePay_1/purchaser/contract.manger1.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/purchaser/manger/contract.manger1')
                },
                controller: 'contract.manger1',
                title:'电子合同管理'
            })
            
			/*合同模板管理*/
			.when('/prePay_1/contract.manage',{
                templateUrl: 'template/prePay_1/platform/contract.manage.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/platform/contract.manage')
                },
                controller: 'contract.manage',
                title:'合同模板管理'
            })
			/* 供应链金融 企e平台*/
			.when('/prePay_1/set.terracese',{
                templateUrl: 'template/prePay_1/eterrace/terracese.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/terracese')
                },
                controller: 'set.terracese',
                title:'收益设置'
			})
			.when('/prePay_1/set.apment',{
                templateUrl: 'template/prePay_1/eterrace/apment.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/apment')
                },
                controller: 'set.apment',
                title:'可提前付款应收账款'
			})
             .when('/prePay_1/set.arapment',{
                templateUrl: 'template/prePay_1/eterrace/arapment.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/arapment')
                },
                controller: 'set.arapment',
                title:'应收账款提前付款申请'
			})
             .when('/prePay_1/set.adpaydetails',{
                templateUrl: 'template/prePay_1/eterrace/adpaydetails.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/adpaydetails')
                },
                controller: 'set.adpaydetails',
                title:'提前付款明细'
			})
             .when('/prePay_1/set.ecmanage',{
                templateUrl: 'template/prePay_1/eterrace/ecmanage.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/ecmanage')
                },
                controller: 'set.ecmanage',
                title:'电子合同管理'
			})
             .when('/prePay_1/set.conbankfafin',{
                templateUrl: 'template/prePay_1/eterrace/conbankfafin.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_1/eterrace/set/conbankfafin')
                },
                controller: 'set.conbankfafin',
                title:'银行保理融资确权'
			})

			/*提前支付2*/			
			.when('/prePay_2/set.yeild',{
                templateUrl: 'template/prePay_2/purchaser/yeildSet.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/set/yeildSet')
                },
                controller: 'set.yeild2',
                title:'收益设置(结算中心)'
			})
            .when('/prePay_2/pay1.account',{
                templateUrl: 'template/prePay_2/purchaser/accountPay1.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/pay/accountPay1')
                },
                controller: 'pay.account1',
                title:'应付账款提前确认(结算中心)'
            })
            .when('/prePay_2/prepay1.detail',{
                templateUrl: 'template/prePay_2/purchaser/prepay.detail1.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/manger/prepay.detail1')
                },
                controller: 'prepay.detail1',
                title:'提前付款明细(结算中心)'
            })
            .when('/prePay_2/contract1.manger',{
                templateUrl: 'template/prePay_2/purchaser/contract.manger1.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/manger/contract.manger1')
                },
                controller: 'contract.manger1',
                title:'电子合同管理(结算中心)'
            })
			.when('/prePay_2/pay.account',{
                templateUrl: 'template/prePay_2/purchaser/accountPay.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/pay/accountPay')
                },
                controller: 'pay.account2',
                title:'应付账款提前确认(采购方)'
            })
            .when('/prePay_2/prepay.detail',{
                templateUrl: 'template/prePay_2/purchaser/prepay.detail.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/manger/prepay.detail')
                },
                controller: 'prepay.detail2',
                title:'提前付款明细(采购方)'
            })
            .when('/prePay_2/contract.manger',{
                templateUrl: 'template/prePay_2/purchaser/contract.manger.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/manger/contract.manger')
                },
                controller: 'contract.manger2',
                title:'电子合同管理(采购方)'
            })
            .when('/prePay_2/bill.audit',{
                templateUrl: 'template/prePay_2/purchaser/bill.audit.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/bill/bill.audit')
                },
                controller: 'bill.audit2',
                title:'应付账款审核(采购方)'
            })
            
            .when('/prePay_2/account.details',{
                templateUrl: 'template/prePay_2/purchaser/account.details.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/purchaser/account/account.details')
                },
                controller: 'account.details2',
                title:'应付账款批量导入(采购方)'
            })
			/*合同模板管理*/
			.when('/prePay_2/contract.manage',{
                templateUrl: 'template/prePay_2/platform/contract.manage.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/platform/contract.manage')
                },
                controller: 'contract.manage',
                title:'合同模板管理'
            })
			/* 供应链金融 企e平台*/
			.when('/prePay_2/set.terracese',{
                templateUrl: 'template/prePay_2/eterrace/terracese.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/eterrace/set/terracese')
                },
                controller: 'set.terracesetw',
                title:'收益设置'
			})
			.when('/prePay_2/set.apment',{
                templateUrl: 'template/prePay_2/eterrace/apment.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/eterrace/set/apment')
                },
                controller: 'set.apmenttw',
                title:'可提前付款应收账款'
			})
             .when('/prePay_2/set.arapmenttw',{
                templateUrl: 'template/prePay_2/eterrace/arapment.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/eterrace/set/arapment')
                },
                controller: 'set.arapmenttw',
                title:'应收账款提前付款申请'
			})
             .when('/prePay_2/set.adpaydetails',{
                templateUrl: 'template/prePay_2/eterrace/adpaydetails.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/eterrace/set/adpaydetails')
                },
                controller: 'set.adpaydetailstw',
                title:'提前付款明细'
			})
             .when('/prePay_2/set.ecmanage',{
                templateUrl: 'template/prePay_2/eterrace/ecmanage.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/eterrace/set/ecmanage')
                },
                controller: 'set.ecmanagetw',
                title:'电子合同管理'
			})
             .when('/prePay_2/set.conbankfafin',{
                templateUrl: 'template/prePay_2/eterrace/conbankfafin.html',
                resolve: {
                    load: mainApp.asyncjs('./prePay_2/eterrace/set/conbankfafin')
                },
                controller: 'set.conbankfafintw',
                title:'银行保理融资确权'
			})
            
            /*2_3.1*/
            .when('/2_3.1/start.process',{
                templateUrl: 'template/2_3.1/startProcess.html',
                resolve: {
                    load: mainApp.asyncjs('./2_3.1/start/start.process')
                },
                controller: 'start.process',
                title:'融资进程'
            })
            .when('/2_3.1/start.apply',{
                templateUrl: 'template/2_3.1/startApply.html',
                resolve: {
                    load: mainApp.asyncjs('./2_3.1/start/start.apply')
                },
                controller: 'start.apply',
                title:'融资申请'
            })
            .when('/2_3.1/financeDetailNew',{
                templateUrl: 'template/flow/supplierFinance/financeDetailNew.html',  
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/financeDetailNew')
                },
                controller: 'financeDetailNew',
                title:'融资申请详情'
            })
           
			/*青海移动*/
			.when('/1qh-mobile/paymentcode',{
				templateUrl: 'template/1qh-mobile/paymentcode/paymentcode.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/paymentcode/paycode')
        		},
				controller: 'payment.code',
				title:'企业直通车付款码'
			})
			.when('/1qh-mobile/lead.lead',{
				templateUrl: 'template/1qh-mobile/commission/lead.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.lead')
        		},
				controller: 'lead.lead',
				title:'佣金导入'
			})
			.when('/1qh-mobile/lead.check',{
				templateUrl: 'template/1qh-mobile/commission/check.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.check')
        		},
				controller: 'lead.check',
				title:'佣金审核'
			})
			.when('/1qh-mobile/lead.query',{
				templateUrl: 'template/1qh-mobile/commission/query.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.query')
        		},
				controller: 'lead.query',
				title:'佣金查询'
			})
			.when('/1qh-mobile/lead.ensure',{
				templateUrl: 'template/1qh-mobile/commission/ensure.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.ensure')
        		},
				controller: 'lead.ensure',
				title:'账单确认'
			})
			.when('/1qh-mobile/lead.download',{
				templateUrl: 'template/1qh-mobile/commission/download.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.download')
        		},
				controller: 'lead.download',
				title:'账单下载'
			})
			.when('/1qh-mobile/lead.export',{
				templateUrl: 'template/1qh-mobile/commission/export.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.export')
        		},
				controller: 'lead.export',
				title:'佣金数据导出'
			})
            .when('/1qh-mobile/lead.recheck',{
                templateUrl: 'template/1qh-mobile/commission/addRecheck.html',
                resolve: {
                    load: mainApp.asyncjs('./1qh-mobile/commission/lead/lead.recheck')
                },
                controller: 'lead.recheck',
                title:'佣金数据审核'
            })
			.when('/1qh-mobile/check.dayManager',{
				templateUrl: 'template/1qh-mobile/check/dayManager/query.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/dayManager/query')
        		},
				controller: 'check.dayManager',
				title:'日对账单管理'
			})
			.when('/1qh-mobile/check.dayManagerAudit',{
				templateUrl: 'template/1qh-mobile/check/dayManager/queryAudit.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/dayManager/query')
        		},
				controller: 'check.dayManager',
				title:'日对账单审核'
			})
			.when('/1qh-mobile/check.dayAdd',{
				templateUrl: 'template/1qh-mobile/check/dayManager/add.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/dayManager/add')
        		},
				controller: 'check.dayAdd',
				title:'日对账单新增'
			})
			.when('/1qh-mobile/check.monthManager',{
				templateUrl: 'template/1qh-mobile/check/monthManager/query.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/monthManager/query')
        		},
				controller: 'check.monthManager',
				title:'月对账单管理'
			})
			.when('/1qh-mobile/check.monthManagerAudit',{
				templateUrl: 'template/1qh-mobile/check/monthManager/queryAudit.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/monthManager/query')
        		},
				controller: 'check.monthManager',
				title:'月对账单审核'
			})
			.when('/1qh-mobile/check.monthAdd',{
				templateUrl: 'template/1qh-mobile/check/monthManager/add.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/monthManager/add')
        		},
				controller: 'check.monthAdd',
				title:'月对账单新增'
			})
			.when('/1qh-mobile/check.mail',{
				templateUrl: 'template/1qh-mobile/check/mail/query.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/mail/query')
        		},
				controller: 'check.mail',
				title:'对账单投递'
			})
			.when('/1qh-mobile/check.mailSelect',{
				templateUrl: 'template/1qh-mobile/check/mail/select.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/mail/select')
        		},
				controller: 'check.mailSelect',
				title:'选择账单'
			})
			.when('/1qh-mobile/check.setting',{
				templateUrl: 'template/1qh-mobile/check/setting/set.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/setting/set')
        		},
				controller: 'check.setting',
				title:'参数设置'
			})
			.when('/1qh-mobile/maintenancebill',{
				templateUrl: 'template/1qh-mobile/bill/maintenancebill.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/make.js')
        		},
				controller: 'check.maintenancebill',
				title:'开票信息维护'
			})
			.when('/1qh-mobile/Invoiceapply',{
				templateUrl: 'template/1qh-mobile/bill/Invoiceapply.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/apply')
        		},
				controller: 'check.invoiceapply',
				title:'佣金发票开具'
			})
			.when('/1qh-mobile/outbill/:id',{
				templateUrl: 'template/1qh-mobile/bill/outbill.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/outbill')
        		},
				controller: 'check.outbill',
				title:'发票开票申请作废'
			})
			.when('/1qh-mobile/applya',{
				templateUrl: 'template/1qh-mobile/bill/applya.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/app')
        		},
				controller: 'check.invoiceapp',
				title:'可开票月账单列表'
			})
			.when('/1qh-mobile/Askbill',{
				templateUrl: 'template/1qh-mobile/bill/appinvo.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Askbill')
        		},
				controller: 'check.Askbill',
				title:'索要发票'
			})
			.when('/1qh-mobile/Invoiceaffirm',{
				templateUrl: 'template/1qh-mobile/bill/Invoiceaffirm.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Invoiceaffirm')
        		},
				controller: 'check.Invoiceaffirm',
				title:'佣金发票确认'
			})
			.when('/1qh-mobile/Invoicedetails/:id/:invoiceId',{
				templateUrl: 'template/1qh-mobile/bill/Invoicedetails.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Invoicedetails')
        		},
				controller: 'check.Invoicedetails',
				title:'佣金发票详情'
			})
			.when('/1qh-mobile/Commissionsion',{
				templateUrl: 'template/1qh-mobile/bill/Commissionsion.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Commissionsion')
        		},
				controller: 'check.Commissionsion',
				title:'佣金成本维护'
			})
			.when('/1qh-mobile/Invoicelooked',{
				templateUrl: 'template/1qh-mobile/bill/Invoicelooked.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Invoicelooked')
        		},
				controller: 'check.Invoicelooked',
				title:'发票抬头维护'
			})
			.when('/1qh-mobile/Invoicearm/:id',{
				templateUrl: 'template/1qh-mobile/bill/Invoicearm.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Invoicearm')
        		},
				controller: 'check.Invoicearm',
				title:'发票维护'
			})
			.when('/1qh-mobile/Invoicecorrect/:id',{
				templateUrl: 'template/1qh-mobile/bill/Invoicecorrect.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/bill/make/Invoicecorrect')
        		},
				controller: 'check.Invoicecorrect',
				title:'开票确认'
			})
			.when('/1qh-mobile/check.maintenance',{
				templateUrl: 'template/1qh-mobile/check/maintenance/query.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/maintenance/query')
        		},
				controller: 'check.maintenance',
				title:'付款结果维护'
			})
			.when('/1qh-mobile/check.mainState',{
				templateUrl: 'template/1qh-mobile/check/maintenance/state.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/maintenance/state')
        		},
				controller: 'check.mainState',
				title:'选择记录'
			})
			.when('/1qh-mobile/check.mainStateDetail/:payResultId',{
				templateUrl: 'template/1qh-mobile/check/maintenance/confirm.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/maintenance/stateDetail')
        		},
				controller: 'check.mainStateDetail',
				title:'状态维护'    
			})
			.when('/1qh-mobile/check.recheck',{
				templateUrl: 'template/1qh-mobile/check/recheck/query.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/recheck/query')
        		},
				controller: 'check.recheck',
				title:'付款结果复核'
			})
			.when('/1qh-mobile/check.recheckDetail/:payId',{
				templateUrl: 'template/1qh-mobile/check/recheck/detail.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/recheck/detail')
        		},
				controller: 'check.recheckDetail',
				title:'付款详情'
			})
			.when('/1qh-mobile/check.certificat',{
				templateUrl: 'template/1qh-mobile/check/certificat/check.certificat.html',
				resolve: {
          			load: mainApp.asyncjs('./1qh-mobile/check/certificat/certificat')
        		},
				controller: 'check.certificat',
				title:'验签证书管理'
			})
			/*scf2.3*/
			.when('/contract_2_3/standardQuery',{
				templateUrl: 'template/2_3/contract/standard/query.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/standard/query')
        		},
				controller: 'contract_2_3.standardQuery',
				title:'标准合同类型查询'
			})
			.when('/contract_2_3/standardAdd/:custNo',{
				templateUrl: 'template/2_3/contract/standard/add.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/standard/add')
        		},
				controller: 'contract_2_3.standardAdd',
				title:'标准合同类型新增'
			})
			.when('/contract_2_3/standardTextQuery',{
				templateUrl: 'template/2_3/contract/standard/textQuery.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/standard/textQuery')
        		},
				controller: 'contract_2_3.standardTextQuery',
				title:'标准合同文本查询'
			})
			.when('/contract_2_3/standardTextAudit',{
				templateUrl: 'template/2_3/contract/standard/textAudit.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/standard/textAudit')
        		},
				controller: 'contract_2_3.standardTextAudit',
				title:'标准合同文本审核'
			})
			.when('/contract_2_3/esealBoardUpload',{
				templateUrl: 'template/2_3/contract/eseal/boardUpload.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/boardUpload')
        		},
				controller: 'contract_2_3.esealBoardUpload',
				title:'电子合同模板上传'
			})
			.when('/contract_2_3/esealBoardAudit',{
				templateUrl: 'template/2_3/contract/eseal/boardAudit.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/boardAudit')
        		},
				controller: 'contract_2_3.esealBoardAudit',
				title:'标准合同文本审核'
			})
			.when('/contract_2_3/esealQuery',{
				templateUrl: 'template/2_3/contract/eseal/query.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/query')
        		},
				controller: 'contract_2_3.esealQuery',
				title:'电子印章管理'
			})
			.when('/contract_2_3/esealCustomQuery',{
				templateUrl: 'template/2_3/contract/eseal/customQuery.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/customQuery')
        		},
				controller: 'contract_2_3.esealCustomQuery',
				title:'客户电子印章制作'
			})
			.when('/contract_2_3/esealMake',{
				templateUrl: 'template/2_3/contract/eseal/make.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/make')
        		},
				controller: 'contract_2_3.esealMake',
				title:'客户电子印章制作详情'
			})
			.when('/contract_2_3/esealServiceQuery',{
				templateUrl: 'template/2_3/contract/eseal/serviceQuery.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/serviceQuery')
        		},
				controller: 'contract_2_3.esealServiceQuery',
				title:'电子合同服务'
			})
			.when('/contract_2_3/esealRegister',{
				templateUrl: 'template/2_3/contract/eseal/register.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/eseal/register')
        		},
				controller: 'contract_2_3.esealRegister',
				title:'电子合同服务注册'
			})
			.when('/contract_2_3/relationQuery',{
				templateUrl: 'template/2_3/contract/relation/query.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/contract/relation/query')
        		},
				controller: 'contract_2_3.relationQuery',
				title:'业务关联标准合同'
			})			
			.when('/assetmanage/invoiceregister',{
				templateUrl: 'template/2_3/assetmanage/invoiceregister.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/upregister')
        		},
				controller: 'assetmanage.invoiceregister',
				title:'开票登记'
			})
			.when('/assetmanage/approval',{
				templateUrl: 'template/2_3/assetmanage/approval.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/upapproval')
        		},
				controller: 'assetmanage.approval',
				title:'开票审核'
			})
			.when('/assetmanage/recycle',{
				templateUrl: 'template/2_3/assetmanage/recycle.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/uprecycle')
        		},
				controller: 'assetmanage.recycle',
				title:'票据回收'
			})
			.when('/assetmanage/NotesPool',{
				templateUrl: 'template/2_3/assetmanage/NotesPool.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/NotesPool')
        		},
				controller: 'assetmanage.NotesPool',
				title:'票据池-核心企业'
			})
			.when('/assetmanage/NotesPool.provide',{
				templateUrl: 'template/2_3/assetmanage/NotesPool.provide.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/NotesPool.provide')
        		},
				controller: 'assetmanage.NotesPoolprovide',
				title:'票据池-供应商'
			}) 
			.when('/assetmanage/account.details',{
				templateUrl: 'template/2_3/assetmanage/account.details.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/account.details')
        		},
				controller: 'assetmanage.account.details',
				title:'应付账款登记'
			})

			.when('/assetmanage/bill.audit',{
				templateUrl: 'template/2_3/assetmanage/bill.audit.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/bill.audit')
        		},
				controller: 'assetmanage.bill.audit',
				title:'应付账款审核'
			})
			.when('/assetmanage/manage.bill',{
				templateUrl: 'template/2_3/assetmanage/manage.bill.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/manage.bill')
        		},
				controller: 'assetmanage.manage.bill',
				title:'应付账款管理'
			})
			.when('/assetmanage/make.collections',{
				templateUrl: 'template/2_3/assetmanage/make.collections.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/make.collections')
        		},
				controller: 'assetmanage.make.collections',
				title:'应收账款管理'
			})
			.when('/assetmanage/Commercialinvoiceregister',{
				templateUrl: 'template/2_3/assetmanage/commercial.invoiceregister.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/commercial.invoiceregister')
        		},
				controller: 'assetmanage.commercial.invoiceregister',
				title:'商业发票登记'
			})
			.when('/assetmanage/Commercialinvoiceaudit',{
				templateUrl: 'template/2_3/assetmanage/Commercial.invoice.audit.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Commercial.invoiceaudit')
        		},
				controller: 'assetmanage.Commercial.invoiceaudit',
				title:'商业发票审核'
			})
			.when('/assetmanage/Invoice.recycle',{
				templateUrl: 'template/2_3/assetmanage/Invoice.recycle.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Invoice.recycle')
        		},
				controller: 'assetmanage.Invoice.recycle',
				title:'商业发票回收'
			})
			.when('/assetmanage/Invoice.Management',{
				templateUrl: 'template/2_3/assetmanage/Invoice.Management.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Invoice.Management')
        		},
				controller: 'assetmanage.Invoice.Management',
				title:'商业发票管理'
			})
			.when('/assetmanage/Order.Entry',{
				templateUrl: 'template/2_3/assetmanage/Order.Entry.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Order.Entry')
        		},
				controller: 'assetmanage.Order.Entry',
				title:'订单录入'
			})
			.when('/assetmanage/Order.review',{
				templateUrl: 'template/2_3/assetmanage/Order.review.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Order.review')
        		},
				controller: 'assetmanage.Order.review',
				title:'订单审核'
			})
			.when('/assetmanage/Order.manage',{
				templateUrl: 'template/2_3/assetmanage/Order.manage.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Order.manage')
        		},
				controller: 'assetmanage.Order.manage',
				title:'订单管理'
			})
			.when('/assetmanage/Purchase.orders',{
				templateUrl: 'template/2_3/assetmanage/Purchase.orders.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/assetmanage/Purchase.orders')
        		},
				controller: 'assetmanage.Purchase.orders',
				title:'订单采购'
			})

			.when('/factoring/add.customization',{
				templateUrl: 'template/2_3/factoring/customization.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/add/add.customization')
        		},
				controller: 'add.customization',
				title:'保理产品'
			})	
			.when('/factoring/add.basicInfoAll',{
				templateUrl: 'template/2_3/factoring/basicInfoAll.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/add/add.basicInfoAll')
        		},
				controller: 'add.basicInfoAll',
				title:'保理产品定制'
			})
			.when('/factoring/add.editInfoAll',{
				templateUrl: 'template/2_3/factoring/editInfoAll.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/add/add.editInfoAll')
        		},
				controller: 'add.editInfoAll',
				title:'保理产品编辑'
			})
			.when('/factoring/maintenance.businese',{
				templateUrl: 'template/2_3/factoring/busiMaintenance.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/maintenance/maintenance.businese')
        		},
				controller: 'maintenance.businese',
				title:'业务类型维护'
			})
			.when('/factoring/maintenance.asset',{
				templateUrl: 'template/2_3/factoring/assetMaintenance.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/maintenance/maintenance.asset')
        		},
				controller: 'maintenance.asset',
				title:'资产类型维护'
			})
			.when('/factoring/state.publish',{
				templateUrl: 'template/2_3/factoring/publish.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/state/state.publish')
        		},
				controller: 'state.publish',
				title:'保理产品发布'
			})
			.when('/factoring/state.soldOut',{
				templateUrl: 'template/2_3/factoring/soldOut.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/state/state.soldOut')
        		},
				controller: 'state.soldOut',
				title:'保理产品下架'
			})
			.when('/factoring/detail.factoring',{
				templateUrl: 'template/2_3/factoring/facDetail.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/detail/detail.factoring')
        		},
				controller: 'detail.factoring',
				title:'保理产品查询(保理机构)'
			})
			.when('/factoring/datail.supply',{
				templateUrl: 'template/2_3/factoring/supplyDetail.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/detail/datail.supply')
        		},
				controller: 'datail.supply',
				title:'保理产品查询(供应商)'
			})
			.when('/factoring/detail.core',{
				templateUrl: 'template/2_3/factoring/coreDetail.html',
				resolve: {
          			load: mainApp.asyncjs('./2_3/factoring/detail/detail.core')
        		},
				controller: 'detail.core',
				title:'保理产品查询(核心企业)'
			})

			/*开户相关*/
			.when('/account/active',{
				templateUrl: 'template/account/openAccountActive.html',
				controller: 'account.ActiveController',
				title:'激活账户'
			})
			.when('/account/success',{
				templateUrl: 'template/account/openAccountSuccess.html',
				controller: 'account.SuccessController',
				title:'开户成功'
			})
			.when('/account/ownOpen',{
				templateUrl: 'template/account/openAccountOwn.html',
				controller: 'own.OpenController',
				title:'自主开户'
			})
			.when('/account/platAudit',{
				templateUrl: 'template/account/openAccountAudit.html',
				controller: 'plat.AuditController',
				title:'开户审核'
			})
			.when('/account/platRecord',{
				templateUrl: 'template/account/accountPlatRecord.html',
				controller: 'plat.RecordController',
				title:'开户待录'
			})
			.when('/account/platReview',{
				templateUrl: 'template/account/accountPlatReview.html',
				controller: 'plat.ReviewController',
				title:'开户复核'
			})
			.when('/account/replace',{
				templateUrl: 'template/account/accountReplace.html',
				controller: 'account.replaceController',
				title:'平台代替开户'
			})
			.when('/account/accountWay',{
				templateUrl: 'template/account/accountWay.html',
				controller: 'account.wayController',
				title:'选择开户途径'
			}).when('/account/accountAuditing',{
				templateUrl: 'template/account/accountAuditing.html',
				controller: 'account.auditingController',
				title:'审批中'
			})


            //核心开户相关

            .when('/coreAccount/coreOwnOpen',{
				templateUrl: 'template/coreAccount/coreOpenAccountOwn.html',
				controller: 'coreOwn.OpenController',
				title:'核心自主开户'
			})
			.when('/coreAccount/coreActive',{
				templateUrl: 'template/coreAccount/coreOpenAccountActive.html',
				controller: 'coreAccount.ActiveController',
				title:'核心激活账户'
			})
			.when('/coreAccount/coreAccountAuditing',{
				templateUrl: 'template/coreAccount/coreAccountAuditing.html',
				controller: 'coreAccount.auditingController',
				title:'核心审批中'
			}).when('/coreAccount/coreSuccess',{
				templateUrl: 'template/coreAccount/coreOpenAccountSuccess.html',
				controller: 'coreAccount.SuccessController',
				title:'核心开户成功'
			})


			//流程定义相关
			.when('/process/list',{
				templateUrl: 'template/flowDefine/processList.html',
				resolve: {
                    load: mainApp.asyncjs('./flowDefine/process.listController')
                },
				controller: 'process.listController',
				title:'流程列表'
			})

			//单个流程 所有版本
			.when('/process/versionList/:custNo/:name',{
				templateUrl: 'template/flowDefine/processVersionList.html',
				resolve: {
                    load: mainApp.asyncjs('./flowDefine/process.versionListController')
                },
				controller: 'process.versionListController',
				title:'版本列表'
			})

			.when('/process/create',{
				templateUrl: 'template/flowDefine/processCreate.html',
				resolve: {
                    load: mainApp.asyncjs('./flowDefine/process.createController')
                },
				controller: 'process.createController',
				title:'创建流程'
			})

			.when('/process/edit',{
				templateUrl: 'template/flowDefine/processEdit.html',
				controller: 'process.editController',
				title:'修改流程'
			})

			.when('/process/nodeDefine',{
				templateUrl: 'template/flowDefine/processNodeDefine.html',
				controller: 'node.defineController',
				title:'自定义节点'
			})

			.when('/process/stepList',{
				templateUrl: 'template/flowDefine/processStepList.html',
				controller: 'step.listController',
				title:'步骤列表'
			})

			.when('/process/stepDefine',{
				templateUrl: 'template/flowDefine/processStepDefine.html',
				controller: 'step.defineController',
				title:'自定义步骤'
			})

			.when('/process/loanDefine',{
				templateUrl: 'template/flowDefine/processLoanDefine.html',
				controller: 'loan.defineController',
				title:'金额段定义'
			})




			//流程任务相关
			.when('/flowTask/finishedTask',{
				templateUrl: 'template/flowTask/finishedTask.html',
				controller: 'task.finishedController',
				title:'已办任务'
			})
			.when('/flowTask/backlogTask',{
				templateUrl: 'template/flowTask/backlogTask.html',
				controller: 'task.backlogController',
				title:'待办任务'
			})
			.when('/flowTask/processMonitoring',{
				templateUrl: 'template/flowTask/processMonitoring.html',
				controller: 'process.MonitoringController',
				title:'流程监控'
			})
			.when('/flowTask/taskList',{
				templateUrl: 'template/flowTask/taskList.html',
				controller: 'task.listController',
				title:'查看任务'
			})
			.when('/flowTask/handleTask',{
				templateUrl: 'template/flowTask/handleTask.html',
				controller: 'task.handleController',
				title:'办理任务'
			})
			.when('/flowTask/assignOperator',{
				templateUrl: 'template/flowTask/assignOperator.html',
				controller: 'process.assignOperateController',
				title:'分配操作员'
			})
			.when('/flowTask/flowImage',{
				templateUrl: 'template/flowTask/flowImage.html',
				controller: 'process.flowImageController',
				resolve: {
                    load: mainApp.asyncjs('./flowTask/process.flowImageController')
                },
				title:'流程图'
			})




			//客户关系管理
			.when('/customerRelation/coreRelationManage',{
				templateUrl: 'template/customerRelation/coreRelationManage.html',
				controller: 'core.RelationManageController',
				title:'核心企业客户关系管理'
			})
			//供应商客户关系管理
			.when('/customerRelation/RelationManage',{
				templateUrl: 'template/customerRelation/RelationManage.html',
				controller: 'RelationManageController',
				title:'供应商客户关系管理'
			})
			.when('/customerRelation/coreRelateSupplier',{
				templateUrl: 'template/customerRelation/coreRelateSupplier.html',
				controller: 'core.relateSupplierController',
				title:'核心企业客户关联供应商'
			})
			.when('/customerRelation/coreRelateBuyer',{
				templateUrl: 'template/customerRelation/coreRelateBuyer.html',
				controller: 'core.relateBuyerController',
				title:'核心企业客户关联采购商'
			})
			.when('/customerRelation/coreAddRelation',{
				templateUrl: 'template/customerRelation/coreAddRelation.html',
				controller: 'core.addRelationController',
				title:'核心企业新增关联客户'
			})
			.when('/customerRelation/supplierRelationManage',{
				templateUrl: 'template/customerRelation/supplierRelationManage.html',
				controller: 'supplier.RelationManageController',
				title:'供应商/采购商客户关系管理'
			})
			.when('/customerRelation/supplierAddRelation',{
				templateUrl: 'template/customerRelation/supplierAddRelation.html',
				controller: 'supplier.addRelationController',
				title:'供应商/采购商新增关联客户'
			})
			.when('/customerRelation/supplierRelateCore',{
				templateUrl: 'template/customerRelation/supplierRelateCore.html',
				controller: 'supplier.RelateCoreController',
				title:'供应商/采购商关联授信核心企业'
			})
			.when('/customerRelation/openFactorBusi',{
				templateUrl: 'template/customerRelation/openFactorBusi.html',
				controller: 'supplier.openFactorController',
				title:'开通保理业务'
			})
			.when('/customerRelation/facUploadData/:custNo/:custType/:disRelateCustName',{
				templateUrl: 'template/customerRelation/facUploadData.html',
				controller: 'fac.UploadDataController',
				title:'保理材料'
			})
			.when('/customerRelation/facBusiDetail',{
				templateUrl: 'template/customerRelation/facBusiDetail.html',
				controller: 'supplier.facDetailController',
				title:'开通保理业务详情'
			})
			.when('/customerRelation/openFactorAccept/:custNo/',{
				templateUrl: 'template/customerRelation/openFactorAccept.html',
				controller: 'fac.openFacAcceptController',
				title:'开通保理业务受理'
			})
			.when('/customerRelation/openFactorAudit/:custNo/',{
				templateUrl: 'template/customerRelation/openFactorAudit.html',
				controller: 'fac.openFacAuditController',
				title:'开通保理业务审核'
			})
			.when('/customerRelation/qiefactorDetail/:custNo/',{
				templateUrl: 'template/customerRelation/qiefactorDetail.html',
				controller: 'qie.factorDetailController',
				title:'开通保理业务审核'
			})




			//合同类型
			.when('/contractType/contractTypeManage',{
				templateUrl: 'template/contract/type/contractTypeManage.html',
				controller: 'contractType.manageController',
				title:'合同类型管理'
			})
			.when('/contractType/contractTypeAdd',{
				templateUrl: 'template/contract/type/contractTypeAdd.html',
				controller: 'contractType.addController',
				title:'合同类型登记'
			})
			.when('/contractType/contractTypeEdit',{
				templateUrl: 'template/contract/type/contractTypeEdit.html',
				controller: 'contractType.editController',
				title:'合同类型编辑'
			})
			.when('/contractType/contractTypeAudit',{
				templateUrl: 'template/contract/type/contractTypeAudit.html',
				controller: 'contractType.auditController',
				title:'合同类型审核'
			})
			.when('/contractType/contractTypeEnable',{
				templateUrl: 'template/contract/type/contractTypeEnable.html',
				controller: 'contractType.enableController',
				title:'合同类型启用'
			})
			.when('/contractType/contractTypeQuery',{
				templateUrl: 'template/contract/type/contractTypeQuery.html',
				controller: 'contractType.queryController',
				title:'合同类型查询'
			})
			.when('/contractType/contractTypeDetail',{
				templateUrl: 'template/contract/type/contractTypeDetail.html',
				controller: 'contractType.detailController',
				title:'合同类型详情'
			})



			/**
			*标准合同区域
			**/
			.when('/standardContract/list',{
				templateUrl: 'template/contract/standard/standard.contractList.html',
				resolve: {
			          load: mainApp.asyncjs('./contract/standard/standard.contractList')
		        },
				controller: 'standard.contractList',
				title:'标准合同登记'
			})

			.when('/standardContract/add',{
				templateUrl: 'template/contract/standard/standard.contractAdd.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractAdd')
        		},
				controller: 'standard.contractAdd',
				title:'标准合同登记'
			})

			.when('/standardContract/edit',{
				templateUrl: 'template/contract/standard/standard.contractEdit.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractEdit')
        		},
				controller: 'standard.contractEdit',
				title:'标准合同编辑'
			})

			.when('/standardContract/aduit',{
				templateUrl: 'template/contract/standard/standard.contractAduit.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractAduit')
        		},
				controller: 'standard.contractAduit',
				title:'标准合同审核'
			})

			.when('/standardContract/active',{
				templateUrl: 'template/contract/standard/standard.contractActive.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractActive')
        		},
				controller: 'standard.contractActive',
				title:'标准合同启用'
			})

			.when('/standardContract/cancel',{
				templateUrl: 'template/contract/standard/standard.contractCancel.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractCancel')
        		},
				controller: 'standard.contractCancel',
				title:'标准合同禁用'
			})

			.when('/standardContract/query',{
				templateUrl: 'template/contract/standard/standard.contractQuery.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractQuery')
        		},
				controller: 'standard.contractQuery',
				title:'标准合同查询'
			})

			.when('/standardContract/detail',{
				templateUrl: 'template/contract/standard/standard.contractDetail.html',
				resolve: {
          			load: mainApp.asyncjs('./contract/standard/standard.contractDetail')
        		},
				controller: 'standard.contractDetail',
				title:'标准合同详情'
			})



			/**
			*供应商相关合同
			**/
			.when('/supplierContract/list',{
				templateUrl: 'template/contract/supplier/supplier.contractList.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractList')
		        },
				controller: 'supplier.contractList',
				title:'供应商合同列表'
			})

			.when('/supplierContract/add',{
				templateUrl: 'template/contract/supplier/supplier.contractAdd.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractAdd')
		        },
				controller: 'supplier.contractAdd',
				title:'供应商合同登记'
			})

			.when('/supplierContract/edit/:contractId',{
				templateUrl: 'template/contract/supplier/supplier.contractEdit.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractEdit')
		        },
				controller: 'supplier.contractEdit',
				title:'供应商合同编辑'
			})

			//作废,审核生效，审核取消，查看详情 通用 type参数指所需做的操作
			.when('/supplierContract/reset/:type',{
				templateUrl: 'template/contract/supplier/supplier.contractReset.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractReset')
		        },
				controller: 'supplier.contractReset',
				title:'供应商合同状态维护'
			})

			.when('/supplierContract/query',{
				templateUrl: 'template/contract/supplier/supplier.contractQuery.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractQuery')
		        },
				controller: 'supplier.contractQuery',
				title:'供应商合同台账查询'
			})

			.when('/supplierContract/aduit',{
				templateUrl: 'template/contract/supplier/supplier.contractAduit.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractAduit')
		        },
				controller: 'supplier.contractAduit',
				title:'供应商合同台账审核'
			})

			.when('/supplierContract/cancel/:contractId',{
				templateUrl: 'template/contract/supplier/supplier.contractCancel.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractCancel')
		        },
				controller: 'supplier.contractCancel',
				title:'供应商合同台账作废'
			})

			.when('/supplierContract/aduitInfo/:contractId/:businStatus',{
				templateUrl: 'template/contract/supplier/supplier.contractAduitInfo.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractCancel')
		        },
				controller: 'supplier.contractCancel',
				title:'供应商合同台账审核详情信息'
			})

			.when('/supplierContract/contractInfo/:contractId/',{
				templateUrl: 'template/contract/supplier/supplier.contractInfo.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/supplier/supplier.contractInfo')
		        },
				controller: 'supplier.contractInfo',
				title:'供应商合同台账详情信息'
			})



			/**
			*经销商合同
			**/
			.when('/sellerContract/list',{
				templateUrl: 'template/contract/seller/seller.contractList.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractList')
		        },
				controller: 'seller.contractList',
				title:'经销商合同列表'
			})

			.when('/sellerContract/add',{
				templateUrl: 'template/contract/seller/seller.contractAdd.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractAdd')
		        },
				controller: 'seller.contractAdd',
				title:'经销商合同登记'
			})

			.when('/sellerContract/edit/:contractId',{
				templateUrl: 'template/contract/seller/seller.contractEdit.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractEdit')
		        },
				controller: 'seller.contractEdit',
				title:'经销商合同编辑'
			})

			//作废,审核生效，审核取消，查看详情 通用 type参数指所需做的操作
			.when('/sellerContract/reset/:type',{
				templateUrl: 'template/contract/seller/seller.contractReset.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractReset')
		        },
				controller: 'seller.contractReset',
				title:'经销商合同状态维护'
			})

			.when('/sellerContract/query',{
				templateUrl: 'template/contract/seller/seller.contractQuery.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractQuery')
		        },
				controller: 'seller.contractQuery',
				title:'经销商合同台账查询'
			})

			.when('/sellerContract/aduit',{
				templateUrl: 'template/contract/seller/seller.contractAduit.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractAduit')
		        },
				controller: 'seller.contractAduit',
				title:'经销商合同台账审核'
			})

			.when('/sellerContract/cancel/:contractId',{
				templateUrl: 'template/contract/seller/seller.contractCancel.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractCancel')
		        },
				controller: 'seller.contractCancel',
				title:'经销商合同台账作废'
			})

			.when('/sellerContract/aduitInfo/:contractId/:businStatus',{
				templateUrl: 'template/contract/seller/seller.contractAduitInfo.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractCancel')
		        },
				controller: 'seller.contractCancel',
				title:'经销商合同台账审核详情信息'
			})

			.when('/sellerContract/contractInfo/:contractId/',{
				templateUrl: 'template/contract/seller/seller.contractInfo.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/seller/seller.contractInfo')
		        },
				controller: 'seller.contractInfo',
				title:'经销商合同台账详情信息'
			})

			//保理公司合同
			// .when('/contract/factor/standardContractTypeManage',{
			// 	templateUrl: 'template/contract/factor/standardContractTypeManage.html',
			// 	controller: 'standard.contractType',
			// 	title:'标准合同类型维护'
			// })
			.when('/contract/factor/standardContractTypeManage',{
				templateUrl: 'template/contract/factor/standardContractTypeManage.html',
				resolve: {
		          load: mainApp.asyncjs('./contract/factor/fac.standardContractType')
		        },
				controller: 'fac.standardContractType',
				title:'标准合同类型维护'
			})


			
			.when('/flow/demo/applyForm', {
				templateUrl: 'template/flow/demo/applyForm.html',
				controller:'applyFormController',
				resolve: {
                    load: mainApp.asyncjs('./flow/d emo/applyFormController')
                },
				title:'演示申请'
			})
			.when('/flow/demo/auditForm', {
				templateUrl: 'template/flow/demo/auditForm.html',
				controller:'auditFormController',
				resolve: {
                    load: mainApp.asyncjs('./flow/demo/auditFormController')
                },
				title:'演示审核'
			})
			.when('/flow/demo/handleForm', {
				templateUrl: 'template/flow/demo/handleForm.html',
				controller:'handleFormController',
				resolve: {
                    load: mainApp.asyncjs('./flow/demo/handleFormController')
                },
				title:'演示受理'
			})


			/**
			*资料维护公用板块
			**/
			//合同新增
			.when('/data/common/addContract',{
				templateUrl: 'template/flow/data/contractAdd.html',
				controller:'contract.AddController',
				resolve: {
                    load: mainApp.asyncjs('./flow/data/contract.AddController')
                },
				title:'新增合同'
			})

			//发票新增
			.when('/data/common/addInvoice',{
				templateUrl: 'template/flow/data/invoiceAdd.html',
				controller:'invoice.addInvoiceController',
				resolve: {
                    load: mainApp.asyncjs('./flow/data/invoice.addInvoiceController')
                },
				title:'新增发票'
			})




			//流程定义 - 供应商融资
			.when('/flow/supplierFinance/contractAudit', {
				templateUrl: 'template/flow/supplierFinance/contractAudit.html',
				controller:'contractAuditController',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/contractAuditController')
                },
				title:'合同审核'
			})
			.when('/flow/supplierFinance/contractAudit2', {
				templateUrl: 'template/flow/supplierFinance/contractAudit2.html',
				controller:'contractAudit2Controller',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/contractAudit2Controller')
                },
				title:'合同审核2'
			})
			.when('/flow/supplierFinance/contractSign', {
				templateUrl: 'template/flow/supplierFinance/contractSign.html',
				controller:'contractSignController',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/contractSignController')
                },
				title:'合同签署'
			})
			.when('/flow/supplierFinance/contractSign2', {
				templateUrl: 'template/flow/supplierFinance/contract2Sign.html',
				controller:'contractSign2Controller',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/contractSign2Controller')
                },
				title:'合同签署2'
			})
			.when('/flow/supplierFinance/contractSignResult', {
				templateUrl: 'template/flow/supplierFinance/contractSignResult.html',
				controller:'contractSignResult',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/contractSignResult')
                },
				title:'合同签署结果'
			})
            .when('/flow/supplierFinance/financeRecheck', {
                templateUrl: 'template/flow/supplierFinance/financeRecheck.html',
                controller:'financeRecheck',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/financeRecheck')
                },
                title:'融资复核'
            })
            .when('/flow/supplierFinance/businessHandle', {
                templateUrl: 'template/flow/supplierFinance/businessHandle.html',
                controller:'businessHandle',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/businessHandle')
                },
                title:'业务受理'
            })
            .when('/flow/supplierFinance/approveRisk', {
                templateUrl: 'template/flow/supplierFinance/approveRisk.html',
                controller:'approveRisk',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/approveRisk')
                },
                title:'风控审批'
            })
            .when('/flow/supplierFinance/schemeReview', {
                templateUrl: 'template/flow/supplierFinance/schemeReview.html',
                controller:'schemeReview',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/schemeReview')
                },
                title:'融资方案批复'
            })
            .when('/flow/supplierFinance/schemeApprove', {
                templateUrl: 'template/flow/supplierFinance/schemeApprove.html',
                controller:'schemeApprove',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/schemeApprove')
                },
                title:'融资方案审核'
            })
            .when('/flow/supplierFinance/schemeEnsure', {
                templateUrl: 'template/flow/supplierFinance/schemeEnsure.html',
                controller:'schemeEnsure',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/schemeEnsure')
                },
                title:'融资方案确认'
            })
            .when('/flow/supplierFinance/tradeEnsure', {
                templateUrl: 'template/flow/supplierFinance/tradeEnsure.html',
                controller:'tradeEnsure',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/tradeEnsure')
                },
                title:'贸易背景确认'
            })
            .when('/flow/supplierFinance/launchSignContract', {
                templateUrl: 'template/flow/supplierFinance/launchSignContract.html',
                controller:'launchSignContract',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/launchSignContract')
                },
                title:'发起签约'
            })
            .when('/flow/supplierFinance/addsignContract', {
                templateUrl: 'template/2_3.1/temp/addsignContract.html',
                controller:'addsignContract',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/addsignContract')
                },
                title:'添加协议'
            })
            .when('/flow/supplierFinance/signFileRecheck', {
                templateUrl: 'template/flow/supplierFinance/signFileRecheck.html',
                controller:'signFileRecheck',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/signFileRecheck')
                },
                title:'签约文件审核'
            })
            .when('/flow/supplierFinance/signContract', {
                templateUrl: 'template/flow/supplierFinance/signContract.html',
                controller:'signContract',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/signContract')
                },
                title:'签约'
            })
            .when('/flow/supplierFinance/registerProperty', {
                templateUrl: 'template/flow/supplierFinance/registerProperty.html',
                controller:'registerProperty',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/registerProperty')
                },
                title:'资产登记'
            })
            .when('/flow/supplierFinance/loanApproval', {
                templateUrl: 'template/flow/supplierFinance/loanApproval.html',
                controller:'loanApproval',
                resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/loanApproval')
                },
                title:'放款审批'
            })                
			.when('/flow/supplierFinance/issuePlan', {
				templateUrl: 'template/flow/supplierFinance/issuePlan.html',
				controller:'issuePlanController',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/issuePlanController')
                },
				title:'出具贷款方案'
			})

			.when('/flow/supplierFinance/signAction', {
				templateUrl: 'template/flow/supplierFinance/signAction.html',
				controller:'signActionController',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/signActionController')
                },
				title:'发起背景确认'
			})

			.when('/flow/supplierFinance/loanEnsure', {
				templateUrl: 'template/flow/supplierFinance/loanEnsure.html',
				controller:'loanEnsureController',
				resolve: {
                    load: mainApp.asyncjs('./flow/supplierFinance/loanEnsureController')
                },
				title:'放款确认'
			})

			.when('/flow/supplierFinance/approveFlow', {
				templateUrl: 'template/flow/supplierFinance/approveFlow.html',
				controller:'approveFlowController',
				resolve: {
	                load: mainApp.asyncjs('./flow/supplierFinance/approveFlowController')
	            },
				title:'一般审批'
			})

			.when('/flow/supplierFinance/issueEnsure', {
				templateUrl: 'template/flow/supplierFinance/issueEnsure.html',
				controller:'issueEnsureController',
				resolve: {
	                load: mainApp.asyncjs('./flow/supplierFinance/issueEnsureController')
	            },
				title:'融资方确认方案'
			})

			.when('/flow/supplierFinance/transferEnsure', {
				templateUrl: 'template/flow/supplierFinance/transferEnsure.html',
				controller:'transferEnsureController',
				resolve: {
	                load: mainApp.asyncjs('./flow/supplierFinance/transferEnsureController')
	            },
				title:'核心企业债权转让确认'
			})

			.when('/flow/supplierFinance/detail', {
				templateUrl: 'template/flow/supplierFinance/financeDetail.html',
				controller:'financeDetailController',
				resolve: {
	                load: mainApp.asyncjs('./flow/supplierFinance/financeDetailController')
	            },
				title:'融资详情'
			})





			//流程定义 - 经销商融资
			.when('/flow/agencyFinance/issuePlan', {
				templateUrl: 'template/flow/agencyFinance/issuePlan.html',
				controller:'issuePlanController',
				resolve: {
                    load: mainApp.asyncjs('./flow/agencyFinance/issuePlanController')
                },
				title:'出具贷款方案'
			})

			.when('/flow/agencyFinance/signAction', {
				templateUrl: 'template/flow/agencyFinance/signAction.html',
				controller:'signActionController',
				resolve: {
                    load: mainApp.asyncjs('./flow/agencyFinance/signActionController')
                },
				title:'发起背景确认'
			})

			.when('/flow/agencyFinance/loanEnsure', {
				templateUrl: 'template/flow/agencyFinance/loanEnsure.html',
				controller:'loanEnsureController',
				resolve: {
                    load: mainApp.asyncjs('./flow/agencyFinance/loanEnsureController')
                },
				title:'放款确认'
			})

			.when('/flow/agencyFinance/approveFlow', {
				templateUrl: 'template/flow/agencyFinance/approveFlow.html',
				controller:'approveFlowController',
				resolve: {
	                load: mainApp.asyncjs('./flow/agencyFinance/approveFlowController')
	            },
				title:'一般审批'
			})

			.when('/flow/agencyFinance/issueEnsure', {
				templateUrl: 'template/flow/agencyFinance/issueEnsure.html',
				controller:'issueEnsureController',
				resolve: {
	                load: mainApp.asyncjs('./flow/agencyFinance/issueEnsureController')
	            },
				title:'融资方确认方案'
			})

			.when('/flow/agencyFinance/transferEnsure', {
				templateUrl: 'template/flow/agencyFinance/transferEnsure.html',
				controller:'transferEnsureController',
				resolve: {
	                load: mainApp.asyncjs('./flow/agencyFinance/transferEnsureController')
	            },
				title:'核心企业三方协议确认'
			})

			.when('/flow/agencyFinance/detail', {
				templateUrl: 'template/flow/agencyFinance/financeDetail.html',
				controller:'financeDetailController',
				resolve: {
	                load: mainApp.asyncjs('./flow/agencyFinance/financeDetailController')
	            },
				title:'融资详情'
			})

			//帮助中心
			.when('/help/helpCenter', {
				templateUrl: 'template/help/helpCenter.html',
				controller:'helpCenterConroller',
				resolve: {
	                load: mainApp.asyncjs('./help/helpCenterConroller')
	            },
				title:'帮助中心'
			})
			.when('/help/help', {
				templateUrl: 'template/help/help.html',
				controller:'helpConroller',
				resolve: {
	                load: mainApp.asyncjs('./help/helpConroller')
	            },
				title:'帮助'
			})

			//客户信息查询
			.when('/plat/custInfo', {
				templateUrl: 'template/account/plat.custInfo.html',
				controller:'plat.custInfoController',
				resolve: {
	                load: mainApp.asyncjs('./account/plat.custInfoController.js')
	            },
				title:'(平台)客户信息查询'
			})
			.when('/fac/custInfo', {
				templateUrl: 'template/account/fac.custInfo.html',
				controller:'fac.custInfoController',
				resolve: {
	                load: mainApp.asyncjs('./account/fac.custInfoController.js')
	            },
				title:'(保理)客户信息查询'
			})
			.when('/plat/custInfoDetail/:id', {
				templateUrl: 'template/account/plat.custInfoDetail.html',
				controller:'plat.custInfoDetailController',
				resolve: {
	                load: mainApp.asyncjs('./account/plat.custInfoDetailController.js')
	            },
				title:'(平台)客户信息查询'
			})



			.when('/contract.prototype',{
				templateUrl: 'template/contractTemp/Contract.prototype.html',
				controller: 'contract.prototypeController',
			    resolve: {
	                 load: mainApp.asyncjs('./contractTemp/contract.prototypeController.js')
	             },
				title:'合同原型'
			})


			.when('/contract.prototype/edit',{
				templateUrl: 'template/contractTemp/Contract.prototype.edit.html',
				controller: 'contract.prototype.editController',
				resolve: {
	                load: mainApp.asyncjs('./contractTemp/contract.prototype.editController.js')
	            },
				title:'合同原型'
			})

			.when('/contract.prototype/add',{
				templateUrl: 'template/contractTemp/Contract.prototype.add.html',
				controller: 'contract.prototype.addController',
				resolve: {
	                load: mainApp.asyncjs('./contractTemp/contract.prototype.addController.js')
	            },
				title:'合同原型'
			})


			// //流程授权相关
			// .when('/auth/apiBind/id',{
			// 	templateUrl: 'template/auth/auth.apiBind.html',
			// 	controller: 'auth.apiBindController',
			// 	title:'菜单与接口权限相绑定'
			// })
			// .when('/auth/authTree',{
			// 	templateUrl: 'template/auth/auth.authTree.html',
			// 	controller: 'auth.authTreeController',
			// 	title:'系统菜单树'
			// })

			//容错路径
			.otherwise({
				redirectTo:'/temp'
			});

		}]);
	};
});
