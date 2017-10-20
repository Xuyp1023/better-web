(function(){
	'use strict';

	// Init the application configuration module for AngularJS application
	window.ApplicationConfiguration = (function () {
	  // Init module configuration options
	  var applicationModuleName = 'bytter';
	  var applicationModuleVendorDependencies = ['oc.lazyLoad'];

	  // Add a new vertical module
	  var registerModule = function (moduleName, dependencies) {
	    // Create angular module
	    angular.module(moduleName, dependencies || []);

	    // Add the module to the AngularJS configuration file
	    angular.module(applicationModuleName).requires.push(moduleName);
	  };

	  return {
	    applicationModuleName: applicationModuleName,
	    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
	    registerModule: registerModule
	  };
})();
})();

(function() {
	'use strict';

	//Start by defining the main module and adding the module dependencies
	angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

	//Then define the init function for starting up the application
	angular.element(document).ready(function () {

	  //Fixing facebook bug with redirect
	  // if (window.location.hash && window.location.hash === '#_=_') {
	  //   if (window.history && history.pushState) {
	  //     window.history.pushState('', document.title, window.location.pathname);
	  //   } else {
	  //     // Prevent scrolling by storing the page's current scroll offset
	  //     var scroll = {
	  //       top: document.body.scrollTop,
	  //       left: document.body.scrollLeft
	  //     };
	  //     window.location.hash = '';
	  //     // Restore the scroll offset, should be flicker free
	  //     document.body.scrollTop = scroll.top;
	  //     document.body.scrollLeft = scroll.left;
	  //   }
	  // }

	  //Then init the app
	  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
	});

})();
(function() {
    'use strict';

    ApplicationConfiguration.registerModule('app.core',[]);
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = ['$httpProvider'];
    function coreConfig($httpProvider){

        $httpProvider.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};
        $httpProvider.defaults.transformRequest = function (obj) {
            var str = [];
            getFormData(obj);
            return str.join("&");

            function getFormData(objr, pr) {
                for (var p in objr) {
                    var keyN;
                    if (pr) {
                        keyN = pr + '[' + p + ']';
                    } else {
                        keyN = p;
                    }

                    if (angular.isObject(objr[p])) {
                        getFormData(objr[p], keyN);

                    } else {
                        str.push(encodeURIComponent(keyN) + "=" + encodeURIComponent(objr[p]));
                    }
                }
            }
        };

        // http请求的拦截器
        $httpProvider.interceptors.push(['$q', function($q) {
            return {
                request: function(config){
                    //成功的请求方法
                    return config;// 或者 $q.when(config);
                },
                response: function(response){
                    //响应成功
                    return response;// 或者 $q.when(response);
                },
                requestError: function (rejection) {
                    // 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
                    // return rejection; //或新的promise
                    // 或者，可以通过返回一个rejection来阻止下一步
                     return $q.reject(rejection);
                },
                responseError: function(rejection) {
                    // 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
                    // return rejection; //或新的promise
                    // 或者，可以通过返回一个rejection来阻止下一步
                     return $q.reject(rejection);
                }
            }
        }]);
    }

})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$templateCache'];
    function appRun($templateCache) {    

    	//解决IE8之类不支持getElementsByClassName
		if (!document.getElementsByClassName) {
		    document.getElementsByClassName = function (className, element) {
		        var children = (element || document).getElementsByTagName('*');
		        var elements = new Array();
		        for (var i = 0; i < children.length; i++) {
		            var child = children[i];
		            var classNames = child.className.split(' ');
		            for (var j = 0; j < classNames.length; j++) {
		                if (classNames[j] == className) {
		                    elements.push(child);
		                    break;
		                }
		            }
		        }
		        return elements;
		    };
		}

    	/*js原生对象扩展*/
		//Date对象拓展
		if(!Date.now){
			Date.now = function(){
				return new Date().getTime();
			};
		}
		angular.extend(Date.prototype,{
			//日期格式化
			format : function(formatStr){
				formatStr = formatStr||'YYYY-MM-DD HH:mm:SS';
				var FullYearIndex = formatStr.indexOf('YYYY'),
				monthIndex = formatStr.indexOf('MM'),
				dayIndex = formatStr.indexOf('DD'),
				hourIndex = formatStr.indexOf('HH'),
				miniteIndex = formatStr.indexOf('mm'),
				secondIndex = formatStr.indexOf('SS');
				if(FullYearIndex!== -1){
					formatStr = formatStr.replace('YYYY',this.getFullYear()+'');
				}
				if(monthIndex!== -1){
					var thisMonth = this.getMonth()<9?'0'+(this.getMonth()+1):(this.getMonth()+1)+'';
					formatStr = formatStr.replace('MM',thisMonth);
				}
				if(dayIndex !== -1){
					var thisDay = this.getDate()<10?'0'+(this.getDate()):(this.getDate())+'';
					formatStr = formatStr.replace('DD',thisDay);
				}
				if(hourIndex !== -1){
					var thisHours = this.getHours()<10?'0'+(this.getHours()):(this.getHours())+'';
					formatStr = formatStr.replace('HH',thisHours);
				}
				if(miniteIndex !== -1){
					var thisMinites = this.getMinutes()<10?'0'+(this.getMinutes()):(this.getMinutes())+'';
					formatStr = formatStr.replace('mm',thisMinites);
				}
				if(secondIndex !== -1){
					var thisSecond = this.getSeconds()<10?'0'+(this.getSeconds()):(this.getSeconds())+'';
					formatStr = formatStr.replace('SS',thisSecond);
				}
				return formatStr;
            },
            //获取各大浏览器公认的时间
            getCommonDate:function(str){
                return new Date(Date.parse(str.replace(/-/g,"/")));
            },
			//日期前驱范围计算
			getSubDate : function(flag,subNum){
				var FullYearNum = this.getFullYear(),
				monthNum = this.getMonth(),
				dayNum = this.getDate(),
				thisMonthAllDays = new Date(this.getFullYear(),this.getMonth(),0).getDate(),
				prevMonthAllDays = new Date(this.getFullYear(),this.getMonth()-1,0).getDate();
				if(flag === 'YYYY'){
					FullYearNum-=subNum;
				}
				if(flag === 'MM'){
					monthNum -= subNum;
					if(monthNum===0){
						FullYearNum-=1;
					}else if(monthNum<0){
						monthNum+=11;
						FullYearNum-=1;
					}
					if(dayNum>new Date(FullYearNum,monthNum+1,0).getDate()){
						dayNum = new Date(FullYearNum,monthNum+1,0).getDate();
					}
				}
				if(flag === 'DD'){
					dayNum-=subNum;
					if(dayNum===0){
						dayNum = prevMonthAllDays;
						monthNum-=1;
					}else if(dayNum<0){
						dayNum = prevMonthAllDays+dayNum;
						monthNum-=1;
					}
					if(monthNum===0){
						FullYearNum-=1;
					}else if(monthNum<0){
						monthNum+=11;
						FullYearNum-=1;
					}
				}
				return new Date(FullYearNum,monthNum,dayNum);
			},
			//获取当月拥有天数
			getMonthDay : function(){
				return new Date(this.getFullYear(),this.getMonth()+1,0).getDate();
			}
		});

		// 模板文件
		$templateCache.put('bulmaui-table/pager.html',
        '<ul class="pagination-list">'+
          '{{each listPages as value index}}'+  
            '<li>{{#value}}</li>'+  
          '{{/each}}'+
			'<li><button class="bt-btn bt-small pagination-previous" {{if currentPage <= 1}}disabled{{/if}}>上一页</button></li>'+
        	'<li><button class="bt-btn bt-small pagination-next" {{if totalPages <= currentPage}}disabled{{/if}}>下一页</button></li>'+
        '</ul>');
        

        $templateCache.put('bulmaui-select/select.html',
            '<select></select>');

    }

})();
/**=========================================================
 * 常见的过滤器
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.filter('downf', function () {
			return function (data) {
				return '../Platform/CustFile/fileDownload?id=' + data;
			};
		})
		.filter('datef', function () {
			return function (data) {
				if (!data) return '----';
				data += '';
				var newDate = '';
				newDate += (data.substr(0, 4) + '-' + data.substr(4, 2) + '-' + data.substr(6));
				return newDate;
			};
		})
		.filter('percentf', function () {
			return function (data) {
				if(data+''==='0'||data+''==='') return '----';
				return data+'%';
			};
		})
		.filter('point4f', function () {
			return function (data) {
				return Number(data).toFixed(4);
			};
		})
		//合同签署信息状态格式化
		.filter('cstatusf',function(){
			return function(data){
				if((data===undefined)||(data === '')) return '----';
				if(data === '0'||data === 0){
					return '未签署';
				}else{
					return (data === '1'||data === 1)?'成功':'失败';
				}
			};
		})
		.filter('kindf', function () {
			return function (data,pros) {

				if(!window.BTDict) return data;
				var result = BTDict[pros].get(data + '');
				return result;
			};
		});
})();
/**=========================================================
 * 数字转中文大写的过滤器
 =========================================================*/
