/**=========================================================
 * 路由
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.routes')
        .directive('btView',btView);

    btView.$inject = ['BtRouterService','BtUtilService'];
    function btView(BtRouterService,BtUtilService){

        var tabsParent;

        var directive = {
        	restrict: 'A',
        	link: function(scope, element, attrs){

                BtRouterService.setTabScope(scope);

                // 获取父容器
                tabsParent = element;
                // 打开第一个界面
                openView({});

                // 开启监听
                scope.$on('addNewTab', function(event,options) {
                    var btTab = BtRouterService.open(options);
                    btTab
                        .openPromise.then(function($tabContent){
                            btTab.tabElment = $tabContent;
                            tabsParent.append($tabContent);
                            BtRouterService.addTabs(btTab);
                            window.top.scrollTo(0,0);
                            if(options.callback) options.callback();
                        });
                });

        	},
            controller:'BtRouterController'
        };

        function openView(options){

            BtRouterService
                .getOptions(options)
                .then(function(opts){
                    var btTab = BtRouterService.open(opts);
                    btTab
                        .openPromise.then(function($tabContent){
                            btTab.tabElment = $tabContent;
                            tabsParent.append($tabContent);
                            BtRouterService.addTabs(btTab);
                        });
                });
        }

        return directive;
        
    }

})();