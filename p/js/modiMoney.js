/*
个人资产模块
作者:bhg
*/
define(function(require,exports,module){
	require.async(['p/js/common/dicTool','l/bootstrap/js/bootstrap.min',"l/My97DatePicker/4.8/WdatePicker"],function(){
		require.async(['BTDictData'],function(){
	var validate = require("m/sea_modules/validate");
    var tipbar = require("m/sea_modules/tooltip");
    var common = require("p/js/common/common");
    var loading = require("m/sea_modules/loading");

	//模块数据声明和初始化(Model)
	window.currentData = {
		moneyList :[]
	};


	//模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
	window.viewModel = {
		//属性绑定监控
		moneyListBind : ko.observableArray(currentData.moneyList),
		crtFlow : function(data,event){
			var target = $(event.target||event.srcElement),
			moneyStr = $('#write_money_area').val();
			isTrue = _personModule.createMoneyList(moneyStr);
			if(isTrue.message){
				tipbar.errorTopTipbar(target,isTrue.message);
				return;
			}
			if(!isTrue){
				tipbar.errorTopTipbar(target,'您输入的金额段格式有误，请重新输入');
				return;
			}
			//写入金额段数据
			$.post(common.getRootPath()+'/flow/saveFlowParams',{aduitAmountRange:moneyStr},function(data){
				if(data.code === 200){
					tipbar.errorTopTipbar(target,'更新成功');
					_personModule.reFreshTicketList();
				}else{
					tipbar.errorTopTipbar(target,'更新失败,原因:'+data.message);
				}
			},'json');
			
		},
		preeSeeList : function(data,event){
			var moneyStr = $('#write_money_area').val(),
			target = $(event.target||event.srcElement);
			isTrue = _personModule.createMoneyList(moneyStr);
			if(isTrue.message){
				tipbar.errorTopTipbar(target,isTrue.message);
				return;
			}
			if(!isTrue){
				tipbar.errorTopTipbar(target,'您输入的金额段格式有误，请重新输入');
			}
		}

		
	};

	//定义私有属性以及方法
	var _personModule = {
		
		//刷新基金数据
		reFreshTicketList : function(){
			//弹出弹幕加载状态
			loading.addLoading($('#pree_see_money'),common.getRootPath());
			$.post(common.getRootPath()+'/flow/selectFlowParams',{},function(data){
					//关闭加载状态弹幕
					loading.removeLoading($('#pree_see_money'),function(){
						if(data.code === 200){
							_personModule.createMoneyList(data.data.aduitAmountRange);
							$('#write_money_area').val(data.data.aduitAmountRange);
						}
						
					});
					
			},'json');
		},
		//处理生成金额段列表
		createMoneyList : function(moneyStr){
			var moneyList = [],
			singleList = moneyStr.split(',');
			for (var i = 0; i < singleList.length; i++) {
				var tempSingle = singleList[i],
				prevSingle = singleList[i===0?0:i-1];
				if(!/^\d+$/.test(tempSingle)){
					return false;
				}else if(Number(tempSingle)<Number(prevSingle)){
					return {message:'请按照递增的顺序设定审批金额段!'};
				}else{
					/*if(tempSingle !== '0'){
						if(i === 0){
							moneyList.push('审批金额: 大于或等于 0 万元,小于 '+tempSingle+' 万元');
						}else if(i===singleList.length-1){
							moneyList.push('审批金额: 大于等于 '+prevSingle+' 万元,小于 '+tempSingle+' 万元');
							moneyList.push('审批金额: 大于等于 '+tempSingle+' 万元,小于 '+'无限大 万元');
						}else{
							moneyList.push('审批金额: 大于等于 '+prevSingle+' 万元,小于 '+tempSingle);
						}
					}*/
					if(tempSingle !== '0'){
						if(i === 0){
							moneyList.push('0  -  '+tempSingle);
						}else{
							moneyList.push(prevSingle+'  -  '+tempSingle);
						}
						if(i===singleList.length-1){
							moneyList.push(tempSingle+'  -  '+'无限大');
						}
					}
				}
			}
			currentData.moneyList = moneyList;
			viewModel.moneyListBind(currentData.moneyList);
			common.resizeIframe();
			return true;
		}

	};

	
	

	ko.applyBindings(viewModel);

	//数据初始化
	_personModule.reFreshTicketList();
	//公共事件绑定 


});
});
});