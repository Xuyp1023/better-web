
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){  	
    var flowService = require('./service/supplierFinanceService.js');
      flowService.servPlus(mainApp,common);

    mainApp.controller('contractSignResult',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
      /*  VM绑定区域  */
      

          
      $scope.loanInfo = {};

      //当前任务
      var currentTask = cache.get("currentTask");
      //当前业务信息
      $scope.businessInfo = {
        'requestNo':currentTask.workFlowBusiness.businessId,
        'nodeName':currentTask.workFlowNode.nickname
      };

    

      /*
      * 提供数据至外部
      * @param operType|操作类型    
      */
      $scope.$GET_RESULT = function(target,operType){
        //当审批通过时，才校验
       /* if(operType==='handle'){*/
          //设置校验项|校验
         /* validate.validate($('#approve_handle_issue'),validOption);
          var valid = validate.validate($('#approve_handle_issue'));
          if(!valid) return;
        }*/
        //出具贷款方案
        return $.extend({},$scope.info,{
          requestNo:$scope.businessInfo.requestNo
        });
      };
     


       	
    

    

     

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
            

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
