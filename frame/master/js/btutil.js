(function () {
  'use strict';

  angular
    .module('app.frame')
    .service('BtUtilService', BtUtilService);

  BtUtilService.$inject = ['$http', '$location', '$q', '$cacheFactory', '$log', '$timeout', '$rootScope'];
  function BtUtilService($http, $location, $q, $cacheFactory, $log, $timeout, $rootScope) {
    var urlCache = {};
    //post方法
    this.post = function (url, params) {

      if (_isTest == 0) {
        return this.get(url);
      }

      // 一分钟之内只能请求一次
      if (urlCache[url] && new Date().getTime() - urlCache[url] < 1000 * 60) {
        return $q.reject(
          {
            status: 515,
            data: '1分钟之类不允许重复提交'
          });
      } else {
        urlCache[url] = new Date().getTime();
      }

      return $http.post(url, params)
        .then(function (response) {

          delete urlCache[url];
          return response.data;
        }, function (error) {
          delete urlCache[url];
          return $q.reject(error);
        });
    };
    /**
    get方法
    url:路径地址
    params:路径参数
    cache:缓存
    */
    this.get = function (url, params) {
      var config = { params: params };
      return $http.get(url, config)
        .then(function (response) {

          return response.data;
        }, function (error) {

          return $q.reject(error);
        });
    };

  }
})();