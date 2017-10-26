/**=========================================================
 * 打开对话框的服务
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .service('Dialog', Dialog);

  Dialog.$inject = ['$timeout', 'BtRouterService', '$q'];
  function Dialog($timeout, BtRouterService, $q) {

    var btView = angular.element(document.getElementById('bt-view'));
    var scopeAttr = [];

    this.close = function (callback) {
      if (scopeAttr.length > 0) {
        scopeAttr[scopeAttr.length - 1]();
      }
      if (callback) {
        callback();
      }
    }

    this.open = openDialog;

    // 打开独立的模态对话框
    this.go = function (url, params, callback) {

      url = '/' + url

      // 获取强约束的配置文件
      BtRouterService.getStrongConfig(url, params)
        .then(function (jsonData) {
          openDialog(jsonData, callback);
        })
        ;
    };

    // 打开模态对话框
    function openDialog(params, callback) {

      BtRouterService.loadHtml(params, function ($tab, scope) {

        var childrens = btView.children();
        var mianPage = angular.element(childrens[childrens.length - 1]);
        mianPage.addClass("bt-hidden");

        btView.append($tab);

        scope.closeThisDialog = function () {
          scopeAttr.pop();
          $tab.remove();
          mianPage.removeClass("bt-hidden");
          scope.$destroy();
        }
        scopeAttr.push(scope.closeThisDialog);
        if (callback) {
          callback();
        }
      });
    };

  }
})();