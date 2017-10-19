

define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('set.yeild',['$scope','http','$rootScope','$route','cache','commonService','$location','$filter',function($scope,http,$rootScope,$route,cache,commonService,$location,$filter){
      // 供应商报价列表
      $scope.infoList = [];

      // 初始化查条件对象
      $scope.searchData = {}; 

      $scope.info = {};

      $scope.nexistCustList=[];
      $scope.custList=[];
       //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };
      // 添加
      $scope.addInfoBox = function(){
        $scope.info = {};
        
        // $scope.queryAddList();
        $scope.info.custNo=common.filterArrayFirst($scope.custList);
        $scope.info.coreCustNo=$scope.searchData.coreCustNo;
       
          $scope.openRollModal('add_supply');
      }
      // 查询已有的供应商列表
      $scope.queryAddList = function() {
         http.post(BTPATH.SAVE_SUPPLIER_OFFER_QUERYALLCUST,{coreCustNo:$scope.searchData.coreCustNo})
            .success(function(data){   
              if(common.isCurrentData(data)){
                  $scope.$apply(function(){
                     // $scope.existCustList='';
                     // $scope.existCustList=data.data; 
                     $scope.existCustList=data.data.join(",");
                     $scope.custList=[]; 
                     // $scope.existCustList=['102200934',"100000156"]; 
                     angular.forEach($scope.nexistCustList,function(row){
                        if($scope.existCustList.indexOf(row.value) == '-1'){
                          $scope.custList.push(row);
                        }
                     })
                  })
                  
              }
          });

       
        

      }

      // 更新
      $scope.update = function(data){
          $scope.info = {};
          $scope.info = data;
          $scope.openRollModal('update_supply');
      }

       //查询供应商列表 
      $scope.searchList = function(){
        $scope.listPage.pageNum = 1;
        $scope.queryList(true);    
      };

      //确认添加
      $scope.doConfirm=function(target,dataInfo){          
          var $target=$(target); 
        //设置校验项 | 校验
        validate.validate($('#validate'),validOption);
        var valid = validate.validate($('#validate'));
        if(!valid) return; 

          http.post(BTPATH.SAVE_SUPPLIER_OFFER_SAVEADDOFFER/*2*/,dataInfo)
            .success(function(data){   
              if(common.isCurrentData(data)){
                  $scope.closeRollModal('add_supply');
                  tipbar.infoTopTipbar('添加成功!',{});
                  $scope.queryList(true);
              }else{
                 tipbar.errorTopTipbar($target,'添加失败:'+data.message,3000,9993);
              }
          });
      }

      //确认更新
      $scope.doUpdate=function(target,datainfo){          
          var $target=$(target);
          //设置校验项 | 校验
          validate.validate($('#update'),validOption);
          var valid = validate.validate($('#update'));
          if(!valid) return;  
                  
          http.post(BTPATH.SAVE_SUPPLIER_OFFER_SAVEUPDATEOFFER/*2*/,datainfo)
            .success(function(data){   
              if(common.isCurrentData(data)){
                  $scope.closeRollModal('update_supply');
                  tipbar.infoTopTipbar('更新成功!',{});
                  $scope.queryList(true);
              }else{
                 tipbar.errorTopTipbar($target,'更新失败:'+data.message,3000,9993);
              }
          });
      }



      /*查询初始化*/
      $scope.queryList = function(flag){        
        //弹出弹幕加载状态        
        var $mainTable = $('#search_info .main-list');
        // loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_SUPPLIER_OFFER_QUERYOFFERLIST,$.extend({},$scope.listPage,$scope.searchData))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data);/*3*/
                $scope.queryAddList();
                if(flag/*1*/){
                  $scope.listPage = data.page;/*4*/
                }
              });
            }
        });
      };   

      //校验配置
      var validOption = {
            elements: [{
                name: 'info.coreCustRate',
                rules: [{name: 'required'},{name:'max',params:{max:30},message:'不能超过30%'}],
                events: ['blur']
            }],
            errorPlacement: function(error, element) {
                var label = element.parents('td').prev().text().substr(0);
                tipbar.errorLeftTipbar(element,label+error,0,99999);
            }
      };
      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        // 供应商名称列表查询
        

         commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'financeCustList').success(function(){
                /*$scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                $scope.searchData.custNo = $scope.searchData.custNo>0?$scope.searchData.custNo[0].value:'';*/
                $scope.nexistCustList = common.cloneArrayDeep($scope.financeCustList);
                $scope.queryList(true);
          });
        });

        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});

