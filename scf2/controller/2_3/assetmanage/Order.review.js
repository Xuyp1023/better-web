
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.Order.review',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
     $scope.uploadList = [];
     $scope.tmpVo = {};
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
      $scope.statusList = BTDict.FactorCoreCustInfo.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');

      $scope.info = {};
      $scope.searchData = {
          GTEorderDate :'',
          LTEorderDate:'',
          isAudit:'true'
      };
  
      
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

      //订单审核界面打开
      $scope.auditInfoBox = function(data){

        $scope.uploadList=[];
        $scope.info=data;
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('auditorder_box');
        
        });

      }
      
      //订单审核  SAVE_AUDIT_ORDER_CORE
      
        $scope.auditOrder = function (target,data){

           var $target = $(target);
              http.post(BTPATH.SAVE_AUDIT_ORDER_CORE,{refNo:data.refNo,version:data.version})
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('订单信息审核成功!',{});
                    $scope.closeRollModal('auditorder_box');
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'订单信息审核失败,服务器返回:'+data.message,3000,9992);
                  }
                 });

        }

      //批量审核
      $scope.allaudit = function(target){

        var addIds=[]; 
        var $target = $(target);
        angular.forEach($scope.infoList,function(row){      
                
            if(row.checkOne){
                addIds.push(row.id);
                }
            });

        $scope.tmpVo.tmpCheckbox = false;
        if(addIds.length<=0){

          tipbar.errorTopTipbar($target,'请至少选择一条订单信息',3000,9992);
          return ;
        }

        var ids=addIds.join(',');

          http.post(BTPATH.SAVE_AUDIT_ORDERS_LIST_CORE,{ids:ids})
             .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('审核成功,本次共审核'+data.data+'笔订单!',{});
                $scope.queryList(true);
              }else{
                tipbar.errorTopTipbar($target,'审核失败,原因:'+data.message,3000,9992);
              }
             });

      }
      
      //订单详情界面打开
      $scope.detailsBox = function(data){

        $scope.uploadList=[];
        $scope.info=data;
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('details_box');
        
        });
      }
       $scope.quitbox = function(){

        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/Order.review';
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
        http.post(BTPATH.QUERY_INEFFECTIVE_ORDER_CORE/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
