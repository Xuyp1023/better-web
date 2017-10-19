(function () {
  'use strict';

  angular
    .module('app.frame')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', 'BtUtilService', "$rootScope", '$timeout', '$interval'];
  function HeaderController($scope, BtUtilService, $rootScope, $timeout, $interval) {

    activate();

    // 初始化用户信息
    BtUtilService
      .get(BTServerPath.UserInfo)
      .then(function (jsonData) {
        $scope.userInfo = jsonData;
      });

    // 初始化公司信息
    BtUtilService
      .get(BTServerPath.Query_Company_List)
      .then(function (jsonData) {
        $scope.companyList = jsonData.data;
        $scope.companyInfo = jsonData.data[0];
      });

    $rootScope.notifyMenu = function () {
      notifyMenu(menuConfig.menuid, true);  // 默认显示菜单 和 内容页面（index.html的src地址）
    }

    getMsgNotify(); // 定时获取消息
    $interval(getMsgNotify, 1000 * 60 * 20); // 20分钟一次

    function activate() {
      // 退出登录
      $scope.logout = function () {
        // 弹出框确认

        // 请求后台
        BtUtilService
          .get(BTServerPath.logout)
          .then(function (jsonData) {
            if (data.code === 401) {
              window.location.href = logout_htnm;
            }
          }, function (errorMsg) {

          });
      };
      // 查看用户信息
      $scope.lookUserInfo = function () {

      };
      // 查看消息通知
      $scope.lookMsg = function () {
        // 定时任务获取
      };
      // 查看公司信息
      $scope.lookComList = function () {
        // 弹出框显示即可
      };
      // 切换二级菜单
      $scope.switchMenu = function (menuid) {
        notifyMenu(menuid);
      };
    }

    // 定时获取消息
    function getMsgNotify() {
      BtUtilService
        .get(BTServerPath.Notify_Msg)
        .then(function (jsonData) {
          $scope.msgInfo = jsonData;
        });
    }

    // 通知二级菜单切换
    function notifyMenu(menuid, flag) {
      $scope.menuid = menuid;
      var menuObj = {
        menuid: menuid, sidebarMenuUrl: (_isTest ? menuConfig.sidebarMenuUrl[menuid - 1][0] : menuConfig.siberbarRealUrl),
        welcome: menuConfig.sidebarMenuUrl[menuid - 1][1], flag: flag
      }
      $rootScope.$broadcast('notifyMenu', menuObj);
    }

  }

})();