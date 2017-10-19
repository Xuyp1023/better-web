
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.standardTextAudit',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.auditStatusList = BTDict.ContractTemplateAuditStatus.toArray('value','name');

      $scope.factorCustList = [];

      $scope.infoList = [];

      $scope.infoDetail={};

      $scope.auditInfo = {
        templateId:null,
        auditStatus:null,
        auditRemark:null
      };

      $scope.searchData = {
        GTEoriginDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEoriginDate:new Date().format('YYYY-MM-DD'),
        textAuditStatus:'',
        custNo:''
      };

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};


      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CONTRACT_AUDIT_TEXT_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

    $scope.templateLogList = [];
    $scope.queryLog = function(templateId) {
       http.post(BTPATH.QUERY_CONTRACT_TEMPLATE_LOG_LIST/*2*/,{templateId: templateId}).success(function(data){
        if(common.isCurrentData(data)){
          $scope.$apply(function(){
            $scope.templateLogList = data.data;
          });
        }
      });
    };

      $scope.submitAudit = function(target) {
        var $target = $(target);
        http.post(BTPATH.SAVE_AUDIT_CONTRACT_TEXT,$scope.auditInfo)
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('标准合同文本审核成功!',{});
              $scope.queryList(true);
              $scope.closeRollModal("audit_box");
            }else{
              tipbar.errorTopTipbar($target,'标准合同文本审核失败,服务器返回:'+data.message,3000,9992);
            }
           });
      };

      //查看详情
    $scope.lookDetail = function(item){
       http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: item.id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoDetail = data.data;
      
                $scope.queryLog(data.data.id);
                
                $scope.openRollModal('auditDetail_box');             
              });
            } else {

            }
        });
    };

     //审核
    $scope.auditDetail = function(item){
      http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: item.id}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.auditInfo.templateId = item.id;
              $scope.infoDetail = data.data;
              $scope.openRollModal('audit_box');          
            });
          } else {

          }
      });
      
    };


      // 下载合同相关文件
      $scope.downloadSel=function(){  
          addIds=[$scope.infoDetail.originSimpleId,$scope.infoDetail.originTemplateId];
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=标准合同文本与样例";
          window.location.href=$scope.downListUrl;
       }


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
        // 
        commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:'3'},$scope,'factorCustList').success(function(){
          $scope.queryList(true);
        });

				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
