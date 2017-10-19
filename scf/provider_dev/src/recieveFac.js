/*
应收账款 
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
    var comfilter = require("./libs/commonfilter");
    var BTPATH = require("./libs/commonpath");
    var pages = require("./libs/pages");
	var upload = require("./libs/uploads");

	require('angular');

	//定义模块
	var mainApp = angular.module('mainApp',['upload','pagination']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })


	//业务模块
	mainApp.service('mainService',['$rootScope',function($rootScope){
		return {
			//初始化核心企业列表
			initCoreComp : function(callback){
				$.post(BTPATH.CORE_COMP_LIST,{},function(data){
					if(data&&(data.code === 200)){
						//把获取到的其列列表存入字典
						var tempCustInfo = new ListMap();
						for(var index in data.data){
							var temp = data.data[index];
							tempCustInfo.set(temp.name,temp.value);
						}
						BTDict.CustInfo = tempCustInfo;
						if(callback) callback(data.data);
					}
				},'json');
			}
		};
	}]);

	//控制器区域
	mainApp.controller('mainController',['$scope','mainService',function($scope,mainService){
		/*VM绑定区域*/

		//分页配置
		$scope.tradeListPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

		//搜索所需信息
		$scope.searchData = {
			billNo:'',
			buyerNo:''
		};


		$scope.prePath = BTServerPath+'/scf/app/factoring';

		//核心企业列表
		$scope.compList = [];

		//票据列表
		$scope.billList = [];
		//票据资料修改数据
        $scope.updateBillInfo = {};
        //票据资料新增
        $scope.addBillInfo = {};

        //发票列表
        $scope.invoiceList = [];
        //新增发票信息数据
        $scope.addInvoiceInfo = {};
        //可关联合同列表
        $scope.contracts = [];

        //行业类型列表
        $scope.corpVocates = [];
        //票据类型列表
        $scope.billTypes = [];
        //票据流通方式列表
        $scope.billModes = [];

        //企业名称列表
        // $scope.cmpNames = [];

        //合同附件列表
        $scope.agreeAttachList = [];
        //上传发票附件列表
        $scope.addUploadList = [];	
        //上传票据附件列表
        $scope.editUploadList = [];	

        //上传配置
        $scope.uploadConf={};

		//分页 监听
		$scope.$watch('tradeListPage.pageNum', function(newValue,oldValue){
			if(newValue!==oldValue){
				$scope.reFreshBillList(false);
			}
		});


         //刷新票据列表数据
		$scope.reFreshBillList = function(flag){
			//是否需要分页信息 1：需要 2：不需要
			$scope.tradeListPage.flag = flag ? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.BILL_LIST_PATH,$.extend({},$scope.tradeListPage,$scope.searchData),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.billList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.tradeListPage = data.page;
						}
					});
				}
			},'json');
		};


        //初始化企业名称列表
  //       $scope.initCmpNames = function(){
  //       	var data = BTDict.FactorCoreCustInfo.toArray('value', 'text');
		// 	$scope.compList = data;
		// };


        //初始化数据（从字典获取）
        $scope.initDictData = function(){
        	//票据类型
        	var data = BTDict.BillNoteType.toArray('value', 'text');
			$scope.billTypes = data;
			//票据流通方式
			data = BTDict.BillFlowMode.toArray('value', 'text');
			$scope.billModes = data;
		};


        //初始化可关联合同信息    
        $scope.initLinkContracts = function(){
        	$.post(BTPATH.LINK_CONTRACT_LIST,{},function(data){
        		if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						//将合同列表格式化（value : text）
						var cons = new ListMap();
						for(var index in data.data){
							var temp = data.data[index];
							cons.set(temp.name,temp.value);
						}
						$scope.contracts = cons.toArray('value', 'text');
						// $scope.contracts = common.cloneArrayDeep(data.data);
					});
				}
			},'json');
		};


		//初始化行业类型信息
		$scope.initCorpVocates = function(){
			var data = BTDict.InvestCorpVocate.toArray('value', 'text');
			$scope.corpVocates = data;
		};


		//选择合同获取合同附件
		$scope.getContractAttach = function(){
			$.post(BTPATH.CONTRACT_PLUS_LIST,{id:$scope.updateBillInfo.agreeId},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.agreeAttachList = common.cloneArrayDeep(data.data);
					});
				}
			},'json');
		};


		//查询附件列表（合同 + 票据）
		$scope.getAttachment = function(){
			$.post(BTPATH.PLUS_PATH,{"billId":$scope.updateBillInfo.id},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						//根据附件类别分别添加
						$scope.editUploadList = ArrayPlus(data.data).objectChildFilter('fileInfoType','billAccessory');
   						$scope.agreeAttachList = ArrayPlus(data.data).objectChildFilter('fileInfoType','agreeAccessory');
					});
				}
			},'json');
		};

		//获取票据对应的发票列表
		$scope.reFreshInvoiceList = function(){
			$.post(BTPATH.INVO_LIST,{"billId":$scope.updateBillInfo.id},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.invoiceList = common.cloneArrayDeep(data.data);
					});
				}
			},'json');
		};

		//添加发票信息
		$scope.addInvoice = function(target){
			$scope.addInvoiceInfo.fileList = ArrayPlus($scope.addUploadList).extractChildArray('id',true);
			$scope.addInvoiceInfo.billNo = $scope.updateBillInfo.billNo;
			$scope.addInvoiceInfo.billId = $scope.updateBillInfo.id;
			//校验
			var result=validate.validate($('#addInvoice_form'));
			if (!result) {
				tipbar.errorTopTipbar($(target),'您还有信息项没有正确填写!',3000,99999);
				return false;
			}
			if($scope.addUploadList.length===0){
				tipbar.errorLeftTipbar($(target),'请先上传发票附件！',3000,999999);
				return false;
			}
			$.post(BTPATH.ADD_INVOICE,$scope.addInvoiceInfo,function(data){	
				//成功后刷新
 		        if (data.code === 200) {
                    $scope.$apply(function(){
                    	//添加附件id字段到发票（下载）
                    	$scope.addInvoiceInfo.itemId = $scope.addUploadList[0].id;
                    	$scope.invoiceList.push(data.data);
                    	$scope.closeAddInvoicePanel();
                    });
                    tipbar.infoTopTipbar('发票信息添加成功！',{});
                } else {
                	tipbar.errorLeftTipbar($(target),'发票信息添加失败，服务端返回信息:'+data.message,3000,999999);
                }
			},'json');
		};

		//添加发票数据后续处理
		$scope._addInvoiceAfter = function(){
			$scope.addInvoiceInfo = {};
			$scope.addUploadList = [];
		};           		


		//删除发票信息
		$scope.deleteInvoice = function(target,id){
			$.post(BTPATH.DEL_INVOICE,{"id":id},function(data){
				//成功后刷新
 		        if (data.code === 200) {
 		        	$scope.$apply(function(){
 		        		$scope.invoiceList = ArrayPlus($scope.invoiceList).delChild('id',id);
                    });
                    tipbar.infoTopTipbar('发票信息删除成功！',  {});
                } else {
                	tipbar.errorLeftTipbar($(target),'发票信息删除失败，服务端返回信息:'+data.message,3000,999999);
                }
			},'json');
		};


		//关联商业承兑汇票（完善票据）
		$scope.updateAcceptBill = function(target){
			$scope.updateBillInfo.fileList = ArrayPlus($scope.editUploadList).extractChildArray('id',true);
			if($scope.editUploadList.length===0){
				tipbar.errorLeftTipbar($(target),'至少上传一个票据附件！',3000,999999);
				return false;
			}
			//是否已选择合同
			var agreeId = $scope.updateBillInfo.agreeId;
			var exist = ArrayPlus($scope.contracts).objectChildFilter('value',agreeId);
			if(!agreeId || exist.length<=0){
				tipbar.errorLeftTipbar($(target),'请选择要关联的合同！',3000,999999);
				return false;
			}
			$.post(BTPATH.UPDATE_ACCEPT_BILL,$scope.updateBillInfo,function(data){	
				//成功后刷新
 		        if (data.code === 200) {
 		        	//刷新列表数据
 		        	$scope.reFreshBillList(true);
                    $scope.backForward();
                    tipbar.infoTopTipbar('票据信息修改成功！', {});
                } else {
                	tipbar.errorLeftTipbar($(target),'票据信息修改失败，服务端返回信息:'+data.message,3000,999999);
                }
			},'json');
		};

		//票据数据置空处理
		$scope._editBillAfter = function(){
			$scope.updateBillInfo = {};
			$scope.invoiceList = [];
			$scope.editUploadList = [];
		};


		/*事件处理区域*/
		//更新票据信息按钮
		$scope.showUpdatePanel = function(event,index){
			var target = $(event.target||event.srcElement);
			$scope.updateBillInfo = $.extend({
				"billType":'',
				"coreCustNo":'',
				"billMode":''
			}, $scope.billList[index]);
			$('#fix_operator_info_box').slideDown('fast',function(){
				//获取发票列表
				$scope.reFreshInvoiceList();
				//获取相关的附件（合同 + 票据）
				$scope.getAttachment();
			});
		};

		//关闭更新票据下拉帘
		$scope.backForward = function(){
			$scope._editBillAfter();
			$('#fix_operator_info_box').slideUp();
			common.pageSkip($("#fund_search_way"));
		};



		//查看单个票据详情
		$scope.showDetailPanel = function(event,index){
			var target = $(event.target||event.srcElement);
			$scope.updateBillInfo = $.extend({
				"billType":'',
				"coreCustNo":'',
				"billMode":''
			}, $scope.billList[index]);
			$('#look_operator_info_box').slideDown('fast',function(){
				//获取发票列表
				$scope.reFreshInvoiceList();
				//获取相关的附件（合同 + 票据）
				$scope.getAttachment();
			});
		};


		//关闭票据详情下拉帘
		$scope.closeDetailPanel = function(){
			$scope._editBillAfter();
			$('#look_operator_info_box').slideUp();
			common.pageSkip($("#fund_search_way"));
		};


		//打开票据新增下拉框
		$scope.showAddPanel = function(){
			$scope.addBillInfo = {};
			$scope.addBillInfo = {
				"billType": $scope.billTypes[0].value,
				"billMode": $scope.billModes[0].value,
				"coreCustNo": $scope.compList[0].value,
				"agreeId": $scope.contracts.length>=1 ? $scope.contracts[0].value : '',
			};
			$('#add_operator_info_box').height($('body').height()).slideDown('fast');
		};

		//关闭票据新增下拉框
		$scope.closeAddPanel = function(){
			$('#add_operator_info_box').slideUp();
		};


		//新增票据
		$scope.addAcceptBill = function(target){
			//校验表单
			var result=validate.validate($('#addBill_form'));
			if (!result) {
				tipbar.errorTopTipbar($(target),'您还有信息项没有正确填写!',3000,99999);
				return false;
			}
			$.post(BTPATH.ADD_ACCEPT_BILL,$scope.addBillInfo,function(data){	
				//成功后刷新
 		        if (data.code === 200) {
 		        	//刷新列表数据
 		        	$scope.reFreshBillList(true);
                    $scope.backForward();
                    tipbar.infoTopTipbar('票据信息新增成功！', {});
                    $scope.closeAddPanel();
                } else {
                	tipbar.errorLeftTipbar($(target),'票据信息新增失败，服务端返回信息:'+data.message,3000,999999);
                }
			},'json');
		};


		//添加发票信息下拉框
		$scope.showAddInvoicePanel = function(event){
			var height = $("#fix_operator_info_box .div-center").height();
			$('#add_invoice_box').height(height).slideDown();
			$scope.addInvoiceInfo.corpVocate = $scope.corpVocates[0].value;
		};

		//关闭发票信息下拉框
		$scope.closeAddInvoicePanel = function(){
			$scope._addInvoiceAfter();
			common.cleanPageTip();
			$('#add_invoice_box').slideUp();
		};

		//日期处理
		$scope.dateEmitter = {
			changeDateInfo : function(event){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};


		//开启上传
		$scope.openUpload = function(event,type,typeName,list,topBox){
			$scope.uploadConf = {
				//上传触发元素
				event:event.target||event.srcElement,
				//上传附件类型
				type:type,
				//类型名称
				typeName:typeName,
				//存放上传文件
				uploadList:$scope[list],
				//当前页面div
				topBox:topBox,
				//错误提示方式 note/slide
				prompt:'note',
				//触发组件动作
				watch:Math.random()
			};
		};


		//删除票据附件
		$scope.delBillUpload = function(data,list){
			$scope[list] = ArrayPlus($scope[list]).delChild('id',data.id);

			$.post(common.getRootPath()+'/ScfBill/delAccessory',{"id":data.id ,"billId":$scope.updateBillInfo.id},function(data){	
 		        if (data.code === 200) {
                    tipbar.infoTopTipbar('票据附件删除成功！');
                } else {
                	tipbar.errorLeftTipbar($(target),'票据附件删除失败，服务端返回信息:'+data.message,3000,999999);
                }
			},'json');
		};



		/*外部事件绑定*/
		window.dateEmitter = {
			changeDateInfo:function(){
				var target = event.target||event.srcElement;
				var dateName = $(target).attr('dateName'),
				dateData = $(target).attr('dateData');
				$scope[dateData][dateName] = target.value;
			}
		};

		/*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
            common.resizeIframeListener();  
        });

		/*数据初始区域*/

        //初始化核心企业列表
		mainService.initCoreComp(function(data){
			$scope.$apply(function(){
				$scope.compList = BTDict.CustInfo.toArray('value', 'text');
				$scope.searchData.buyerNo = $scope.compList[0].value;
			});
			//初始化票据列表
			$scope.reFreshBillList(true);		
		});

		//初始化可关联合同列表
		$scope.initLinkContracts();
		//初始化企业名称列表
		// $scope.initCmpNames();
		//初始化票据类型/票据流通方式
		$scope.initDictData();
		//初始化行业类别列表
		$scope.initCorpVocates();



		/*表单验证 添加票据*/ 
      	validate.validate($('#addBill_form'), {
      	      elements: [{
      	          name: 'balance',
      	          rules: [{
      	              name: 'money'
      	          }],
      	          events: ['blur']
      	      }],
      	      errorPlacement: function(error, element) {
      	          var label = element.parents('td').prev().text().substr(0);
      	          tipbar.errorTopTipbar(element,label+error,3000,99999);
      	      }
      	});


		/*表单验证 新增发票*/ 
      	validate.validate($('#addInvoice_form'), {
      	      elements: [],
      	      errorPlacement: function(error, element) {
      	          var label = element.parents('td').prev().text().substr(0);
      	          if(element.attr('name')!== 'balance'){
      	          	tipbar.errorLeftTipbar(element,label+error,0,99999);
      	          }else{
      	          	tipbar.errorTopTipbar(element,label+error,3000,99999);
      	          }
      	      }
      	});

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

