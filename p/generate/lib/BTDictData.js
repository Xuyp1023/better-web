var BTDict = new BetterDictionary();
function BetterDictionary() {

		// 合同签署信息状态格式化
		this.PoolRecordBusinStatus = new ListMap();
		this.PoolRecordBusinStatus.set('0', "未处理");
		this.PoolRecordBusinStatus.set('1', "付款中");
		this.PoolRecordBusinStatus.set('2', "复核中");
		this.PoolRecordBusinStatus.set('3', "付款失败");
		this.PoolRecordBusinStatus.set('4', "付款成功");

		//付款文件状态
		this.PayFilecollectionStatus = new ListMap();
		this.PayFilecollectionStatus.set('1', "未确认");
		this.PayFilecollectionStatus.set('2', "已审核");

		//申请付款状态   0 初始状态    3付款失败 4 付款成功
		this.RequestPayStatus = new ListMap();
		this.RequestPayStatus.set('0', "未付款");
		this.RequestPayStatus.set('', "未付款");
		this.RequestPayStatus.set('3', "付款失败");
		this.RequestPayStatus.set('4', "付款成功");
		


		// 合同签署信息状态格式化
		this.ContractStatus = new ListMap();
		this.ContractStatus.set('0', "未处理");
		this.ContractStatus.set('1', "成功");
		this.ContractStatus.set('2', "失败");
		
		this.ContractTemplateOperType = new ListMap();
		this.ContractTemplateOperType.set('00', "上传标准合同文本");
		this.ContractTemplateOperType.set('01', "标准合同文本审核通过");
		this.ContractTemplateOperType.set('03', "标准合同文本审核驳回");
		this.ContractTemplateOperType.set('04', "上传标准合同模板");
		this.ContractTemplateOperType.set('05', "标准合同模板审核通过");
		this.ContractTemplateOperType.set('2', "已复核");

		this.CommissionPayResultStatus = new ListMap();
		this.CommissionPayResultStatus.set('0', "未确认");
		this.CommissionPayResultStatus.set('1', "未复核");
		this.CommissionPayResultStatus.set('2', "已复核");
		// 新的融资模式
		this.NewFinanceModel = new ListMap();
		this.NewFinanceModel.set('0', " ");
		this.NewFinanceModel.set('1', "采购方提前付款");
		this.NewFinanceModel.set('2', "结算中心提前付款");
		this.NewFinanceModel.set('3', "内部保理付款");
		this.NewFinanceModel.set('4', "银行保理");
		this.NewFinanceModel.set('5', "外部保理付款");

		//融资申请模式4  状态
		this.ReceivbaleRequestModeFourStatus = new ListMap();
		this.ReceivbaleRequestModeFourStatus.set('0', "待确权");
		this.ReceivbaleRequestModeFourStatus.set('1', "待银行确认");
		this.ReceivbaleRequestModeFourStatus.set('2', "已拒绝");

		//供应商电子合同类型
		this.ReceivableRequestAgreementTypeMap = new ListMap();
		this.ReceivableRequestAgreementTypeMap.set('0', "企e金服服务合同");
		this.ReceivableRequestAgreementTypeMap.set('1', "应收账款提前付款电子合同");
		this.ReceivableRequestAgreementTypeMap.set('2', "应收账款转让合同");


		this.VerifySignCertType = new ListMap();
		this.VerifySignCertType.set('0', "天安诚信证书");
		this.VerifySignCertType.set('1', "其他证书");

		this.VerifySignCertStatus = new ListMap();
		this.VerifySignCertStatus.set('0', '禁用');
		this.VerifySignCertStatus.set('1', '启用');

		this.ContractCorpAccountRegType = new ListMap();
		this.ContractCorpAccountRegType.set('2', '法人');
		this.ContractCorpAccountRegType.set('1', '代理人');

		this.ContractCorpAccountOrgRegType = new ListMap();
		this.ContractCorpAccountOrgRegType.set('0', '三证合一');
		this.ContractCorpAccountOrgRegType.set('1', '一证一码');

		this.ContractTemplateBusinStatus = new ListMap();
		this.ContractTemplateBusinStatus.set('00', '未使用');
		this.ContractTemplateBusinStatus.set('01', '未审核');
		this.ContractTemplateBusinStatus.set('02', '平台审核通过');
		this.ContractTemplateBusinStatus.set('03', '平台审核未通过');
		this.ContractTemplateBusinStatus.set('04', '平台模板已上传');
		this.ContractTemplateBusinStatus.set('05', '已生效');
		this.ContractTemplateBusinStatus.set('06', '客户审核未通过');

		this.ContractTemplateAuditStatus = new ListMap();
		this.ContractTemplateAuditStatus.set('00', '未审核');
		this.ContractTemplateAuditStatus.set('01', '审核通过');
		this.ContractTemplateAuditStatus.set('02', '审核未通过');

		this.ContractStamperBusinStatus = new ListMap();
		this.ContractStamperBusinStatus.set('00', '未生效');
		this.ContractStamperBusinStatus.set('01', '已生效');

		this.CommissionBusinStatus = new ListMap();
		//this.CommissionBusinStatus.set('0', '未生效');
		this.CommissionBusinStatus.set('1', '已确认');
		this.CommissionBusinStatus.set('2', '已生效');
		this.CommissionBusinStatus.set('3', '未投递');
		this.CommissionBusinStatus.set('4', '已投递');
		this.CommissionBusinStatus.set('9', '已作废');
		
		// 保理产品状态
		this.factoringPublishStatus = new ListMap();
		this.factoringPublishStatus.set('0', '未发布');
		this.factoringPublishStatus.set('1', '已发布');
		this.factoringPublishStatus.set('2', '已下架');
		//this.factoringPublishStatus.set('3', '草稿');

		//佣金文件状态  业务状态 0 未处理 1 已处理 2已审核 3删除 4:已作废
		this.commissionFileStatus = new ListMap();
		this.commissionFileStatus.set('0', '未处理');
		this.commissionFileStatus.set('1', '已处理');
		this.commissionFileStatus.set('2', '已审核');

		this.commissionFileStatus.set('4', '已作废');

		//电子合同状态  状态 0 未签署  1供应商已签 2采购商已签 3 作废

		this.requestagreementbusinstatusmap = new ListMap();
		this.requestagreementbusinstatusmap.set('0', '未签署');
		this.requestagreementbusinstatusmap.set('1', '供应商已签');
		this.requestagreementbusinstatusmap.set('2', '已签署');

		this.requestagreementbusinstatusmap.set('3', '已作废');


		//拜特确认当前记录是否合规 0 未确认  1 确认未通过 2 确认通过
		this.commissionFileConfirmStatus = new ListMap();
		this.commissionFileConfirmStatus.set('0', '未确认');
		this.commissionFileConfirmStatus.set('2', '确认通过');
		this.commissionFileConfirmStatus.set('1', '确认未通过');
		

		//拜特确认当前记录 1 确认未通过 2 确认通过
		this.commissionFileConfirmOperatorStatus = new ListMap();
		this.commissionFileConfirmOperatorStatus.set('2', '确认通过');
		this.commissionFileConfirmOperatorStatus.set('1', '确认未通过');
		


		//佣金记录状态  业务状态 0 未处理 1 已审核(最终可供 拜特支付状态) 2已支付 3删除

		this.commissionQueryRecordStatus = new ListMap();
		this.commissionQueryRecordStatus.set('0', '未审核');
		this.commissionQueryRecordStatus.set('1', '已审核');
		this.commissionQueryRecordStatus.set('2', '已支付');

		this.commissionRecordStatus = new ListMap();
		this.commissionRecordStatus.set('0', '未确认');
		this.commissionRecordStatus.set('1', '已确认');
		this.commissionRecordStatus.set('2', '已审核');
		this.commissionRecordStatus.set('3', '已生成日报表');

		this.commissionFileRESOLVEStatus = new ListMap();
		this.commissionFileRESOLVEStatus.set('0', '处理失败');
		this.commissionFileRESOLVEStatus.set('1', '处理成功');


		//佣金支付状态 0 未处理 2 支付成功 1 支付失败
		this.commissionRecordPayStatus = new ListMap();
		this.commissionRecordPayStatus.set('0', '未处理');
		this.commissionRecordPayStatus.set('1', '付款成功');
		this.commissionRecordPayStatus.set('2', '付款失败');



		////投递对账单业务状态  0未处理  1已投递 2确认
		this.deliveryRecordStatus = new ListMap();
		this.deliveryRecordStatus.set('0', '未处理');
		this.deliveryRecordStatus.set('1', '已投递');
		this.deliveryRecordStatus.set('2', '已确认');
		//核心企业对账单状态
		this.deliveryRecordCoreCustStatus = new ListMap();
		this.deliveryRecordCoreCustStatus.set('1', '未确认');
		this.deliveryRecordCoreCustStatus.set('2', '已确认');

		//付款结果确认状态
		this.payResultStatus = new ListMap();
		this.payResultStatus.set('1', '未确认');
		this.payResultStatus.set('2', '已确认');

		//佣金发票状态  1 待开票  2 开票中  3 已开票   4 作废
		this.commissionInvoiceBusinStatus = new ListMap();
		this.commissionInvoiceBusinStatus.set('1', '待开票');
		this.commissionInvoiceBusinStatus.set('2', '开票中');
		this.commissionInvoiceBusinStatus.set('3', '已开票');
		this.commissionInvoiceBusinStatus.set('4', '已作废');

		//佣金发票状态  1 待开票  2 开票中  3 已开票   
		this.commissionInvoiceBusinStatusWithoutAnnul = new ListMap();
		this.commissionInvoiceBusinStatusWithoutAnnul.set('1', '待开票');
		this.commissionInvoiceBusinStatusWithoutAnnul.set('2', '开票中');
		this.commissionInvoiceBusinStatusWithoutAnnul.set('3', '已开票');


		//佣金发票的种类   0 普通发票  1 专用发票
		this.commissionInvoiceType = new ListMap();
		this.commissionInvoiceType.set('0', '普通发票');
		this.commissionInvoiceType.set('1', '专用发票');

		//发票抬头的类型  发票抬头的类型  1  企业     0个人
		this.commissionInvoiceCustInfoType = new ListMap();
		this.commissionInvoiceCustInfoType.set('0', '个人');
		this.commissionInvoiceCustInfoType.set('1', '企业');

		//是否默认  0 不是默认   1是默认
		this.commissionInvoiceCustInfoIsLaest = new ListMap();
		this.commissionInvoiceCustInfoIsLaest.set('0', '否');
		this.commissionInvoiceCustInfoIsLaest.set('1', '是');



		//票据状态0 未生效 1：已生效  2：已使用 3：转让 4废止 5 过期
		this.billVersionBusinStatus = new ListMap();
		this.billVersionBusinStatus.set('0', '未生效');
		this.billVersionBusinStatus.set('1', '已生效');
		this.billVersionBusinStatus.set('2', '已使用');
		this.billVersionBusinStatus.set('3', '已转让');
		this.billVersionBusinStatus.set('4', '已废止');
		this.billVersionBusinStatus.set('5', '已过期');

		//合同状态0 未生效 1：已生效  2：已使用 3：转让 4废止 
		this.ledgerVersionBusinStatus = new ListMap();
		this.ledgerVersionBusinStatus.set('0', '未生效');
		this.ledgerVersionBusinStatus.set('1', '已生效');
		this.ledgerVersionBusinStatus.set('2', '已使用');
		this.ledgerVersionBusinStatus.set('3', '已转让');
		this.ledgerVersionBusinStatus.set('4', '已废止');
	


		//订单状态0 未核准 1：核准  2：已使用 3：转让 4废止 5 过期
		this.orderVersionBusinStatus = new ListMap();
		this.orderVersionBusinStatus.set('0', '未生效');
		this.orderVersionBusinStatus.set('1', '已生效');
		this.orderVersionBusinStatus.set('2', '已使用');
		this.orderVersionBusinStatus.set('3', '转让');
		this.orderVersionBusinStatus.set('4', '废止');
		this.orderVersionBusinStatus.set('5', '过期');

		//生效的查询状态（订单，应收账款，发票，票据）
		this.effectiveVersionBusinStatus = new ListMap();
		this.effectiveVersionBusinStatus.set('1', '已生效');
		this.effectiveVersionBusinStatus.set('2', '已使用');
		this.effectiveVersionBusinStatus.set('3', '转让');
		this.effectiveVersionBusinStatus.set('4', '废止');
		this.effectiveVersionBusinStatus.set('5', '过期');

		//同上改
		this.eeffectiveVersionBusinStatus = new ListMap();
		this.eeffectiveVersionBusinStatus.set('1', '已生效');
		this.eeffectiveVersionBusinStatus.set('2', '已使用');
		this.eeffectiveVersionBusinStatus.set('3', '转让');
		this.eeffectiveVersionBusinStatus.set('5', '过期');

		//生效订单供应商显示使用状态
		this.effectiveVersionUsingBusinStatus = new ListMap();
		this.effectiveVersionUsingBusinStatus.set('0', '不可用');
		this.effectiveVersionUsingBusinStatus.set('1', '正常');
		this.effectiveVersionUsingBusinStatus.set('2', '冻结');
		this.effectiveVersionUsingBusinStatus.set('3', '已使用');
		this.effectiveVersionUsingBusinStatus.set('4', '不可用');
		this.effectiveVersionUsingBusinStatus.set('5', '不可用');

		//生效订单供应商显示使用状态 用于查询
		this.effectiveVersionUsingBusinStatusForSearch = new ListMap();
		this.effectiveVersionUsingBusinStatusForSearch.set('5', '不可用');
		this.effectiveVersionUsingBusinStatusForSearch.set('1', '正常');
		this.effectiveVersionUsingBusinStatusForSearch.set('2', '冻结');
		this.effectiveVersionUsingBusinStatusForSearch.set('3', '已使用');


		//发票使用状态
		this.invoiceVersionLockedStatus = new ListMap();
		this.invoiceVersionLockedStatus.set('0', '未使用');
		this.invoiceVersionLockedStatus.set('1', '已使用');


		this.ProductConfigStatus = new ListMap();
		this.ProductConfigStatus.set('0', '未发布');
		this.ProductConfigStatus.set('1', '已发布');
		this.ProductConfigStatus.set('2', '已下架');
		this.ProductConfigStatus.set('3', '草稿');

		// 融资标的清单设置类型
		this.FinancerTypeList = new ListMap();
		this.FinancerTypeList.set('0','辅助材料');
		this.FinancerTypeList.set('1','主体资产');	

			  //是否自动发布询价
		  this.BusinessTypeCredit = new ListMap();
		  this.BusinessTypeCredit.set('1','是');
		  this.BusinessTypeCredit.set('0','否');
        
        //合同原型模板
		this.ContractTempType = new ListMap();
		this.ContractTempType.set('billTransNotice', '应收账款转让通知书');
		this.ContractTempType.set('buyerConfirm', '应收账款转让确认意见书');
		this.ContractTempType.set('threePartProtocol', '三方协议');
		this.ContractTempType.set('receivableRequestProtocolModel1', '应付账款提前回款协议书');
		this.ContractTempType.set('receivableRequestProtocolModel2', '应付账款提前回款协议书(结算中心)');

        //合同原型模板状态
		this.ContractTemplateStatus = new ListMap();
		this.ContractTemplateStatus.set('0', '禁用');
		this.ContractTemplateStatus.set('1', '启用');

		this.WorkFlowAuditResultType = new ListMap();
		this.WorkFlowAuditResultType.set('0', '通过');
		this.WorkFlowAuditResultType.set('1', '驳回');
		this.WorkFlowAuditResultType.set('2', '办理');
		this.WorkFlowAuditResultType.set('3', '作废');

		this.WorkFlowNodeType = new ListMap();
		this.WorkFlowNodeType.set('0', '开始');
		this.WorkFlowNodeType.set('1', '结束');
		this.WorkFlowNodeType.set('2', '经办');
		this.WorkFlowNodeType.set('3', '审批');
		this.WorkFlowNodeType.set('4', '子流程');

		this.WorkFlowBaseDisableStatus = new ListMap();
		this.WorkFlowBaseDisableStatus.set('0', '已启用');
		this.WorkFlowBaseDisableStatus.set('1', '已停用');

		this.WorkFlowBasePublishStatus = new ListMap();
		this.WorkFlowBasePublishStatus.set('0', '未发布');
		this.WorkFlowBasePublishStatus.set('1', '已发布');

		this.WorkFlowBaseLatestStatus = new ListMap();
		this.WorkFlowBaseLatestStatus.set('0', '-');
		this.WorkFlowBaseLatestStatus.set('1', '最新版');

		this.CoreCredict = new ListMap();
		this.CoreCredict.set('0', '不占用');
		this.CoreCredict.set('1', '占用');

		this.AssetDictSettleType = new ListMap();
		this.AssetDictSettleType.set('1', '核心企业资金系统');
		this.AssetDictSettleType.set('2', '供应商录入');

		this.AssestNature = new ListMap();
		this.AssestNature.set('1', '融资材料');
		this.AssestNature.set('2', '背景材料');

		this.DictType = new ListMap();
		this.DictType.set('1', '商业承兑汇票');
		this.DictType.set('2', '应付账款');
		this.DictType.set('3', '贸易合同');
		this.DictType.set('4', '商业发票');
		this.DictType.set('5', '采购订单或订货单');
		this.DictType.set('6', '对账单');
		this.DictType.set('7', '出货单或出库单');

		this.RequestData = new ListMap();
		this.RequestData.set('0', '无');
		this.RequestData.set('1', '有');

	    this.SupplierStatus = new ListMap();
	    this.SupplierStatus.set('0', '保理公司');
	    this.SupplierStatus.set('1', '核心企业');
	    this.SupplierStatus.set('5', '电子合同服务商');

	    this.SellerStatus = new ListMap();
	    this.SellerStatus.set('3', '保理公司');
	    this.SellerStatus.set('4', '核心企业');
	    this.SellerStatus.set('5', '电子合同服务商');

	    this.CoreStatus = new ListMap();
	    this.CoreStatus.set('1', '供应商');
	    this.CoreStatus.set('2', '保理公司');
	    this.CoreStatus.set('4', '经销商');
	    this.CoreStatus.set('5', '电子合同服务商');


		this.FactorParamRemotingStatus = new ListMap();
		this.FactorParamRemotingStatus.set('0', '平台模式');
		this.FactorParamRemotingStatus.set('1', '接口模式');

		this.FactorParamCreditStatus = new ListMap();
		this.FactorParamCreditStatus.set('0', '无需授信');
		this.FactorParamCreditStatus.set('1', '需要授信');

		//  证书状态  状态；0：创建，1：发布，2：已使用，9：回收
		this.CertX509Status = new ListMap();
		this.CertX509Status.set('0', '创建');
		this.CertX509Status.set('1', '已发布');
		this.CertX509Status.set('2', '已使用');
		this.CertX509Status.set('9', '已回收');

		// 客户证书 证书状态，0正常，1创建，2注销，3发布 9未启用。只有状态为9的情况下才允许更新token的值
		this.CustCertStatus = new ListMap();
		this.CustCertStatus.set('0', '正常');
		this.CustCertStatus.set('1', '创建');
		this.CustCertStatus.set('2', '已回收');
		this.CustCertStatus.set('3', '已发布');
		this.CustCertStatus.set('8', '微信');
		this.CustCertStatus.set('9', '启用');

		//基金交易状态相关
		this.FlowAuditStatus = new ListMap();
		this.FlowAuditStatus.set('0','未审批');
		this.FlowAuditStatus.set('1','审批中');
		this.FlowAuditStatus.set('2','同意');
		this.FlowAuditStatus.set('3','拒绝');
		this.FlowAuditStatus.set('4','作废');

		//询价方式;
		this.EnquiryMethod = new ListMap();
		this.EnquiryMethod.set('1','自动');
		this.EnquiryMethod.set('2','主动');

		//放弃询价原因;
		this.DropReason = new ListMap();
		this.DropReason.set('1','融资成本太高');
		this.DropReason.set('2','融资时间太长');
		this.DropReason.set('3','无资金要求');
		this.DropReason.set('4','操作太繁琐');

	    //询价策略;
	    this.ScfEnquiryStrategy = new ListMap();
	    this.ScfEnquiryStrategy.set('1','时间优先');
	    this.ScfEnquiryStrategy.set('2','成本优先');

		this.CustCertRuleList = new ListMap();
		this.CustCertRuleList.set('CORE_USER', '核心企业');
		this.CustCertRuleList.set('FACTOR_USER', '资金提供方');
		this.CustCertRuleList.set('SELLER_USER', '经销商');
		this.CustCertRuleList.set('SUPPLIER_USER', '供应商');
		this.CustCertRuleList.set('PLATFORM_USER', '平台商');

		this.CustCertPublishMode = new ListMap();
		this.CustCertPublishMode.set('0', '客户邮箱手机接收模式');
		this.CustCertPublishMode.set('1', '当前操作员接收模式');

		this.CustCertRevokeReason = new ListMap();
		this.CustCertRevokeReason.set('UNSPECIFIED', '未知原因');
		this.CustCertRevokeReason.set('KEY_COMPROMISE', '密码泄露');
		this.CustCertRevokeReason.set('CA_COMPROMISE', '证书泄露');
		this.CustCertRevokeReason.set('AFFILIATION_CHANGED', '主体信息改变');
		this.CustCertRevokeReason.set('SUPERSEDED', '证书已经被取代');
		this.CustCertRevokeReason.set('CESSATION_OF_OPERATION', '证书将不再使用');
		this.CustCertRevokeReason.set('CERTIFICATE_HOLD', '证书被搁置');
		this.CustCertRevokeReason.set('UNUSED', '未使用');
		this.CustCertRevokeReason.set('REMOVE_FROM_CRL', '从CRL移除');
		this.CustCertRevokeReason.set('PRIVILEGE_WITHDRAWN', '特权撤销');

	  //供应链金融核心企业(客户开户);
	  this.ScfCoreGroup = new ListMap();
	  this.ScfCoreGroup.set('102200336','广东德豪润达电气股份有限公司');


	  //开通保理状态;
	  this.FactorStatus = new ListMap();
	  this.FactorStatus.set('0','未开通保理融资业务');
	  this.FactorStatus.set('1','可开通保理融资业务');
	  this.FactorStatus.set('2','已开通保理融资业务');

	  //客户白名单状态;
	  this.CustWhitelistStatus = new ListMap();
	  this.CustWhitelistStatus.set('0','未开通');
	  this.CustWhitelistStatus.set('1','已申请');
	  this.CustWhitelistStatus.set('2','已受理');
	  this.CustWhitelistStatus.set('3','已审核');
	  this.CustWhitelistStatus.set('4','已驳回');

	  //白名单客户类型;
	  this.CustWhitelistType = new ListMap();
	  this.CustWhitelistType.set('0','供应商');
	  this.CustWhitelistType.set('2','核心企业');
	  this.CustWhitelistType.set('3','经销商');

	  //开通保理融资业务申请状态;
	  this.OpenFactorApplyStatus = new ListMap();
	  this.OpenFactorApplyStatus.set('0','申请提交成功');
	  this.OpenFactorApplyStatus.set('1','申请提交失败');

	  //开通保理融资业务审核状态;
	  this.OpenFactorAuditStatus = new ListMap();
	  this.OpenFactorAuditStatus.set('0','审核通过');
	  this.OpenFactorAuditStatus.set('1','审核驳回');

	  //供应链金融电子合同服务商;
	  this.ScfElecAgreementGroup = new ListMap();
	  this.ScfElecAgreementGroup.set('100000120','沃通电子认证服务有限公司');

	  //供应链金融保理机构;
	  this.ScfFactorGroup = new ListMap();
	  this.ScfFactorGroup.set('102202019','深圳前海特智商业保理有限公司');
	  this.ScfFactorGroup.set('102202020','百乐润小微保理(深圳)有限公司');

	  //供应链金融保理机构开户状态; （微信）
	  this.OpenFactorFinancingStatus = new ListMap();
	  this.OpenFactorFinancingStatus.set('0','未开通');
	  this.OpenFactorFinancingStatus.set('1','已申请');
	  this.OpenFactorFinancingStatus.set('2','已受理');
	  this.OpenFactorFinancingStatus.set('3','已开通');
	  this.OpenFactorFinancingStatus.set('4','被驳回');


	  //企业资料认证状态;
	  this.CompanyCertStatus = new ListMap();
	  this.CompanyCertStatus.set('0','未审批');
	  this.CompanyCertStatus.set('1','审批通过');
	  this.CompanyCertStatus.set('9','审批失败');
	  this.CompanyCertStatus.set('4','平台初审');
	  this.CompanyCertStatus.set('2','资料待完善');
	  this.CompanyCertStatus.set('3','审批中');

	  //注册资本区间;
	  this.RegCapitalRang = new ListMap();
	  this.RegCapitalRang.set('5','10000万以上');
	  this.RegCapitalRang.set('0','500万以下');
	  this.RegCapitalRang.set('4','5000万－10000万');
	  this.RegCapitalRang.set('2','1000万－3000万');
	  this.RegCapitalRang.set('3','3000万－5000万');
	  this.RegCapitalRang.set('1','500万－1000万');

	  //投资经历字典;
	  this.InvestExperience = new ListMap();
	  this.InvestExperience.set('0','无经验');
	  this.InvestExperience.set('1','1-3年');
	  this.InvestExperience.set('4','10年以上');
	  this.InvestExperience.set('3','5-10年');
	  this.InvestExperience.set('2','3-5年');


	  //消息模板类型
	  this.ProfileType = new ListMap();
	  this.ProfileType.set('0','平台');
	  this.ProfileType.set('1','保理公司');
	  this.ProfileType.set('2','核心企业');
	  this.ProfileType.set('3','供应商');
	  this.ProfileType.set('4','经销商');

	  //消息模板状态
	  this.NotificationProfileStatus = new ListMap();
	  this.NotificationProfileStatus.set('0','禁用');
	  this.NotificationProfileStatus.set('1','启用');

	  //消息发送渠道
	  this.NoticeSendChanel = new ListMap();
	  this.NoticeSendChanel.set('0','站内消息');
	  this.NoticeSendChanel.set('1','电子邮件');
	  this.NoticeSendChanel.set('2','短信');
	  this.NoticeSendChanel.set('3','微信');

	  //微信票据池融资状态
	  this.AcceptFinanceFlag = new ListMap();
	  this.AcceptFinanceFlag.set('0','未融资');
	  this.AcceptFinanceFlag.set('1','已融资');
	  this.AcceptFinanceFlag.set('2','收款');
	  this.AcceptFinanceFlag.set('3','已还款');
	  this.AcceptFinanceFlag.set('4','融资失败');

	  //微信票据池类型
	  this.BillMode = new ListMap();
	  this.BillMode.set('0','纸票');
	  this.BillMode.set('1','电票');

	  //微信开户企业类型
	  this.RegisterCompanyType = new ListMap();
	  this.RegisterCompanyType.set('SUPPLIER_USER','供应商');
	  this.RegisterCompanyType.set('SELLER_USER','采购商');


	  //机构类型;
	  this.OrganizationType = new ListMap();
	  this.OrganizationType.set('0','保险机构');
	  this.OrganizationType.set('1','基金公司');
	  this.OrganizationType.set('2','上市公司');
	  this.OrganizationType.set('3','信托公司');
	  this.OrganizationType.set('8','其他机构');
	  this.OrganizationType.set('5','理财产品');
	  this.OrganizationType.set('6','企业年金');
	  this.OrganizationType.set('7','社保基金');
	  this.OrganizationType.set('4','证券公司');

	  //核心企业列表
	  this.FactorCoreCustInfo = new ListMap();
	  this.FactorCoreCustInfo.set('biet;Supplychain Core Enterprise Key','深圳市拜特科技股份有限公司');

	  //企业性质;
	  this.EnterpriseNature = new ListMap();
	  this.EnterpriseNature.set('0','国企');
	  this.EnterpriseNature.set('1','民营');
	  this.EnterpriseNature.set('9','其它');
	  this.EnterpriseNature.set('3','境外资本');
	  this.EnterpriseNature.set('2','合资');

	  //国有属性;
	  this.NatureClassType = new ListMap();
	  this.NatureClassType.set('0','国务院国资委管辖');
	  this.NatureClassType.set('3','非国有');
	  this.NatureClassType.set('2','其他国有企业');
	  this.NatureClassType.set('1','地方国资委管辖');

	  //机构类别;
	  this.OrganizationCategory = new ListMap();
	  this.OrganizationCategory.set('01','企业法人');
	  this.OrganizationCategory.set('10','证券公司');
	  this.OrganizationCategory.set('03','事业法人');
	  this.OrganizationCategory.set('04','社团法人');
	  this.OrganizationCategory.set('05','工会法人');
	  this.OrganizationCategory.set('09','其他非金融机构法人');
	  this.OrganizationCategory.set('11','银行');
	  this.OrganizationCategory.set('12','信托投资公司');
	  this.OrganizationCategory.set('13','基金管理公司');
	  this.OrganizationCategory.set('14','保险公司');
	  this.OrganizationCategory.set('19','其他金融机构法人');
	  this.OrganizationCategory.set('21','普通合伙企业');
	  this.OrganizationCategory.set('22','特殊普通合伙企业');
	  this.OrganizationCategory.set('23','有限合伙企业');
	  this.OrganizationCategory.set('24','非法人非合伙制创投企业');
	  this.OrganizationCategory.set('31','境外一般机构');
	  this.OrganizationCategory.set('32','境外代理人');
	  this.OrganizationCategory.set('33','境外证券公司');
	  this.OrganizationCategory.set('34','境外基金公司');
	  this.OrganizationCategory.set('41','破产管理人');
	  this.OrganizationCategory.set('51','中国金融期货交易所');
	  this.OrganizationCategory.set('52','境外结算机构');
	  this.OrganizationCategory.set('99','其他');
	  this.OrganizationCategory.set('02','机关法人');

		//合同类型状态
		this.AgreementTypeStatus = new ListMap();
		this.AgreementTypeStatus.set('0','登记');
		this.AgreementTypeStatus.set('1','生效');
		//标准额合同状态
		this.AgreementStandardStatus = new ListMap();
		this.AgreementStandardStatus.set('0','登记');
		this.AgreementStandardStatus.set('1','生效');
		this.AgreementStandardStatus.set('2','停用');

	  //资本属性;
	  this.CapitalCategory = new ListMap();
	  this.CapitalCategory.set('1','境内资本');
	  this.CapitalCategory.set('9','其它资本');
	  this.CapitalCategory.set('3','境外资本');
	  this.CapitalCategory.set('2','三资（合资、合作、外资）');

	  //平台业务分类;
	  this.PlatformBusinClass = new ListMap();
	  this.PlatformBusinClass.set('fund','基金业务');
	  this.PlatformBusinClass.set('money','投资理财业务');
	  this.PlatformBusinClass.set('scf','供应链金融业务');

	  //业务种类;
	  this.BusinClassType = new ListMap();
	  this.BusinClassType.set('01','账户类业务');
	  this.BusinClassType.set('04','交易撤单');
	  this.BusinClassType.set('03','账户撤单');
	  this.BusinClassType.set('02','交易类业务');

	  //融资标志;
	  this.FinancingMark = new ListMap();
	  this.FinancingMark.set('0','未融资');
	  this.FinancingMark.set('3','已还款');
	  this.FinancingMark.set('2','收款');
	  this.FinancingMark.set('1','已融资');

	  //供应商经销商融资状态;
	  this.RequestQueryStatus = new ListMap();
	  this.RequestQueryStatus.set('3','已还款');
	  this.RequestQueryStatus.set('2','收款中');
	  this.RequestQueryStatus.set('1','待审批');

	  //融资申请状态;
	  this.FinancingAppStatus = new ListMap();
	  this.FinancingAppStatus.set('0','未处理');
	  this.FinancingAppStatus.set('1','待完善资料');
	  this.FinancingAppStatus.set('2','审批中');
	  this.FinancingAppStatus.set('3','待签约');
	  this.FinancingAppStatus.set('4','已签约');
	  this.FinancingAppStatus.set('X','融资失败');
	  this.FinancingAppStatus.set('6','还款中');
	  this.FinancingAppStatus.set('7','已逾期');
	  this.FinancingAppStatus.set('8','已还完');
	  this.FinancingAppStatus.set('9','已失效');
	  this.FinancingAppStatus.set('5','待录入流水号');

	  //新模式融资申请状态;   0 未生效 1供应商提交申请 2资金方签署合同    3 资金方确认付款  6完结  7废止 
	  this.newFinancingStatus = new ListMap();
	  this.newFinancingStatus.set('0','未生效');
	  this.newFinancingStatus.set('1','已申请');
	  this.newFinancingStatus.set('2','资金方已签署');
	  this.newFinancingStatus.set('3','确认付款');
	  
	  this.newFinancingStatus.set('6','完结');
	  this.newFinancingStatus.set('7','废止');
	  

	  //融资状态（新流程架构）
	  this.RequestLastStatus = new ListMap();
	  this.RequestLastStatus.set('0','终止');
	  this.RequestLastStatus.set('1','申请');
	  this.RequestLastStatus.set('2','审批');
	  this.RequestLastStatus.set('3','放款');
	  this.RequestLastStatus.set('4','还款');
	  this.RequestLastStatus.set('5','逾期');
	  this.RequestLastStatus.set('6','展期');
	  this.RequestLastStatus.set('7','坏账');
	  this.RequestLastStatus.set('8','结清');


	  //核心企业确认状态;
	  this.CoreConfirmStatus = new ListMap();
	  this.CoreConfirmStatus.set('0','未确认');
	  this.CoreConfirmStatus.set('2','否决');
	  this.CoreConfirmStatus.set('1','已确认');

	  //保理产品名称;
	  this.BillProductInfo = new ListMap();
	  this.BillProductInfo.set('BZ0001','德豪润达一号');

	  //融资类型;
	  this.FinancingAppType = new ListMap();
	  this.FinancingAppType.set('1','折扣方式融资');
	  this.FinancingAppType.set('2','比例方式融资');

	  //融资类型（来源）;
	  this.RaiseCapitalType = new ListMap();
	  this.RaiseCapitalType.set('1','订单');
	  this.RaiseCapitalType.set('2','票据');
	  this.RaiseCapitalType.set('3','应收账款');
	  this.RaiseCapitalType.set('4','经销商');



	  //融资申请状态
	  this.FinanceReqStatus = new ListMap();
	  //this.FinanceReqStatus.set('100','申请');
	  this.FinanceReqStatus.set('110','出具保理方案');
	  this.FinanceReqStatus.set('120','融资方确认方案');
	  this.FinanceReqStatus.set('130','融资背景确认');
	  this.FinanceReqStatus.set('140','核心企业确认背景 ');
	  this.FinanceReqStatus.set('150','放款确认');
	  this.FinanceReqStatus.set('160','放款完成');
	  this.FinanceReqStatus.set('170','逾期');
	  this.FinanceReqStatus.set('180','展期');
	  this.FinanceReqStatus.set('190','还款完成');

	  //核心企业确认状态
	  this.CoreCustAduitStatus = new ListMap();
	  this.CoreCustAduitStatus.set('-1','初始值');
	  this.CoreCustAduitStatus.set('0','待确认');
	  this.CoreCustAduitStatus.set('1','确认');
	  this.CoreCustAduitStatus.set('2','否定');
	  this.CoreCustAduitStatus.set('3','作废');


	  //场地类型
	  this.PremisesType = new ListMap();
	  this.PremisesType.set('0','自有');
	  this.PremisesType.set('1','租赁');

	  //企业类型
	  this.CorpType = new ListMap();
	  this.CorpType.set('0','国有企业');
	  this.CorpType.set('1','集体所有制企业');
	  this.CorpType.set('2','私营企业');
	  this.CorpType.set('3','股份制企业');
	  this.CorpType.set('4','联营企业');
	  this.CorpType.set('5','外商投资企业');
	  this.CorpType.set('6','港澳台投资企业');
	  this.CorpType.set('7','股份合作企业');


	  //待录申请类型
	  this.InsteadType = new ListMap();
	  this.InsteadType.set('0','开户代录');
	  this.InsteadType.set('1','变更代录');


	  //变更状态
	  this.ChangeApplyBusinStatus = new ListMap();
	  this.ChangeApplyBusinStatus.set('0','未审核');
	  this.ChangeApplyBusinStatus.set('1','审核通过');
	  this.ChangeApplyBusinStatus.set('2','审核驳回');
	  this.ChangeApplyBusinStatus.set('3','变更作废');


	  //变更项目
	  this.ChangeItem = new ListMap();
	  this.ChangeItem.set('0','公司基本信息');
	  this.ChangeItem.set('1','法人信息');
	  this.ChangeItem.set('2','股东信息');
	  this.ChangeItem.set('3','高管信息');
	  this.ChangeItem.set('4','营业执照');
	  this.ChangeItem.set('5','联系人信息');
	  this.ChangeItem.set('6','银行账户');
	  this.ChangeItem.set('9','资料认证信息');

	  //期限单位
	  this.PeriodUnit = new ListMap();
	  this.PeriodUnit.set('1','日');
	  this.PeriodUnit.set('2','月');

	  //审批步骤
	  this.AuditStepType = new ListMap();
  	  this.AuditStepType.set('0','审核代录申请');
  	  this.AuditStepType.set('1','复核代录信息');
  	  this.AuditStepType.set('2','确认代录信息');
  	  this.AuditStepType.set('3','代录提交');
  	  // this.AuditStepType.set('4','拒绝');

	  //审批结果
	  this.ApprovalResult = new ListMap();
	  this.ApprovalResult.set('0','下一步');
	  this.ApprovalResult.set('1','打回');
	  this.ApprovalResult.set('2','拒绝');

	  //放款结果(审批)
	  this.ApprovalLoanResult = new ListMap();
	  this.ApprovalLoanResult.set('0','放款成功，提交下一步');
	  this.ApprovalLoanResult.set('1','放款失败，打回上一步');
	  this.ApprovalLoanResult.set('2','拒绝');

	  //是否确认签约状态
	  this.ConfirmSignStatus = new ListMap();
	  this.ConfirmSignStatus.set('0','确认');
	  this.ConfirmSignStatus.set('2','拒绝');

	  //是否自动发布询价
	  this.AutoEnquiryStatus = new ListMap();
	  this.AutoEnquiryStatus.set('1','是');
	  this.AutoEnquiryStatus.set('2','否');

	  //黑名单状态
	  this.BlacklistStatus = new ListMap();
	  this.BlacklistStatus.set('0','未生效');
	  this.BlacklistStatus.set('1','已生效');

	  //黑名单类型
	  this.BlacklistType = new ListMap();
	  this.BlacklistType.set('0','个人');
	  this.BlacklistType.set('1','机构');

	  //授信客户类型
	  this.CreditType = new ListMap();
	  this.CreditType.set('1','供应商');
	  this.CreditType.set('2','经销商');
	  this.CreditType.set('3','核心企业');

	  //授信方式
	  this.CreditMode = new ListMap();
	  this.CreditMode.set('1','信用授信(循环)');
	  this.CreditMode.set('2','信用授信(一次性)');
	  this.CreditMode.set('3','担保授信(循环)');
	  this.CreditMode.set('4','担保授信(一次性)');

	  //授信状态
	  this.CreditStatus = new ListMap();
	  this.CreditStatus.set('0','未生效');
	  this.CreditStatus.set('1','已生效');
	  this.CreditStatus.set('2','已失效');

	  //授信额度变动方向
	  this.CreditChangeDirection = new ListMap();
	  this.CreditChangeDirection.set('0','收');
	  this.CreditChangeDirection.set('1','支');


	  //授信额度变动业务状态
	  this.CreditChangeBusinStatus = new ListMap();
	  this.CreditChangeBusinStatus.set('0','已完结');
	  this.CreditChangeBusinStatus.set('1','冻结中');

	  //出资形式
	  this.InvestmentType = new ListMap();
	  this.InvestmentType.set('0','货币');
	  this.InvestmentType.set('1','实物');
	  this.InvestmentType.set('2','无形资产');
	  this.InvestmentType.set('3','土地使用权');


	  //出资形式
	  this.ReportType = new ListMap();
	  this.ReportType.set('0','财务报表');
	  this.ReportType.set('1','应付账款');
	  this.ReportType.set('2','应收账款');

	  //纳税信息类型
	  this.TaxInfoType = new ListMap();
	  this.TaxInfoType.set('0','数据报表');
	  this.TaxInfoType.set('1','证明文件');

	  //担保方式
	  this.GuaranteeType = new ListMap();
	  this.GuaranteeType.set('0','保证');
	  this.GuaranteeType.set('1','抵押');
	  this.GuaranteeType.set('2','质押');
	  this.GuaranteeType.set('3','留置');
	  this.GuaranteeType.set('4','定金');
	  this.GuaranteeType.set('5','其它');

	  //合作方式
	  this.CooperationType = new ListMap();
	  this.CooperationType.set('0','企业合作网络');
	  this.CooperationType.set('1','战略联盟');
	  this.CooperationType.set('2','供需链管理');
	  this.CooperationType.set('3','企业集团');
	  this.CooperationType.set('4','业务外包');
	  this.CooperationType.set('5','虚拟企业');

	  //结算方式
	  this.SettlementType = new ListMap();
	  this.SettlementType.set('0','银行汇票');
	  this.SettlementType.set('1','商业汇票');
	  this.SettlementType.set('2','银行本票');
	  this.SettlementType.set('3','支票');
	  this.SettlementType.set('4','汇兑');
	  this.SettlementType.set('5','委托收款');
	  this.SettlementType.set('6','异地托收承付结算');

	  //询价状态
	  this.EnquiryStatusTypes = new ListMap();
	  this.EnquiryStatusTypes.set('-2','已融资');
	  this.EnquiryStatusTypes.set('-1','放弃');
	  this.EnquiryStatusTypes.set('0','未报价');
	  this.EnquiryStatusTypes.set('1','已报价');

	   //报价状态3：已，2：历史，1：报价，0：取消,-1：放弃
	  this.OfferStatusTypes = new ListMap();
	  this.OfferStatusTypes.set('3','已融资');
	  this.OfferStatusTypes.set('-1','已放弃');
	  this.OfferStatusTypes.set('0','取消');
	  this.OfferStatusTypes.set('1','已报价');
	  this.OfferStatusTypes.set('2','历史');

	    //报价状态：-2：已融资，-1：放弃，0：未报价，1：已报价
	  this.EnquiryObjectStatusTypes = new ListMap();
	  this.EnquiryObjectStatusTypes.set('-2','已融资');
	  this.EnquiryObjectStatusTypes.set('-1','已放弃');
	  this.EnquiryObjectStatusTypes.set('0','未报价');
	  this.EnquiryObjectStatusTypes.set('1','已报价');

	  //模板下载
	  this.BusinessInfoDownload = new ListMap();
	  this.BusinessInfoDownload.set('financeInfo','https://demo1.qiejf.com/better/Platform/CustFile/fileDownload?id=9126');
	  this.BusinessInfoDownload.set('paymentInfo','https://demo1.qiejf.com/better/Platform/CustFile/fileDownload?id=9126');
	  this.BusinessInfoDownload.set('tradeRecordInfo','https://demo1.qiejf.com/better/Platform/CustFile/fileDownload?id=9126');
	  this.BusinessInfoDownload.set('bankFlowInfo','https://demo1.qiejf.com/better/Platform/CustFile/fileDownload?id=9126');


	  //机构基本信息附件;
  	  this.CustBaseAttachment = new ListMap();
  	  this.CustBaseAttachment.set('CustIntro','企业简介');
  	  this.CustBaseAttachment.set('CustConstitution','公司章程');
  	  this.CustBaseAttachment.set('CustCapitalVerifyReport','验资报告');
  	  this.CustBaseAttachment.set('CustCreditReport','征信报告');
  	  this.CustBaseAttachment.set('CustOwnBrand','自有品牌');
  	  this.CustBaseAttachment.set('CustTrademark','商标');
  	  this.CustBaseAttachment.set('CustQualifyCert','资质证书');
  	  this.CustBaseAttachment.set('CustHonourCert','荣誉证书');
  	  this.CustBaseAttachment.set('CustAgencyCert','代理证书');
  	  this.CustBaseAttachment.set('CustEnviCert','环保证书');
  	  this.CustBaseAttachment.set('CustOpenAccountCard','开户申请表');
  	  this.CustBaseAttachment.set('CustStampCard','机构印鉴卡');
  	  this.CustBaseAttachment.set('Other','其他');

  	  //机构法人信息附件;
  	  this.CustLawAttachment = new ListMap();
  	  this.CustLawAttachment.set('RepresentIdHeadFile','法人身份证-头像面');
  	  this.CustLawAttachment.set('RepresentIdNationFile','法人身份证-国徽面');
  	  this.CustLawAttachment.set('RepresentIdHoldFile','法人身份证-手持证件');
  	  //机构股东信息附件;
  	  this.CustShareholderAttachment = new ListMap();
  	  this.CustShareholderAttachment.set('CustShareholderIdFile','股东身份证件复印件（加盖公章）');
  	  this.CustShareholderAttachment.set('CustShareholderAcademicCert','股东学历证书复印件');
  	  this.CustShareholderAttachment.set('Other','其他');

  	  //机构高管信息附件;
  	  this.CustManagerAttachment = new ListMap();
  	  this.CustManagerAttachment.set('CustManagerIdFile','高管身份证件复印件（加盖公章）');
  	  this.CustManagerAttachment.set('CustManagerAcademicCert','高管学历证书复印件');
  	  this.CustManagerAttachment.set('Other','其他');

  	  //机构营业执照附件;
  	  this.CustBusinLicenseAttachment = new ListMap();
  	  this.CustBusinLicenseAttachment.set('CustBizLicenseFile','营业执照证');
  	  this.CustBusinLicenseAttachment.set('CustTaxRegistFile','税务登记证');
  	  this.CustBusinLicenseAttachment.set('CustOrgCodeFile','组织机构代码证');
  	  //机构联系人附件;
  	  this.CustContacterAttachment = new ListMap();
 // 	  this.CustContacterAttachment.set('CustContacterIdFile','联系人身份证件复印件（加盖公章）');
  //	  this.CustContacterAttachment.set('Other','其他');
  	  this.CustContacterAttachment.set('CustContacterIdHeadFile','联系人身份证-头像面');
  	  this.CustContacterAttachment.set('CustContacterIdNationFile','联系人身份证-国徽面');
  	  this.CustContacterAttachment.set('CustContacterIdHoldFile','联系人身份证-手持证件');
  
	  
  	  //机构银行账户附件;
  	  this.CustBankAccountAttachment = new ListMap();
  	  this.CustBankAccountAttachment.set('CustBankOpenLicenseFile','银行账户开户许可证');

  	  //机构开户附件;
  	  this.CustOpenAccountAttachment = new ListMap();
  	  this.CustOpenAccountAttachment.set('CustIntro','企业简介');
  	  this.CustOpenAccountAttachment.set('CustConstitution','公司章程');
  	  this.CustOpenAccountAttachment.set('CustCapitalVerifyReport','验资报告');
  	  this.CustOpenAccountAttachment.set('CustCreditReport','征信报告');
  	  this.CustOpenAccountAttachment.set('CustOwnBrand','自有品牌');
  	  this.CustOpenAccountAttachment.set('CustTrademark','商标');
  	  this.CustOpenAccountAttachment.set('CustQualifyCert','资质证书');
  	  this.CustOpenAccountAttachment.set('CustHonourCert','荣誉证书');
  	  this.CustOpenAccountAttachment.set('CustAgencyCert','代理证书');
  	  this.CustOpenAccountAttachment.set('CustEnviCert','环保证书');
  	  this.CustOpenAccountAttachment.set('CustOpenAccountCard','开户申请表');
  	  this.CustOpenAccountAttachment.set('CustStampCard','机构印鉴卡');
  	  this.CustOpenAccountAttachment.set('CustRepresentIdFile','法人身份证件复印件（加盖公章）');
  	  this.CustOpenAccountAttachment.set('CustBizLicenseFile','营业执照证复印件（加盖公章）');
  	  this.CustOpenAccountAttachment.set('CustTaxRegistFile','税务登记证复印件（加盖公章）');
  	  this.CustOpenAccountAttachment.set('CustBankAcctAckFile','银行账户证明复印件（加盖公章）');
  	  this.CustOpenAccountAttachment.set('CustOrgCodeFile','组织机构代码证复印件（加盖公章）');
  	  this.CustOpenAccountAttachment.set('Other','其他');

  	  //机构开户方式
  	  this.CustOpenAccountWay = new ListMap();
  	  this.CustOpenAccountWay.set('0','自主开户');
  	  this.CustOpenAccountWay.set('1','平台代录');
  	  this.CustOpenAccountWay.set('2','微信平台代录');

  	  //代录附件;
  	  this.CustomerInsteadAttachment = new ListMap();
  	  this.CustomerInsteadAttachment.set('CustomerBaseInfo','公司基本信息资料');
  	  this.CustomerInsteadAttachment.set('CustomerBankInfo','公司银行账户资料');
  	  this.CustomerInsteadAttachment.set('CustomerLawInfo','公司法人信息资料');
  	  this.CustomerInsteadAttachment.set('CustomerSiteInfo','公司场地信息资料');
  	  this.CustomerInsteadAttachment.set('CustomerBusinLicenceInfo','公司营业执照资料');
  	  this.CustomerInsteadAttachment.set('CustomerContacterInfo','公司联系人资料');
  	  this.CustomerInsteadAttachment.set('CustomerShareholderInfo','公司股东资料');
  	  this.CustomerInsteadAttachment.set('CustomerManagerInfo','公司高管资料');
	  this.CustomerInsteadAttachment.set('CustomerContactInfo','公司联系信息');
  	  this.CustomerInsteadAttachment.set('CustomerOtherInfo','其他资料');

  	  //开户优化附件
  	  this.CustOpenAccountFile = new ListMap();
  	  this.CustOpenAccountFile.set('CustBizLicenseFile','营业执照');
  	  this.CustOpenAccountFile.set('CustOrgCodeFile','组织机构代码证');
  	  this.CustOpenAccountFile.set('CustTaxRegistFile','税务登记证');
  	  this.CustOpenAccountFile.set('CustCreditCodeFile','机构信用代码证');
  	  this.CustOpenAccountFile.set('CustBankOpenLicenseFile','银行账户开户许可证');
  	  this.CustOpenAccountFile.set('BrokerIdHeadFile','经办人身份证-头像面');
  	  this.CustOpenAccountFile.set('BrokerIdNationFile','经办人身份证-国徽面');
  	  this.CustOpenAccountFile.set('BrokerIdHoldFile','经办人身份证-手持证件');
	  	this.CustOpenAccountFile.set('RepresentIdHeadFile','法人身份证-头像面');
  	  this.CustOpenAccountFile.set('RepresentIdNationFile','法人身份证-国徽面');
  	  this.CustOpenAccountFile.set('RepresentIdHoldFile','法人身份证-手持证件');
  	  this.CustOpenAccountFile.set('CustOpenAccountFilePack','开户资料包');

	  //公告附件;
	  this.NoticeAttachment = new ListMap();
	  this.NoticeAttachment.set('NoticeAttachmentInfo','公告附件');

	  //消息通知附件;
	  this.NotificationAttachment = new ListMap();
	  this.NotificationAttachment.set('NotificationAttachmentInfo','消息通知附件');

	  //融资产品状态
	  this.FinanceProductStatus = new ListMap();
	  this.FinanceProductStatus.set('0','登记');
	  this.FinanceProductStatus.set('1','上架');
	  this.FinanceProductStatus.set('2','下架');
	  this.FinanceProductStatus.set('3','草稿');

	   this.FinanceTyped = new ListMap();
	   this.FinanceTyped .set('1','正向保理');

	   //操作方式
	  this.OperateWay = new ListMap();
	  this.OperateWay .set('1','正向保理');
	  this.OperateWay .set('2','反向保理');
	  
	  //保理类型
	  this.FactorType = new ListMap();
	  this.FactorType.set('1','国内有追索权保理');
	  this.FactorType.set('2','国内无追索权保理');

	   //操作方式
	  this.ActionModel = new ListMap();
	  this.ActionModel.set('1','正向保理');
	  this.ActionModel.set('2','反向保理');

 	  //融资类型
	  this.FinanceType = new ListMap();
	  this.FinanceType.set('1','应收账款保理');
	  this.FinanceType.set('2','商票保理');

	  //融资方式
	  this.FinanceModel = new ListMap();
	  this.FinanceModel.set('1','折扣方式');
	  this.FinanceModel.set('2','比例方式');

	  //发货单状态
	  this.DeliveryNoticeStatus = new ListMap();
	  this.DeliveryNoticeStatus.set('0','未使用');
	  this.DeliveryNoticeStatus.set('1','已使用');

	  //是否默认账户
	  this.IsDefaultAccount = new ListMap();
	  this.IsDefaultAccount.set('0','否');
	  this.IsDefaultAccount.set('1','是');

	  //代录项目类型
	  this.InsteadItem = new ListMap();
	  this.InsteadItem.set('0','公司基本信息');
	  this.InsteadItem.set('1','法人信息');
	  this.InsteadItem.set('2','股东信息');
	  this.InsteadItem.set('3','高管信息');
	  this.InsteadItem.set('4','营业执照');
	  this.InsteadItem.set('5','联系人信息');
	  this.InsteadItem.set('6','银行账户');
	  this.InsteadItem.set('7','开户代录');

	  //代录项目状态
	  this.InsteadRecordBusinStatus = new ListMap();
	  this.InsteadRecordBusinStatus.set('0','未录入');
	  this.InsteadRecordBusinStatus.set('1','已录入待复核');
	  this.InsteadRecordBusinStatus.set('2','已复核待确认');
	  this.InsteadRecordBusinStatus.set('3','复核驳回');
	  this.InsteadRecordBusinStatus.set('4','确认通过');
	  this.InsteadRecordBusinStatus.set('5','确认驳回');
	  this.InsteadRecordBusinStatus.set('6','资料作废');

	  //代录状态
	  this.InsteadApplyBusinStatus = new ListMap();
	  this.InsteadApplyBusinStatus.set('0','未受理');
	  this.InsteadApplyBusinStatus.set('1','已审核待录入');
	  this.InsteadApplyBusinStatus.set('2','审核驳回');
	  this.InsteadApplyBusinStatus.set('3','已录入待复核');
	  this.InsteadApplyBusinStatus.set('4','已复核待确认');
	  this.InsteadApplyBusinStatus.set('5','复核驳回');
	  this.InsteadApplyBusinStatus.set('6','确认通过');
	  this.InsteadApplyBusinStatus.set('7','确认驳回');
	  this.InsteadApplyBusinStatus.set('8','资料作废');


	  //通知发布状态
	  this.NoticePublishStatus = new ListMap();
	  this.NoticePublishStatus.set('0','暂存');
	  this.NoticePublishStatus.set('1','已发布');
	  this.NoticePublishStatus.set('2','已撤回');
	  this.NoticePublishStatus.set('3','已删除');


	  //文件附件业务类型;
	  this.BusinFileType = new ListMap();
	  this.BusinFileType.set('InvoiceAccessory','发票附件');
	  this.BusinFileType.set('agreeAccessory','合同附件');
	  this.BusinFileType.set('billAccessory','票据附件');
	  this.BusinFileType.set('authorizeFile','授权书');
	  this.BusinFileType.set('BrokerIdHeadFile','经办人身份证-头像面');
	  this.BusinFileType.set('BrokerIdHoldFile','经办人身份证-手持证件');
	  this.BusinFileType.set('BrokerIdNationFile','经办人身份证-国徽面');
	  this.BusinFileType.set('capitalReportFile','验资报告');
	  this.BusinFileType.set('companyCreditReport','企业征信报告');
	  this.BusinFileType.set('companyFinancialStatement','企业连续三期的财务报表');
	  this.BusinFileType.set('companyRule','公司章程');
	  this.BusinFileType.set('companyTaxCertificate','企业纳税证明');
	  this.BusinFileType.set('controllerIdFile','实际控制人身份证');
	  this.BusinFileType.set('corporationAuthorizeLetter','法人授权办理保理业务委托书');
	  this.BusinFileType.set('corporationBankAccountFlow','法人或实际控制人主要银行账户流水');
	  this.BusinFileType.set('corporationCertificate','法人证明书');
	  this.BusinFileType.set('corporationCreditReport','法人或实际控制人征信报告');
	  this.BusinFileType.set('coupleIdFile','法人或实际控制人配偶身份证');
	  this.BusinFileType.set('CustBankOpenLicenseFile','银行账户开户许可证');
	  this.BusinFileType.set('CustBizLicenseFile','营业执照附件');
	  this.BusinFileType.set('CustCreditCodeFile','机构信用代码证');
	  this.BusinFileType.set('custLogoFile','企业Logo附件');
	  this.BusinFileType.set('CustOpenAccountFilePack','开户资料包');
	  this.BusinFileType.set('CustOrgCodeFile','组织机构代码证');
	  this.BusinFileType.set('CustTaxRegistFile','税务登记证');
	  this.BusinFileType.set('officeSiteFile','办公场地附件文件');
	  this.BusinFileType.set('orderFlowFile','订单流水附件文件');
	  this.BusinFileType.set('otherFile','其它附件');
	  this.BusinFileType.set('proveAssetsFile','资产证明文件');
	  this.BusinFileType.set('RepresentIdHeadFile','法人身份证-头像面');
	  this.BusinFileType.set('RepresentIdHoldFile','法人身份证-手持证件');
	  this.BusinFileType.set('RepresentIdNationFile','法人身份证-国徽面');
	  this.BusinFileType.set('serviceContractFile','服务协议');
	  this.BusinFileType.set('shopBoardFile','店铺门头附件');
	  this.BusinFileType.set('shopSceneFile','店铺内景附件');
	  this.BusinFileType.set('signCertificateFile','沃通合同电子签名授权委托书');
	  this.BusinFileType.set('signedFile','已经签署的合同文件');
	  this.BusinFileType.set('signFile','合同签署文件');
	  this.BusinFileType.set('signStampFile','电子合同签署-印章文件');
	  this.BusinFileType.set('signTemplateFile','电子合同-模板');
	  this.BusinFileType.set('taxRegistFile','税务登记证附件');


	  //订单、应收、汇票相关附件
	  this.BaseInfoFile = new ListMap();
	  this.BaseInfoFile.set('otherFile','其他附件');
	  this.BaseInfoFile.set('orderFile','订单附件');
	  this.BaseInfoFile.set('invoiceFile','发票附件');
	  this.BaseInfoFile.set('receivableFile','应收账款附件');
	  this.BaseInfoFile.set('transportFile','运输单据附件');
	  this.BaseInfoFile.set('acceptBillFile','汇票信息附件');
	  this.BaseInfoFile.set('agreeAccessory','合同信息附件');


	  //wechat 融资申请 附件类型
	  this.WechatFinanceApplyFile = new ListMap();
	  this.WechatFinanceApplyFile.set('agreeAccessory','合同附件');
	  this.WechatFinanceApplyFile.set('invoiceFile','发票附件');


	  //融资期限字典
	  this.RequestPeriodUnit  = new ListMap();
	  this.RequestPeriodUnit.set('1','日');
	  this.RequestPeriodUnit.set('2','月');

	  //投资人学历;
	  this.InvestEducation = new ListMap();
	  this.InvestEducation.set('01','研究生');
	  this.InvestEducation.set('02','大学本科');
	  this.InvestEducation.set('03','大学专科');
	  this.InvestEducation.set('04','中专或技校');
	  this.InvestEducation.set('09','文盲或半文盲');
	  this.InvestEducation.set('06','高中');
	  this.InvestEducation.set('07','初中');
	  this.InvestEducation.set('08','小学');
	  this.InvestEducation.set('05','技工学校');

	  //投资人职业代码;
	  this.InvestVocation = new ListMap();
	  this.InvestVocation.set('01','党政机关、事业单位');
	  this.InvestVocation.set('02','企业单位');
	  this.InvestVocation.set('06','其他');
	  this.InvestVocation.set('04','学生');
	  this.InvestVocation.set('05','军人');
	  this.InvestVocation.set('03','自由业主');

	  //订单结算方式
	  this.OrderSettleType = new ListMap();
	  this.OrderSettleType.set('0','商业汇票');
	  this.OrderSettleType.set('1','赊销');

	  //订单状态
	  this.OrderStatus = new ListMap();
	  this.OrderStatus.set('0','可用');
	  this.OrderStatus.set('1','过期');
	  this.OrderStatus.set('2','冻结');

	  //订单类型
	  this.OrderType = new ListMap();
	  this.OrderType.set('0','供应商订单');
	  this.OrderType.set('1','经销商订单');

	  //系统角色
	  this.OrgRoleType = new ListMap();
	  this.OrgRoleType.set('FACTOR_USER','保理商');
	  this.OrgRoleType.set('SELLER_USER','经销商');
	  this.OrgRoleType.set('CORE_USER','核心企业');
	  this.OrgRoleType.set('SUPPLIER_USER','供应商');

	  //行业类型;
	  this.InvestCorpVocate = new ListMap();
	  this.InvestCorpVocate.set('0','金融行业');
	  this.InvestCorpVocate.set('001','高新科技');
	  this.InvestCorpVocate.set('002','互联网');
	  this.InvestCorpVocate.set('003','电子商务');
	  this.InvestCorpVocate.set('004','电子游戏');
	  this.InvestCorpVocate.set('005','计算机软件');
	  this.InvestCorpVocate.set('006','计算机硬件');
	  this.InvestCorpVocate.set('007','信息传媒');
	  this.InvestCorpVocate.set('008','出版业');
	  this.InvestCorpVocate.set('009','电影录音');
	  this.InvestCorpVocate.set('010','广播电视');
	  this.InvestCorpVocate.set('011','通信');
	  this.InvestCorpVocate.set('012','金融');
	  this.InvestCorpVocate.set('013','银行');
	  this.InvestCorpVocate.set('014','资本投资');
	  this.InvestCorpVocate.set('015','证券投资');
	  this.InvestCorpVocate.set('016','保险');
	  this.InvestCorpVocate.set('017','信贷');
	  this.InvestCorpVocate.set('018','财务');
	  this.InvestCorpVocate.set('019','审计');
	  this.InvestCorpVocate.set('020','服务业');
	  this.InvestCorpVocate.set('021','法律');
	  this.InvestCorpVocate.set('022','餐饮');
	  this.InvestCorpVocate.set('023','酒店');
	  this.InvestCorpVocate.set('024','旅游');
	  this.InvestCorpVocate.set('025','广告');
	  this.InvestCorpVocate.set('026','公关');
	  this.InvestCorpVocate.set('027','景观');
	  this.InvestCorpVocate.set('028','咨询分析');
	  this.InvestCorpVocate.set('029','市场推广');
	  this.InvestCorpVocate.set('030','人力资源');
	  this.InvestCorpVocate.set('031','社工服务');
	  this.InvestCorpVocate.set('032','养老服务');
	  this.InvestCorpVocate.set('033','教育');
	  this.InvestCorpVocate.set('034','高等教育');
	  this.InvestCorpVocate.set('035','基础教育');
	  this.InvestCorpVocate.set('036','职业教育');
	  this.InvestCorpVocate.set('037','幼儿教育');
	  this.InvestCorpVocate.set('038','特殊教育');
	  this.InvestCorpVocate.set('039','培训');
	  this.InvestCorpVocate.set('040','医疗服务');
	  this.InvestCorpVocate.set('041','临床医疗');
	  this.InvestCorpVocate.set('042','制药');
	  this.InvestCorpVocate.set('043','保健');
	  this.InvestCorpVocate.set('044','美容');
	  this.InvestCorpVocate.set('045','医疗器材');
	  this.InvestCorpVocate.set('046','生物工程');
	  this.InvestCorpVocate.set('047','疗养服务');
	  this.InvestCorpVocate.set('048','护理服务');
	  this.InvestCorpVocate.set('049','艺术娱乐');
	  this.InvestCorpVocate.set('050','创意艺术');
	  this.InvestCorpVocate.set('051','体育健身');
	  this.InvestCorpVocate.set('052','娱乐休闲');
	  this.InvestCorpVocate.set('053','图书馆');
	  this.InvestCorpVocate.set('054','博物馆');
	  this.InvestCorpVocate.set('055','策展');
	  this.InvestCorpVocate.set('056','博彩');
	  this.InvestCorpVocate.set('057','制造加工');
	  this.InvestCorpVocate.set('058','食品饮料业');
	  this.InvestCorpVocate.set('059','纺织皮革业');
	  this.InvestCorpVocate.set('060','服装业');
	  this.InvestCorpVocate.set('061','烟草业');
	  this.InvestCorpVocate.set('062','造纸业');
	  this.InvestCorpVocate.set('063','印刷业');
	  this.InvestCorpVocate.set('064','化工业');
	  this.InvestCorpVocate.set('065','汽车');
	  this.InvestCorpVocate.set('066','家具');
	  this.InvestCorpVocate.set('067','电子电器');
	  this.InvestCorpVocate.set('068','机械设备');
	  this.InvestCorpVocate.set('069','塑料工业');
	  this.InvestCorpVocate.set('070','金属加工');
	  this.InvestCorpVocate.set('071','军火');
	  this.InvestCorpVocate.set('072','地产建筑');
	  this.InvestCorpVocate.set('073','房地产');
	  this.InvestCorpVocate.set('074','装饰装潢');
	  this.InvestCorpVocate.set('075','物业服务');
	  this.InvestCorpVocate.set('076','特殊建造');
	  this.InvestCorpVocate.set('077','建筑设备');
	  this.InvestCorpVocate.set('078','贸易零售');
	  this.InvestCorpVocate.set('079','零售');
	  this.InvestCorpVocate.set('080','大宗交易');
	  this.InvestCorpVocate.set('081','进出口贸易');
	  this.InvestCorpVocate.set('082','公共服务');
	  this.InvestCorpVocate.set('083','政府');
	  this.InvestCorpVocate.set('084','国防军事');
	  this.InvestCorpVocate.set('085','航天');
	  this.InvestCorpVocate.set('086','科研');
	  this.InvestCorpVocate.set('087','给排水');
	  this.InvestCorpVocate.set('088','水利能源');
	  this.InvestCorpVocate.set('089','电力电网');
	  this.InvestCorpVocate.set('090','公共管理');
	  this.InvestCorpVocate.set('091','环境保护');
	  this.InvestCorpVocate.set('092','非盈利组织');
	  this.InvestCorpVocate.set('093','开采冶金');
	  this.InvestCorpVocate.set('094','煤炭工业');
	  this.InvestCorpVocate.set('095','石油工业');
	  this.InvestCorpVocate.set('096','黑色金属');
	  this.InvestCorpVocate.set('097','有色金属');
	  this.InvestCorpVocate.set('098','土砂石开采');
	  this.InvestCorpVocate.set('099','地热开采');
	  this.InvestCorpVocate.set('100','交通仓储');
	  this.InvestCorpVocate.set('101','邮政');
	  this.InvestCorpVocate.set('102','物流递送');
	  this.InvestCorpVocate.set('103','地面运输');
	  this.InvestCorpVocate.set('104','铁路运输');
	  this.InvestCorpVocate.set('105','管线运输');
	  this.InvestCorpVocate.set('106','航运业');
	  this.InvestCorpVocate.set('107','民用航空业');
	  this.InvestCorpVocate.set('108','农林牧渔');
	  this.InvestCorpVocate.set('109','种植业');
	  this.InvestCorpVocate.set('110','畜牧养殖业');
	  this.InvestCorpVocate.set('111','林业');
	  this.InvestCorpVocate.set('112','渔业');
	  this.InvestCorpVocate.set('113','其他');

	  //票据流通方式;
	  this.BillFlowMode = new ListMap();
	  this.BillFlowMode.set('0','纸票');
	  this.BillFlowMode.set('1','电票');

	  //操作员状态;
	  this.CustOperatorStatus = new ListMap();
	  this.CustOperatorStatus.set('1','正常');
	  this.CustOperatorStatus.set('2','暂停业务');
	  this.CustOperatorStatus.set('3','注销');

	  //状态;
	  this.BusinDataStatus = new ListMap();
	  this.BusinDataStatus.set('0','未启用');
	  this.BusinDataStatus.set('1','启用');
	  this.BusinDataStatus.set('2','已作废');

	  //角色类型
	  this.RoleType = new ListMap();
	  this.RoleType.set('0','经办员');
	  this.RoleType.set('1','复核员');
	  this.RoleType.set('2','审批员');

	  //性别;
	  this.CustSexType = new ListMap();
	  this.CustSexType.set('0','女');
	  this.CustSexType.set('1','男');

	  //教育水平
	  this.EduLevel = new ListMap();
	  this.EduLevel.set('0','初级中学');
	  this.EduLevel.set('1','高级中学');
	  this.EduLevel.set('2','大学专科');
	  this.EduLevel.set('3','大学本科');
	  this.EduLevel.set('4','硕士研究生');
	  this.EduLevel.set('5','博士研究生');

	  //婚姻状况
	  this.MartialStatus = new ListMap();
	  this.MartialStatus.set('0','未婚');
	  this.MartialStatus.set('1','已婚');
	  this.MartialStatus.set('2','离异');
	  this.MartialStatus.set('3','丧偶');

	  //公司职位
	  this.CompanyPosition = new ListMap();
	  this.CompanyPosition.set('0','首席执行官');
	  this.CompanyPosition.set('1','总裁');
	  this.CompanyPosition.set('2','总经理');
	  this.CompanyPosition.set('3','董事长');
	  this.CompanyPosition.set('4','监事');
	  this.CompanyPosition.set('5','财务总监');

	  //流水操作类型
	  this.TmpOperateType = new ListMap();
	  this.TmpOperateType.set('0','新增');
	  this.TmpOperateType.set('1','修改');
	  this.TmpOperateType.set('2','删除');
	  this.TmpOperateType.set('3','未改变');


	  //销售系统业务代码定义;
	  this.SaleBusinCode = new ListMap();
	  this.SaleBusinCode.set('01','基金账户开户');
	  this.SaleBusinCode.set('02','基金账户销户');
	  this.SaleBusinCode.set('04','基金账户冻结');
	  this.SaleBusinCode.set('05','基金账户解冻');
	  this.SaleBusinCode.set('06','基金账户挂失');
	  this.SaleBusinCode.set('08','基金账户登记');
	  this.SaleBusinCode.set('09','交易账户销户');
	  this.SaleBusinCode.set('14','账户资料核对');
	  this.SaleBusinCode.set('25','预约赎回');
	  this.SaleBusinCode.set('42','强行赎回');
	  this.SaleBusinCode.set('63','定期定额赎回');
	  this.SaleBusinCode.set('93','ETF一次赎回');
	  this.SaleBusinCode.set('26','转托管');
	  this.SaleBusinCode.set('27','转托管转入');
	  this.SaleBusinCode.set('28','转托管转出');
	  this.SaleBusinCode.set('30','认购结果');
	  this.SaleBusinCode.set('31','基金份额冻结');
	  this.SaleBusinCode.set('32','基金份额解冻');
	  this.SaleBusinCode.set('33','非交易过户');
	  this.SaleBusinCode.set('35','非交易过户出');
	  this.SaleBusinCode.set('36','基金转换');
	  this.SaleBusinCode.set('37','基金转换入');
	  this.SaleBusinCode.set('43','分红');
	  this.SaleBusinCode.set('44','强行调增');
	  this.SaleBusinCode.set('45','强行调减');
	  this.SaleBusinCode.set('51','批量开户');
	  this.SaleBusinCode.set('53','撤预约单');
	  this.SaleBusinCode.set('58','变更交易账户');
	  this.SaleBusinCode.set('60','定投协议撤销');
	  this.SaleBusinCode.set('61','定投协议变更');
	  this.SaleBusinCode.set('95','赎回支付');
	  this.SaleBusinCode.set('69','定赎/定转开通');
	  this.SaleBusinCode.set('70','定赎/定转撤销');
	  this.SaleBusinCode.set('71','定期赎回变更');
	  this.SaleBusinCode.set('92','ETF二次申购');
	  this.SaleBusinCode.set('80','确权');
	  this.SaleBusinCode.set('A1','客户联合开户');
	  this.SaleBusinCode.set('A2','客户销户');
	  this.SaleBusinCode.set('A4','客户冻结');
	  this.SaleBusinCode.set('A5','客户解冻');
	  this.SaleBusinCode.set('A6','客户密码修改');
	  this.SaleBusinCode.set('A8','客户银行卡资料修改');
	  this.SaleBusinCode.set('B4','客户挂失');
	  this.SaleBusinCode.set('B5','客户解挂');
	  this.SaleBusinCode.set('B6','注销银行卡');
	  this.SaleBusinCode.set('C2','份额调增');
	  this.SaleBusinCode.set('C3','份额调减');
	  this.SaleBusinCode.set('G1','定时定额暂停');
	  this.SaleBusinCode.set('G2','定时定额恢复');
	  this.SaleBusinCode.set('G4','定时赎回恢复');
	  this.SaleBusinCode.set('20','认购');
	  this.SaleBusinCode.set('22','申购');
	  this.SaleBusinCode.set('24','赎回');
	  this.SaleBusinCode.set('A9','经办人资料维护');
	  this.SaleBusinCode.set('B1','客户资料修改');
	  this.SaleBusinCode.set('98','T+0快速赎回');
	  this.SaleBusinCode.set('C7','客户密码解锁');
	  this.SaleBusinCode.set('C4','银行卡身份证转换');
	  this.SaleBusinCode.set('B8','客户解锁');
	  this.SaleBusinCode.set('03','账户信息修改');
	  this.SaleBusinCode.set('07','基金账户解挂失');
	  this.SaleBusinCode.set('39','定期定额申购');
	  this.SaleBusinCode.set('94','ETF二次赎回');
	  this.SaleBusinCode.set('29','设置分红方式');
	  this.SaleBusinCode.set('34','非交易过户入');
	  this.SaleBusinCode.set('38','基金转换出');
	  this.SaleBusinCode.set('49','基金募集失败');
	  this.SaleBusinCode.set('59','定投协议开通');
	  this.SaleBusinCode.set('96','销交易账户');
	  this.SaleBusinCode.set('91','ETF一次申购');
	  this.SaleBusinCode.set('A3','增加银行卡');
	  this.SaleBusinCode.set('A7','客户更换银行卡');
	  this.SaleBusinCode.set('B2','客户密码重置');
	  this.SaleBusinCode.set('B9','客户实时资料修改');
	  this.SaleBusinCode.set('G3','定时赎回暂停');
	  this.SaleBusinCode.set('C5','银行卡签约');
	  this.SaleBusinCode.set('C6','银行卡解约');

	  //产品状态定义;
	  this.fundStatus = new ListMap();
	  this.fundStatus.set('0','交易');
	  this.fundStatus.set('1','发行');
	  this.fundStatus.set('2','发行成功');
	  this.fundStatus.set('3','发行失败');
	  this.fundStatus.set('4','基金停止交易');
	  this.fundStatus.set('a','基金终止');
	  this.fundStatus.set('6','停止赎回');
	  this.fundStatus.set('7','权益登记');
	  this.fundStatus.set('8','红利发放');
	  this.fundStatus.set('9','基金封闭');
	  this.fundStatus.set('5','停止申购');

	  //票据状态;
	  this.BillNoteStatus = new ListMap();
	  this.BillNoteStatus.set('2','已融资');
	  this.BillNoteStatus.set('1','完善资料');
	  this.BillNoteStatus.set('0','未处理');
	  this.BillNoteStatus.set('3','已过期');

	  //应收账款状态;
	  this.ReceivableNoteStatus = new ListMap();
	  this.ReceivableNoteStatus.set('','全部');
	  this.ReceivableNoteStatus.set('1','未融资');
	  this.ReceivableNoteStatus.set('2','已融资');
	  

	  //风险评测机构信息;
	  this.RiskAssessment = new ListMap();
	  this.RiskAssessment.set('201','南方基金');
	  this.RiskAssessment.set('203','华夏');
	  this.RiskAssessment.set('303','天天基金');

	  //银行编码信息;
	  this.SaleBankCode = new ListMap();
	  this.SaleBankCode.set('022','邮政储蓄');
	  this.SaleBankCode.set('7000','中信实业银行');
	  this.SaleBankCode.set('024','深圳平安银行');
	  this.SaleBankCode.set('921','宁波银行');
	  this.SaleBankCode.set('901','长沙商行');
	  this.SaleBankCode.set('904','南京银行');
	  this.SaleBankCode.set('919','富滇银行');
	  this.SaleBankCode.set('903','上海农村商业银行');
	  this.SaleBankCode.set('915','浙商银行');
	  this.SaleBankCode.set('940','重庆银行');
	  this.SaleBankCode.set('941','大连银行');
	  this.SaleBankCode.set('942','哈尔滨银行');
	  this.SaleBankCode.set('943','江苏银行');
	  this.SaleBankCode.set('944','洛阳银行');
	  this.SaleBankCode.set('946','青岛银行');
	  this.SaleBankCode.set('907','温州银行');
	  this.SaleBankCode.set('948','乌鲁木齐商业银行');
	  this.SaleBankCode.set('949','汉口银行');
	  this.SaleBankCode.set('951','浙江稠州商业银行');
	  this.SaleBankCode.set('952','浙江民泰商业银行');
	  this.SaleBankCode.set('953','临商银行');
	  this.SaleBankCode.set('950','东莞银行');
	  this.SaleBankCode.set('954','张家港农村商业银行');
	  this.SaleBankCode.set('098','北京农村商业银行');
	  this.SaleBankCode.set('1000','工商银行');
	  this.SaleBankCode.set('2000','农业银行');
	  this.SaleBankCode.set('3000','中国银行');
	  this.SaleBankCode.set('4000','建设银行');
	  this.SaleBankCode.set('6000','交通银行');
	  this.SaleBankCode.set('9000','光大银行');
	  this.SaleBankCode.set('5000','招商银行');
	  this.SaleBankCode.set('009','民生银行');
	  this.SaleBankCode.set('8000','兴业银行');
	  this.SaleBankCode.set('011','深圳发展银行');
	  this.SaleBankCode.set('1100','浦发银行');
	  this.SaleBankCode.set('013','广发银行');
	  this.SaleBankCode.set('014','民生银行');
	  this.SaleBankCode.set('938','渤海银行');
	  this.SaleBankCode.set('911','杭州银行');
	  this.SaleBankCode.set('021','平安银行');
	  this.SaleBankCode.set('916','烟台银行');
	  this.SaleBankCode.set('945','齐商银行');
	  this.SaleBankCode.set('939','深圳农村商业银行');
	  this.SaleBankCode.set('999','其他');
	  this.SaleBankCode.set('025','北京银行');
	  this.SaleBankCode.set('905','金华商业银行');
	  this.SaleBankCode.set('016','上海银行');
	  this.SaleBankCode.set('017','华夏银行');
	  this.SaleBankCode.set('019','信用社');
	  this.SaleBankCode.set('020','华一银行');
	  this.SaleBankCode.set('023','汇丰银行');

	  //票据类型;
	  this.BillNoteType = new ListMap();
	  this.BillNoteType.set('1','银行承兑汇票');
	  this.BillNoteType.set('0','商业承兑汇票');

	  //客户账户状态定义;
	  this.custAccountStatus = new ListMap();
	  this.custAccountStatus.set('0','正常');
	  this.custAccountStatus.set('1','普通冻结');
	  this.custAccountStatus.set('2','司法冻结');
	  this.custAccountStatus.set('6','复核锁定');
	  this.custAccountStatus.set('4','挂失');
	  this.custAccountStatus.set('5','锁定');
	  this.custAccountStatus.set('3','销户');

	  //交易账户状态定义;
	  this.tradeAccountStatus = new ListMap();
	  this.tradeAccountStatus.set('0','正常');
	  this.tradeAccountStatus.set('1','待确认');
	  this.tradeAccountStatus.set('8','复核锁定');
	  this.tradeAccountStatus.set('3','销户');
	  this.tradeAccountStatus.set('7','开户失败');
	  this.tradeAccountStatus.set('2','销户中');

	  //基金账户状态定义;
	  this.fundAccountStatus = new ListMap();
	  this.fundAccountStatus.set('0','正常');
	  this.fundAccountStatus.set('1','待确认');
	  this.fundAccountStatus.set('2','销户中');
	  this.fundAccountStatus.set('7','复核锁定');
	  this.fundAccountStatus.set('4','司法冻结');
	  this.fundAccountStatus.set('5','普通冻结');
	  this.fundAccountStatus.set('6','挂失');
	  this.fundAccountStatus.set('3','销户');

	  //客户类别定义;
	  this.CustWorkType = new ListMap();
	  this.CustWorkType.set('1','个人');
	  this.CustWorkType.set('0','机构');

	  //投资人年收入;
	  this.InvestIncoming = new ListMap();
	  this.InvestIncoming.set('01','2万以下');
	  this.InvestIncoming.set('03','10-20万');
	  this.InvestIncoming.set('05','50万以上');
	  this.InvestIncoming.set('02','2-10万');
	  this.InvestIncoming.set('04','20-50万');

	  //风险承受能力;
	  this.SaleRiskCapacity = new ListMap();
	  this.SaleRiskCapacity.set('04','积极型');
	  this.SaleRiskCapacity.set('05','激进型');
	  this.SaleRiskCapacity.set('01','安逸型');
	  this.SaleRiskCapacity.set('03','稳健型');
	  this.SaleRiskCapacity.set('02','保守型');

	  //分红方式定义;
	  this.SaleBonusType = new ListMap();
	  this.SaleBonusType.set('0','红利再投');
	  this.SaleBonusType.set('1','现金分红');

	  //委托状态定义;
	  this.SaleBusinFlag = new ListMap();
	  this.SaleBusinFlag.set('10','交易失败');
	  this.SaleBusinFlag.set('00','待复核');
	  this.SaleBusinFlag.set('01','待勾兑');
	  this.SaleBusinFlag.set('02','待报');
	  this.SaleBusinFlag.set('04','废单');
	  this.SaleBusinFlag.set('05','已撤');
	  this.SaleBusinFlag.set('0A','申请失败');
	  this.SaleBusinFlag.set('07','确认成功');
	  this.SaleBusinFlag.set('08','确认失败');
	  this.SaleBusinFlag.set('0B','撤单');
	  this.SaleBusinFlag.set('0C','撤单失败');
	  this.SaleBusinFlag.set('03','驳回修改');
	  this.SaleBusinFlag.set('09','结束');
	  this.SaleBusinFlag.set('06','已报');

	  //余利宝委托状态
	  this.YlbSaleBusinFlag = new ListMap();
	  this.YlbSaleBusinFlag.set('10','交易失败');
	  this.YlbSaleBusinFlag.set('00','待复核');
	  this.YlbSaleBusinFlag.set('02','待报');
	  this.YlbSaleBusinFlag.set('06','已报');
	  this.YlbSaleBusinFlag.set('07','确认成功');
	  this.YlbSaleBusinFlag.set('08','确认失败');

	  //账户经办人识别方式;
	  this.InvestContIdentifyType = new ListMap();
	  this.InvestContIdentifyType.set('2','印鉴');
	  this.InvestContIdentifyType.set('4','证件');
	  this.InvestContIdentifyType.set('1','书面委托');
	  this.InvestContIdentifyType.set('3','密码');

	  //客户分类;
	  this.CustomerClassInfo = new ListMap();

	  //用户类型;
	  this.CustUserType = new ListMap();
	  this.CustUserType.set('OPERATOR_USER','经办');
	  this.CustUserType.set('OPERATOR_CHECKER','复核');
	  this.CustUserType.set('OPERATOR_ADUIT','审批');
	  this.CustUserType.set('SYS_ADMIN','系统管理员');

	  //销售商代码;
	  this.SaleAgency = new ListMap();
	  this.SaleAgency.set('217','招商基金');
	  this.SaleAgency.set('201','南方基金');
	  this.SaleAgency.set('205','博时基金');
	  this.SaleAgency.set('269','民生加银');
	  this.SaleAgency.set('209','大成基金');
	  this.SaleAgency.set('203','华夏基金');
	  this.SaleAgency.set('227','广发基金');
	  this.SaleAgency.set('303','天天基金');
	  this.SaleAgency.set('ylb','余利宝');

	  //默认交易手段;
	  this.SaleDefAcceptModes = new ListMap();
	  this.SaleDefAcceptModes.set('0','柜台');
	  this.SaleDefAcceptModes.set('1','电话');
	  this.SaleDefAcceptModes.set('5','机构');
	  this.SaleDefAcceptModes.set('3','传真');
	  this.SaleDefAcceptModes.set('4','手机');
	  this.SaleDefAcceptModes.set('2','网上交易');

	  //个人证件类型;
	  this.PersonIdentType = new ListMap();
	  this.PersonIdentType.set('0','身份证');
	  this.PersonIdentType.set('1','护照');
	  this.PersonIdentType.set('2','军官证');
	  this.PersonIdentType.set('3','士兵证');
	  this.PersonIdentType.set('4','港澳居民来往内地通行证');
	  this.PersonIdentType.set('A','台胞证');
	  this.PersonIdentType.set('6','外国护照');
	  this.PersonIdentType.set('7','其它');
	  this.PersonIdentType.set('8','文职证');
	  this.PersonIdentType.set('9','警官证');
	  this.PersonIdentType.set('5','户口本');

	  //供应链信息代录证件类型
	  this.IdentType = new ListMap();
	  this.IdentType.set('0','身份证');
	  this.IdentType.set('1','护照');
	  this.IdentType.set('2','军官证');
	  this.IdentType.set('3','士兵证');
	  this.IdentType.set('4','回乡证');
	  this.IdentType.set('5','户口本');
	  this.IdentType.set('6','外国护照');

	  //机构证件类型;
	  this.OrgIdentType = new ListMap();
	  this.OrgIdentType.set('8','其它');
	  this.OrgIdentType.set('0','组织机构代码证');
	  this.OrgIdentType.set('1','营业执照');
	  this.OrgIdentType.set('2','行政机关');
	  this.OrgIdentType.set('7','基金会');
	  this.OrgIdentType.set('4','军队');
	  this.OrgIdentType.set('5','武警');
	  this.OrgIdentType.set('6','下属机构');
	  this.OrgIdentType.set('3','社会团体');

	  //流程类型;
  	  this.FlowType = new ListMap();
  	  this.FlowType.set('Account','账户类业务');
  	  this.FlowType.set('Trade','交易类业务');
  	  this.FlowType.set('WithdrawAccount','账户类业务撤单');
  	  this.FlowType.set('WithdrawTrade','交易类业务撤单');

  	  //流程节点角色;
  	  this.FlowNodeRole = new ListMap();
  	  this.FlowNodeRole.set('Financer','融资方');
  	  this.FlowNodeRole.set('Core','核心企业');
  	  this.FlowNodeRole.set('Factoring','保理方');

  	  //流程审批方式;
  	  this.FlowAuditType = new ListMap();
  	  this.FlowAuditType.set('serial','串行');
  	  this.FlowAuditType.set('parallel','并行');

	  //销售系统业务撤单代码定义;
	  this.SaleRevokeBusinCode = new ListMap();
	  this.SaleRevokeBusinCode.set('58','变更交易账户撤单');
	  this.SaleRevokeBusinCode.set('59','定投协议开通撤单');
	  this.SaleRevokeBusinCode.set('60','定投协议撤销撤单');
	  this.SaleRevokeBusinCode.set('61','定投协议变更撤单');
	  this.SaleRevokeBusinCode.set('96','销交易账户撤单');
	  this.SaleRevokeBusinCode.set('69','定赎/定转开通撤单');
	  this.SaleRevokeBusinCode.set('70','定期赎回撤销撤单');
	  this.SaleRevokeBusinCode.set('71','定期赎回变更撤单');
	  this.SaleRevokeBusinCode.set('92','ETF二次申购撤单');
	  this.SaleRevokeBusinCode.set('A1','客户联合开户撤单');
	  this.SaleRevokeBusinCode.set('A2','客户销户撤单');
	  this.SaleRevokeBusinCode.set('A4','客户冻结撤单');
	  this.SaleRevokeBusinCode.set('A5','客户解冻撤单');
	  this.SaleRevokeBusinCode.set('A6','客户密码修改撤单');
	  this.SaleRevokeBusinCode.set('A7','客户更换银行卡撤单');
	  this.SaleRevokeBusinCode.set('A9','经办人资料维护撤单');
	  this.SaleRevokeBusinCode.set('B1','客户资料修改撤单');
	  this.SaleRevokeBusinCode.set('B2','客户密码重置撤单');
	  this.SaleRevokeBusinCode.set('B4','客户挂失撤单');
	  this.SaleRevokeBusinCode.set('B5','客户解挂撤单');
	  this.SaleRevokeBusinCode.set('B9','客户实时资料修改撤单');
	  this.SaleRevokeBusinCode.set('C2','份额调增撤单');
	  this.SaleRevokeBusinCode.set('C3','份额调减撤单');
	  this.SaleRevokeBusinCode.set('G2','定时定额恢复撤单');
	  this.SaleRevokeBusinCode.set('G3','定时赎回暂停撤单');
	  this.SaleRevokeBusinCode.set('G4','定时赎回恢复撤单');
	  this.SaleRevokeBusinCode.set('01','基金账户开户撤单');
	  this.SaleRevokeBusinCode.set('02','基金账户销户撤单');
	  this.SaleRevokeBusinCode.set('03','账户信息修改撤单');
	  this.SaleRevokeBusinCode.set('04','基金账户冻结撤单');
	  this.SaleRevokeBusinCode.set('05','基金账户解冻撤单');
	  this.SaleRevokeBusinCode.set('07','基金账户解挂失撤单');
	  this.SaleRevokeBusinCode.set('08','基金账户登记撤单');
	  this.SaleRevokeBusinCode.set('09','交易账户销户撤单');
	  this.SaleRevokeBusinCode.set('14','账户资料核对撤单');
	  this.SaleRevokeBusinCode.set('22','申购申请撤单');
	  this.SaleRevokeBusinCode.set('24','赎回申请撤单');
	  this.SaleRevokeBusinCode.set('25','预约赎回撤单');
	  this.SaleRevokeBusinCode.set('42','强行赎回撤单');
	  this.SaleRevokeBusinCode.set('63','定期定额赎回撤单');
	  this.SaleRevokeBusinCode.set('93','ETF一次赎回撤单');
	  this.SaleRevokeBusinCode.set('94','ETF二次赎回撤单');
	  this.SaleRevokeBusinCode.set('28','转托管转出撤单');
	  this.SaleRevokeBusinCode.set('29','设置分红方式撤单');
	  this.SaleRevokeBusinCode.set('30','认购结果撤单');
	  this.SaleRevokeBusinCode.set('32','基金份额解冻撤单');
	  this.SaleRevokeBusinCode.set('33','非交易过户撤单');
	  this.SaleRevokeBusinCode.set('34','非交易过户入撤单');
	  this.SaleRevokeBusinCode.set('35','非交易过户出撤单');
	  this.SaleRevokeBusinCode.set('37','基金转换入撤单');
	  this.SaleRevokeBusinCode.set('38','基金转换出撤单');
	  this.SaleRevokeBusinCode.set('43','分红撤单');
	  this.SaleRevokeBusinCode.set('44','强行调增撤单');
	  this.SaleRevokeBusinCode.set('51','批量开户撤单');
	  this.SaleRevokeBusinCode.set('53','撤预约单撤单');
	  this.SaleRevokeBusinCode.set('06','基金账户挂失撤单');
	  this.SaleRevokeBusinCode.set('20','认购申请撤单');
	  this.SaleRevokeBusinCode.set('39','定期定额申购撤单');
	  this.SaleRevokeBusinCode.set('27','转托管转入撤单');
	  this.SaleRevokeBusinCode.set('31','基金份额冻结撤单');
	  this.SaleRevokeBusinCode.set('36','基金转换撤单');
	  this.SaleRevokeBusinCode.set('45','强行调减撤单');
	  this.SaleRevokeBusinCode.set('95','赎回支付撤单');
	  this.SaleRevokeBusinCode.set('91','ETF一次申购撤单');
	  this.SaleRevokeBusinCode.set('A3','增加银行卡撤单');
	  this.SaleRevokeBusinCode.set('A8','客户银行卡资料修改撤单');
	  this.SaleRevokeBusinCode.set('B6','注销银行卡撤单');
	  this.SaleRevokeBusinCode.set('G1','定时定额暂停撤单');

	  //风险等级;
	  this.SaleRiskLevel = new ListMap();
	  this.SaleRiskLevel.set('01','中风险');
	  this.SaleRiskLevel.set('00','低风险');
	  this.SaleRiskLevel.set('02','高风险');

	  //文件附件分组信息;
	  this.BusinFileGroupType = new ListMap();
	  this.BusinFileGroupType.set('FundBusinFileGroup','基金文件附件分组信息');
	  this.BusinFileGroupType.set('ScfAppBusinFileGroup','供应链金融融资业务附件分组信息');
	  this.BusinFileGroupType.set('ScfBusinFileGroup','供应链金融账户认证附件分组信息');

	  //基金文件附件分组信息;
	  this.FundBusinFileGroup = new ListMap();
	  this.FundBusinFileGroup.set('bizLicenseFile','企业营业执照附件');
	  this.FundBusinFileGroup.set('orgCodeFile','组织机构代码证附件');
	  this.FundBusinFileGroup.set('bankAcctAckFile','银行开户证明附件');
	  this.FundBusinFileGroup.set('representIdFile','法人身份证附件');
	  this.FundBusinFileGroup.set('brokerIdFile','经办人身份证附件');
	  this.FundBusinFileGroup.set('taxRegistFile','税务登记证附件');

	  //供应链金融账户认证附件分组信息;
	  this.ScfBusinFileGroup = new ListMap();
	  this.ScfBusinFileGroup.set('bizLicenseFile','企业营业执照附件');
	  this.ScfBusinFileGroup.set('orgCodeFile','组织机构代码证附件');
	  this.ScfBusinFileGroup.set('taxRegistFile','税务登记证附件');
	  this.ScfBusinFileGroup.set('representIdFile','法人身份证附件');
	  this.ScfBusinFileGroup.set('officeSiteFile','办公场地附件文件');
	  this.ScfBusinFileGroup.set('bankAcctAckFile','银行开户证明附件');
	  this.ScfBusinFileGroup.set('bankFlowFile','银行账户流水附件文件');
	  this.ScfBusinFileGroup.set('orderFlowFile','订单流水附件文件');
	  this.ScfBusinFileGroup.set('brokerIdFile','经办人身份证附件');

	  //供应链金融融资业务附件分组信息;
	  this.ScfAppBusinFileGroup = new ListMap();
	  this.ScfAppBusinFileGroup.set('InvoiceAccessory','发票附件');
	  this.ScfAppBusinFileGroup.set('billAccessory','票据附件');
	  this.ScfAppBusinFileGroup.set('agreeAccessory','合同附件');

	  //供应链金融融资保理公司信息;
	  this.ScfAgencyGroup = new ListMap();
	  this.ScfAgencyGroup.set('yqr','百乐润保理');
	  this.ScfAgencyGroup.set('cfgy','财富共赢');

	  //理财机构信息;
	  this.MoneyAgencyGroup = new ListMap();
	  this.MoneyAgencyGroup.set('pin','平安信托');

	  //电子签名合同状态;
	  this.ElecSignContractStatus = new ListMap();
	  this.ElecSignContractStatus.set('0','未签署');
	  this.ElecSignContractStatus.set('1','已签署合同');
	  this.ElecSignContractStatus.set('3','合同签署失败');
	  this.ElecSignContractStatus.set('9','合同作废');
	  this.ElecSignContractStatus.set('2','合同签署中');


	  //协议书类型
	  this.SignType = new ListMap();
	  this.SignType.set('0','转让通知书');
	  this.SignType.set('1','确认意见书');
	  this.SignType.set('2','三方协议');
	  this.SignType.set('3','保理合同');


	 this.Provinces = new ListMap('id', 'name', {id: '', name: '', citys: null});
	   var citys;
	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '110000', name: '北京市', citys: citys});
	   citys.set('110100', '市辖区');
	   citys.set('110200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '120000', name: '天津市', citys: citys});
	   citys.set('120100', '市辖区');
	   citys.set('120200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '130000', name: '河北省', citys: citys});
	   citys.set('130100', '石家庄市');
	   citys.set('130200', '唐山市');
	   citys.set('130300', '秦皇岛市');
	   citys.set('130400', '邯郸市');
	   citys.set('130500', '邢台市');
	   citys.set('130600', '保定市');
	   citys.set('130700', '张家口市');
	   citys.set('130800', '承德市');
	   citys.set('130900', '沧州市');
	   citys.set('131000', '廊坊市');
	   citys.set('131100', '衡水市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '140000', name: '山西省', citys: citys});
	   citys.set('140100', '太原市');
	   citys.set('140200', '大同市');
	   citys.set('140300', '阳泉市');
	   citys.set('140400', '长治市');
	   citys.set('140500', '晋城市');
	   citys.set('140600', '朔州市');
	   citys.set('140700', '晋中市');
	   citys.set('140800', '运城市');
	   citys.set('140900', '忻州市');
	   citys.set('141000', '临汾市');
	   citys.set('141100', '吕梁市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '150000', name: '内蒙古自治区', citys: citys});
	   citys.set('150100', '呼和浩特市');
	   citys.set('150200', '包头市');
	   citys.set('150300', '乌海市');
	   citys.set('150400', '赤峰市');
	   citys.set('150500', '通辽市');
	   citys.set('150600', '鄂尔多斯市');
	   citys.set('150700', '呼伦贝尔市');
	   citys.set('150800', '巴彦淖尔市');
	   citys.set('150900', '乌兰察布市');
	   citys.set('152200', '兴安盟');
	   citys.set('152500', '锡林郭勒盟');
	   citys.set('152900', '阿拉善盟');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '210000', name: '辽宁省', citys: citys});
	   citys.set('210100', '沈阳市');
	   citys.set('210200', '大连市');
	   citys.set('210300', '鞍山市');
	   citys.set('210400', '抚顺市');
	   citys.set('210500', '本溪市');
	   citys.set('210600', '丹东市');
	   citys.set('210700', '锦州市');
	   citys.set('210800', '营口市');
	   citys.set('210900', '阜新市');
	   citys.set('211000', '辽阳市');
	   citys.set('211100', '盘锦市');
	   citys.set('211200', '铁岭市');
	   citys.set('211300', '朝阳市');
	   citys.set('211400', '葫芦岛市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '220000', name: '吉林省', citys: citys});
	   citys.set('220100', '长春市');
	   citys.set('220200', '吉林市');
	   citys.set('220300', '四平市');
	   citys.set('220400', '辽源市');
	   citys.set('220500', '通化市');
	   citys.set('220600', '白山市');
	   citys.set('220700', '松原市');
	   citys.set('220800', '白城市');
	   citys.set('222400', '延边朝鲜族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '230000', name: '黑龙江省', citys: citys});
	   citys.set('230100', '哈尔滨市');
	   citys.set('230200', '齐齐哈尔市');
	   citys.set('230300', '鸡西市');
	   citys.set('230400', '鹤岗市');
	   citys.set('230500', '双鸭山市');
	   citys.set('230600', '大庆市');
	   citys.set('230700', '伊春市');
	   citys.set('230800', '佳木斯市');
	   citys.set('230900', '七台河市');
	   citys.set('231000', '牡丹江市');
	   citys.set('231100', '黑河市');
	   citys.set('231200', '绥化市');
	   citys.set('232700', '大兴安岭地区');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '310000', name: '上海市', citys: citys});
	   citys.set('310100', '市辖区');
	   citys.set('310200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '320000', name: '江苏省', citys: citys});
	   citys.set('320100', '南京市');
	   citys.set('320200', '无锡市');
	   citys.set('320300', '徐州市');
	   citys.set('320400', '常州市');
	   citys.set('320500', '苏州市');
	   citys.set('320600', '南通市');
	   citys.set('320700', '连云港市');
	   citys.set('320800', '淮安市');
	   citys.set('320900', '盐城市');
	   citys.set('321000', '扬州市');
	   citys.set('321100', '镇江市');
	   citys.set('321200', '泰州市');
	   citys.set('321300', '宿迁市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '330000', name: '浙江省', citys: citys});
	   citys.set('330100', '杭州市');
	   citys.set('330200', '宁波市');
	   citys.set('330300', '温州市');
	   citys.set('330400', '嘉兴市');
	   citys.set('330500', '湖州市');
	   citys.set('330600', '绍兴市');
	   citys.set('330700', '金华市');
	   citys.set('330800', '衢州市');
	   citys.set('330900', '舟山市');
	   citys.set('331000', '台州市');
	   citys.set('331100', '丽水市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '340000', name: '安徽省', citys: citys});
	   citys.set('340100', '合肥市');
	   citys.set('340200', '芜湖市');
	   citys.set('340300', '蚌埠市');
	   citys.set('340400', '淮南市');
	   citys.set('340500', '马鞍山市');
	   citys.set('340600', '淮北市');
	   citys.set('340700', '铜陵市');
	   citys.set('340800', '安庆市');
	   citys.set('341000', '黄山市');
	   citys.set('341100', '滁州市');
	   citys.set('341200', '阜阳市');
	   citys.set('341300', '宿州市');
	   citys.set('341500', '六安市');
	   citys.set('341600', '亳州市');
	   citys.set('341700', '池州市');
	   citys.set('341800', '宣城市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '350000', name: '福建省', citys: citys});
	   citys.set('350100', '福州市');
	   citys.set('350200', '厦门市');
	   citys.set('350300', '莆田市');
	   citys.set('350400', '三明市');
	   citys.set('350500', '泉州市');
	   citys.set('350600', '漳州市');
	   citys.set('350700', '南平市');
	   citys.set('350800', '龙岩市');
	   citys.set('350900', '宁德市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '360000', name: '江西省', citys: citys});
	   citys.set('360100', '南昌市');
	   citys.set('360200', '景德镇市');
	   citys.set('360300', '萍乡市');
	   citys.set('360400', '九江市');
	   citys.set('360500', '新余市');
	   citys.set('360600', '鹰潭市');
	   citys.set('360700', '赣州市');
	   citys.set('360800', '吉安市');
	   citys.set('360900', '宜春市');
	   citys.set('361000', '抚州市');
	   citys.set('361100', '上饶市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '370000', name: '山东省', citys: citys});
	   citys.set('370100', '济南市');
	   citys.set('370200', '青岛市');
	   citys.set('370300', '淄博市');
	   citys.set('370400', '枣庄市');
	   citys.set('370500', '东营市');
	   citys.set('370600', '烟台市');
	   citys.set('370700', '潍坊市');
	   citys.set('370800', '济宁市');
	   citys.set('370900', '泰安市');
	   citys.set('371000', '威海市');
	   citys.set('371100', '日照市');
	   citys.set('371200', '莱芜市');
	   citys.set('371300', '临沂市');
	   citys.set('371400', '德州市');
	   citys.set('371500', '聊城市');
	   citys.set('371600', '滨州市');
	   citys.set('371700', '菏泽市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '410000', name: '河南省', citys: citys});
	   citys.set('410100', '郑州市');
	   citys.set('410200', '开封市');
	   citys.set('410300', '洛阳市');
	   citys.set('410400', '平顶山市');
	   citys.set('410500', '安阳市');
	   citys.set('410600', '鹤壁市');
	   citys.set('410700', '新乡市');
	   citys.set('410800', '焦作市');
	   citys.set('410900', '濮阳市');
	   citys.set('411000', '许昌市');
	   citys.set('411100', '漯河市');
	   citys.set('411200', '三门峡市');
	   citys.set('411300', '南阳市');
	   citys.set('411400', '商丘市');
	   citys.set('411500', '信阳市');
	   citys.set('411600', '周口市');
	   citys.set('411700', '驻马店市');
	   citys.set('419000', '省直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '420000', name: '湖北省', citys: citys});
	   citys.set('420100', '武汉市');
	   citys.set('420200', '黄石市');
	   citys.set('420300', '十堰市');
	   citys.set('420500', '宜昌市');
	   citys.set('420600', '襄阳市');
	   citys.set('420700', '鄂州市');
	   citys.set('420800', '荆门市');
	   citys.set('420900', '孝感市');
	   citys.set('421000', '荆州市');
	   citys.set('421100', '黄冈市');
	   citys.set('421200', '咸宁市');
	   citys.set('421300', '随州市');
	   citys.set('422800', '恩施土家族苗族自治州');
	   citys.set('429000', '省直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '430000', name: '湖南省', citys: citys});
	   citys.set('430100', '长沙市');
	   citys.set('430200', '株洲市');
	   citys.set('430300', '湘潭市');
	   citys.set('430400', '衡阳市');
	   citys.set('430500', '邵阳市');
	   citys.set('430600', '岳阳市');
	   citys.set('430700', '常德市');
	   citys.set('430800', '张家界市');
	   citys.set('430900', '益阳市');
	   citys.set('431000', '郴州市');
	   citys.set('431100', '永州市');
	   citys.set('431200', '怀化市');
	   citys.set('431300', '娄底市');
	   citys.set('433100', '湘西土家族苗族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '440000', name: '广东省', citys: citys});
	   citys.set('440100', '广州市');
	   citys.set('440200', '韶关市');
	   citys.set('440300', '深圳市');
	   citys.set('440400', '珠海市');
	   citys.set('440500', '汕头市');
	   citys.set('440600', '佛山市');
	   citys.set('440700', '江门市');
	   citys.set('440800', '湛江市');
	   citys.set('440900', '茂名市');
	   citys.set('441200', '肇庆市');
	   citys.set('441300', '惠州市');
	   citys.set('441400', '梅州市');
	   citys.set('441500', '汕尾市');
	   citys.set('441600', '河源市');
	   citys.set('441700', '阳江市');
	   citys.set('441800', '清远市');
	   citys.set('441900', '东莞市');
	   citys.set('442000', '中山市');
	   citys.set('445100', '潮州市');
	   citys.set('445200', '揭阳市');
	   citys.set('445300', '云浮市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '450000', name: '广西壮族自治区', citys: citys});
	   citys.set('450100', '南宁市');
	   citys.set('450200', '柳州市');
	   citys.set('450300', '桂林市');
	   citys.set('450400', '梧州市');
	   citys.set('450500', '北海市');
	   citys.set('450600', '防城港市');
	   citys.set('450700', '钦州市');
	   citys.set('450800', '贵港市');
	   citys.set('450900', '玉林市');
	   citys.set('451000', '百色市');
	   citys.set('451100', '贺州市');
	   citys.set('451200', '河池市');
	   citys.set('451300', '来宾市');
	   citys.set('451400', '崇左市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '460000', name: '海南省', citys: citys});
	   citys.set('460100', '海口市');
	   citys.set('460200', '三亚市');
	   citys.set('460300', '三沙市');
	   citys.set('469000', '省直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '500000', name: '重庆市', citys: citys});
	   citys.set('500100', '市辖区');
	   citys.set('500200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '510000', name: '四川省', citys: citys});
	   citys.set('510100', '成都市');
	   citys.set('510300', '自贡市');
	   citys.set('510400', '攀枝花市');
	   citys.set('510500', '泸州市');
	   citys.set('510600', '德阳市');
	   citys.set('510700', '绵阳市');
	   citys.set('510800', '广元市');
	   citys.set('510900', '遂宁市');
	   citys.set('511000', '内江市');
	   citys.set('511100', '乐山市');
	   citys.set('511300', '南充市');
	   citys.set('511400', '眉山市');
	   citys.set('511500', '宜宾市');
	   citys.set('511600', '广安市');
	   citys.set('511700', '达州市');
	   citys.set('511800', '雅安市');
	   citys.set('511900', '巴中市');
	   citys.set('512000', '资阳市');
	   citys.set('513200', '阿坝藏族羌族自治州');
	   citys.set('513300', '甘孜藏族自治州');
	   citys.set('513400', '凉山彝族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '520000', name: '贵州省', citys: citys});
	   citys.set('520100', '贵阳市');
	   citys.set('520200', '六盘水市');
	   citys.set('520300', '遵义市');
	   citys.set('520400', '安顺市');
	   citys.set('520500', '毕节市');
	   citys.set('520600', '铜仁市');
	   citys.set('522300', '黔西南布依族苗族自治州');
	   citys.set('522600', '黔东南苗族侗族自治州');
	   citys.set('522700', '黔南布依族苗族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '530000', name: '云南省', citys: citys});
	   citys.set('530100', '昆明市');
	   citys.set('530300', '曲靖市');
	   citys.set('530400', '玉溪市');
	   citys.set('530500', '保山市');
	   citys.set('530600', '昭通市');
	   citys.set('530700', '丽江市');
	   citys.set('530800', '普洱市');
	   citys.set('530900', '临沧市');
	   citys.set('532300', '楚雄彝族自治州');
	   citys.set('532500', '红河哈尼族彝族自治州');
	   citys.set('532600', '文山壮族苗族自治州');
	   citys.set('532800', '西双版纳傣族自治州');
	   citys.set('532900', '大理白族自治州');
	   citys.set('533100', '德宏傣族景颇族自治州');
	   citys.set('533300', '怒江傈僳族自治州');
	   citys.set('533400', '迪庆藏族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '540000', name: '西藏自治区', citys: citys});
	   citys.set('540100', '拉萨市');
	   citys.set('540200', '日喀则市');
	   citys.set('542100', '昌都地区');
	   citys.set('542200', '山南地区');
	   citys.set('542400', '那曲地区');
	   citys.set('542500', '阿里地区');
	   citys.set('542600', '林芝地区');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '610000', name: '陕西省', citys: citys});
	   citys.set('610100', '西安市');
	   citys.set('610200', '铜川市');
	   citys.set('610300', '宝鸡市');
	   citys.set('610400', '咸阳市');
	   citys.set('610500', '渭南市');
	   citys.set('610600', '延安市');
	   citys.set('610700', '汉中市');
	   citys.set('610800', '榆林市');
	   citys.set('610900', '安康市');
	   citys.set('611000', '商洛市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '620000', name: '甘肃省', citys: citys});
	   citys.set('620100', '兰州市');
	   citys.set('620200', '嘉峪关市');
	   citys.set('620300', '金昌市');
	   citys.set('620400', '白银市');
	   citys.set('620500', '天水市');
	   citys.set('620600', '武威市');
	   citys.set('620700', '张掖市');
	   citys.set('620800', '平凉市');
	   citys.set('620900', '酒泉市');
	   citys.set('621000', '庆阳市');
	   citys.set('621100', '定西市');
	   citys.set('621200', '陇南市');
	   citys.set('622900', '临夏回族自治州');
	   citys.set('623000', '甘南藏族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '630000', name: '青海省', citys: citys});
	   citys.set('630100', '西宁市');
	   citys.set('630200', '海东市');
	   citys.set('632200', '海北藏族自治州');
	   citys.set('632300', '黄南藏族自治州');
	   citys.set('632500', '海南藏族自治州');
	   citys.set('632600', '果洛藏族自治州');
	   citys.set('632700', '玉树藏族自治州');
	   citys.set('632800', '海西蒙古族藏族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '640000', name: '宁夏回族自治区', citys: citys});
	   citys.set('640100', '银川市');
	   citys.set('640200', '石嘴山市');
	   citys.set('640300', '吴忠市');
	   citys.set('640400', '固原市');
	   citys.set('640500', '中卫市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '650000', name: '新疆维吾尔自治区', citys: citys});
	   citys.set('650100', '乌鲁木齐市');
	   citys.set('650200', '克拉玛依市');
	   citys.set('652100', '吐鲁番地区');
	   citys.set('652200', '哈密地区');
	   citys.set('652300', '昌吉回族自治州');
	   citys.set('652700', '博尔塔拉蒙古自治州');
	   citys.set('652800', '巴音郭楞蒙古自治州');
	   citys.set('652900', '阿克苏地区');
	   citys.set('653000', '克孜勒苏柯尔克孜自治州');
	   citys.set('653100', '喀什地区');
	   citys.set('653200', '和田地区');
	   citys.set('654000', '伊犁哈萨克自治州');
	   citys.set('654200', '塔城地区');
	   citys.set('654300', '阿勒泰地区');
	   citys.set('659000', '自治区直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '710000', name: '台湾省', citys: citys});

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '810000', name: '香港特别行政区', citys: citys});

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '820000', name: '澳门特别行政区', citys: citys});

	   //标准合同类型状态
		this.ContractStandardTypeBusinStatus = new ListMap();
		this.ContractStandardTypeBusinStatus.set('00', '登记');
		this.ContractStandardTypeBusinStatus.set('01', '生效');
		this.ContractStandardTypeBusinStatus.set('02', '停用');

}
