/**=========================================================
 * 路由跳转服务
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.routes')
        .service('BtRouterService', BtRouterService);

    BtRouterService.$inject = ['$rootScope','$q','$http','$timeout','$compile','$controller','$location','$injector','RouteHelpers']
    function BtRouterService($rootScope,$q,$http,$timeout,$compile,$controller,$location,$injector,helper) {

        // 全局的id
        var globalID = 0;

        // 内部私有方法
        var privateMethods = {};

        // 模态框集合
        var scope ;

        this.setTabScope = function(cScope){
            scope = cScope;
            scope.btTabs = [];
        }

        privateMethods.closeDialog = this.close = function(options,callback){
            options = options || {};
            switch (options.closeIndex){
                case 100: // 关闭全部
                    scope.tabCurrent = scope.btTabs[0];
                    for (var i = scope.btTabs.length - 1; i > 0; i--) {
                        scope.btTabs.pop().close();
                    }
                    if(callback) callback();
                    break;
                case -1: // 关闭次上层
                    var length =  scope.btTabs.length;
                    if(length >2){  // 底层页面不能删除
                        scope.btTabs[length-2].close();
                        scope.btTabs[length-2] = scope.btTabs.pop();
                    }
                    break;
                default: // 关闭最上层
                    var tabCurrent = scope.btTabs.pop();
                    scope.tabCurrent = scope.btTabs[scope.btTabs.length-1];
                    tabCurrent.close();
                    if(callback) callback();
                    break;
            }
        };

        this.getCurTab = function(){
            return scope.tabCurrent.tabElment;
        };

        this.addTabs = function(btTabs){
            scope.btTabs.push(btTabs);
            scope.tabCurrent = btTabs;
        };

        // 获取options
        this.getOptions = function(opts,url, params){

            var defer = $q.defer();

            var path = url || $location.path();
            var controllerName = path.substring(1).replace(/\//g,".");
            var btParams = params || $location.search();
            var modulePaht = 'modules' + path;

            var options = {
                templateUrl:modulePaht+ '/index.html',
                controller:controllerName
            };

            $http
                .get(modulePaht + '/index.json',{ cache: true })
                .success(function(jsonData){
                    var exResolve = jsonData.initInfo.resolve;
                    exResolve.push(modulePaht + '/index.css');
                    exResolve.push(modulePaht + '/index.js');
                    options.resolve = angular.extend(helper.resolveFor(exResolve),{configVo:function(){
                        jsonData.configVo.btParams = btParams;
                        jsonData.configVo.modulePaht = modulePaht;
                        if(jsonData.configVo.BTServerPath){
                            angular.forEach(jsonData.configVo.BTServerPath,function(value,key) {
                               value[0] = value[0].replace(/Module_Path/, modulePaht);
                            })
                        }
                        return jsonData.configVo;
                    }});
                    defer.resolve(options);

                })
                .error(function(){
                    options.resolve = helper.resolveFor(modulePaht + '/index.css',modulePaht + '/index.js')
                    defer.resolve(options);
                });

            return defer.promise;
        }

        // 打开新界面
        this.open = function(options){

            var localID = ++globalID;
            var tabID = 'btTabID' + localID;

            // 成功加载后的，消息通知
            var openDefer = $q.defer();

            var resolve = angular.extend({}, options.resolve);
            angular.forEach(resolve, function (value, key) {
                resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
            });

            var scope;
            scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();

            var $tab;

            $q.all({
                template: loadTemplateUrl(options.templateUrl),
                locals: $q.all(resolve)
            }).then(function (setup) {

                var template = setup.template,
                locals = setup.locals;

                $tab = angular.element('<div id="' + tabID + '"></div>');
                $tab.attr("ng-class","{'bt-hidden':tabCurrent.id !== '"+tabID+"'}");//显示交给angular
                $tab.html(template);

                // scope数据传递
                if (options.data && angular.isString(options.data)) {
                    var firstLetter = options.data.replace(/^\s*/, '')[0];
                    scope.btData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : new String(options.data);
                } else if (options.data && angular.isObject(options.data)) {
                    scope.btData = options.data;
                }

                scope.closeThisDialog = function () {
                    privateMethods.closeDialog();
                };

                //绑定控制器
                if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {

                    var label;

                    if (options.controllerAs && angular.isString(options.controllerAs)) {
                        label = options.controllerAs;
                    }

                    var controllerInstance = $controller(options.controller, 
                        angular.extend(locals,{$scope: scope, $element: $tab}),
                        true,
                        label
                    );

                }

                $timeout(function () {
                    $compile($tab)(scope);
                    openDefer.resolve($tab);
                });
            
            },function(error){
                // console.log(error);
            });

            return {
                id: tabID,
                openPromise : openDefer.promise,
                close: function (value) {
                    $tab.remove();
                    scope.$destroy();
                }
            };

            // 加载html代码
            function loadTemplateUrl (tmpl, config) {
                var config = config || { cache: true };
                config.headers = config.headers || {};

                angular.extend(config.headers, {'Accept': 'text/html'});

                return $http.get(tmpl, config).then(function(res) {
                    
                    return res.data || '';
                });
            }
        }

        
    }
})();