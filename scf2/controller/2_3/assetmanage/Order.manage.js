
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.Order.manage',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
     $scope.uploadList = [];
     $scope.lodst = true;
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
      $scope.infoList = [];
      $scope.statusList = BTDict.billVersionBusinStatus.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');     
      $scope.info = {};
      $scope.searchData = {
        GTEorderDate :'',
        LTEorderDate:'',
        isCust:'false',
        businStatus:''
      };
  
      //订单详情
      $scope.detailsBox = function(data){

        $scope.uploadList=[];
        $scope.info=data;
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('details_box');
        
        });

      }
       $scope.quitbox = function(){

        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/Order.manage';
      }


        //查询订单列表 
      $scope.searchList = function(){
          $scope.listPage.pageNum = 1;
          
          $scope.queryList(true);
      };

        /*查询订单列表*/
      $scope.queryList = function(flag){

        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_EFFECTIVE_ORDER_CORE/*2*/,$.extend({},$scope.listPage,$scope.searchData))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.listPage = data.page;/*4*/
                }
              });
            }
        });
      };        

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

         commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'receiver').success(function(){
                $scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                $scope.searchData.custNo = $scope.searchData.custNo.length>0?$scope.searchData.custNo[0].value:'';
                $scope.queryList(true);
          });
        });
        
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
