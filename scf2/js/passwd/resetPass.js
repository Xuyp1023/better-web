/*
	融资录单
	@anthor : herb
*/

define(function(require, module, exports) {

    require.async(['dicTool', 'bootstrap', "datePicker"], function() {
        require.async(['BTDictData'], function() {
            var validate = require("validate");
            var tipbar = require("tooltip");
            var common = require("common");
            var loading = require("loading");
            var comdirect = require("direct");
            var comfilter = require("filter");
            var comservice = require("service_s2");
            var BTPATH = require("path_s2");
            var pages = require("pages");
            var date = require("date");
            require('modal');


            //定义模块
            var mainApp = angular.module('mainApp', ['pagination', 'date', 'modal']);

            //扩充公共指令库/过滤器/服务
            comdirect.direcPlus(mainApp);
            comfilter.filterPlus(mainApp);
            comservice.servPlus(mainApp);


            //控制器区域
            mainApp.controller('orderEntry', ['$scope', 'http', 'commonService', 'detailShow', function($scope, http, commonService, detailShow) {

                /*基础数据*/
                var hash = location.href.split('#')[1];
                //交易密码|登录密码
                $scope.isTradePwd = hash === "trade" ? true : false;

                //步骤列表
                $scope.boxArr = ["valid", "reset", "success"];
                //当前步骤
                $scope.currStep = 0;

                $scope.info = {};


                //-------------------------------发送短信验证码 相关 start --------------------------

                //签约验证信息
                $scope.identifyInfo = {
                    //是否允许发送验证码
                    canSend: "true",
                    //读秒提示信息
                    timerMsg: "",
                    //输入的验证码
                    verifyCode: ""
                };

                //验证码倒计时
                var timer;
                $scope.countDown = function() {
                    var count = 60;
                    $scope.$apply(function() {
                        $scope.identifyInfo.canSend = false;
                    });
                    common.resizeIframeListener();
                    //倒计时 读秒
                    timer = setInterval(function() {
                        if (count === 0) {
                            $scope.$apply(function() {
                                $scope.identifyInfo.canSend = true;
                            });
                            clearInterval(timer);
                        } else {
                            $scope.$apply(function() {
                                count--;
                                $scope.identifyInfo.timerMsg = count + "秒后可重新发送";
                            });
                        }
                    }, 1000);
                };

                //清除验证码计时器
                function _clearTimer() {
                    clearInterval(timer);
                    $scope.identifyInfo.canSend = true;
                    $scope.identifyInfo.timerMsg = "";
                }

                //向客户发送验证码
                $scope.sendIdentifyCode = function() {
                    http.post(BTPATH.SEND_VERIFY_CODE_TRADE_PASS, {}).success(function(data) {
                        if (data && data.code === 200) {
                            //倒计时读秒
                            $scope.countDown();
                        }
                    });
                };
                //-------------------------------发送短信验证码 相关 end --------------------------



                //-----------------------操作---------------------------

                //下一步
                $scope.nextStep = function(target) {
                    var $target = $(target);
                    http.post(BTPATH.CHECK_VERIFY_CODE_TRADE_PASS, {
                        verifyCode: $scope.identifyInfo.verifyCode
                    }).success(function(data) {
                        if(data && data.code === 200){
                            if ($scope.currStep === 2) return;
                            $scope.$apply(function(){
                              $scope.currStep = 1;
                            });
                        } 
                        else{
                            tipbar.errorTopTipbar($target, '验证码验证失败,服务器返回:' + data.message, 3000, 9992);
                        }
                    });
                };

                $scope.resetTradePass = function(target) {
                    var $target = $(target);
                    http.post(BTPATH.SAVE_MODIFY_TRADE_PWD, $.extend({}, $scope.info)).success(function(data) {
                        if(common.isCurrentData(data)){
                          $scope.$apply(function(){
                              $scope.currStep = 2;
                          });
                        } 
                        else{
                            tipbar.errorTopTipbar($target, '修改交易密码失败,服务器返回:' + data.message, 3000, 9992);
                        }
                    });
                };


                //页面初始化
                commonService.initPage(function() {
                    //为部分默认隐藏元素添加 hide,防止页面闪烁
                    $(".bt-hide").removeClass("hide bt-hide");
                });


                //校验配置
                /*var validOption = {
                      elements: [{
                          name: 'financeInfo.custNo',
                          rules: [{name: 'required'}],
                          events:['blur']
                      },{
                          name: 'financeInfo.balance',
                          rules: [{name: 'required'},{name: 'money'}],
                          events:['blur']
                      },{
                          name: 'financeInfo.period',
                          rules: [{name: 'required'},{name: 'int'}],
                          events:['blur']
                      },{
                          name: 'financeInfo.factorNo',
                          rules: [{name: 'required'}],
                          events:['blur']
                      },{
                          name: 'financeInfo.coreCustNo',
                          rules: [{name: 'required'}],
                          events:['blur']
                      },{
                          name: 'financeInfo.productId',
                          rules: [{name: 'required'}],
                          events:['blur']
                      },{
                          name: 'financeInfo.creditMode',
                          rules: [{name: 'required'}],
                          events:['blur']
                      }],
                      errorPlacement: function(error, element) {
                          var label = element.parents('td').prev().text().substr(0);
                          tipbar.errorLeftTipbar(element,label+error,0,99999);
                      }
                };*/


            }]);

            //手动装载angular模块
            angular.bootstrap($('#container'),['mainApp']);

        });
    });

    

});