(function() {
    'use strict';

    angular
      .module('app.core')
      .filter('btnumber', btnumber)
      .filter('btmoeny', btmoeny);

    // 235500001.11  235,500,001.11元
    btnumber.$inject=['$sce','$filter'];
    function btnumber($sce,$filter) {
      return function(data, props){
        if(!data) return '';
        var dataStr = $filter('number')(data, 2).split('.');
        var textHtml = '<big><b>'+dataStr[0]+'.</b></big><small>'+dataStr[1]+'元</small>';
        return $sce.trustAsHtml(textHtml);
      };
    }

    btmoeny.$inject = ['$filter'];
  function btmoeny($filter) {
    return function (data, props) {
      if (!data) return '';
      var dataStr = $filter('number')(data, 2).split('.');
      var numMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      var weightMap = ['圆', '万', '亿', '万'];
      var result = '';

      //角、分
      var pinyS = dataStr[1].split('');
      if (pinyS[0] != 0) {
        result = result + numMap[pinyS[0]] + '角';
      }
      if (pinyS[1] != 0) {
        result = result + numMap[pinyS[1]] + '分';
      }
      //圆
      var yuanstr = data.toString().split('.')[0];
      if (yuanstr == '0') {
        return result || '零圆'; // 0元
      }

      var tempResult = getAllValue(yuanstr.split(''));
      return tempResult;

      function getAllValue(yuans) {
        var result = '';
        for (var i = yuans.length - 1; i >= 0; i--) {

          var yuansWeight = '';
          switch ((yuans.length - 1 - i) % 4) {
            case 0:
              yuansWeight = weightMap[(yuans.length - 1 - i) / 4];
              if(yuans[i] !=0 ){
                yuansWeight = numMap[yuans[i]] +yuansWeight;
              }
              break;
            case 1:
              if(yuans[i] !=0){
                yuansWeight = numMap[yuans[i]] +'拾';
              }else if(yuans[i-1] != 0 && yuans[i+1] != 0){
                yuansWeight = '零';
              }
              break;
            case 2:
              if(yuans[i] !=0){
                yuansWeight = numMap[yuans[i]] +'佰';
              }else if(yuans[i-1] !=0 && (yuans[i+1] != 0 || yuans[i+1] != 0)){
                yuansWeight = '零';
              }
              break;
            case 3:
              if(yuans[i] !=0){
                yuansWeight = numMap[yuans[i]] +'仟';
              }else if(yuans[i+1] !=0 || yuans[i+2] != 0 || yuans[i+3] != 0){
                yuansWeight = '零';
              }
              break;
          }
          result = yuansWeight + result;
        }
        return result;
      }
    };
  }

})();
/**=========================================================
 * 时间选择的指令
 =========================================================*/
(function() {

    angular
        .module('app.core')
        .directive('btDate', btDate);

    btDate.$inject = ['$parse', 'BtUtilService','$timeout'];
    function btDate($parse, BtUtilService,$timeout) {

    	return {
            restrict:'A',
            link:function(scope, element, attrs){

                element.attr("readonly",true);

                var config = scope.$eval(attrs.btDate) || {};
                if(attrs.longTerm){
                    var buttonEle = angular.element('<button class="bt-btn bt-btn-default bt-left-8">长期有效</button>');
                    element.after(buttonEle);

                    buttonEle
                        .on('click',function(){
                            $timeout(function(){
                                    $parse(attrs.ngModel).assign(scope,'2099-12-31');
                                    element.addClass("ng-dirty");
                                },1);
                        });
                }

                element
                    .on('click', function (e) { e.stopPropagation(); })
                    .on('click',function () {

                        var elePos = element[0].getBoundingClientRect();

                        var config = scope.$eval(attrs.btDate) || {};

                        var inputElement = angular.element('<input>');
                        var dateParam = {
                            startDate:element[0].value,
                            position:{left:elePos.left,top:(elePos.top+element[0].offsetHeight)},
                            el:inputElement[0],
                            dateFmt:config.dateFmt || 'yyyy-MM-dd',
                            onpicked: function(){
                                var modelDate = inputElement[0].value;
                                $timeout(function(){
                                    $parse(attrs.ngModel).assign(scope,modelDate);
                                    element.addClass("ng-dirty");

                                    if(attrs.callback){
                                        $parse(attrs.callback)(scope);
                                    }
                                },1);
                            },
                            oncleared:function(){
                                $timeout(function(){
                                    $parse(attrs.ngModel).assign(scope,'');
                                    element.addClass("ng-dirty");
                                },1);
                            }
                            // onpicking:function(){
                            //     console.log('pick');
                            // }
                        };

                        if(config.max) dateParam.maxDate = config.max;
                        if(config.min) dateParam.minDate = config.min;

                        window.WdatePicker(dateParam)
                    });
            }
        };
    }
})();

