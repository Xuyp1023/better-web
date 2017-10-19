define(function(require,exports,module){
	require('swfuploader');
	var common = require('p/js/common/common');
	var tipbar = require("m/sea_modules/tooltip");
	/*工具函数*/
	var _tools =exports.tools = {
		//获取上传数据
		getUploadInfo : function(file){
			var target = {};
			targetObject = $('#'+file.id.substr(0,file.id.length-2)).parents('tr');
			if(targetObject.length<1) return null;
			target.index = targetObject.attr('index');
			target.type = targetObject.attr('type');
			target.target = targetObject;
			return target;
		}
	};
	/*配置参数*/
	var setting_params = {
		flash_url:common.getRootPath()+'/p/js/common/webuploader/swfupload.swf?rn='+Math.random(),
		// flash_url:BTRootPath+'l/SWFUpload/v2.2.0.1/swfupload.swf?rn='+Math.random(),
		upload_url : common.getRootPath()+'/CustFile/fileUpload?fileTypeName=test',
		//允许的文件
		file_types: "*.jpg;*.jpeg;*.png;*.gif;*.doc;*.docx;*.pdf;*.xls;*.xlsx",
		file_size_limit: "3MB",
		file_upload_limit: 1,
		button_action: SWFUpload.BUTTON_ACTION.SELECT_FILE,
		button_placeholder_id: "upload00",
		button_image_url: BTRootPath+"p/img/upload_z.png",
		button_width: 86,
		button_height: 25,
		button_text: "文件上传",
		button_text_left_padding: 15,
		button_text_top_padding: /msie/i.test(navigator.userAgent) ? 4 : 4,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: -2,
		file_dialog_start_handler: function(file) {},
		file_dialog_complete_handler: function(numFilesSelected, numFilesQueued) {
    			numFilesQueued > 0 && this.startUpload();
		},
		debug: false,
		//事件绑定
		//上传过程中
		upload_progress_handler : function(file,percentage){
			if(console) console.log(file);
		},
		//文件加入队列中
		file_queued_handler : function(file){
			var info = _tools.getUploadInfo(file);
			this.setUploadURL(common.getRootPath()+'/CustFile/fileUpload?fileTypeName='+info.type);
			// this.startUpload(file);
		},
		//文件移出队列时
		onFileDequeued : function(file){
			if(console) console.log(file);
		},
		//文件未通过验证时的错误处理
		file_queue_error_handler : function(file, errorCode, message){
			var msg = "您选择的文件错误，请重新选择文件上传！";
			switch (errorCode) {
			    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			        msg = "您选择的文件大小错误，请重新选择文件上传！";
			        break;
			    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			        try {
			            msg = "您选择的图片超过最大(" + this.settings.file_size_limit + ")限制，请处理后上传！";
			        } catch (e) {
			            msg = "您选择的图片大小超过最大限制，请处理后上传！";
			        }
			        break;
			    case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			        msg = "您的文件格式有误！";
			        break;
			    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
			        msg = "您一次选择的文件太多，请重新选择文件上传！";
			        break;
			    default:
			        msg = "您选择的文件错误，请重新选择文件上传！";
			}
			tipbar.infoTopTipbar('您选择的文件有误，错误原因:'+msg,{
				msg_box_cls : 'alert alert-error alert-block',
				during:3000
			});
		},
		//文件上传成功处理
		upload_success_handler : function(file,response){
			if(console){
			console.log(response);
			}
		},
		//文件上传成功后出发，不管成功或失败
		upload_complete_handler : function(file){
			if(console) console.log(JSON.stringify(arguments));
			//上传完成后刷新队列
			// var stats = this.getStats();
			// if (stats.files_queued == 0) { //上传队列中文件为0时;
			//     this.settings.file_upload_limit == 1 && this.setStats({
			//         successful_uploads: 0
			//     });
			// } else {
			//     this.startUpload();
			// }
		},
		//文件上传出错时
		upload_error_handler : function(file,code){
			tipbar.infoTopTipbar('上传文件失败，原因:'+code,{
				msg_box_cls : 'alert alert-error alert-block',
				during:3000
			});
		}
	};

	/*创建上传对象*/
	exports.createUpload = function(params){
		var newParams = $.extend(setting_params,params||{});
		var uploader = new SWFUpload(newParams);
		return uploader;
	};
});