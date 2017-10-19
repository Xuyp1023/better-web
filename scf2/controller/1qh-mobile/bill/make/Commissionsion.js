
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.Commissionsion',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

         $scope.searchData = {};

      $scope.infoList = [{},{}];

      $scope.addParamInfo = {};
      $scope.detailParamInfo = {};

      //打开新增
      $scope.addInfoBox = function (){
        $scope.addParamInfo = {};
        $scope.addParamInfo.coreCustNo = $scope.coreCustList[0].value;
        $scope.addParamInfo.custNo = $scope.searchData.custNo;
        $scope.openRollModal('add_box');
      }
      //打开编辑
      $scope.editInfoBox = function(item){
        $scope.detailParamInfo = {};
        $scope.detailParamInfo=item;
        $scope.openRollModal('edit_box');
      }
      //打开删除
      $scope.deletInfoBox = function(item){

        $scope.detailParamInfo = {};
        $scope.detailParamInfo=item;
        $scope.openRollModal('delet_box');
      }
      //打开详情
      $scope.detailsBox = function(item){

        $scope.detailParamInfo = {};
        $scope.detailParamInfo=item;
        $scope.openRollModal('detail_box');
      }

      //提交新增账单
      $scope.addinfoList = function(target){


        var $target = $(target);

         //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_PARAM_SAVEADD_PARAM/*2*/,$.extend({},$scope.addParamInfo))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              tipbar.infoTopTipbar('发票参数新增成功!',{});
              $scope.closeRollModal('add_box');
              $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'发票参数新增失败,服务器返回:'+data.message,3000,9992);
            }
        });
        
      }
      //提交编辑账单
      $scope.editinfoList = function(target){

         var $target = $(target);

         //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_PARAM_SAVEUPDATE_PARAM/*2*/,$.extend({},$scope.detailParamInfo))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              tipbar.infoTopTipbar('发票参数修改成功!',{});
              $scope.closeRollModal('edit_box');
              $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'发票参数修改失败,服务器返回:'+data.message,3000,9992);
            }
        });
        

      }
      //删除账单
      $scope.deletinfoList = function(target,id){

         var $target = $(target);

         //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        
        http.post(BTPATH.SAVE_COMMISSION_PARAM_SAVEDELETE_PARAMBYID/*2*/,{paramId:id})
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              tipbar.infoTopTipbar('发票参数删除成功!',{});
              $scope.closeRollModal('delet_box');
              $scope.queryList(true);
            }else{
               tipbar.errorTopTipbar($target,'发票参数删除失败,服务器返回:'+data.message,3000,9992);
            }
        });
      }

      $scope.factorList = [];

       /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_COMMISSION_PARAM_INVOICEPARAM_LIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

      
       //点击查询
       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };

          $scope.mynumberdonw = function(){
            var mkey = $('#moneykey').val();
          }
        
        //校验配置
         var validOption = {
          elements: [{
              name: 'addParamInfo.coreCustNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'addParamInfo.interestRate',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'addParamInfo.taxRate',
              rules: [{name: 'required'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };    

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){

         commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){

            $scope.searchData.custNo = $scope.factorList.length>0?$scope.factorList[0].value:''; 
            
                commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
                  $scope.searchData.coreCustNo = $scope.searchData.coreCustNo?$scope.searchData.coreCustNo:''; 

                  $scope.searchList(true);
            
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
