
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('account.details2',['$scope','http','$rootScope','$route','cache','commonService','$location','toLoad',function($scope,http,$rootScope,$route,cache,commonService,$location,toLoad){
      /*  VM绑定区域  */
      $scope.statusList = BTDict.commissionFileStatus.toArray('value','name');
      $scope.infoList = [];     
      // $scope.infoList = [{fileName:'先锋公司','businStatus':'0'}];     
      $scope.searchData = {
        importDate:new Date().format('YYYY-MM-DD'),
        /*LTEregDate:new Date().format('YYYY-MM-DD'),*/
        businStatus:''
      };
      $scope.info={};
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      }; 

      // 查看
      $scope.lookDetail=function(data){
          $scope.info=data;
          $scope.openRollModal('lookDetail');
      }

      //添加文件
      $scope.addInfo=function(){
        window.location.href='../byte/home.html#/scf/commission/import?infoType=3';
      } 
          
       //删除文件
      $scope.delInfo = function(target,data){
        //data.businStatus = '-1';
        dialog.confirm('是否确认删除该文件,该操作无法恢复!',function(){
          var $target = $(target);
          http.post(BTPATH.QUERY_COMMISSION_FILE_DELETE,{refNo:data.refNo,beanName:'scfReceivableDOService'})
              .success(function(data){
              if(data&&(data.code === 200)){
                $scope.queryList(true);
                tipbar.infoTopTipbar('删除佣金文件成功!',{});
              }else{
                tipbar.errorTopTipbar($target,'删除佣金文件失败,服务器返回:'+data.message,3000,9992);
              }
             });
        });
      };

      //作废佣金文件     saveAnnulFile  

      $scope.saveAnnulFile = function(target,dataInfo){
        //data.businStatus = '-1';
        dialog.confirm('是否确认作废该文件,该操作无法恢复!',function(){
          var $target = $(target);
          http.post(BTPATH.SAVE_COMMISSION_FILE_ANNUL_CORE,{fileId:dataInfo.id})
              .success(function(data){
              if(data&&(data.code === 200)){
                $scope.queryList(true);
                tipbar.infoTopTipbar('佣金文件作废成功!',{});
              }else{
                tipbar.errorTopTipbar($target,'佣金文件作废失败,服务器返回:'+data.message,3000,9992);
              }
             });
        });
      };

      var cacheUrl=false;
      // 解析文件
      $scope.parse=function(target,data){
      if(cacheUrl){return}
      else{
        cacheUrl=true;
      }  
      var $target=$(target);
        //弹出弹幕加载状态
        // var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        toLoad.toggleSpin();
        http.post(BTPATH.QUERY_COMMISSION_FILE_RESOLVE/*2*/,{refNo:data.refNo,beanName:'scfReceivableDOService'})
          .success(function(data){
              cacheUrl=false;
            //关闭加载状态弹幕
                toLoad.toggleSpin();
                // loading.removeLoading($mainTable);
                if(common.isCurrentData(data)){
                  if(data.data.resolveStatus==1){
                    var resolveStatus=data.data;
                        $scope.$apply(function(){  
                        $scope.totalBalance="";      
                        $scope.totalAmount="";  
                        $scope.totalBalance=data.data.totalBlance;      
                        $scope.totalAmount=data.data.totalAmount;         
                        $scope.openRollModal('parseSuccess');
                        $scope.setCount();
                        });

                    }else{
                  var errorMessage=data.data.showMessage;
                  tipbar.errorTopTipbar($target,'解析失败,服务器返回:'+errorMessage,3000,9992);
              }

             
            }else{
               var errorMessage=data.message;
                  tipbar.errorTopTipbar($target,'解析失败,服务器返回:'+errorMessage,3000,9992);
            }

             $scope.queryList(true);
          });                         
      }

      //倒计时功能实现
      $scope.setCount=function(){
        $scope.count=3; 
        var timer=setInterval(function(){
          if($scope.count>0){
            $scope.$apply(function(){ 
              $scope.count--; 
            });            
          }else{
              window.clearInterval(timer);
              $scope.closeRollModal('parseSuccess');
          }                      
        },1000)
      } 

      //查询佣金详情
      /*$scope.detailInfo=function(){
        var message={
          importDate: $scope.searchData.importDate,
          businStatus:'0',
          payStatus:'0',
          custNo:$scope.searchData.custNo
        };
        cache.put('msg',message);
        $scope.openRollModal('lookDetail');
      } */

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
        http.post(BTPATH.QUERY_COMMISSION_FILE_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
          $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
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

