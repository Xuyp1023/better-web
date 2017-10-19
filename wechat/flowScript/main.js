
var ctrlArr = [];
ctrlArr.push(require('./financeFlow/flow.financeDetailController'));
ctrlArr.push(require('./financeFlow/flow.financeAuditController'));

//流程相关
ctrlArr.push(require('./flow/todoFlowController'));
ctrlArr.push(require('./flow/didFlowController'));
ctrlArr.push(require('./flow/flowRecordController'));

exports.installAllControllers = function(){
	for (var i = 0; i < ctrlArr.length; i++) {
		var tempCtrl = ctrlArr[i];
		tempCtrl.installController.apply(window,arguments);
	}
};
