/*
合同管理 
作者:bhg
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var base64 = require('base64');
    require('modal');
    require('date');
    require("upload");


	//定义模块
	var mainApp = angular.module('mainApp',['modal','date','pagination','upload']);

	//扩充公共指令库
	comdirect.direcPlus(mainApp);

	//扩充公共过滤器
	comfilter.filterPlus(mainApp);

	//扩充公共服务
	comservice.servPlus(mainApp);

	//兼容IE模式
	// .config(function($sceProvider){
	// 	$sceProvider.enabled(false);
	// })

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','form',function($scope,http,commonService,form){
		/*VM绑定区域*/
		//分页数据
		$scope.tradeListPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//搜索所需信息
		$scope.searchData = {
			GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEregDate :new Date().format('YYYY-MM-DD'),
			// buyerNo : '',
			// supplierNo:'',
			agreeNo:'',
		};

		//新增合同对象
		$scope.addContraInfo = {
			buyerNo : '',
			supplierNo:'',
			agreeStartDate : new Date().format('YYYY-MM-DD'),
			agreeEndDate : new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
			deliveryDate : new Date().format('YYYY-MM-DD')
		};

		$scope.editContraInfo = {status:'0'};

		$scope.AgreementList = [];
		//用户以及核心企业
		$scope.custList = [];
		$scope.coreCustList = [];

		$scope.addUploadList = [];

		$scope.editUploadList = [];

		//刷新客户合同数据
		$scope.reFreshAgreementList = function(flag){
			$scope.tradeListPage.flag = flag? 1 : 2;
			//弹出弹幕加载状态
			loading.addLoading($('#search_info table'),common.getRootPath());
			$.post(BTPATH.CONTR_LIST,$.extend({},$scope.searchData,$scope.tradeListPage),function(data){
				//关闭加载状态弹幕
				loading.removeLoading($('#search_info table'));
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.AgreementList = common.cloneArrayDeep(data.data);
						if(flag){
							$scope.tradeListPage = data.page;
						}
					});
				}
			},'json');
		};



		//查询保理机构信息
	/*	$scope.searchFactorDetail = function(flag){
			return $.post(BTPATH.QUERY_FACTOR_CORECUSTINFO,{},function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.$apply(function(){
						$scope.AgreementList = data.data;
					});
				}
			},'json');
		};
*/

		//新增合同
		$scope.addContract = function(target){
			var result=validate.validate($('#addContract_form'));
			$target=$(event.target);
			if (!result) {
				tipbar.errorTopTipbar($target,'您还有信息项没有正确填写!',3000,99999);
				return;
			}
			common.cleanPageTip();
			$scope.addContraInfo.agreeId = $scope.addContraInfo.id;
			$scope.addContraInfo.fileList = ArrayPlus($scope.addUploadList).extractChildArray('id',true);
			$.post(BTPATH.ADD_CONTRACT,$scope.addContraInfo,function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.backForward();
					$scope.reFreshAgreementList(true);
					//成功后刷新
					$scope.$apply(function(){
						$scope.addContraInfo = {
							buyerNo : $scope.addContraInfo.buyerNo,
							agreeStartDate : new Date().format('YYYY-MM-DD'),
							agreeEndDate : new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
							deliveryDate : new Date().format('YYYY-MM-DD')
						};
						$scope.addUploadList = [];
					});
				}else{
					tipbar.errorTopTipbar($(target),'新增失败，服务端返回信息:'+data.message,3000,99999);
				}
			},'json');
		};

		//切换机构
		/*$scope.changeCust = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.supplierNo},$scope,'coreCustList','CoreCustListDic').success(function(){
				$scope.searchData.buyerNo = $scope.coreCustList.length>0?$scope.coreCustList[0].value:'';
			});
		};*/


		//查询合同
		$scope.queryList = function(){
			$scope.tradeListPage.pageNum = 1;
			$scope.reFreshAgreementList(true);
		};

		//编辑合同
		$scope.editContract = function(target){
			var result=validate.validate($('#editContract_form'));
			$target=$(event.target);
			if (!result) {
				tipbar.errorTopTipbar($target,'您还有信息项没有正确填写!',3000,99999);
				return;
			}
			if($scope.editContraInfo.status !== '0'){
				tipbar.errorTopTipbar($(target),'只有草稿状态的合同可供修改!',3000,99999);
				return;
			}
			$scope.editContraInfo.agreeId = $scope.editContraInfo.id;
			$scope.editContraInfo.fileList = ArrayPlus($scope.editUploadList).extractChildArray('id',true);
			$.post(BTPATH.UPDATE_CONTRACT,$scope.editContraInfo,function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					$scope.backForwardEdit();
					$scope.reFreshAgreementList(true);
				}else{
					tipbar.errorTopTipbar($(target),'编辑失败，服务端返回信息:'+data.message,3000,99999);
				}
			},'json');
		};

		//更改合同状态
		$scope.changeConStatus = function(target,flag){
			var $target = $(target);
			$.post(BTPATH.USE_CONTRACT,{agreeId:$scope.editContraInfo.id},function(data){
				if((data!==undefined)&&(data.code === 200)){
					// tipbar.errorTopTipbar($('#edit_confirm_btn'),'启用成功!',3000,99999);
					$scope.$apply(function(){
						$scope.editContraInfo.status = flag;
						$scope.editContraInfo.modiShow = true;
						$scope.editContraInfo.modiString = '启用成功!';
					});
				}else{
					$scope.$apply(function(){
						$scope.editContraInfo.modiShow = true;
						tipbar.errorTopTipbar($target,'启用失败，服务端返回信息:'+data.message,3000,99999);
					});

				}
			},'json');
		};

		//删除合同
		$scope.delConstract = function(target,data){
			// if(data.status !== '0'){
			// 	tipbar.errorTopTipbar($(target),'只有草稿状态的合同可进行删除操作!',3000);
			// 	return;
			// }
			dialog.confirm('合同作废后将无法恢复,您确定作废此项合同吗？',function(){
				$.post(BTPATH.DEL_CONTRACT,{agreeId:data.id},function(data){
					if(data&&(data.code === 200)){
						$scope.$apply(function(){
							$scope.editContraInfo.status = '2';
						});
						$scope.reFreshAgreementList(true);
					}else{
						tipbar.errorLeftTipbar($(target),'作废合同失败，服务端返回信息:'+data.message);
					}
				},'json');
			});
		};

		/*事件处理区域*/
		//新增合同按钮
		$scope.showAddPanel = function(event){
			var target = $(event.target||event.srcElement);
			//核心企业默认选中第一个
			$scope.addContraInfo.buyerNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value:'';
			$scope.custList = [];
			//查询供应商|经销商列表
			commonService.queryBaseInfoList(BTPATH.QUERY_CUSTLIST_BY_CORE,{"coreCustNo":$scope.addContraInfo.buyerNo},$scope,'custList').success(function(){
				$scope.addContraInfo.supplierNo = $scope.custList[0] ? $scope.custList[0].value:'';
			});
			
			$('#fix_operator_info_box')/*.height($('body').height())*/.slideDown('fast',function(){
				common.resizeIframeOld();
			});
		};

		//关闭下拉帘
		$scope.backForward = function(){
			$('#fix_operator_info_box').slideUp();
			common.cleanPageTip();
		};

		//开启编辑下拉帘
		$scope.showEditBox = function($target,data){
			$scope.editContraInfo = $.extend({},data);
			$scope.custList = [];
			//查询供应商|经销商列表
			commonService.queryBaseInfoList(BTPATH.QUERY_CUSTLIST_BY_CORE,{"coreCustNo":$scope.editContraInfo.buyerNo},$scope,'custList').success(function(){
				// $scope.editContraInfo.supplierNo = $scope.custList[0] ? $scope.custList[0].value:'';
			});
			
			$('#fix_edit_info_box')/*.height($('body').height()+300)*/.slideDown('fast',function(){
				// if(data.status !== '0'){
				// 	$('#fix_edit_info_box form').find(':input:not(:radio)').attr('disabled',true);
				// }else{
				// 	$('#fix_edit_info_box form').find(':input:not(:radio)').attr('disabled',false);
				// }
				$.post(BTPATH.CONTRACT_PLUS_LIST,{agreeId:$scope.editContraInfo.id},function(data){
					if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
						$scope.$apply(function(){
							$scope.editUploadList = data.data;
						});
					}
				},'json');

				// common.resizeIframe();
			});
		};
		//关闭编辑下拉帘
		$scope.backForwardEdit = function(){
			common.cleanPageTip();
			$scope.editContraInfo.modiShow = false;
			$('#fix_edit_info_box').slideUp();
		};

		//开启合同附件上传
		$scope.showPlusUpload = function(event,pid){
			common.cleanPageTip();
			var target = $(event.target||event.srcElement),
			box = $(pid),
			pbox = box.parents('.top-box'),
			uploadIframe = box.find('iframe');
			box.height(pbox.height()).slideDown('slow',function(){
				common.pageSkip(box);
				return;
			});

			//关闭遮罩层
			loading.removeLoading(box);
			uploadIframe.attr('src',common.getRootPath()+'/scf/app/upload/upload.html?rn='+Math.random());
		};

		$scope.uploadIframeLoad = function(id,pid,lflag,type,list){
			var uploadPage = $(window.frames[id].document),
			flag = uploadPage.find('#upload_flag').val();
			if(flag==='upload'){
			    uploadPage.find('#file_name').html(lflag);
			    // $(pid).find('[mapping="upload_index"]').val(target.parents('tr').attr('index'));
			    // uploadPage.find('#fileTypeName').val(data.type);
			    //设置上传地址
			    uploadPage.find('#upload_form').attr('action',BTPATH.UPLOAD_BACK_INFO+'?fileTypeName='+type);
			    //释放确认上传按钮
			    $(pid).find('[mapping="upload_btn"]').fadeIn();
			}else{
			    $scope.cancelPlusUpload(pid);
			    var uploadOpenBtn = $(pid).parents('.top-box').find('[mapping="upload_open_btn"]');
			    var resultStr = uploadPage.find('body').html();
			    //文件数据量过大(超过10M)，被nigix拦截返回信息
			    if(resultStr.indexOf('nginx')!==-1){
			        tipbar.errorLeftTipbar(uploadOpenBtn,'上传失败，服务端返回信息:文件大小过大(不能超过10MB)',3000,99999);
			        return;
			    }
			    var response = JSON.parse(resultStr);
			    //后端返回错误处理
			    if(response.code !== 200){
			        tipbar.errorLeftTipbar(uploadOpenBtn,'上传失败，服务端返回信息:'+response.message,3000,99999);
			        if(console) console.log(response);
			        // tipbar.infoTopTipbar('上传失败，服务端返回信息:'+response.message,{
			        //     msg_box_cls : 'alert alert-warning alert-block',
			        //     during:2000
			        // });
			        return;
			    }
			    $scope[list].push({
			    	id:response.data.id,
			    	fileName:response.data.fileName,
			    	url:BTPATH.DOWNLOAD_FILE+'?id='+response.data.id
			    });
			    //上传成功后打印日志
			    if(console){
			    console.log(response);
			    }
			}
		};

		//确定上传
		$scope.confirmUpload = function(target,id,pid){
		    var $target = $(target);
		    var uploadPage = $(window.frames[id].document),
		    fileData = uploadPage.find('[name="Filedata"]').val(),
		    box = $(pid);
		    //校验是否选择文件
		    if(fileData===''){
		        tipbar.errorTopTipbar($target,'还未选取需要上传的文件，请检查!',3000,99999);
		        return;
		    }
		    uploadPage.find('#upload_form').submit();
		    //隐藏上传按钮
		    box.find('[mapping="upload_btn"]').fadeOut();
		    //生成上传状态
		    loading.addLoading(box,common.getRootPath());
		};

		//删除上传文件
		$scope.delAddUpload = function(data,list,pid){
			$scope[list] = ArrayPlus($scope[list]).delChild('id',data.id);
			common.pageSkip($(pid).parents('.top-box').find('.upload-list-table'));
			$.post(BTPATH.DEL_CONTRACT_PLUS,{id:data.id,agreeId:$scope.editContraInfo.id},function(){},'json');
			// dialog.confirm('附件删除后无法恢复,确认要删除该附件吗？',function(){});
		};

		//关闭合同附件上传
		$scope.cancelPlusUpload = function(pid){
			$(pid).slideUp(100,function(){
				common.pageSkip($(pid).parents('.top-box').find('.upload-list-table'));
			});
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
		
		//分页事件
		$scope.pageEmitter = {
			firstPage : function(){
				$scope.tradeListPage.pageNum=1;
				$scope.reFreshAgreementList(false);
			},
			endPage : function(){
				$scope.tradeListPage.pageNum=$scope.tradeListPage.pages;
				$scope.reFreshAgreementList(false);
			},
			prevPage : function(){
				$scope.tradeListPage.pageNum--;
				$scope.reFreshAgreementList(false);
			},
			nextPage : function(){
				$scope.tradeListPage.pageNum++;
				$scope.reFreshAgreementList(false);
			},
			skipPage : function(data,event){
				var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
				if(isNaN(pageNum)||pageNum.split('.').length>1||Number(pageNum)<1||Number(pageNum)>$scope.tradeListPage.pages){
					$('#fund_list_page [name="skipToPageNum"]').val('');
					tipbar.errorTipbar($(event.target),'请填写正确的页数!',1000);
					return;
				}
				$scope.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
				$('#fund_list_page [name="skipToPageNum"]').val('');
				$scope.reFreshAgreementList(false);
			}
		};

		/*公共绑定*/
		$scope.$on('ngRepeatFinished',function(){
			common.resizeIframeOld();  
		});

		//程序入口
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_CORELIST,{factorNo:""},$scope,'coreCustList','CoreCustListDic').success(function(){
					$scope.searchData.buyerNo = $scope.coreCustList.length>0?$scope.coreCustList[0].value:'';
					$scope.reFreshAgreementList(true);

					/*commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_CORECUSTINFO,{custNo:$scope.searchData.buyerNo},$scope,'coreCustList','CoreCustListDic').success(function(){
						$scope.searchData.supplierNo = $scope.coreCustList.length>0?$scope.coreCustList[0].value:'';
						$scope.reFreshAgreementList(true);
					});*/

			});
		};


		/*表单验证*/
      	validate.validate($('#addContract_form'), {
      	      elements: [{
      	          name: 'addContraInfo.objectionPeriod',
      	          rules: [{
      	              name: 'int'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'addContraInfo.bankAccount',
      	          rules: [{
      	              name: 'number'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'addContraInfo.balance',
      	          rules: [{
      	              name: 'money'
      	          }],
      	          events: ['blur']
      	      }],
      	      errorPlacement: function(error, element) {
      	          var label = element.parents('td').prev().text().substr(0);
      	          if(element.attr('name')!== 'balance'){
      	          	tipbar.tdTipbar(element,label+error,0,99999);
      	          }else{
      	          	tipbar.tdTipbar(element,label+error,3000,99999);
      	          }
      	      }
      	});
      	validate.validate($('#editContract_form'), {
      	      elements: [{
      	          name: 'editContraInfo.objectionPeriod',
      	          rules: [{
      	              name: 'int'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'editContraInfo.bankAccount',
      	          rules: [{
      	              name: 'number'
      	          }],
      	          events: ['blur']
      	      },{
      	          name: 'editContraInfo.balance',
      	          rules: [{
      	              name: 'money'
      	          }],
      	          events: ['blur']
      	      }],
      	      errorPlacement: function(error, element) {
      	          var label = element.parents('td').prev().text().substr(0);
      	          if(element.attr('name')!== 'balance'){
      	          	tipbar.tdTipbar(element,label+error,0,99999);
      	          }else{
      	          	tipbar.tdTipbar(element,label+error,3000,99999);
      	          }
      	      }
      	});

      	$scope.initPage();

	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

