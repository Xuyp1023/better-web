(function () {
  'use strict';

  angular
    .module('app.frame')
    .config(frameConfig);

  frameConfig.$inject = ['$httpProvider'];
  function frameConfig($httpProvider) {
    // $httpProvider.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
    // $httpProvider.defaults.transformRequest = function (obj) {    // 只有post方法要用到这个
    //   var str = [];
    //   for (var p in obj)
    //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //   return str.join("&");
    // }
  }
})();