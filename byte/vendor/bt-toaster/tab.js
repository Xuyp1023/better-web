// tab切换
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btTabs', ['$timeout',function($timeout){
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                $(element).on('click','li',function(){
                    $(this).addClass('is-active')
                            .siblings().removeClass('is-active');  
                    var id = $(this).data('id');
                    $('#'+id).addClass('is-show')
                        .siblings().removeClass('is-show');        
                    
                })
            }
        }
    }])      
   	
      
})();