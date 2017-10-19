/*
公用路径配置模块
author binhg
*/
define(function(require,exports,module){
	var _isTest = location.href.indexOf('static') === -1?false:true;

	module.exports = window.BTPATH = {

		// 核心企业查询已经完成的申请
		QUERY_FINISHED_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryFinishReceivableRequestWithCore'),
		// 核心企业查询还可以继续申请的融资
		QUERY_CONTINUE_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryReceivableRequestWithCore'),
		// 企业合作银行下拉列表查询
		QUERY_BANK_LIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/CustRelation/queryBankKeyAndValue'),

		//2.3.1融资申请---------------
		//用户银行下拉
		QUERY_BANK_ACCOUNT_KEYANDVALUE:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/BankAccount/queryBankAccountKeyAndValue'),

		//银行帐号查询账户信息
		FIND_CUSTMECH_BANK_ACCOUNT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/BankAccount/findCustMechBankAccount'),

		//供应商查询已经完成的申请信息
		QUERY_RECEIVABLE_REQUEST_QUERYFINISHRECEIVABLEREQUESTWITHSUPPLIER:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryFinishReceivableRequestWithSupplier'),

		//供应商废止申请信息
		
		SAVE_RECEIVABLE_REQUEST_SAVEANNULRECEIVABLEREQUEST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/saveAnnulReceivableRequest'),
		//校验应付账款是否能够进行申请   
		CHECK_RECEIVABLE_REQUEST_CHECKvERIFYRECEIVABLE:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/checkVerifyReceivable'),

		//模式2

		//新增融资申请
		SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTTwo:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/saveAddRequestTwo'),

		//供应商查询申请
		QUERY_RECEIVABLE_REQUEST_queryREeceivableRequestTwoWithSupplier:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryReceivableRequestTwoWithSupplier'),
		
		QUERY_RECEIVABLE_REQUEST_queryTwoFInishedREeceivableRequestTwoWithSupplier:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryTwoFinishReceivableRequestWithSupplier'),
		QUERY_RECEIVABLE_REQUEST_queryTwoFinishReceivableRequestWithSupplier:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryTwoReceivableRequestWithCore'),
		
		QUERY_RECEIVABLE_REQUEST_queryTwoFinishReceivableRequestWithCore:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryTwoFinishReceivableRequestWithCore'),
		QUERY_RECEIVABLE_REQUEST_queryTwoReceivableRequestWithFactory:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryTwoReceivableRequestWithFactory'),
		QUERY_RECEIVABLE_REQUEST_queryTwoFinishReceivableRequestWithFactory:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryTwoFinishReceivableRequestWithFactory'),
		
		//模式整合融资申请
		SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTTOTAL:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/saveAddRequestTotal'),

		
		
		//融资申请
		QUERY_RECEIVABLE_REQUEST_FOUR:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryReceivableRequestFour'),
		//融资新增
		SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTFOUR:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/saveAddRequestFour'),
		//查询详情
		FIND_RECEIVABLE_REQUEST_FINDONEBYREQUESTFOUR:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/findOneByRequestNo'),
		//银行确认

		SAVE_RECEIVABLE_REQUEST_SAVECONFIRMRECEIVABLEREQUESTFOUR:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/saveConfirmReceivableRequestFour'),

		//供应商查询电子合同
		
		QUERY_RECEIVABLE_REQUEST_AGREEMENT_QUERYAGREEMENTWITHSUPPLIER:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequestAgreement/queryAgreementWithSupplier'),
		//银行拒绝
		
		SAVE_RECEIVABLE_REQUEST_SAVEREJECTRECEIVABLEREQUESTFOUR:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/saveRejectReceivableRequestFour'),

		//供应商查询融资申请
		QUERY_RECEIVABLE_REQUEST_QUERYRECEIVABLEREQUESTWITHSUPPLIER:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/ReceivableRequest/queryReceivableRequestWithSupplier'),
		//查询融资申请详情    findOneByRequestNo



		//资产登记检查查询
		FIND_ASSET_CHECK:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/AssetRegiester/findAssetCheck'),
		//查询-资产中登网登记
		FIND_ASSET_REGIESTER:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/AssetRegiester/findAssetRegiester'),
		//保存-资产中登网登记
		ADD_ASSET_REGIESTER:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/AssetRegiester/addAssetRegiester'),
		//保存-资产检查信息
		ADD_ASSET_CHECK:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/AssetRegiester/addAssetCheck'),
		
		//保存-融资临时表
		ADD_REQUEST_TEMP:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/RequestTemp/addRequestTemp'),
		//修改-融资暂存
		SAVE_MODIFY_REQUEST_TEMP:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/RequestTemp/saveModifyRequestTemp'),
		//作废融资申请
		
		SAVE_Annul_REQUEST_TEMP_CUST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/RequestTemp/saveAnnulRequestTemp'),
		//查询-融资暂存
		QUERY_REQUEST_TEMPLIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/RequestTemp/queryRequestTempList'),
		//保存-融资批复
		ADD_SCHEME:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/Request/addScheme'),
		
		
		//2.3.1融资申请---------------


		// 验签证书
		QUERY_ALL_CUST_LIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/Account/queryCustInfoByPlatformSelect'),

		// 查询
		QUERY_VERIFY_SIGN_CERT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/VerifySignCert/queryCertList'),
		// 添加
		SAVE_ADD_VERIFY_SIGN_CERT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/VerifySignCert/addCert'),
		// 修改
		SAVE_EDIT_VERIFY_SIGN_CERT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/VerifySignCert/editCert'),
		// 启用
		SAVE_ENABLE_VERIFY_SIGN_CERT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/VerifySignCert/enableCert'),
		// 禁用
		SAVE_DISABLE_VERIFY_SIGN_CERT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/VerifySignCert/disableCert'),
		// 详情
		FIND_VERIFY_SIGN_CERT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Platform/VerifySignCert/findCert'),


		// 创建日对账单
		SAVE_CPS_CREATE_PAY_RESULT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/createPayResult'),
		// 查询记录
		QUERY_CPS_UNCHECK_COMMISSION_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryUncheckCommissionRecord'),

		FIND_CPS_COUNT_COMMISSION_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/findCountCommissionRecord'),

		FIND_CPS_COUNT_PAY_RESULT_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/countPayResultRecord'),
		// 普通 日对账结果查询
		QUERY_CPS_NORMAL_PAY_RESULT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryNormalPayResultList'),
		// 已确认 日对账结果查询
		QUERY_CPS_CONFIRM_PAY_RESULT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryConfirmPayResultList'),
		// 已审核 日对账结果查询
		QUERY_CPS_AUDIT_PAY_RESULT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryAuditPayResultList'),
		// 日对账记录  所有数据查询
		QUERY_CPS_ALL_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryAllPayResultRecords'),
		// 日对账记录  未处理数据查询
		QUERY_CPS_UNCHECK_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryUncheckPayResultRecords'),
		// 日对账记录  支付成功查询
		QUERY_CPS_SUCCESS_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/querySuccessPayResultRecords'),
		// 日对账记录  支付失败查询
		QUERY_CPS_FAILURE_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/queryFailurePayResultRecords'),
		// 日对账记录  批量支付成功
		SAVE_CPS_CONFIRM_SUCCESS_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/confirmSuccessPayResultRecords'),
		// 日对账记录  批量支付失败
		SAVE_CPS_CONFIRM_FAILURE_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/confirmFailurePayResultRecords'),
		// 日对账记录  支付成功转支付失败
		SAVE_CPS_SUCCESS_TO_FAILURE_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/successToFailurePayResultRecord'),
		// 日对账记录  支付失败转支付成功
		SAVE_CPS_FAILURE_TO_SUCCESS_PAY_RESULT_RECORDS:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/failureToSuccessPayResultRecord'),
		// 确认日对账结果
		SAVE_CPS_CONFIRM_PAY_RESULT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/confirmPayResult'),
		// 审核日对账结果
		SAVE_CPS_AUDIT_PAY_RESULT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/auditPayResult'),
		// 查询详情
		FIND_CPS_COMMISSION_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionPayResult/findCommissionRecord'),


		// 佣金参数设置
		QUERY_CPS_CONFIG_INFO:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionConfig/queryConfig'),
		SAVE_CPS_CONFIG_INFO:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionConfig/saveConfig'),

		// 日账单请求
		QUERY_QH_CHECK_DAY_List:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionDailyStatement/queryDailyStatement'),
		QUERY_QH_CHECK_DAY_Detail:BTServerPath+ (_isTest?'/scf2/testdata/checkDayDetail.json':'/Scf/CommissionDailyStatement/findDailyStatementById'),
		QUERY_QH_CHECK_DAY_Detail_List:BTServerPath+ (_isTest?'/scf2/testdata/checkDayList.json':'/Scf/CommissionDailyStatement/queryDailyStatementRecordByDailyId'),
		FIND_PAY_RESULT_COUNT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/findPayResultCount'),
		QUERY_PAY_RESULT_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/queryPayResultRecord'),
		FIND_PAY_RESULT_INFO:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/findPayResultInfo'),
		ADD_DAILY_STATEMENT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/addDailyStatement'),
		UPDATE_DAILY_STATEMENT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/updateDailyStatement'),
		DEL_DAILY_STATEMENT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/delDailyStatement'),
		

		// 月账单请求
		QUERY_MONTHLY_STATEMENT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionMonthlyStatement/queryMonthlyStatement'),
		FIND_MONTHLY_STATEMENT_ID:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionMonthlyStatement/findMonthlyStatementById'),
		UPDATE_MONTHLY_STATEMENT_ID:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionMonthlyStatement/saveMonthlyStatement'),
		DEL_MONTHLY_STATEMENT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionMonthlyStatement/delMonthlyStatement'),
		FIND_DAILY_STATEMENT_COUNT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/findDailyStatementCount'),
		FIND_DAILY_STATEMENT_INFO_BY_MONTH:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/findDailyStatementInfoByMonth'),
		FIND_DAILY_STATEMENT_BASIC_INFO:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionDailyStatement/findDailyStatementBasicsInfo'),
		SAVE_MONTHLY_STATEMENT:BTServerPath+ (_isTest?'/scf2/testdata/checkDayAdd.json':'/Scf/CommissionMonthlyStatement/saveComissionMonthlyStatement'),
		
		/* 电子合同 */

		// 合同服务帐号
		// 检查企业注册情况
		CHECK_CORP_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractCorpAccount/checkCorpAccount'),
		// 获取企业信息
		FIND_CORP_INFO_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractCorpAccount/findCorpInfo'),
		// 查询企业电子合同帐号信息
		QUERY_CORP_CONTRACT_ACCOUNT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractCorpAccount/queryCorpAccountInfo'),
		// 保存企业签署人
		SAVE_CORP_SIGNER_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractCorpAccount/saveCorpSigner'),
		// 注册
		SAVE_REGIST_CORP_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractCorpAccount/saveRegistCorpAccount'),


		// 检查签署人注册情况
		CHECK_SIGNER_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractSignerAccount/checkSignerAccount'),
		// 获取操作员信息
		FIND_OPER_INFO_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractSignerAccount/findOperInfo'),
		// 整个机构的帐号
		QUERY_SIGNER_CONTRACT_ACCOUNT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractSignerAccount/querySignerAccountInfo'),
		// 注册
		SAVE_REGIST_SIGNER_CONTRACT_ACCOUNT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractSignerAccount/saveRegistSignerAccount'),


		// 电子合同印章
		QUERY_CONTRACT_STAMPER_OWN_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/queryOwnStamper'),
		// 查询所有(平台)
		QUERY_CONTRACT_STAMPER_ALL_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/queryAllStamper'),
		// 检查印章
		FIND_CONTRACT_STAMPER_CHECK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/findCheckStamper'),
		// 印章详情
		FIND_CONTRACT_STAMPER_DETAIL:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/findStamper'),
		// 添加印章(自行)
		SAVE_ADD_OWN_CONTRACT_STAMPER:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/saveAddOwnStamper'),
		// 添加印章(平台)
		SAVE_ADD_CONTRACT_STAMPER:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/saveAddStamper'),
		// 制作印章(平台)
		SAVE_MAKE_CONTRACT_STAMPER:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStamper/saveMakeStamper'),


		// 标准合同类型 保理公司
		QUERY_TEMPLATE_STANDARD_TYPE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryStandardType'),
		// 未启用标准合同
		QUERY_TEMPLATE_UNUSED_STANDARD_TYPE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryUnusedStandardType'),
		// 启用标准合同
		SAVE_ENABLE_STANDARD_TYPE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveEnableStandardType'),
		// 移除未使用的标准合同
		SAVE_REMOVE_STANDARD_TYPE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveRemoveStandardType'),

		// 查询未使用合同模板列表
		QUERY_TEMPLATE_UNUSED_CONTRACT_TEMPLATE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryUnusedContractTemplate'),

		// 查询合同文本列表
		QUERY_CONTRACT_TEXT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryText'),
		// 平台审核查询合同文本列表
		QUERY_CONTRACT_AUDIT_TEXT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryAuditText'),

		// 未使用标准合同文本
		QUERY_CONTRACT_UNUSED_TEXT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryUnusedText'),

		// 平台查询合同模板列表
		QUERY_CONTRACT_TEMPLATE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryTemplate'),
		// 公司查询合同模板列表
		QUERY_CONTRACT_TEMPLATE_AUDIT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryAuditTemplate'),

		// 标准合同日志 查询 
		QUERY_CONTRACT_TEMPLATE_LOG_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/queryTemplateLog'),

		// 上传合同文本
		SAVE_UPLOAD_CONTRACT_TEXT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveUploadText'),

		// 审核标准合同文本
		SAVE_AUDIT_CONTRACT_TEXT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveAuditText'),

		// 审核标准合同模板
		SAVE_AUDIT_CONTRACT_TEMPLATE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveAuditTemplate'),

		// 上传合同模板
		SAVE_UPLOAD_CONTRACT_TEMPLATE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveUploadTemplate'),

		// 保存合同签署位置
		SAVE_STAMP_PLACE_CONTRACT_TEMPLATE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/saveStampPlace'),

		// 查询标准合同详情
		FIND_CONTRACT_TEMPLATE_DETAIL:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractTemplate/findTemplateDetail'),

		// 合同类型查询
		QUERY_CONTRACT_TYPE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Agreement/findEnableAgreementType'),
		// 合同类型查询
		QUERY_CONTRACT_TYPE_SIMPLE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractType/querySimpleList'),

		// 标准合同类型查询
		QUERY_CONTRACT_STANDARD_TYPE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStandardType/queryList'),
		// 标准合同类型查询
		QUERY_CONTRACT_STANDARD_TYPE_SIMPLE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStandardType/querySimpleList'),

		// 业务类型
		QUERY_BUSINESS_TYPE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/BusinessType/queryList'),
		QUERY_BUSINESS_TYPE_SIMPLE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/BusinessType/querySimpleList'),


		/* 产品配置 */
		// 添加产品
		ADD_PRODUCT_CONFIG:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/addProductConfig'),
		// 修改产品
		SAVE_MODIFY_PRODUCT_CONFIG:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/saveModifyProductConfig'),
		// 分页查询产品列表
		QUERY_PRODUCT_CONFIG:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/ProductConfig/queryProductConfig'),
		// 根据产品编号查询产品信息
		FIND_PRODUCT_CONFIG:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/findProductConfig'),
		// 删除产品
		DEL_PRODUCT_CONFIG:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/delProductConfig'),
		// 产品下拉框
		FIND_PRODUCT_DICT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/queryProductKeyAndValue'),
		
		
		// 查询资产类型与附件关系列表
		FIND_ASSETDICT_ATTACHRELATION_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/findAssetDictAttachRelationList'),
		// 保存产品资产类型关联的附件类型关系
		ADD_ASSETDICT_ATTACH_RELATION:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/addAssetDictAttachRelation'),
		
		//保存资产清单
		ADD_PRODUCT_ASSETDICT_RELATION:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/addProductAssetDictRelation'),
	    // 查询所有的资产类型列表
		FIND_ALL_ASSETDICT:BTServerPath+ (_isTest?'/scf/testdata/financeList.json':'/Scf/ProductConfig/findAssetDict'),
		// 分页查询所有的资产清单列表
		QUERY_ALL_ASSETDICT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/queryAssetDict'),
		// 根据产品查询资产清单列表
		FIND_ASSETDICT_BYPRODUCT:BTServerPath+ (_isTest?'/scf/testdata/checkedAssetDictList.json':'/Scf/ProductConfig/findAssetDictByProduct'),

		// 保存产品与核心企业关系
		ADD_PRODUCT_CORE_RELATION:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/addProductCoreRelation'),
		// 分页查询产品关联的核心企业列表
		QUERY_CORE_BYPRODUCT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/queryCoreByProduct'),
		// 查询产品关联的核心企业列表
		FIND_CORE_BYPRODUCT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/ProductConfig/findCoreByProductList'),
		
		/*2.3.1 资产相关路径*/
		// 查询指定的业务类型列表
		QUERY_ALL_BUSIN_TYPE_SUPPLER:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/BusinType/queryEffectiveBusinType'),
		//查询能够用来融资或者询价的基础资产列表
		QUERY_CAN_USE_BASE_DATA_CORE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Asset/queryCanUseBaseData'),
		//查询资产详情   findAssetById
		QUERY_Asset_DETAIL_BYASSETID_CUST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Asset/findAssetById'),


		/*佣金文件*/
		//佣金文件查询
		QUERY_COMMISSION_FILE_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfile/queryFileList'),		
		//佣金文件解析
		QUERY_COMMISSION_FILE_RESOLVE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfile/saveResolveFile'),	
		//佣金文件删除
		QUERY_COMMISSION_FILE_DELETE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfile/saveDeleteFile'),
		//佣金记录审核界面数据查询
		QUERY_COMMISSION_RECORD_AUDIT_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionrecord/queryRecordList'),	
		//佣金记录审核全部
		SAVE_AUDIT_COMMISSION_RECORD_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionrecord/saveAuditRecordList'),
		//佣金记录查询
		QUERY_COMMISSION_RECORD_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionrecord/queryRecordList'),
		//佣金记录查询
		QUERY_COMMISSION_FILE_DOWN_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfiledown/queryFileList'),
		//佣金文件作废
		SAVE_COMMISSION_FILE_ANNUL_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfile/saveCannulFile'),
		//通过导出文件id查询当前文件下面的所有佣金记录分页信息
		QUERY_COMMISSION_FILE_DOWN_LIST_FILE_ID_OPER:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfiledown/queryFileRecordByFileId'),
		//    查询佣金数据审核文件集合       
		QUERY_COMMISSION_FILE_DOWN_CANAUDIT_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfiledown/queryCanAuditFileList'),
		// 审核导出文件通过导出文件id   
		SAVE_AUDIT_FILE_DOWN_ID_OPER:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Commissionfiledown/saveAuditFileDownById'),

		/*投递对账单*/
		//查询对账单列表
		QUERY_DELIVERY_RECORD_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/queryDeliveryRecordList'),
		//查询可用的月账单列表   
		QUERY_DELIVERY_MONTHLY_STATEMENT_AUDITED_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/queryMonthlyRecordList'),
		//对账单新增记录
		SAVE_DELIVERY_RECORD:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/saveAddDeliveryRecord'),
		//对账单移除月账单
		SAVE_DELIVERY_RECORD_REMOVE_MONTHLY_STATEMENT:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/saveDeleteStatement'),
		//对账单投递
		SAVE_EXPRESS_DELIVERY_RECORD:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/saveExpressDelivery'),
		//对账单删除
		SAVE_DELETE_DELIVERY_RECORD:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/saveDeleteRecord'),
		//对账单确认
		SAVE_CONFIRM_DELIVERY_RECORD_INFO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Delivery/saveConfirmDelivery'),
		//对账单详情对账查询
		QUERY_DELIVERY_RECORD_STATEMENT_LIST_INFO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/DeliveryStatement/queryDeliveryStatementList'),

		/*发票抬头*/
		//查询单个企业的发票抬头
		FIND_COMMISSION_CUSTINFO_EFFECTIVE_BY_CUSTNO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/findEffectiveByCustNo'),
		//企业发票抬头修改
		UPDATE_COMMISSION_CUSTINFO_SAVE_UPDATE_INVOICE_CUSTINFO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/saveUpdateInvoiceCustInfo'),
		//企业发票抬头新增
		SAVE_COMMISSION_CUSTINFO_ADD_INVOICE_CUSTINFO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/saveAddInvoiceCustInfo'),


		/*佣金发票*/
		//查询佣金发票列表
		QUERY_COMMISSION_INVOICE_INVOICELIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/queryCommissionInvoice'),
		//查询可用的月账单列表
		QUERY_COMMISSION_INVOICE_CANUSE_MONTHLYLIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/queryCanUseMonthly'),
		//保存索取发票
		SAVE_COMMISSION_INVOICE_DEMANDINVOICE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/saveDemandInvoice'),
		//查找发票信息
		FIND_COMMISSION_INVOICE_FINDINVOICE_ID:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/findCommissionInvoiceById'),
		//使发票变成待开的发票
		FIND_COMMISSION_INVOICE_SAVEiNVOICE_EFFECTIVE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/saveInvoiceEffective'),
		//将待开发票作废
		SAVE_COMMISSION_INVOICE_SAVEANNULINVOICE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/saveAnnulInvoice'),
		//使发票变成开票中的发票
		SAVE_COMMISSION_INVOICE_SAVECONFIRMINVOICE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/saveConfirmInvoice'),
		//使发票变成已开票状态
		SAVE_COMMISSION_INVOICE_SAVEAUDITINVOICE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoice/saveAuditInvoice'),

		/*佣金发票参数*/
		//查询佣金发票参数/Scf/CommissionParam/queryParamList
		QUERY_COMMISSION_PARAM_INVOICEPARAM_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionParam/queryParamList'),
		//佣金发票参数新增
		SAVE_COMMISSION_PARAM_SAVEADD_PARAM:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionParam/saveAddParam'),
		//佣金发票修改
		SAVE_COMMISSION_PARAM_SAVEUPDATE_PARAM:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionParam/saveUpdateParam'),
		//佣金发票删除  
		SAVE_COMMISSION_PARAM_SAVEDELETE_PARAMBYID:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionParam/saveDeleteParamById'),

		/*发票抬头*/
		//发票抬头查询
		QUERY_COMMISSION_CUSTINFO_QUERYINVOICECUSTLIST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/queryInvoiceCustInfoList'),
		//发票抬头新增
		SAVE_COMMISSION_CUSTINFO_SAVEADDINVOICECUSTINFO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/saveAddInvoiceCustInfo'),
		//发票抬头修改
		SAVE_COMMISSION_CUSTINFO_SAVEUPDATEINVOICECUSTINFO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/saveUpdateInvoiceCustInfo'),
		//发票抬头查询
		FIND_COMMISSION_CUSTINFO_FINDEFFECTIVEBYCUSTNO:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/findEffectiveByCustNo'),
		//发票抬头删除
		
		SAVE_COMMISSION_CUSTINFO_SAVEDELETECUSTINFOBYID:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/CommissionInvoiceCustInfo/saveDeleteCustInfoById'),


		/* 订单*/
		//核心企业订单查询未生效
		QUERY_INEFFECTIVE_ORDER_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/queryIneffectiveOrder'),
		//核心企业订单修改
		SAVE_EDIT_ORDER_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/modifyOrderDO'),
		//核心企业订单废止
		SAVE_DELETE_ANNUL_ORDER_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/saveAnnulOrder'),
		//核心企业订单新增
		SAVE_ADD_ORDER_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/addOrderDO'),
		//核心企业订单解析
		SAVE_RESOLVE_ORDER_FILE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Platform/CustFile/saveResolveFile'),
		//核心企业订单解析同步
		SAVE_RESOLVE_ORDER_FILE_CORE_V2:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/saveResolveFile'),
		//核心企业查询解析文件
		FIND_RESOLVE_FILE_BY_ID_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Platform/CustFile/findResolveFileById'),
		//核心企业查询订单详情
		QUERY_EXPORT_ORDER_RECORD:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/queryExportOrderRecord'),
		//核心企业审核订单
		SAVE_AUDIT_ORDER_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/saveAuditOrder'),
		//核心企业订单管理/Scf/Order/queryEffectiveOrder
		QUERY_EFFECTIVE_ORDER_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/queryEffectiveOrder'),
		//订单批量导入分页查询  queryExportOrderRecord
		QUERY_EXPORT_ORDER_LIST_CORE_FILEID:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/queryExportOrderRecord'),
		//核心企业订单批量审核saveAuditOrders
		SAVE_AUDIT_ORDERS_LIST_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Order/saveAuditOrders'),


		/* 发票*/
		//供应商发票查询未生效
		QUERY_INEFFECTIVE_INVOICE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/queryIneffectiveInvoice'),
		//供应商发票新增
		SAVE_ADD_INVOICE_RECORD_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/addInvoiceDO'),
		//供应商发票编辑   /Scf/Invoice/modifyInvoiceDO
		SAVE_MODIFY_INVOICE_RECORD_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/modifyInvoiceDO'),
		//供应商发票作废   /Scf/Invoice/saveAnnulInvoice 
		SAVE_ANNUL_INVOICE_RECORD_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/saveAnnulInvoice'),
		//供应商发票审核    /Scf/Invoice/saveAuditInvoice
		SAVE_AUDIT_INVOICE_RECORD_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/saveAuditInvoice'),
		//供应商查询发票回收
		QUERY_RECYCLE_INVOICE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/queryRecycleInvoiceDO'),
		//供应商发票回收
		SAVE_RECYCLE_INVOICE_CUST:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/saveAnnulEffectiveInvoice'),
		//供应商发票管理查询
		QUERY_EFFECTIVE_INVOICE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Invoice/queryEffectiveInvoice'),

		/* 应收应付账款 */
		//核心企业应收应付账款查询未生效
		QUERY_INEFFECTIVE_RECEIVABLE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Receivable/queryIneffectiveReceivable'),
		//核心企业应收应付账修改
		SAVE_MODIFY_RECEIVABLE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Receivable/saveModifyReceivableDO'),
		//核心企业应收应付账废止
		SAVE_DELETE_ANNUL_RECEIVABLE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Receivable/saveAnnulReceivable'),
		//核心企业应收应付账新增
		SAVE_ADD_RECEIVABLE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Receivable/saveAddReceivableDO'),
		//核心企业应收账款核准
		SAVE_AUDIT_RECEIVABLE_RECORD_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Receivable/saveAuditReceivable'),
		//核心企业应收账款管理查询
		QUERY_EFFECTIVE_RECEIVABLE_CORE:BTServerPath+ (_isTest?'/scf/testdata/queryCustlist.json':'/Scf/Receivable/queryEffectiveReceivable'),

		/* 流程任务 */
		// 启动流程
		START_WORKFLOW_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/startWorkFlow'),
		// 查询当前任务
		QUERY_WORKFLOW_CURRENT_TASK:BTServerPath+ (_isTest?'/scf2/testdata/queryCurrentTask.json':'/WorkFlow/queryCurrentTask'),
		// 查询历史任务
		QUERY_WORKFLOW_HISTORY_TASK:BTServerPath+ (_isTest?'/scf2/testdata/queryCurrentTask.json':'/WorkFlow/queryHistoryTask'),
		// 查询监控任务
		QUERY_WORKFLOW_MONITOR_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/queryMonitorTask'),
		// 审批通过
		PASS_WORKFLOW_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/passWorkFlow'),
		// 审批驳回
		REJECT_WORKFLOW_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/rejectWorkFlow'),
		// 经办节点
		HANDLE_WORKFLOW_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/handleWorkFlow'),
		// 作废流程
		CANCEL_WORKFLOW_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/cancelWorkFlow'),
		// 保存流程数据
		SAVE_WORKFLOW_TASK:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/saveWorkFlow'),
		// 查询审批记录列表
		QUERY_WORKFLOW_AUDIT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/queryAuditRecord'),
		// 查询待驳回列表
		QUERY_WORKFLOW_REJECT_NODE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/queryRejectNode'),
		// 流程图
		FIND_WEB_FLOW_JSON:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/webFindFlowJson'),
		// 分配操作员
		ASSIGN_WORKFLOW_OPERATOR:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/webChangeApprover'),

		/*流程定义*/
		// 查询基础流程
		QUERY_DEFAULT_WORKFLOW_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryDefaultWorkFlow'),
		// 查询当前公司的流程定义
		QUERY_WORKFLOW_BASE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryWorkFlowBase'),
		// 查询历史版本
		QUERY_HISTORY_WORKFLOW_BASE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryHistoryWorkFlowBase'),
		// 禁用流程
		DISABLE_WORKFLOW_BASE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveDisableWorkFlow'),
		// 启用流程
		ENABLE_WORKFLOW_BASE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveEnableWorkFlow'),
		// 发布流程
		PUBLISH_WORKFLOW_BASE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/savePublishWorkFlow'),
		// 添加流程
		ADD_WORKFLOW_BASE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/addWorkFlowBase'),
		// 添加新版本
		ADD_NEWVERSION_WORKFLOW_BASE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/addNewVersionWorkFlowBase'),
		// 修改流程
		EDIT_WORKFLOW_BASE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveWorkFlowBase'),

		// 查询流程节点
		QUERY_WORKFLOW_NODE_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryWorkFlowNode'),

		// 查询金额段定义
		QUERY_WORKFLOW_MONEYSECTION:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryWorkFlowMoneySection'),
		// 保存金额段定义
		SAVE_WORKFLOW_MONEYSECTION:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveWorkFlowMoneySection'),

		// 禁用流程节点
		DISABLE_WORKFLOW_NODE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveDisableWorkFlowNode'),
		// 启用流程节点
		ENABLE_WORKFLOW_NODE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveEnableWorkFlowNode'),

		// 分配经办人
		ASSIGNEE_WORKFLOW_NODE_OPER:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/assigneeWorkFlowNodeOper'),

		// 查询流程步骤
		QUERY_WORKFLOW_STEP_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryWorkFlowStep'),
		// 添加流程步骤
		ADD_WORKFLOW_STEP:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/addWorkFlowStep'),
		// 删除流程步骤
		DEL_WORKFLOW_STEP:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/delWorkFlowStep'),
		// 上移流程步骤  moveUpWorkFlowStep
		MOVE_UP_WORKFLOW_STEP:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/moveUpWorkFlowStep'),
		// 下移流程步骤  moveDownWorkFlowStep
		MOVE_DOWN_WORKFLOW_STEP:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/moveDownWorkFlowStep'),

		// 查询金额段列表
		QUERY_WORKFLOW_MONEYSECTION_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/queryWorkFlowMoney'),

		// 查询步骤定义
		FIND_WORKFLOW_STEP_DEFINE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/findWorkFlowStepDefine'),
		// 保存步骤定义
		SAVE_WORKFLOW_STEP_DEFINE:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/WorkFlow/Definition/saveWorkFlowStepDefine'),



		// 根据公司查询操作员
		QUERY_OPERATOR_BY_CUSTNO:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/CustOperator/queryOperatorByCustNo'),

		//2.3.0
		//新增应付账款
		QUERY_ACCOUNT_ADD_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Receivable/saveAddReceivableDO'),
		//编辑应付账款
		SAVE_ACCOUNT_EDIT_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'Scf/Receivable/saveModifyReceivableDO'),


		//票据列表查询
		QUERY_BILL_LIST:BTServerPath+ (_isTest?'/scf2/testdata/billlist.json':'/Scf/AcceptBill/queryIneffectiveBill'),
		//票据修改
		EDIT_BILL_DETAIL: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/AcceptBill/modifyAcceptBillDO'),
		//供应商上传票据附件  modifyAcceptBillFile
		SAVE_MODIFY_ACCEPT_BILL_FILE_UPLOAD_CUST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/AcceptBill/modifyAcceptBillFile'),

		//查询票据询价列表
		QUERY_BILL_ENQUIRY_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Enquiry/querySingleOrderEnquiryList'),
		//根据票据查询该票有哪些公司报了价
		QUERY_OFFER_BY_BILL:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Enquiry/queryOfferByBill'),
		//根据询价编号无分页查询报了价列表
		FIND_OFFER_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/Enquiry/findOfferList'),
		//根据询价编号无分页查询报了价列表
		QUERY_BILL_REQUEST_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/BillRequest/queryBillRequestList'),
		//保存票据融资申请
		ADD_BILL_REQUEST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Scf/BillRequest/addBillRequest'),
		//查询报价列表
		QUERY_OFFER_BY_ENQUIRY_OBJECT:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Wechat/Scf/Enquiry/queryOfferByEnquiryObject'),

		//文件上传
		UPLOAD_BACK_INFO:BTServerPath+ (_isTest?'/scf2/testdata/uploadR.html':'/Platform/CustFile/fileUpload'),
		//根据文件类别查询 允许文件格式
		FIND_FILE_TYPE_LIMIT:BTServerPath+ (_isTest?'/scf2/testdata/uploadR.html':'/Platform/CustFile/findFileTypePermitInfo'),
		//文件下载
		DOWNLOAD_BACK_INFO:BTServerPath+ (_isTest?'/scf2/testdata/uploadR.html':'/Platform/CustFile/fileDownload'),
		//附件列表
		QUERY_ATTACHMENT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/attachmentList.json':'/Platform/CustFile/fileListByBatchNo'),
		//检查机构类型  SELLER_USER | FACTOR_USER | CORE_USER | SUPPLIER_USER | PLATFORM_USER
		CHECK_ORG_TYPE:BTServerPath+ (_isTest?'/scf2/testdata/checkOrgType.json':'/Platform/BaseInfo/checkOrgType'),


		/*公用基础接口*/
		//查询融资产品列表
		QUERY_DIC_PRODUCTLIST:BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Product/queryProductKeyAndValue'),
		//查询融资产品BY核心企业
		QUERY_PRODUCT_BYCORE:BTServerPath+(_isTest?'/scf2/testdata/custList.json':'/Scf/Product/queryProductByCore'),
		//查询保理商 适用于供应商/经销商/核心企业相关查询
		QUERY_DIC_FACCOMLIST:BTServerPath+ (_isTest?'/scf2/testdata/factorCompList.json':'/Platform/CustRelation/queryFactorKeyAndValue'),
		//查询增开机构列表
		QUERY_DIC_ADDACCCOUNTCOMLIST:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Platform/BaseInfo/queryCustSelect'),
		//查询供应商(核心企业)
		QUERY_DIC_SUPPLIERLIST:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Platform/CustRelation/querySupplierByCore'),
		//查询经销商(核心企业)
		QUERY_DIC_AGENCYLIST:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist1.json':'/Platform/CustRelation/querySellerByCore'),
		//查询核心企业 适用于供应商/经销商相关查询
		QUERY_DIC_CORECUSTLIST:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryCoreKeyAndValue'),
		//获取机构开通保理状态
		QUERY_DIC_FACTORSTATUS:BTServerPath+ (_isTest?'/scf2/testdata/factorStatus.json':'/Platform/CustRelation/findStatus'),
		//查询核心企业 适用于保理公司相关查询
		QUERY_DIC_FACOTRCORERELATION:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryFacotrCoreRelation'),
		//查询客户所有关联的客户信息
		QUERY_CUST_RELATION:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryCustRelation'),
		//查询核心企业所有关联的客户信息
		QUERY_CORECUST_RELATION:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryCoreCust'),
		//保理机构关系客户查询，适用于授信录入时的客户下拉列表：
		QUERY_FACTOR_CUST_RELATION:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryFactorCustRelation'),
		//查询保理机构所有关系客户
		QUERY_FACTOR_ALL_CUST:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryFactorAllCust'),
		//查询保理公司关联的核心企业
		QUERY_FACTOR_CORELIST:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Platform/CustRelation/queryFacotrCoreRelation'),
		//根据核心企业查询机构信息列表（供应商|经销商）
		QUERY_CUSTLIST_BY_CORE:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Platform/CustRelation/querySimpleDataByFactorAndCore'),
		//查询保理公司
		FIND_CUST_BY_PLATFORM:BTServerPath+ (_isTest?'/scf2/testdata/factorCompList.json':'/Platform/CustRelationConfig/findCustByPlatform'),
		//查询供应商经销商客户信息
		QUERY_ALLCUST_RELATION:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustRelation/queryAllCust'),

		//核心企业融资申请
		//供应商利率
		QUERY_SUPPLIER_OFFER_QUERYOFFERLIST:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Scf/SupplierOffer/queryOfferList'),
		//核心企业更新供应商利率   
		SAVE_SUPPLIER_OFFER_SAVEUPDATEOFFER:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Scf/SupplierOffer/saveUpdateOffer'),
		//核心企业查询所有已经新增了供应商的列表
		SAVE_SUPPLIER_OFFER_QUERYALLCUST:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Scf/SupplierOffer/queryAllCust'),
		//核心企业新增供应商利率
		SAVE_SUPPLIER_OFFER_SAVEADDOFFER:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Scf/SupplierOffer/saveAddOffer'),
		///核心企业查询供应商利率
		FIND_SUPPLIER_OFFER_FINDOFFER:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Scf/SupplierOffer/findOffer'),

		//电子合同管理
		//核心企业查询电子合同信息
		QUERY_AGREEMENT_QUERYAGREEMENTWITHCORE:BTServerPath+ (_isTest?'/scf2/testdata/addAccountComlist.json':'/Scf/ReceivableRequestAgreement/queryAgreementWithCore'),
		





		/*合同模板管理*/
		//查询模板
		QUERY_TEMPLATE:BTServerPath+ (_isTest?'/scf2/testdata/factorCompList.json':'/Scf/Template/queryTemplate'),
		//保存模板
		ADD_TEMPLATE:BTServerPath+ (_isTest?'/scf2/testdata/factorCompList.json':'/Scf/Template/saveTemplate'),
		//编辑模板
		SAVE_MODIFY_TEMPLATE:BTServerPath+ (_isTest?'/scf2/testdata/factorCompList.json':'/Scf/Template/saveModifyTemplate'),


		//根据用户类型查询source
        // QUERY_ACCUNTIN_BY_NAME:BTServerPath+ (_isTest?'/scf2/testdata/aaccuntive.json':''),

		/*微信相关*/
		// 获取QRCODE
		GET_WECHAT_SIGN:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Wechat/createQcode'),
		// 检查是否已扫描
		CHECK_IS_CAN_SCAN:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Wechat/checkScanStatus'),
		// 设置交易密码
		SAVE_MOBILE_TRADE_PWD:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Wechat/saveMobileTradePass'),
		// 检查当前操作员是否已经绑定了微信号
		CHECK_IS_BIND_WECHAT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Wechat/checkBindStatus'),

		/*重置交易密码*/
		// 发送验证码
		SEND_VERIFY_CODE_TRADE_PASS:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/TradePass/sendVerifyCode'),
		// 验证验证码
		CHECK_VERIFY_CODE_TRADE_PASS:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/TradePass/checkVerifyCode'),
		// 修改交易密码
		SAVE_MODIFY_TRADE_PWD:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/TradePass/saveModifyTradePass'),

		/*数字证书相关接口*/
		//查询数字证书列表
		QUERY_X509_CERTLIST:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/queryCertificateInfo'),
		// 查询签发者列表
		QUERY_X509_SIGNERLIST:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/querySignerList'),
		// 添加一个证书
		ADD_ONE_X509_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/addCertificateInfo'),
		// 修改一个证书
		EDIT_ONE_X509_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/modifyCertificateInfo'),
		// 作废一个证书
		CANCEL_ONE_X509_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/cancelCertificateInfo'),
		// 查询未使用的数字证书 simpleentity
		QUERY_X509_CERT_UNUSEDLIST:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/queryUnusedCertificateInfo'),
		// 查询证书详情
		QUERY_ONE_X509_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/Certificate/findCertificateInfoById'),

		// 查询客户证书列表
		QUERY_CUST_CERTLIST:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/queryCertificateInfo'),
		// 添加一个客户证书
		ADD_ONE_CUST_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/addCertificateInfo'),
		// 修改一个客户证书
		EDIT_ONE_CUST_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/modifyCertificateInfo'),
		// 修改一个客户证书
		EDIT_ONE_WECHAT_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/modifyWechatCertificateInfo'),
		// 作废一个客户证书
		CANCEL_ONE_CUST_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/cancelCertificateInfo'),
		// 回收一个客户证书
		REVOKE_ONE_CUST_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/revokeCertificateInfo'),
		// 发布一个客户证书
		PUBLISH_ONE_CUST_CERT:BTServerPath+ (_isTest?'/scf2/testdata/coreCustList.json':'/Platform/CustCertificate/publishCertificateInfo'),


		/*开户相关接口*/
		//已开户保理
		QUERY_OPENED_FACTOR:BTServerPath+ (_isTest?'/scf2/testdata/queryFactorRelation.json':'/Platform/CustRelation/queryFactorRelation'),
		//已开户电子合同机构
		QUERY_OPENED_CONTRACTCOM:BTServerPath+ (_isTest?'/scf2/testdata/queryProviderRelation.json':'/Platform/CustRelation/queryProviderRelation'),
		//查看开户所需资料列表
		SALE_AGENCY_INFO_PATH:BTServerPath+ (_isTest?'/p/testdata/AAquerySaleAgencyInfoWithFile.json':'/SaleQuery/querySaleAgencyInfoWithFile'),
		//保理开户业务审批流程
		QUERY_SCFOPENED_CHECKLIST:BTServerPath+ (_isTest?'/scf2/testdata/queryAuditWorkflow.json':'/Platform/CustRelation/queryAuditWorkflow'),
		//保理融资开户相关
		OPENED_SCF_ACCOUNT:BTServerPath+ (_isTest?'/scf2/testdata/saveRelation.json':'/Platform/CustRelation/saveRelation'),
		//流程图查看
		QUERY_FLOW_IMAGE:BTServerPath+ (_isTest?'/scf2/testdata/saveRelation.json':'/Platform/workflow/displayDiagram'),

		/*黑名单相关*/
		//黑名单查询
		QUERY_ALL_BLACKLIST	: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Platform/Blacklist/queryBlacklist'),
		//黑名单录入
		ADD_ONE_BLACKLIST	: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Blacklist/addBlacklist'),
		//删除黑名单
		DEL_ONE_BLACKLIST	: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Blacklist/deleteBlacklist'),
		//黑名单修改
		EDIT_ONE_BLACKLIST	: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Blacklist/modifyBlacklist'),
		//黑名单激活
		ACTIVE_ONE_BLACKLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Blacklist/activateBlacklist'),
		//黑名单注销
		CANCEL_ONE_BLACKLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Blacklist/cancelBlacklist'),
		//检查是否存在黑名单
		CHECK_BLACK_LIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Blacklist/checkBlacklist'),




		/*保理授信相关*/
		//授信列表查询
		QUERY_ALL_QUOTALIST: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Credit/queryFactorCredit'),
		//授信信息录入
		ADD_ONE_QUOTALIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Credit/addCredit'),
		//授信信息编辑
		EDIT_ONE_QUOTALIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Credit/modifyCredit'),
		//授信信息激活
		ACTIVE_ONE_QUOTALIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Credit/activateCredit'),
		//授信信息终止
		CANCEL_ONE_QUOTALIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Credit/terminatCredit'),

		/*授信额度相关*/
		//查询授信变动
		QUERY_ALL_QUOTA_CHANGE_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryCreditDetail.json':'/Scf/Credit/queryCreditDetail'),
		//查询企业额度
		QUERY_COMP_QUOTA : BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Credit/findCreditSum'),
		//查询剩余额度列表
		QUERY_ALL_EXTRAQUOTA : BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Credit/queryCustCredit'),
		//查询授信额度详情
		FIND_CREDIT_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Credit/findCredit'),

		/*询价报价相关*/
		//询价列表查询(供应商)
		QUERY_ALL_ENQUIRY_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/inquiryList.json':'/Scf/Enquiry/queryEnquiryList'),
		//询价列表查询(保理公司)
		QUERY_ALL_ENQUIRY_SCF:BTServerPath+ (_isTest?'/scf2/testdata/inquiryList.json':'/Scf/Enquiry/queryEnquiryByfactorNo'),
		//新增询价
		ADD_ENQUIRY:BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Enquiry/addEnquiry'),
		//修改询价
		UPDATE_ENQUIRY:BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Enquiry/saveModifyEnquiry'),
		//报价列表查询
		QUERY_ALL_OFFER:BTServerPath+ (_isTest?'/scf2/testdata/queryOfferList.json':'/Scf/Enquiry/queryOfferList'),
		//查询报价详情
		QUERY_OFFER_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/findOfferDetail.json':'/Scf/Enquiry/findOfferDetail'),
		//新增报价
		ADD_OFFER:BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Enquiry/addOffer'),
		//修改报价
		UPDATE_OFFER:BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Enquiry/saveModifyOffer'),

		/*融资产品相关*/
		//产品列表查询
		QUERY_ALL_PRODUCTLIST: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Product/queryProduct'),
		//查询产品详情
		FIND_PRODUCT_DETAIL_BYID:BTServerPath+ (_isTest?'/scf2/testdata/findProductById.json':'/Scf/Product/findProductById'),
		//产品信息录入
		ADD_ONE_PRODUCTLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Product/addProduct'),
		//产品信息修改
		EDIT_ONE_PRODUCTLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Product/modifyProduct'),
		//产品信息上架
		SHLVE_ONE_PRODUCTLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Product/shelvesProduct'),
		//产品信息下架
		OFFLINE_ONE_PRODUCTLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Product/offlineProduct'),
		//产品信息删除
		DEL_ONE_PRODUCTLIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Product/deleteProduct'),

		/*发货单相关*/
		//查询发货单列表
		QUERY_ALL_DEVLILIST: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Delivery/queryDeliveryNoticeList'),
		//发货单信息录入
		ADD_ONE_DEVLILIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Delivery/addDeliveryNotice'),
		//发货单修改
		EDIT_ONE_DEVLILIST: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/Delivery/saveModifyEnquiry'),
		//查询发货单下拉列表
		QUERY_DROPDOWN_DEVLILIST: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/Delivery/findDeliveryNoticeList'),

		/*保理参数设置相关*/
		//查询包里参数设置列表
		QUERY_ALL_FACTORPARAM: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Scf/FactorParam/loadFactorParam'),
		//包里参数设置信息录入
		ADD_ONE_FACTORPARAM: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Scf/FactorParam/saveFactorParam'),

		/*营业执照信息相关*/
		//查询营业执照相关信息
		QUERY_INFO_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Platform/BusinLicence/findBusinLicence'),
		//添加营业执照代录
		ADD_INSTAED_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/BusinLicence/addInsteadRecord'),
		//编辑营业执照代录
		EDIT_INSTAED_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/BusinLicence/saveInsteadRecord'),
		//查询营业执照代录详情
		QUERY_DETAIL_INSTEAD_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/findInsteadRecordLicense.json':'/Platform/BusinLicence/findInsteadRecord'),
		//添加营业执照变更
		ADD_APPLY_CHANGE_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/BusinLicence/addChangeApply'),
		//编辑营业执照变更
		EDIT_APPLY_CHANGE_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/BusinLicence/saveChangeApply'),
		//查询营业执照变更列表
		QUERY_LIST_CHANGE_LICENSE: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Platform/BusinLicence/queryChangeApply'),
		//添加平台开户代录
		ADD_INSTAED_ACCOUNT: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Account/saveAccInfoInstead'),
		//编辑平台开户代录
		EDIT_INSTAED_ACCOUNT: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/Account/saveAccInfoInstead'),
		//查询开户代录详情
		QUERY_DETAIL_INSTEAD_ACCOUNT: BTServerPath+ (_isTest?'/scf2/testdata/findAccInfoInstead.json':'/Platform/Account/findAccInfoInstead'),

		/*法人信息相关*/
		//查询法人相关信息
		QUERY_INFO_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Platform/LawInfo/findLawInfo'),
		//添加法人代录
		ADD_INSTAED_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/LawInfo/addInsteadRecord'),
		//编辑法人代录
		EDIT_INSTAED_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/LawInfo/saveInsteadRecord'),
		//查询法人代录详情
		QUERY_DETAIL_INSTEAD_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/findInsteadRecordLawyer.json':'/Platform/LawInfo/findInsteadRecord'),
		//添加法人变更
		ADD_APPLY_CHANGE_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/LawInfo/addChangeApply'),
		//编辑法人变更
		EDIT_APPLY_CHANGE_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/addContra.json':'/Platform/LawInfo/saveChangeApply'),
		//查询法人变更列表
		QUERY_LIST_CHANGE_LAWYER: BTServerPath+ (_isTest?'/scf2/testdata/custList.json':'/Platform/LawInfo/queryChangeApply'),


		/*高管信息相关*/
		//高管列表查询
		QUERY_MANAGER_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryManager.json':'/Platform/Manager/queryManager'),
		//获取高管详情
		QUERY_MANAGER_DETAIL: BTServerPath+ (_isTest?'/scf2/testdata/findManager.json':'/Platform/Manager/findManager'),
		//变更 -新增高管
		ADD_MANAGE_TMP: BTServerPath+ (_isTest?'/scf2/testdata/addChangeManagerTmp.json':'/Platform/Manager/addChangeManagerTmp'),
		//变更 -修改高管
		EDIT_MANAGE_TMP: BTServerPath+ (_isTest?'/scf2/testdata/saveChangeManagerTmp.json':'/Platform/Manager/saveChangeManagerTmp'),
		//变更 -删除高管
		DELETE_MANAGE_TMP: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Manager/deleteChangeManagerTmp'),
		//撤销变更
		CANCEL_MANAGE_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Manager/cancelChangeManagerTmp'),
		//申请变更
		ADD_MANAGE_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Manager/addChangeApply'),
		//待变更高管列表（尚未提交变更）
		QUERY_MANAGE_TMP_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryNewChangeManagerTmp.json':'/Platform/Manager/queryNewChangeManagerTmp'),
		//变更申请列表
		QUERY_MANAGE_CHANGE_APPLY_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeApply.json':'/Platform/Manager/queryChangeApply'),
		//变更记录列表（根据变更申请编号查询）
		QUERY_MANAGE_CHANGE_RECORD_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeManagerTmp.json':'/Platform/Manager/queryChangeManagerTmp'),
		//变更记录详情
		QUERY_MANAGE_CHANGE_RECORD_INFO: BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyManager.json':'/Platform/Manager/findChangeApply'),


		/*联系人信息相关*/
		//联系人列表查询
		QUERY_CONTACTOR_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryManager.json':'/Platform/Contacter/queryContacter'),
		//获取联系人详情
		QUERY_CONTACTOR_DETAIL: BTServerPath+ (_isTest?'/scf2/testdata/findManager.json':'/Platform/Contacter/findContacter'),
		//变更 -新增联系人
		ADD_CONTACTOR_TMP: BTServerPath+ (_isTest?'/scf2/testdata/addChangeManagerTmp.json':'/Platform/Contacter/addChangeContacterTmp'),
		//变更 -修改联系人
		EDIT_CONTACTOR_TMP: BTServerPath+ (_isTest?'/scf2/testdata/saveChangeManagerTmp.json':'/Platform/Contacter/saveChangeContacterTmp'),
		//变更 -删除联系人
		DELETE_CONTACTOR_TMP: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Contacter/deleteChangeContacterTmp'),
		//撤销变更
		CANCEL_CONTACTOR_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Contacter/cancelChangeContacterTmp'),
		//申请变更
		ADD_CONTACTOR_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Contacter/addChangeApply'),
		//待变更联系人列表（尚未提交变更）
		QUERY_CONTACTOR_TMP_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryNewChangeManagerTmp.json':'/Platform/Contacter/queryNewChangeContacterTmp'),
		//变更申请列表
		QUERY_CONTACTOR_CHANGE_APPLY_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeApply.json':'/Platform/Contacter/queryChangeApply'),
		//变更记录列表（根据变更申请编号查询）
		QUERY_CONTACTOR_CHANGE_RECORD_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeManagerTmp.json':'/Platform/Contacter/queryChangeContacterTmp'),
		//变更记录详情
		QUERY_CONTACTOR_CHANGE_RECORD_INFO: BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyManager.json':'/Platform/Contacter/findChangeApply'),



		/*股东信息相关*/
		//股东列表查询
		QUERY_SHAREHOLDER_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryManager.json':'/Platform/Shareholder/queryShareholder'),
		//获取股东详情
		QUERY_SHAREHOLDER_DETAIL: BTServerPath+ (_isTest?'/scf2/testdata/findManager.json':'/Platform/Shareholder/findShareholder'),
		//变更 -新增股东
		ADD_SHAREHOLDER_TMP: BTServerPath+ (_isTest?'/scf2/testdata/addChangeManagerTmp.json':'/Platform/Shareholder/addChangeShareholderTmp'),
		//变更 -修改股东
		EDIT_SHAREHOLDER_TMP: BTServerPath+ (_isTest?'/scf2/testdata/saveChangeManagerTmp.json':'/Platform/Shareholder/saveChangeShareholderTmp'),
		//变更 -删除股东
		DELETE_SHAREHOLDER_TMP: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Shareholder/deleteChangeShareholderTmp'),
		//撤销变更
		CANCEL_SHAREHOLDER_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Shareholder/cancelChangeShareholderTmp'),
		//申请变更
		ADD_SHAREHOLDER_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/Shareholder/addChangeApply'),
		//待变更股东列表（尚未提交变更）
		QUERY_SHAREHOLDER_TMP_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryNewChangeManagerTmp.json':'/Platform/Shareholder/queryNewChangeShareholderTmp'),
		//变更申请列表
		QUERY_SHAREHOLDER_CHANGE_APPLY_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeApply.json':'/Platform/Shareholder/queryChangeApply'),
		//变更记录列表（根据变更申请编号查询）
		QUERY_SHAREHOLDER_CHANGE_RECORD_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeManagerTmp.json':'/Platform/Shareholder/queryChangeShareholderTmp'),
		//变更记录详情
		QUERY_SHAREHOLDER_CHANGE_RECORD_INFO: BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyManager.json':'/Platform/Shareholder/findChangeApply'),


		/*银行账户相关*/
		//账户列表查询
		QUERY_BANKACCOUNT_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryManager.json':'/Platform/BankAccount/queryBankAccount'),
		//获取账户详情
		QUERY_BANKACCOUNT_DETAIL: BTServerPath+ (_isTest?'/scf2/testdata/findManager.json':'/Platform/BankAccount/findBankAccount'),
		//变更 -新增账户
		ADD_BANKACCOUNT_TMP: BTServerPath+ (_isTest?'/scf2/testdata/addChangeManagerTmp.json':'/Platform/BankAccount/addChangeBankAccountTmp'),
		//变更 -修改账户
		EDIT_BANKACCOUNT_TMP: BTServerPath+ (_isTest?'/scf2/testdata/saveChangeManagerTmp.json':'/Platform/BankAccount/saveChangeBankAccountTmp'),
		//变更 -删除账户
		DELETE_BANKACCOUNT_TMP: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/BankAccount/deleteChangeBankAccountTmp'),
		//撤销变更
		CANCEL_BANKACCOUNT_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/BankAccount/cancelChangeBankAccountTmp'),
		//申请变更
		ADD_BANKACCOUNT_CHANGE_APPLY: BTServerPath+ (_isTest?'/scf2/testdata/deleteChangeManagerTmp.json':'/Platform/BankAccount/addChangeApply'),
		//待变更账户列表（尚未提交变更）
		QUERY_BANKACCOUNT_TMP_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryNewChangeManagerTmp.json':'/Platform/BankAccount/queryNewChangeBankAccountTmp'),
		//变更申请列表
		QUERY_BANKACCOUNT_CHANGE_APPLY_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeApply.json':'/Platform/BankAccount/queryChangeApply'),
		//变更记录列表（根据变更申请编号查询）
		QUERY_BANKACCOUNT_CHANGE_RECORD_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryChangeManagerTmp.json':'/Platform/BankAccount/queryChangeBankAccountTmp'),
		//变更记录详情
		QUERY_BANKACCOUNT_CHANGE_RECORD_INFO: BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyManager.json':'/Platform/BankAccount/findChangeApply'),


		/*经营信息*/
		//财务信息新增
		ADD_OPERATE_FINANCE_INFO: BTServerPath+ (_isTest?'/scf2/testdata/addFinanceInfo.json':'/Platform/CustMechFinance/addFinanceInfo'),
		//财务信息列表
		QUERY_OPERATE_FINANCE_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryFinanceList.json':'/Platform/CustMechFinance/queryFinanceList'),
		//财务信息删除
		DELETE_OPERATE_FINANCE_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustMechFinance/saveDeleteFinanceInfo'),

		//纳税信息新增
		ADD_OPERATE_TAX_INFO: BTServerPath+ (_isTest?'/scf2/testdata/addFinanceInfo.json':'/Platform/CustTaxRecord/addCustTaxRecord'),
		//纳税信息列表
		QUERY_OPERATE_TAX_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryFinanceList.json':'/Platform/CustTaxRecord/queryCustTaxRecord'),
		//纳税信息删除
		DELETE_OPERATE_TAX_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustTaxRecord/saveDeleteCustTaxRecorde'),

		//融资信息新增
		ADD_OPERATE_FINANCING_INFO: BTServerPath+ (_isTest?'/scf2/testdata/addFinanceInfo.json':'/Platform/CustFinancing/addFinancing'),
		//融资信息列表
		QUERY_OPERATE_FINANCING_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryFinanceList.json':'/Platform/CustFinancing/queryFinancingList'),
		//融资信息删除
		DELETE_OPERATE_FINANCING_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustFinancing/saveDeleteFinancing'),
		//融资信息修改
		UPDATE_OPERATE_FINANCING_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustFinancing/saveFinancing'),

		//合作企业新增
		ADD_OPERATE_COOPERATION_INFO: BTServerPath+ (_isTest?'/scf2/testdata/addFinanceInfo.json':'/Platform/CustMechCooperation/addCooperation'),
		//合作企业列表
		QUERY_OPERATE_COOPERATION_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryFinanceList.json':'/Platform/CustMechCooperation/queryCooperationList'),
		//合作企业删除
		DELETE_OPERATE_COOPERATION_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustMechCooperation/saveDeleteCooperation'),
		//合作企业删除
		UPDATE_OPERATE_COOPERATION_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustMechCooperation/saveCooperation'),

		//贸易记录新增
		ADD_OPERATE_TRADERECORD_INFO: BTServerPath+ (_isTest?'/scf2/testdata/addFinanceInfo.json':'/Platform/CustMechTradeRecord/addTradeRecord'),
		//贸易记录列表
		QUERY_OPERATE_TRADERECORD_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryFinanceList.json':'/Platform/CustMechTradeRecord/queryTradeRecord'),
		//贸易记录删除
		DELETE_OPERATE_TRADERECORD_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustMechTradeRecord/saveDeleteTradeRecord'),

		//银行流水新增
		ADD_OPERATE_BANKFLOW_INFO: BTServerPath+ (_isTest?'/scf2/testdata/addFinanceInfo.json':'/Platform/CustBankFlowRecord/addBankFlowRecord'),
		//银行流水列表
		QUERY_OPERATE_BANKFLOW_LIST: BTServerPath+ (_isTest?'/scf2/testdata/queryFinanceList.json':'/Platform/CustBankFlowRecord/queryBankFlowRecord'),
		//银行流水删除
		DELETE_OPERATE_BANKFLOW_INFO: BTServerPath+ (_isTest?'/scf2/testdata/saveDeleteFinanceInfo.json':'/Platform/CustBankFlowRecord/saveDeleteBankFlowRecord'),


		/*融资申请相关*/
		//新增融资申请
		ADD_FINANCE_REQUEST:BTServerPath+ (_isTest?'/scf2/testdata/addRequest.json':'/Scf/Request/addRequest'),

		ADD_SUPPLIER_FINANCE_REQUEST:BTServerPath+ (_isTest?'/scf2/testdata/addRequest.json':'/WorkFlow/Request/supplyRequest'),

		ADD_AGENCY_FINANCE_REQUEST:BTServerPath+ (_isTest?'/scf2/testdata/addRequest.json':'/WorkFlow/Request/sellerRequest'),

		//分页列表(没发现用到，已废弃)
		// QUERY_FINANCE_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryRequestList.json':'/Scf/Request/queryRequestList'),
		//融资申请详情
		QUERY_FINANCE_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/findRequestDetail.json':'/Scf/Request/findRequestDetail'),
		//出具贷款方案（保理公司）
		ADD_LOAN_SCHEME:BTServerPath+ (_isTest?'/scf2/testdata/offerScheme.json':'/Scf/Request/offerScheme'),
		//贷款方案列表
		QUERY_LOAN_SCHEME_LIST:BTServerPath+ (_isTest?'/scf2/testdata/querySchemeList.json':'/Scf/Request/querySchemeList'),
		//贷款方案详情
		FIND_LOAN_SCHEME_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/findSchemeDetail.json':'/Scf/Request/findSchemeDetail'),
		//确认贷款方案（申请企业）
		CONFIRM_LOAN_SCHEME:BTServerPath+ (_isTest?'/scf2/testdata/confirmScheme.json':'/Scf/Request/confirmScheme'),
		//发起融资背景确认（保理公司 -签约）
		REQUEST_TRADE_BACK_ENSURE:BTServerPath+ (_isTest?'/scf2/testdata/confirmScheme.json':'/Scf/Request/requestTradingBackgrand'),
		//确认融资贸易背景（核心企业）
		CONFIRM_TRADE_BACKGROUND:BTServerPath+ (_isTest?'/scf2/testdata/confirmScheme.json':'/Scf/Request/confirmTradingBackgrand'),
		//一般审批（保理公司）
		APPROVE_LOAN_REQUEST:BTServerPath+ (_isTest?'/scf2/testdata/confirmScheme.json':'/Scf/Request/approveRequest'),
		//放款确认（保理公司）
		CONFIRM_MAKE_LOAN:BTServerPath+ (_isTest?'/scf2/testdata/confirmScheme.json':'/Scf/Request/confirmLoan'),
		//查询待处理|已处理订单列表
		QUERY_WORK_TASK_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryWorkTask.json':'/Scf/Request/queryWorkTask'),
		//根据放款日期 计算结束日期
		CALCULATE_END_DATE:BTServerPath+ (_isTest?'/scf2/testdata/calculatEndDate.json':'/Scf/Request/calculatEndDate'),
		//根据放款金额 计算已收保理费
		CALCULATE_SERVICE_FEE:BTServerPath+ (_isTest?'/scf2/testdata/calculatServiceFee.json':'/Scf/Request/calculatServiceFee'),
		//根据放款金额 计算利息和其他费用
		CALCULATE_INSTEREST:BTServerPath+ (_isTest?'/scf2/testdata/calculatInsterest.json':'/Scf/Request/calculatInsterest'),


		//查询融资列表（独立于流程）根据状态等字段 0中止，1 申请中，2审批中，3放款中，4还款中， 5逾期，6 展期，7坏帐，8 结清
		QUERY_FINANCE_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryRequestList.json':'/Scf/Request/queryRequest'),
		//放款确认（独立于流程）
		FINANCE_LOAN_ENSURE:BTServerPath+ (_isTest?'/scf2/testdata/confirmScheme.json':'/Scf/Request/loan'),


		/*融资还款接口*/
		//查询还款列表
		QUERY_PAY_RECORD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPayRecordList.json':'/Scf/Repayment/queryPayRecordList'),
		//计算还款方式
		CALCULAT_PAY_TYPE:BTServerPath+ (_isTest?'/scf2/testdata/calculatPayType.json':'/Scf/Repayment/calculatPayType'),
		//查询还款详情
		QUERY_REPAYMENT_FEE:BTServerPath+ (_isTest?'/scf2/testdata/queryRepaymentFee.json':'/Scf/Repayment/queryRepaymentFee'),
		//经销商还款 - 根据本次还款金额 还款信息
		QUERY_SELLER_REPAYMENT_FEE:BTServerPath+ (_isTest?'/scf2/testdata/querySellerRepaymentFee.json':'/Scf/Repayment/querySellerRepaymentFee'),
		//供应商还款 - 根据本次还款金额 还款信息
		QUERY_SUPPLY_REPAYMENT_FEE:BTServerPath+ (_isTest?'/scf2/testdata/querySellerRepaymentFee.json':'/Scf/Repayment/queryDistributeFee'),
		//保存还款信息
		SAVE_REPAYMENT_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/saveRepayment.json':'/Scf/Repayment/saveRepayment'),
		//提醒还款
		NOTIFY_REPAYMENT:BTServerPath+ (_isTest?'/scf2/testdata/saveRepayment.json':'/Scf/Repayment/notifyPay'),

		//补充其它资料
		SAVE_OTHER_FILE_INFO:BTServerPath+ (_isTest?'/scf2/testdata/saveRepayment.json':'/Scf/ElecAgree/addOtherFile'),
		//查询其它资料
		QUERY_OTHER_FILE_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPayRecordList.json':'/Scf/ElecAgree/queryOtherFile'),
		//删除其它资料
		DELETE_OTHER_FILE_INFO:BTServerPath+ (_isTest?'/scf2/testdata/queryPayRecordList.json':'/Scf/ElecAgree/delOtherFile'),


		/*催收信息*/
		//查询催收列表
		QUERY_PRESS_MONEY_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPressMoneyList.json':'/Scf/Repayment/queryPressMoneyList'),
		//查询催收列表（无分页）
		FIND_PRESS_MONEY_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPressMoneyList.json':'/Scf/Repayment/findPressMoneyList'),
		//保存催收信息
		ADD_PRESS_MONEY_INFO:BTServerPath+ (_isTest?'/scf2/testdata/addPressMoney.json':'/Scf/Repayment/addPressMoney'),
		//修改催收信息
		UPDATE_PRESS_MONEY_INFO:BTServerPath+ (_isTest?'/scf2/testdata/addPressMoney.json':'/Scf/Repayment/saveModifyPressMoney'),
		//删除催收信息
		DELETE_PRESS_MONEY_INFO:BTServerPath+ (_isTest?'/scf2/testdata/addPressMoney.json':'/Scf/Repayment/saveDelPressMoney'),


		/*豁免信息*/
		//查询豁免列表（无分页）
		FIND_EXEMPT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPressMoneyList.json':'/Scf/Repayment/findExemptList'),
		//保存豁免信息
		ADD_EXEMPT_INFO:BTServerPath+ (_isTest?'/scf2/testdata/addPressMoney.json':'/Scf/Repayment/addExempt'),

		//查询展期列表（无分页）
		// FIND_EXTENSION_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPressMoneyList.json':'/Scf/Repayment/findExtensionList'),
		//查询还款计划列表（无分页）
		// FIND_PAYMENT_PLAN_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPressMoneyList.json':'/Scf/Repayment/findPlanList'),
		//查询还款记录列表（无分页）
		FIND_PAYMENT_RECORD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryPressMoneyList.json':'/Scf/Repayment/findPayRecordList'),


		/*公司基本信息*/
		//公司列表查询
		QUERY_CUST_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryCustList.json':'/Platform/BaseInfo/queryCustList'),
		//详情查询
		QUERY_BASIC_INFO:BTServerPath+ (_isTest?'/scf2/testdata/baseInfo.json':'/Platform/BaseInfo/findBaseInfo'),
		//添加代录
		ADD_INSTEAD_RECORD_BASIC:BTServerPath+ (_isTest?'/scf2/testdata/addInsteadRecord.json':'/Platform/BaseInfo/addInsteadRecord'),
		//修改代录
		SAVE_INSTEAD_RECORD_BASIC:BTServerPath+ (_isTest?'/scf2/testdata/saveInsteadRecord.json':'/Platform/BaseInfo/saveInsteadRecord'),
		//代录详情
		FIND_INSTEAD_RECORD_BASIC:BTServerPath+ (_isTest?'/scf2/testdata/findInsteadRecordBasic.json':'/Platform/BaseInfo/findInsteadRecord'),
		//变更申请
		ADD_APPLY_CHANGE_BASIC:BTServerPath+ (_isTest?'/scf2/testdata/addChangeApply.json':'/Platform/BaseInfo/addChangeApply'),
		//变更列表
		QUERY_LIST_CHANGE_BASIC:BTServerPath+ (_isTest?'/scf2/testdata/queryChangeApply.json':'/Platform/BaseInfo/queryChangeApply'),


		/*订单管理相关*/
		//订单列表
		QUERY_ORDER_LIST:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/scf2/testdata/orderList.json'),
		ADD_ORDER_INFO:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Scf/Order/addOrder'),
		//订单编辑
		EDIT_ORDER_INFO:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Scf/Order/modifyOrder'),


		/*资料复核操作相关*/
		//资料复核列表
		QUERY_INFO_REVIEW_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryInsteadApplyReviewList.json':'/Platform/Instead/queryInsteadApplyReviewList'),
		//查询申请子列表
		QUERY_RECORD_LIST_BY_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/queryInsteadRecordByApply.json':'/Platform/Instead/queryInsteadRecordByApply'),
		//子项复核通过
		PASS_REVIEW_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/reviewPassInsteadRecord.json':'/Platform/Instead/reviewPassInsteadRecord'),
		//子项复核驳回
		REJECT_REVIEW_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/reviewRejectInsteadRecord.json':'/Platform/Instead/reviewRejectInsteadRecord'),
		//总体复核提交
		SUBMIT_REVIEW_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/submitReviewInsteadApply.json':'/Platform/Instead/submitReviewInsteadApply'),



		//所有代录列表
		QUERY_ALL_INSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryInsteadApplyOwnList.json':'/Platform/Instead/queryInsteadApplyList'),
		//新增代录总表记录
		ADD_INSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/addInsteadApply'),
		//编辑代录总表记录
		EDIT_INSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/saveInsteadApply'),
		//查询代录记录详情
		QUERY_INSTEADINFO_LIST:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/findInsteadApply'),
		//查询代录子记录列表
		QUERY_CHILDREN_INSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/queryInsteadRecordByApply'),
		//查询代录待审核列表
		QUERY_UNCHECK_INSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/queryInsteadApplyAuditList'),
		//代录申请审核通过
		PASS_INSTEAD_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/auditPassInsteadApply'),
		//代录申请审核驳回
		REJECT_INSTEAD_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/auditRejectInsteadApply'),
		//代录确认通过
		PASS_CONFIRM_INSTEAD_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/confirmPassInsteadRecord'),
		//代录驳回
		REJECT_CONFIRM_INSTEAD_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Platform/Instead/confirmRejectInsteadRecord'),
		//待录审核记录列表
		QUERY_AUDIT_RECORD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryAuditLogInsteadApplyList.json':'/Platform/AuditLog/queryAuditLogInsteadApplyList'),
		//代录主列表代录通过
		PASS_MAININSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/submitTypeInInsteadApply.json':'/Platform/Instead/submitTypeInInsteadApply'),
		//查询用户自身拥有的数据
		QUERY_OWN_INSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryInsteadApplyOwnList.json':'/Platform/Instead/queryInsteadApplyOwnList'),
		//查询用户自身拥有的数据
		CONFIRM_MAININSTEAD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/submitConfirmInsteadApply.json':'/Platform/Instead/submitConfirmInsteadApply'),


		/*变更审核 -平台 */
		//变更列表
		QUERY_CHANGE_APPLY_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryChangeApplyList.json':'/Platform/Change/queryChangeApplyList'),
		//变更 审核通过
		AUDIT_CHANGE_APPLY_PASS:BTServerPath+ (_isTest?'/scf2/testdata/auditPassChangeApply.json':'/Platform/Change/auditPassChangeApply'),
		//变更 审核驳回
		AUDIT_CHANGE_APPLY_REJECT:BTServerPath+ (_isTest?'/scf2/testdata/auditRejectChangeApply.json':'/Platform/Change/auditRejectChangeApply'),
		//变更 审批记录列表
		// QUERY_CHANGE_AUDIT_RECORD_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryAuditLogChangeApplyList.json':'/Platform/AuditLog/queryAuditLogChangeApplyList'),
		//变更详情 基本信息
		FIND_AUDIT_DETAIL_BASIC:BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyBasic.json':'/Platform/BaseInfo/findChangeApply'),
		//变更详情 法人信息
		FIND_AUDIT_DETAIL_LAWYER:BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyLawyer.json':'/Platform/LawInfo/findChangeApply'),
		//变更详情 营业执照
		FIND_AUDIT_DETAIL_LICENCE:BTServerPath+ (_isTest?'/scf2/testdata/findChangeApplyLicence.json':'/Platform/BusinLicence/findChangeApply'),



		/*客户白名单*/
		//客户白名单受理列表
		QUERY_ACCEPT_WHITELIST:BTServerPath+ (_isTest?'/scf2/testdata/queryAcceptWhiteList.json':'/Platform/CustRelation/queryAccept'),
		//客户白名单受理
		ACCEPT_WHITELIST:BTServerPath+ (_isTest?'/scf2/testdata/acceptWhiteList.json':'/Platform/CustRelation/saveAccept'),
		//客户白名单驳回
		REJECT_WHITELIST:BTServerPath+ (_isTest?'/scf2/testdata/rejectWhiteList.json':'/Platform/CustRelation/saveRefuseAccept'),
		//客户白名单审批列表
		QUERY_AUDIT_WHITELIST:BTServerPath+ (_isTest?'/scf2/testdata/queryAuditWhiteList.json':'/Platform/CustRelation/queryAudit'),
		//客户白名单审批
		AUDIT_WHITELIST:BTServerPath+ (_isTest?'/scf2/testdata/auditWhiteList.json':'/Platform/CustRelation/saveAudit'),
		//客户白名单审批驳回
		AUDIT_REJECT_WHITELIST:BTServerPath+ (_isTest?'/scf2/testdata/auditRejectWhiteList.json':'/Platform/CustRelation/saveRefuseAudit'),

		//客户开户读取暂存开户资料
		FIND_OPENACCOUNT_TEMP:BTServerPath+ (_isTest?'/scf2/testdata/findOpenAccountTemp.json':'/Platform/Account/findAccInfo'),
		//客户开户开户资料暂存
		SAVE_OPENACCOUNT_TEMP:BTServerPath+ (_isTest?'/scf2/testdata/saveOpenAccountTemp.json':'/Platform/Account/saveAccInfo'),
		//客户开户资料提交
		OPENACCOUNT:BTServerPath+ (_isTest?'/scf2/testdata/openAccount.json':'/Platform/CustFile/fileMultipleDownload'),

		//客户开户资料提交(开户优化)
		OPEN_ACCOUNT2:BTServerPath+ (_isTest?'/scf2/testdata/openAccount.json':'/Platform/Account/saveOpenAccountApplySubmit'),
		//代录开户申请(开户优化)
		SAVE_INSTEAD_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/openAccount.json':'/Platform/Instead/addOpenAccountInsteadApply'),
		//查询开户申请状态(开户优化)
		FIND_OPENACCOUNT_APPLY_STATUS:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/Account/findInsteadApplyStatus'),
		//查询开户信息(开户优化)
		FIND_OPEN_ACCOUNT_INFO:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/Account/findOpenAccoutnTmp'),
		//代录激活(开户优化)
		ACTIVE_OPEN_ACCOUNT:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/Instead/saveActiveOpenAccount'),
		//文件打包下载(开户优化)
		DOWNLOAD_MUTLTIPLE_FILE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustFile/fileMultipleDownload'),
		//选择操作员(开户优化)
		FIND_SPECIAL_OPERATOR:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustOperator/findCustOperatorByClerk'),

		//开户申请待审批列表
		QUERY_OPENACCOUNT_AUDIT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/findOpenAccountTemp.json':'/Platform/Account/queryAccApply'),
		//开户信息读取
		FIND_OPENACCOUNT_INFO:BTServerPath+ (_isTest?'/scf2/testdata/findOpenAccountTemp.json':'/Platform/Account/findAccInfoById'),
		//开户申请生效
		SAVE_OPENACCOUNT_PASS:BTServerPath+ (_isTest?'/scf2/testdata/findOpenAccountTemp.json':'/Platform/Account/saveAuditccApply'),
		//开户申请驳回
		SAVE_OPENACCOUNT_REFUSE:BTServerPath+ (_isTest?'/scf2/testdata/findOpenAccountTemp.json':'/Platform/Account/saveRefuseAccApply'),

		//历史融资查询
		QUERY_COMPLETEDREQUEST:BTServerPath+ (_isTest?'/scf2/testdata/queryCompletedRequest.json':'/Scf/Request/queryCompletedRequest'),
		//待批融资查询
		QUERY_PENDINGREQUEST:BTServerPath+ (_isTest?'/scf2/testdata/queryPendingRequest.json':'/Scf/Request/queryPendingRequest'),
		//还款融资查询
		QUERY_REPAYMENTREQUEST:BTServerPath+ (_isTest?'/scf2/testdata/queryRepaymentRequest.json':'/Scf/Request/queryRepaymentRequest'),
		//查询融资状态集
		QUERY_TRADESTATUS:BTServerPath+ (_isTest?'/scf2/testdata/queryTradeStatus.json':'/Scf/Request/queryTradeStatus'),
		//核心企业下供应商/经销商融资查询
		QUERY_CORE_ENTERPRISEREQUEST:BTServerPath+ (_isTest?'/scf2/testdata/queryCoreEnterpriseRequest.json':'/Scf/Request/queryCoreEnterpriseRequest'),


		//订单相关操作
		QUERY_LIST_ORDER:BTServerPath+ (_isTest?'/scf2/testdata/queryOrder.json':'/Scf/Order/queryOrder'),
		//订单信息编辑
		EDIT_INFO_ORDER:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/Order/modifyOrder'),
		//订单新增
		ADD_INFO_ORDER:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/Order/addOrder'),
		//运输单据信息列表
		QUERY_LIST_TRANSPORT:BTServerPath+ (_isTest?'/scf2/testdata/queryFactorCredit.json':'/Scf/Transport/queryTransport'),
		//新增运输单据信息
		ADD_ONE_TRANSPORT:BTServerPath+ (_isTest?'/scf2/testdata/addTransport.json':'/Scf/Transport/addTransport'),
		//发票信息列表
		QUERY_LIST_INVOICE:BTServerPath+ (_isTest?'/scf2/testdata/queryInvoice.json':'/Scf/Invoice/queryInvoice'),
		//需要补录发票信息列表
		QUERY_LIST_UNCOMPLETED_INVOICE:BTServerPath+ (_isTest?'/scf2/testdata/queryInvoice.json':'/Scf/Invoice/queryIncompletedInvoice'),
		//修改发票信息
		EDIT_INFO_INVOICE:BTServerPath+ (_isTest?'/scf2/testdata/queryInvoice.json':'/Scf/Invoice/saveModifyInvoice'),
		//新增发票信息
		ADD_ONE_INVOICE:BTServerPath+ (_isTest?'/scf2/testdata/addTransport.json':'/Scf/Invoice/addInvoice'),
		ADD_INFO_INVOICE:BTServerPath+ (_isTest?'/scf2/testdata/queryInvoice.json':'/Scf/Invoice/addInvoice'),
		//删除发票信息
		DEL_INFO_INVOICE:BTServerPath+ (_isTest?'/scf2/testdata/addTransport.json':'/Scf/Invoice/saveDeleteInvoice'),
		//新增发票附加信息
		ADD_ONE_INVOICE_MORE:BTServerPath+ (_isTest?'/scf2/testdata/addTransport.json':'/Scf/Invoice/addInvoiceItem'),
		//汇票信息列表
		QUERY_LIST_DRAFT:BTServerPath+ (_isTest?'/scf2/testdata/queryAcceptBill.json':'/Scf/AcceptBill/queryAcceptBill'),
		//汇票信息编辑
		EDIT_INFO_DRAFT:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/modifyAcceptBill'),
		//汇票信息登记
		ADD_INFO_DRAFT:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/addAcceptBill'),
		//汇票信息登记
		ADD_INFO_DRAFT_V2:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/addAcceptBillDO'),
		//汇票信息审核
		ADUIT_INFO_DRAFT:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/saveAduitAcceptBill'),
		//汇票信息废止
		ANNUL_BILL_INFO_DRAFTANDCONFIR:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/saveAnnulAcceptBill'),
		//汇票信息核准
		AUDIT_BILL_INFO_CONFIR:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/saveAuditBillDO'),
		//汇票票据回收列表QUERY_CANANNUL_BILL_INFO_LIST
		QUERY_CANANNUL_BILL_INFO_LIST:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/queryCanAnnulBill'),
		//生效票据回收
		SAVE_ANNUL_EFFECTIVEBILL_INFO:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/saveAnnulEffectiveAcceptBill'),
		//核心企业查询生效的列表
		QUERY_EFFECTIVEBILL_INFO_LIST:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/AcceptBill/queryEffectiveBill'),
		//应收账款信息列表
		QUERY_LIST_RECIEVE:BTServerPath+ (_isTest?'/scf2/testdata/queryReceivable.json':'/Scf/Receivable/queryReceivable'),
		//应收账款信息编辑
		EDIT_INFO_RECIEVE:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/Receivable/modifyReceivable'),
		//应收账款信息编辑
		ADD_INFO_RECIEVE:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/Receivable/addReceivable'),
		//应收账款信息审核
		ADUIT_INFO_RECIEVE:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Scf/Receivable/saveAduitReceivable'),
		//添加相关联的信息
		ADD_LINK_CHILDINFO:BTServerPath+ (_isTest?'/scf2/testdata/addOrderRelation.json':'/Scf/OrderRelation/addOrderRelation'),
		//删除相关联的信息
		DEL_LINK_CHILDINFO:BTServerPath+ (_isTest?'/scf2/testdata/deleteOrderRelation.json':'/Scf/OrderRelation/deleteOrderRelation'),

		//订单无分页列表（供应商/经销商）
		QUERY_ORDER_LIST_NORMAL:BTServerPath+ (_isTest?'/scf2/testdata/findOrderList.json':'/Scf/Order/findOrderList'),
		//应收账款无分页列表（供应商/经销商）
		QUERY_RECIEVE_LIST_NORMAL:BTServerPath+ (_isTest?'/scf2/testdata/findReceivableList.json':'/Scf/Receivable/findReceivableList'),
		//汇票无分页列表（供应商/经销商）
		QUERY_BILL_LIST_NORMAL:BTServerPath+ (_isTest?'/scf2/testdata/findAcceptBillList.json':'/Scf/AcceptBill/findAcceptBillList'),
		//汇票无分页列表（供应商/经销商）
		QUERY_BILL_LIST_CUSTNO:BTServerPath+ (_isTest?'/scf2/testdata/findAcceptBillList.json':'/Scf/AcceptBill/findAcceptBillByCustNo'),
		//汇票分页列表（保理公司）
		QUERY_FINANCED_BY_FACTOR:BTServerPath+ (_isTest?'/scf2/testdata/queryFinancedByFactor.json':'/Scf/AcceptBill/queryFinancedByFactor'),

		//汇票分页列表（保理公司）
		FIND_CORECUS_TNO:BTServerPath+ (_isTest?'/scf2/testdata/queryFinancedByFactor.json':'/Scf/Order/findCoreCustNo'),

		//通过ID查询订单详情
		FIND_ORDER_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/findOrderDeatilsById.json':'/Scf/Order/findOrderDetailsById'),
		//通过ID查询汇票详情
		FIND_DRAFT_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/findAcceptBillDetailsById.json':'/Scf/AcceptBill/findAcceptBillDetailsById'),
		//通过ID查询应收详情
		FIND_RECIEVE_DETAIL:BTServerPath+ (_isTest?'/scf2/testdata/findReceivableDetailsById.json':'/Scf/Receivable/findReceivableDetailsById'),

		//融资申请相关的 订单/应收/汇票 列表（无分页）
		FIANACE_REQUEST_LINKED_LIST:BTServerPath+ (_isTest?'/scf2/testdata/findOrderList.json':'/Scf/Order/findInfoListByRequest'),
		//根据申请单号 查询 附件列表（融资申请材料）
		QUERY_REQUEST_ATTACH_LIST:BTServerPath+ (_isTest?'/scf2/testdata/findRequestBaseInfoFileList.json':'/Scf/Order/findRequestBaseInfoFileList'),


		/*角色管理相关*/
		//角色查询
		QUERY_LIST_ROLE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/Role/queryRole'),
		//已启用角色查询
		QUERY_OPENED_ROLE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/Role/findAllRole'),
		//角色录入
		ADD_ONE_ROLE:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/Role/addRole'),
		//角色编辑
		EDIT_ONE_ROLE:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/Role/updateRole'),

		/*菜单管理相关*/
		QUERY_LIST_MENU:BTServerPath+ (_isTest?'/scf2/testdata/findMenuByRole.json':'/Platform/CustOperator/findMenuByRole'),
		//编辑菜单列表
		EDIT_MENU_LIST:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/CustOperator/addMenuRole'),

		/*操作员相关*/
		QUERY_LIST_OPERATOR:BTServerPath+ (_isTest?'/scf2/testdata/queryCustOperator.json':'/Platform/CustOperator/queryCustOperator'),
		//获取下拉的操作员
		QUERY_SELECT_OPERATOR:BTServerPath+ (_isTest?'/scf2/testdata/queryCustOperator.json':'/Platform/CustOperator/findCustOperator'),
		//查询所有的流程审批金额段
		QUERY_ALL_MONEYPART:BTServerPath+ (_isTest?'/scf2/testdata/webFindMoneyClass.json':'/Platform/workflow/webFindMoneyClass'),
		//新增操作员
		ADD_ONE_OPERATOR:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/CustOperator/addCustOperator'),
		//编辑操作员
		EDIT_ONE_OPERATOR:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/CustOperator/updateCustOperator'),
		//重置操作员密码
		UPDATE_OPERATE_PASSWORD:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/CustOperator/changeUserPassword'),

		/*流程相关操作*/
		//流程审批记录
		ACTIVITY_HISTORY_LIST:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/workflow/webFindExecutedHistory'),
		//已执行节点列表
		ACTIVITY_EXECUTE_NODES:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/workflow/webFindExecutedNodes'),
		//根据流程类型得到所有节点
		QUERY_ACTIVITY_NODES_BY_TYPE:BTServerPath+ (_isTest?'/scf2/testdata/webFindFlowNodesByType.json':'/Platform/workflow/webFindFlowNodesByType'),
		//查询流程监控列表
		QUERY_WORKTASK_BY_MONITOR:BTServerPath+ (_isTest?'/scf2/testdata/webQueryWorkTaskByMonitor.json':'/Platform/workflow/webQueryWorkTaskByMonitor'),
		//查询当前用户待审批的任务
		QUERY_CURRENT_WORK_TASK:BTServerPath+ (_isTest?'/scf2/testdata/webQueryWorkTaskByMonitor.json':'/Platform/workflow/webQueryCurrentUserWorkTask'),
		//查询当前用户已经审批的任务
		QUERY_CURRENT_USER_HISTORY_WORK_TASK:BTServerPath+ (_isTest?'/scf2/testdata/webQueryCurrentUserHistoryWorkTask.json':'/Platform/workflow/webQueryCurrentUserHistoryWorkTask'),
		//根据流程类型得到所有节点
		QUERY_NODELIST:BTServerPath+ (_isTest?'/scf2/testdata/webFindSysNode.json':'/Platform/workflow/webFindFlowNodesByType'),
		//根据流程类型得到所有系统节点
		QUERY_SYSNODELIST:BTServerPath+ (_isTest?'/scf2/testdata/webFindSysNode.json':'/Platform/workflow/webFindSysNode'),

		/*流程定义相关操作*/
		//查询已定义节点
		QUERY_OPENED_FLOW:BTServerPath+ (_isTest?'/scf2/testdata/webFindProcessByType.json':'/Platform/workflow/webFindProcessByType'),
		//更新所有的流程节点信息
		EDIT_FLOWLIST_INFO:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/workflow/webSaveProcess'),
		//新增流程节点
		ADD_FLOWNODE_INFO:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/workflow/webAddFlowNode'),
		//编辑流程节点
		EDIT_FLOWNODE_INFO:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/workflow/webSaveFlowNode'),
		//删除流程节点
		DEL_FLOWNODE_INFO:BTServerPath+ (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/workflow/webDeleteFlowNode'),


		/*消息相关*/
		//查询消息模板申请列表
		QUERY_LIST_NOTICEPROFILE:BTServerPath + (_isTest?'/scf2/testdata/queryNotificationProfile.json':'/Platform/NotificationProfile/queryNotificationProfile'),
		//查询消息模板列表
		QUERY_LIST_NOTICEMODULE:BTServerPath + (_isTest?'/scf2/testdata/queryChannelProfile.json':'/Platform/NotificationProfile/queryChannelProfile'),
		//查询预制规则
		QUERY_LIST_PREVARIABLE:BTServerPath + (_isTest?'/scf2/testdata/queryProfileVariable.json':'/Platform/NotificationProfile/queryProfileVariable'),
		//编辑消息频道模板
		EDIT_INFO_CHANNELMODULE:BTServerPath + (_isTest?'/scf2/testdata/saveChannelProfile.json':'/Platform/NotificationProfile/saveChannelProfile'),
		//禁用消息模板
		CANCEL_INFO_NOTICEMODULE:BTServerPath + (_isTest?'/scf2/testdata/setDisabledNotificationProfile.json':'/Platform/NotificationProfile/setDisabledNotificationProfile'),
		//启用消息模板
		ACTIVE_INFO_NOTICEMODULE:BTServerPath + (_isTest?'/scf2/testdata/setEnabledNotificationProfile.json':'/Platform/NotificationProfile/setEnabledNotificationProfile'),

		//消息模板订阅相关
		//查询消息模板订阅列表
		QUERY_LIST_PROFILESUB:BTServerPath + (_isTest?'/scf2/testdata/querySubscribeByCustNo.json':'/Platform/NotificationSubscribe/querySubscribeByCustNo'),
		//启用订阅
		ACTIVE_INFO_SUB:BTServerPath + (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/NotificationSubscribe/confirmSubscribe'),
		//取消订阅
		CANCEL_INFO_SUB:BTServerPath + (_isTest?'/scf2/testdata/modifyOrder.json':'/Platform/NotificationSubscribe/cancelSubscribe'),


		/*消息查看相关*/
		//未读消息列表
		QUERY_UNREAD_NOTIFICATION:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotification.json':'/Platform/Notification/queryUnreadNotification'),
		//已读消息列表
		QUERY_READ_NOTIFICATION:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotification.json':'/Platform/Notification/queryReadNotification'),
		//未读消息数量
		COUNT_UNREAD_NOTIFICATION:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotification.json':'/Platform/Notification/countUnreadNotification'),
		//设置消息已读
		SET_READ_NOTIFICATION:BTServerPath + (_isTest?'/scf2/testdata/setReadNotice.json':'/Platform/Notification/setReadNotificationStatus'),

		//查询消息详情
		FIND_NOTIFICATION_DETAIL:BTServerPath + (_isTest?'/scf2/testdata/findNotification.json':'/Platform/Notification/findNotification'),


		/*公告管理相关*/
		//已发布公告列表
		QUERY_NOTICE_LIST:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotice.json':'/Platform/Notice/queryNotice'),
		//查看公告详情
		FIND_NOTICE_DETAIL:BTServerPath + (_isTest?'/scf2/testdata/findNotice.json':'/Platform/Notice/findNotice'),
		//添加并发布公告
		ADD_PUBLISH_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/addPublishNotice'),
		//添加并暂存公告
		ADD_STORE_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/addStoreNotice'),
		//修改并发布公告
		EDIT_PUBLISH_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/savePublishNotice'),
		//修改并暂存公告
		EDIT_STORE_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/saveStoreNotice'),
		//发布公告
		PUBLISH_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/publishNotice'),
		//撤销公告
		CANCEL_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/cancelNotice'),
		//删除公告
		// DELETE_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/addPublishNotice.json':'/Platform/Notice/deleteNotice'),

		/*公告查看相关*/
		//未读公告列表
		QUERY_UNREAD_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotice.json':'/Platform/Notice/queryUnreadNotice'),
		//已读公告列表
		QUERY_READ_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotice.json':'/Platform/Notice/queryReadNotice'),
		//未读公告数量
		COUNT_UNREAD_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/queryUnreadNotice.json':'/Platform/Notice/countUnreadNotice'),
		//设置公告已读
		SET_READ_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/setReadNotice.json':'/Platform/Notice/setReadNotice'),
		//设置公告已删
		// SET_DELETED_NOTICE:BTServerPath + (_isTest?'/scf2/testdata/setDeletedNotice.json':'/Platform/Notice/setDeletedNotice'),


		/*合同相关*/
		//合同列表
		CONTR_LIST:BTServerPath+ (_isTest?'/scf/testdata/contractList.json':'/Scf/CustAgree/queryAgreement'),
		//增加合同
		ADD_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/addContra.json':'/Scf/CustAgree/addAgree'),
		//编辑合同
		UPDATE_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/updateContra.json':'/Scf/CustAgree/updateAgree'),
		//获取合同附件
		CONTRACT_PLUS_LIST:BTServerPath+ (_isTest?'/scf/testdata/contraPlusList.json':'/Scf/CustAgree/queryAgreeAccess'),
		//删除合同
		DEL_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/delContra.json':'/Scf/CustAgree/deleteAgree'),
		//启用合同
		USE_CONTRACT:BTServerPath+ (_isTest?'/scf/testdata/delContra.json':'/Scf/CustAgree/activeAgree'),
		//删除合同附件
		DEL_CONTRACT_PLUS:BTServerPath+ (_isTest?'/scf/testdata/delContra.json':'/Scf/CustAgree/delAgreeAttach'),


		/* 电子合同 */
		//电子合同列表
		ELEC_CONTR_LIST:BTServerPath+ (_isTest?'/scf2/testdata/elecContractList.json':'/Scf/ElecAgree/queryElecAgreement'),
		//获取静态页面内容
		GET_STATIC_PAGE:BTServerPath+ (_isTest?'/scf2/testdata/getStaticPage.json':'/Scf/ElecAgree/findAgreePage'),
		//发送验证码
		GET_VALID_CODE:BTServerPath+ (_isTest?'/scf2/testdata/getValidCode.json':'/Scf/ElecAgree/findValidCode'),
		//签署合同
		SEND_VALID_CODE:BTServerPath+ (_isTest?'/scf2/testdata/sendValidCode.json':'/Scf/ElecAgree/sendValidCode'),
		//根据请求单号查询电子合同
		FIND_ELEC_AGREE_BY_REQUESTNO:BTServerPath+ (_isTest?'/scf2/testdata/queryFactorAgree.json':'/Scf/ElecAgree/findElecAgreeByRequestNo'),
		//根据申请单号和合同类型获取验证码
		FIND_VALIDCODE_BY_REQUESTNO:BTServerPath+ (_isTest?'/scf/testdata/getStaticPage.json':'/Scf/ElecAgree/findValidCodeByRequestNo'),
		//根据申请单号和合同类型获取静态页面内容
		FIND_AGREE_PAGE_BY_REQUESTNO:BTServerPath+ (_isTest?'/scf/testdata/getStaticPage.json':'/Scf/ElecAgree/findAgreePageByRequestNo'),

		/* 保理合同 */
		//新增保理合同
		ADD_FINANCE_CONTRACT:BTServerPath+ (_isTest?'/scf2/testdata/getStaticPage.json':'/Scf/ElecAgree/addFactorAgree'),
		//编辑保理合同
		EDIT_FINANCE_CONTRACT:BTServerPath+ (_isTest?'/scf2/testdata/getStaticPage.json':'/Scf/ElecAgree/updateFactorAgree'),
		//查询保理合同列表（下拉）
		FIND_FINANCE_CONTRACT:BTServerPath+ (_isTest?'/scf2/testdata/getStaticPage.json':'/Scf/ElecAgree/findFactorAgree'),
		//查询保理合同列表（分页）
		QUERY_FINANCE_CONTRACT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/queryFactorAgree.json':'/Scf/ElecAgree/queryFactorAgree'),
		//启用|禁用 保理合同
		ACTION_FINANCE_CONTRACT:BTServerPath+ (_isTest?'/scf2/testdata/getStaticPage.json':'/Scf/ElecAgree/cancelFactorAgree'),

		/*系统参数设置，供应商参数设置*/
		SAVE_SUPPLIER_PARAM:BTServerPath+ (_isTest?'':'/Scf/Param/saveParam'),
		QUERY_SUPPLIER_PARAM:BTServerPath+ (_isTest?'':'/Scf/Param/querySupplerParam'),

		/*系统参数设置，核心企业参数设置*/
		SAVE_CORE_PARAM:BTServerPath+ (_isTest?'':'/Scf/Param/saveCoreParam'),
		QUERY_CORE_PARAM:BTServerPath+ (_isTest?'':'/Scf/Param/queryCoreParam'),

		/*获取汇票相应的合同状态*/
		QUERY_LINKBILL_CONTRACT:BTServerPath+ (_isTest?'':'/Scf/Order/checkAgreementStatus'),

		//查询操作员关联的客户信息
		QUERY_OPENED_CUST:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustOperator/findOperatorCustInfo'),

		//分页查询客户关系信息
		QUERY_CUST_RELATIONCONFIG:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/queryCustRelation'),
		QUERY_CUST_RELATIONCONFIGBYCORE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/queryCustRelationByCore'),
		//获取关联关系类型
		FIND_CUST_TYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findCustType'),
		//获取未选中的客户列表
		FIND_CUST_INFO:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findCustInfo'),
		//添加关系客户
		ADD_CUST_RELATION:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/addCustRelation'),
		// 查询当前登录的客户类型
		FIND_CUST_TYPE_LOGIN:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findCustTypeByLogin'),
		// 查询开通保理业务申请基础信息
		FIND_FACTORBUSINESS_REQUEST:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findFactorBusinessRequest'),
		// 查询上传的文件
		FIND_REQUEST_FILE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findCustAduitTemp'),
		// 查询电子合同服务商
		FIND_ELECAGREEMENT_SERVICECUST:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findElecAgreementServiceCust'),
		// 添加保理客户关系
		ADD_FACTOR_CUST_RELATION:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/addFactorCustRelation'),
		// 添加客户文件关系
		SAVE_CUSTADUIT_TEMP_FILE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/saveCustAduitTempFile'),
		// 查询关联的附件列表
		FIND_RELATEADUIT_TEMP_FILE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findRelateAduitTempFile'),
		// 受理审批
		SAVE_ACCEPT_ADUIT:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/saveAcceptAduit'),
		// 查询审批记录
		FIND_CUST_RELATEADUIT_RECORD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelationConfig/findCustRelateAduitRecord'),

		// 合同类型登记
		ADD_AGREEMENT_TYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/addAgreementType'),
		// 登记合同类型查询
		QUERY_REGISTERED_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/queryRegisteredAgreementType'),
		// 编辑合同类型
		EDIT_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveModifyAgreementType'),
		// 删除合同类型
		DELETE_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveDeleteAgreementType'),
		// 查询待启用合同
		QUERY_UNENABLE_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/queryUnEnableAgreementType'),
		// 启用合同类型
		ENABLE_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveEnableAgreementType'),
		// 查询合同类型
		QUERY_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/queryAgreementType'),
		// 查询已启用合同类型
		FIND_ENABLE_AGREEMENTTYPE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/findEnableAgreementType'),

		// 编辑标准合同
		EDIT_AGREEMENT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveModifyAgreementStandard'),
		// 删除标准合同
		DELETE_AGREEMENT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveDeleteAgreementStandard'),
		// 查询审核标准合同
		QUERY_AGREEMENT_STANDARD_BYSTATUS:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/queryAgreementStandardByStatus'),
		// 启用标准合同
		ENABLE_AGREEMENT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveEnableAgreementStandard'),
		// 停用合同类型
		DISENABLE_AGREEMENT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/saveDisableAgreementStandard'),
		// 查询标准合同
		QUERY_AGREEMENT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/Agreement/queryAgreementStandard'),
		
		// 平台查询客户信息
		QUERY_CUSTINFO_PLATFORM:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/Account/queryCustInfoByPlatform'),
		// 保理公司查询客户信息
		QUERY_CUSTINFO_FACTOR:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/CustRelation/queryCustInfoByFactor'),
		
		// 分页查询贸易合同台台账信息
		QUERY_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/queryContractLedger'),
		// 查询客户信息
		FIND_CONTRACT_LEDGER_CUSTINFO:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/findContractLedgerCustInfoByCustNo'),
		// 添加合同台账
		ADD_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/addContractLedger'),
		// 查询合同台账信息
		FIND_CONTRACT_LEDGERINFO:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/findContractLedgerByContractId'),
		// 查询合同客户信息根据合同编号查询
		FIND_CONTRACT_LEDGER_CONTRACTID:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/findContractLedgerCustInfoByCustNoAndContractId'),
		// 查询合同附件信息
		FIND_CONTRACT_LEDGER_CUSTFILEITEMS:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/findContractLedgerCustFileItems'),
		// 编辑合同信息
		SAVE_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/saveContractLedger'),
		// 作废合同
		SAVE_CONTRACT_LEDGER_STATUS:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/saveContractLedgerStatus'),
		// 查询记录
		FIND_CONTRACT_LEDGER_RECODE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/ContractLedger/findContractLedgerRecode'),
		// 删除贸易合同
		DELETE_CONTRACT_AGREE:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Scf/CustAgree/deleteContractAgree'),
		// 登记标准合同查询
		QUERY_REGISTERED_CONTRANCT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/ContractStandardType/queryUnEnableContractStandardType'),
		// 标准额合同登记
		ADD_CONTRANCT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/ContractStandardType/addContractStandards'),
		// 编辑标准合同
		EDIT_CONTRANCT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/ContractStandardType/saveContractStandardType'),
		// 删除标准合同
		DELETE_CONTRANCT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/ContractStandardType/saveDeleteContractStandardType'),
		// 查询审核标准合同
		QUERY_AGREEMENT_CONTRANCT_BYSTATUS:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/ContractStandardType/queryUnEnableContractStandardType'),
		// 启用标准合同
		ENABLE_CONTRANCT_STANDARD:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Platform/ContractStandardType/saveEnableContractStandardType'),
		// 已启用的标准合同类型查询
		QUERY_CONTRACT_STANDARD_TYPEID_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStandardType/queryContractStandardType'),
		//查询审核标准合同
		QUERY_ALL_CONTRACT_STANDARD_LIST:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStandardType/queryAllContractStandardType'),
		//停用标准合同
		SAVE_STOP_CONTRACT_STANDARD:BTServerPath+ (_isTest?'/scf/testdata/oneBill.json':'/Platform/ContractStandardType/saveStopContractStandardType')

	};

});