/**=========================================================
 * 字典下拉的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btDict', btDict);

    btDict.$inject = ['$parse', 'BtUtilService','$compile'];
    function btDict($parse, BtUtilService,$compile) {

        var directive = {
            restrict: 'EA',
            compile: compile,
            scope:{
                selectModel:'=ngModel'
            }
        };
        return directive;

         function compile(tElement, tAttrs, transclude){

            var btAttrs = tAttrs.$attr;

            var selectElement = angular.element('<select></select>');
            if(tAttrs['class']){
                selectElement.attr('class',tAttrs['class']);
            }
            selectElement.attr('ng-model',"selectModel");
            delete btAttrs.ngModel;
            if(btAttrs.options){//自定义下拉显示
                delete btAttrs.options;
                selectElement.attr('ng-options',btAttrs.options +" for g in selectAttr");
            }else{
                selectElement.attr('ng-options',"g.key as g.value for g in selectAttr");
            }
            angular.forEach(btAttrs,function(value,key){
                selectElement.attr(key,value);
            });
            
            return {
                pre: function(scope, iElement,iAttrs,controller){
                    if(tElement.children()){//自定义默认选项
                        selectElement.append(tElement.children());
                    }
                    var selectHtml = $compile(selectElement)(scope);
                    tElement.replaceWith(selectHtml[0]);
                },
                post: link
            }
        }

        function link(scope, element, attrs,controller){

            BtUtilService
              .cache(['server/btDict/'+attrs.btDict + '.json',attrs.url])
              .then(function(jsonData){
                    scope.selectAttr = jsonData.data;
              });
            
        }
    }
})();

/**=========================================================
 * 拖动的指令
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('btDrag', btDrag);

  btDrag.$inject = ['$parse', '$document', '$timeout'];
  function btDrag($parse, $document, $timeout) {

    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link(scope, element, attrs, controller) {

      var dragElm = element;
      var startX = 0, startY = 0;
      var startDrag=false;
      var maxLeft =0,maxTop =0;
      element.css({
        cursor: 'move'
      });

      //查找要拖拽的内容
      for (var i = 0; i < 6; i++) {//最高找上面6级
        if (dragElm.hasClass("bt-modal-content")) {
          break;
        }
        dragElm = dragElm.parent();
      }

      setTimeout(function(){
        dragElm.css({
            top:dragElm[0].offsetTop + 'px',
            left:dragElm[0].offsetLeft + 'px',
            bottom:undefined,right:undefined,margin:0
        });
        maxLeft = document.body.clientWidth-dragElm[0].offsetWidth;
        maxTop = (dragElm.parent()[0].firstElementChild || dragElm.parent()[0].firstChild).offsetHeight-dragElm[0].offsetHeight;
      },100);

      element.on('mousedown', function (event) {
        startX = event.clientX-dragElm[0].offsetLeft;
        startY = event.clientY-dragElm[0].offsetTop;
        event.preventDefault();
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
        startDrag=true;
      });

      function mouseup() {
        startDrag=false;
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }

      function mousemove(event) {
        if (startDrag) {

          var tmpX = event.clientX-startX;
          tmpX = tmpX >0 ? (tmpX<maxLeft  ? tmpX: maxLeft):0;
          var tmpY = event.clientY-startY;
          tmpY = tmpY >0 ? (tmpY<maxTop  ? tmpY: maxTop):0;

          angular.element(dragElm).css({
              left:tmpX + 'px',
              top:tmpY + 'px'
          });
          // //Disable element/text selection.
          window.getSelection().removeAllRanges();
        }
      }
    }
  }
})();

/**=========================================================
 * form表单验证的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btFormValidate', btFormValidate)
        ;

    btFormValidate.$inject = ['$parse', 'BtValidate','$compile'];
    function btFormValidate($parse, BtValidate,$compile) {

        var directive = {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs,controller){

            var formParams = $parse(attrs.btFormValidate)(scope) || {};
            if(!formParams) return;

            var formEles = BtValidate.getFormEles(element);

            formParams.validateInput = function(name, type){

                if(!formEles[name]) return false;
                var element = formEles[name].element;
                var inputDirty = (element.className.indexOf('ng-dirty') !== -1);
                var inputValid = true;
                if(type){
                    inputValid = (element.className.indexOf('ng-invalid-'+ type) !== -1);
                }else{
                    inputValid = (element.className.indexOf('ng-invalid') !== -1);
                }

                if((formParams.dirty || inputDirty) && inputValid){
                    return true;
                }else{
                    return false;
                }
            }

            formParams.getValid = function(){

                if(!formParams.dirty) formParams.dirty = true;
                element.addClass('bt-dirty');
                if(validateForm()){
                    return true;
                }else{
                    return false;
                }
            }

            function validateForm(){

                var result = true;
                angular.forEach(formEles,function(value, key){
                    if(value.element.className.indexOf('ng-invalid') !== -1){
                        result = false;
                    }
                });
                return result;
            }
            
        }
        return directive;
    }
})();
/**=========================================================
 *  1、非view层的修改model需要在input框中添加ng-dirty的class
    2、ng-model属性的才能进行表单验证
 =========================================================*/

/**=========================================================
 * 时间变化的指令
 =========================================================*/
