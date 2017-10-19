
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('assetmanage.recycle',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
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
      $scope.infoList = [];
      $scope.info = {};

      $scope.searchData = {
          GTEinvoiceDate:'',
          LTEinvoiceDate:'',
          GTEendDate:'',
          LTEendDate:'',
        LIKEbillNo:"",
        coreCustNo:"",
        supplierNo:""
      };

       $scope.infoDetail={

         coreCustNo:"",
         supplierNo:"",
         invoiceDate:new Date().format('YYYY-MM-DD'),
         endDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
         billType:"",
         billMode:"",
         supplier:"",
         buyer:"",
         businStatus:"",
         docStatus:"",
         lockedStatus:"",




         };




      //票据作废
      $scope.delInfo = function(data){

          showDetail(data,'read');
         $scope.openRollModal('delete_box');
      }

       //废止汇票信息
            $scope.annulBillInfo = function(target,refNo,version){
              var $target = $(target);
              http.post(BTPATH.SAVE_ANNUL_EFFECTIVEBILL_INFO,{refNo:refNo,version:version})
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('汇票废止成功!',{});
                    $scope.closeRollModal('delete_box');
                    $scope.searchList();
                  }else{
                    tipbar.errorTopTipbar($target,'汇票审核失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
            };

      //打开详情
      $scope.detailsBox = function(data){
        showDetail(data,'read');

        $scope.openRollModal('details_box');
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

      //页面初始化
          $scope.initPage = function(){
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
          $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'receiver').success(function(){
          $scope.searchData.supplierNo = common.filterArrayFirst($scope.receiver);
           $scope.searchData.supplierNo = $scope.searchData.supplierNo.length>0?$scope.searchData.supplierNo[0].value:'';
          $scope.searchList();

          });
      });
    };


  $scope.queryList = function(flag){
            //弹出弹幕加载状态
            var $mainTable = $('#search_info .main-list');
            loading.addLoading($mainTable,common.getRootPath());
            $scope.listPage.flag = flag? 1 : 2;
            $scope.searchData.isOnlyNormal = 0;
            $scope.searchData.isAudit = true;
            http.post(BTPATH.QUERY_CANANNUL_BILL_INFO_LIST,$.extend({},$scope.listPage,$scope.searchData))
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

//查询按钮
    $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

          /*数据初始区域*/
         $scope.initPage();

			});
		}]);

	};

});
