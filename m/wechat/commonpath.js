/*
公用路径配置模块
author binhg
*/
define(function(require,exports,module){
	var _isTest = window.isTest = location.href.indexOf('static') === -1?false:true;
	window.BTRootPath = 'https://static.qiejf.com/better/';
	window.BTServerPath = function(){//js获取项目根路径，如： http://localhost:8083/uimcardprj
			    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
			    var curWwwPath=window.document.location.href;
			    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
			    var pathName=window.document.location.pathname;
			    var pos=curWwwPath.indexOf(pathName);
			    //获取主机地址，如： http://localhost:8083
			    var localhostPaht=curWwwPath.substring(0,pos);
			    //获取带"/"的项目名，如：/uimcardprj
			    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
			    //兼容BFS代理路径
			    var BFSPath = location.href.indexOf('qiejf') > 0 || location.href.indexOf('.net') > 0 ? '':'/better';

			    // var BFSPath = location.href.indexOf('qiejf') > 0 || location.href.indexOf('natapp') > 0? '':'/better';
			    // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
			    // 	BFSPath += '/'+window.parent.pathFlag.path;
			    // }
			    return(localhostPaht+projectName+BFSPath);
			}();

	module.exports = window.BTPATH = {
		

		// 新首页接口
		// 查询新融资模式大接口信息
		Query_All_Info:BTServerPath+ (_isTest?'/wechat/testdata/queryAllInfo.json':'/Wechat/WorkFlow/queryCurrentTaskCount'),
		// 查询保理产品下拉信息
		Query_Product_List:BTServerPath+ (_isTest?'/wechat/testdata/queryProductList.json':'/Wechat/WorkFlow/queryCurrentTaskCount'),
		// 查询保理产品下的资产配置信息
		Query_Asset_Dict:BTServerPath+ (_isTest?'/wechat/testdata/assectList.json':'/Wechat/WorkFlow/queryCurrentTaskCount'),
		// 查询银行账户下拉信息
		Query_Bank_List:BTServerPath+ (_isTest?'/wechat/testdata/queryBankList.json':'/Wechat/WorkFlow/queryCurrentTaskCount'),
		// 查询当前任务数量
		QUERY_WORKFLOW_CURRENT_TASK_COUNT:BTServerPath+ (_isTest?'/wechat/testdata/queryCurrentTaskCount.json':'/Wechat/WorkFlow/queryCurrentTaskCount'),
		// 操作员 公司信息
		FIND_OPERATOR_CUSTINFO:BTServerPath+ (_isTest?'/wechat/testdata/findOperateInfo.json':'/Wechat/Operator/findOperCustInfo'),
		// 操作员详细信息
		FIND_OPERATOR_DETAILINFO:BTServerPath+ (_isTest?'/wechat/testdata/findOperateInfo.json':'/Wechat/Operator/findOperatorInfo'),

		// find credit sum
		FIND_CREDIT_SUM:BTServerPath+ (_isTest?'/wechat/testdata/findCreditSum.json':'/Wechat/Scf/Credit/findCreditSum'),

		// 统计未读消息数量
		COUNT_UNREAD_NOTIFICATION:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Notification/countUnreadNotification'),

		// 置为只读 
		SET_NOTICE_READ:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Notice/setReadNotice'),

		// 置为只读 
		SET_NOTIFICATION_READ:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Notification/setReadNotificationStatus'),

		/*融资模式 1，2*/
		//新增融资
		
		SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTTOTAL:BTServerPath+ (_isTest?'/wechat/testdata/unreadNoticeList.json':'/WeChat/Scf/ReceivableRequest/saveAddRequestTotal'),
		//供应商确认提交申请
		SAVE_RECEIVABLE_REQUEST_SAVESUBMITREQUESTTOTAL:BTServerPath+ (_isTest?'/wechat/testdata/unreadNoticeList.json':'/WeChat/Scf/ReceivableRequest/saveSubmitRequestTotal'),
		//查询单条申请详情
		FIND_RECEIVABLE_REQUEST_FINDONEYBYREQUESTNO:BTServerPath+ (_isTest?'/wechat/testdata/unreadNoticeList.json':'/WeChat/Scf/ReceivableRequest/findOneByRequestNo'),
		//更加应收账款查询融资信息
		FIND_RECEIVABLE_REQUEST_FINDREQUESTBYRECEIVABLEID:BTServerPath+ (_isTest?'/wechat/testdata/unreadNoticeList.json':'/WeChat/Scf/ReceivableRequest/findOneByReceivableId'),
		//查询企业银行账号列表queryBankAccountKeyAndValue
		QUERY_ACCOUNT_QUERYACCOUNTKEYANDVALUE:BTServerPath+ (_isTest?'/wechat/testdata/queryBankList.json':'/WeChat/Scf/ReceivableRequest/queryBankAccountKeyAndValue'),
		//查询单个企业帐号信息findCustMechBankAccount
		FIND_ACCOUNT_FINDCUSTMECHBANKACCOUNT:BTServerPath+ (_isTest?'/wechat/testdata/unreadNoticeList.json':'/WeChat/Scf/ReceivableRequest/findCustMechBankAccount'),
		
		/*应付账款相关接口*/  
		//应付账款查询/queryCanUseProduct
		QUERY_COREPRODUCTCUST_QUERYCANUSEPRODUCT:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/WeChat/Scf/coreProductCust/queryCanUseProduct'),

		/*查询附件列表*/
		
		FIND_CUSTFILE_FILELIEBYBATCHNO:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/WeChat/Cust/File/fileListByBatchNo'),
		
		/*保理产品*/
		//查询核心企业分配给供应商的保理产品

		QUERY_RECEIVABLEDO_WECHAT_QUERYRECEIVABLEDO:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/WeChat/Scf/ReceivableDO/queryReceivableDO'),
		//查询保理产品下面的详细信息  findAssetDictByProduct
		FIND_COREPRODUCTCUST_FINDASSETDICTBYPRODUCT:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/WeChat/Scf/coreProductCust/findAssetDictByProduct'),

		/*公告|消息 相关*/

		//未读公告消息列表
		QUERY_UNREAD_NOTICE_LIST:BTServerPath+ (_isTest?'/wechat/testdata/unreadNoticeList.json':'/Wechat/Notice/queryUnreadNotice'),
		//已读公告消息列表
		QUERY_READ_NOTICE_LIST:BTServerPath+ (_isTest?'/wechat/testdata/readNoticeList.json':'/Wechat/Notice/queryReadNotice'),
		//公告消息详情
		QUERY_DETAIL_NOTICE:BTServerPath+ (_isTest?'/wechat/testdata/detailNotice.json':'/Wechat/Notice/findNotice'),
		// 公告置已读
		SET_READ_NOTICE:BTServerPath+ (_isTest?'/wechat/testdata/detailNotice.json':'/Wechat/Notice/setReadNotice'),

		//未读个人消息列表
		QUERY_UNREAD_PERSONAL_LIST:BTServerPath+ (_isTest?'/wechat/testdata/unreadPersonalList.json':'/Wechat/Notification/queryUnreadNotification'),
		//已读个人消息列表
		QUERY_READ_PERSONAL_LIST:BTServerPath+ (_isTest?'/wechat/testdata/readPersonalList.json':'/Wechat/Notification/queryReadNotification'),
		//个人消息详情
		QUERY_DETAIL_PERSONAL:BTServerPath+ (_isTest?'/wechat/testdata/detailNotice.json':'/Wechat/Notification/findNotification'),
		//消息置已读
		SET_READ_NOTIFICATION:BTServerPath+ (_isTest?'/wechat/testdata/detailNotice.json':'/Wechat/Notification/setReadNotificationStatus'),


		// 统计未读消息数量
		COUNT_UNREAD_NOTICE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Notice/countUnreadNotice'),

		// 操作员信息
		FIND_OPERATOR_INFO:BTServerPath+ (_isTest?'/wechat/testdata/findOperateInfo.json':'/Wechat/Operator/findOperatorInfo'),


		// 首次交易密码
		CHECK_FRISTLOGIN_TRADEPASS:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/checkFristTradePass'),

		/* 流程任务 */
		// 启动流程
		START_WORKFLOW_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/startWorkFlow'),
		// 查询当前任务
		QUERY_WORKFLOW_CURRENT_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/queryCurrentTask'),
		// 查询历史任务
		QUERY_WORKFLOW_HISTORY_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/queryHistoryTask'),
		// 查询监控任务
		QUERY_WORKFLOW_MONITOR_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/queryMonitorTask'),
		// 审批通过
		PASS_WORKFLOW_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/passWorkFlow'),
		// 审批驳回
		REJECT_WORKFLOW_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/rejectWorkFlow'),
		// 经办节点
		HANDLE_WORKFLOW_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/handleWorkFlow'),
		// 作废流程
		CANCEL_WORKFLOW_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/cancelWorkFlow'),
		// 保存流程数据
		SAVE_WORKFLOW_TASK:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/saveWorkFlow'),
		// 查询审批记录列表
		QUERY_WORKFLOW_AUDIT_LIST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/queryAuditRecord'),
		// 查询待驳回列表
		QUERY_WORKFLOW_REJECT_NODE_LIST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/queryRejectNode'),


		// 查询企业信息 /Wechat/CustRelation/findCustInfo
		QUERY_CUST_INFO:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/CustRelation/findCustInfo'),
		// 开通保理业务 /Wechat/CustRelation/saveRelation
		SAVE_FACTOR_RELATION:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/CustRelation/saveRelation'),
		//获取保理公司下拉数据
		CUST_RELATION:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/CustRelation/queryFactorRelation'),
		// 查询本公司已关联保理公司数据
		QUERY_OPENED_FACTOR:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/CustRelation/queryOpendFactor'),

		//查询票据询价列表
		QUERY_BILL_ENQUIRY_LIST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/querySingleOrderEnquiryList'),
		//查询询价详情
		QUERY_BILL_ENQUIRY_DETAIL:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/findSingleOrderEnquiryDetail'),
		//查询报价列表
		QUERY_OFFER_BY_ENQUIRY_OBJECT:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/queryOfferByEnquiryObject'),
		//分页查询报价记录
		QUERY_BILL_OFFER_LIST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/queryOfferList'),
		//无分页查询报价记录
		SEARCH_OFFER_LIST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/searchOfferList'),
		//查询询价对象
		QUERY_ENQUIRY_OBJECT:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/queryEnquiryObject'),
		//根据报价id查询报价详情
		FIND_OFFER_DETAIL:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/findOfferDetail'),
		//回复报价
		ADD_OFFER_REPLY:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/addOfferReply'),
		//询价方-放弃资金方提供的报价
		CUST_DROP_ENQUIRY:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/custDropOffer'),
		//保存询价
		ADD_ENQUIRY:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Enquiry/addEnquiry'),

		//微信融资申请******************************************************************************************
		STAR_TWORK_FLOW:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/WorkFlow/startWorkFlow'),
		//查询标的物
		FIND_SUBJECT_MASTER:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/findSubjectMaster'),
		//查询产品
		FIND_PRODUCT_LIST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/findProductList'),
		//授信列表
		FIND_CREDIT:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/findCreditList'),
		//查询保理公司列表
		QUERY_FACTOR_KEY_AND_VALUE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/queryFactorKeyAndValue'),
		//微信端查询当前用户类型
		GET_CURRENT_ROLE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/getCurrentRole'),
		//微信端查询协议列表
		FIND_ELEC_AGREE_BY_REQUESTNO:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ElecAgree/findElecAgreeByRequestNo'),
		//微信端查询保理方案
		FIND_SCHEME:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/findScheme'),
		//微信端查询其它资料列表
		QUERY_OTHER_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/queryOtherFile'),
		//微信端查询融资材料列表
		QUERY_REQUEST_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/queryRequestFile'),
		//微信端查根椐标的物查询申请信息
		FIND_REQUEST_BY_INFOID:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/findRequestByInfoId'),
		//微信端根椐标的物查询申请信息
		QUERY_FINANCE_DETAIL:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/findRequestByNo'),
		//微信端查询融资列表
		QUERY_REQUEST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Application/queryRequest'),
		//查询其它资料
		QUERY_OTHER_FILE_LIST:BTServerPath+ (_isTest?'/scf/testdata/queryPayRecordList.json':'/Wechat/Scf/Application/queryOtherFile'),
		//根据申请单号 查询 附件列表（融资申请材料）
		//QUERY_REQUEST_ATTACH_LIST:BTServerPath+ (_isTest?'/scf/testdata/findRequestBaseInfoFileList.json':'/Wechat/Scf/Application/findRequestBaseInfoFileList'),

		//微信融资申请******************************************************************************************



		/*公用基础接口*/
		QUERY_ATTACHMENT_LIST:BTServerPath+ (_isTest?'/scf2/testdata/attachmentList.json':'/Platform/CustFile/fileListByBatchNo'),

		//获取登录信息
		GET_LOGIN_INFO:BTServerPath+ (_isTest?'/wechat/testdata/findWechatLoginInfo.json':'/Platform/BaseInfo/findWechatLoginInfo'),
		
		/*票据池相关接口*/
		QUERY_LIST_BILL:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/WeChat/Scf/AcceptBill/queryAcceptBill'),

		//查询单个票据详情
		QUERY_ONE_BILL:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/WeChat/Scf/AcceptBill/findAcceptBillDetailsById'),

		//查看合同详细信息
		QUERY_CONTRACT_DetailInfo:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ElecAgree/findAgreePage'),
		
		//查看图片版的合同信息
		QUERY_CONTRACT_IMG:BTServerPath+ (_isTest?'/img/contract/1.jpeg':'/Wechat/Scf/ElecAgree/downloadAgreeImage'),
		// QUERY_CONTRACT_IMG:BTServerPath+ (_isTest?'/wechat/img/contract':'/wechat/img/contract'),

		//查询票据相关附件
		QUERY_BILL_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/WeChat/Scf/AcceptBill/findAllFile'),

		//检查票据是否可用		
		CHECK_INFO_COMPLETED:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Scf/Order/checkInfoCompleted'),

		//保存票据相关附件
		SAVE_BILL_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/WeChat/Scf/AcceptBill/saveSingleFileLink'),

		//微信端添加票据附件
		SAVE_WECHAT_BILL_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/WeChat/Scf/AcceptBill/saveBillFile'),

		//根据票据id查询单个融资详情
		QUERY_ONE_FINANCE_BYBILLID:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/Wechat/Scf/Request/findRequestByBill'),

		//根据申请单查询单个融资详情
		QUERY_ONE_FINANCE_BYNO:BTServerPath+ (_isTest?'/scf/testdata/coreBill.json':'/Wechat/Scf/Request/findRequestByNo'),

		//查询可选保理产品
		QUERY_PRODUCT_SELECT_LIST:BTServerPath+ (_isTest?'/wechat/testdata/findFactorProductKeyAndValue.json':'/Wechat/Scf/Product/queryProductElement'),

		//申请融资接口
		APPLY_FINANCE:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Scf/Request/addRequest'),

		//查询融资申请
		QUERY_LIST_FINANCE:BTServerPath+ (_isTest?'/wechat/testdata/queryRequest.json':'/Wechat/Scf/Request/queryRequestList'),

		//查看融资产品
		QUERY_INFO_PRODUCT:BTServerPath+ (_isTest?'/wechat/testdata/getFactorProduct.json':'/Wechat/Scf/Product/findProduct'),

		//获取微信签名
		GET_WX_SIGN:BTServerPath+ (_isTest?'/wechat/testdata/getJSSignature.json':'/Wechat/Platform/getJSSignature'),

		//获取注册微信签名
		GET_REGISTER_WX_SIGN:BTServerPath+ (_isTest?'/wechat/testdata/getJSSignature.json':'/Wechat/Platform/getJSSignature'),

		//开户相关接口
		OPEN_ACCOUNT:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/Enroll/addEnroll'),

		//注册保存关联附件
		SAVE_REHISTERPLUS_INFO:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/fileUpload'),
		
		//保存关联附件
		SAVE_PLUS_INFO:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/fileUpload'),

		//获取相关附件列表
		QUERY_UPLOAD_LIST:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/fileList'),

		//获取个人信息列
		QUERY_INFORMA_OBJECT:BTServerPath+ (_isTest?'/wechat/testdata/homeinforma.json':''),

		//验证是否拥有操作权限
		CHECK_IS_LOGIN:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/wxRequest/checkUser'),

		//下载相关附件接口
		DOWNLOAD_PLUS_FILE:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/fileDownload'),
		DOWNLOAD_FILE:BTServerPath + (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/fileDownload'),

		//查询相关开户信息
		QUERY_INFO_ACCOUNT:BTServerPath+ (_isTest?'/wechat/testdata/addRequest.json':'/Wechat/Platform/Enroll/findEnroll'),

		//查询签约列表
		QUERY_LIST_ELECAGREEMENT:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Wechat/Scf/ElecAgree/queryElecAgreement'),

		//查询合同详细信息
		FIND_ELECAGREEMENTINFO:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ElecAgree/findElecAgreeInfo'),
		
		//获取验证码
		FIND_VALIDCODE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ElecAgree/findValidCode'),

		//签署合同

		SEND_VALIDCODE_SENDVALIDCODE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ElecAgree/sendValidCode'),

		//确认融资方案
		SEND_VALIDCODE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/Request/confirmScheme'),

		//取消合同签约
		CANCELELECAGREEMENT:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ElecAgree/cancelElecAgreement'),

		// 查询客户关系信息
		QUER_CUST_RELATION:BTServerPath+ (_isTest?'/wechat/testdata/queryCustRelation.json':'/Wechat/Platform/CustRelationConfig/queryCustRelation'),
		// 查找客户关联类型
		FIND_CUST_TYPE:BTServerPath+ (_isTest?'/wechat/testdata/findCustType.json':'/Wechat/Platform/CustRelationConfig/findCustType'),
		//查找客户信息
		FIND_CUST_INFO:BTServerPath+ (_isTest?'/wechat/testdata/relationFindCustInfo.json':'/Wechat/Platform/CustRelationConfig/findCustInfo'),
		// 添加客户关系
		ADD_CUST_RELATION:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/addCustRelation'),

		//开户优化
		//查询开户成功信息
		FIND_SUCCESS_OPEN_ACCOUNT_TMP:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Account/findSuccessAccountInfo'),
		//开户暂存操作
		SAVE_OPEN_ACCOUNT:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Account/saveAccInfo'),
		//查询开户信息
		FIND_CUST_OPEN_ACCOUNT_TMP:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Account/findAccountTmpInfo'),
		//确认申请
		APPLY_OPEN_ACCOUNT:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Instead/wechatAddInsteadApply'),
		//保存单个附件
		SAVE_SINGLE_ACCOUNT_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Account/saveSingleFileLink'),
		//查询开户附件
		FIND_OPEN_ACCOUNT_FILEITEM:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Account/findAccountFileByBatChNo'),
		//根据开户信息ID 查询开户申请
		FIND_ACCOUNT_APPLY_BY_TMPIDS:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/Instead/findInsteadApplyByAccountTmpId'),
		//代录确认、激活
		PASS_CONFIRM_INSTEAD_APPLY:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Wechat/Platform/Instead/confirmPassInsteadRecord'),
		//开户获取验证码
		OPEN_ACCOUNT_VERIFY_CODE:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Wechat/Platform/Account/sendValidMessage'),
		//代录激活(开户优化)
		ACTIVE_OPEN_ACCOUNT:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Wechat/Platform/Instead/saveActiveOpenAccount'),
		//删除附件
		DELETE_SINGLE_FILE:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Wechat/Platform/Account/deleteSingleFile'),
		// 查询临时文件以及上传的类型列表
		FIND_CUST_ADUIT_TEMP:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/findCustAduitTemp'),
		// 查询电子合同服务商客户信息
		FIND_ELECAGREEMENT_SERVICE_CUST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/findElecAgreementServiceCust'),
		// 上传保理客户关系的附件信息
		ADD_CUST_FILEADUIT_TEMP:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/addCustAduitTempFile'),
		// 添加保理方客户关系
		ADD_FACTORCUST_RELATION:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/addFactorCustRelation'),
		// 保理关系附件删除
		DELETE_CUSTADUIT_TEMP_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/saveDeleteCustAduitTempFile'),
		// 查询审批记录
		FIND_CUST_RELATEADUIT_RECORD:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Platform/CustRelationConfig/findCustRelateAduitRecord'),
		// 分页查询合同台账信息
		QUERY_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/scf2/testdata/orderList.json':'/Wechat/Scf/ContractLedger/queryContractLedger'),
		// 根据合同编号查询
		FIND_CONTRACT_LEDGER_INFO:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/findContractLedgerByContractId'),
		// 修改状态
		SAVE_CONTRACT_LEDGER_STATUS:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/saveContractLedgerStatus'),
		// 删除合同
		DELETE_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/deleteContractById'),
		// 合同台账查询核心企业列表
		FIND_RELATION_CORE_CUST:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/findRelationCoreCust'),
		// 添加合同
		ADD_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/addContractLedger'),
		// 修改合同信息
		SAVE_CONTRACT_LEDGER:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/saveContractLedger'),
		// 查询合同附件信息
		FIND_CONTRACT_LEDGER_FILEINFO:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/findFileByContractId'),
		// 保理合同附件信息
		SAVE_CONTRACT_LEDGER_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/saveContractLedgerFile'),
		// 删除合同附件
		DELETE_CONTRACT_FILE:BTServerPath+ (_isTest?'/wechat/testdata/test.json':'/Wechat/Scf/ContractLedger/deleteContractFile'),
		// 查询当前登录的客户类型
		FIND_CUST_TYPE_LOGIN:BTServerPath+ (_isTest?'/scf2/testdata/findAllRole.json':'/Wechat/Platform/CustRelationConfig/findCustTypeByLogin'),


		
	};

});