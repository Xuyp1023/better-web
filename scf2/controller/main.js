/*
各控制器打包区域
@author binhg
*/
define(function(require,exports,module){
	var ctrlArr = [];

	//开户优化
	ctrlArr.push(require('./temp/tempController'));
	ctrlArr.push(require('./account/own.OpenController'));
	ctrlArr.push(require('./account/account.ActiveController'));
	ctrlArr.push(require('./account/account.SuccessController'));
	ctrlArr.push(require('./account/plat.RecordController'));
	ctrlArr.push(require('./account/plat.ReviewController'));
	ctrlArr.push(require('./account/plat.AuditController'));
	ctrlArr.push(require('./account/account.replaceController'));
	ctrlArr.push(require('./account/account.wayController'));
	ctrlArr.push(require('./account/account.auditingController'));

	//流程定义
	ctrlArr.push(require('./flowDefine/process.listController'));
	ctrlArr.push(require('./flowDefine/process.editController'));
	ctrlArr.push(require('./flowDefine/node.defineController'));
	ctrlArr.push(require('./flowDefine/step.listController'));
	ctrlArr.push(require('./flowDefine/step.defineController'));
	ctrlArr.push(require('./flowDefine/loan.defineController'));

	//流程任务
	ctrlArr.push(require('./flowTask/task.finishedController'));
	ctrlArr.push(require('./flowTask/task.backlogController'));
	ctrlArr.push(require('./flowTask/process.MonitoringController'));
	ctrlArr.push(require('./flowTask/task.listController'));
	ctrlArr.push(require('./flowTask/task.handleController'));
	ctrlArr.push(require('./flowTask/process.assignOperateController'));

	//客户关系管理
	ctrlArr.push(require('./customerRelation/core.RelationManageController'));
	ctrlArr.push(require('./customerRelation/RelationManageController'));
	ctrlArr.push(require('./customerRelation/core.relateSupplierController'));
	ctrlArr.push(require('./customerRelation/core.relateBuyerController'));
	ctrlArr.push(require('./customerRelation/core.addRelationController'));
	ctrlArr.push(require('./customerRelation/supplier.RelationManageController'));
	ctrlArr.push(require('./customerRelation/supplier.addRelationController'));
	ctrlArr.push(require('./customerRelation/supplier.RelateCoreController'));
	ctrlArr.push(require('./customerRelation/supplier.openFactorController'));
	ctrlArr.push(require('./customerRelation/fac.UploadDataController'));
	ctrlArr.push(require('./customerRelation/supplier.facDetailController'));
	ctrlArr.push(require('./customerRelation/fac.openFacAcceptController'));
	ctrlArr.push(require('./customerRelation/fac.openFacAuditController'));
	ctrlArr.push(require('./customerRelation/qie.factorDetailController'));

	//合同类型
	ctrlArr.push(require('./contract/type/contractType.manageController'));
	ctrlArr.push(require('./contract/type/contractType.addController'));
	ctrlArr.push(require('./contract/type/contractType.editController'));
	ctrlArr.push(require('./contract/type/contractType.auditController'));
	ctrlArr.push(require('./contract/type/contractType.enableController'));
	ctrlArr.push(require('./contract/type/contractType.queryController'));
	ctrlArr.push(require('./contract/type/contractType.detailController'));


	//核心开户相关
	ctrlArr.push(require('./coreAccount/coreAccount.ActiveController'));
	ctrlArr.push(require('./coreAccount/coreAccount.auditingController'));
	ctrlArr.push(require('./coreAccount/coreAccount.SuccessController'));
	ctrlArr.push(require('./coreAccount/coreOwn.OpenController'));


	//权限管理相关
	// ctrlArr.push(require('./auth/auth.apiBindController'));
	// ctrlArr.push(require('./auth/auth.authTreeController'));
    
    //已异步加载
	// ctrlArr.push(require('./contractTemp/Contract.prototype'));
	// ctrlArr.push(require('./contractTemp/Contract.prototype.edit'));

	exports.installAllControllers = function(){
		for (var i = 0; i < ctrlArr.length; i++) {
			var tempCtrl = ctrlArr[i];
			tempCtrl.installController.apply(window,arguments);
		}
	};

});
