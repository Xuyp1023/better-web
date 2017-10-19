/*
公用路径配置模块
author binhg
*/
define(function(require,exports,module){
	var _isTest = location.href.indexOf('static') === -1?false:true;

	module.exports = window.BTPATH = {
		/*客户列表查询*/
		CUST_PATH : BTServerPath+ (_isTest?'/scf/testdata/custList.json':'/SaleQuery/queryCustInfo'),
		
		/*保理产品查询*/
		FAC_PRO_PATH:BTServerPath+ (_isTest?'/scf/testdata/proList.json':'/ScfRequest/queryValidFactorProductSimple'),

		/*全局保理产品查询*/
		FAC_PRO_ALL_PATH:BTServerPath+ (_isTest?'/scf/testdata/proList.json':'/ScfRequest/findFactorProductKeyAndValue'),

		/*获取单个产品信息*/
		FAC_PRO_SIG_PATH:BTServerPath+ (_isTest?'/scf/testdata/proList.json':'/ScfRequest/getFactorProduct'),

		/*票据列表查询 */
		BILL_LIST_PATH:BTServerPath+ (_isTest?'/scf/testdata/billList.json':'/ScfBill/queryAcceptBill'),	

		/*获取票据以及合同附件*/
		PLUS_PATH:BTServerPath+ (_isTest?'/scf/testdata/uploadList.json':'/ScfBill/queryAccessory'),

		/*核心企业查看票据*/
		CORE_BILL_PATH:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/CoreEnter/queryBill'),

		/*供应商列表查询*/
		SUPPLY_LIST_PATH:BTServerPath+ (_isTest?'/scf/testdata/supplierList.json':'/CoreEnter/querySupply'),

		/*额度申请以及查看模块*/
		CREDIT_PATH:BTServerPath+ (_isTest?'/scf/testdata/quotaInfo.json':'/ScfRequest/queryCredit'),

		/*获取额度申请列表*/
		CREDIT_LIST_PATH:BTServerPath+ (_isTest?'/scf/testdata/quotaList.json':'/ScfRequest/queryRequest'),

		/*获取额度申请详情*/
		CREDIT_DETAIL_PATH:BTServerPath+ (_isTest?'/scf/testdata/quotaDetail.json':'/ScfRequest/findRequestByBillId'),

		/*核心企业保理申请列表*/
		CORE_FAC_PATH:BTServerPath+ (_isTest?'/scf/testdata/facList.json':'/ScfRequest/queryRequest'),

		/*已完结状态业务列表*/
		CORE_COMPLETE_FAC_PATH:BTServerPath+ (_isTest?'/scf/testdata/facList.json':'/ScfRequest/queryCompleteRequest'),

		/*获取业务未确认列表*/
		UNCON_LIST_PATH:BTServerPath+ (_isTest?'/scf/testdata/coreFirm.json':'/CoreEnter/unConfirmList'),
		/*获取业务未确认列表*/
		CON_LIST_PATH:BTServerPath+ (_isTest?'/scf/testdata/coreFirm.json':'/CoreEnter/confirmList'),
		/*业务确认*/
		CONFIRM_PATH:BTServerPath+ (_isTest?'/scf/testdata/updateBill.json':'/ScfRequest/confirmRequest'),

		/*供应商合同相关*/
		//核心企业列表
		CORE_COMP_LIST:BTServerPath+ (_isTest?'/scf/testdata/coreCompList.json':'/CustAgree/queryCoreEnter'),
		//合同列表
		CONTR_LIST:BTServerPath+ (_isTest?'/scf/testdata/contractList.json':'/CustAgree/queryAgreement'),
		//增加合同
		ADD_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/addContra.json':'/CustAgree/addAgree'),
		//编辑合同
		UPDATE_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/updateContra.json':'/CustAgree/updateAgree'),
		//获取合同附件
		CONTRACT_PLUS_LIST:BTServerPath+ (_isTest?'/scf/testdata/contraPlusList.json':'/CustAgree/queryAgreeAccess'),
		//删除合同
		DEL_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/delContra.json':'/CustAgree/deleteAgree'),
		//启用合同
		USE_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/delContra.json':'/CustAgree/activeAgree'),
		//删除合同附件
		DEL_CONTRACT_PLUS:BTServerPath+ (_isTest?'/scf/testdata/delContra.json':'/CustAgree/delAgreeAttach'),
		

		/*供应商申请保理相关*/
		//获取票据详情
		BILL_DETAIL:BTServerPath+ (_isTest?'/scf/testdata/billDetail.json':'/ScfBill/queryBillDetail'),
		//获取发票信息
		INVO_LIST:BTServerPath+ (_isTest?'/scf/testdata/BillInvoList.json':'/ScfRequest/queryInvoice'),
		//确认申请
		ADD_FAC:BTServerPath+ (_isTest?'/scf/testdata/addContra.json':'/ScfRequest/addRequest'),

		/*应收管理 相关*/
		//添加发票
		ADD_INVOICE:BTServerPath+ (_isTest?'/scf/testdata/addInvoice.json':'/ScfInvoice/addInvoice'),
		//删除发票
		DEL_INVOICE:BTServerPath+ (_isTest?'/scf/testdata/delInvoice.json':'/ScfInvoice/deleteInvoice'),
		//获取可关联合同列表
		LINK_CONTRACT_LIST:BTServerPath+ (_isTest?'/scf/testdata/LinkContracs.json':'/ScfBill/queryAgreement'),
		//新增应收账款 
		ADD_ACCEPT_BILL:BTServerPath+ (_isTest?'/scf/testdata/updateBill.json':'/ScfBill/addAcceptBill'),
		//关联商业承兑汇票
		UPDATE_ACCEPT_BILL:BTServerPath+ (_isTest?'/scf/testdata/updateBill.json':'/ScfBill/updateAcceptBill'),
		//文件上传返回	/Account/fileUpload
		UPLOAD_BACK_INFO:BTServerPath+ (_isTest?'/scf/testdata/uploadR.html':'/CustFile/fileUpload'),
		UPLOAD_RE_INFO:BTServerPath+ (_isTest?'/scf/testdata/uploadR.html':'/CustFile/fileUpload'),
		//文件下载
		DOWNLOAD_FILE:BTServerPath+ (_isTest?'/scf/testdata/uploadR.html':'/CustFile/fileDownload'),

		/*还付款计划*/
		//还款计划列表
		REPAY_LIST:BTServerPath+ (_isTest?'/scf/testdata/repayList.json':'/CoreEnter/queryLedger'),

		//获取企业认证信息
		INIT_CERTIFICATE_INFO:BTServerPath+ (_isTest?'/scf/testdata/cmpCertFileList.json':'/CustAduit/queryAduitFile'),
		//提交企业认证信息
		SUBMIT_CERTIFICATE_INFO:BTServerPath+ (_isTest?'/scf/testdata/companyCert.json':'/CustAduit/addAduitFile'),

		/* 电子合同 */
		//电子合同列表
		ELEC_CONTR_LIST:BTServerPath+ (_isTest?'/scf/testdata/elecContractList.json':'/ElecAgree/queryElecAgree'),
		//获取静态页面内容
		GET_STATIC_PAGE:BTServerPath+ (_isTest?'/scf/testdata/getStaticPage.json':'/ElecAgree/getAgreePage'),
		//发送验证码
		GET_VALID_CODE:BTServerPath+ (_isTest?'/scf/testdata/getValidCode.json':'/ElecAgree/getValidCode'),
		//签署合同
		SEND_VALID_CODE:BTServerPath+ (_isTest?'/scf/testdata/sendValidCode.json':'/ElecAgree/sendValidCode'),

		/*核心企业电子合同*/
		CANCEL_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/addContra.json':'/ElecAgree/cancelElecAgreement'),
		//下载合同文件
		DOWNLOADCON:BTServerPath+ (_isTest?'/scf/testdata/addContra.json':'/ElecAgree/downloadAgreePDF')

	};

});