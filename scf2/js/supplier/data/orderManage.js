/*
订单管理
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


	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','form',function($scope,http,commonService,form){
		/*VM绑定区域*/
		$scope.statusList = BTDict.OrderStatus.toArray('value','name');
		$scope.typeList = BTDict.OrderType.toArray('value','name');
		$scope.settleType = BTDict.OrderSettleType.toArray('value','name');
		$scope.custList = [];
		$scope.coreCustList = [];
		//附件类型
		$scope.uploadType = ArrayPlus(BTDict.BaseInfoFile.toArray('value','name')).extractChildArrayByindexArray([1,2,3,4,5,6]);
		//==============================公共操作区 start=================================
		$scope.searchData = {
			custNo:'',
			coreCustNo:'',
			orderNo:'',
			GTEorderDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEorderDate:new Date().format('YYYY-MM-DD'),
			isOnlyNormal:'0'
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//订单管理列表
		$scope.infoList = [];
		//单个订单管理信息
		$scope.info = {};
		//文件列表
		$scope.otherFileList = [];
		$scope.infoFileList = [];



		//主列表操作控制
		$scope.mainListCtrl = {
			isCanDo : function(data){
				var businStatus = data.businStatus;
				return !businStatus||ArrayPlus(['0']).isContain(businStatus);
			},
			isCanRead:function(data){
				var businStatus = data.businStatus;
				return ArrayPlus(['0','1','2']).isContain(businStatus);
			}
		};

		//开启上传
		$scope.openUpload = function(event,type,typeName,list){
			$scope.uploadConf = {
				//上传触发元素
				event:event.target||event.srcElement,
				//上传附件类型
				type:type,
				//类型名称
				typeName:typeName,
				//存放上传文件
				uploadList:$scope[list]
			};
		};

		//开启上传(下拉选择附件)
	    $scope.openUploadDropdown = function(event,typeList,list){
	      $scope.uploadConf = {
	        //上传触发元素
	        event:event.target||event.srcElement, 
	        //存放上传文件
	        uploadList:$scope[list],
	        //附件类型列表
	        typeList:$scope[typeList]
	      };
	    };

	    //删除附件项
	    $scope.delUploadItem = function(item,listName){
	    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
	    };

		/*事件处理区域*/
		//查询订单管理
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//根据机构联动查询条件
		$scope.changeCust = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
				$scope.$apply(function(){
					$scope.searchData.coreCustNo = $scope.coreCustList[0].value;
				});
			});
		};

		//获取订单管理申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_LIST_ORDER,$.extend({},$scope.listPage,$scope.searchData))
				.success(function(data){
					//关闭加载状态弹幕
					loading.removeLoading($mainTable);
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.infoList = common.cloneArrayDeep(data.data);
							if(flag){
								$scope.listPage = data.page;
							}
						});
					} 	
			});
		};

		//编辑订单管理
		$scope.editInfo = function(target){
			var $target = $(target);

			var valid = validate.validate($('#edit_box'));
			if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			$scope.info.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);
			$scope.info.otherFileList = ArrayPlus($scope.otherFileList).extractChildArray('id',true);
			http.post(BTPATH.EDIT_INFO_ORDER,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('修改订单成功!',{});
				 		$scope.closeRollModal("edit_box");
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'订单编辑失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//新增订单管理
		$scope.addInfo = function(target){
			var $target = $(target);
			var valid = validate.validate($('#add_box'));
			if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

			$scope.info.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);
			http.post(BTPATH.ADD_INFO_ORDER,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.infoTopTipbar('订单添加成功!',{});
				 		$scope.closeRollModal('add_box');
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'订单添加失败,服务器返回:'+data.message,3000,6662);
				 	}
				 });
		};

		//根据机构联动编新增
		$scope.changeCustAdd = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.info.custNo},$scope,'coreCustList').success(function(){
				$scope.$apply(function(){
					$scope.info.coreCustNo = common.filterArrayFirst($scope.coreCustList);
				});
			});
		};


		/*
		 *模板显隐控制区域
		*/
		//打开订单管理录入
		$scope.addInfoBox = function(){
			validate.validate($('#add_box'),addValidOption);

			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList', 'CoreCustListDic').success(function(){
				$scope.$apply(function(){
					$scope.info = {
					orderDate:new Date().format('YYYY-MM-DD'),
					settlement:common.filterArrayFirst($scope.settleType),
					custNo:$scope.searchData.custNo,
					coreCustNo:$scope.searchData.coreCustNo,
					modiType:'add'
					};
					$scope.infoFileList = [];
					$scope.$$emiterBoxEnabled();
					$scope.openRollModal('add_box');

				});
			});
		};

		//打开订单管理编辑
		$scope.editInfoBox = function(data){
			
			validate.validate($('#edit_box'),editValidOption);

			$scope.info = $.extend(data,{modiType:'edit'});
			$scope.$$emiterBoxEnabled();
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'infoFileList').success(function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.otherBatchNo},$scope,'otherFileList').success(function(){
					$scope.openRollModal('edit_box');
				});
			});
			
		};

		//打开订单新增
		$scope.showAddBox = function(data){
			$scope.openRollModal('add_box');
			
		};

		//打开导入订单管理
		$scope.detailInfoBox = function(data){
			$scope.info = $.extend(data,{modiType:'read'});
			$scope.$$emiterBoxEnabled();
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'infoFileList').success(function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.otherBatchNo},$scope,'otherFileList').success(function(){
					$scope.openRollModal('edit_box');
				});
			});
		};

		//打开订单管理审核
		$scope.checkInfoBox = function(data){
			$scope.info = data;
			form.setCheckedList($('#check_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},data.insteadItems.split(','));
			$scope.openRollModal('check_box');
		};

		//==============================公共操作区 end ==================================


		//=========================================各类子项操作处理区域 start==========================================
		//公用属性配置
		var _recordConfig = {
			"2":{
				name:'订单运输单据',
				wrap_id:'transport_list_box',
				add_modal_id:'transport_add_box',
				info_list_name:'transportList',
				list_path:BTPATH.QUERY_LIST_TRANSPORT,
				add_path:BTPATH.ADD_ONE_TRANSPORT
			},
			"0":{
				name:'订单合同信息',
				wrap_id:'contract_list_box',
				add_modal_id:'contract_add_box',
				info_list_name:'agreementList',
				list_path:BTPATH.CONTR_LIST,
				add_path:BTPATH.ADD_ONE_INVOICE
			},
			"1":{
				name:'订单发票信息',
				wrap_id:'invoice_list_box',
				add_modal_id:'invoice_add_box',
				add_modal_more_id:'invoice_add_more_box',
				info_list_name:'invoiceList',
				list_path:BTPATH.QUERY_LIST_INVOICE,
				add_path:BTPATH.ADD_ONE_INVOICE,
				add_more_path:BTPATH.ADD_ONE_INVOICE_MORE
			},
			"3":{
				name:'订单汇票信息',
				wrap_id:'draft_list_box',
				info_list_name:'acceptBillList',
				list_path:BTPATH.QUERY_LIST_DRAFT
			},
			"4":{
				name:'订单应收账款信息',
				wrap_id:'recieve_list_box',
				info_list_name:'receivableList',
				list_path:BTPATH.QUERY_LIST_RECIEVE
			}

		};
		/*数据字典列表*/
		$scope.corpVocateType = BTDict.InvestCorpVocate.toArray('value','name');

		/*公用属性列表*/
		$scope.childUploadList = [];
		//子列表信息
		$scope.childInfoList = [];
		//子信息单个
		$scope.childInfo = {};
		//子信息附属列表
		$scope.childInfoMoreList = [];
		//子信息附属
		$scope.childInfoMore = [];
		//子列表选择池信息
		$scope.chilidInfoSelectPool = [];
		//子列表查询信息
		$scope.childInfoSearch = [];
		//子列表分页信息
		$scope.newChildInfoListPage = function(){
			return {
				pageNum: 1,
				pageSize: 10,
				pages: 1,
				total: 1
			};
		};

		$scope.childInfoListPage = $scope.newChildInfoListPage();

		$scope.$watch('childInfoMore.unit',function(newObj){
			$scope.childInfoMore.balance = Number(Number(!isNaN($scope.childInfoMore.unit)?$scope.childInfoMore.unit:0)*Number(!isNaN($scope.childInfoMore.amount)?$scope.childInfoMore.amount:0)).toFixed(2);
		});

		$scope.$watch('childInfoMore.amount',function(newObj){
			$scope.childInfoMore.balance = Number(Number(!isNaN($scope.childInfoMore.unit)?$scope.childInfoMore.unit:0)*Number(!isNaN($scope.childInfoMore.amount)?$scope.childInfoMore.amount:0)).toFixed(2);
		});


		/*公用处理函数*/

		//查询子信息列表
		$scope.searchChildInfoList = function(flag){
			var config = _recordConfig[flag];
			$scope.childInfoListPage = $scope.newChildInfoListPage();
			$scope.queryChildInfoList(flag,true);
		};

		//把子信息加入选择池
		$scope.addChildInfoPool = function(item){
			item.isInPool = true;
			$scope.chilidInfoSelectPool.push(item);
		};

		//子信息移出选择池
		$scope.removeChildInfoPool = function(item){
			$scope.chilidInfoSelectPool = ArrayPlus($scope.chilidInfoSelectPool).delChild('id',item.id);
			$scope.childInfoList = ArrayPlus($scope.childInfoList).addKey4ArrayObj('isInPool',false);
			$scope.childInfoList = ArrayPlus($scope.childInfoList).linkAnotherObjectArray($scope.chilidInfoSelectPool,'id','isInPool',true);
		};

		//获取到子信息列表
		$scope.queryChildInfoList = function(flag,pageFlag){
			//弹出弹幕加载状态
			var config = _recordConfig[flag],
				$mainTable = $('#'+config.wrap_id+' .child-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.childInfoListPage.flag = pageFlag? 1 : 2;
			return http.post(config.list_path,$.extend({},$scope.childInfoListPage,$scope.childInfoSearch))
					.success(function(data){
						//关闭加载状态弹幕
						loading.removeLoading($mainTable);
						if(common.isCurrentData(data)){
							$scope.$apply(function(){
								$scope.childInfoList = ArrayPlus(data.data).linkAnotherObjectArray($scope.chilidInfoSelectPool,'id','isInPool',true);
								if(pageFlag){
									$scope.childInfoListPage = data.page;
								}
							});
						} 	
					});
		};


		//添加子信息相关列表项
		$scope.linkChildInfoList = function(target,flag){
			var config = _recordConfig[flag],
				$target = $(target);
			var infoId = ArrayPlus($scope.chilidInfoSelectPool).extractChildArray('id',true);
			http.post(BTPATH.ADD_LINK_CHILDINFO,{
				infoIdList:infoId,
				enterId:$scope.info.id,
				infoType:flag,
				enterType:'5'
			}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.info[config.info_list_name] = $scope.info[config.info_list_name].concat($scope.chilidInfoSelectPool);
					});
					$scope.queryList(true);
					$scope.closeRollModal(config.wrap_id,'fast');
				}else{
					tipbar.errorTopTipbar($target,'添加'+config.name+'失败,服务器返回:'+data.message,3000,6664);
				}
			});
		};

		//删除子信息关联项
		$scope.removeChildInfoLink = function(target,item,flag){
			var config = _recordConfig[flag],
				$target = $(target);
			http.post(BTPATH.DEL_LINK_CHILDINFO,{
				infoId:item.id,
				enterId:$scope.info.id,
				infoType:flag,
				enterType:'5'
			}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.info[config.info_list_name] = ArrayPlus($scope.info[config.info_list_name]).delChild('id',item.id);
					});
				}else{
					tipbar.errorLeftTipbar($target,'删除'+config.name+'失败,服务器返回:'+data.message,3000,6001);
				}
			});
		};

		//新增子信息
		$scope.addChildInfo = function(target,flag){
			var $target = $(target),
				config = _recordConfig[flag];
			$scope.childInfo.fileList = ArrayPlus($scope.childUploadList).extractChildArray('id',true);
			$scope.childInfo.invoiceItemIds = ArrayPlus($scope.childInfoMoreList).extractChildArray('id',true);
			http.post(config.add_path,$scope.childInfo)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		// tipbar.errorTopTipbar($target,'新增'+config.name+'信息成功!',3000,6666);
				 		tipbar.infoTopTipbar('新增'+config.name+'成功!',{});
				 		$scope.closeRollModal(config.add_modal_id);
				 		$scope.queryChildInfoList(flag,true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增'+config.name+'失败,服务器返回:'+data.message,3000,6666);
				 	}
				 });
		};

		//新增子信息附加信息
		$scope.addChildInfoMore = function(target,flag){
			var $target = $(target),
				config = _recordConfig[flag];
			http.post(config.add_more_path,$scope.childInfoMore)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.$apply(function(){
				 			$scope.childInfoMoreList.push(data.data);
				 		});
				 		// tipbar.errorTopTipbar($target,'新增'+config.name+'信息成功!',3000,6666);
				 		tipbar.infoTopTipbar('新增'+config.name+'相关信息成功!',{});
				 		$scope.closeRollModal(config.add_modal_more_id);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增'+config.name+'相关信息失败,服务器返回:'+data.message,3000,7050);
				 	}
				 });
		};

		//本地删除子信息附加信息
		$scope.delChildInfoMore = function(item){
			$scope.childInfoMoreList = ArrayPlus($scope.childInfoMoreList).delChild('id',item.id);
		};



		/*模板显隐控制区域*/
		//打开子信息模板
		$scope.childInfoAddBox = function(flag){
			$scope.childInfoMoreList = [];
			var config = _recordConfig[flag];
			if(flag === '2'){
				$scope.childInfoSearch = {
					GTEDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
					LTEDate:new Date().format('YYYY-MM-DD'),
					dateType:'0'
				};
			}else if(flag === '1'){
				$scope.childInfoSearch = {
					GTEinvoiceDate :new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
					LTEinvoiceDate:new Date().format('YYYY-MM-DD')
				};
			}else if(flag === '3'){
				$scope.childInfoSearch = {
					GTEinvoiceDate :new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
					LTEinvoiceDate:new Date().format('YYYY-MM-DD'),
					isOnlyNormal:'1',
					coreCustNo:$scope.coreCustList.length>0?$scope.coreCustList[0].value:''
				};
			}else if(flag === '4'){
				$scope.childInfoSearch = {
					GTEorderDate :new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
					LTEorderDate:new Date().format('YYYY-MM-DD'),
					isOnlyNormal:'1',
					receivableNo:'',
					coreCustNo:$scope.coreCustList.length>0?$scope.coreCustList[0].value:''
				};
			}else if(flag === '0'){
				$scope.childInfoSearch = {
					agreeNo:'',
					status:'1',
					buyerNo:$scope.coreCustList.length>0?$scope.coreCustList[0].value:'',
					supplierNo:$scope.custList.length>0?$scope.custList[0].value:''
				};
			}
			$scope.childInfoSearch.custNo = $scope.info.custNo;
			$scope.childInfoListPage = $scope.newChildInfoListPage();
			$scope.childInfoList = [];
			$scope.chilidInfoSelectPool = [];
			$scope.queryChildInfoList(flag,true).success(function(){
				$scope.openRollModal(config.wrap_id);
			});

		};

		//打开子信息添加模板
		$scope.childInfoImBox = function(flag){
			var config = _recordConfig[flag];
			if(flag === '2'){
				$scope.childInfo = {
					sendDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
					receiveDate:new Date().format('YYYY-MM-DD')
				};
			}else if(flag === '1'){
				$scope.childInfo = {
					invoiceDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
					corpVocate:$scope.corpVocateType[0].name
				};
			}
			$scope.childInfo.custNo = $scope.info.custNo;
			$scope.childUploadList = [];
			$scope.openRollModal(config.add_modal_id);
		};

		//打开子信息关联信息添加模板
		$scope.childInfoMoreImBox = function(flag){
			var config = _recordConfig[flag];
			$scope.childInfoMore = {};
			$scope.openRollModal(config.add_modal_more_id);
		};


		//=========================================信息操作处理区域 end==========================================

		/*数据初始区域*/

		//页面初始化
		$scope.initPage = function(){
			commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList','CustListDic').success(function(){
				$scope.searchData.custNo = $scope.custList[0].value;
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
					$scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
					$scope.queryList(true);
				});
			});
		};

		$scope.initPage();

		//校验配置
		var editValidOption = {
		      elements: [{
		          name: 'info.orderNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.balance',
		          rules: [{name: 'required'},{name: 'money'}],
		          events: ['blur']
		      },{
		          name: 'info.orderDate',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      }],
		      errorPlacement: function(error, element) {
		          var label = element.parents('td').prev().text().substr(0);
		          tipbar.errorLeftTipbar(element,label+error,0,99999);
		      }
		};
		

	}]);

		//校验配置
		var addValidOption = {
		      elements: [{
		          name: 'info.orderNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		      	  name: 'info.balance',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		      	  name: 'info.custNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		      	  name: 'info.coreCustNo',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      },{
		          name: 'info.goodsName',
		          rules: [{name: 'required'}],
		          events: ['blur']
		      }],
		      errorPlacement: function(error, element) {
		          var label = element.parents('td').prev().text().substr(0);
		          tipbar.errorLeftTipbar(element,label+error,0,99999);
		      }
		};



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});


