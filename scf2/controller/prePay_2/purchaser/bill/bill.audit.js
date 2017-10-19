
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('bill.audit2',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
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
      
      $scope.statusList = BTDict.FactorCoreCustInfo.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.coreCustList = [];
      $scope.receiver = [];
      $scope.info = {};

      $scope.loanInfo ={};
      $scope.searchData = {

        GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEregDate:new Date().format('YYYY-MM-DD'),
        isAudit :'true'
      };
  
      //打开详情
      $scope.detailsBox = function(data){

          $scope.loanInfo = data;
         
        $scope.openRollModal('detail_box');

      }
      //打开审核
      $scope.pendingInfoBox = function(dataInfo){

          $scope.loanInfo ={};
          $scope.loanInfo = dataInfo;
          
          http.post(BTPATH.FIND_SUPPLIER_OFFER_FINDOFFER,{custNo:$scope.loanInfo.custNo,coreCustNo:$scope.loanInfo.coreCustNo})
           .success(function(data){
            if(data&&(data.code === 200)){
              $scope.$apply(function(){
                    
                     $scope.loanInfo.deductionRate=data.data.coreCustRate;
                  });
             
              
            }
           });  
          $scope.openRollModal('pending_box');
      }

      // 子页面审核按钮的处理
      $scope.pendInfot = function(target,item){

        var $target = $(target);        
        http.post(BTPATH.SAVE_AUDIT_RECEIVABLE_RECORD_CORE,{refNo:item.refNo,version:item.version})
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('审核成功!',{});
              $scope.closeRollModal("pending_box");
              $scope.queryList(true);
              
            }else{
              tipbar.errorTopTipbar($target,'审核发票失败,服务器返回:'+data.message,3000,9992);
            }
           });   

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
            http.post(BTPATH.QUERY_INEFFECTIVE_RECEIVABLE_CORE,$.extend({},$scope.listPage,$scope.searchData))
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
