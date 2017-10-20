(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btTab', btTab) //自定义页签打开的按钮
        ;

    btTab.$inject = ['$timeout','$q'];
    function btTab ($timeout,$q) {

    	var directive = {
            restrict: 'A',
            link: link
        };
        return directive;
        

        function link(scope, element, attrs,controller){

            var tmpTabContent = [];
            var currenTab = null;

            activate();

            function activate(){

                element.after('<div class="bt-tab-content"></div>');
                var tabContents = element.next();

                var i=0;

                var tabs = element.children();
                angular.forEach(tabs,function(row){

                    if(row.className.indexOf('is-active')>=0){
                        currenTab = row;
                    }

                    angular.element(row).attr('index',i);
                    i++; 
                    var divElement = null;
                    var lastElementChild = row.lastElementChild || row.lastChild;
                    if(lastElementChild.nodeName == 'A'){
                        divElement = angular.element('<div class="tab-pane"></div>');
                    }else{
                        divElement = angular.element(lastElementChild);
                        divElement.remove();
                    }
                    divElement.css('display','none');
                    tmpTabContent.push(divElement);
                    tabContents.append(divElement);

                    currenTab = angular.element(currenTab || tabs[0]);
                    tmpTabContent[currenTab.attr('index')].css('display','block');
                });
            }
            
            element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click',function (e) {
                    if(e.target.nodeName == 'DIV') return;
                    tmpTabContent[currenTab.attr('index')].css('display','none');
                    currenTab.removeClass('is-active');
                    if(e.target.nodeName == 'LI'){
                        currenTab = angular.element(e.target);
                    }else{
                        currenTab = angular.element(e.target).parent();
                    }
                    currenTab.addClass('is-active');
                    tmpTabContent[currenTab.attr('index')].css('display','block');
                });
        	
        }
    }
})();