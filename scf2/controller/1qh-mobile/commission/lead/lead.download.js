
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('lead.download',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.statusList = BTDict.deliveryRecordCoreCustStatus.toArray('value','name');
      $scope.infoList = [{},{}]; 
      /*$scope.infoList = [
        {checkOne:false,monthlyStatementRefNo:'1111111'},
        {checkOne:false,monthlyStatementRefNo:'1111111'},
        {checkOne:false,monthlyStatementRefNo:'1111111'},
        {checkOne:false,monthlyStatementRefNo:'1111111'}

      ];*/
      $scope.tmpVo = {};
      $scope.detailInfo = {};
      $scope.detailInfoList = [];           
      $scope.searchData = {
        GTEbillMonth:new Date().getSubDate('MM',3).format('YYYY-MM'),
        LTEbillMonth:new Date().format('YYYY-MM'),
        expressStatus:''
      };
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };      

      // 查看详情
      
        //查询月账单详情
      $scope.lookDetail = function(target,monthid){
         
         $scope.openRollModal('detail_monthly_box');
         http.post(BTPATH.FIND_MONTHLY_STATEMENT_ID,{"monthlyId":monthid})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);/*3*/
              });
        });
      }
      // 单选
      $scope.selectOne=function(){
        var count=$("td>input[type='checkbox']:checked").length;
        if(count==$scope.infoList.length){
          $scope.tmpVo.tmpCheckbox=true;
        }else{
          $scope.tmpVo.tmpCheckbox=false;
        }
      }
      //选择按钮，全选和去除全选
      $scope.toggleCheckbox = function(){
        angular.forEach($scope.infoList,function(row){          
          row.checkOne = $scope.tmpVo.tmpCheckbox;          
        });
      };
      // 下载选中的账单
      $scope.downloadSel=function(target){  
          var $target = $(target);        
          var addIds=[];
          angular.forEach($scope.infoList,function(row){            
            if(row.checkOne){
                addIds.push(row.fileId);
            }
          }); 


           if(addIds.length<=0){
              tipbar.errorTopTipbar($target,'请选择下载的对账单',3000,9992);
              return ;
             }       
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=对账单资料包";
          window.location.href=$scope.downListUrl;
       }

     
      $scope.lookDayDetail = function(target,item){
         $scope.dailyStatementId=item.dailyStatementId;
         http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail,{"dailyStatementId":item.dailyStatementId})
          .success(function(data){

              $scope.$apply(function(){

                $scope.dayDetailInfo = data.data;

              });
              $scope.openRollModal('dayDetail_box');
              $scope.queryDetailList(true);
        });
      }
      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };
      /*  业务处理绑定区域   */
      $scope.queryDetailList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.detailListPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail_List,$.extend({},{"dailyStatementId":$scope.dailyStatementId},$scope.detailListPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.dayDetailInfoList = common.cloneArrayDeep(data.data);
                if(flag){
                  $scope.detailListPage = data.page;
                }
              });
            }
        });
      };


      //查询产品列表 
      $scope.searchList = function(){
          $scope.listPage.pageNum = 1;
          $scope.queryList(true);
      };
      
      /*查询产品列表*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_DELIVERY_RECORD_STATEMENT_LIST_INFO/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
          $scope.searchData.ownCustNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
        });
        $scope.queryList(true);
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});

