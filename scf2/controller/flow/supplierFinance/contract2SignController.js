
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){  	
    var flowService = require('./service/supplierFinanceService.js');
      flowService.servPlus(mainApp,common);

    mainApp.controller('contractSign2Controller',['$scope','http','$rootScope','$route','cache','commonService','$location','flowService',function($scope,http,$rootScope,$route,cache,commonService,$location,flowService){
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
     

     //================================================发送短信验证码 相关 start =============================================

			//签约验证信息
			$scope.identifyInfo = {
				//是否允许发送验证码
				canSend:true,
				//读秒提示信息
				timerMsg:"",
				//输入的验证码
				verifyCode:""
			};

			//验证码倒计时
			var timer;
			$scope.countDown = function(){
				var count = 30;
				$scope.$apply(function(){
					$scope.identifyInfo.canSend = false;
				});
				common.resizeIframeListener();
				//倒计时 读秒
			    timer = setInterval(function(){
				    $scope.$apply(function(){
				    	if(count === 0){
				    		$scope.identifyInfo.canSend = true;
				    		clearInterval(timer);
				    	}else{
			    			count-- ;
			    			$scope.identifyInfo.timerMsg = count + "秒后可重新发送";
				    	}
				    });
			    },1000);
			};

			//清除验证码计时器
			function _clearTimer(){
				clearInterval(timer);
				$scope.identifyInfo = {
					canSend:true,
					timerMsg:"",
					verifyCode:""
				};
				$scope.identifyInfo.canSend = true;
				$scope.identifyInfo.timerMsg = "";
			}

			//向客户发送验证码
			$scope.sendIdentifyCode = function(){
				// agreeType  0|1|2  转让通知书|转让确认书|三方协议
				var param={
					/*requestNo:$scope.financeInfo.requestNo,
					agreeType:0  //转让通知书*/
				};
				http.post(BTPATH.FIND_VALIDCODE_BY_REQUESTNO,param).success(function(data){
				    if( data && data.code === 200){
						//倒计时读秒
						$scope.countDown();
					}
				});
			};
			//================================================发送短信验证码 相关 end =============================================
       $scope.rejectIt=function(){
       		common.popModal('rejectSign')
       			.show({},function(){
	       			console.log('你点击了确认按钮');
	       		},function(){
	       			console.log('你点击了取消按钮');
	       		})
       }
       	
    
    // 轮播图文件切换
    $('.carousel-thumb>li').click(function(e){
          $(this).addClass('active').siblings().removeClass('active');
      })

    

     

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
