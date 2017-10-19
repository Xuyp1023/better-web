/*
公用路径配置模块
author binhg
*/
define(function(require,exports,module){
	var _isTest = location.href.indexOf('static') === -1?false:true;

	module.exports = {
		/*净值列表*/
		SHARE_PATH : BTServerPath+ (_isTest?'/p/testdata/sharesList.json':'/SaleQuery/querySaleShares'),
		/*客户列表查询*/
		CUST_PATH : BTServerPath+ (_isTest?'/p/testdata/custInfo.json':'/SaleQuery/queryCustInfo'),
		/*基金行情列表*/
		AGENCY_FUND_PATH : BTServerPath+ (_isTest?'/p/testdata/agencyFundList.json':'/SaleQuery/queryAgencyFundName'),
		/*更新分红方式*/
		UPDATE_BONUS_PATH : BTServerPath+ (_isTest?'/p/testdata/agencyFundList.json':'/SaleTrade/modifyBonus'),


		/* 增开账户 */
		//获取已开户信息
		RELA_ACCO_INFO_PATH: BTServerPath+ (_isTest?'/p/testdata/AAqueryRelaAccoInfo.json':'/SaleQuery/queryRelaAccoInfo'),
		//获取已开户机构
		OPENED_AGENCY_PATH:BTServerPath+ (_isTest?'/p/testdata/AAqueryOpenedAgencyNoList.json':'/SaleQuery/queryOpenedAccountByBusinClass'),
		//交易账户列表
		TRADE_ACCOUNT_LIST:BTServerPath+ (_isTest?'/p/testdata/AAqueryCustInfo.json':'/SaleQuery/queryCustInfo'),
		//增开账户
		ADD_ACCOUNT_PATH:BTServerPath+ (_isTest?'/p/testdata/AAaddOrgAccount.json':'/SaleAccount/addOrgAccount'),
		//查看机构开户信息
		SALE_AGENCY_INFO_PATH:BTServerPath+ (_isTest?'/p/testdata/AAquerySaleAgencyInfoWithFile.json':'/SaleQuery/querySaleAgencyInfoWithFile'),
		//判断认证文件是否齐全
		CHECK_CUST_FILE_PATH:BTServerPath+ (_isTest?'/p/testdata/AAselectOrgPermit.json':'/CustAduit/checkCustFileByBusinFlag'),
		//增开余利宝账户
		ADD_YLB_ACCOUNT_PATH:BTServerPath+ (_isTest?'/p/testdata/AAaddOrgAccount.json':'/SaleAccount/addYlbAccount')

		
	};

});