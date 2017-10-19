
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){    
    var flowService = require('../../../flow/supplierFinance/service/supplierFinanceService.js');
    flowService.servPlus(mainApp,common);

    mainApp.controller('submit.apply',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
      /*  VM绑定区域  */
      //基础数据
      $scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');   //期限单位 
      
      // 应收账款列表
      $scope.accountList=[];
      // 贸易合同列表
      $scope.contractList=[];
      //发票清单 
      $scope.billList=[];      

      $scope.listSelect='';
      $scope.factorBusinTypeList=[];
      $scope.lists=[];
      $scope.info = {};

      $scope.temp={
        bSelect:true
      }

      $scope.listConfig=[
              {'listName':'accountList',path:'',dicetype:'2',id:'list_table_1','listMap':'assetInfo.basedataMap.receivableList'},
              {'listName':'contractList',path:'',dicetype:'3',id:'list_table_2','listMap':'assetInfo.basedataMap.agreementList'},
              {'listName':'billList',path:'',dicetype:'4',id:'list_table_3','listMap':'assetInfo.basedataMap.invoiceList'},
              {'listName':'orderList',path:'',dicetype:'5',id:'list_table_4','listMap':'assetInfo.basedataMap.orderList'},
              {'listName':'recheckList',path:'',dicetype:'6',id:'list_table_5'},
              {'listName':'outboundList',path:'',dicetype:'7',id:'list_table_6'},
              {'listName':'otherList',path:'',dicetype:'其它附件',id:'list_table_7'}
             
            ];
      
      

     

      // window.onload=test;     
     //资产详情
      $scope.assetInfo = {};
      $scope.assetInfo.basedataMap = {} ;
      $scope.assetInfo.basedataMap.agreementList=$scope.assetInfo.basedataMap.agreementList||[];
      $scope.assetInfo.basedataMap.orderList=$scope.assetInfo.basedataMap.orderList||[];
      $scope.assetInfo.basedataMap.invoiceList=$scope.assetInfo.basedataMap.invoiceList||[];
      $scope.assetInfo.basedataMap.receivableList=$scope.assetInfo.basedataMap.receivableList||[];
      $scope.assetInfo.basedataMap.acceptBillList=$scope.assetInfo.basedataMap.acceptBillList||[];
      $scope.canUseBaseDataParam={};
      $scope.downRecheckListUrl = "";
      $scope.downOutboundListUrl = "";
      $scope.downOtherListUrl = "";
      // 各下拉列表定义
      $scope.accountNumList=[];
      $scope.bankAccount={};
      $scope.financeCustList=[];
      $scope.factorList=[];
      $scope.coreCustList=[];
      $scope.factorProList=[];

      
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };
     
      /*查询初始化*/
      $scope.queryList = function(flag){
        //弹出弹幕加载状态
         var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CAN_USE_BASE_DATA_CORE,$.extend({},$scope.listPage,$scope.canUseBaseDataParam))
                .success(function(data){
                   //关闭加载状态弹幕
                  loading.removeLoading($mainTable);
                  if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                    $scope.$apply(function(){
                      //合同
                      if($scope.canUseBaseDataParam.dataType=="5"){
                        $scope.contractList = common.cloneArrayDeep(data.data);
                      }

                       if($scope.canUseBaseDataParam.dataType=="3"){
                        $scope.accountList = common.cloneArrayDeep(data.data);
                      }

                       if($scope.canUseBaseDataParam.dataType=="4"){
                        $scope.billList = common.cloneArrayDeep(data.data);
                      }

                       if($scope.canUseBaseDataParam.dataType=="1"){
                        $scope.orderList = common.cloneArrayDeep(data.data);
                      }
                      
                      if(flag){
                        $scope.listPage = data.page;
                      }
                    });
                  }   
              });
      };

      //返回
      $scope.returnBack=function(){
        window.location.href='../scf2/home.html#/prePay_1/finance.apply';
      }      
      
     
      // 提交
      $scope.submit=function(target){
        var $target=$(target);        

        //设置校验项 | 校验
        validate.validate($('#edit_box'),validOption);
        var valid = validate.validate($('#edit_box'));
        if(!valid) return;

        if($scope.assetInfo.basedataMap.receivableList.length==0 || $scope.assetInfo.basedataMap.agreementList==0|| $scope.assetInfo.basedataMap.invoiceList==0){
            tipbar.errorTopTipbar($target,'每项融资标的至少选择一项！',3000,9993);
            return;
        }

        // 保存资产信息
          http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVEADDREQUESTFOUR, $.extend({},$scope.assetInfo,$scope.info)).success(function(data){
            if(common.isCurrentData(data)){
                $scope.$apply(function(){
                    $location.path('/prePay_1/finance.apply');
                    tipbar.infoTopTipbar('提交成功!',{});                    
                })
               
            }else{
              tipbar.errorTopTipbar($target,'新增融资申请失败,服务器返回:'+data.message,3000,9992);
            }
          });  
      }
      

      // 添加列表项  关联的基础数据的类型1订单2票据3应收账款4发票5贸易合同6运输单单据类型
      $scope.openBox=function(flag){       
        $scope.canUseBaseDataParam.custNo=$scope.info.custNo;
        $scope.canUseBaseDataParam.coreCustNo=$scope.info.coreCustNo;
        switch (flag){
          case 1:
              $scope.listSelect='1';
              $scope.canUseBaseDataParam.dataType="3";
              $scope.canUseBaseDataParam.ids=$scope.assetInfo.receivableList;
              //commonService.queryBaseInfoList(BTPATH.QUERY_DIC_PRODUCTLIST,{},$scope,'accountList');
              break;
          case 2:
              $scope.listSelect='2';
              $scope.canUseBaseDataParam.dataType="5";
              $scope.canUseBaseDataParam.ids=$scope.assetInfo.agreementList;
              //commonService.queryBaseInfoList(BTPATH.QUERY_CAN_USE_BASE_DATA_CORE,{},$scope.canUseBaseDataParam,'contractList');
              
              break;
          case 3:
              $scope.listSelect='3';
              $scope.canUseBaseDataParam.dataType="4";
              $scope.canUseBaseDataParam.ids=$scope.assetInfo.invoiceList;
              //commonService.queryBaseInfoList(BTPATH.QUERY_DIC_PRODUCTLIST,{},$scope,'billList');
              break;
          case 4:
              $scope.listSelect='4';
              $scope.canUseBaseDataParam.dataType="1";
              $scope.canUseBaseDataParam.ids=$scope.assetInfo.orderList;
              //commonService.queryBaseInfoList(BTPATH.QUERY_DIC_PRODUCTLIST,{},$scope,'orderList');
              break;
        }        
        $scope.queryList(true);
        $scope.openRollModal('account');
      }


      // 选择按钮的处理
      $scope.pushSelected=function(target,flag){
            var $target=$(target);
            var currConfig=$scope.listConfig[flag];
            var targetId=$('#'+currConfig.id);
            var addIds=[];
            angular.forEach($scope[currConfig.listName],function(row){            
              if(row.selectOne){
                  addIds.push(row.id);
                 // $scope[currConfig.listName].push(row);
                 //合同
                 if(flag=='1'){
                  $scope.assetInfo.basedataMap.agreementList.push(row);
                  $scope.assetInfo.agreementList=$scope.assetInfo.agreementList+","+row.id;
                 }
                 //应收账款
                 if(flag=='0'){
                  $scope.assetInfo.basedataMap.receivableList.push(row);
                  $scope.assetInfo.receivableList=$scope.assetInfo.receivableList+","+row.id;
                  //计算总金额
                  $scope.countTotalBalance();
                 }
                 //发票
                 if(flag=='2'){
                  $scope.assetInfo.basedataMap.invoiceList.push(row);
                  $scope.assetInfo.invoiceList=$scope.assetInfo.invoiceList+","+row.id;
                 }
                 //订单
                 if(flag=='3'){
                  $scope.assetInfo.basedataMap.orderList.push(row);
                  $scope.assetInfo.orderList=$scope.assetInfo.orderList+","+row.id;
                 }


              }
            });

            // 清单列表有无选择效验
            if (addIds.length <= 0) {
                tipbar.errorTopTipbar($target,'请选择需要选择的清单列表！',3000,9993);
                return;
            }    

            

            $scope.closeRollModal('account');
            // common.pageSkip(targetId,500);  
           
         
      }
      // 计算当前资产总额的方法
      $scope.countTotalBalance = function(){
        // var z=$scope.tempName;
        // console.log(z);
        // 解析主体资产的scope信息
        var zz = $scope.assetInfo.basedataMap.receivableList;
        if(zz){
            $scope.info.balance=0;
          for (var i =0; i<zz.length;i++) {
            if(! isNaN(parseFloat(zz[i].surplusBalance))){
              $scope.info.balance +=Number(zz[i].surplusBalance);

            }
          }
          //console.log($scope.info.totalBalance);
        }

      }       
        
      

      //移除详情
      $scope.delDetail = function(data,dataType){

        if(dataType=="1"){

           $scope.assetInfo.basedataMap.receivableList.remove(data);
           $scope.assetInfo.receivableList=removeStringValue($scope.assetInfo.receivableList,data.id);
        }

        if(dataType=="2"){

           $scope.assetInfo.basedataMap.agreementList.remove(data);
           $scope.assetInfo.agreementList=removeStringValue($scope.assetInfo.agreementList,data.id);
        }

         if(dataType=="3"){

           $scope.assetInfo.basedataMap.invoiceList.remove(data);
           $scope.assetInfo.invoiceList=removeStringValue($scope.assetInfo.invoiceList,data.id);
        }

        if(dataType=="4"){

           $scope.assetInfo.basedataMap.orderList.remove(data);
           $scope.assetInfo.orderList=removeStringValue($scope.assetInfo.orderList,data.id);
        }

        //计算总金额
            $scope.countTotalBalance();

      }

      function removeStringValue(totalString,subString){
        var array=new Array();
        array=totalString.split(",");
        for(var i=0; i<array.length; i++) {
          if(array[i] == subString) {
            array.splice(i, 1);
            break;
          }
        }
        //array.remove(subString);
        return array.join(",");

      }    
     

      // 收款信息
      $scope.searchBank=function(){
          var custBankAccount=$scope.info.custBankAccount;
          if(custBankAccount==''){
            $scope.info.custBankAccountName='';
            $scope.info.custBankName='';
            return;
          }

          http.post(BTPATH.FIND_CUSTMECH_BANK_ACCOUNT,{bankAcco:custBankAccount}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.bankAccount=data.data;
                        $scope.info.custBankAccountName=$scope.bankAccount.bankAccoName ? $scope.bankAccount.bankAccoName:'';
                        $scope.info.custBankName=$scope.bankAccount.bankName ? $scope.bankAccount.bankName:''; 
                    });
                  }
          })
      }


      $scope.queryAllList=function(){       
            
         http.post(BTPATH.QUERY_Asset_DETAIL_BYASSETID_CUST,{assetId:$scope.info.orders}).success(function(data){
                    $scope.$apply(function(){
                      $scope.assetInfo=data.data;
                      $scope.assetInfo.factorNo=$scope.info.factorNo;
                      $scope.info.totalBalance=$scope.assetInfo.balance;
                    })                 
                    
                }); 
           
      }

      //校验配置
      var validOption = {
            elements: [{
                name: 'info.requestBalance',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.requestPayDate',
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

        // 操作企业
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'financeCustList').success(function(data){
            var custNo = $scope.financeCustList[0] ? $scope.financeCustList[0].value:'';
            $scope.info.custNo=custNo;

            // 融资银行
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:custNo},$scope,'factorList').success(function(){
                $scope.info.factoryNo=$scope.info.factoryNo || '';

                 // 核心企业
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:custNo},$scope,'coreCustList').success(function(){
                    $scope.info.coreCustNo=$scope.info.coreCustNo || '';
                   
                }); 
            });
            

            // 收款账号下拉列表
            commonService.queryBaseInfoList(BTPATH.QUERY_BANK_ACCOUNT_KEYANDVALUE,{custNo:custNo},$scope,'accountNumList').success(function(){
                $scope.info.suppBankAccount=$scope.info.suppBankAccount || '';                
                $scope.searchBank();                
            });

            //授信余额
            http.post(BTPATH.QUERY_COMP_QUOTA,{custNo:custNo}).success(function(data){
                $scope.info.creditBalance= data.data.creditBalance;
                
            });
            setTimeout(function(){
                common.resizeIframe();
            })
         }); 

        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});
