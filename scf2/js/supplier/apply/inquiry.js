/*
询价 
@anthor : herb
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
    var date = require("date");
    var multiple =require("multiSelect");
    require('modal');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date','multiple']);

	
	//扩充公共指令库 | 过滤器 | 公共服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
  comservice.servPlus(mainApp);
    
	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){
		/*VM绑定区域*/

		//分页数据
		$scope.pageConf = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

    //报价列表分页数据
    $scope.offerPageConf = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };

    //供应商列表
    $scope.supplierList = [];

    //保理公司列表
    $scope.factorList = [];

    /*关联列表*/
    $scope.orderList=[];    //订单列表
    $scope.billList = [];   //汇票列表
    $scope.recieveList = [];  //应收账款列表

    //已选关联文档
    $scope.checkOrderList = [];


    //查询所需信息
    $scope.searchData = {
      custNo:'',
      //发布时间
      GTEactualDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEactualDate:new Date().format('YYYY-MM-DD')
      //截止时间
      // GTEendDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      // LTEendDate:new Date().format('YYYY-MM-DD'),
    };

		//询价列表
		$scope.inquiryList = [];
    //询价详情
    $scope.inquiryDetail = {};

    //报价列表
    $scope.offerList = [];

    //融资类型
    $scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name').slice(0,3);


    /* 融资相关文件列表 配置 */
    var _linkedConfig = {
      1:{
        type:'order',
        title:'客户订单列表',
        query_path:BTPATH.QUERY_ORDER_LIST_NORMAL,//获取订单无分页列表
        list_name:'orderList'      //列表VM名称
      },
      2:{
        type:'bill',
        title:'汇票列表',
        query_path:BTPATH.QUERY_BILL_LIST_NORMAL,//获取票据无分页列表
        list_name:'billList'     //列表VM名称
      },
      3:{
        type:'recieve',
        title:'应收账款列表',
        query_path:BTPATH.QUERY_RECIEVE_LIST_NORMAL,//获取应收账款无分页列表
        list_name:'recieveList'      //列表VM名称
      }
    };

    //当前配置
    $scope.currConfig = {};


    //刷新融资依据列表
    $scope.refreshEvidence = function(){
      //融资类型
      var type = $scope.inquiryDetail.requestType;
      //当前配置
      $scope.currConfig = _linkedConfig[type];
      //清空已选
      $scope.checkOrderList = [];
      //刷新关联列表
      $scope.querySelectList(type);
    };


    //查询关联列表（订单|应收账款|票据）
    $scope.querySelectList = function(reqType){
      //配置
      var config = _linkedConfig[reqType];
      var promise = http.post(config.query_path,{"custNo":$scope.inquiryDetail.custNo,"isOnlyNormal":1}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope[config.list_name] = common.cloneArrayDeep(data.data);
            });
          }   
      });
      return promise;
    };


    //关联列表选中
    $scope.checkedSelect = function(target,sel){
      if($(target).is(":checked")){
        $scope.checkOrderList.push(sel);
      }else{
        $scope.checkOrderList = ArrayPlus($scope.checkOrderList).remove(sel);
      }
    };


    //刷新报价列表 
    $scope.reFreshOfferList = function(flag,data){
        // condition :询价编号/询价企业
        var condition = data ? {
              "enquiryNo":data.enquiryNo,
              "custNo":data.custNo
            } : {};
        //是否需要分页信息 1：需要 2：不需要
        $scope.offerPageConf.flag = flag ? 1 : 2;
        var param = $.extend(condition,$scope.offerPageConf);
        http.post(BTPATH.QUERY_ALL_OFFER ,param).success(function(data){
            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
              $scope.$apply(function(){
                  $scope.offerList = common.cloneArrayDeep(data.data);
                  if(flag){
                    $scope.offerPageConf = data.page;
                  }
              });
            }   
        });
    };


		//刷新询价列表数据
		$scope.reFreshInquiryList = function(flag){
        //是否需要分页信息 1：需要 2：不需要
        $scope.pageConf.flag = flag ? 1 : 2;
        //弹出弹幕加载状态
        loading.addLoading($('#search_info table'),common.getRootPath());
        http.post(BTPATH.QUERY_ALL_ENQUIRY_APPLY,$.extend({},$scope.pageConf,$scope.searchData)).success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($('#search_info table'));
            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
              $scope.$apply(function(){
                  $scope.inquiryList = common.cloneArrayDeep(data.data);
                  if(flag){
                    $scope.pageConf = data.page;
                  }
              });
            }   
        });
		};


    //新增询价
    $scope.addInquiry = function(target){
        //设置校验项 | 校验
        validate.validate($('#addInquiry_form'),validOption);
        var valid = validate.validate($('#addInquiry_form'));
        if(!valid) return;
        //意向企业
        if(!$scope.inquiryDetail.factors){
          tipbar.errorLeftTipbar($(target),'请至少选择一个意向企业',3000,999999);
          return false;
        }
        //融资依据
        var orders = $scope.checkOrderList.toString();
        if(!orders || orders.length===0){
          tipbar.errorLeftTipbar($(target),'请选择（订单|票据|应收款项）作为融资依据！',3000,999999);
          return false;
        }

        //已选关联
        $scope.inquiryDetail.orders = orders;
        http.post(BTPATH.ADD_ENQUIRY,$scope.inquiryDetail).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('新增询价成功!',{});
                  //刷新列表数据
                  $scope.reFreshInquiryList(true);
                  $scope.closeRollModal("fix_operator_info_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'新增询价失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };


    //修改询价
    $scope.editInquiry = function(target){
        //设置校验项|校验
        validate.validate($('#editInquiry_form'),validOption);
        var valid = validate.validate($('#editInquiry_form'));
        if(!valid) return;
        //意向企业
        if(!$scope.inquiryDetail.factors){
          tipbar.errorLeftTipbar($(target),'请至少选择一个意向企业',3000,999999);
          return false;
        }
        //融资依据
        var orders = $scope.checkOrderList.toString();
        if(!orders || orders.length===0){
          tipbar.errorLeftTipbar($(target),'请选择（订单|票据|应收款项）作为融资依据！',3000,999999);
          return false;
        }

        //已选关联
        $scope.inquiryDetail.orders = orders;
        http.post(BTPATH.UPDATE_ENQUIRY,$scope.inquiryDetail).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('修改询价成功!',{});
                  //刷新列表数据
                  $scope.reFreshInquiryList(true);
                  $scope.closeRollModal("fix_edit_info_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'修改询价失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };





    //根据供应商查询对应的保理商
    $scope.supplySwitch = function(){
        //保理商列表
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList');
    };


		/* ============================弹出面板 start ==============================*/

		//发布询价
		$scope.showAddPanel = function(){
      //融资类型
      var reqType = $scope.requestTypes[0].value;
      //当前配置
      $scope.currConfig = _linkedConfig[reqType];
      //设置默认值
      $scope.inquiryDetail = {
        "custNo":$scope.supplierList[0].value,
        "requestType":reqType
      };
      //查询关联列表
      $scope.querySelectList(reqType);
      $scope.openRollModal("fix_operator_info_box",null,function(){
          multiple.resizeWidth();
      });
		};


		//修改询价
		$scope.showEditBox = function(data){
      $scope.inquiryDetail = $.extend({}, data);
      //融资类型
      var reqType = $scope.inquiryDetail.requestType,
          checkedStr = $scope.inquiryDetail.orders,
          config = _linkedConfig[reqType];
      //设置已选
      $scope.checkOrderList = checkedStr?checkedStr:[];
      //当前配置
      $scope.currConfig = _linkedConfig[reqType];
      //查询关联列表
      $scope.querySelectList(reqType).success(function(){
        if(!checkedStr) return;
        //勾选已选项
        var list= $scope[config.list_name];
        for(var i=0 ;i<list.length ;i++ ){
          if(checkedStr.indexOf(list[i].id)!==-1){
              list[i].checked = true;
          }
        }
      });
      $scope.openRollModal("fix_edit_info_box",null,function(){
          multiple.resizeWidth();
      });
		};
    

		//查看报价
		$scope.showQuoteBox = function(data){
      //刷新报价列表
      $scope.reFreshOfferList(true,data);
      $scope.openRollModal("fix_quote_info_box");
		};


    // 融资依赖详情查看 
    $scope.showfactorProofDetail = function(type,data){
        detailShow.getFinanceCredentialDetail($scope,type,data.id);
    };

    /* ============================弹出面板 end ==============================*/




    //初始化页面
    commonService.initPage(function(){
      //当前操作员下机构（供应商列表）
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'supplierList').success(function(){
          $scope.searchData.custNo = $scope.supplierList[0].value;
          //保理商列表
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.searchData.custNo},$scope,'factorList');
          $scope.reFreshInquiryList(true);
      });
      
    });
    

    //校验配置
    var validOption = {
          elements: [{
              name: 'inquiryDetail.custNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name: 'inquiryDetail.endDate',
              rules: [{name: 'required'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };


	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

