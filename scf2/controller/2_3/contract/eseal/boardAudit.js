
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.esealBoardAudit',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.auditStatusList = BTDict.ContractTemplateAuditStatus.toArray('value','name');
      $scope.custList = [];

      $scope.infoList = [];

      $scope.info = {
        selectInfo:{}
      };

      $scope.auditInfo = {
        custNo:null,
        templateId:null,
        auditStatus:null,
        auditRemark:null
      };

			$scope.searchData = {
				GTEmakeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEmakeDate:new Date().format('YYYY-MM-DD'),
				custNo:'',
				templateAuditStatus:''
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
  			http.post(BTPATH.QUERY_CONTRACT_TEMPLATE_AUDIT_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

    //查看签章位置
    $scope.lookKeyWord = function(){
      $scope.openRollModal('keywordDetail_box');
    };
    //查看详情
    $scope.lookDetail = function(item){
      $scope.queryLog(item.id);
      http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: item.id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info.selectInfo = data.data;
                $scope.queryLog(data.data.id);
                $scope.info.stampPlaces = $scope.info.selectInfo.stampPlaces;
                $scope.openRollModal('detail_box');             
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
              $scope.info.selectInfo = data.data;
              $scope.queryLog(data.data.id);
              $scope.openRollModal('auditDetail_box');          
            });
          } else {

          }
      });
      
    };

    $scope.templateLog = [];
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

      $scope.auditInfo.custNo = $scope.info.selectInfo.custNo;
      $scope.auditInfo.templateId = $scope.info.selectInfo.id;

      http.post(BTPATH.SAVE_AUDIT_CONTRACT_TEMPLATE, $scope.auditInfo)
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('合同模板审核成功!',{});
            $scope.queryList(true);
            $scope.closeRollModal("auditDetail_box");
          }else{
            tipbar.errorTopTipbar($target,'合同模板审核失败,服务器返回:'+data.message,3000,9992);
          }
      });
    };

     //下载合同相关文件
      $scope.downloadSel=function(){  
          addIds=[$scope.info.selectInfo.originSimpleId,$scope.info.selectInfo.originTemplateId];
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=标准合同文本样例";
          window.location.href=$scope.downListUrl;
       }

      //下载电子合同模板文件
      $scope.downloadTemplate=function(){  
          addIds=[$scope.info.selectInfo.templateId];
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=电子合同模板";
          window.location.href=$scope.downListUrl;
       }

      


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
			 commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
          $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
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
