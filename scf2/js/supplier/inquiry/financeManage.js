/*
融资管理 (对接外部)
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

    //从询价详情页面跳转而来
    $scope.skip = location.hash ? true : false;   //标志是否跳转而来
    if($scope.skip){
        $scope.skipId = location.hash.substr(1);  //url #参数 询价Id  
    }
    


    //初始分页数据
    function initPageConf(){
      return {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };
    }

    /*字典数据*/
    //票据流通方式
    $scope.billFlowModes = BTDict.BillFlowMode.toArray('value','name');
    $scope.periodUnit = BTDict.PeriodUnit.toArray('value','name');
    
		/*VM绑定区域*/
		//分页数据
		$scope.pageConf = initPageConf();

    //供应商列表(下拉)
    $scope.supplierList = [];
    //核心企业列表(下拉)
    $scope.coreCustList = [];
    //金融公司列表(下拉)
    $scope.factorList = [];

    //票据列表
    $scope.draftList = [];
    //票据详情
    $scope.draftInfo = {};
    
    
    //查询条件  
    $scope.searchData = {
      custNo:'',
      coreCustNo:'',
      factorNo:'',
      //发布时间
      GTEactualDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
      LTEactualDate:new Date().format('YYYY-MM-DD')
    };


    // ------------------------------------------------ 业务操作 start -------------------------------------------------------

    //点击 “查询”  -刷新列表
    $scope.searchList = function(){
        $scope.pageConf.pageNum = 1;
        $scope.queryList(true);
    };

		//融资申请列表
		$scope.applyList = [];
    //融资申请详情
    $scope.applyInfo = {};
    //已选中的票据
    $scope.checkedArr = [];
    //核心企业下拉列表
    $scope.coreList = [];
    //金融机构下拉列表
    $scope.factorList=[];
    //产品下拉列表
    $scope.productList=[];

    //刷新融资申请列表
    $scope.queryList = function(flag){
        //是否需要分页信息 1：需要 2：不需要
        $scope.pageConf.flag = flag ? 1 : 2;
        //弹出弹幕加载状态
        loading.addLoading($('#search_info table'),common.getRootPath());
        http.post(BTPATH.QUERY_BILL_REQUEST_LIST,$.extend({},$scope.pageConf,$scope.searchData)).success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($('#search_info table'));
            if(common.isCurrentData(data)){
                $scope.$apply(function(){
                    $scope.applyList = common.cloneArrayDeep(data.data);
                    if(flag){
                      $scope.pageConf = data.page;
                    }
                });
            }   
        });
    };


    //融资申请
    $scope.addRequest = function(target){

        //设置校验项|校验
        validate.validate($('#add_box'),validOption);
        var valid = validate.validate($('#add_box'));
        if(!valid) return;

        var orderIds = $scope.checkedArr.join(",");
        if(!orderIds){
            tipbar.errorTopTipbar($(target),"请选择票据信息！",3000,9999);
            return false;
        }

        $scope.applyInfo.orders=orderIds;//获取相关的票据
        $scope.applyInfo.periodUnit = 1; //默认为天

        http.post(BTPATH.ADD_BILL_REQUEST,$scope.applyInfo).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('新增申请成功!',{});
                  //刷新列表数据
                  $scope.queryList(true);
                  $scope.closeRollModal("add_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'新增申请失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };

    //查询保理产品详情
    $scope.findProduct = function(productId){
        http.post(BTPATH.FIND_PRODUCT_DETAIL_BYID,{id:productId}).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                 $scope.productDetail = data.data;
              });
            }
        });
    };

     //查询核心企业
    $scope.findCoreDict = function(custNo){
       return http.post(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:custNo}).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                 $scope.coreList = data.data;
                 /*$scope.applyInfo.coreCustNo = $scope.coreList[0].value;*/
              });
            }
        });
    };

    //查询金融机构
    $scope.findFactorDict = function(custNo){
        return http.post(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:custNo}).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  $scope.factorList = data.data;
                  /*$scope.applyInfo.factorNo = $scope.factorList[0].value;*/
              });
            }
        });
    };

    //查询票据列表
    $scope.queryDraftList = function(custNo){
        http.post(BTPATH.QUERY_BILL_LIST_NORMAL,{custNo:custNo, anIsOnlyNormal:1}).success(function(data){
            if(common.isCurrentData(data)){
                $scope.$apply(function(){
                    $scope.draftList = common.cloneArrayDeep(data.data);
                });
            }   
        });
    };

     //查询产品列表
    $scope.queryProductList = function(coreCustNo, factorNo){
        return http.post(BTPATH.QUERY_DIC_PRODUCTLIST,{coreCustNo:coreCustNo, factorNo:factorNo}).success(function(data){
            if(common.isCurrentData(data)){
                $scope.$apply(function(){
                    $scope.productList = common.cloneArrayDeep(data.data);
                });
            }   
        });
    };

    


    //关联列表 选中|反选
    $scope.checkedSelect = function(target,sel){
      if($(target).is(":checked")){
        $scope.checkedArr.push(sel);
      }else{
        $scope.checkedArr = ArrayPlus($scope.checkedArr).remove(sel);
      }
      
    };




		/* ============================弹出面板 start ==============================*/

		//add
		$scope.showAddBox = function(){
        $scope.applyInfo.custNo=$scope.searchData.custNo;
        //查询核心企业
        $scope.findCoreDict($scope.searchData.custNo).success(function(){
           $scope.applyInfo.coreCustNo = common.filterArrayFirst($scope.coreList);
           //查询保理公司
           $scope.findFactorDict($scope.searchData.custNo).success(function(){
              $scope.applyInfo.factorNo = common.filterArrayFirst($scope.factorList);
              //查询保理产品列表
              $scope.queryProductList($scope.applyInfo.coreCustNo, $scope.applyInfo.factorNo).success(function(){
                $scope.applyInfo.productId = common.filterArrayFirst($scope.productList);
              });
           });
        });
        $scope.queryDraftList($scope.searchData.custNo);
        $scope.openRollModal("add_box");
		};

    //edit 
    /*$scope.showUpdateBox = function(){
        $scope.openRollModal("edit_box");
    };

		//detail
		$scope.showDetailBox = function(data){
       $scope.openRollModal("detail_box");
		};*/

    //产品详情 模板
    $scope.openProductDetail = function(productId){
      if(!productId) return;
      //查询产品详情
      $scope.findProduct(productId);
      $scope.openRollModal("product_detail_box");
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
          //从询价页面跳转来
          if($scope.skip){
            $scope.showAddBox();
            return false;
          }
          //查询融资列表
          $scope.queryList(true);
      });
      
    });
    

    //校验配置
    var validOption = {
          elements: [{
              name: 'applyInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name: 'applyInfo.ratio',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name: 'applyInfo.period',
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