(function () {
	'use strict';
	angular
		.module('app.core')
		.directive('btNow', btNow);

	btNow.$inject = ['$parse', '$interval'];
	function btNow($parse, $interval) {

		return {
			restrict: 'EA',
			link: function (scope, element, attrs) {

				function updateTime(){
					switch (attrs.type) {
						case 'now':
							break;
						case 'decrease':
							var time = element.text() || $parse(attrs.name)(scope);
							updateTime = decrease;
							element.text(time);
							break;
					}
				}

				updateTime();
				var intervalPromise = $interval(updateTime, 1000);

				scope.$on('$destroy', function(){
					$interval.cancel(intervalPromise);
				});

				//	秒数递减
				function decrease(){
					var time = element.text();
					time--;
					element.text(time);
					if(time == 0){
						$interval.cancel(intervalPromise);
					}
				}
			}
		}
	}
})();
/**=========================================================
 * 时间选择的指令
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('btPager', btPager);

  btPager.$inject = ['$parse', 'TableService', '$timeout'];
  function btPager($parse, TableService, $timeout) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var tableParams = $parse(attrs.btPager)(scope);
        if (!tableParams) return;

        element.on('click', function (e) {
          //分页查询按钮点击事件
          if (e.target.nodeName == 'BUTTON') {
            var aElement = angular.element(e.target);

            var tmpPageNum = tableParams.pageNum;
            if (aElement.hasClass('pagination-link')) {//具体的分页数
              tmpPageNum = parseInt(aElement.text());
            } else if (aElement.hasClass('pagination-previous')) {//上一页
              tmpPageNum--;
            } else if (aElement.hasClass('pagination-next')) {//下一页
              tmpPageNum++;
            }
            if (tmpPageNum != tableParams.pageNum) {
              tableParams.pageNum = tmpPageNum;
              TableService.searchPageData(tableParams, element);
            }
          }
        });

        tableParams.setDatasource = function (params) {

          tableParams.pageNum = tableParams.initPageNum || 1;
          tableParams.pageSize = tableParams.initPageSize || 10;

          tableParams.queryVo = params.queryVo;
          tableParams.searchUrl = params.searchUrl;

          TableService.searchPageData(tableParams, element);
        }

        if (tableParams.initOver) {
          tableParams.initOver();
        }

      }
    };
  }
})();
/**=========================================================
 * 自定义表单效验的指令
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('btPattern', btPattern);

	btPattern.$inject = ['$parse', '$timeout'];
	function btPattern($parse, $timeout) {

		var pattern = {
			mobile:/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
			email:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
			phone:/^((\d{3,4}-)?\d{7,8})$|^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
			fax:/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/,
			zipcode:/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/,
			money:/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/,
			int:/^\d+$/
		};

		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attrs, ngModel) {

				if(!attrs.btPattern) return;
				var cPattern = pattern[attrs.btPattern];

				//注册model到view的转换视图
				// ngModel.$formatters.push(function(value) {
				// 	ngModel.$setValidity('unique', false);
				// });
				//注册view到model的解析视图
				ngModel.$parsers.push(function(value) {

					if(!value || cPattern.test(value)){
						ngModel.$setValidity('btPattern', true);
						return value;
					}else{
						ngModel.$setValidity('btPattern', false);
					}
				});

			}
		};

	}
})();
/**=========================================================
 * 文件上传的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btUpload', btUpload);

    btUpload.$inject = ['$parse', 'BtUtilService','$timeout'];
    function btUpload($parse, BtUtilService,$timeout) {
    	return {
            restrict: 'A',
    		link: function(scope, element, attrs){

                var accept = attrs.accept || '*';
                var fileTypeName = attrs.fileTypeName || 'otherFile';

                initUpload();

                function initUpload(){

                    var inputEle = angular.element('<input class="bt-unvisitable" type="file" accept="' + accept + '" name="Filedata" />');
                    if(!angular.isUndefined(attrs.multiple)){
                        inputEle.attr('multiple','multiple');
                    }
                    inputEle
                        .on('change',function($event){
                            
                            element.addClass('bt-upload-ing');
                            $timeout(function(){
                                submitForm(inputEle);
                            },200);
                            
                        });
                    element.append(inputEle);
                }

                var iframe,form;
                function submitForm(input){
                    var actionUrl = BtUtilService.getUrl(['../scf2/testdata/uploadR.html?fileTypeName=','/Platform/CustFile/fileUpload?fileTypeName=']) +fileTypeName;
                    form = angular.element('<form  style="display:none;" action="'+actionUrl+'" method="post" enctype="multipart/form-data" target="bt_upload_frame"></form>');
                    iframe = angular.element('<iframe name="bt_upload_frame" style="display: none;">');
                    form.append(input);
                    angular.element(document.body).prepend(form);
                    angular.element(document.body).prepend(iframe);

                    iframe
                        .on('load',iframeLoad);

                    form[0].submit();
                }

                function clean(){
                    iframe.remove();
                    form.remove();
                }

                function iframeLoad($event){
                    var iDocument = $event.target.contentWindow.document;
                    var resultStr = iDocument.body.innerHTML;
                    if(resultStr.length !== 0 && resultStr.indexOf("{") ==-1){
                        resultStr = {code:500,message:'响应的是html代码'}
                        // 响应的是html代码，失败
                    }else{
                        resultStr = angular.fromJson(resultStr);
                    }
                    element.removeClass('bt-upload-ing');
                    switch (attrs.uploadType){
                        case 'table':
                            if(resultStr.code == 200){ // 上传成功响应
                                element.addClass('bt-upload-success');

                                $parse(attrs.btUpload).assign(scope,resultStr.data);
                                clean();
                                $timeout(function(){
                                    element.removeClass('bt-upload-success');
                                    // var deleteEle = angular.element('<a class="bt-table-button">删除</a>');
                                    // deleteEle
                                    //     .on('click',function(){
                                            
                                    //         scope.$apply(function(){
                                    //             $parse(attrs.btUpload).assign(scope,undefined);
                                    //         });
                                    //         deleteEle.remove();
                                    //         element.text('上传');
                                            initUpload();
                                    //     });
                                    // element.text('');
                                    // element.parent().prepend(deleteEle);
                                },900);
                            }else{ // 上传失败响应
                                element.addClass('bt-upload-fail');
                                clean();
                                $timeout(function(){
                                    element.removeClass('bt-upload-fail');
                                    element.text('重新上传');
                                    initUpload();
                                },900);
                            }
                            break;
                        default:
                            if(resultStr.code == 200){ // 上传成功响应
                                element.addClass('bt-upload-success');
                                var btModel = $parse(attrs.btUpload)(scope);
                                btModel.push(resultStr.data);
                                clean();
                                $timeout(function(){
                                    element.removeClass('bt-upload-success');
                                    initUpload();
                                },900);
                            }else{ // 上传失败响应
                                 element.addClass('bt-upload-fail');
                                 clean();
                                 $timeout(function(){
                                    element.removeClass('bt-upload-fail');
                                    initUpload();
                                },900);
                            }
                            break;
                    }
                }
    		}
    	}
    }

})();

(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('btSearch', btSearch) // 搜索
		.directive('btDropbutton', btDropbutton) // 下拉菜单
		;

	btSearch.$inject = ['$timeout', 'BtUtilService', '$compile', '$document'];
	function btSearch($timeout, BtUtilService, $compile, $document) {

		var directive = {
			restrict: 'A',
			link: link,
			scope: {
				selectData: '=ngModel',
				reqUrl: '@btSearch'
			}
		};
		return directive;

		function link(scope, element, attrs, controller) {

			var downdHtml = '<div class="bt-hidden bt-search-downdrop">' +
				'<li ng-repeat="item in listData" ng-click="select(item)">' +
				'<span ng-bind="item.orgFullName"></span>' +
				'</li>' +
				'</div>';
			var downdEle = angular.element(downdHtml);
			$compile(downdEle)(scope);
			element.after(downdEle);

			searchAndShow();

			scope.select = function (item) {
				scope.selectData = item.orgFullName;
			}

			var cpLock = false;
			element
				.on('input propertychange', function () {
					if (!cpLock) {
						searchAndShow(element[0].value);
					}
				});

			element
				.on('compositionstart', function () {
					cpLock = true;
				});

			element
				.on('compositionend', function () {
					cpLock = false;
					searchAndShow(element[0].value);
				});

			element
				.on('click', function (e) { e.stopPropagation(); })
				.on('click', function (e) {
					if (downdEle.hasClass('bt-hidden')) {
						downdEle.removeClass('bt-hidden');
						$timeout(function () {
							$document.on('click', closeDropdown);
						}, 1);
					}
				});

			var timeout;
			function searchAndShow(value) {
				if (timeout) $timeout.cancel(timeout);
				timeout = $timeout(function () {
					// 请求后台
					BtUtilService
						.post([(scope.reqUrl || 'server/http/test/test-input-search.json')], { value: value })
						.then(function (jsonData) {
							scope.listData = jsonData.data;
						});
				}, 100);
				return timeout;
			}

			function closeDropdown() {
				downdEle.addClass('bt-hidden');
				$document.off('click', closeDropdown);
			}

		}
	}

	btDropbutton.$inject = ['$timeout', 'BtUtilService', '$compile', '$document'];
	function btDropbutton($timeout, BtUtilService, $compile, $document) {

		var directive = {
			restrict: 'A',
			link: link
		};
		return directive;

		function link(scope, element, attrs) {
			element.append('<span class="bt-dropdown-icon"></span>');

			element
				.on('click', function (e) { e.stopPropagation(); })
				.on('click', function (e) {

					var spanEle = element.children();
					var dropEle = angular.element(spanEle[0]);
					spanEle = angular.element(spanEle[1]);

					if (dropEle.hasClass('bt-hidden')) {
						dropEle.removeClass('bt-hidden');
						spanEle.addClass('active');
						$timeout(function () {
							$document.on('click', closeDropdown);
						}, 1);
					}else{
						closeDropdown();
					}

					function closeDropdown() {
						dropEle.addClass('bt-hidden');
						spanEle.removeClass('active');
						$document.off('click', closeDropdown);
					}

				});
		}

	}
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btTable', btTable) //表格控件的指令
        .controller('BulmaTableController',BulmaTableController)
        ;

    BulmaTableController.$inject = ['$scope','TableService'];
    function BulmaTableController ($scope,TableService) {

    }

    btTable.$inject = ['$compile','$parse','TableService'];
    function btTable ($compile,$parse,TableService) {

    	var directive = {
            restrict: 'A',
            link: link,
            scope:{
                tableParams:'=btTable'
            },
            controller: 'BulmaTableController'
        };
        return directive;

        function link(scope, element, attrs,controller){


            activate();

            //给table注册api
            //设置分页查询功能的接口
            //设置改变数据功能的接口

            function activate() {

                var headCheck;

                //如果表格配置参数不存在
                var tableParams = scope.tableParams;
                if(!tableParams) return;

                tableParams.tableName = attrs.btTable;
                var tableElement = angular.element('<table class="bt-table"></table>');
                var tableParent = angular.element('<div></div>');
                tableParent.append(tableElement);
                element.append(tableParent);

                var templateHeader = tableParams.rowSelection ? '<th class="header-check"><input type="checkbox" class="bt-table-check"></th>':'';
                tableParams.tmpTdElement = tableParams.rowSelection ? '<td><input type="checkbox" class="bt-table-check"></td>':'';
                angular.forEach(tableParams.cols ,function(row){
                    templateHeader += '<th width='+row.width+'>'+ row.title +'</th>';
                });
                //添加表头文件
                tableElement.prepend('<thead class="bt-table-header"><tr>'+ templateHeader +'</tr></thead>');

                //开始处理表体文件
                var templateBody = angular.element('<tbody class="bt-table-body"></tbody>');
                //如果数据存在，则初始化表格数据
                if(tableParams.rowData){
                    TableService.setRowData(tableParams ,templateBody);
                }
                tableElement.append(templateBody);
                // 提供给外部一个改变表格数据的方法
                tableParams.setRowData = function(rowData){
                    tableParams.rowData = rowData;
                    TableService.setRowData(tableParams ,templateBody,headCheck);
                };

                // 头部复选框事件
                if(tableParams.rowSelection){

                    var trList = tableElement[0].getElementsByTagName("tr");
                    headCheck = trList[0].firstChild.firstChild;
                    angular
                        .element(headCheck)
                        .on('click',function(){

                            var trList = tableElement[0].getElementsByTagName("tr");
                            if(headCheck.checked){
                                for (var i = trList.length - 1; i > 0; i--) {
                                    trList[i].firstChild.firstChild.checked = true;  
                                }
                            }else{
                                for (var i = trList.length - 1; i > 0; i--) {
                                    trList[i].firstChild.firstChild.checked = false;  
                                }
                            }
                        });
                    // 获取列表的选择的数据，返回[{},{}] 或 [key,key]
                    tableParams.getRowSelection = function(key){
                        var result = [];
                        // 遍历table元素
                        var trList = tableElement[0].getElementsByTagName("tr");
                        for (var i = trList.length - 1; i > 0; i--) {
                            if(trList[i].firstChild.firstChild.checked){
                                if(key){
                                    result.push(eval('tableParams.rowData[i-1].'+key));
                                }else{
                                    result.push(tableParams.rowData[i-1]);
                                }
                            }
                        }
                        return result;
                    };
                }

                //添加分页查询的条件
                if(tableParams.paginationControls){
                    var tmpPageElement = angular.element('<div class="bt-search-page"></div>');
                    element.append(tmpPageElement);

                    tmpPageElement.on('click',function(e){
                        //分页查询按钮点击事件
                        if(e.target.nodeName == 'BUTTON'){
                            var aElement = angular.element(e.target);

                            var tmpPageNum = tableParams.pageNum;
                            if(aElement.hasClass('pagination-link')){//具体的分页数
                                tmpPageNum = parseInt(aElement.text());
                            }else if(aElement.hasClass('pagination-previous')){//上一页
                                tmpPageNum--;
                            }else if(aElement.hasClass('pagination-next')){//下一页
                                tmpPageNum++;
                            }
                            if(tmpPageNum != tableParams.pageNum){
                                tableParams.pageNum = tmpPageNum;
                                TableService.searchRowData(tableParams ,tmpPageElement ,templateBody,headCheck);
                            }
                        }
                    });
                    
                    tableParams.setDatasource = function(params){

                        tableParams.pageNum = tableParams.initPageNum || 1;
                        tableParams.pageSize = tableParams.initPageSize || 10;

                        tableParams.queryVo = params.queryVo;
                        tableParams.searchUrl = params.searchUrl;

                        TableService.searchRowData(tableParams ,tmpPageElement ,templateBody,headCheck);
                    }

                    // 专门用来删除或修改后的刷新操作
                    tableParams.refreshSource = function(){
                        TableService.searchRowData(tableParams ,tmpPageElement ,templateBody,headCheck);
                    }

                }

                // 通知，表格控件已经初始化完成
                if(tableParams.initOver){
                    tableParams.initOver.resolve();
                }
                
            }
        	
        }
    }
})();
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
/**=========================================================
 * 跨页面缓存的服务
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .service('BtCache', BtCache);

  BtCache.$inject = ['$timeout'];
  function BtCache($timeout) {

    if (typeof window.parent.$$$cache !== 'object') {
      window.parent.$$$cache = {};
    }
    return {
      //存储缓存值
      put: function (key, value) {
        var isObject = typeof value === 'object';
        window.parent.$$$cache[key] = isObject ? angular.extend({}, value) : value;

        // 半个小时之后，清除缓存
        $timeout(function(){
          delete window.parent.$$$cache[key];
        },1000*60*30);
      },
      //获取缓存值
      get: function (key) {
        return window.parent.$$$cache[key];
      },
      remove: function (key) {
        delete window.parent.$$$cache[key];
      }
    };
  }
})();
(function () {
  'use strict';

  angular
    .module('app.core')
    .service('TableService', TableService);

  TableService.$inject = ['BtUtilService', '$templateCache', '$compile', '$filter'];
  function TableService(BtUtilService, $templateCache, $compile, $filter) {

    //设置table的行数据
    this.setRowData = setRowData;

    //查询列表数据
    this.searchRowData = function (tableParams, tmpPageElement, templateBody, headCheck) {

      var toggleSpin = tableParams.toggleSpin ? BtUtilService.addSpin(tmpPageElement.parent()) : undefined;

      BtUtilService.post(tableParams.searchUrl, angular.extend({}, tableParams.queryVo, { pageNum: tableParams.pageNum, pageSize: tableParams.pageSize }))
        .then(function (jsonData) {

          if (jsonData.code === 200) {

            //设置分页查询的参数
            tableParams.totalCount = jsonData.page.total;
            tableParams.pageSize = jsonData.page.pageSize;

            //更新分页按钮视图
            updatePagerElement(tableParams, tmpPageElement);

            //更新表体部分
            tableParams.rowData = jsonData.data;
            setRowData(tableParams, templateBody, headCheck);

            BtUtilService.freshIframe();

          }

          BtUtilService.removeSpin(toggleSpin);

        }, function () {
          BtUtilService.removeSpin(toggleSpin);
        });
    }

    //原生的分页组件
    this.searchPageData = function (tableParams, tmpPageElement, templateBody, headCheck) {

      BtUtilService.post(tableParams.searchUrl, angular.extend({}, tableParams.queryVo, { pageNum: tableParams.pageNum, pageSize: tableParams.pageSize }))
        .then(function (jsonData) {

          if (jsonData.code === 200) {

            //设置分页查询的参数
            tableParams.totalCount = jsonData.page.total;
            tableParams.pageSize = jsonData.page.pageSize;

            //更新分页按钮视图
            updatePagerElement(tableParams, tmpPageElement);

            //更新表体部分
            tableParams.rowData = jsonData.data;

            BtUtilService.freshIframe();

          }
        }, function () {
        });
    }

    function setRowData(tableParams, tbodyElement, headCheck) {

      if (tableParams.rowData.length === 0) {
        tbodyElement.empty();
        return false;
      }

      var tmpElementStr = '';

      var tmpTdElement = tableParams.tmpTdElement;
      var btIndex = -1;
      angular.forEach(tableParams.rowData, function (row) {
        btIndex++;
        var rowElement = tmpTdElement;
        if (row.colspan == 'all') { //自定义行数据
          rowElement = '<td colspan="' + tableParams.cols.length + '">' + template.compile(tableParams.colspan.all)(row) + '</td>';
        } else {
          var btColspan = -1;
          var temColspan = null;
          angular.forEach(tableParams.cols, function (col) {
            btColspan++;
            var tmpField = undefined;

            if (row.colspan) {
              temColspan = temColspan || tableParams.colspan[row.colspan];
              if (btColspan >= temColspan.startIndex && btColspan < temColspan.endIndex) {
                return;
              } else if (btColspan == temColspan.endIndex) {
                rowElement += '<td class="bt-align-center" colspan="' + (temColspan.endIndex - temColspan.startIndex + 1) + '">'
                  + template.compile(temColspan.html)(row) + '</td>';
                temColspan = null;
                return;
              }
            }

            switch (col.type) {
              case 'template': //自定义模板
                var render = template.compile(col.cellTemplate);
                var html = render(row);
                tmpField = html;
                break;
              case 'buttons':
                tmpField = [];
                angular.forEach(col.config, function (item) {
                  if (!item.show || eval(item.show)) {
                    var event = '';
                    if (item.event) {
                      event = ' ng-click="' + item.event + '(' + tableParams.tableName + '.rowData[' + btIndex + '],$event)"';
                    }
                    tmpField.push('<a class="bt-table-button"' + event + '>' + item.title + '</a>');
                  }
                });
                tmpField = tmpField.join('<div class="bt-table-hr"></div>');
                break;
              default:
                tmpField = eval('row.' + col.field) || '';
                break;
            }

            switch (col.filter) {
              case 'money':
                tmpField = $filter('currency')(tmpField, '');
                rowElement += '<td class="bt-align-right">' + tmpField + '</td>';
                break;
              case 'status':
                rowElement += '<td>' + getStatusHtml(tmpField) + '</td>';
                break;
              case 'custom':
                rowElement += '<td>' + col.getStatusHtml(tmpField) + '</td>';
                break;
              default:
                rowElement += '<td>' + tmpField + '</td>';
                break;
            }
          });
        }
        tmpElementStr += '<tr>' + rowElement + '</tr>';
      });
      var tbodyTmp = angular.element(tmpElementStr);
      tbodyElement.empty();
      tbodyElement.append(tbodyTmp);
      if (tableParams.parentScope) $compile(tbodyTmp)(tableParams.parentScope);

      // 子复选框的事件
      if (tableParams.rowSelection) {
        var trList = tbodyElement[0].getElementsByTagName("tr");
        for (var i = trList.length - 1; i >= 0; i--) {
          var checkbox = trList[i].firstChild.firstChild;
          angular
            .element(checkbox)
            .on('click', function ($event) {
              if (!$event.target.checked && headCheck.checked) {
                headCheck.checked = false;
              }
            });

          if (angular.isFunction(tableParams.rowIsOnOrOff) && tableParams.rowIsOnOrOff(tableParams.rowData[i])) {
            checkbox.checked = true;
          }
        }



      }
    }

    // 获取状态的html代码
    function getStatusHtml(status) {
      var rowElement = '';
      switch (status) {
        case '1':
          rowElement += '<span class="bt-table-status info"></span>已生效';
          break;
        case '2':
          rowElement += '<span class="bt-table-status error"></span>已生效2';
          break;
        case '3':
          rowElement += '<span class="bt-table-status warning"></span>已生效3';
          break;
        case '4':
          rowElement += '<span class="bt-table-status default"></span>已生效4';
          break;
        case '5':
          rowElement += '<span class="bt-table-status success"></span>已生效5';
          break;
      }
      return rowElement;
    }

    //更新分页按钮视图
    function updatePagerElement(tableParams, tmpPageElement) {
      var render = template.compile($templateCache.get('bulmaui-table/pager.html'));
      var config = {
        totalPages: Math.ceil(tableParams.totalCount / tableParams.pageSize),
        currentPage: tableParams.pageNum,
        listPages: []
      }

      if (config.totalPages < 6) {
        for (var i = 1; i <= config.totalPages; i++) {
          config.listPages.push(getPageHtmlByIndex(i, config.currentPage));
        }
      } else {
        config.listPages.push(getPageHtmlByIndex(1, config.currentPage));
        if (config.currentPage - 2 > 1) {
          config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
        }
        var middlePage = config.currentPage - 2 > 1 ? (config.currentPage + 2 < config.totalPages ? config.currentPage : config.totalPages - 2) : 1 + 2;
        config.listPages.push(getPageHtmlByIndex(middlePage - 1, config.currentPage));
        config.listPages.push(getPageHtmlByIndex(middlePage, config.currentPage));
        config.listPages.push(getPageHtmlByIndex(middlePage + 1, config.currentPage));
        if (config.currentPage + 2 < config.totalPages) {
          config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
        }
        config.listPages.push(getPageHtmlByIndex(config.totalPages, config.currentPage));
      }

      var html = render(config);
      tmpPageElement[0].innerHTML = html;
    }

    function getPageHtmlByIndex(index, currentIndex) {
      var is_current = (index == currentIndex) ? 'active' : '';
      return '<button class="bt-btn bt-small pagination-link ' + is_current + '">' + index + '</button>';
    }

  }
})();
/**=========================================================
 * tools提示的服务
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.service('BtTipbar', BtTipbar);

	BtTipbar.$inject = ['$timeout', '$document', '$q'];
	function BtTipbar($timeout, $document, $q) {

		// 全局的消息提示
		this.pop = function (type, title, body, timeout) {
			window.parent.pop(type, title, body, timeout);
		}

		// 按钮点击的警告
		this.tipbarWarning = function (element, msg, time) {
			if (!element) {
				return;
			}
			var tipbarElement = angular.element('<div class="tipbar-wrap">' + msg + '<div class="tipbar-wrap-arrow-left"></div></div>');
			angular.element(element).parent().append(tipbarElement);

			//设置绝对定位
			var left = element.getBoundingClientRect().left - tipbarElement[0].offsetWidth - 8;
			var top = element.getBoundingClientRect().top + document.body.scrollTop + ((element.offsetHeight - tipbarElement[0].offsetHeight) / 2);

			tipbarElement.css({ top: top + 'px', left: left + 'px' });

			var timeout = $timeout(function () {
				tipbarElement.remove();
				$document.off('click', removeTipbar);
			}, time || 3000);

			$timeout(function () {
				$document.on('click', removeTipbar);
			}, 1);

			function removeTipbar() {
				$timeout.cancel(timeout);
				tipbarElement.remove();
				$document.off('click', removeTipbar);
			}
		}

		// 弹出框确认
		this.tipbarDialog = function (element, msg, remark) {
			if (!element || element.getAttribute("bt-dialog") == 'true') {
				return $q.reject();
			} else {
				element.setAttribute("bt-dialog", true);
			}
			var defer = $q.defer();
			var tipbarElement = angular.element('<div class="bt-dialog"><div class="bt-dialog-arrow"></div><div class="bt-dialog-content">' +
				'<span class="bt-dialog-icon"></span>' + msg + '</div>' +
				(!remark ? '' : '<div class="bt-dialog-remark"><span>' + remark + '</span></div>') +
				'<div class="bt-dialog-button"><button class="bt-btn bt-small dialog-cancle">取消</button><button class="bt-btn bt-btn-info dialog-confirm">确认</button></div></div>');
			angular.element(element).parent().append(tipbarElement);

			//设置绝对定位
			var left = element.getBoundingClientRect().left + element.offsetWidth - tipbarElement[0].offsetWidth + 20;
			var top = element.getBoundingClientRect().top + document.body.scrollTop - tipbarElement[0].offsetHeight - 20;

			tipbarElement.css({ top: top + 'px', left: left + 'px' });

			tipbarElement
				.on('click', function (event) {
					if (angular.element(event.target).hasClass('dialog-confirm')) {
						tipbarElement.remove();
						element.setAttribute("bt-dialog", false);
						defer.resolve();
					} else if (angular.element(event.target).hasClass('dialog-cancle')) {
						tipbarElement.remove();
						element.setAttribute("bt-dialog", false);

						defer.reject();
					}
				});

			return defer.promise;
		};

	}
})();
(function () {
	'use strict';

	angular
		.module('app.core')
		.service('BtUtilService', BtUtilService);

	BtUtilService.$inject = ['$http', '$location', '$q', '$cacheFactory', '$log', '$timeout', 'BtRouterService', '$rootScope'];
	function BtUtilService($http, $location, $q, $cacheFactory, $log, $timeout, BtRouterService, $rootScope) {

		// 打开模态对话框
		this.open = function (options, callback) {
			options.callback = callback;
			$rootScope.$broadcast('addNewTab', options);
		};

		// 打开独立的模态对话框
		this.openModal = function (url, params, callback) {
			url = '/'+url;
			BtRouterService
				.getOptions(null, url, params)
				.then(function (opts) {
					$rootScope.$broadcast('addNewTab', opts);
				});
		}

		// 关闭模态对话框
		this.close = function (options, callback) {
			BtRouterService.close(options, callback);
		}

		// 路由级别的页面跳转
		this.go = function (url, params) {
			// 设置路由参数
			var domains = $location.absUrl().split(/bt_v=([^#]*)#/);
			if (domains.length == 1) {
				domains = $location.absUrl().split(/#/);

			}
			domains[1] = '?bt_v=' + new Date().getTime() + '#/';
			domains[2] = url;
			domains[3] = '';
			if (params) {
				domains[3] = [];
				angular.forEach(params, function (value, key) {
					domains[3].push(key + '=' + value);
				});
				domains[3] = '?' + domains[3].join('&');
			}

			// 刷新界面
			window.location.href = domains.join('');
		};

		// 遮罩层
		this.addSpin = function (element) {
			var toggleSpin = angular.element('<div class="bt-preloader"><img class="bt-loading-img" src="app/img/loading.gif" alt="正在加载中...." /></div>');
			element.append(toggleSpin);
			return toggleSpin;
		}
		this.removeSpin = function (element) {
			if (!element) return;
			element.remove();
		}

		//公共的控制台输出
		this.log = function (msg, type) {
			var type = type || 'log';
			$log[type](msg);
		}

		var urlCache = {}; // 阻止post重复提交
		//post方法
		this.post = function (url, params) {

			if (indexNum == 0) {
				return this.get(url);
			}

			// 一分钟之内只能请求一次
			if (urlCache[url] && new Date().getTime() - urlCache[url] < 1000 * 60) {
				return $q.reject(
					{
						status: 515,
						data: '1分钟之类不允许重复提交'
					});
			} else {
				urlCache[url] = new Date().getTime();
			}

			return $http.post(getUrl(url), params)
				.then(function (response) {

					delete urlCache[url];
					return response.data;
				}, function (error) {
					delete urlCache[url];
					return $q.reject(error);
				});
		};
		/**
		 get方法
		 url:路径地址
		 params:路径参数
		 cache:缓存
		 */
		this.get = function (url, params) {
			var config = { params: params };
			return $http.get(getUrl(url), config)
				.then(function (response) {

					return response.data;
				}, function (error) {

					return $q.reject(error);
				});
		};

		this.freshIframe = function (height) {
			// 兼容老系统的自适应高度
			var href = window.parent.location.href;
			var frameOld = href && (href.indexOf('scf2') || href.indexOf('p') || href.indexOf('scf'));
			if (frameOld) {
				var ifm = angular.element(window.parent.document.getElementsByName('content_iframe'));
				height = height || angular.element(document).find("html")[0].scrollHeight;
				setTimeout(function () {
					ifm.css('height', height + 'px');
				});
			}
		};

		/**
		 * 获取http缓存数据
		 * @param url
		 * @returns json数据
		 */
		this.cache = function (url) {
			var config = { cache: lru20 };
			return $http.get(getUrl(url), config)
				.then(function (response) {
					return response.data;
				});
		};
		// 获取测试环境的地址
		this.getUrl = getUrl;

		// 最近最少使用的缓存 Least Recently Used
		var lru20 = $cacheFactory('lru20', { capacity: 20 });

		//0代表是测试环境，1代表是真实环境
		var indexNum = ($location.host() === 'localhost' || $location.host().indexOf('static') === 0) ? 0 : 1;

		// [1]为测试环境，''、[2]根据$location来判断
		function getUrl(url) {
			var tmpUrl;
			if (angular.isArray(url)) {
				tmpUrl = url[indexNum] || '/byte/' + url[0];
			} else {
				tmpUrl = url;
			}
			return Api_Global_Var.baseUrl[indexNum] + tmpUrl;
		}
	}
})();
/**=========================================================
 * 表单效验的服务
 =========================================================*/
 (function() {
    'use strict';

    angular
        .module('app.core')
        .service('BtValidate', BtValidate);

    BtValidate.$inject = ['$timeout','BtRouterService','$parse','BtTipbar','$q'];
    function BtValidate($timeout,BtRouterService,$parse,BtTipbar,$q) {

        this.getFormEles = function(element){

            var formEles = {};

            var children = element[0].getElementsByTagName('*');
            var elements = new Array();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var eleValue = child.getAttribute('ng-model');
                if(eleValue && (child.getAttribute('required') === "" || 
                    child.getAttribute('ng-maxlength') || 
                    child.getAttribute('bt-pattern')) ){
                    formEles[eleValue] = {element:child};
                }
            }
            return formEles;
        }

	}
})();
(function() {
    'use strict';

    ApplicationConfiguration.registerModule('app.lazyload');
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES){

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
      });

    }
})();
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            //很漂亮的时间选择控件
            'flatpickr':          ['vendor/flatpickr/dist/flatpickr.min.css',
                                   'vendor/flatpickr/dist/flatpickr.min.js'],
            //97的时间选择控件
            'wdatePicker':        ['vendor/My97DatePicker/4.8-beta4/WdatePicker.js'],
            //下拉的字典选择
            'btDict':{
              files:              ['vendor/tools/dicTool.js',
                                   '../p/generate/lib/BTDictData.js'],
              serie:true
            },
            //动画效果的css
            'animate':            ['vendor/animate.css/animate.min.css'],
            'jquery':             ['vendor/jquery/jquery.js'],
            //spin效果的css
            'whirl':              ['vendor/whirl/dist/whirl.min.css'],
            'spinkit':            ['vendor/spinkit/css/spinkit.css'],
            //与spin效果类似
            'loaders.css':        ['vendor/loaders.css/loaders.css'],
            'chrome-tabs':        ['vendor/chrome-tabs/chrome-tabs.css'],
            'pdf':                ['vendor/pdfmake/build/pdfmake.min.js',
                                   'vendor/pdfmake/build/vfs_fonts.js'],
            'CSV-JS':             ['master/bower_components/CSV-JS/csv.js'],
            'flatdoc':            ['vendor/flatdoc/legacy.js',
                                   'vendor/flatdoc/flatdoc.js',
                                   'vendor/flatdoc/theme-white/style.css'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            //模板引擎
            'templates':          ['vendor/templates/art-template.js'],
            //css兼容
            'modernizr':          ['vendor/modernizr/modernizr.custom.js'],
            //百度图表
            'echarts':       ['vendor/echarts/dist/echarts.common.min.js']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'angularBootstrapNavTree',           files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                                'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'angularFileUpload',                 files: ['vendor/angular-file-upload/dist/angular-file-upload.js']},
            {name: 'bootstrap',                         files: ['vendor/bootstrap/dist/js/ui-bootstrap-tpls.min.js']},
            {name: 'ngImgCrop',                         files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                                'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ngWig',                             files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ui.grid',                           files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                                'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'ui.codemirror',                     files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'toaster',                           files: ['vendor/angularjs-toaster/toaster.min.js',
                                                                'vendor/angularjs-toaster/toaster.min.css']},
            {name: 'ueditor',                           files: ['vendor/angular-ueditor/ueditor.config.js',
                                                                'vendor/angular-ueditor/ueditor.all.js',
                                                                'vendor/angular-ueditor/angular-ueditor.js']},
            {name: 'ngDialog',                          files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                                'vendor/ngDialog/css/ngDialog.min.css',
                                                                'vendor/ngDialog/css/ngDialog-theme-default.min.css',
                                                                'vendor/ngDialog/css/ngDialog-theme-plain.css',
                                                                'vendor/ngDialog/css/ngDialog-custom-width.css']},
            {name: 'ui.select',                         files: ['vendor/angular-ui-select/dist/select.js',
                                                                'vendor/angular-ui-select/dist/select.css']},
            {name: 'ngTable',                           files: ['vendor/ng-table/dist/ng-table.min.js',
                                                                'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',                     files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'htmlSortable',                      files: ['vendor/html.sortable/dist/html.sortable.js',
                                                                'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'dragular',                          files: ['vendor/dragular/dist/dragular.min.css',
                                                                'vendor/dragular/dist/dragular.min.js']},
            {name: 'oitozero.ngSweetAlert',             files: ['vendor/sweetalert/dist/sweetalert.css',
                                                                'vendor/sweetalert/dist/sweetalert.min.js',
                                                                'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'mes',                               files: ['modules/mes/public/js/mes.module.js',
                                                                'modules/mes/public/js/mes.controller.js',
                                                                'modules/mes/public/js/bill.service.js',
                                                                'modules/mes/public/js/bill.controller.js',
                                                                'modules/mes/public/js/query.controller.js']},
            {name: 'tabs',                              files: ['app/modules/mes/public/tabs/controllers/tabs.controller.js',
                                                                'app/modules/mes/public/tabs/services/tabs.provider.js',
                                                                'app/modules/mes/public/tabs/services/tabs.service.js']},
            {name: 'docs1',                              files: ['app/modules/mes/public/tabs/controllers/tabs.controller.js',
                                                                'app/modules/mes/public/tabs/services/tabs.provider.js',
                                                                'app/modules/mes/public/tabs/services/tabs.service.js']}

          ]
        })
      ;

})();
/**=========================================================
 * 路由辅助工具
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .service('RouteHelpers', RouteHelpers)
    ;

    RouteHelpers.$inject = ['APP_REQUIRES'];
    function RouteHelpers(APP_REQUIRES) {

        this.basepath = basepath;
        this.resolveFor = resolveFor;

        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'app/views/' + uri;
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        function resolveFor() {
            var _args = angular.isArray(arguments[0]) ? arguments[0] : arguments;
            return {
                deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for(var i=0, len=_args.length; i < len; i ++){
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if(typeof _arg === 'function')
                            return promise.then(_arg);
                        else
                            return promise.then(function() {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load( whatToLoad );
                            });
                    }
                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        //自定义控制器
                        if (typeof(name) !== 'undefined' && name.indexOf("/")>=0)
                            return name;
                        if (APP_REQUIRES.modules)//angualr模块
                            for(var m in APP_REQUIRES.modules)
                                if(APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                                    return APP_REQUIRES.modules[m];
                        return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];//脚本
                    }

                }]};
        } // resolveFor
    }
})();
(function() {
    'use strict';

    ApplicationConfiguration.registerModule('app.routes',[]);
})();

(function() {
    'use strict';

    angular
        .module('app.routes')
        .run(routeRun);

    routeRun.$inject = ['$location','$rootScope'];
    function routeRun($location,$rootScope){

        
        
    }

})();
/**=========================================================
 * 侧边栏菜单的控制器
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.routes')
        .controller('BtRouterController', BtRouterController);

    BtRouterController.$inject = ['$scope'];
    function BtRouterController($scope) {

        activate();

        ////////////////

        function activate() {

        } // activate
    }

})();

/**=========================================================
 * 路由
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.routes')
        .directive('btView',btView);

    btView.$inject = ['BtRouterService','BtUtilService'];
    function btView(BtRouterService,BtUtilService){

        var tabsParent;

        var directive = {
        	restrict: 'A',
        	link: function(scope, element, attrs){

                BtRouterService.setTabScope(scope);

                // 获取父容器
                tabsParent = element;
                // 打开第一个界面
                openView({});

                // 开启监听
                scope.$on('addNewTab', function(event,options) {
                    var btTab = BtRouterService.open(options);
                    btTab
                        .openPromise.then(function($tabContent){
                            btTab.tabElment = $tabContent;
                            tabsParent.append($tabContent);
                            BtRouterService.addTabs(btTab);
                            window.top.scrollTo(0,0);
                            if(options.callback) options.callback();
                        });
                });

        	},
            controller:'BtRouterController'
        };

        function openView(options){

            BtRouterService
                .getOptions(options)
                .then(function(opts){
                    var btTab = BtRouterService.open(opts);
                    btTab
                        .openPromise.then(function($tabContent){
                            btTab.tabElment = $tabContent;
                            tabsParent.append($tabContent);
                            BtRouterService.addTabs(btTab);
                        });
                });
        }

        return directive;
        
    }

})();
/**=========================================================
 * 路由跳转服务
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.routes')
        .service('BtRouterService', BtRouterService);

    BtRouterService.$inject = ['$rootScope','$q','$http','$timeout','$compile','$controller','$location','$injector','RouteHelpers']
    function BtRouterService($rootScope,$q,$http,$timeout,$compile,$controller,$location,$injector,helper) {

        // 全局的id
        var globalID = 0;

        // 内部私有方法
        var privateMethods = {};

        // 模态框集合
        var scope ;

        this.setTabScope = function(cScope){
            scope = cScope;
            scope.btTabs = [];
        }

        privateMethods.closeDialog = this.close = function(options,callback){
            options = options || {};
            switch (options.closeIndex){
                case 100: // 关闭全部
                    scope.tabCurrent = scope.btTabs[0];
                    for (var i = scope.btTabs.length - 1; i > 0; i--) {
                        scope.btTabs.pop().close();
                    }
                    if(callback) callback();
                    break;
                case -1: // 关闭次上层
                    var length =  scope.btTabs.length;
                    if(length >2){  // 底层页面不能删除
                        scope.btTabs[length-2].close();
                        scope.btTabs[length-2] = scope.btTabs.pop();
                    }
                    break;
                default: // 关闭最上层
                    var tabCurrent = scope.btTabs.pop();
                    scope.tabCurrent = scope.btTabs[scope.btTabs.length-1];
                    tabCurrent.close();
                    if(callback) callback();
                    break;
            }
        };

        this.getCurTab = function(){
            return scope.tabCurrent.tabElment;
        };

        this.addTabs = function(btTabs){
            scope.btTabs.push(btTabs);
            scope.tabCurrent = btTabs;
        };

        // 获取options
        this.getOptions = function(opts,url, params){

            var defer = $q.defer();

            var path = url || $location.path();
            var controllerName = path.substring(1).replace(/\//g,".");
            var btParams = params || $location.search();
            var modulePaht = 'modules' + path;

            var options = {
                templateUrl:modulePaht+ '/index.html',
                controller:controllerName
            };

            $http
                .get(modulePaht + '/index.json',{ cache: true })
                .success(function(jsonData){
                    var exResolve = jsonData.initInfo.resolve;
                    exResolve.push(modulePaht + '/index.css');
                    exResolve.push(modulePaht + '/index.js');
                    options.resolve = angular.extend(helper.resolveFor(exResolve),{configVo:function(){
                        jsonData.configVo.btParams = btParams;
                        jsonData.configVo.modulePaht = modulePaht;
                        if(jsonData.configVo.BTServerPath){
                            angular.forEach(jsonData.configVo.BTServerPath,function(value,key) {
                               value[0] = value[0].replace(/Module_Path/, modulePaht);
                            })
                        }
                        return jsonData.configVo;
                    }});
                    defer.resolve(options);

                })
                .error(function(){
                    options.resolve = helper.resolveFor(modulePaht + '/index.css',modulePaht + '/index.js')
                    defer.resolve(options);
                });

            return defer.promise;
        }

        // 打开新界面
        this.open = function(options){

            var localID = ++globalID;
            var tabID = 'btTabID' + localID;

            // 成功加载后的，消息通知
            var openDefer = $q.defer();

            var resolve = angular.extend({}, options.resolve);
            angular.forEach(resolve, function (value, key) {
                resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
            });

            var scope;
            scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();

            var $tab;

            $q.all({
                template: loadTemplateUrl(options.templateUrl),
                locals: $q.all(resolve)
            }).then(function (setup) {

                var template = setup.template,
                locals = setup.locals;

                $tab = angular.element('<div id="' + tabID + '"></div>');
                $tab.attr("ng-class","{'bt-hidden':tabCurrent.id !== '"+tabID+"'}");//显示交给angular
                $tab.html(template);

                // scope数据传递
                if (options.data && angular.isString(options.data)) {
                    var firstLetter = options.data.replace(/^\s*/, '')[0];
                    scope.btData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : new String(options.data);
                } else if (options.data && angular.isObject(options.data)) {
                    scope.btData = options.data;
                }

                scope.closeThisDialog = function () {
                    privateMethods.closeDialog();
                };

                //绑定控制器
                if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {

                    var label;

                    if (options.controllerAs && angular.isString(options.controllerAs)) {
                        label = options.controllerAs;
                    }

                    var controllerInstance = $controller(options.controller, 
                        angular.extend(locals,{$scope: scope, $element: $tab}),
                        true,
                        label
                    );

                }

                $timeout(function () {
                    $compile($tab)(scope);
                    openDefer.resolve($tab);
                });
            
            },function(error){
                // console.log(error);
            });

            return {
                id: tabID,
                openPromise : openDefer.promise,
                close: function (value) {
                    $tab.remove();
                    scope.$destroy();
                }
            };

            // 加载html代码
            function loadTemplateUrl (tmpl, config) {
                var config = config || { cache: true };
                config.headers = config.headers || {};

                angular.extend(config.headers, {'Accept': 'text/html'});

                return $http.get(tmpl, config).then(function(res) {
                    
                    return res.data || '';
                });
            }
        }

        
    }
})();