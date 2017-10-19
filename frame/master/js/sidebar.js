(function () {
  'use strict';

  angular
    .module('app.frame')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', 'BtUtilService', '$location'];
  function SidebarController($scope, BtUtilService, $location) {

    activate();

    function activate() {

      // 开启监听
      $scope.$on('notifyMenu', function (event, options) {

        BtUtilService
          .get(options.sidebarMenuUrl, { menuId: options.menuid })
          .then(function (jsondata) {
            $scope.menuItems = jsondata;
            if (!options.flag) {
              forwardView({ url: options.welcome });
            }
          });
      });

      $scope.activeMenu = {};

      $scope.mianMenuC = function (item) {

        if (item.children) {
          if ($scope.activeMenu.openItem === item.$$hashKey) {
            $scope.activeMenu.openItem = undefined;
          } else {
            $scope.activeMenu.openItem = item.$$hashKey;
          }
        } else {
          $scope.activeMenu.openItem = undefined;
          $scope.activeMenu.activeItem = item.$$hashKey;
          $scope.activeMenu.activeSubItem = undefined;
          forwardView(item);
        }
      };

      $scope.subMenuC = function (subItem, item) {
        $scope.activeMenu.activeItem = item.$$hashKey;
        $scope.activeMenu.activeSubItem = subItem.$$hashKey;
        forwardView(subItem);
      };

      $scope.getMenuItemPropClasses = function (item) {
        if (item.heading) {
          return 'nav-heading';
        } else {
          return ($scope.activeMenu.activeItem === item.$$hashKey ? ' active' : '');
        }
      }

      //页面跳转
      function forwardView(item) {
        var iframes = angular.element(document)
          .find("iframe");
        var url = item.url, hash = '';
        if (url.indexOf('#') !== -1) {
          hash = url.split('#')[1];
          url = url.split('#')[0];
        }
        iframes[0].src = url + '?bt_v=' + (new Date().getTime()) + '#' + hash;
      }

    }

  }
})();