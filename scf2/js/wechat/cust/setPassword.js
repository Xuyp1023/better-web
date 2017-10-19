/*
	微信设置密码
	作者:tanp
*/
define(function(require, exports, module) {
    require.async(['dicTool', 'bootstrap', "datePicker"], function() {
        require.async(['BTDictData'], function() {
            var validate = require("validate");
            var tipbar = require("tooltip");
            var common = require("common");
            var loading = require("loading");
            var comdirect = require("direct");
            var dialog = require("dialog");
            var comfilter = require("filter");
            var comservice = require("service_s2");
            var BTPATH = require("path_s2");
            var pages = require("pages");
            require('modal');
            require('date');
            require("upload");

            //定义模块
            var mainApp = angular.module('mainApp', ['modal']);

            //扩充公共指令库
            comdirect.direcPlus(mainApp);
            //扩充公共过滤器
            comfilter.filterPlus(mainApp);
            //扩充公共服务
            comservice.servPlus(mainApp);


            //控制器区域
            mainApp.controller('mainController', ['$scope', 'http', 'commonService', 'form', function($scope, http, commonService, form) {
                /*VM绑定区域*/
                $scope.info = { loginPassword: '', newPassword: '', okPassword: '' };

                /*事件处理区域*/

                $scope.savePwd = function(target) {
                	var $target = $(target);
                	
                    http.post(BTPATH.SAVE_MOBILE_TRADE_PWD, $.extend({},$scope.info)).success(function(data) {
                        if (common.isCurrentData(data)) {
                            window.location.href = 'bindSuccess.html';
                        }else{
				 			tipbar.errorTopTipbar($target,'设置交易密码失败,服务器返回:'+data.message,3000,9992);
				 		}
                    });
                };



                $scope.initPage = function() {};



                /*数据初始区域*/
                $scope.initPage();

            }]);



            //手动装载angular模块
            angular.bootstrap($('#container'), ['mainApp']);
        });
    });
});
