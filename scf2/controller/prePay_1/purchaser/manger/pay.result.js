
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

   

    mainApp.controller('pay.result',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
     $scope.PayFilecollectionStatus = BTDict.payResultStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      
      $scope.searchData = {
          GTErequestPayDate:common.getFirstDay().format('YYYY-MM-DD'),
          LTErequestPayDate:common.getLastDay().format('YYYY-MM-DD'),
          infoType : '1'        
      };

      

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

     

      // 上传付款结果
      $scope.uploadResult=function(){
        window.location.href='?rn'+new Date().getTime()+'../scf2/home.html#/prePay_1/upload.result';
        
      }
      

      // 审核
      $scope.audit=function(data){
          $scope.info=data;
             // 获取数据列表             
             $scope.getDatalist('audit', data.sourceFileId);
          
      }
      // 子页面审核生效
      $scope.doAudit = function(target, sourceFileId){
          var $target = $(target);        
          http.post(BTPATH.SAVE_PAYFILE_SAVEAUDITFILEBYPRIMARYKEY,{id : sourceFileId})
             .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('审核成功!',{});
                $scope.closeRollModal("auditDetail");
                $scope.queryList(true);                
              }else{
                tipbar.errorTopTipbar($target,'审核失败,服务器返回:'+data.message,3000,9992);
              }
          });
      }

      // 删除
      $scope.delete=function(data){
          $scope.info=data;
             // 获取数据列表             
             $scope.getDatalist('delete', data.sourceFileId);
      }

      // 子页面删除
      $scope.doDelete = function(target, sourceFileId){
          var $target = $(target);        
          http.post(BTPATH.SAVE_PAYFILE_SAVEDELETEFILEBYPRIMARTKEY,{id : sourceFileId})
             .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('删除成功!',{});
                $scope.closeRollModal("delDetail");
                $scope.queryList(true);                
              }else{
                tipbar.errorTopTipbar($target,'删除失败,服务器返回:'+data.message,3000,9992);
              }
          });
      }

      // 详情
      $scope.lookDetail=function(data){
          
          $scope.info = data;
             // 获取数据列表             
            $scope.getDatalist("detail", data.sourceFileId);
      }
     
      // 获取列表的公共方法
      $scope.getDatalist = function(flag, dataId){
          http.post(BTPATH.QUERY_PAYRECORD_QUERYRECORDLISTBYFILEIDANDBUSINSTATUS,{sourceFileid : dataId, businStatus : ""})
              .success(function(data){
                  $scope.$apply(function(){                
                    $scope.dataList = common.cloneArrayDeep(data.data);/*3*/ 
                    switch (flag){
                      case 'audit':$scope.openRollModal('auditDetail');
                            break;
                      case 'delete':$scope.openRollModal('delDetail'); 
                            break;
                      default :$scope.openRollModal('resultDetail'); 
                            break;
                    }
                  });
            });
      }

      

       //查询申请列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);    
      };
      
      /*查询初始化*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_PAYFILE_QUERYFILEPAGE,$.extend({},$scope.listPage,$scope.searchData))
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
          $scope.queryList(true);
        
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});
