
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.Order.Entry',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
     $scope.uploadList = [];
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
      $scope.items = [{},{},{},{},{},{},{},{}];
      $scope.statusList = BTDict.orderVersionBusinStatus.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.infoImportList = [];
      $scope.info = {};
      $scope.editInfo = {};
      $scope.addInfo = {};
      $scope.exportInfo = {};
      $scope.searchData = {
          GTEorderDate:'',
          LTEorderDate:'',
          isAudit:'false'
      };

      //附件删除  $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);

       //删除附件项
      $scope.delUploadItem = function(item,listName){
        $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
      };

      //订单录入
      $scope.addInfoBox = function(){

        $scope.uploadList=[];
        $scope.addInfo={};
        $scope.addInfo.coreCustNo = common.filterArrayFirst($scope.coreCustList);
        $scope.addInfo.orderDate = new Date().format('YYYY-MM-DD'),
        $scope.addInfo.custNo = common.filterArrayFirst($scope.receiver);
        $scope.openRollModal('add_box');
      }

      //订单编辑
      $scope.editInfoBox = function(data){
        data.custNo = data.custNo +'';
        
        $scope.uploadList=[];
        $scope.editInfo = data;
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('edit_box');
        
      });
      
      }
      //订单作废
      $scope.deleteBox = function(data){

        
        $scope.uploadList=[];
        $scope.info = data;
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('delete_box');
        
      });
      
        
      }
      //订单详情
      $scope.detailsBox = function(data){

        
        $scope.uploadList=[];
        $scope.info=data;
        commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          
          $scope.openRollModal('details_box');
        
      });

       
      }
      //导入订单
      $scope.importBox = function(){

        $scope.exportInfo.coreCustNo=common.filterArrayFirst($scope.coreCustList);
        
        $scope.exportInfo.custNo=common.filterArrayFirst($scope.receiver);

        $scope.openRollModal('import_box');
      }
      
       $scope.quitbox = function(){

        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/Order.Entry';
      }

        //订单编辑保存
        $scope.modiInfo =function(target,flag){

          //数据校验--------
            //设置校验项 | 校验
              validate.validate($('#edit_box'),validOption);
              var valid = validate.validate($('#edit_box'));
              if(!valid) return;
          //------------------
           var $target = $(target);
            $scope.editInfo.confirmFlag=flag;

             $scope.editInfo.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.SAVE_EDIT_ORDER_CORE,$scope.editInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('订单信息修改成功!',{});
                    $scope.closeRollModal('edit_box');
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'订单信息修改失败,服务器返回:'+data.message,3000,9992);
                  }
                 });

        }

        //订单文件上传解析$scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);  
        var resolveFileFunction;

        $scope.resolveFileId='';
        $scope.importtBox =function(target){

          //数据校验--------

              validate.validate($('#import_box'),validOptionipt);
              var valid = validate.validate($('#import_box'));
              if(!valid) return;
          //------------------
           var $target = $(target);
                   //弹出弹幕加载状态
            var $mainTable = $('#search_info .main-list');
            loading.addLoading($mainTable,common.getRootPath());
           //上传文件id
           $scope.exportInfo.id = ArrayPlus($scope.uploadList).extractChildArray('id',true); 
           $scope.exportInfo.infoType='1';

             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);  
              //http.post(BTPATH.SAVE_RESOLVE_ORDER_FILE_CORE,$scope.exportInfo)
              http.post(BTPATH.SAVE_RESOLVE_ORDER_FILE_CORE_V2,$scope.exportInfo)
                 .success(function(data){

                   //关闭加载状态弹幕
                  loading.removeLoading($mainTable);  
                  if(data&&(data.code === 200)){

                    //已经解析成功，进入分页查询解析记录信息
                    $scope.resolveFileId=data.data[0].resolveFileId;
                    $scope.listPage.pageNum = 1;
                    $scope.queryList2(true);
                    $scope.closeRollModal('import_box');
                    $scope.openRollModal('import_boxt');
                    tipbar.infoTopTipbar('订单解析成功!',{});
                  }else{
                    tipbar.errorTopTipbar($target,'文件导入失败,服务器返回:'+data.message,3000,9992);
                  }

                  $scope['uploadList'] = ArrayPlus($scope['uploadList']).delChild('id',$scope.exportInfo.id);

                 });

        }

          /*查询订单列表*/
      $scope.queryList2 = function(flag){

        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_EXPORT_ORDER_LIST_CORE_FILEID/*2*/,$.extend({resolveFileid:$scope.resolveFileId},$scope.listPage))
          .success(function(data){
           
            if(common.isCurrentData(data)){
                $scope.$apply(function(){                  
                    $scope.infoImportList = common.cloneArrayDeep(data.data);/*3*/
                    if(flag/*1*/){
                      $scope.listPage = data.page;/*4*/
                     }             
                });
            }
        });
      };    
        //查询文件解析状态
        function findResolveFile (anId){

           http.post(BTPATH.FIND_RESOLVE_FILE_BY_ID_CORE,{id:anId})
                 .success(function(data){
                  if(data&&(data.code === 200)){

                    if(data.data.businStatus !=0){
                      window.clearInterval(resolveFileFunction);
                      if(data.data.businStatus ==1) {
                         tipbar.infoTopTipbar('文件导入失败!'+data.data.showMessage,{});
                      }
                      if(data.data.businStatus ==2) {
                         tipbar.infoTopTipbar('文件导入成功!',{});
                         queryOrderByResolveFile(anId);
                      }
                      $scope.closeRollModal('import_box');
                    }
                    //tipbar.infoTopTipbar('文件导入成功!',{});
                    
                    //$scope.queryList(true);
                  }else{
                    tipbar.infoTopTipbar('文件导入失败,服务器返回:'+data.message,{});
                  }
                 });

        }

        //查询订单信息通过解析文件id

        function queryOrderByResolveFile (anId){

           http.post(BTPATH.QUERY_EXPORT_ORDER_RECORD,{id:anId})
                 .success(function(data){
                  if(data&&(data.code === 200)){

                    data.data;
                    console.log(data.data);
                    //tipbar.infoTopTipbar('文件导入成功!',{});
                    
                    //$scope.queryList(true);
                  }else{
                    
                    tipbar.infoTopTipbar('文件查询失败!',{});
                  }
                 });

        }

        //订单新增
        $scope.addInfoFun = function(target,flag){

          //数据校验--------
              validate.validate($('#add_box'),validOptiont);
              var valid = validate.validate($('#add_box'));
              if(!valid) return;
          //------------------
           var $target = $(target);
              $scope.addInfo.confirmFlag=flag;

              $scope.addInfo.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.SAVE_ADD_ORDER_CORE,$scope.addInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('订单信息新增成功!',{});
                    $scope.closeRollModal('add_box');
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'订单信息新增失败,服务器返回:'+data.message,3000,9992);
                  }
                 });

        }


        //订单废止
        $scope.deleteInfo =function(target,item){

            var $target = $(target);
             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.SAVE_DELETE_ANNUL_ORDER_CORE,{refNo:item.refNo,version:item.version})
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('订单废止成功!',{});
                    $scope.closeRollModal('delete_box');
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'订单废止失败,服务器返回:'+data.message,3000,9992);
                  }
                 });

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

       //校验配置
         var validOption = {
          elements: [{
              name: 'editInfo.orderNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'editInfo.goodsName',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'editInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };    
    //校验配置
         var validOptiont = {
          elements: [{
              name: 'addInfo.orderNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'addInfo.goodsName',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'addInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };
    //校验配置
         var validOptionipt = {
          elements: [{
              name: 'file.fileName',
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
