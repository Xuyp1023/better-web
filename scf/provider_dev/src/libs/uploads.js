/*
	angularjs环境下上传组件
	anthor : herb

 必须参数：
	event: 		上传触发元素	
    type: 		上传附件类型
    typeName: 	类型名称
    uploadList: 存放上传文件
    topBox: 	当前页面div
    watch : 	触发组件动作   		值：Math.random()

 非必须参数：
    showTitle: 	是否显示标题	   	默认显示(true)
    prompt: 	错误提示方式        默认“note”便签式 	note/slide,

*/

define(function(require,exports,module){
	var loading = require("./loading");
	var tipbar = require("./tooltip");
	var common = require("./common");
	var BTPATH = require("./commonpath");

	angular.module("upload",[]).directive('btUpload',[function(){

		return {
			restrict: 'EA',
			transclude:true,
			template:'<div class="div-width-100 upload_box hide">'+
				          '<div class="div-center upload-detail-box">'+
				            '<h1 ng-show="conf.showTitle" class="content-title-1 content-title-condensed"><img src="../../img/info-title-icon.png" alt="">{{conf.typeName}}上传</h1>'+
				            '<iframe id="upload_iframe" name="upload_iframe" marginheight="0" marginwidth="0" scrolling="no" frameborder="0" width="100%" ng-load="uploadIframeLoad();"></iframe>'+
				            '<div class="center-buttons">'+
				              '<button id="cancel_again_upload_btn" mapping="cancel_btn" class="btn btn-primary" ng-click="cancelPlusUpload()">取消</button>'+
				              '<button id="submit_again_upload_btn" mapping="upload_btn" class="btn btn-primary" ng-click="confirmUpload($event);">上传该文件</button>'+
				            '</div>'+
				          '</div>'+
			          '</div>',
            replace:true,
            //上传参数配置
            scope:{
            	conf: '=conf'
            },
            link:function(scope,element,attrs){

        		var upload_box = $(element);//上传Div
        		var event_button;			//触发上传的按钮

    			//监听上传触发
    			scope.$watch("conf.watch",function(newValue,oldValue,scope){
    				if(newValue){
    					event_button = $(scope.conf.event);
    					//默认参数
    					scope.conf = $.extend({},{
    						showTitle:true,
    						prompt:"note"
    					},scope.conf);
    					scope.showPlusUpload();
    				}
    			});
				

		    	//开启附件上传
				scope.showPlusUpload = function(){
					//当前div
					var $topBox = $("#"+scope.conf.topBox);
					//高度
					var height = $topBox.height();
					//最小高度
					if(height < 265){
						height = 265;
						$topBox.height(height);
					}
					upload_box.height(height).slideDown('slow',function(){
						common.pageSkip(upload_box);
					});
					//关闭遮罩层
					loading.removeLoading(upload_box);
					upload_box.find("#upload_iframe").attr('src',common.getRootPath()+'/scf/app/upload/upload.html?rn='+Math.random());
				};


				//监听上传iframe
				scope.uploadIframeLoad = function(){
					//上传iframe
					var uploadPage = $(upload_box.find("#upload_iframe")[0].contentWindow.document),
					    flag = uploadPage.find('#upload_flag').val();

					//页面初始加载 - IE
					if($.browser.msie&&(uploadPage.find('body').html().length===0)) return;

					if(flag==='upload'){
						//上传附件类型
					    uploadPage.find('#file_name').html(scope.conf.typeName);
					    //设置上传地址
					    uploadPage.find('#upload_form').attr('action',BTPATH.UPLOAD_BACK_INFO + '?fileTypeName='+ scope.conf.type);
					}else{
					    //释放确认上传按钮
					    event_button.show();
					    scope.cancelPlusUpload();
					    var resultStr = uploadPage.find('body').html();
					    //文件数据量过大(超过10M)，被nigix拦截返回信息
					    if(resultStr.indexOf('nginx')!==-1){
					    	scope.errorTip('上传失败，服务端返回信息:文件大小过大(不能超过10MB)');
					        return;
					    }
					    var response = JSON.parse(resultStr);
					    //后端返回错误处理
					    if(response.code !== 200){
					    	scope.errorTip('上传失败，服务端返回信息:'+response.message);
					        if(console) console.log(response);
					        return;
					    }
					    scope.conf.uploadList.push({
					    	id:response.data.id,
					    	fileName:response.data.fileName,
					    	url:common.getRootPath()+'/CustFile/fileDownload?id='+response.data.id
					    });
					    //上传成功后打印日志
					    if(console){
					    	console.log(response);
					    }
					}
				};

				//提示错误信息
				scope.errorTip = function(msg){
					//默认“note”便签式提示
					var msgType = scope.conf.prompt ? scope.conf.prompt : 'note';
					//弹出提示
					if(msgType==="note"){
						tipbar.errorTopTipbar(event_button, msg ,3000,999999);
					}
					//下滑提示
					else if(msgType==="slide"){
						tipbar.infoTopTipbar(msg ,{msg_box_cls : 'alert alert-error alert-block',during:'3500'});
					}
				};

				//确定上传
				scope.confirmUpload = function(event){
				    var $target = $(event.target||event.srcElement),
				    	uploadPage = $(upload_box.find("#upload_iframe")[0].contentWindow.document),
				        fileData = uploadPage.find('[name="Filedata"]').val();
				    //校验是否选择文件
				    if(fileData===''){
				        tipbar.errorTopTipbar($target,'还未选取需要上传的文件，请检查!',3500,9999999);
				        return;
				    }
				    uploadPage.find('#upload_form').submit();
				    //隐藏上传按钮
				    event_button.hide();
				    //生成上传状态
				    loading.addLoading(upload_box,common.getRootPath());
				};

				//关闭附件上传
				scope.cancelPlusUpload = function(){
					upload_box.slideUp(100,function(){
						common.pageSkip(event_button);			
					});
					common.cleanPageTip();
					//当前div ,如果设置了height属性，移除
					var $topBox = $("#"+scope.conf.topBox);
					common.removeHeight($topBox);
					//执行回调函数
					if(scope.conf.callback){
						scope.conf.callback();
						// console.log("callback action!");
					}
				};

            }


		};

	}]);

});