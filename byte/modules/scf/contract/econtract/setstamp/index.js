/**=========================================================
 * 测试类-轮播控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('scf.contract.econtract.setstamp', MainController);

    MainController.$inject = ['$scope','BtUtilService'];
    function MainController($scope,BtUtilService) {

        activate();
        // 设置一个全局的拖拽对象
        var dragEle = null;
        var curThumb = 0;

        BtUtilService.freshIframe(1300);

        ////////////////
        //初始化方法开始
        function activate() {

            // 禁止火狐浏览器拖拽时打开新页面
            if(navigator.userAgent.indexOf('Firefox') >= 0){
               document.body.ondrop = function (event) {  
                    event.preventDefault();  
                    event.stopPropagation();  
                } 
            }
            
            $scope.switchThumb = function($event){
                if($event.target.nodeName === 'IMG'){

                    var children = $event.currentTarget.children;
                    var contendCh = document.getElementById('carousel-thumb-content').children;

                    angular.element(children[curThumb]).removeClass('active');
                    angular.element(contendCh[curThumb]).addClass('bt-hidden');

                    curThumb = parseInt($event.target.nextElementSibling.innerText)-1;
                    angular.element(children[curThumb]).addClass('active');
                    angular.element(contendCh[curThumb]).removeClass('bt-hidden');

                }
            };

            window.dragStart = function(ev){
                dragEle = ev.target;
                ev.dataTransfer.setData("imgFlag",true);
                ev.dataTransfer.setData("layerX",ev.offsetX);
                ev.dataTransfer.setData("layerY",ev.offsetY);
            };
            window.allowDrop = function(ev){
                ev.preventDefault();
            };
            window.dropEnd = function(ev){
                ev.preventDefault();
                // 只监听指定img的拖拽事件
                if(ev.dataTransfer.getData("imgFlag")){
                    
                    var layerX = ev.pageX - ev.currentTarget.offsetLeft;
                    var layerY = ev.pageY - ev.currentTarget.offsetTop;

                    if(dragEle.previousElementSibling && dragEle.previousElementSibling.nodeName === 'SPAN'){

                        layerX = layerX - ev.dataTransfer.getData('layerX');
                        layerY = layerY - ev.dataTransfer.getData('layerY');

                        layerX = layerX > 0 ? (layerX < 602 ?layerX:602 ): 0 ;
                        layerY = layerY > 0 ? (layerY < 910 ?layerY:910 ): 0 ;

                        var divParent = angular.element(dragEle.parentElement.parentElement);
                        divParent.css({'top': layerY +'px','left': layerX + 'px'});
                    }else {

                        var ratioX = Math.round( ev.dataTransfer.getData('layerX') * 140 / 96); 
                        var ratioY = Math.round( ev.dataTransfer.getData('layerY') * 140 / 96); 

                        layerX = layerX - ratioX;
                        layerY = layerY - ratioY;

                        layerX = layerX > 0 ? (layerX < 602 ?layerX:602 ): 0 ;
                        layerY = layerY > 0 ? (layerY < 910 ?layerY:910 ): 0 ;

                        var divParent = angular.element('<div class="carousel-stamp"></div>');
                        divParent.css({'top': layerY +'px','left': layerX + 'px','background-position-y':'64px'});
                        var divEle = angular.element('<div class="carousel-button"></div>');
                        var closeEle = angular.element('<span></span>');
                        closeEle
                            .on('click',function(){

                                document.getElementById('carousel-thumb-container').append(divParent.find('img')[0]);
                                divParent.remove();
                            });
                        divEle.append(closeEle);
                        divEle.append(dragEle);
                        divParent.append(divEle);
                        dragEle = null;

                        ev.currentTarget.children[curThumb].appendChild(divParent[0]);
                    }
                    
                }
            };


        } // 初始化结束
    }

})();
