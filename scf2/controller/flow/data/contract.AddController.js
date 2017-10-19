/*
/*
新增合同
@author binhg
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract.AddController',['$scope','http','$rootScope','$route','cache','commonService','upload','$window',function($scope,http,$rootScope,$route,cache,commonService,upload,$window){

      /**
      *绑定初始化工具与数据
      **/
      upload.regUpload($scope);

      /*  VM数据绑定  */
      $scope.addContraInfo = {
        agreeStartDate : new Date().format('YYYY-MM-DD'),
        agreeEndDate : new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
        deliveryDate : new Date().format('YYYY-MM-DD'),

      };
      //附件列表
      $scope.addContraUploadList = [];
      //机构可选列表
      $scope.custList = [];
      //授信核心企业
      $scope.coreCustList = [];
      //来源信息
      $scope.origin_info = {
        id:'',
        type:''
      };

      //新增合同
    $scope.addContract = function(target){
      $target=$(event.target);
      validate.validate($('#addContract_form'),validOption);
      var result = validate.validate($('#addContract_form'));
      if (!result) {
        tipbar.errorTopTipbar($target,'您还有信息项没有正确填写!',3000,99999);
        return;
      }
      common.cleanPageTip();
      $scope.addContraInfo.agreeId = $scope.addContraInfo.id;
      $scope.addContraInfo.fileList = ArrayPlus($scope.addContraUploadList).extractChildArray('id',true);
      $scope.addContraInfo.isDeleted = "2";
      $.post(BTPATH.ADD_CONTRACT,$scope.addContraInfo,function(data){
        if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
          // 成功后再添加关系
          $scope.addContraInfo=data.data;
          $scope.linkChildInfoList(target);

        }else{
          tipbar.errorTopTipbar($(target),'新增失败，服务端返回信息:'+data.message,3000,99999);
        }
      },'json');
    };

    //添加子信息相关列表项
    $scope.linkChildInfoList = function(target){
        $target = $(target);
      http.post(BTPATH.ADD_LINK_CHILDINFO,{
        infoIdList:$scope.addContraInfo.id,
        enterId:$scope.origin_info.id,
        infoType:'0',
        enterType:$scope.origin_info.type
      }).success(function(data){
        if(common.isCurrentData(data)){
          var role = $scope.origin_info.role + 'Finance';
          $window.location.href = "flow.html#/flow/" + role + "/issuePlan";
        }else{
          tipbar.errorTopTipbar($target,'添加关系失败,服务器返回:'+data.message,3000,6664);
        }
      });
    };

      //删除合同附件表格
      $scope.delAddUpload = function(item){
        $scope.addContraUploadList = ArrayPlus($scope.addContraUploadList).delChild('id',item.id);
      };

      //返回
      $scope.goBack = function(){
          var role = $scope.origin_info.role + 'Finance';
          $window.location.href = "flow.html#/flow/" + role + "/issuePlan";
      };



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				common.resizeIframeListener();
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

        //获取所需数据
        $scope.origin_info = cache.get('add_action_info');
        $scope.addContraInfo = $scope.origin_info.proof_info;
        $scope.origin_info.id=$scope.addContraInfo.id;
        if($scope.addContraInfo.type=='draft'){ // 汇票
          $scope.origin_info.type="3";
        }else if($scope.addContraInfo.type=='order'){ //  订单
          $scope.origin_info.type="5";
        }else if($scope.addContraInfo.type=='recieve'){ // 应收账款
          $scope.origin_info.type="4";
        }

        $scope.addContraInfo.agreeNo="";
        $scope.addContraInfo.balance="";
        $scope.addContraInfo.bankName=$scope.addContraInfo.suppBankName;
        $scope.addContraInfo.bankAccountName=$scope.addContraInfo.supplier;
        $scope.addContraInfo.bankAccount=$scope.addContraInfo.suppBankAccount;
        $scope.addContraInfo.agreeStartDate=new Date().format('YYYY-MM-DD');
        $scope.addContraInfo.agreeEndDate=new Date().getSubDate('MM',-3).format('YYYY-MM-DD');
        $scope.addContraInfo.deliveryDate=new Date().format('YYYY-MM-DD');
      });




      //====================================================校验配置 start ======================================================== 

      //校验配置(出具贷款方案)
      var validOption = {
          elements: [{
              name: 'addContraInfo.objectionPeriod',
              rules: [{
                  name: 'int'
              }],
              events: ['blur']
          },{
              name: 'addContraInfo.bankAccount',
              rules: [{
                  name: 'number'
              }],
              events: ['blur']
          },{
              name: 'addContraInfo.balance',
              rules: [{
                  name: 'money'
              }],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              if(element.attr('name')!== 'balance'){
                  tipbar.tdTipbar(element,label+error,0,99999);
              }else{
                  tipbar.tdTipbar(element,label+error,3000,99999);
              }
          }
      };

      //====================================================校验配置 end ======================================================== 

		}]);

	};

});
