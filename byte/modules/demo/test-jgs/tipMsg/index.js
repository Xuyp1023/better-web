/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('demo.test-jgs.tipMsg', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','BtPopInfo','$q'];
    function MainController($scope, BtUtilService,BtPopInfo,$q) {

        activate();

        ////////////////
        //初始化方法开始
        function activate() {
             $scope.test=function(){
                // console.log(222);
                new Dialog({
                title: '友情提示!',
                content: '外面空气不太好，你确定你要出门逛逛吗？'
                }).show().then(function() {
                    console.log('你点击了确认按钮.');
                   $.post('https://demo1.qiejf.com/better/logout',{},function(data){
                        // if(data.code === 401){
                        //  location.href = 'login.html';
                        // }
                    },'json');
                    window.location.href = '../../../../better/p/pages/login.html';

                }).catch(function() {
                    console.log('你点击了取消按钮.');
                })
            }
   
        } // 初始化结束

            var instance;
            function Dialog(config){
                this.title=config.title||'这是标题',
                 this.content=config.content||'这是提示内容',
                 // defer = $q.defer(),
                 this.html='<div class="dialog-dropback">'+
                                '<div class="container">'+
                                    '<div class="head">'+this.title+'</div>'+
                                    '<div class="content">'+this.content+'</div>'+
                                    '<div class="footer">'+
                                        '<button class="cancel">取消</button>'+
                                        '<button class="confirm">确认</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'                                        

            }

            Dialog.prototype={
                constructor:Dialog,
                show:function(){
                    var _this=this;
                    if(instance){
                        this.destroy();
                    }
                    $(this.html).appendTo($(document.body));
                    instance=this;
                    var defer = $q.defer();                    
                    $('.dialog-dropback .cancel').on('click',function(){
                        _this.hide();
                         defer.reject();
                    })

                    $('.dialog-dropback .confirm').on('click',function(){
                        _this.hide();
                        defer.resolve();
                    })

                    return defer.promise;
                    
                },

               destroy:function(){
                    instance=null;
                    $('.dialog-dropback .cancel').off('click');
                    $('.dialog-dropback .confirm').off('click');
                    $('.dialog-dropback').remove();
               },
               hide:function(){
                    this.destroy();
               }                
            }


           




    }

})();