/*
整体项目的路由导航
@author binhg
*/

define(function(require, exports, module) {
    exports.installRoute = function(mainApp) {
        var moduleList = arguments;
        mainApp.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
            $.extend(mainApp, {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            });
            mainApp.asyncjs = function(js) {
                return ["$q", "$route", "$rootScope", function($q, $route, $rootScope) {
                    var deferred = $q.defer();
                    var dependencies = angular.copy(js);
                    require.async(dependencies, function() {
                        var ctrl = arguments[0];
                        //装载独立加载的组件
                        if(!moduleList.push) moduleList.push = Array.prototype.push;
                        for (var i = 0; i < arguments.length; i++) {
                          if(i>0){
                            moduleList.push(arguments[i]);
                          }
                        }
                        ctrl.installController.apply(window,moduleList);
                        $rootScope.$apply(function() {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }];
            };


            $routeProvider
                .when('/demo', {
                    templateUrl: 'app/demo/template/demo.html',
                    controller: 'demoController',
                    resolve: {
                        load: mainApp.asyncjs(['./app/demo/controller/demoController','common'])
                    },
                    title: '企e金服供应链金融'
                })

            .when('/demo/test', {
                templateUrl: 'app/demo/template/demoTest.html',
                controller: 'demo.testController',
                resolve: {
                    load: mainApp.asyncjs('./app/demo/controller/demo.testController')
                },
                title: '企e金服供应链金融'
            })

            //容错路径
            .otherwise({
                redirectTo: '/demo'
            });

        }]);
    };
});
