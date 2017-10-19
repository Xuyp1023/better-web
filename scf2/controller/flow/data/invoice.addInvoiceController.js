/*
/*
新增发票
@author binhg
*/
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('invoice.addInvoiceController',['$scope','http','$rootScope','$route','cache','commonService','upload','$window',function($scope,http,$rootScope,$route,cache,commonService,upload,$window){

      /**
      *绑定初始化工具与数据
      **/
      upload.regUpload($scope);

      /*  VM数据绑定  */
      $scope.addInvoiceInfo = {};
      //附件列表
      $scope.addInvoiceUploadList = [];
			//附带明细信息列表
			$scope.addInvoiceMoreList = [];
			//单个明细信息
			$scope.addInvoiceMoreInfo = {};
      //来源信息
      $scope.origin_info = {};
      $scope.corpVocateType = BTDict.InvestCorpVocate.toArray('value','name');

      /**
      *事件处理绑定区域
      **/
      //提交所需新增发票
      $scope.addInfo = function(target){
        var $target = $(target);
        //获取校验结果
        validate.validate($('#addInvoicect_form'),validOption_addInvoiceInfo);
        var result = validate.validate($('#addInvoicect_form'));
        if (!result) {
          tipbar.errorTipbar($target,'还有可填写项未正确填写!',3000,100);
          return;
        }
        //组装附件ID
        $scope.addInvoiceInfo.fileList = ArrayPlus($scope.addInvoiceUploadList).extractChildArray('id',true);
				//组装附加信息List,仿照上方编写
        $scope.addInvoiceInfo.invoiceItemIds = ArrayPlus($scope.addInvoiceMoreList).extractChildArray('id',true);
        $scope.addInvoiceInfo.isDeleted = "2";

        http.post(BTPATH.ADD_INFO_INVOICE,$scope.addInvoiceInfo).success(function(data){
          if(data&&(data.code === 200)){
              // 成功后再添加关系
              $scope.addInvoiceInfo=data.data;
              $scope.linkChildInfoList(target);
          }else{
            tipbar.errorTopTipbar($target,'新增发票失败,服务器返回:'+data.message,3000,100);
          }
        });
      };

       //添加子信息相关列表项
    $scope.linkChildInfoList = function(target){
        $target = $(target);
      http.post(BTPATH.ADD_LINK_CHILDINFO,{
        infoIdList:$scope.addInvoiceInfo.id,
        enterId:$scope.origin_info.id,
        infoType:'1',
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

      //删除发票附件表格
      $scope.delAddUpload = function(item){
        $scope.addInvoiceUploadList = ArrayPlus($scope.addInvoiceUploadList).delChild('id',item.id);
      };

			//新增发票详情
			$scope.addInfoMore = function(target){
				var $target = $(target);
				//设置校验项 | 校验
        validate.validate($('#addInvoice_form_more'),validOption_addInvoiceMore);
        var valid = validate.validate($('#addInvoice_form_more'));
        if(!valid) return tipbar.errorLeftTipbar($target,'还有未正确填写项，请修改后提交！',3000,9999);

				http.post(BTPATH.ADD_ONE_INVOICE_MORE,$scope.addInvoiceMoreInfo).success(function(data){
					 	if(common.isCurrentResponse(data)){
					 		$scope.$apply(function(){
					 			$scope.addInvoiceMoreList.push(data.data);
					 		});
					 		tipbar.infoTopTipbar('新增发票详情成功!',{});
					 		$scope.closeRollModal('infoMore_box');
					 	}else{
					 		tipbar.errorTopTipbar($target,'新增发票详情失败,服务器返回:'+data.message,3000,7050);
					 	}
					 });
			};

			//添加发票详情模板开启
			$scope.infoMoreImBox = function(){
        $scope.addInvoiceInfo.corpVocate=common.filterArrayFirst($scope.corpVocateType, 'name');
				$scope.openRollModal('infoMore_box');
			};

			//本地删除发票详情
			$scope.delinfoMore = function(item){
				$scope.addInvoiceMoreList = ArrayPlus($scope.addInvoiceMoreList).delChild('id',item.id);
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

        //获取所需数据
        $scope.origin_info = cache.get('add_action_info');
        $scope.addInvoiceInfo = $scope.origin_info.proof_info;
        $scope.addInvoiceInfo.balance="";
        $scope.addInvoiceInfo.description="";
        $scope.addInvoiceInfo.invoiceDate=new Date().format('YYYY-MM-DD');
        $scope.addInvoiceInfo.corpVocate = common.filterArrayFirst($scope.corpVocateType,'name');

        $scope.origin_info.id=$scope.addInvoiceInfo.id;
        if($scope.addInvoiceInfo.type=='draft'){ // 汇票
          $scope.origin_info.type="3";
        }else if($scope.addInvoiceInfo.type=='order'){ //  订单
          $scope.origin_info.type="5";
        }else if($scope.addInvoiceInfo.type=='recieve'){ // 应收账款
          $scope.origin_info.type="4";
        }
			});





        /*表单验证*/
        var validOption_addInvoiceInfo = {
              elements: [{
                  name: 'addInvoiceInfo.custNo',
                  rules: [ {name: 'required'}],
                  events: ['blur']
              },{
                  name: 'addInvoiceInfo.invoiceNo',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'addInvoiceInfo.invoiceCode',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'addInvoiceInfo.invoiceDate',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'addInvoiceInfo.balance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              },{
                  name: 'addInvoiceInfo.drawer',
                  rules: [{name: 'required'}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.tdTipbar(element,label+error,0,99999);
              }
        };

        //验证附加信息详情
        var validOption_addInvoiceMore =  {
              elements: [{
                  name: 'addInvoiceMoreInfo.subject',
                  rules: [ {name: 'required'}],
                  events: ['blur']
              },{
                  name: 'addInvoiceMoreInfo.balance',
                  rules: [{name: 'required'},{name: 'money'}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };



		}]);

	};

});
