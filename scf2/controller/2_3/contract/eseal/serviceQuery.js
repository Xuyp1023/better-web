
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.esealServiceQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.regTypeList = BTDict.ContractCorpAccountRegType.toArray('value','name');

      $scope.operatorList = [];

      $scope.custList = [];
      $scope.infoList = [];

      $scope.serviceCustList = [];

      

      $scope.signerInfo = {
        serviceCustNo:null,
        operId:null,
        mobileNo:'',
        identNo:''
      };

      $scope.corpInfo = {
        serviceCustNo:null,
        type:$scope.regTypeList['value'],
        name:'',
        identNo:''
      };

      $scope.corpAccountList = [];

			$scope.searchData = {
				anCustNo:''
			};

      //分页数据
  		$scope.corpAccountListPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      // 公司设置的分页
      $scope.listPage1 = {
        pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
      };
      $scope.queryList1 = function (flag) {
        
      };
      // 公司详情的分页
      $scope.listPage2 = {
        pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
      };
      $scope.queryList2 = function (flag) {
        
      };
      // 个人详情的分页
      $scope.listPage3 = {
        pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
      };
      $scope.queryList3 = function (flag) {
        
      };

      $scope.signerAccountList = [];
 
      //分页数据
      $scope.signerAccountListPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };

      // 公司注册
      $scope.registCorpAccount = function(target) {


			if (!$scope.corpInfo.name || !$scope.corpInfo.identNo || !$scope.corpInfo.orgCode || !$scope.corpInfo.mobileNo)  {
				tipbar.errorTopTipbar($(target),'您还有信息项没有正确填写!',3000,99999);
				return;
			}
			
			$.post(BTPATH.SAVE_REGIST_CORP_CONTRACT_ACCOUNT,$.extend({},$scope.corpInfo),function(data){
				if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					//成功后刷新
					$scope.$apply(function(){
						tipbar.pop('success','注册企业账户','注册成功');
            $scope.closeRollModal('companyRegister_box');
            $scope.infoList.push(data.data);
					});
				}else{
					tipbar.errorTopTipbar($(target),'注册失败，服务端返回信息:'+data.message,3000,99999);
				}
			},'json');	
			

      };

      // 签署人注册
      $scope.registSignerAccount = function(target) {
          // SAVE_REGIST_SIGNER_CONTRACT_ACCOUNT

      };
      
      $scope.checkCorpAccount = function() {
          // CHECK_CORP_CONTRACT_ACCOUNT    顺便把公司信息取回来

      };

      $scope.checkSignerAccount = function() {
          // CHECK_SIGNER_CONTRACT_ACCOUNT  顺便把操作员给取回来

      };

      $scope.findCorpInfo = function() {
          // FIND_CORP_INFO_CONTRACT_ACCOUNT

      };

      $scope.findOperInfo = function() {
          // FIND_OPER_INFO_CONTRACT_ACCOUNT

      };

      $scope.queryList = function() {
        $scope.queryCorpAccountList(true);
        $scope.querySignerAccountList(true);
      };

      /*  业务处理绑定区域  */   // QUERY_SIGNER_CONTRACT_ACCOUNT_LIST     QUERY_CORP_CONTRACT_ACCOUNT_LIST
      $scope.queryCorpAccountList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.corpAccountList.flag = flag? 1 : 2;/*1*/
  			http.post(BTPATH.QUERY_SIGNER_CONTRACT_ACCOUNT_LIST/*2*/,$.extend({},$scope.corpAccountListPage,$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.corpAccountList = common.cloneArrayDeep(data.data);/*3*/
  							if(flag/*1*/){
  								$scope.corpAccountListPage = data.page;/*4*/
  							}
  						});
  					}
  			 });
        
  		};

            /*  业务处理绑定区域  */   // QUERY_SIGNER_CONTRACT_ACCOUNT_LIST     QUERY_CORP_CONTRACT_ACCOUNT_LIST
      $scope.querySignerAccountList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.corpAccountListPage.flag = flag? 1 : 2;/*1*/

        http.post(BTPATH.QUERY_CORP_CONTRACT_ACCOUNT_LIST/*2*/,$.extend({},$scope.corpAccountListPage,$scope.searchData))
          .success(function(data){
            //关闭加载状态弹幕
            //loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.corpAccountListPage = data.page;/*4*/
                }
              });
            }
          });
      };

      $scope.lookPersonDetail = function(){
        $scope.openRollModal('personDetail_box');
      };
      $scope.personRegister = function(){
        $scope.corpInfo.serviceCustNo =  $scope.serviceCustList[0] ? $scope.serviceCustList[0].value : '';
        $scope.openRollModal('personRegister_box');
      };

      $scope.companyRegister = function(){	
        $scope.corpInfo.serviceCustNo =  $scope.serviceCustList[0] ? $scope.serviceCustList[0].value : '';
        $scope.corpInfo.type = $scope.regTypeList[0] ? $scope.regTypeList[0].value : '';
        $scope.corpInfo.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
        $scope.corpInfo.identType = '0';
        $scope.corpInfo.idType = '1';        
        $scope.corpInfo.name = '';
        $scope.corpInfo.identNo = '';
        $scope.corpInfo.orgCode = '';
        $scope.corpInfo.mobileNo = '';
        $scope.corpInfo.orgRegType = '0';

        $scope.openRollModal('companyRegister_box');
      };

      $scope.comSet = function(){
        $scope.openRollModal('companySet_box');
      };

      //启用新类型
      $scope.lookComDetail = function(){
        $scope.openRollModal('companyDetail_box');
      }


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
          commonService.queryBaseInfoList(BTPATH.QUERY_SELECT_OPERATOR,{},$scope,'operatorList').success(function(){
            commonService.queryBaseInfoList(BTPATH.FIND_ELECAGREEMENT_SERVICECUST,{},$scope,'serviceCustList').success(function(){
              $scope.searchData.anCustNo = $scope.custList[0] ? $scope.custList[0].value : '';
              $scope.queryList(true);
            });
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
