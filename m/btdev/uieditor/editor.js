/*
@name UIEditor富媒体编辑器相关组件
@author binhg
@function UE.loadEditor(id) 获取对应编辑器对象,id为编辑器包裹容器ID
@height 会自动填充包裹容器高度,高度最小为500px
@directive 
	bt-editor 包裹元素若有ID可不赋值，元素若无ID，则该指令赋值为包裹元素的id
	bt-img    为true时，可进行图片上传。默认为false
*/


/*
	简直扯淡
	editor 内部使用了 Array.indexOf 方法，不支持IE8
	添加支持
*/
if(![].indexOf){
    Array.prototype.indexOf = function(value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == value) {
                return i;
            }
        }
        return -1;
    };
}

define(function(require,exports,module){
	require('./libs/ueditor.config');
	require('./libs/ueditor.all.min');

	/*
	初始化配置
	*/
	//编辑器对象缓存列表
	UE.EDITORLIST = {};
	//暂存编辑器对象
	UE.pushEditor = function(name,editor){
		name = name+'_editor';
		UE.EDITORLIST[name] = editor;
	};
	//提取编辑器对象
	UE.loadEditor = function(wrap_id){
		var name = wrap_id+'_editor';
		return this.EDITORLIST[name];
	};
	_config = {
		toolbars: [[
		            'fullscreen',
		            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
		            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
		            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
		            'directionalityltr', 'directionalityrtl', 'indent', '|',
		            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
		            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
		             'pagebreak', 'template', 'background', '|',
		            'horizontal', 'date', 'time', 'spechars',  '|',
		            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
		            'print', 'preview', 'searchreplace'
		]],
		zIndex:6001
	};

	angular.module('editor',[])

	.directive('btEditor',function(){
		return {
			restrict:'EA',
			replace:false,
			controller:['$scope','$attrs', '$element', '$transclude', '$log',function($scope,$attr, $element, $transclude, $log){
			}],
			link:function($scope,$element,$attr){
				//获取属性
				var $ele = $($element[0]),
					wrap_id = $attr.id||$attr.btEditor,
					initWidth = $ele.width(),
					initHeight = $ele.height()-200,
					noToolbar = $attr.btNoToolbar||false,
					canUploadImg = $attr.btImg||false;
				
				//设置ID
				if(!$attr.id) $ele.attr('id',wrap_id);

				//配置属性
				$.extend(_config,{
					initialFrameWidth:initWidth,
					initialFrameHeight:initHeight<100?400:initHeight,
					elementPathEnabled : false,
					autoHeightEnabled:false
				});

				//加装图片上传
				if(canUploadImg === 'true'){
					_config.toolbars[0].push('|');
					_config.toolbars[0].push('simpleupload');
				}

				//置空菜单栏
				if(noToolbar)	_config.toolbars = [];

				//构建编辑器
				var ue = UE.getEditor(wrap_id,_config);

				//构建编辑器对象缓存
				UE.pushEditor(wrap_id,ue);

			}
		};
	});
});
