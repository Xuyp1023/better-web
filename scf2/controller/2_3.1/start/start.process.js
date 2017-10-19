
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    var flowService = require('../../flow/supplierFinance/service/supplierFinanceService.js');
    flowService.servPlus(mainApp,common);

    mainApp.controller('start.process',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
      /*  VM绑定区域  */
      //基础数据
      $scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');   //期限单位 
      $scope.tempName='';
      $scope.info = {periodUnit:'2'};
      // 应收账款列表
      $scope.accountList=[];
      // 贸易合同列表
      $scope.contractList=[];
      //发票清单 
      $scope.billList=[];
      //采购订单
      $scope.orderList=[];
      // 对账单列表
      $scope.recheckList=[];
      // 商品出库单列表
      $scope.outboundList=[];
      // 其他附件列表
      $scope.otherList=[];
      // 临时对象，初始化
      $scope.temp={step:'1',bSelect:true};

      $scope.listSelect='';
      $scope.factorBusinTypeList=[];
      $scope.lists=[];

      //保存和修改路径配置
      var pathConfig=[
        {path:BTPATH.ADD_REQUEST_TEMP},
        {path:BTPATH.SAVE_MODIFY_REQUEST_TEMP}
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

      // $scope.count='';    
      // 各融资标的 的详情页跳转--
      // 应收账款详情
      /*$scope.detailReceive=function(data){
        $scope.loanInfo=data;
        $scope.openRollModal('detail_box');
      }*/
      // 商业发票详情
      /*$scope.detailBill=function(data){
        $scope.loanInfo=data;
        $scope.openRollModal('detail_box');
      }*/
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
        window.location.href='../scf2/home.html#/2_3.1/start.apply';
      } 

       // 上一步
       $scope.preStep=function(target){
        $scope.temp.step='1';
        setTimeout(function(){
          common.resizeIframe();
        })
      }

      // 下一步
      $scope.nextStep=function(target){
        var $target=$(target);

        //设置校验项 | 校验
        validate.validate($('#edit_box'),validOption);
        var valid = validate.validate($('#edit_box'));
        if(!valid) return;
        
        // 保存基本信息和资产信息
        if($scope.info.requestNo){
            var currPath=pathConfig[1].path;
        }else{
            var currPath=pathConfig[0].path;
            //$scope.info.edit="true";
        }
       // if($scope.info.totalBalance==0 || isNaN(parseFloat($scope.info.totalBalance))){
        //   tipbar.errorTopTipbar($target,'请选择主资产',3000,9992); 
       //    return;
       // }

        //封装附件信息
        $scope.assetInfo.statementFileList=ArrayPlus($scope.recheckList).extractChildArray('id',true);
        $scope.assetInfo.goodsFileList=ArrayPlus($scope.outboundList).extractChildArray('id',true);
        $scope.assetInfo.othersFileList=ArrayPlus($scope.otherList).extractChildArray('id',true);
        $scope.assetInfo.sourceUseType="2";
        http.post(currPath,$.extend({},$scope.assetInfo,$scope.info))
          .success(function(data){
            //关闭加载状态弹幕
            // loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                 $scope.info.requestNo=data.data.requestNo;
                 $scope.info.custName=data.data.custName;
                 $scope.info.coreCustName=data.data.coreCustName;
                 $scope.info.factorName=data.data.factorName;
                 $scope.info.productName=data.data.productName;
                 $scope.info.orders=data.data.orders;
                 $scope.temp.step='2';
                 $scope.searchBank();
                 $scope.queryAllList();
              });
            }else{
               tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992); 
               return;
            }
        });  
      }
     
      // 提交
      $scope.submit=function(target){
        var $target=$(target);

        //流程启动传递参数
        var flowData = {
          //流程名称
          workFlowName :'应收账款审批流程',
          custNo:$scope.info.factorNo,      //流程所属公司     在此为 保理公司编号
          startCustNo:$scope.info.custNo,   //启动流程的公司
          // 流程参与公司
          factorCustNo:$scope.info.factorNo,
          supplierCustNo:$scope.info.custNo,
          coreCustNo:$scope.info.coreCustNo,
          sellerCustNo:$scope.currRole == "agency" ? $scope.info.custNo : '',
          platformCustNo:'',
          data:JSON.stringify($scope.info)
        };

         // 保存资产信息
          http.post(BTPATH.START_WORKFLOW_TASK, flowData).success(function(data){
            if(common.isCurrentData(data)){
               $scope.info.regDate=data.data.regDate;
               $scope.info.regOperName=data.data.regOperName;
               $scope.openRollModal('submitSucc');
               $scope.setCount();
            }else{
              tipbar.errorTopTipbar($target,'新增融资申请失败,服务器返回:'+data.message,3000,9992);
            }
          });  

       
      }

      //倒计时功能实现
      $scope.setCount=function(){
        $scope.count=10; 
        var timer=setInterval(function(){
          if($scope.count>0){
            $scope.$apply(function(){ 
              $scope.count--; 
            });            
          }else{
              window.clearInterval(timer);
              // $scope.closeRollModal('submitSucc');
              window.location.href='?rn'+new Date().getTime()+'../scf2/home.html#/2_3.1/start.apply';
          }                      
        },1000)
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

            //计算总金额
            $scope.countTotalBalance();

            $scope.closeRollModal('account');
            common.pageSkip(targetId,500);  
           
         
      }
      // 计算当前资产总额的方法
      $scope.countTotalBalance = function(){
        // var z=$scope.tempName;
        // console.log(z);
        // 解析主体资产的scope信息
        var zz = $scope.$eval($scope.tempName);
        if(zz){
            $scope.info.totalBalance=0;
          for (var i =0; i<zz.length;i++) {
            if(! isNaN(parseFloat(zz[i].balance))){
              $scope.info.totalBalance +=Number(zz[i].balance);

            }
          }
          //console.log($scope.info.totalBalance);
        }

      }

      //删除附件项
      $scope.delUploadItem = function(item,listName){
        $scope[listName] = ArrayPlus($scope[listName]).delChild('id',item.id);
      };


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
        
      // 根据保理机构，核心企业过滤保理产品
      $scope.searchProList=function(){
        var param={
          "coreCustNo":$scope.info.coreCustNo,
          "factorNo":$scope.info.factorNo
        }

        //commonService.queryBaseInfoList(BTPATH.FIND_PRODUCT_DICT,{coreCustNo:$scope.info.coreCustNo, factorNo:$scope.info.factorNo},$scope,'factorProList').success(function(){
        commonService.queryBaseInfoList(BTPATH.FIND_PRODUCT_DICT,param,$scope,'factorProList').success(function(data){
          $scope.$apply(function(){
            $scope.info.productCode = $scope.factorProList[0] ? $scope.info.productCode ||$scope.factorProList[0].value:'';
            // 查询保理产品下的资产配置
            commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:$scope.info.productCode},$scope,'lists').success(function(data){
              if($scope.lists.length<=0){
                return;
              }
              flowService.getAllList($scope);

            })
          });
        });
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
      /*function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
          if(arr[i] == val) {
            arr.splice(i, 1);
            break;
          }
        }
      }*/
      // 保理产品下拉切换
      $scope.changeProList=function(){        
        $scope.lists=[];
        commonService.queryBaseInfoList(BTPATH.FIND_ASSETDICT_BYPRODUCT,{productCode:$scope.info.productCode},$scope,'lists').success(function(data){
              if($scope.lists.length<=0){                
                $scope.tempObj={};
                return;
              }
              // 调用服务中的方法
              flowService.getAllList($scope);

            })
      }

      //查询业务类型集合
      $scope.searchBusinTypeList=function(){
        var param={
          "businTypeName":'应收账款保理'
        }

        //commonService.queryBaseInfoList(BTPATH.FIND_PRODUCT_DICT,{coreCustNo:$scope.info.coreCustNo, factorNo:$scope.info.factorNo},$scope,'factorProList').success(function(){
        commonService.queryBaseInfoList(BTPATH.QUERY_ALL_BUSIN_TYPE_SUPPLER,param,$scope,'factorBusinTypeList').success(function(data){
          $scope.$apply(function(){
            $scope.info.businTypeId = $scope.factorBusinTypeList[0] ? $scope.factorBusinTypeList[0].id:'';
          });
        });
      }

      // 收款信息
      $scope.searchBank=function(){
          var suppBankAccount=$scope.info.suppBankAccount;
          if(suppBankAccount==''){
            $scope.info.bankAccoName='';
            $scope.info.bankName='';
            return;
          }

          http.post(BTPATH.FIND_CUSTMECH_BANK_ACCOUNT,{bankAcco:suppBankAccount}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.bankAccount=data.data;
                        $scope.info.bankAccoName=$scope.bankAccount.bankAccoName ? $scope.bankAccount.bankAccoName:'';
                        $scope.info.bankName=$scope.bankAccount.bankName ? $scope.bankAccount.bankName:''; 
                    });
                  }
          })
      }


      $scope.queryAllList=function(){
       /* commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'financeCustList').success(function(data){
            
            // 保理机构
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:$scope.info.custNo},$scope,'factorList').success(function(){
              
                 // 核心企业
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:$scope.info.custNo},$scope,'coreCustList').success(function(){
                    
                    // 查询对应的保理产品
                     $scope.searchProList();
                    $scope.searchBusinTypeList();
                }); 
            });
          });*/
            
         http.post(BTPATH.QUERY_Asset_DETAIL_BYASSETID_CUST,{assetId:$scope.info.orders}).success(function(data){
                    $scope.$apply(function(){
                      $scope.assetInfo=data.data;
                      $scope.assetInfo.factorNo=$scope.info.factorNo;
                      $scope.info.totalBalance=$scope.assetInfo.balance;
                    })
                    
                    // 根据基本信息里的保理产品编号查询资产清单
                    // 对账单查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.statementBatchNo},$scope,'recheckList');                   
                   $scope.downRecheckListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.recheckList).extractChildArray("id",true) + "&fileName=对账单资料包";
                   // 商品出库单查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.goodsBatchNo},$scope,'outboundList');                  
                   $scope.downOutboundListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.outboundList).extractChildArray("id",true) + "&fileName=出库单资料包";
                   // 其它附件查询和下载全部
                   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.assetInfo.othersBatchNo},$scope,'otherList');                    
                   $scope.downOtherListUrl = BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + ArrayPlus($scope.otherList).extractChildArray("id",true) + "&fileName=其他附件资料包";
                }); 
           
      }

      //校验配置
      var validOption = {
            elements: [{
                name: 'info.balance',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.period',
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
        // 重新申请信息
        var basicInfo=cache.get('basicInfo');        
        //继续申请 
        if(basicInfo){                          
             $scope.info=basicInfo;
             // $scope.info.productCode=$scope.info.productCode+'';
             cache.remove('basicInfo');             
              $scope.queryAllList();
        }
        // 显示列表的操作项（上传、添加）
        // $scope.info.isCanRead='0';
       //各下拉列表项列表查询
      

        // 操作企业
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'financeCustList').success(function(data){
            var custNo = $scope.financeCustList[0] ? $scope.financeCustList[0].value:'';
            $scope.info.custNo=custNo;

            // 保理机构
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACCOMLIST,{custNo:custNo},$scope,'factorList').success(function(){
                $scope.info.factorNo=$scope.info.factorNo || '';

                 // 核心企业
                commonService.queryBaseInfoList(BTPATH.QUERY_DIC_CORECUSTLIST,{custNo:custNo},$scope,'coreCustList').success(function(){
                    $scope.info.coreCustNo=$scope.info.coreCustNo || '';
                    // 查询对应的保理产品
                     $scope.searchProList();
                    $scope.searchBusinTypeList();
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


         }); 

        
        setTimeout(function(){
          common.resizeIframeListener();          
        },100)
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });
      });
    }]);
  };
});
