(function(){
  'use strict';
  
  angular.module('app.frame', []);

  angular.element(document).ready(function () {
    //初始化项目
    angular.bootstrap(document, ['app.frame']);
  });
})();