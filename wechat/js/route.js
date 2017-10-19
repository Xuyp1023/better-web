/*
整体项目的路由导航
@author binhg
*/

exports.installRoute = function(mainApp){
	mainApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider.when('/home',{
			templateUrl: 'views/home/home.html',
			controller: 'homeController',
			title:'企e金服供应链金融'
		})

		.when('/home/entrance',{
			templateUrl: 'views/home/entrance.html',
			controller: 'home.entranceController',
			title:'二维码入口'
		})

		.when('/home/finance',{
			templateUrl: 'views/home/homeFinance.html',
			controller: 'home.financeController',
			title:'融资'
		})

		.when('/home/financeAll',{
			templateUrl: 'views/home/homeFinanceAll.html',
			controller: 'home.financeController',
			title:'融资'
		})	


		.when('/home/single',{
		 	templateUrl: 'views/home/homeSingle.html',
		 	controller: 'home.singleController',
		 	title:'个人中心'
		})

		.when('/home/informa',{
		 	templateUrl: 'views/home/homeInforma.html',
		 	controller: 'home.informaController',
		 	title:'我的资料'
		})

		.when('/home/invest',{
			templateUrl: 'views/home/homeInvest.html',
			controller: 'home.financeController',
			title:'投资'
		})

		.when('/home/company',{
			templateUrl: 'views/home/homecompanyprofile.html',
			controller: 'home.companyprofileController',
			title:'关于我们'
		})

		.when('/home/introduct',{
			templateUrl: 'views/home/homeintroduct.html',
			controller: 'home.introductController',
			title:'公司简介'
		})

		// 更多
		.when('/more/security',{
			templateUrl: 'views/more/security.html',
			controller: 'more.securityController',
			title:'账号与安全'
		})
		.when('/more/more',{
			templateUrl: 'views/more/more.html',
			controller: 'more.moreController',
			title:'更多'
		})
		// 消息与中心
		.when('/news/center',{
			templateUrl: 'views/news/newsCenter.html',
			controller: 'news.cneterController',
			title:'消息中心'
		})
		.when('/news/notice',{
			templateUrl: 'views/news/newsNotice.html',
			controller: 'news.noticeController',
			title:'公告消息'
		})
		.when('/news/personal',{
			templateUrl: 'views/news/newsPersonal.html',
			controller: 'news.personalController',
			title:'个人消息'
		})
		.when('/news/noticeDetail/:id',{
		templateUrl: 'views/news/newsNoticeDetail.html',
		controller: 'news.noticeDetailController',
		title:'消息内容'
		})
		.when('/news/personalDetail/:id',{
		templateUrl: 'views/news/newsPersonalDetail.html',
		controller: 'news.personalDetailController',
		title:'消息内容'
		})
		// 引导
		.when('/lead/financing/',{
		templateUrl: 'views/lead/leadFinancing.html',
		controller: 'lead.financingController',
		title:'选择融资类型'
		})
		.when('/lead/enquiry/',{
		templateUrl: 'views/lead/leadEnquiry.html',
		controller: 'lead.enquiryController',
		title:'选择询价类型'
		})


		/**
		*应收账款相关
		**/
		//应收账款列表
		.when('/recieve',{
			templateUrl: 'views/recieve/recieve.html',
			controller: 'recieveController',
			title:'企e金服应收账款'
		})
		//未融资应收账款,以及合并了应收账款编辑
		.when('/recieve/detail/unFi/:id',{
			templateUrl: 'views/recieve/recieveDetailUn.html',
			controller: 'recieve.detailUnController',
			title:'应收账款详情'
		})

		//已融资应收账款
		.when('/recieve/detail/didFi/:id',{
			templateUrl: 'views/recieve/recieveDetailDid.html',
			controller: 'recieve.detailDidController',
			title:'已融资应收账款详情'
		})

		/**
		*票据池更改 2.2.1 相关
		**/
		//票据池列表
		.when('/billPool',{
			templateUrl: 'views/billPool/billPool.html',
			controller: 'billPoolController',
			title:'企e金服票据池'
		})
		//未融资票据池,以及合并了票据池编辑
		.when('/billPool/detail/unFi/:id',{
			templateUrl: 'views/billPool/billPoolDetailUn.html',
			controller: 'billPool.detailUnController',
			title:'未融资票据详情'
		})

		//已融资票据池
		.when('/billPool/detail/didFi/:id',{
			templateUrl: 'views/billPool/billPoolDetailDid.html',
			controller: 'billPool.detailDidController',
			title:'已融资票据详情'
		})



		//票据相关
		.when('/bill',{
			templateUrl: 'views/bill/bill.html',
			controller: 'billController',
			title:'企e金服票据池'
		}).when('/bill/detail/:id',{
			templateUrl: 'views/bill/billDetail.html',
			controller: 'bill.detailController',
			title:'企e金服票据详情'
		}).when('/billInvoice',{
			templateUrl: 'views/bill/invoiceList.html',
			controller: 'billInvoiceListController',
			title:'企e金服票据发票'
		}).when('/billUpload/:id',{
			templateUrl: 'views/bill/uploadList.html',
			controller: 'billUploadListController',
			title:'企e金服票据附件'
		}).when('/inquiryDo',{
			templateUrl: 'views/inquiry/inquiryDo.html',
			controller: 'billController'
		})



		//询价相关
		.when('/inquiry',{
			templateUrl: 'views/inquiry/inquiry.html',
			controller:'inquiryController'
		})
		.when('/inquiry/detail/:enquiryNo',{
			templateUrl: 'views/inquiry/inquiryDetail.html',
			controller:'inquiry.detailController'
		})
		.when('/inquiry/abandon/:id',{
			templateUrl: 'views/inquiry/inquiryAbandon.html',
			controller:'inquiry.abandonController'
		})
		.when('/inquiry/reply/:id',{
			templateUrl: 'views/inquiry/inquiryReply.html',
			controller:'inquiry.replyController'
		})
		.when('/inquiry/offerRecord/:enquiryNo',{
			templateUrl: 'views/inquiry/inquiryRecord.html',
			controller:'inquiry.recordController'
		})
		.when('/inquiry/do/:id',{
			templateUrl: 'views/inquiry/inquiryDo1.html',
			controller: 'inquiry.doController'
		})



		//融资产品
		.when('/product',{
			templateUrl: 'views/factoring/product.html',
			controller: 'productController'
		})
     
		//融资签约管理
		.when('/sign',{
			templateUrl: 'views/sign/sign.html',
			controller: 'signController',
			title:''
		})
		.when('/sign/detail/:id',{
			templateUrl: 'views/sign/signDetail.html',
			controller: 'sign.detailController'
		})
		.when('/sign/record',{
			templateUrl: 'views/sign/signRecord.html',
			controller: 'sign.recodeController'
		})
		.when('/sign/do/:appNo',{
			templateUrl: 'views/sign/signFinance.html',
			controller: 'sign.doController'
		})
		.when('/sign/protocol',{
			templateUrl: 'views/sign/previewPro.html',
			controller: 'signController'
		})


		



		//开户优化流程
		.when('/register/basic',{
			templateUrl: 'views/account/openAccountBasic.html',
			controller: 'open.basicController',
			title:'填写基本资料'
		})

		.when('/register/upload',{
			templateUrl:'views/account/accountUpload.html',
			controller:'open.uploadController',
			title:'上传认证资料'
		})

		.when('/register/passwd',{
			templateUrl:'views/account/openAccountPasswd.html',
			controller:'open.passwdController',
			title:'设置密码'
		})

		.when('/register/show',{
			templateUrl:'views/account/openAccountShow.html',
			controller:'open.showController',
			title:'开户认证资料'
		})

		.when('/register/waitAudit',{
			templateUrl: 'views/account/waitAudit.html',
			controller: 'open.waitAuditController',
			title:'企e金服开户'
		})

		.when('/register/waitActive',{
			templateUrl: 'views/account/waitActive.html',
			controller: 'open.waitActiveController',
			title:'企e金服开户激活'
		})
		.when('/register/accountSuccess',{
			templateUrl: 'views/account/accountSuccess.html',
			controller: 'account.succeController',
			title:'开户成功'
		})



		//客户关系
		.when('/relation/manage',{
			templateUrl: 'views/relation/relationManage.html',
			controller: 'relation.manageController',
			title:'客户关系管理'
		})
		.when('/relation/select',{
			templateUrl: 'views/relation/relationSelect.html',
			controller: 'relation.selectController',
			title:'选择客户类型'
		})
		.when('/relation/core/link',{
			templateUrl: 'views/relation/coreRelated.html',
			controller: 'relation.coreRelatedController',
			title:'关联授信核心企业'
		})
		.when('/relation/core/show',{
			templateUrl: 'views/relation/coreRelatedShow.html',
			controller: 'relation.coreShowController',
			title:'关联授信核心企业'
		})
		//关联详情
		.when('/relation/core/detail',{
			templateUrl: 'views/relation/coreRelatedDetail.html',
			controller: 'relation.coreDetailController',
			title:'关联授信核心企业'
		})
		.when('/relation/factor/link',{
			templateUrl: 'views/relation/factorRelated.html',
			controller: 'relation.factorRelatedController',
			title:'开通保理融资业务'
		})
		.when('/relation/factor/attach',{
			templateUrl: 'views/relation/factorAttach.html',
			controller: 'relation.factorAttachController',
			title:'开通保理融资业务'
		})
		.when('/relation/factor/ensure',{
			templateUrl: 'views/relation/factorEnsure.html',
			controller: 'relation.factorEnsureController',
			title:'开通保理融资业务'
		})
		.when('/relation/factor/show',{
			templateUrl: 'views/relation/factorRelatedShow.html',
			controller: 'relation.factorShowController',
			title:'开通保理融资业务'
		})
		//关联详情
		.when('/relation/factor/detail',{
			templateUrl: 'views/relation/factorRelatedDetail.html',
			controller: 'relation.factorDetailController',
			title:'开通保理融资业务'
		})


		// 新的融资申请(提前回款)
		.when('/model/financeApply/:id',{
			templateUrl: 'views/model/financeApply.html',
			controller: 'financeApplyCtrl',
			title:'申请提前回款'
		})
		.when('/model/financeDetail/:id/:version',{
			templateUrl: 'views/model/financeDetail.html',
			controller: 'financeDetailCtrl',
			title:'提前回款详情'
		})

		/* 融资相关 v2.2 */
		// 融资申请
		.when('/financeBusi/apply',{
			templateUrl: 'views/financeBusi/financeApply.html',
			controller: 'financeBusi.applyController',
			title:'融资申请'
		})
		// 融资详情
		.when('/financeBusi/detail/:requestNo',{
			templateUrl: 'views/financeBusi/financeDetail.html',
			controller: 'financeBusi.detailController',
			title:'融资详情'
		})

		// 待批融资
		.when('/financeSearch/pend',{
			templateUrl: 'views/financeSearch/pendFinance.html',
			controller: 'financeSearch.pendController',
			title:'待批融资'
		})

		// 还款融资
		.when('/financeSearch/repay',{
			templateUrl: 'views/financeSearch/repayFinance.html',
			controller: 'financeSearch.repayController',
			title:'还款融资'
		})

		// 历史融资
		.when('/financeSearch/history',{
			templateUrl: 'views/financeSearch/historyFinance.html',
			controller: 'financeSearch.historyController',
			title:'历史融资'
		})



		/* 贸易合同相关 */
		// 合同列表
		.when('/tradeContract/list',{
			templateUrl: 'views/contract/tradeContractList.html',
			controller: 'tradeContract.listController',
			title:'贸易合同'
		})
		// 添加合同
		.when('/tradeContract/add',{
			templateUrl: 'views/contract/tradeContractAdd.html',
			controller: 'tradeContract.addController',
			title:'添加贸易合同'
		})
		// 编辑合同
		.when('/tradeContract/edit/:contractId',{
			templateUrl: 'views/contract/tradeContractEdit.html',
			controller: 'tradeContract.editController',
			title:'编辑贸易合同'
		})
		// 合同信息  查看|审核|取消审核|作废	(detail|audit|cancel:disuse)
		.when('/tradeContract/info/:type/:contractId',{
			templateUrl: 'views/contract/tradeContractInfo.html',
			controller: 'tradeContract.infoController',
			title:'合同信息'
		})
		// 上传附件
		.when('/tradeContract/upload/:contractId',{
			templateUrl: 'views/contract/tradeContractUpload.html',
			controller: 'tradeContract.uploadController',
			title:'上传合同附件'
		})
		// 附件信息
		.when('/tradeContract/attach/:contractId',{
			templateUrl: 'views/contract/tradeContractAttach.html',
			controller: 'tradeContract.attachController',
			title:'合同附件'
		})



		//图片预览
		.when('/preImg/:id',{
			templateUrl: 'views/plugin/preImg.html',
			controller: 'preImgController',
			title:'附件预览'
		})

		//temp相关的路由
		.when('/temp',{
			templateUrl: 'views/temp/tempList.html',
			controller: 'tempController',
			title:'附件预览'
		})




		//融资相关 [旧版，废弃]
		.when('/finance',{
			templateUrl: 'views/finance/finance.html',
			controller: 'financeController',
			title:'企e金服融资列表'
		})
		.when('/finance/do/:type/:id',{
			templateUrl: 'views/finance/financeApply.html',
			controller: 'finance.applyController',
			title:'企e金服融资详情'
		})
		.when('/finance/success',{
			templateUrl: 'views/finance/financeSuccess.html',
			controller: 'finance.successController',
			title:'申请成功'
		})
		.when('/finance/detail/:type/:id',{
			templateUrl: 'views/finance/financeDetail.html',
			controller: 'finance.detailController'
		})
		.when('/finance/select',{
			templateUrl: 'views/finance/financeSelect.html',
			controller: 'financeController'
		})


		//用户相关 [旧版，废弃]
		.when('/register',{
			templateUrl: 'views/account/register.html',
			controller: 'accountController',
			title:'企e金服融资业务开户'
		})
		.when('/register/success',{
			templateUrl:'views/account/openSuccess.html',
			controller:'account.successController',
			title:'开户成功'
		})
		.when('/register/detail',{
			templateUrl: 'views/account/accountInfo.html',
			controller: 'account.detailController',
			title:'企e金服开户详情'
		})
		.when('/account403',{
			templateUrl: 'views/account/403page.html',
			controller: 'accountController',
			title:'您的访问出错了!'
		})
		.when('/accountBind',{
			templateUrl: 'views/account/accountBind.html',
			controller: 'account.bindController'
		})
		.when('/validatePhone',{
			templateUrl: 'views/account/validatePhone.html',
			controller: 'accountController'
		})
		.when('/register/factor',{
			templateUrl: 'views/account/factorRegister.html',
			controller: 'account.factorController',
			title:'开通保理融资业务'
		})


		/*==========Demo区域 请勿占用 start ===================*/
		//temp相关的路由
		.when('/demo/tableView/swiper',{
			templateUrl: 'views/demo/tableView.Swiper.html',
			controller: 'tableView.Swiper',
			title:'table-view swiper滑动'
		})
		.when('/demo/test',{
			templateUrl: 'views/demo/test.html',
			controller: 'bill.test',
			title:'测试中'
		})
		// 测试用
		
		/*==========Demo区域 请勿占用 end   ===================*/


		//容错路径
		.otherwise({
			redirectTo:'/home'
		});



	}]);
};
