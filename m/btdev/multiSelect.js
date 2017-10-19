/*	
*	下拉多选插件(实现angular双向绑定) 
*	bt-multiple (jquery-ui-multiselect-widget) 
*	注意:源码有改动

*	@anthor : herb
*	@date :   2016年7月18日
* 	@params :
	<--------------------------------------------------------------->

	*	必须----------------------------------------
	*	bt-multiple    	是否多选 	true|false|default:true 
	*	list: 			options对应数组
	*   model: 			需要绑定的属性值	

	*	可选--------------------------------------
	*	bt-multi-id:  为select设置ID值
	*	bt-option-map: 	下拉数组map映射，默认value-name
	*   bt-select-all: 	全选/全不选功能 true|false |default:true
	* 	bt-none-text:   全不选时，默认显示文字
	
*	<--------------------------------------------------------------->
*/

define(function(require,exports,module){

	require("ui-multiSelect");

	//================================================== 外部调用 =================================================================

	//调整下拉框width (当display为none时，无法获取正确width，当其显示时，调用该方法动态改变宽度) 
	exports.resizeWidth = function(select){
		var $select  = select ? $("#"+select) : $(".bt-multiple-select");
		$select.multiselect("refresh").trigger("showcheckedname");
	};
	
	//=================================================== 工具方法 start ============================================================

	//扩充indexOf
	Array.prototype.indexOf = Array.prototype.indexOf || function(item){
		for (var i in this) { 
			if (this[i] === item)
				return i; 
		} 
		return -1; 
	};

	//扩充remove
	Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };


	//差集
	function differSet(arr1 , arr2){
		var union = unionSet(arr1,arr2),
			inter = interSet(arr1,arr2);
		for(var i in inter){
			union.remove(inter[i]);
		}
		return union;
	}


	//并集
	function unionSet(arr1 ,arr2){
		var result = $.extend([],arr1);
		// [].push.apply(result,arr2);
		for(var i in arr2){
			var temp = arr2[i];
			if(result.indexOf(temp)===-1){
				result.push(temp);
			}
		}
		return result;
	}


	//交集
	function interSet(arr1 ,arr2){
		var result = [];
		for (var i in arr1){
			var temp = arr1[i];
			if(arr2.indexOf(temp)!==-1){
				result.push(temp);
			}
		}
		return result;
	}

	//字符串转化为数组
	function strToArr(str){
		if(!str)
			return [];
		return str.split(",");
	}

	//数组转化为字符串
	function arrToStr(arr){
		if(!arr)
			return "";
		return arr.toString();
	}

	//=================================================== 工具方法 end ============================================================



	//下拉默认参数
	default_param = {
	  header: true,
	  noneSelectedText: "请选择",
	  selectedText:"已选数量: # ",
	  selectedList:2,
	  multiple:true,  //多选
	  height: 135 	//刚好可容纳四个选项
	};

	//
	angular.module("multiple",[]).directive('btRenderEnd',['$timeout',function($timeout){
		return {
			restrict: 'A',
			link:function(scope,element,attrs){
				//angular渲染完成后，初始化下拉
				if (scope.$last === true) {
	                $timeout(function(){
	                	var select_box = $(element).parent("select"),
	                		btMultiple = select_box[0].getAttribute("bt-multiple"),
	                		btSelectAll = select_box[0].getAttribute("bt-select-all"),
	                		btNoneText = select_box[0].getAttribute("bt-none-text"),
	                		config_param = $.extend(default_param,{
		                		header:btSelectAll && btSelectAll==="false" ? false:true,
		                		multiple:btMultiple && btMultiple==="false" ? false:true,
		                		noneSelectedText:btNoneText ? btNoneText : undefined
		                	});
	                	//初始化
	                	select_box.multiselect(config_param);
	                	// console.info("renderEnd: init");
	                });
	            }
			}
		};

	}]).directive('ngOptionFilter', ['$timeout',function ($timeout) {
			return {
				restrict: 'A',
				link: function(scope, element, attr) {
					if (scope.$last === true) {
						$(element[0]).parent('select').find('option').each(function(){
							var $element = $(this),
							value = $element.val();
							if(value.indexOf('?')!==-1){
								$element.remove();
							}
						});
					}
						
				}
			};
	}]).directive('btMultiple',['$timeout',function ($timeout){

		return {
			restrict: 'EA',
			transclude:true,
          	template:function(tElement,tAttrs){
          		var map = tAttrs.btOptionMap,
	          		keyName='value',
	          		textName='name',
	          		multi_id = tAttrs.btMultiId || '';	//需要一个默认值
          		if(map && map.indexOf("-")!==-1 ){
          			keyName = map.split("-")[0];
          			textName = map.split("-")[1];
          		}
	          	var _html = '<select multiple="multiple" class="bt-multiple-select" id="' + multi_id +'">'+
	                        '<option ng-repeat="item in list" ng-option-filter value={{item.'+keyName+'}} ng-bind="item.'+textName+'" bt-render-end></option>'+
	                        '</select>';
	          	return _html;
		    },
            replace:true,
            //上传参数配置
            scope:{
            	list: '=list',
            	model: '=model'
            },
            link:function(scope,element,attrs){

				var select_box = $(element);//选择Div

				//click事件 选中|反选
				select_box.bind("multiselectclick",function(){
					//已选中选项
					var selValue = select_box.multiselect("getChecked").map(function(){
					   return this.value;    
					}).get();
					scope.model = arrToStr(selValue);
					//外部同步变化
					scope.$apply();
				});

				//全选
				select_box.bind("multiselectcheckall",function(){
					//已选中选项
					var selValue = select_box.multiselect("getChecked").map(function(){
					   return this.value;    
					}).get();
					scope.model = arrToStr(selValue);
					//外部同步变化
					scope.$apply();
				});

				//全部不选
				select_box.bind("multiselectuncheckall",function(){
					scope.model = '';
					//外部同步变化
					scope.$apply();
				});

				
				//下拉创建(页面加载就显示已选择项)
				select_box.bind("multiselectcreate",function(){
					select_box.trigger("showcheckedname");
				});

				//打开下拉 根据 model 显示下拉选项
				select_box.bind("multiselectopen",function(){
					renderChecked();
				});

				//自定义事件,显示已选项
				select_box.bind("showcheckedname",function(){
					getCheckedShow();
				});


        		//监听列表数据
        		scope.$watch("list",function(newValue,oldValue,scope){
        			if(!newValue) return;
        			if(oldValue.length===newValue.length && newValue.length===0){
						//配置选项
						var config_param = $.extend(default_param,{
							header:attrs.btSelectAll && attrs.btSelectAll==="false" ? false:true,
							multiple:attrs.btMultiple && attrs.btMultiple==="false" ? false:true,
							noneSelectedText:attrs.btNoneText ? attrs.btNoneText:undefined
						});
						select_box.multiselect(config_param);
						getCheckedShow();
						// console.info("list change: init" , newValue);
        			}
        			else{
        				$timeout(function(){
        					select_box.multiselect("refresh");
        					getCheckedShow();
        					// console.info("list change: refresh" , newValue);
        				});
        			}
        		});


        		//监听取值数据
        		scope.$watch("model",function(newValue,oldValue,scope){
        			getCheckedShow();
        		});


        		//model 变化 改变 模板
        		function renderChecked(){
					var modelValue = $.extend([],strToArr(scope.model) );
					var checkValue = select_box.multiselect("getChecked").map(function(){
					   return this.value;    
					}).get();

					//获取差集
					var differ = differSet(modelValue,checkValue);

					select_box.multiselect("widget").find(":checkbox").each(function(){
						for(var i in differ){
							value = $(this).attr("value");
							if(value===differ[i]){
								this.click();
							}
						}
					});

        			scope.model = arrToStr(modelValue);
        			//外部同步变化
					// scope.$apply();
        		}


        		//显示已选项
        		function getCheckedShow(){
        			var modelValue = $.extend([],strToArr(scope.model) );
        			var show = "";
        			if(modelValue.length === 0){
        				show = default_param.noneSelectedText;
        			}
        			else if(modelValue.length > default_param.selectedList){
        				show = default_param.selectedText.replace("#",modelValue.length);
        			}
        			else{
        				select_box.find("option").each(function(){
        					var opValue = $(this).attr("value");
        					var opText = $(this).text();
        					if(modelValue.indexOf(opValue)!==-1){
        						if(!show){
        							show += opText;
        						}else{
        							show = show + "," +opText;
        						}
        					}
        				});
        				//如果option未加载
        				if(!show){
        					show = default_param.selectedText.replace("#",modelValue.length);
        				}
        			}
        			select_box.next("button").find("span").last().text(show);
        		}


            }


		};

	}]);


});