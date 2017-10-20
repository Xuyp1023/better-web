/**=========================================================
 * 测试类-布局控制器
 =========================================================*/
(function() {
    'use strict';

    // 定义服务
    angular
        .module('app.core')
        .service('BtPopInfo', BtPopInfo);
    BtPopInfo.$inject = ['$timeout','$document'];
    function BtPopInfo($timeout){
        this.propmpt=function(message,params){
            var _default_params ={
                // msg_box_cls : 'alert alert-success alert-block',
                msg_box_width : '82%',
                slideDownTime : 500,
                during:1500,
                slideUpTime : 500,
                fontColor : 'rgb(70, 136, 71)',
                inIframe : false
            };
            var newParams = $.extend(_default_params,params||{});
            //兼容资金管理系统措施
            // var bfsFrame = $(window.parent.document).find('iframe').filter('#mainshow');
            // if(bfsFrame.length>0) newParams.inIframe = true;
            //设置标识
            // var flag = newParams.msg_box_cls.split(' ').join('-');
            var tipbarElement = $('<div style="height:60px;background:#dff0d8;font-size:14px;border-radius:6px;padding-top:4px"><p>'+message+'</p></div>');
            tipbarElement.css({
                width:newParams.msg_box_width,                
                position:'fixed',
                zIndex : 10000,
                textAlign:'center',
                top : 0,
                left:'50%',
                color:newParams.fontColor,
                display:'none'
            })
            .appendTo($(window.parent.document.body))
            .css('marginLeft','-'+(tipbarElement.outerWidth()/2)+'px')
            .slideDown(newParams.slideDownTime,function(){
                setTimeout(function(){
                    tipbarElement.slideUp(newParams.slideUpTime,function(){
                        tipbarElement.remove();
                    });
                },newParams.during).bind(window);
            });
            //页面卸载时启动自我销毁
            // $(window).unload(function(){
            //     tipbarElement.remove();
            // });
            return tipbarElement;       
        }

        this.errorTopTipbar = function(element, message) {
           

            if (element.length < 1) { 
                if (console) 
                console.log('创建提示框时找不到响应对象，其选择器为:' + element.selector); return; 
            }
            var tipbarElement = $('<div >'+message+'<div></div></div>');
            tipbarElement.css({
                position:'absolute',
                color:'#8c3901',
                padding:'3px',
                backgroundColor:'#FEF9D9',
                border:'1px solid #A7A7A7',
                borderRadius:'8px',
                zIndex:6666
            })

            tipbarElement.children('div').css({
                position:'absolute',
                width: '20px',
                height: '10px',
                background: 'transparent url(../img/tip-yellow_arrows.png) no-repeat -29px 0',               
                left: '20px',
                bottom: '-10px',
                zIndex: 9998,
            })
            tipbarElement.appendTo($('body'));
            //设置绝对定位
            var left = element.offset().left + 10;
            var top = element.offset().top - tipbarElement.outerHeight() - 10;
            tipbarElement.css({ top: top + 'px', left: left + 'px' });
                window.setTimeout(function(){
                    tipbarElement.remove();
                },3000)           
            
        }  
    }

})();