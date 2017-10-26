(function () {
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
(function () {
	'use strict';

	angular
		.module('app.core')
		.config(coreConfig);

	coreConfig.$inject = ['$httpProvider'];
	function coreConfig($httpProvider) {

		// $httpProvider.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};
		// $httpProvider.defaults.transformRequest = function(obj){    // 只有post方法要用到这个
		//     var str = [];
		//     for(var p in obj)
		//         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		//     return str.join("&");
		// }

		// http请求的拦截器
		$httpProvider.interceptors.push(['$q', function ($q) {
			return {
				request: function (config) {
					//成功的请求方法
					return config;// 或者 $q.when(config);
				},
				response: function (response) {
					//响应成功
					return response;// 或者 $q.when(response);
				},
				requestError: function (rejection) {
					// 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
					// return rejection; //或新的promise
					// 或者，可以通过返回一个rejection来阻止下一步
					return $q.reject(rejection);
				},
				responseError: function (rejection) {
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

    }

})();
/**=========================================================
 * 时间选择的指令
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('btDate', btDate);

	btDate.$inject = ['$parse', '$timeout'];
	function btDate($parse, $timeout) {

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {

				element.attr("readonly", true);

				var config = scope.$eval(attrs.btDate) || {};
				if (attrs.longTerm) {
					var buttonEle = angular.element('<button class="bt-btn bt-btn-default bt-left-8">长期有效</button>');
					element.after(buttonEle);

					buttonEle
						.on('click', function () {
							$timeout(function () {
								$parse(attrs.ngModel).assign(scope, '2099-12-31');
								element.addClass("ng-dirty");
							}, 1);
						});
				}

				element
					.on('click', function (e) { e.stopPropagation(); })
					.on('click', function () {

						var elePos = element[0].getBoundingClientRect();

						var config = scope.$eval(attrs.btDate) || {};

						var inputElement = angular.element('<input>');
						var dateParam = {
							startDate: element[0].value,
							position: { left: elePos.left, top: (elePos.top + element[0].offsetHeight) },
							el: inputElement[0],
							dateFmt: config.dateFmt || 'yyyy-MM-dd',
							onpicked: function () {
								var modelDate = inputElement[0].value;
								$timeout(function () {
									$parse(attrs.ngModel).assign(scope, modelDate);
									element.addClass("ng-dirty");

									if(attrs.callback){
										$parse(attrs.callback)(scope);
									}
								}, 1);
							},
							oncleared: function () {
								$timeout(function () {
									$parse(attrs.ngModel).assign(scope, '');
									element.addClass("ng-dirty");
								}, 1);
							}
							// onpicking:function(){
							//     console.log('pick');
							// }
						};

						if (config.max) dateParam.maxDate = config.max;
						if (config.min) dateParam.minDate = config.min;

						window.WdatePicker(dateParam)
					});
			}
		};
	}
})();
/**=========================================================
 * 字典下拉的指令
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('btDict', btDict);

	btDict.$inject = ['$parse', 'BtUtil', '$compile'];
	function btDict($parse, BtUtil, $compile) {

		var directive = {
			restrict: 'EA',
			compile: compile,
			scope: {
				selectModel: '=ngModel'
			}
		};
		return directive;

		function compile(tElement, tAttrs, transclude) {

			var btAttrs = tAttrs.$attr;

			var selectElement = angular.element('<select></select>');
			if (tAttrs['class']) {
				selectElement.attr('class', tAttrs['class']);
			}
			selectElement.attr('ng-model', "selectModel");
			delete btAttrs.ngModel;
			if (btAttrs.options) {//自定义下拉显示
				delete btAttrs.options;
				selectElement.attr('ng-options', btAttrs.options + " for g in selectAttr");
			} else {
				selectElement.attr('ng-options', "g.key as g.value for g in selectAttr");
			}
			angular.forEach(btAttrs, function (value, key) {
				selectElement.attr(key, value);
			});

			return {
				pre: function (scope, iElement, iAttrs, controller) {
					if (tElement.children()) {//自定义默认选项
						selectElement.append(tElement.children());
					}
					var selectHtml = $compile(selectElement)(scope);
					tElement.replaceWith(selectHtml[0]);
				},
				post: link
			}
		}

		function link(scope, element, attrs, controller) {

			BtUtil
				.cache(['server/btDict/' + attrs.btDict + '.json', attrs.url])
				.then(function (jsonData) {
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
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('btForm', btForm)
    ;

  btForm.$inject = ['$parse', 'BtValidate', '$compile'];
  function btForm($parse, BtValidate, $compile) {

    var directive = {
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs, controller) {

      var formParams = $parse(attrs.btForm)(scope);
      if (!formParams) return;

      var formEles = BtValidate.getFormEles(element);

      formParams.validateInput = function (name, type) {

        if (!formEles[name]) return false;
        var element = formEles[name].element;
        var inputDirty = (element.className.indexOf('ng-dirty') !== -1);
        var inputValid = true;
        if (!type) {
          inputValid = (element.className.indexOf('ng-invalid') !== -1);
        } else if(type == 'myValidate'){
          inputValid = (element.className.indexOf('ng-invalid-' + type) !== -1) && 
            (element.className.split('ng-invalid') == 2);
        }else{
          inputValid = (element.className.indexOf('ng-invalid-' + type) !== -1);
        }

        if ((formParams.dirty || inputDirty) && inputValid) {
          return true;
        } else {
          return false;
        }
      }

      formParams.getValid = function () {

        if (!formParams.dirty) formParams.dirty = true;
        element.addClass('bt-dirty');
        if (validateForm()) {
          return true;
        } else {
          return false;
        }
      }

      function validateForm() {

        var result = true;
        angular.forEach(formEles, function (value, key) {
          if (value.element.className.indexOf('ng-invalid') !== -1) {
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
              TableService.searchRowData(tableParams, element);
            }
          }
        });

        tableParams.setDatasource = function (params) {

          tableParams.pageNum = tableParams.initPageNum || 1;
          tableParams.pageSize = tableParams.initPageSize || 10;

          tableParams.queryVo = params.queryVo;
          tableParams.searchUrl = params.searchUrl;

          TableService.searchRowData(tableParams, element);
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

						if(attrs.myValidate){
							var result = $parse(attrs.myValidate)(scope);
							ngModel.$setValidity('myValidate', true);
						}

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

    btUpload.$inject = ['$parse', 'BtUtil','$timeout'];
    function btUpload($parse, BtUtil,$timeout) {
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
                    var actionUrl = BtUtil.getUrl(['../scf2/testdata/uploadR.html?fileTypeName=','../Platform/CustFile/fileUpload?fileTypeName=']) +fileTypeName;
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
                                    var deleteEle = angular.element('<a class="bt-table-button">删除</a>');
                                    deleteEle
                                        .on('click',function(){
                                            
                                            scope.$apply(function(){
                                                $parse(attrs.btUpload).assign(scope,undefined);
                                            });
                                            deleteEle.remove();
                                            element.text('上传');
                                            initUpload();
                                        });
                                    element.text('');
                                    element.parent().prepend(deleteEle);
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

(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btSearch', btSearch) // 搜索
        ;

    btSearch.$inject = ['$timeout','BtUtil','$compile','$document'];
    function btSearch ($timeout,BtUtil,$compile,$document) {

        var directive = {
            restrict: 'A',
            link: link,
            scope:{
                selectData:'=ngModel',
                reqUrl:'@btSearch'
            }
        };
        return directive;

        function link(scope, element, attrs,controller){

            var downdHtml = '<div class="bt-hidden bt-search-downdrop">'+
                            '<li ng-repeat="item in listData" ng-click="select(item)">'+
                            '<span ng-bind="item.orgFullName"></span>'+
                            '</li>'+
                            '</div>';
            var downdEle =  angular.element(downdHtml);
            $compile(downdEle)(scope);
            element.after(downdEle);

            searchAndShow();

            scope.select = function(item){
                scope.selectData = item.orgFullName;
            }

            var cpLock = false;
            element
                .on('input propertychange',function () {
                    if (!cpLock) {
                        searchAndShow(element[0].value);
                    }
                });

            element
                .on('compositionstart',function () {
                    cpLock = true;
                });

            element
                .on('compositionend',function () {
                    cpLock = false;
                    searchAndShow(element[0].value);
                });

            element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click',function (e) {
                    if(downdEle.hasClass('bt-hidden')){
                        downdEle.removeClass('bt-hidden');
                        $timeout(function(){
                            $document.on('click', closeDropdown);
                        },1);
                    }
                });

            var timeout;
            function searchAndShow(value){
                if(timeout) $timeout.cancel(timeout);
                timeout = $timeout(function(){
                    // 请求后台
                    BtUtil
                        .post([(scope.reqUrl || 'server/http/test/test-input-search.json')],{value:value})
                        .then(function(jsonData){
                            scope.listData = jsonData.data;
                        });
                },100);
                return timeout;
            }

            function closeDropdown(){
                downdEle.addClass('bt-hidden');
                $document.off('click', closeDropdown);
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
                    if(row.lastElementChild.nodeName == 'A'){
                        divElement = angular.element('<div class="tab-pane"></div>');
                    }else{
                        divElement = angular.element(row.lastElementChild);
                        row.lastElementChild.remove();
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
                    currenTab = angular.element(e.target).parent();
                    currenTab.addClass('is-active');
                    tmpTabContent[currenTab.attr('index')].css('display','block');
                });
        	
        }
    }
})();
/**=========================================================
 * 服务-core-权限控制
 =========================================================*/
 (function () {
  'use strict';

  angular
    .module('app.core')
    .service('Author', Author);

  Author.$inject = ['$timeout'];
  function Author($timeout) {

    var userAuthor = window._userAuthor;

    /**
     * 检查权限
     */
    this.checkAuthor = function(domTree, options){

      var btns = domTree.find('[bt-author]');
      $.each(btns,function(index, item){
        var value = item.getAttribute('bt-author');
        var keys = value.split('-');
        var obj = userAuthor[keys[0]];
        if(obj && obj[keys[1]]){
        }else{
          item.remove();
        }
      });
    };

  }
})();
/**=========================================================
 * 打开对话框的服务
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .service('Dialog', Dialog);

  Dialog.$inject = ['$timeout', 'BtRouterService', '$q'];
  function Dialog($timeout, BtRouterService, $q) {

    var btView = angular.element(document.getElementById('bt-view'));
    var scopeAttr = [];

    this.close = function (callback) {
      if (scopeAttr.length > 0) {
        scopeAttr[scopeAttr.length - 1]();
      }
      if (callback) {
        callback();
      }
    }

    this.open = openDialog;

    // 打开独立的模态对话框
    this.go = function (url, params, callback) {

      url = '/' + url

      // 获取强约束的配置文件
      BtRouterService.getStrongConfig(url, params)
        .then(function (jsonData) {
          openDialog(jsonData, callback);
        })
        ;
    };

    // 打开模态对话框
    function openDialog(params, callback) {

      BtRouterService.loadHtml(params, function ($tab, scope) {

        var childrens = btView.children();
        var mianPage = angular.element(childrens[childrens.length - 1]);
        mianPage.addClass("bt-hidden");

        btView.append($tab);

        scope.closeThisDialog = function () {
          scopeAttr.pop();
          $tab.remove();
          mianPage.removeClass("bt-hidden");
          scope.$destroy();
        }
        scopeAttr.push(scope.closeThisDialog);
        if (callback) {
          callback();
        }
      });
    };

  }
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .service('TableService', TableService);

    TableService.$inject = ['BtUtil' ,'$templateCache','$compile','$filter'];
    function TableService(BtUtil ,$templateCache,$compile,$filter) {

      //查询列表数据
      this.searchRowData = function(tableParams ,tmpPageElement ,templateBody,headCheck){

        BtUtil.post(tableParams.searchUrl,angular.extend({},tableParams.queryVo,{pageNum:tableParams.pageNum,pageSize:tableParams.pageSize}))
          .then(function(jsonData){

            //设置分页查询的参数
            tableParams.totalCount = jsonData.page.totalCount;
            tableParams.pageSize = jsonData.page.pageSize;

            //更新表体部分
            tableParams.rowData = jsonData.data;

            //更新分页按钮视图
            updatePagerElement(tableParams ,tmpPageElement);

          },function(){
          });
      }

      //更新分页按钮视图
      function updatePagerElement(tableParams ,tmpPageElement){
        var render = template.compile($templateCache.get('gou/pager.html'));
        var config = {
          totalPages: Math.ceil( tableParams.totalCount / tableParams.pageSize ),
          currentPage: tableParams.pageNum,
          listPages:[]
        }

        if(config.totalPages < 6){
          for(var i=1;i<=config.totalPages;i++){
            config.listPages.push(getPageHtmlByIndex(i,config.currentPage));
          }
        }else {
          config.listPages.push(getPageHtmlByIndex(1,config.currentPage));
          if(config.currentPage -2 > 1){
            config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
          }
          var middlePage = config.currentPage - 2 > 1 ? (config.currentPage + 2 < config.totalPages ? config.currentPage:config.totalPages-2):1+2;
          config.listPages.push(getPageHtmlByIndex(middlePage-1,config.currentPage));
          config.listPages.push(getPageHtmlByIndex(middlePage,config.currentPage));
          config.listPages.push(getPageHtmlByIndex(middlePage+1,config.currentPage));
          if(config.currentPage +2 < config.totalPages){
            config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
          }
          config.listPages.push(getPageHtmlByIndex(config.totalPages,config.currentPage));
        }

        var html = render(config);  
        tmpPageElement[0].innerHTML = html;
      }

      function getPageHtmlByIndex(index,currentIndex){
        var is_current = (index==currentIndex)?'active':'';
        return '<button class="bt-btn bt-small pagination-link '+ is_current +'">'+ index +'</button>';
      }

    }
})();
/**=========================================================
 * tools提示的服务
 =========================================================*/
 (function() {
    'use strict';

    angular
        .module('app.core')
        .service('BtTipbar', BtTipbar);

    BtTipbar.$inject = ['$timeout','$document','$q'];
    function BtTipbar($timeout,$document,$q) {

        // 全局的消息提示
        this.pop = function(type, title, body, timeout){
            window.parent.pop(type, title, body, timeout);
        }

    	// 按钮点击的警告
    	this.tipbarWarning = function(element,msg,time){
    		if(!element){
    			return;
    		}
    		var tipbarElement = angular.element('<div class="tipbar-wrap">' + msg + '<div class="tipbar-wrap-arrow-left"></div></div>');
            angular.element(element).parent().append(tipbarElement);

    		//设置绝对定位
			var left = element.getBoundingClientRect().left - tipbarElement[0].offsetWidth-8;
			var top = element.getBoundingClientRect().top + document.body.scrollTop + ((element.offsetHeight - tipbarElement[0].offsetHeight) /2);

    		tipbarElement.css({top:top+'px',left:left+'px'});

    		var timeout = $timeout(function(){
    			tipbarElement.remove();
                $document.off('click',removeTipbar);
    		},time || 3000);

            $timeout(function(){
                $document.on('click',removeTipbar);
            },1);
            
            function removeTipbar(){
                $timeout.cancel(timeout);
                tipbarElement.remove();
                $document.off('click',removeTipbar);
            }
    	}

        // 弹出框确认
        this.tipbarDialog = function(element,msg,remark){
            if(!element || element.getAttribute("bt-dialog") == 'true'){
                return $q.reject();
            }else{
                element.setAttribute("bt-dialog",true);
            }
            var defer = $q.defer();
            var tipbarElement = angular.element('<div class="bt-dialog"><div class="bt-dialog-arrow"></div><div class="bt-dialog-content">'+
                '<span class="bt-dialog-icon"></span>' + msg + '</div>'+
                (!remark ?'':'<div class="bt-dialog-remark"><span>' + remark + '</span></div>') +
                '<div class="bt-dialog-button"><button class="bt-btn bt-small dialog-cancle">取消</button><button class="bt-btn bt-btn-info dialog-confirm">确认</button></div></div>');
            angular.element(element).parent().append(tipbarElement);

            //设置绝对定位
            var left = element.getBoundingClientRect().left + element.offsetWidth - tipbarElement[0].offsetWidth + 20 ;
            var top = element.getBoundingClientRect().top + document.body.scrollTop - tipbarElement[0].offsetHeight - 20;

            tipbarElement.css({top:top+'px',left:left+'px'});

            tipbarElement
                .on('click',function(event){
                    if(angular.element(event.target).hasClass('dialog-confirm')){
                        tipbarElement.remove();
                        element.setAttribute("bt-dialog",false);
                        defer.resolve();
                    }else if(angular.element(event.target).hasClass('dialog-cancle')){
                        tipbarElement.remove();
                        element.setAttribute("bt-dialog",false);

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
		.service('BtUtil', BtUtil);

	BtUtil.$inject = ['$http', '$location', '$q', '$cacheFactory', '$timeout'];
	function BtUtil($http, $location, $q, $cacheFactory, $timeout) {
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


		var urlCache = {}; // 阻止post重复提交
		//post方法
		this.post = function (url, params) {

			if (_isTest) {
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

		// 最近最少使用的缓存 Least Recently Used
		var lru20 = $cacheFactory('lru20', { capacity: 20 });
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
		function getUrl(url) {
      var tmpUrl;
      if (angular.isArray(url)) {
        if (_isTest || !url[1]) {
          tmpUrl = url[0];
        } else {
          tmpUrl = _baseUrl + url[1];
        }
      } else {
        tmpUrl = url;
      }
      return tmpUrl;
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
(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('btnumber', btnumber)
    .filter('btmoeny', btmoeny);

  // 235500001.11  235,500,001.11元
  btnumber.$inject = ['$sce', '$filter'];
  function btnumber($sce, $filter) {
    return function (data, props) {
      if (!data) return '';
      var dataStr = $filter('number')(data, 2).split('.');
      var textHtml = '<big><b>' + dataStr[0] + '.</b></big><small>' + dataStr[1] + '元</small>';
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
            'btDict':             ['vendor/tools/dicTool.js',
                                   'vendor/tools/BTDictData.js'],
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
(function () {
	'use strict';

	angular
		.module('app.routes')
		.directive('btView', btView);

	btView.$inject = ['BtRouterService'];
	function btView(BtRouterService) {

		var tabsParent;

		var directive = {
			restrict: 'A',
			link: function (scope, element, attrs) {

				// 获取强约束的配置文件
				BtRouterService.getStrongConfig()
					.then(function (jsonData) {
						BtRouterService.loadHtml(jsonData,function($tabContent){
							element.append($tabContent);
						});
					})
					;

			},
			controller: 'BtRouterController'
		};

		return directive;

	}

})();
/**=========================================================
 * 路由跳转服务
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.routes')
		.service('BtRouterService', BtRouterService);

	BtRouterService.$inject = ['$rootScope', '$q', '$http', '$timeout', '$compile', '$controller', '$location', '$injector', 'RouteHelpers','Author']
	function BtRouterService($rootScope, $q, $http, $timeout, $compile, $controller, $location, $injector, helper,Author) {

		this.getStrongConfig = function (url,params) {

			var defer = $q.defer();

			var path =  'ng' +(url || $location.path());
			var btParams = params || $location.search();

			var options = {
				templateUrl: path + '/index.html',
				controller: (params && params.controller) || 'MainController'
			};

			$http
				.get(path + '/index.json',{ cache: true })
				.success(function (jsonData) {

					var exResolve = jsonData.initInfo.resolve;
					exResolve.push(path + '/index.css');
					exResolve.push(path + '/index.js');

					options.resolve = angular.extend(helper.resolveFor(exResolve), {
						configVo: function () {
							jsonData.configVo.btParams = btParams;
							jsonData.configVo.modulePaht = path;

							if(jsonData.configVo.BTServerPath){
								angular.forEach(jsonData.configVo.BTServerPath,function(value,key) {
									 value[0] = value[0].replace(/Module_Path/, path);
									})
							}

							return jsonData.configVo;
						}
					});
					defer.resolve(options);

				});
			return defer.promise;
		}
		// 加载html代码
		this.loadHtml = function (options,callback) {

			var resolve = angular.extend({}, options.resolve);
			angular.forEach(resolve, function (value, key) {
					resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
			});

			$q.all({
				template: loadTemplateUrl(options.templateUrl),
				locals: $q.all(resolve)
			}).then(function (setup) {

				var template = setup.template,
					locals = setup.locals;

				var $tab = angular.element('<div></div>');
				$tab.html(template);
				Author.checkAuthor($tab);

				var scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();

				//绑定控制器
				if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {

					var label;
					if (options.controllerAs && angular.isString(options.controllerAs)) {
						label = options.controllerAs;
					}

					var controllerInstance = $controller(options.controller,
						angular.extend(locals, { $scope: scope, $element: $tab }),
						true,
						label
					);

					if(typeof controllerInstance === 'function'){
						$tab.data('$tabControllerController', controllerInstance());
					} else {
						$tab.data('$tabControllerController', controllerInstance);
					}
				}

				$timeout(function () {
					$compile($tab)(scope);
					callback($tab,scope);
				});
			});
		}

		// 加载html代码
		function loadTemplateUrl(tmpl, config) {
			var config = config || { cache: true };
			config.headers = config.headers || {};

			angular.extend(config.headers, { 'Accept': 'text/html' });

			return $http.get(tmpl, config).then(function (res) {

				return res.data || '';
			});
		}


	}
})();