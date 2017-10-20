/**=========================================================
 * 路由辅助工具
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .service('RouteHelpers', RouteHelpers)
    ;

    RouteHelpers.$inject = ['APP_REQUIRES'];
    function RouteHelpers(APP_REQUIRES) {

        this.basepath = basepath;
        this.resolveFor = resolveFor;

        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'app/views/' + uri;
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        function resolveFor() {
            var _args = angular.isArray(arguments[0]) ? arguments[0] : arguments;
            return {
                deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for(var i=0, len=_args.length; i < len; i ++){
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if(typeof _arg === 'function')
                            return promise.then(_arg);
                        else
                            return promise.then(function() {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load( whatToLoad );
                            });
                    }
                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        //自定义控制器
                        if (typeof(name) !== 'undefined' && name.indexOf("/")>=0)
                            return name;
                        if (APP_REQUIRES.modules)//angualr模块
                            for(var m in APP_REQUIRES.modules)
                                if(APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                                    return APP_REQUIRES.modules[m];
                        return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];//脚本
                    }

                }]};
        } // resolveFor
    }
})();