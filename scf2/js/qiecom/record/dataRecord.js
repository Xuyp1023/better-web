/*
资料代录
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
		$scope.statusList = BTDict.InsteadApplyBusinStatus.toArray('value','name');
		$scope.typeList = BTDict.InsteadType.toArray('value','name');
		$scope.custList = [];
		$scope.isSelectShow = true;

		//==============================公共操作区 start=================================
		$scope.searchData = {
			LIKEcustName:'',
			businStatus:'',
			GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
			LTEregDate:new Date().format('YYYY-MM-DD')
		};
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		//资料代录列表
		$scope.infoList = [];
		//单个资料代录信息
		$scope.info = {};

		//子信息列表
		$scope.childrenInfoList = [];

		$scope.isShowMore = false;

		$scope.downListUrl = undefined;

		$scope.$watch('info.insteadType',function(newValue){
			if(newValue === $scope.typeList[0].value){
				$scope.isShowMore = false;
			}else{
				$scope.isShowMore = true;
			}
		});

		$scope.$watch('info.provinceNo',function(newNo){
			if (newNo==='') {
			    $scope.cityList = [];
			    $scope.info.bankCityno = '';
			} else if (newNo&& (newNo.length > 0)) {
			    $scope.cityList = BTDict.Provinces.getItem(newNo).citys.toArray('value', 'name');
			    $scope.info.bankCityno = $scope.cityList.length>0?$scope.cityList[0].value:'';
			}
		});

		//开户附件类型
		$scope.attachTypes = BTDict.CustOpenAccountAttachment.toArray('value','name');
		//附件列表
		$scope.attachList = [];

		//主列表操作控制
		$scope.mainListCtrl = {
			isCanDo : function(data){
				var businStatus = data.businStatus;
				return !businStatus||ArrayPlus(['1']).isContain(businStatus);
			},
			isCanRedo : function(data){
				var businStatus = data.businStatus;
				return !businStatus||ArrayPlus(['5','7']).isContain(businStatus);
			},
			isCanCheck : function(data){
				var businStatus = data.businStatus;
				return businStatus === '0';
			},
			isCanRead:function(data){
				var businStatus = data.businStatus;
				return ArrayPlus(['3','4','6','8']).isContain(businStatus);
			},
			isCannotDo:function(data){
				var businStatus = data.businStatus;
				return businStatus === '2';
			}
		};

		//子列表操作控制
		$scope.childListCtrl = {
			isCanDo : function(data){
				var businStatus = data.businStatus;
				return !businStatus||ArrayPlus(['0']).isContain(businStatus);
			},
			isCanRedo : function(data){
				var businStatus = data.businStatus,
					parentStatus = $scope.info.businStatus;
				// return ArrayPlus(['3','5']).isContain(businStatus)||(ArrayPlus(['1']).isContain(parentStatus)&&ArrayPlus(['1']).isContain(businStatus));
				return ArrayPlus(['3','5']).isContain(businStatus)||(ArrayPlus(['1']).isContain(businStatus));
			},
			isCanRead:function(data){
				var businStatus = data.businStatus,
					parentStatus = $scope.info.businStatus;
				return ArrayPlus(['2','4','6']).isContain(businStatus)||(ArrayPlus(['3']).isContain(parentStatus)&&ArrayPlus(['1']).isContain(businStatus));
			}
		};

		/*事件处理区域*/
		//查询资料代录
		$scope.searchList = function(){
			$scope.listPage.pageNum = 1;
			$scope.queryList(true);
		};

		//获取资料代录申请列表 测试/正式路径:/ScfRequest/queryRequest
		$scope.queryList = function(flag){
			//弹出弹幕加载状态
			var $mainTable = $('#search_info .main-list');
			loading.addLoading($mainTable,common.getRootPath());
			$scope.listPage.flag = flag? 1 : 2;
			http.post(BTPATH.QUERY_ALL_INSTEAD_LIST,$.extend({},$scope.listPage,$scope.searchData))
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


		//查询审核记录列表
		$scope.queryAuditRecordList = function(data){
			var promise = http.post(BTPATH.QUERY_AUDIT_RECORD_LIST,{businId:data.id}).success(function(data){
				if(common.isCurrentData(data)){
					$scope.$apply(function(){
						$scope.auditRecordList = common.cloneArrayDeep(data.data);
					});
				}
			});
			return promise;
		};


		//获取子信息列表 QUERY_CHILDREN_INSTEAD_LIST
		$scope.queryChildList = function(data){
			var promise = http.post(BTPATH.QUERY_CHILDREN_INSTEAD_LIST,{id:data.id})
				.success(function(data){
					//关闭加载状态弹幕
					if(common.isCurrentData(data)){
						$scope.$apply(function(){
							$scope.childrenInfoList = common.cloneArrayDeep(data.data);
						});
					}
			});
			return promise;
		};

		//驳回资料代录
		$scope.rejectInfo = function(target){
			var $target = $(target),
				$rejectBtn = $target.parents('.top-box').find('[mapping="rejectButton"]'),
				$rejectModal = $target.parents('.top-box').find('[mapping="reject"]');
			var promise = http.post(BTPATH.REJECT_INSTEAD_APPLY,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.queryList(true);
				 		$rejectModal.slideUp('fast',function(){
				 			$scope.closeRollModal('check_box','fast',function(){
				 				dialog.success('您已成功驳回一条代录申请数据!',3000);
				 			});
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($rejectBtn,'驳回失败,服务器返回信息'+data.message,3000,9992);
				 	}
				 });
			return promise;
		};

		//确认通过资料代录
		$scope.passInfo = function(target){
			var $target = $(target),
				$passBtn = $target.parents('.top-box').find('[mapping="passButton"]'),
				$passModal = $target.parents('.top-box').find('[mapping="pass"]');
			var promise = http.post(BTPATH.PASS_INSTEAD_APPLY,$scope.info)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		$scope.queryList(true);
				 		$passModal.slideUp('fast',function(){
				 			$scope.closeRollModal('check_box','fast',function(){
				 				dialog.success('您已成功审核通过一条代录申请数据!',3000);
				 			});
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($passBtn,'操作失败,服务器返回信息'+data.message,3000,9992);
				 	}
				 });
		};

		//编辑资料代录
		$scope.editInfo = function(target){
			var $target = $(target);
			http.post(BTPATH.EDIT_ONE_BLACKLIST,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.errorTopTipbar($target,'修改资料代录成功,若要生效请激活!',3000,9992);
				 		$scope.queryList(true);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改资料代录失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//代录主列表提交
		$scope.submitMainList = function(target){
			var $target = $(target);
			http.post(BTPATH.PASS_MAININSTEAD_LIST,{id:$scope.info.id})
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		$scope.queryList(true);
				 		$scope.closeRollModal('children_box','fast',function(){
				 			dialog.success('您已成功提交代录数据,请等待审核!',3000);
				 		});
				 	}else{
				 		tipbar.errorTopTipbar($target,'提交代录失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};

		//页面初始化
		$scope.initPage = function(){
			var basePromise = commonService.queryBaseInfoList(BTPATH.QUERY_CUST_LIST,{},$scope,'custList','CustListDic',{
				name:'custName',
				value:'custNo'
			});
			basePromise.success(function(){
				$scope.queryList(true);
			});
		};

		/*
		 *模板显隐控制区域
		*/
		//打开资料代录录入
		$scope.addInfoBox = function(){
			form.setCheckedList($('#add_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},'0,0,0,0,0,0,0'.split(','));
			$scope.info = {
				insteadType:$scope.typeList[0].value,
				custNo:$scope.custList.length>0?$scope.custList[0].custNo:''
			};
			$scope.openRollModal('add_box');
		};

		//打开资料代录编辑
		$scope.editInfoBox = function(data){
			$scope.info = data;
			$scope.openRollModal('edit_box');
		};

		//打开子列表
		$scope.childListBox = function(data){
			$scope.info = data;
			$scope.queryChildList(data).success(function(){
				$scope.openRollModal('children_box');
			});
		};

		//打开导入资料代录
		$scope.detailInfoBox = function(data){
			$scope.info = data;
			$scope.queryAuditRecordList(data);
			form.setCheckedList($('#detail_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},data.insteadItems.split(','));
			//查询附件列表
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'attachList').success(function(){
				$scope.$apply(function(){
					$scope.downListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.attachList).extractChildArray("id",true) + "&fileName=代录资料包";
				});
			})
			$scope.openRollModal('detail_box');
		};

		//打开资料代录审核
		$scope.checkInfoBox = function(data){
			$scope.info = data;
			form.setCheckedList($('#check_box [mapping="checkboxGroup"] input:checkbox'),{
				trueFlag:'1',
				falseFlag:'0'
			},data.insteadItems.split(','));
			//查询附件列表
			commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'attachList').success(function(){
				$scope.$apply(function(){
					$scope.downListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.attachList).extractChildArray("id",true) + "&fileName=代录资料包";
				});
			})
			
			$scope.openRollModal('check_box');
		};

		//打开驳回模板
		$scope.rejectInfoModal = function(target){
			var $target = $(target),
				$rejectModal = $target.parents('.top-box').find('[mapping="reject"]');
			$scope.info.rejecting = true;
			$rejectModal.slideDown('fast',function(){
				common.resizeTopBox($rejectModal);
			});
		};

		//打开审核通过模板
		$scope.passInfoModal = function(target){
			var $target = $(target),
				$rejectModal = $target.parents('.top-box').find('[mapping="pass"]');
			$scope.info.rejecting = true;
			$rejectModal.slideDown('fast',function(){
				common.resizeTopBox($rejectModal);
			});
		};

		/*模板相关绑定*/
		$scope.$on('includeModalHide',function(){
			$scope.$apply(function(){
				$scope.info.rejecting = false;
			});
		});
		//==============================公共操作区 end ==================================


		//=========================================代录操作处理区域 start==========================================
		//公用属性配置
		var _recordConfig = {
			"4":{
				name:'营业执照信息',
				add_path:BTPATH.ADD_INSTAED_LICENSE,
				edit_path:BTPATH.EDIT_INSTAED_LICENSE,
				detail_path:BTPATH.QUERY_DETAIL_INSTEAD_LICENSE,
				info_name : 'childInfo',
				modal_id:'business_record_box'
			},
			"1":{
				name:'企业法人信息',
				add_path:BTPATH.ADD_INSTAED_LAWYER,
				edit_path:BTPATH.EDIT_INSTAED_LAWYER,
				detail_path:BTPATH.QUERY_DETAIL_INSTEAD_LAWYER,
				info_name : 'childInfo',
				modal_id:'lawyer_record_box'
			},
			"0":{
				name:'公司基本信息',
				add_path:BTPATH.ADD_INSTEAD_RECORD_BASIC,
				edit_path:BTPATH.SAVE_INSTEAD_RECORD_BASIC,
				detail_path:BTPATH.FIND_INSTEAD_RECORD_BASIC,
				info_name : 'childInfo',
				modal_id:'base_record_box'
			},
			"7":{
				name:'平台开户信息',
				// add_path:BTPATH.ADD_INSTAED_ACCOUNT,
				add_path:BTPATH.EDIT_INSTAED_ACCOUNT,
				edit_path:BTPATH.EDIT_INSTAED_ACCOUNT,
				detail_path:BTPATH.QUERY_DETAIL_INSTEAD_ACCOUNT,
				info_name : 'childInfo',
				modal_id:'account_record_box'
			}
		};
		/*数据字典列表*/
		$scope.corpType = BTDict.CorpType.toArray('value','name');
		$scope.identType = BTDict.IdentType.toArray('value','name');
		$scope.sexType = BTDict.CustSexType.toArray('value','name');
		$scope.eduLevel = BTDict.EduLevel.toArray('value','name');
		$scope.martialStatus = BTDict.MartialStatus.toArray('value','name');
		$scope.premisesType = BTDict.PremisesType.toArray('value','name');
		//银行
		$scope.bankList = BTDict.SaleBankCode.toArray('value','name');
		//经办人证件类型
		$scope.operIdenttypeList = BTDict.PersonIdentType.toArray('value','name');
		//法人证件类型
		$scope.lawIdentTypeList = BTDict.PersonIdentType.toArray('value','name');
		//省列表
		$scope.provinceList = BTDict.Provinces.toArray('value','name');
		//市列表
		$scope.cityList = [];
		//获取核心企业的列表
		$scope.childCoreList = BTDict.ScfCoreGroup.toArray('value','name');

		/*公用属性列表*/
		$scope.childUploadList = [];
		//子列表信息
		$scope.childInfo = {};

		$scope.$watch('childInfo.provinceNo',function(newNo){
			if (newNo==='') {
			    $scope.cityList = [];
			    $scope.childInfo.bankCityno = '';
			} else if (newNo&& (newNo.length > 0)) {
			    $scope.cityList = BTDict.Provinces.getItem(newNo).citys.toArray('value', 'name');
			    $scope.childInfo.bankCityno = $scope.cityList.length>0?$scope.cityList[0].value:'';
			}
		});


		/*公用处理函数*/
		//新增代录
		$scope.addRecord = function(target,flag){
			var $target = $(target),
				config = _recordConfig[flag];
			$scope.childInfo.fileList = ArrayPlus($scope.childUploadList).extractChildArray('id');
			// if($scope.childInfo.fileList.length<12){
			// 	tipbar.errorTopTipbar($target,'',3000,9996);
			// 	return;
			// }
			$scope.childInfo.fileList = $scope.childInfo.fileList.join(',');
			// var childCoreList = ArrayPlus($scope.childCoreList).objectChildFilterByBoolean('isChecked',true);
			// $scope.childInfo.coreList = ArrayPlus(childCoreList).extractChildArray('value',true);

			// //至少选择一个核心企业
			// if(!$scope.childInfo.coreList){
			// 	tipbar.errorTopTipbar($target,"请至少选择一个核心企业",3000,9996);
			// 	return false;
			// }

			//设置校验项 | 校验
			validate.validate($('#account_record_box'),validOption);
			var valid = validate.validate($('#account_record_box'));
			if(!valid) return;

			http.post(config.add_path,$scope.childInfo)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		// tipbar.errorTopTipbar($target,'新增'+config.name+'代录成功,请等待复核生效!',3000,9996);
				 		tipbar.infoTopTipbar('新增'+config.name+'代录成功,请等待复核生效!',{});
				 		$scope.closeRollModal(config.modal_id);
				 		$scope.queryChildList($scope.info);
				 	}else{
				 		tipbar.errorTopTipbar($target,'新增'+config.name+'失败,服务器返回:'+data.message,3000,9996);
				 	}
				 });
		};

		//查询代录详情
		$scope.detailRecord = function(flag,data){
			var config = _recordConfig[flag];
			var promise = http.post(config.detail_path,data);
			return promise;
		};





		//修改代录信息
		$scope.editRecord = function(target,flag){
			var $target = $(target),
				config = _recordConfig[flag];
			$scope.childInfo.fileList = ArrayPlus($scope.childUploadList).extractChildArray('id',true);
			var childCoreList = ArrayPlus($scope.childCoreList).objectChildFilterByBoolean('isChecked',true);
			$scope.childInfo.coreList = ArrayPlus(childCoreList).extractChildArray('value',true);

			//设置校验项 | 校验
			validate.validate($('#account_record_box'),validOption);
			var valid = validate.validate($('#account_record_box'));
			if(!valid) return;

			http.post(config.edit_path,$scope.childInfo)
				 .success(function(data){
				 	if(common.isCurrentResponse(data)){
				 		// tipbar.errorTopTipbar($target,'修改'+config.name+'代录成功,请等待复核生效!',3000,9996);
				 		tipbar.infoTopTipbar('修改'+config.name+'代录成功,请等待复核生效!',{});
				 		$scope.closeRollModal(config.modal_id);
				 		$scope.queryChildList($scope.info);
				 	}else{
				 		tipbar.errorTopTipbar($target,'修改'+config.name+'失败,服务器返回:'+data.message,3000,9996);
				 	}
				 });
		};

		//获取账户类附件列表
		$scope.getAccountChild = function(){
			//init ChildUploadList for Account
			var tmpUploadList = BTDict.CustOpenAccountFile.toArray('fileInfoType','name');
			http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.childInfo.batchNo}).success(function(data){
				if(common.isCurrentData(data)){
					var tempServerUploadList = data.data;
					$scope.$apply(function(){
						$scope.childUploadList = ArrayPlus(tmpUploadList).extendObjectArray(tempServerUploadList,'fileInfoType');
					});
				}else{
					$scope.$apply(function(){
						$scope.childUploadList = common.cloneArrayDeep(tmpUploadList);
					});
				}
			});
		};

		$scope.queryAccountStorge = function(item){
			return http.post(BTPATH.QUERY_DETAIL_INSTEAD_ACCOUNT,{id:item.id}).success(function(data){
				$scope.$apply(function(){
					if(common.isCurrentData(data)){
						
						$scope.childInfo = $.extend({},$scope.childInfo,data.data);
					}
					$scope.getAccountChild();
				});
			})
		};


		/*
		*上传代码区块
		*/
		//上传回调 替换元素
		function callback(list,type){
			return function(){
				//如果未上传或上传失败，返回
				if(ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type).length<=1) return;
				//删除新添加的，并将其值赋给原有的
				var addItem = $scope[list].pop();
				$scope[list] = ArrayPlus($scope[list]).replaceChild('fileInfoType',type,addItem);
			};
		}

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

	    //开启上传
	    $scope.openUploadCopy = function(event,type,list){
	    	var typeName = BTDict["CustOpenAccountFile"] ? BTDict["CustOpenAccountFile"].get(type):'----';
	    	$scope.uploadConf = $.extend({},{
	    		//上传触发元素
	    		event:event.target||event.srcElement,
	    		//上传附件类型
	    		type:type,
	    		//类型名称
	    		typeName:typeName,
	    		//存放上传文件
	    		uploadList:$scope[list],
	    		//图标路径
	    		imgPath:'../../../img/operator.png',
	    		//回调
	    		callback:callback(list,type)
	    	});
	    };

	    //开启上传(下拉选择附件)
	    $scope.openUploadDropdown = function(event,typeList,list){
		     $scope.uploadConf = {
		        //上传触发元素
		        event:event.target||event.srcElement,
		        //存放上传文件
		        uploadList:$scope[list],
		        //附件类型列表
		        typeList:$scope[typeList],
		     };
	    };

	    //删除附件项
	    $scope.delUploadItemCopy = function(item,listName){
	    	for (var i = 0; i < $scope[listName].length; i++) {
	    		var tempUpload = $scope[listName][i];
	    		if(tempUpload.fileInfoType === item.fileInfoType){
	    			$scope[listName][i] = {
	    				fileInfoType:item.fileInfoType,
	    				name:item.name
	    			};
	    		}
	    	}
	    };


		/*模板显隐控制区域*/
		//打开子代录模板
		$scope.childInfoDoBox = function(item){
			var flag = item.insteadItem,
				config = _recordConfig[flag];
			$scope.childUploadList = [];
			if(flag === '4'){//营业执照信息
				$scope.childInfo = {
					corpType:$scope.corpType[0].value,
					setupDate:new Date().format('YYYY-MM-DD'),
					certifiedDate :new Date().format('YYYY-MM-DD'),
					startDate:new Date().format('YYYY-MM-DD'),
					endDate:new Date().format('YYYY-MM-DD')
				};

			}else if(flag === '1'){//法人信息
				$scope.childInfo = {
					identType:$scope.identType[0].value,
					sex:$scope.sexType[0].value,
					eduLevel :$scope.eduLevel[0].value,
					martialStatus:$scope.martialStatus[0].value,
					birthdate:new Date().getSubDate('YYYY',30).format('YYYY-MM-DD')
				};
			}else if(flag === '0'){//基本信息
				$scope.childInfo = {
					corpType:$scope.corpType[0].value,
					premisesType:$scope.premisesType[0].value
				};
			}else if(flag === '7'){
				$scope.childInfo = {
					businLicenceValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
					operValiddate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
					lawValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
					provinceNo:$scope.provinceList[0].value,
					bankCityno:'',
					bankNo:$scope.bankList[0].value,
					operIdenttype:$scope.operIdenttypeList[0].value,
					lawIdentType:$scope.operIdenttypeList[0].value
				};
				//初始化关联核心企业列表
				$scope.childCoreList = ArrayPlus($scope.childCoreList).addKey4ArrayObj('isChecked',false);
			}
			$scope.childInfo = $.extend($scope.childInfo,{
				insteadItem:item.insteadItem,
				custName:$scope.info.custName,
				custNo:$scope.info.custNo,
				refId:$scope.info.custNo,
				insteadRecordId:item.id,
				modiType:'add'
			});
			if(flag === '7'){
				$scope.queryAccountStorge(item);
			}
			$scope.openRollModal(config.modal_id);
		};

		$scope.linkChildCoreList = function(coreList){
			if((coreList === undefined)&&(coreList==='')) return;
			$scope.childCoreList = ArrayPlus($scope.childCoreList).addKey4ArrayObj('isChecked',false);
			var coreList = coreList.split(',');
			$scope.childCoreList = ArrayPlus($scope.childCoreList).linkAnotherArray(coreList,'value','isChecked',true);
		};

		//打开子信息代录编辑模板
		$scope.childInfoRedoBox = function(item){
			var flag = item.insteadItem,
				config = _recordConfig[flag];
			item.insteadId = item.id;
			$scope.detailRecord(flag,item).success(function(data){
				if(common.isCurrentData(data)){
					if(item.insteadItem === '7'){
						data.data.provinceNo = (typeof data.data.bankCityno === 'string')&&(data.data.bankCityno.length>0)?data.data.bankCityno.substr(0,2)+'0000':'';
						//关联核心企业
						$scope.$apply(function(){
							$scope.linkChildCoreList(data.data.coreList);
						});
					}
					$scope.$apply(function(){
						$scope.childInfo = $.extend(data.data,{
							insteadItem:item.insteadItem,
							insteadRecordId:item.id,
							modiType:'edit'
						});
					});
					if(flag !== '7'){
						commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.data.batchNo},$scope,'childUploadList').success(function(){});
					}else{
						$scope.getAccountChild();
					}

					//关联核心企业列表

				}
				$scope.openRollModal(config.modal_id);
			});
		};
		//打开子信息详情查看模板
		$scope.childInfoReadBox = function(item){
			var flag = item.insteadItem,
				config = _recordConfig[flag];
			item.insteadId = item.id;
			$scope.detailRecord(flag,item).success(function(data){
				if(common.isCurrentData(data)){
					if(item.insteadItem === '7'){
						data.data.provinceNo = (typeof data.data.bankCityno === 'string')&&(data.data.bankCityno.length>0)?data.data.bankCityno.substr(0,2)+'0000':'';
						//关联核心企业
						$scope.$apply(function(){
							$scope.linkChildCoreList(data.data.coreList);
						});
					}
					$scope.$apply(function(){
						$scope.childInfo = $.extend(data.data,{
							modiType:'read'
						});
					});
					commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.data.batchNo},$scope,'childUploadList');
				}
				$scope.openRollModal(config.modal_id);
			});
		};


		//=========================================代录操作处理区域 end==========================================

		/*数据初始区域*/
		$scope.initPage();


	}]);


	//校验配置
	var validOption = {
	      elements: [{
	          name: 'childInfo.custName',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.orgCode',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.businLicence',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.businLicenceValidDate',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.address',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.zipCode',
	          rules: [{name: 'required'},{name:'zipcode'}],
	          events:['blur']
	      },{
	          name: 'childInfo.phone',
	          rules: [{name: 'required'},{name:'phone'}],
	          events:['blur']
	      },/*{
	          name: 'childInfo.fax',
	          rules: [{name: 'required'},{name: 'fax'}],
	          events:['blur']
	      },*/{
	          name: 'childInfo.bankAcco',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.bankAccoName',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.bankNo',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.provinceNo',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.bankName',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operName',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operIdenttype',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operIdentno',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operValiddate',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operMobile',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operEmail',
	          rules: [{name: 'required'},{name:'email'}],
	          events:['blur']
	      },{
	          name: 'childInfo.operPhone',
	          rules: [{name: 'required'},{name:'phone'}],
	          events:['blur']
	      },/*{
	          name: 'childInfo.operFaxNo',
	          rules: [{name: 'required'},{name: 'fax'}],
	          events:['blur']
	      },*/{
	          name: 'childInfo.lawName',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.lawIdentType',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.lawIdentNo',
	          rules: [{name: 'required'}],
	          events:['blur']
	      },{
	          name: 'childInfo.lawValidDate',
	          rules: [{name: 'required'}],
	          events:['blur']
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
