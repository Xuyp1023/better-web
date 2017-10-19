
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.manage.bill',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
       $scope.uploadList = [];
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

    //删除附件项
    $scope.delUploadItem = function(item,listName){
      $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
    };
      var dddd = new Date();
      dddd.setDate(1);
      $scope.statusList = BTDict.billVersionBusinStatus.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      $scope.loanInfo = {};
      $scope.searchData = {
          GTEendDate:dddd.format('YYYY-MM-DD'),
          LTEendDate:dddd.getSubDate('MM',-3).format('YYYY-MM-DD'),
          isCust :'false',
          businStatus:''
      };
  
      //打开详情
      $scope.detailsBox = function(data){
        
          $scope.loanInfo = data;
         
        $scope.openRollModal('detail_box');
      }
      

      //点击查询
       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };

            //刷新列表
            $scope.queryList = function(flag){
            //弹出弹幕加载状态
            var $mainTable = $('#search_info .main-list');
            loading.addLoading($mainTable,common.getRootPath());
            $scope.listPage.flag = flag? 1 : 2;
            $scope.searchData.isAudit = true;
            http.post(BTPATH.QUERY_EFFECTIVE_RECEIVABLE_CORE,$.extend({},$scope.listPage,$scope.searchData))
              .success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($mainTable);
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                    $scope.infoList = common.cloneArrayDeep(data.data);
                    if(flag){
                      $scope.listPage = data.page;
                    }
                  });
                }   
            });
          };

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

       commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList').success(function(){
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
