
define(function(require,exports,module){

  //require.require.async(['BTDictData']);
	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('assetmanage.invoiceregister',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };


			$scope.statusList = BTDict.FactorCoreCustInfo.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      //票据流通
      $scope.modeType = BTDict.BillFlowMode.toArray('value','name');
      //票据类型
      $scope.typeList = BTDict.BillNoteType .toArray('value','name');
      
      $scope.queryCustList = [];
       //发货单列表
         $scope.infoList = [{},{}];
       //单个发货单信息
         $scope.info = {};
         $scope.loanInfo ={
         coreCustNo:"",
         supplierNo:"",
         invoiceDate:new Date().format('YYYY-MM-DD'),
         endDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
         billType:common.filterArrayFirst($scope.typeList),
         billMode:common.filterArrayFirst($scope.modeType),
         supplier:"",
         buyer:"",
         };

          $scope.editInfo ={
         coreCustNo:"",
         refNo:"",
         supplierNo:"",
         invoiceDate:new Date().format('YYYY-MM-DD'),
         endDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
         billType:common.filterArrayFirst($scope.typeList),
         billMode:common.filterArrayFirst($scope.modeType),
         supplier:"",
         buyer:"",
         };

         $scope.infoDetail={

         coreCustNo:"",
         supplierNo:"",
         invoiceDate:new Date().format('YYYY-MM-DD'),
         endDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
         billType:common.filterArrayFirst($scope.typeList),
         billMode:common.filterArrayFirst($scope.modeType),
         supplier:"",
         buyer:"",
         businStatus:"",
         docStatus:"",
         lockedStatus:"",




         };
       //时间查询
        $scope.searchData = {
         // supplierNo:$scope.supplierNo[0].value,
          LIKEbillNo:'',
          GTEinvoiceDate:'',
          LTEinvoiceDate:'',
          GTEendDate:'',
          LTEendDate:''
        };
      //添加票据
      $scope.addInfoBox = function(){

        $scope.loanInfo = {};
        $scope.loanInfo.coreCustNo = common.filterArrayFirst($scope.coreCustList);
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.loanInfo.coreCustNo},$scope,'custList','CustListDic').success(function(){
            
            $scope.$apply(function(){
              $scope.loanInfo.coreCustNo = common.filterArrayFirst($scope.coreCustList);
              $scope.loanInfo.supplierNo = common.filterArrayFirst($scope.custList);
              $scope.loanInfo.invoiceDate = new Date().format('YYYY-MM-DD'),
              $scope.loanInfo.endDate = new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
              $scope.loanInfo.billType = common.filterArrayFirst($scope.typeList),
              $scope.loanInfo.billMode = common.filterArrayFirst($scope.modeType),
              $scope.loanInfo.supplier=BTDict.CustListDic.get(common.filterArrayFirst($scope.custList));
              $scope.loanInfo.buyer=BTDict.CoreCustListDic.get($scope.loanInfo.coreCustNo);
              $scope.loanInfo.invoicer=BTDict.CoreCustListDic.get($scope.loanInfo.coreCustNo);
              });
            $scope.openRollModal('add_box');
          });
      }


        //汇票登记
    $scope.addInfoFun = function(target,flag){


      //--------------校验
      


      //-------------------
      var $target = $(target);

      validate.validate($('#add_box'),validOption);
      var valid = validate.validate($('#add_box'));
      if(!valid) return;
      
      //$scope.loanInfo.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);
        $scope.loanInfo.confirmFlag=flag;
       

      // $scope.info.custNo =
      http.post(BTPATH.ADD_INFO_DRAFT_V2,$scope.loanInfo)
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('汇票登记成功!',{});
            $scope.closeRollModal('add_box');
            $scope.queryList(true);
          }else{
            tipbar.errorTopTipbar($target,'汇票登记失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };

      //编辑票据
          $scope.editInfoBox = function(data){
          $scope.loanInfo = data;
           $scope.loanInfo.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.loanInfo.coreCustNo},$scope,'custList','CustListDic').success(function(){
                    
                   /* $scope.$apply(function(){
                      $scope.loanInfo.coreCustNo = data;
                      $scope.loanInfo.supplierNo = common.filterArrayFirst($scope.custList);
                      $scope.loanInfo.supplier=BTDict.CustListDic.get(common.filterArrayFirst($scope.custList));
                      $scope.loanInfo.buyer=BTDict.CoreCustListDic.get($scope.loanInfo.coreCustNo);
                       $scope.loanInfo.invoiceDate= data.invoiceDate;
                      });*/
                       $scope.openRollModal('edit_box');

                  });
              //查询附件列表
              //   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'uploadList');
               };


          //票据作废显示
          $scope.delInfo = function(target,data){

              showDetail(data,'delMode');

               $scope.openRollModal('delete_box');
            }


          function showDetail(data,moditype){

            
              $scope.infoDetail = $.extend({},data,{modiType:moditype});
               
              var businStatus=$scope.infoDetail.businStatus;
              var docStatus=$scope.infoDetail.docStatus;
              var lockedStatus=$scope.infoDetail.lockedStatus;
              //0 未核准 1：核准  2：已使用 3：转让 4废止 5 过期
              if(businStatus=='0'){
                $scope.infoDetail.busin='未生效';
                $scope.infoDetail.use='未使用';
              }
              if(businStatus=='1'){
                $scope.infoDetail.busin='已生效';
                $scope.infoDetail.use='未使用';
              }
              if(businStatus=='3'){
                $scope.infoDetail.busin='已转让';
                $scope.infoDetail.use='不可用';
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
                $scope.infoDetail.use='已使用';
              }
              if(businStatus=='2' && lockedStatus=='0'){
                $scope.infoDetail.busin='已生效';
                $scope.infoDetail.use='未使用';
              }

              var invoiceDateArray=new Array();
              var invoiceDate=$scope.infoDetail.invoiceDate;
              $scope.infoDetail.invoiceDateArray=invoiceDate.split('-');
              var ednDateArray=new Array();
              var endDate=$scope.infoDetail.endDate;
              $scope.infoDetail.ednDateArray=endDate.split('-');

          }

            //打开详情
            $scope.detailsBox = function(data){

              showDetail(data,'read');

              $scope.openRollModal('details_box');
            }


           //编辑发货单
          $scope.editInfot = function(target,flag){

          //设置校验项 | 校验
              validate.validate($('#edit_box'),validOption);
              var valid = validate.validate($('#edit_box'));
              if(!valid) return;

              var $target = $(target);
              $scope.loanInfo.confirmFlag=flag;

             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.EDIT_BILL_DETAIL,$scope.loanInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('票据信息修改成功!',{});
                    $scope.closeRollModal('edit_box');
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'票据信息修改失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
            };



            //废止汇票信息
            $scope.annulBillInfo = function(target,refNo,version){
              var $target = $(target);
              http.post(BTPATH.ANNUL_BILL_INFO_DRAFTANDCONFIR,{refNo:refNo,version:version})
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('汇票废止成功!',{});
                    $scope.closeRollModal('delete_box');
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'汇票审核失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
            };

           $scope.custnList = function(){
            var myselect=document.getElementById("test");
            var index=myselect.selectedIndex ; // selectedIndex代表选中项的index
               $scope.loanInfo.buyer = myselect.options[index].text;
               $scope.loanInfo.invoicer = myselect.options[index].text;
           }
             $scope.custnLists = function(){
            var mytoselect=document.getElementById("teat");
            var index=mytoselect.selectedIndex ; // selectedIndex代表选中项的index
               $scope.loanInfo.supplier = mytoselect.options[index].text;
           }
              $scope.custnLista = function(){
            var mytoselect=document.getElementById("tetx");
            var index=mytoselect.selectedIndex ; // selectedIndex代表选中项的index
              
               $scope.loanInfo.supplier = mytoselect.options[index].text;
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
            $scope.searchData.isAudit = false;
            http.post(BTPATH.QUERY_BILL_LIST,$.extend({},$scope.listPage,$scope.searchData))
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
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
          $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'receiver').success(function(){
          $scope.searchData.supplierNo = common.filterArrayFirst($scope.receiver);
          $scope.searchData.supplierNo = $scope.searchData.supplierNo.length>0?$scope.searchData.supplierNo[0].value:'';
          $scope.queryList(true);

          });
      });
    };



         /*数据初始区域*/
         $scope.initPage();



        //校验配置
         var validOption = {
          elements: [{
              name: 'loanInfo.coreCustNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.supplierNo',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.buyer',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.supplier',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.buyerBankAccount',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.suppBankAccount',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.buyerBankName',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.suppBankName',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.invoiceDate',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.endDate',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'loanInfo.billNo',
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
				
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
