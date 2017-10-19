/*
*	angularjs环境下上传组件
*	@anthor : herb
* 	@params :
	<-------------------------------------------->
	*	event: 		上传触发元素
	*   type: 		上传附件类型
	*   typeName: 	类型名称
	*   typeList:   上传附件类型列表
	*   uploadList: 存放上传文件
	*   showTitle: 	是否显示标题	   	可选(true | false | default : true)
	*   prompt: 	错误提示方式        可选(note | slide | default 'note'),
*	<-------------------------------------------->
*
*/

define(function(require,exports,module){
	var loading = require("loading");
	var tipbar = require("tooltip");
	var common = require("common");
	var BTPATH = require("path_s2");

	//默认配置
	var default_param = {
		showTitle:true,
		prompt:"note",
		typeName:'附件'
	};

	//样式
	var _sheet = {
		upload_dropdowm:{
			border: "1px solid #DDDDDD",
		    width: "320px",
		    "margin-left": "-90px"
		},
		upload_box:{
			position:"absolute",
			left:0,
			top:0,
			'z-index':99999,
			background:"white"
		},
		upload_detail:{
			width:"820px"
		},
		upload_iframe:{
			height:"230px"
		}
	};

	//$.browser.msie 无法判断IE11
	function isIE() {
	 	if (!!window.ActiveXObject || "ActiveXObject" in window)
	  		return true;
	  	else
	  		return false;
	}


	//页面跳跃到指定元素 isNode|传递参数是否是节点
	function pageSkip(param,isNode) {	
	  	var scroll_offset = isNode ? param.offset() : param ,//得到该元素的offset，包含两个值，top和left
	  	$parent = $(window.frames.parent.document),
	  	parent_scroll = $parent.find('#content').offset() || {top:0};
	  	$parent.find("body,html").animate({
   			scrollTop:scroll_offset.top+parent_scroll.top  //让body的scrollTop等于pos的top，实现了滚动
	   	},500);
	}


	angular.module("upload",[]).directive('btUpload',[function($compile){

		return {
			restrict: 'EA',
			transclude:true,
			template:'<div class="div-width-100 upload_box hide">'+
				          '<div class="div-center upload-detail-box">'+
				            '<h1 ng-show="conf.showTitle" class="content-title-1 content-title-condensed"><img src="'+(window.BTServerPath+'/img/up_title1.png')+'" alt=""><span ng-bind=""></span>{{conf.typeName}}上传</h1>'+
				            '<iframe id="upload_iframe" name="upload_iframe" marginheight="0" marginwidth="0" scrolling="no" frameborder="0" width="100%" ng-load="uploadIframeLoad();"></iframe>'+
				            '<div class="center-buttons">'+
				              '<button id="cancel_again_upload_btn" mapping="cancel_btn" class="btn btn-primary" ng-click="cancelPlusUpload()">取消</button>'+
				              '<button id="submit_again_upload_btn" mapping="upload_btn" class="btn btn-primary" ng-click="confirmUpload($event);">上传该文件</button>'+
				            '</div>'+
				          '</div>'+
			          '</div>',
            replace:true,
            //接收上传参数配置
            scope:{
            	conf: '=conf'
            },
            link:function(scope,element,attrs){

        		var upload_box = $(element);//上传Div
        		var event_button;			//触发上传的按钮
        		var button_offset = {};		//按钮位置（用于返回跳转）
        			UPLOAD_FILE_PATH = common.getRootPath()+'/scf2/views/upload/upload.html?rn='+Math.random();	//上传界面路径

    			//监听上传触发
    			scope.$watch("conf.event",function(newValue,oldValue,scope){
    				if(newValue){
    					event_button = $(scope.conf.event);
    					button_offset = event_button.offset();
    					//组件参数
    					scope.conf = $.extend({},default_param,scope.conf);
    					scope.showPlusUpload();
    				}
    			});

    			//设置样式
    			upload_box.css(_sheet.upload_box).find(".upload-detail-box").css(_sheet.upload_detail);
    			upload_box.find("iframe").css(_sheet.upload_iframe);


		    	//开启附件上传
				scope.showPlusUpload = function(){
					//高度
					var height;
					var top_boxs = $(".top-box-active");
					if(top_boxs && top_boxs.length>=1){
						height = top_boxs.first().height();
					}else{
						height = $("body").height();
					}

					upload_box.height(height).slideDown('slow',function(){
						pageSkip(upload_box,true);
					});

					//关闭遮罩层
					loading.removeLoading(upload_box);
					upload_box.find("#upload_iframe").attr('src',UPLOAD_FILE_PATH);
				};


				//监听上传iframe状态
				scope.uploadIframeLoad = function(){
					//上传iframe
					var uploadPage = $(upload_box.find("#upload_iframe")[0].contentWindow.document),
					    flag = uploadPage.find('#upload_flag').val();

					//页面初始加载 - IE
					if(($.browser.msie || isIE())&&(uploadPage.find('body').html().length===0)) return;

					if(flag==='upload'){
						//上传附件类型
					    uploadPage.find('#file_name').html(scope.conf.typeName);
					    //下拉多选附件类型
					    if(scope.conf.typeList){
					    	var selectStr = '<select ng-model="type">';
						    for(var i=0; i<scope.conf.typeList.length; i++){
						    	var item = scope.conf.typeList[i];
						    	selectStr+='<option value="'+ item.value + '">'+ item.name +'</option>';
						    }
						    selectStr+='</select>';
							uploadPage.find('#file_name').html(selectStr);
							//默认选中第一个
							scope.conf.type = scope.conf.typeList[0].value;
							var $select = $(uploadPage.find('#file_name select'));
							//下拉样式
							$select.css(_sheet.upload_dropdowm);
							$select.change(function(){
								var $this = $(this);
								scope.$apply(function(){
									scope.conf.type = $this.val();
									//修改上传地址
									uploadPage.find('#upload_form').attr('action',BTPATH.UPLOAD_BACK_INFO + '?fileTypeName='+ scope.conf.type);
								});
							});
					    }
					    //根据文件类型 查询 允许的文件格式
					    $.post(BTPATH.FIND_FILE_TYPE_LIMIT,{fileTypeName:scope.conf.type},function(data){
					    	if((data && data.data && data.code === 200)){
					    		var msg = '请选择不大于10MB的文件，文件类型需要为:' + data.data;
					    		uploadPage.find('#file_limit').html(msg);
					    	}
					    },'json');
					    //设置上传地址
					    uploadPage.find('#upload_form').attr('action',BTPATH.UPLOAD_BACK_INFO + '?fileTypeName='+ scope.conf.type);
					}else{
					    var resultStr = uploadPage.find('body').html();
					    //文件数据量过大(超过10M)，被nigix拦截返回信息
					    if(resultStr.indexOf('nginx')!==-1){
					    	//关闭遮罩层 重新返回上传页面
					    	loading.removeLoading(upload_box);
					    	upload_box.find("#upload_iframe").attr('src',UPLOAD_FILE_PATH);
					    	scope.errorTip('上传失败，服务端返回信息:文件大小过大(不能超过10MB)');
					        return;
					    }
					    var response = JSON.parse(resultStr);
					    //后端返回错误处理
					    if(response.code !== 200){
					    	//关闭遮罩层 重新返回上传页面
					    	loading.removeLoading(upload_box);
					    	upload_box.find("#upload_iframe").attr('src',UPLOAD_FILE_PATH);
					    	scope.errorTip('上传失败，服务端返回信息:'+response.message);
					        if(console) console.log(response);
					        return;
					    }
					    //将上传文件返回的信息添加到列表
					    scope.conf.uploadList.push({
					    	id:response.data.id,
					    	fileName:response.data.fileName,
					    	url:common.getRootPath()+'/CustFile/fileDownload?id='+response.data.id,
					    	fileInfoType:response.data.fileInfoType
					    });
					    //关闭上传弹出框
					    scope.cancelPlusUpload();
					    //上传成功后打印日志
					    if(console){
					    	console.log(response);
					    }
					}
				};

				//提示错误信息
				scope.errorTip = function(msg){
					var submit_button = upload_box.find("#submit_again_upload_btn");	//模板内 确认上传按钮
					var msgType = scope.conf.prompt || 'note';	//默认 'note' 便签式提示

					//弹出提示
					if(msgType==="note"){
						tipbar.errorTopTipbar(submit_button, msg ,3000,999999);
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
				    //等待返回 - 生成遮罩层
				    loading.addLoading(upload_box,common.getRootPath());
				};

				//关闭附件上传
				scope.cancelPlusUpload = function(){
					upload_box.slideUp(100,function(){
						pageSkip(button_offset,false);
					});
					//置空
					scope.conf.event = null;
					common.cleanPageTip();
					//执行回调函数
					if(scope.conf.callback){
						scope.conf.callback();
						if(console) console.log("callback action!");
					}
				};

            }


		};

	}]);

});
