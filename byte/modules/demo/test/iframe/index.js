/**=========================================================
 * 资金系统测试-iframe跨域控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test.iframe', MainController);

    MainController.$inject = ['$scope','BtUtilService','$timeout'];
    function MainController($scope,BtUtilService,$timeout) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {

           
            // 同源并且同applicationModuleName，使用angualr嵌套会出现bug，$scope重复
            $scope.openApply = function(){
                openIframe("https://static.qiejf.com/better/byte/home1_1.html#/p/fund/peng/apply");
            }
            $scope.openRedeem = function(){
                openIframe("https://static.qiejf.com/better/byte/home1_1.html#/p/fund/peng/redeem");
            }

        } // 初始化结束

        // 打开弹出框的方法
        function openIframe(url){
            var modal = 'position: absolute;left: 0;top: 0;bottom: 0;width: 100%;'+
                    'overflow: hidden;z-index: 172;';
            var divEle = document.createElement('div');
            window.top.document.body.appendChild(divEle);
            divEle.outerHTML = '<div id="bt_container" style="'+modal+'"><iframe allowTransparency="true" marginheight="0" marginwidth="0" frameborder="0" height="100%" width="100%"></iframe></div>';
            divEle = window.top.document.getElementById("bt_container");

            if (divEle.firstChild.attachEvent){
                divEle.firstChild.attachEvent("onload", function(){
                    initConnect();
                });
            } else {
                divEle.firstChild.onload = function(){
                    initConnect();
                };
            }
            
            function initConnect(){
                setTimeout(function(){
                    divEle.firstChild.contentWindow.postMessage('initConnect','*');
                    if (window.addEventListener) {  // all browsers except IE before version 9
                        window.addEventListener("message", receiver, false);
                    } else if (window.attachEvent) {   // IE before version 9
                        window.attachEvent("onmessage", receiver);
                    };
                    function receiver(event){
                        if(event.data == 'remove'){
                            if (window.removeEventListener) {  // all browsers except IE before version 9
                                window.removeEventListener("message", receiver, false);
                            } else if (window.attachEvent) {   // IE before version 9
                                window.detachEvent("onmessage", receiver);
                            };
                            window.top.document.body.removeChild(divEle);
                        }
                    }
                },100);
            }
            
            divEle.firstChild.src = url;
            
        }
    }

})();
