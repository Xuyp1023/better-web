
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('check.setting',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */

      $scope.info = {
        confirmDays:0,
        custName:"",
        interestRate:0.0,
        operator:"",
        taxRate:0.0,
        importTemplate:"",
        dailyTemplate:"",
        monthlyTemplate:"",
        exportTemplate:""
      };

      // 附件名字
      $scope.infoFileList = [{},{},{},{}];
      $scope.attachList = [];

      window.clearNoNum = function(obj) {
       obj.value = obj.value.replace(/[^\d.]/g, "");//清除“数字”和“.”以外的字符
       obj.value = obj.value.replace(/^\./g, "");//验证第一个字符是数字而不是.
       obj.value = obj.value.replace(/\.{2,}/g, ".");//只保留第一个. 清除多余的.
       obj.value = obj.value.replace(".", "$#$").replace(/\./g,"").replace("$#$", ".");
      }

      // 保存方法
      $scope.saveConfig = function(target){ 

        var $target = $(target);

        //设置校验项 | 校验
        validate.validate($('#setting-info'),validOption);
        var valid = validate.validate($('#setting-info'));
        if(!valid) return;

        var tmpInfo = {
          importTemplate:angular.toJson($scope.infoFileList[0]),
          dailyTemplate:angular.toJson($scope.infoFileList[1]),
          monthlyTemplate:angular.toJson($scope.infoFileList[2]),
          exportTemplate:angular.toJson($scope.infoFileList[3]),
          payOrderExportTemplate:angular.toJson($scope.infoFileList[4]),
          payOrderImportTemplate:angular.toJson($scope.infoFileList[5])
          
        };


        http.post(BTPATH.SAVE_CPS_CONFIG_INFO,$.extend({}, $scope.info,tmpInfo))
           .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('保存成功!',{});
                $scope.queryList(true);
                $scope.closeRollModal("upload_box");
              }else{
                tipbar.errorTopTipbar($target,'保存失败,服务器返回:'+data.message,3000,9992);
              }
           });

      };

      //校验配置1
      var validOption = {
           elements: [{
              name: 'info.interestRate',
              rules: [{name: 'required'}],
              events: ['blur']
            }],
            errorPlacement: function(error, element) {
                var label = element.parents('td').prev().text().substr(0);
                tipbar.errorLeftTipbar(element,label+error,0,99999);
            }
      };

      /*  业务处理绑定区域  */
      $scope.queryConfig = function(){
      
        http.post(BTPATH.QUERY_CPS_CONFIG_INFO/*2*/,{})
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info= data.data;/*3*/

                  $scope.infoFileList[0] = angular.fromJson($scope.info.importTemplate);
                  $scope.infoFileList[1] = angular.fromJson($scope.info.dailyTemplate);
                  $scope.infoFileList[2] = angular.fromJson($scope.info.monthlyTemplate);
                  $scope.infoFileList[3] = angular.fromJson($scope.info.exportTemplate);
                  $scope.infoFileList[4] = angular.fromJson($scope.info.payOrderExportTemplate);
                  $scope.infoFileList[5] = angular.fromJson($scope.info.payOrderImportTemplate);

              });
            }
        });
      };

      //上传回调 替换元素
      function callback(list,type,index){
        return function(){
          //如果未上传或上传失败，返回
          // if(ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type).length<=1) return;
          //删除新添加的，并将其值赋给原有的
          var addItem = $scope[list].pop();
          $scope.infoFileList[index] = addItem;
          // $scope[list] = ArrayPlus($scope[list]).replaceChild('fileInfoType',type,addItem);
        };
      }

      //开启上传
        $scope.openUpload = function(event,type,typeName,index){
          $scope.uploadConf = {
            //上传触发元素
            event:event.target||event.srcElement,
            //上传附件类型
            type:type,
            //类型名称
            typeName:typeName,
            //存放上传文件
            uploadList:$scope['attachList'],
            //回调
            callback:callback('attachList',type,index)
          };
        };


        //删除附件项
        $scope.delUploadItem = function(index,listName){
          // $scope[listName] = ArrayPlus($scope[listName]).replaceChild('id',item.id,{'fileInfoType':item.fileInfoType});
          $scope.infoFileList[index] = {};
        };




			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){  // FIND_CUST_BY_PLATFORM
        
				$scope.queryConfig();


				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
