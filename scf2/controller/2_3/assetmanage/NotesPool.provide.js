
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.NotesPoolprovide',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
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

      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      $scope.statusList = BTDict.effectiveVersionUsingBusinStatusForSearch.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      var dddd = new Date();
      dddd.setDate(1);
     $scope.searchData = {
        GTEinvoiceDate:dddd.getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEinvoiceDate:new Date().format('YYYY-MM-DD'),
        GTEendDate:dddd.format('YYYY-MM-DD'),
        LTEendDate:new Date().getSubDate('MM',-12).format('YYYY-MM-DD'),
        coreCustNo:'',
        supplierNo:'',
        LIKEbillNo:'',
        businStatus:''
      };

       $scope.infoDetail={
         };

  
      //打开详情
      $scope.detailsBox = function(data){

         $scope.uploadList=[];
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('details_box');
          $scope.$apply(function(){
                showDetail(data,'read');
            });

        });

      }


        function showDetail(data,moditype){

            
              //$scope.infoDetail = $.extend({},data,{modiType:moditype});
              //$scope.infoDetail = common.cloneArrayDeep(data);
              $scope.infoDetail =data;
              var businStatus=$scope.infoDetail.businStatus;
              var docStatus=$scope.infoDetail.docStatus;
              var lockedStatus=$scope.infoDetail.lockedStatus;
              //0 未核准 1：核准  2：已使用 3：转让 4废止 5 过期
              if(businStatus=='0'){
                $scope.infoDetail.busin='未生效';
                $scope.infoDetail.use='不可用';
              }
              if(businStatus=='1'){
                $scope.infoDetail.busin='已生效';
                $scope.infoDetail.use='正常';
              }
              if(businStatus=='3'){
                $scope.infoDetail.busin='已转让';
                $scope.infoDetail.use='已使用';
              }
              if(businStatus=='4'){
                $scope.infoDetail.busin='废止';
                $scope.infoDetail.use='不可用';
              }
              if(businStatus=='5'){
                $scope.infoDetail.busin='过期';
                $scope.infoDetail.use='不可用';
              }
              if(businStatus=='2' && lockedStatus=='1'){
                $scope.infoDetail.busin='已使用';
                $scope.infoDetail.use='冻结';
              }
              if(businStatus=='2' && lockedStatus=='0'){
                $scope.infoDetail.busin='已生效';
                $scope.infoDetail.use='未使用';
              }
             
              var balance=$scope.infoDetail.balance+"";
              if(balance.indexOf(".")>0){

                $scope.infoDetail.balanceTwo="￥"+balance.replace(".","");
              }else{
                $scope.infoDetail.balanceTwo="￥"+balance+"00";
              }

          }

      //打开编辑附件
      $scope.editInfoBox = function(data){

          $scope.uploadList=[];
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
        
            $scope.openRollModal('edit_box');
            $scope.$apply(function(){
                showDetail(data,'read');
            });
           //showDetail(data,'read');
      });
        
      }

    //删除附件项
      $scope.delUploadItem = function(item,listName){
        $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
      };

      //票据添加附件 editBillFile
         $scope.editBillFile=function(target,refNo,version){
        //设置校验项 | 校验
        /*validate.validate($('#add_box'),validOption);
        var valid = validate.validate($('#add_box'));
        if(!valid) return;*/

        var $target = $(target);
        var fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
        
         http.post(BTPATH.SAVE_MODIFY_ACCEPT_BILL_FILE_UPLOAD_CUST,{refNo:refNo,version:version,fileList:fileList})
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('修改票据附件成功!',{});
              $scope.queryList(true);
              $scope.closeRollModal("edit_box");
            }else{
              tipbar.errorTopTipbar($target,'修改票据附件失败,服务器返回:'+data.message,3000,9992);
            }
           });

      }    


       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };

        $scope.queryList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        $scope.searchData.isOnlyNormal = 0;
        $scope.searchData.isCust = true;
        http.post(BTPATH.QUERY_EFFECTIVEBILL_INFO_LIST,$.extend({},$scope.listPage,$scope.searchData))
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

              //页面初始化
          $scope.initPage = function(){
              commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'receiver').success(function(){
                
                $scope.searchData.supplierNo = common.filterArrayFirst($scope.receiver);
                
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.supplierNo},$scope,'coreCustList','CoreCustListDic').success(function(){
                   $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
                    $scope.searchData.coreCustNo = $scope.searchData.coreCustNo.length>0?$scope.searchData.coreCustNo[0].value:'';
                   $scope.queryList(true);

                });
            });
          };



         /*数据初始区域*/
         $scope.initPage();


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
