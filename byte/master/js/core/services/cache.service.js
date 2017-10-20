/**=========================================================
 * 跨页面缓存的服务
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .service('BtCache', BtCache);

  BtCache.$inject = ['$timeout'];
  function BtCache($timeout) {

    if (typeof window.parent.$$$cache !== 'object') {
      window.parent.$$$cache = {};
    }
    return {
      //存储缓存值
      put: function (key, value) {
        var isObject = typeof value === 'object';
        window.parent.$$$cache[key] = isObject ? angular.extend({}, value) : value;

        // 半个小时之后，清除缓存
        $timeout(function(){
          delete window.parent.$$$cache[key];
        },1000*60*30);
      },
      //获取缓存值
      get: function (key) {
        return window.parent.$$$cache[key];
      },
      remove: function (key) {
        delete window.parent.$$$cache[key];
      }
    };
  }
})();