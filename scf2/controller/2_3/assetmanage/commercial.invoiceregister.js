
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('assetmanage.commercial.invoiceregister',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
    /*  VM绑定区域  */
      // $scope.items = [];
      $scope.statusList = BTDict.orderVersionBusinStatus.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      // $scope.infoList = [{invoiceNo:1111111111111}];
      $scope.infoList=[];
      $scope.coreCustList=[];
      $scope.info = {};
      $scope.infoAdd={};
      $scope.searchData = {
          GTEinvoiceDate:'',
          LTEinvoiceDate:'',          
          isAudit:'false'
      };  

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
      
      //发票详情
      $scope.detailInfo = function(data){

        $scope.uploadList=[];
        // 查询附件列表
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          // 区分作废还是详情isCancel
          $scope.info=data;
          $scope.info.isCheck=2;
          $scope.info.isCancel=2;
          $scope.openRollModal('details_box');
        });

      }

      //作废发票
      $scope.deleteBox = function(data){

         $scope.uploadList=[];
                 // 查询附件列表
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
          // 区分作废还是详情isCancel
          $scope.info=$.extend({},data,{isCancel:1});
          $scope.info.isCheck=2;
          $scope.openRollModal('details_box');
        });
      }

      // 子页面作废按钮处理
      $scope.doCancel = function(target,data){
        var $target = $(target);        
        http.post(BTPATH.SAVE_ANNUL_INVOICE_RECORD_CORE,{refNo:data.refNo,version:data.version})
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('作废成功!',{});
              $scope.queryList(true);
              $scope.closeRollModal("details_box");
            }else{
              tipbar.errorTopTipbar($target,'作废发票失败,服务器返回:'+data.message,3000,9992);
            }
           });        
      }

      //添加发票
      $scope.addInfoBox = function(){
        // 数据初始化
        $scope.infoAdd={};
        $scope.uploadList=[];
        $scope.infoAdd.coreCustNo = common.filterArrayFirst($scope.coreCustList);
        $scope.infoAdd.custNo = common.filterArrayFirst($scope.receiver);
        $scope.infoAdd.invoiceDate = new Date().format('YYYY-MM-DD'), 
        $scope.infoAdd.isEdit='2';
        // 行业类别字典获取
        // 日期初值

        $scope.openRollModal('add_box');
      }

      //子页面添加按钮的处理
      $scope.addInfo=function(target){
        //设置校验项 | 校验
        validate.validate($('#add_box'),validOption);
        var valid = validate.validate($('#add_box'));
        if(!valid) return;


        var $target = $(target);
        $scope.infoAdd.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
        if(!$scope.infoAdd.fileList || $scope.infoAdd.fileList==''){
          tipbar.errorTopTipbar($target,'请上传附件,发票登记必须要有附件信息',3000,9992);
          return ;
        }
        $scope.infoAdd.confirmFlag='true';
        
         http.post(BTPATH.SAVE_ADD_INVOICE_RECORD_CORE,$scope.infoAdd)
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('发票添加成功!',{});

              $scope.queryList(true);
              $scope.closeRollModal("add_box");
            }else{
              tipbar.errorTopTipbar($target,'添加发票失败,服务器返回:'+data.message,3000,9992);
            }
           });

      }

      //编辑发票
      $scope.editInfoBox = function(data){

          $scope.uploadList=[];
          $scope.infoAdd=$.extend({},data,{isEdit:'1'});
          $scope.infoAdd.coreCustNo=data.coreCustNo+'';
          // $scope.editInfo = data;
          commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:data.batchNo},$scope,'uploadList').success(function(){
        
           
           $scope.openRollModal('add_box');
        
      });
      }

      $scope.quitbox = function(){

        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/Commercialinvoiceregister';
      }

      // 编辑子页面提交按钮的处理
      $scope.editInfo=function(target){
        //设置校验项 | 校验
        validate.validate($('#add_box'),validOption);
        var valid = validate.validate($('#add_box'));
        if(!valid) return;

        var $target = $(target);
        $scope.infoAdd.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
        if(!$scope.infoAdd.fileList || $scope.infoAdd.fileList==''){
          tipbar.errorTopTipbar($target,'请上传附件,发票登记必须要有附件信息',3000,9992);
          return ;
        }
        $scope.infoAdd.confirmFlag='true';
         http.post(BTPATH.SAVE_MODIFY_INVOICE_RECORD_CORE,$scope.infoAdd)
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('发票修改成功!',{});
               $scope.closeRollModal('add_box');
               // window.location.href='../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/Commercialinvoiceregister';
              $scope.queryList(true);
              
            }else{
              tipbar.errorTopTipbar($target,'发票修改失败,服务器返回:'+data.message,3000,9992);
            }
           });

      }    

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
        http.post(BTPATH.QUERY_INEFFECTIVE_INVOICE_CORE/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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
                name: 'infoAdd.invoiceCode',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'infoAdd.invoiceNo',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'infoAdd.balance',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'infoAdd.invoiceDate',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'infoAdd.drawer',
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
       
             commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'receiver').success(function(){
                
                $scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.searchData.custNo},$scope,'coreCustList','CoreCustListDic').success(function(){
                   $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
                    
                     $scope.searchData.coreCustNo = $scope.searchData.coreCustNo.length>0?$scope.searchData.coreCustNo[0].value:'';
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
