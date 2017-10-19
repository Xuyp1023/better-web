
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.invoiceapp',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */



        $scope.infoList = [{id:'1'},{id:'2'}];
        $scope.tmpVo = {};
        $scope.isChange=true;
          //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.searchData = {
      GTEbillMonth:new Date().getSubDate('MM',3).format('YYYY-MM'),
      LTEbillMonth:new Date().format('YYYY-MM')
    };
       // 单选
      $scope.selectOne=function(){
          
        $scope.showbill();
        var count=$("td>input[type='checkbox']:checked").length;
        if(count==$scope.infoList.length){
          $scope.tmpVo.tmpCheckbox=true;
        }else{
          $scope.tmpVo.tmpCheckbox=false;
        }
      }
      //选择按钮，全选和去除全选
      $scope.toggleCheckbox = function(){

        var addIds=[];

        $scope.selectedBalance=0;
        $scope.totalBalance=0;
        $scope.waitInvoiceBalance=0;

        angular.forEach($scope.infoList,function(row){
          
          row.checkOne = $scope.tmpVo.tmpCheckbox; 
          
          if(row.checkOne){
              addIds.push(row.id);
              if($scope.searchData.invoiceType==0){
                $scope.selectedBalance=$scope.selectedBalance+row.paySuccessBalance;
              }else{

                $scope.selectedBalance=$scope.selectedBalance+row.interest+row.taxBalance;
              }
             
            }
              if($scope.searchData.invoiceType==0){
                  $scope.totalBalance=$scope.totalBalance+row.paySuccessBalance;
                }else{

                  $scope.totalBalance=$scope.totalBalance+row.interest+row.taxBalance;
                }
             

            if(addIds.length>0){
                $scope.isChange=false;
            }else{
               $scope.isChange=true;
            }         
        });

        $scope.totalBalance=$scope.totalBalance.toFixed(2);
        $scope.selectedBalance=$scope.selectedBalance.toFixed(2);
        $scope.waitInvoiceBalance = $scope.totalBalance - $scope.selectedBalance ;
      };
      

    $scope.applyinvoic = function(target){

        var addIds=[];
        var $target=$(target);
        angular.forEach($scope.infoList,function(row){
  
          if(row.checkOne){
              addIds.push(row.id);
            }
                 
        });
        //cache.put("invoiceinfo",{invoiceType:$scope.searchData.invoiceType,monthlyIds:addIds.join(","),coreCustNo:$scope.searchData.coreCustNo,custNo:$scope.searchData.custNo});
        

         http.post(BTPATH.SAVE_COMMISSION_INVOICE_DEMANDINVOICE/*2*/,$.extend({monthlyIds:addIds.join(",")},$scope.searchData))
          .success(function(data){
            
            if(common.isCurrentData(data)){

              cache.put("invoiceId",{id:data.data.id});
              window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/1qh-mobile/Askbill';
            }else{

              tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
            }
        });
        

    }

    $scope.demandInvoice = function(monthlyId){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
       
      };
      
      //btn show
      $scope.showbill = function(){
       var addIds=[];
       $scope.acount(addIds);
       if(addIds.length>0){
        $scope.isChange=false;
       }else{
        $scope.isChange=true;
       }
      }

      $scope.selectedBalance=0;
      $scope.totalBalance=0;
      $scope.waitInvoiceBalance=0;

      $scope.acount=function(addIds){

        $scope.selectedBalance=0;
        $scope.totalBalance=0;
        $scope.waitInvoiceBalance=0;

        angular.forEach($scope.infoList,function(row){
  
          if(row.checkOne){
              addIds.push(row.id);
              if($scope.searchData.invoiceType==0){
                $scope.selectedBalance=$scope.selectedBalance+row.paySuccessBalance;
              }else{

                $scope.selectedBalance=$scope.selectedBalance+row.interest+row.taxBalance;
              }
              
            }
            
                if($scope.searchData.invoiceType==0){
                    $scope.totalBalance = $scope.totalBalance+row.paySuccessBalance;
                  }else{

                    $scope.totalBalance=$scope.totalBalance+row.interest+row.taxBalance;
                  }
                
        });

        $scope.totalBalance=$scope.totalBalance.toFixed(2);
        $scope.selectedBalance=$scope.selectedBalance.toFixed(2);
        $scope.waitInvoiceBalance = $scope.totalBalance - $scope.selectedBalance ;

      }

    /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){

        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_COMMISSION_INVOICE_CANUSE_MONTHLYLIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data);/*3*/
                var addIds=[];
                 $scope.acount(addIds);
                if(flag/*1*/){
                  $scope.listPage = data.page;/*4*/
                }
              });
            }
        });
      };

      
       //点击查询
       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

       $scope.searchData.invoiceType=cache.get("invoiceType").type;


          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){

                $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
                
                commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
                  $scope.searchData.coreCustNo = cache.get("searchData").coreCustNo ? cache.get("searchData").coreCustNo:$scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
                  $scope.queryList(true);
              
             });

        });


          common.resizeIframe();
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
