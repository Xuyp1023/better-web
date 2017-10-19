
var ctrlArr = [];
ctrlArr.push(require('./home/homeController'));
ctrlArr.push(require('./home/home.financeController'));

/*更多*/
ctrlArr.push(require('./more/more.security'));
ctrlArr.push(require('./more/more.more'));
/*消息中心*/
ctrlArr.push(require('./news/news.center'));
ctrlArr.push(require('./news/news.notice'));
ctrlArr.push(require('./news/news.personal'));
ctrlArr.push(require('./news/news.noticeDetail'));
ctrlArr.push(require('./news/news.personalDetail'));
// 引导
ctrlArr.push(require('./lead/lead.financing'));
ctrlArr.push(require('./lead/lead.enquiry'));

ctrlArr.push(require('./home/home.singleController'));
ctrlArr.push(require('./home/home.informaController'));
ctrlArr.push(require('./home/home.companyprofileController'));
ctrlArr.push(require('./home/home.introductController'));


/*票据池相关*/
ctrlArr.push(require('./bill/billController'));
ctrlArr.push(require('./bill/bill.detailController'));
ctrlArr.push(require('./bill/billInvoiceListController'));
ctrlArr.push(require('./bill/billUploadListController'));

/*	应收账款相关	*/
ctrlArr.push(require('./recieve/recieveController'));
ctrlArr.push(require('./recieve/recieve.detailUnController'));
ctrlArr.push(require('./recieve/recieve.detailDidController'));

/*	票据池改造	*/
ctrlArr.push(require('./billPool/billPoolController'));
ctrlArr.push(require('./billPool/billPool.detailUnController'));
ctrlArr.push(require('./billPool/billPool.detailDidController'));

ctrlArr.push(require('./factoring/productController'));
ctrlArr.push(require('./sign/signController'));
ctrlArr.push(require('./sign/sign.detailController'));
ctrlArr.push(require('./sign/sign.recodeController'));
ctrlArr.push(require('./sign/sign.doController'));

/*新的融资模型(提前回款)*/
ctrlArr.push(require('./model/financeApply'));
ctrlArr.push(require('./model/financeDetail'));
/*融资相关*/
ctrlArr.push(require('./finance/financeController'));
ctrlArr.push(require('./finance/finance.detailController'));
ctrlArr.push(require('./finance/finance.successController'));
ctrlArr.push(require('./finance/finance.applyController'));

//账户相关
ctrlArr.push(require('./account/accountController'));
ctrlArr.push(require('./account/account.successController'));
ctrlArr.push(require('./account/account.detailController'));
ctrlArr.push(require('./account/account.factorController'));
ctrlArr.push(require('./account/account.succeController'));
ctrlArr.push(require('./account/account.bindController'));

//开户相关
ctrlArr.push(require('./account/open.basicController'));
ctrlArr.push(require('./account/open.uploadController'));
ctrlArr.push(require('./account/open.passwdController'));
ctrlArr.push(require('./account/open.showController'));
ctrlArr.push(require('./account/open.waitAuditController'));
ctrlArr.push(require('./account/open.waitActiveController'));


//贸易合同相关
ctrlArr.push(require('./contract/tradeContract.listController'));
ctrlArr.push(require('./contract/tradeContract.addController'));
ctrlArr.push(require('./contract/tradeContract.editController'));
ctrlArr.push(require('./contract/tradeContract.infoController'));
ctrlArr.push(require('./contract/tradeContract.uploadController'));
ctrlArr.push(require('./contract/tradeContract.attachController'));



//客户关系
ctrlArr.push(require('./relation/relation.manageController'));
ctrlArr.push(require('./relation/relation.selectController'));
ctrlArr.push(require('./relation/relation.coreRelatedController'));
ctrlArr.push(require('./relation/relation.coreShowController'));
ctrlArr.push(require('./relation/relation.coreDetailController'));
ctrlArr.push(require('./relation/relation.factorRelatedController'));
ctrlArr.push(require('./relation/relation.factorAttachController'));
ctrlArr.push(require('./relation/relation.factorEnsureController'));
ctrlArr.push(require('./relation/relation.factorShowController'));
ctrlArr.push(require('./relation/relation.factorDetailController'));


//融资相关 2.2
ctrlArr.push(require('./financeBusi/financeBusi.applyController'));
ctrlArr.push(require('./financeBusi/financeBusi.detailController'));
//待批融资
ctrlArr.push(require('./financeSearch/financeSearch.pendController'));
ctrlArr.push(require('./financeSearch/financeSearch.repayController'));
ctrlArr.push(require('./financeSearch/financeSearch.historyController'));

//询价
ctrlArr.push(require('./inquiry/inquiryController'));
ctrlArr.push(require('./inquiry/inquiry.detailController'));
ctrlArr.push(require('./inquiry/inquiry.recordController'));
ctrlArr.push(require('./inquiry/inquiry.doController'));
ctrlArr.push(require('./inquiry/inquiry.replyController'));
ctrlArr.push(require('./inquiry/inquiry.abandonController'));


/*图片预览*/
ctrlArr.push(require('./plugin/preImgController'));

// temp模块
ctrlArr.push(require('./temp/tempController'));

/*==========Demo区域 请勿占用 start ===================*/
ctrlArr.push(require('./demo/tableView.Swiper'));
ctrlArr.push(require('./demo/test'));

/*==========Demo区域 请勿占用 end   ===================*/

exports.installAllControllers = function(){
	for (var i = 0; i < ctrlArr.length; i++) {
		var tempCtrl = ctrlArr[i];
		tempCtrl.installController.apply(window,arguments);
	}
};
