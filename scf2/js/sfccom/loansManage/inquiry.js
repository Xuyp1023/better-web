/*
  询价 (保理公司)
作者:herb
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var comservice = require("service_s2");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var date = require("date");
    // var multiple = require("multiSelect");
    require('modal');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date']);
	
	//扩充公共指令库|过滤器|服务
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


		//询价列表
		$scope.inquiryList = [];
    //新增报价详情
    $scope.addPriceInfo = {};
    //修改报价详情
    $scope.editPriceInfo = {};
    //融资详情
    $scope.inquiryInfo = {};
    //订单列表
    $scope.orderList = [];
    //保理公司列表
    $scope.factorList = [];

    //核心企业列表
    $scope.coreList = [];
    // $scope.enquiryData = {};
    // $scope.coreCustNo='';


		//查询所需信息
		$scope.searchData = {
        factorNo:'',
        //发布时间
        GTEactualDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEactualDate:new Date().format('YYYY-MM-DD')
        //截止时间
        // GTEendDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        // LTEendDate:new Date().format('YYYY-MM-DD'),
  	};


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
        query_path:BTPATH.QUERY_BILL_LIST_CUSTNO,//获取票据无分页列表
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


    //改变当前操作企业（机构）
    $scope.changeCust = function(){
      //根据保理公司查询核心企业列表
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreList');
    };


    //刷新询价列表数据
    $scope.reFreshInquiryList = function(flag){
        //是否需要分页信息 1：需要 2：不需要
        $scope.pageConf.flag = flag ? 1 : 2;
        //弹出弹幕加载状态
        loading.addLoading($('#search_info table'),common.getRootPath());
        http.post(BTPATH.QUERY_ALL_ENQUIRY_SCF,$.extend({},$scope.pageConf,$scope.searchData)).success(function(data){
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


    //新增报价
    $scope.publishPrice = function(target){
        //设置校验项 | 校验
        validate.validate($('#addPrive_form'),addValidOption);
        var valid = validate.validate($('#addPrive_form'));
        if(!valid) return;

        http.post(BTPATH.ADD_OFFER,$.extend({},$scope.addPriceInfo)).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('新增报价成功!',{});
                  //刷新列表数据
                  $scope.inquiryInfo.offerCount=1;
                  $scope.reFreshInquiryList(false);
                  $scope.closeRollModal("publish_price_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'新增报价失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };


    //查询报价详情
    $scope.findPrice = function(inquiry){
        var param = {
          enquiryNo:inquiry.enquiryNo,
          factorNo:$scope.searchData.factorNo
        };
        http.post(BTPATH.QUERY_OFFER_DETAIL,param).success(function(data){
            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
              $scope.$apply(function(){
                  $scope.editPriceInfo = data.data;
              });
            }
        });
    };

    //订单
    $scope.findOrder = function(data){
        return http.post(BTPATH.FIND_CORECUS_TNO,{'orderId':data.orders, 'orderType':data.requestType});
    };


    //修改报价
    $scope.updatePrice = function(target){
        //设置校验项 | 校验
        validate.validate($('#editPrive_form'),editValidOption);
        var valid = validate.validate($('#editPrive_form'));
        if(!valid) return;

        http.post(BTPATH.UPDATE_OFFER ,$.extend({},$scope.editPriceInfo)).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('修改报价成功!',{});
                  //刷新列表数据
                  $scope.reFreshInquiryList(false);
                  $scope.closeRollModal("edit_price_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'修改报价失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };


    //取消报价
    $scope.cancelPrice = function(target){
        $scope.editPriceInfo.businStatus = 0 ;
        http.post(BTPATH.UPDATE_OFFER ,$.extend({},$scope.editPriceInfo)).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('取消报价成功!',{});
                  //刷新列表数据
                  $scope.reFreshInquiryList(false);
                  $scope.closeRollModal("edit_price_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'取消报价失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };


    //查询询价关联列表（订单|应收账款|票据）
    $scope.querySelectList = function(item){
      //配置
      var config = _linkedConfig[item.requestType];
      var promise = http.post(config.query_path,{"custNo":item.custNo,"isOnlyNormal":1}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope[config.list_name] = common.cloneArrayDeep(data.data);
            });
          }   
      });
      return promise;
    };


		/*---------------------------事件处理区域-------------------------------------*/
		//发布报价 panel
		$scope.publishPricePanel = function(item){
      $scope.addPriceInfo = {
        "enquiryNo":item.enquiryNo,
        "custNo":item.custNo,
        //"coreCustNo":'',/*$scope.coreList[0] ? $scope.coreList[0].value :'' */
        //操作企业 - 保理公司
        "factorNo":$scope.searchData.factorNo,
      };
      $scope.findOrder(item).success(function(data){
          if(data && data.code === 200){
            $scope.$apply(function(){
               $scope.addPriceInfo.coreCustNo = data.data;
            });
          }
      });
      $scope.openRollModal("publish_price_box");
		};


		//修改报价 panel
		$scope.editPricePanel = function(inquiry){
      //查询已存在的报价
      $scope.findPrice(inquiry);
      $scope.openRollModal("edit_price_box");
		};


    //查看资料 panel
    $scope.lookInfoPanel = function(data){
      //询价详情
      $scope.inquiryInfo = $.extend({},data);
      //设置配置
      $scope.currConfig = _linkedConfig[data.requestType];
      //查询关联列表
      $scope.querySelectList(data).success(function(){
        //过滤未选项
        var checkedStr = $scope.inquiryInfo.orders,
            list= $scope[$scope.currConfig.list_name],
            result = [];
        if(!checkedStr) return;
        for(var i=0 ;i<list.length ;i++ ){
          if(checkedStr.indexOf(list[i].id)!==-1){
              result.push(list[i]);
          }
        }
        $scope.$apply(function(){
          $scope[$scope.currConfig.list_name] = result;
        });
      });
      $scope.openRollModal("look_info_box");
    };


    // 融资依赖详情查看 
    $scope.showfactorProofDetail = function(type,data){
        detailShow.getFinanceCredentialDetail($scope,type,data.id);
    };

    
    //初始化页面
    commonService.initPage(function(){
        //当前操作员下机构（保理商列表）
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList','FactorDict').success(function(){
          $scope.searchData.factorNo = $scope.factorList[0] ? $scope.factorList[0].value:'';
          $scope.reFreshInquiryList(true);
          //核心企业列表
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreList');
        });
        
    });




		//校验配置
    var addValidOption = {
          elements: [{
              name: 'addPriceInfo.coreCustNo',
              rules: [{name: 'required'}],
              events:['blur']
          },{
              name: 'addPriceInfo.period',
              rules: [{name: 'required'},{name: 'int'}],
              events:['blur']
          },{
              name: 'addPriceInfo.balance',
              rules: [{name: 'required'},{name: 'float'}],
              events:['blur']
          },{
              name: 'addPriceInfo.minCycle',
              rules: [{name: 'required'},{name: 'int'}],
              events:['blur']
          },{
              name: 'addPriceInfo.maxCycle',
              rules: [{name: 'required'},{name: 'int'}],
              events:['blur']
          },{
              name: 'addPriceInfo.ratio',
              rules: [{name: 'required'},{name: 'float'}],
              events:['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };


    //校验配置
    var editValidOption = {
          elements: [{
              name: 'editPriceInfo.coreCustNo',
              rules: [{name: 'required'}],
              events:['blur']
          },{
              name: 'editPriceInfo.period',
              rules: [{name: 'required'},{name: 'int'}],
              events:['blur']
          },{
              name: 'editPriceInfo.balance',
              rules: [{name: 'required'},{name: 'float'}],
              events:['blur']
          },{
              name: 'editPriceInfo.minCycle',
              rules: [{name: 'required'},{name: 'int'}],
              events:['blur']
          },{
              name: 'editPriceInfo.maxCycle',
              rules: [{name: 'required'},{name: 'int'}],
              events:['blur']
          },{
              name: 'editPriceInfo.ratio',
              rules: [{name: 'required'},{name: 'float'}],
              events:['blur']
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

