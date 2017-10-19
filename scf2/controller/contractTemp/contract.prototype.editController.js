
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract.prototype.editController',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */

          //合同类型
          $scope.contractTempTypes = BTDict.ContractTempType.toArray("value","name");

          //获取需要修改的对象
          var info = {};
          //状态启用|禁用
          $scope.templateStatus = BTDict.ContractTemplateStatus.toArray("value","name");
          //文件列表
          $scope.uploadList = [];
          /*  业务处理绑定区域  */
            //开启上传
            $scope.openUpload = function(event,type,typeName,list){
            	$scope.uploadConf = {
            		event:event.target||event.srcElement,
            		type:type,
            		typeName:typeName,
            		uploadList:$scope[list]
            	};
            };

            $scope.goBack = function(){
      				$location.path("/contract.prototype");
      			};


         //增加发货单
    	      $scope.addInfo = function(target){
            //设置校验项 | 校验
      	      validate.validate($('#edit_box'),validOption);
      	      var valid = validate.validate($('#edit_box'));
      	      if(!valid) return;


      	     var $target = $(target);
      	     $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
            /* if(!$scope.info.fileList){
                tipbar.errorTopTipbar($target,'合同模板修改失败请上传附件',3000,9992);
                return false;
             }*/
      	     http.post(BTPATH.SAVE_MODIFY_TEMPLATE,$scope.info).success(function(data){
      	          if(data&&(data.code === 200)){
      	            tipbar.infoTopTipbar('合同模板信息修改成功!',{});
      	             //返回goback  $scope.closeRollModal("add_box");
                     $scope.$apply(function(){
                        $scope.goBack();
                     }); 
      	          }else{
      	            tipbar.errorTopTipbar($target,'合同模板信息修改成失败,服务器返回:'+data.message,3000,9992);
      	          }
      	      });
      	    };

        //校验配置
        var validOption = {
              elements: [{
                  name: 'info.factorNo',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
                  name: 'info.templateType',
                  rules: [{name: 'required'}],
                  events: ['blur']
              },{
              	  name: 'info.templateStatus',
                  rules: [{name: 'required'}],
                  events: ['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };

        //页面初始化
        $scope.initPage = function(){
          commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{'custType':3},$scope,'custList').success(function(){
         //获取需要修改的对象
              var info = cache.get("modify_info");
              $scope.$apply(function(){
                  $scope.info = info ? info :{
                      'factorNo':common.filterArrayFirst($scope.custList),
                      'templateType':common.filterArrayFirst($scope.contractTempTypes),
                      'templateStatus':common.filterArrayFirst($scope.templateStatus)
                  };
              });
          });
        };

       //页面初始化
       $scope.initPage();

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				/*commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'typeList').success(function(){
						$scope.info.agreementTypeId = common.filterArrayFirst($scope.typeList,'id');
				});*/
				/*公共绑定*/
				common.resizeIframeListener();
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

			});
		}]);

	};

});
