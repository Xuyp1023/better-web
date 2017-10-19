/*
	客户开户
	作者:tanp
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
		//核心企业列表
		$scope.coreList = BTDict.ScfCoreGroup.toArray('value','name');
		//已选核心企业
		$scope.checkedCore = [];
		//是否阅读并同意
		$scope.readAndAgreee = false; 

		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};
		
		//平台开户信息
		$scope.info = {
        	bankNo : $scope.bankList[0].value,
        	bankCityno:'',
        	provinceNo:''
		};

		//初始化信息
		$scope.initInfo = {
			bankNo : $scope.bankList[0].value,
			bankCityno:'',
			provinceNo:'',
			businLicenceValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
			operValiddate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
			lawValidDate:new Date().getSubDate('YYYY',-30).format('YYYY-MM-DD'),
		};

		//机构开户附件类型
		$scope.attachTypes = BTDict.CustOpenAccountAttachment.toArray('value','name');
		//附件列表
		$scope.attachList = [];

		$scope.$watch('info.provinceNo',function(newNo){
			if (newNo==='') {
			    $scope.cityList = [];
			    $scope.info.bankCityno = '';
			} else if (newNo&& (newNo.length > 0)) {
				var province = BTDict.Provinces.getItem(newNo);
			    $scope.cityList = province ? province.citys.toArray('value', 'name'):[];
			}
		});

		//关联列表选中
	    $scope.checkedSelect = function(target,sel){
	      if($(target).is(":checked")){
	        $scope.checkedCore.push(sel);
	      }else{
	        $scope.checkedCore = ArrayPlus($scope.checkedCore).remove(sel);
	      }
	    };

		/*事件处理区域*/
		//页面初始化,查询平台开户暂存信息
		$scope.initPage = function(){
			var $mainTable = $('#mainContent');
			http.post(BTPATH.FIND_OPENACCOUNT_TEMP)
				.success(function(data){
					if(common.isCurrentData(data)){
						var bankCityno = data.data.bankCityno;
						if(bankCityno&&(bankCityno.length>1)){
							var provinceNo = bankCityno.substr(0,2)+'0000';
							data.data.provinceNo = provinceNo;
						}
						$scope.$apply(function(){
							$scope.info=$.extend({},$scope.initInfo,data.data);
						});
						//查询附件列表
						commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'attachList');
					}else{
						$scope.$apply(function(){
							//重置开户数据
							$scope.info=$.extend({},$scope.initInfo);
							$scope.attachList = [];
						});
					}
			});
		};


		//开户资料暂存
		$scope.saveOpenAccountTemp = function(target){
			var $target = $(target);
			//设置校验项 | 校验
			/*validate.validate($('#addAccount_form'),validOption);
			var valid = validate.validate($('#addAccount_form'));
			if(!valid) return;*/

			//附件
			$scope.info.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);
			//核心企业
			$scope.info.coreList = $scope.checkedCore.toString();

			http.post(BTPATH.SAVE_OPENACCOUNT_TEMP,$scope.info)
				 .success(function(data){
				 	if(data&&(data.code === 200)){
				 		tipbar.errorTopTipbar($target,'开户资料暂存成功!',3000,9992);
				 		$scope.initPage();
				 	}else{
				 		tipbar.errorTopTipbar($target,'开户资料暂存失败,服务器返回:'+data.message,3000,9992);
				 	}
				 });
		};
		

		//开户资料提交
		$scope.openAccount = function(target){
			var $target = $(target);
			//设置校验项 | 校验
			validate.validate($('#addAccount_form'),validOption);
			var valid = validate.validate($('#addAccount_form'));
			if(!valid) return;

			//至少选择一个核心企业
			if($scope.checkedCore.length===0){
				tipbar.errorTopTipbar($target,"请至少选择一个核心企业",3000,9992);
				return false;
			}
			
			//附件
			$scope.info.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);
			//核心企业
			$scope.info.coreList = $scope.checkedCore.toString();
			
			http.post(BTPATH.OPENACCOUNT,$scope.info).success(function(data){
			 	if(data&&(data.code === 200)){
			 		tipbar.errorTopTipbar($target,'开户资料提交成功!',3000,9992);
			 		$scope.readAndAgreee = false; //是否阅读并同意
			 		$scope.initPage();
			 	}else{
			 		tipbar.errorTopTipbar($target,'开户资料提交失败,服务器返回:'+data.message,3000,9992);
			 	}
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
	    $scope.delUploadItem = function(item,listName){
	    	$scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
	    };


		//弹出框高度变化，自动resize.
        $scope.$on('ngRepeatFinished',function(){
            common.resizeIframeListener();   
        });


        //校验配置
        var validOption = {
              elements: [{
                  name: 'info.custName',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.orgCode',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.businLicence',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.businLicenceValidDate',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.address',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.zipCode',
                  rules: [{name: 'required'},{name:'zipcode'}],
                  events:['blur']
              },{
                  name: 'info.phone',
                  rules: [{name: 'required'},{name:'phone'}],
                  events:['blur']
              },/*{
                  name: 'info.fax',
                  rules: [{name: 'required'},{name: 'fax'}],
                  events:['blur']
              },*/{
                  name: 'info.bankAcco',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.bankAccoName',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.bankNo',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.provinceNo',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.bankName',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.operName',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.operIdenttype',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.operIdentno',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.operValiddate',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.operMobile',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.operEmail',
                  rules: [{name: 'required'},{name:'email'}],
                  events:['blur']
              },{
                  name: 'info.operPhone',
                  rules: [{name: 'required'},{name:'phone'}],
                  events:['blur']
              },/*{
                  name: 'info.operFaxNo',
                  rules: [{name: 'required'},{name: 'fax'}],
                  events:['blur']
              },*/{
                  name: 'info.lawName',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.lawIdentType',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.lawIdentNo',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'info.lawValidDate',
                  rules: [{name: 'required'}],
                  events:['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };




		/*数据初始区域*/
		$scope.initPage();

	}]);



	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});


