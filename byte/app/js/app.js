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
        $httpProvider.defaults.transformRequest = function(obj){    // 只有post方法要用到这个
            var str = [];
            for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }

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

    appRun.$inject = [];
    function appRun() {    

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

    }

})();
/**=========================================================
 * 时间选择的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btDate', btDate);

    btDate.$inject = ['$parse', 'BtUtilService','$timeout'];
    function btDate($parse, BtUtilService,$timeout) {

    	return {
            restrict:'A',
            link:function(scope, element, attrs){

                element[0].value =  $parse(attrs.btDate)(scope);

                element
                    .on('click', function (e) { e.stopPropagation(); })
                    .on('click',function () {

                        var dateParam = {
                            startDate:element[0].value,
                            readOnly:true,
                            el:element[0],
                            dateFmt:attrs.dateFmt || 'yyyy-MM-dd',
                            onpicked: function(){
                                $timeout(function(){
                                    var modelDate = element[0].value;
                                    $parse(attrs.btDate).assign(scope,modelDate);
                                    // scope[attrs.btDate] = modelDate
                                },1);
                            },
                            oncleared:function(){
                                $timeout(function(){
                                    $parse(attrs.btDate).assign(scope,undefined);
                                    // scope[attrs.btDate] = undefined;
                                },1);
                            }
                            // onpicking:function(){
                            //     console.log('pick');
                            // }
                        };

                        var max = attrs.btMaxDate?'#F{$dp.$D(\''+attrs.btMaxDate+'\')}':false,
                        min = attrs.btMinDate?'#F{$dp.$D(\''+attrs.btMinDate+'\')}':false;

                        if(max) dateParam.maxDate = max;
                        if(min) dateParam.minDate = min;

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

    btDict.$inject = ['$parse', 'BtUtilService'];
    function btDict($parse, BtUtilService) {
    	return {
    		restrict: 'A',
    		// scope: {},
    		link: function(scope, element, attrs){

    			var options = attrs.ngOptions.split(' ');
    			var optionName = options[options.length -1];

    			BtUtilService
    				.cache(['server/btDict/'+attrs.btDict + '.json'])
    				.then(function(jsonData){
    					scope[optionName] = jsonData;
    				});
    		}
    	}
    }
})();

/**=========================================================
 * 文件上传的指令
 =========================================================*/
(function() {
    'use strict';

    // angular
    //     .module('app.core')
    //     .directive('btUpload', btUpload);

    // btUpload.$inject = ['$parse', 'BtUtilService'];
    // function btUpload($parse, BtUtilService) {
    // 	return {
    // 		restrict: 'E',
    //         replace: true,
    //         template: '<label for="bt_upload_file">上传文件</label>',
    // 		// scope: {},
    // 		link: function(scope, element, attrs){

    // 			// 先创建input对象
    //             var input = document.createElement('input');
    //             input.setAttribute('id', 'bt_upload_file');
    //             input.setAttribute('type', 'file');
    //             input.setAttribute('name', 'Filedata');
                
    //             input.style = 'position:absolute;clip:rect(0 0 0 0)';

    //             element.append(input);
    // 		}
    // 	}
    // }
})();

/**=========================================================
 * 分页查询的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btPagination', btPagination);

    btPagination.$inject = ['$parse', 'BtUtilService','BtTipbar'];
    function btPagination($parse, BtUtilService,BtTipbar) {
        return {
            restrict: 'A',
            template: 
              '<ul>'+
                '<li class="previous" ng-class="{disabled:conf.pageNum<=1}" ng-click="pageEmitter.firstPage()"><a href="javascript:void(0);">首页</a></span></li>'+
                '<li class="previous" ng-class="{disabled:conf.pageNum<=1}" ng-click="pageEmitter.prevPage()"><a href="javascript:void(0);">上一页</a></li>'+
                '<li class="next" ng-class="{disabled:conf.pageNum>=conf.pages}" ng-click="pageEmitter.nextPage()"><a href="javascript:void(0);">下一页</a></li>'+
                '<li class="next" ng-class="{disabled:conf.pageNum>=conf.pages}" ng-click="pageEmitter.endPage()"><a href="javascript:void(0);">尾页</a></li>'+
                '<li>共<span ng-bind="conf.pageNum"></span>/<span ng-bind="conf.pages"></span>页</li>'+
                '<li>共<span ng-bind="conf.total"></span>条记录</li>'+
                '<li class="toPage">'+
                    '<div>'+
                      '<span>跳转到&nbsp;</span>'+
                      '<input type="number"  ng-model="conf.skipToNum" ng-disabled="conf.pages<=1">'+
                      '<span>&nbsp;页</span>'+
                      '<button class="btn" ng-disabled="conf.pages<=1" ng-click="pageEmitter.skipPage($event)">跳转</button>'+
                    '</div>'+   
                '</li>'+
              '</ul>',
            //分页参数配置
            scope: {
              conf: '=btPagination',
              func: '&func'
            },
            link: function(scope, element, attrs){

              function reFreshBindList(){
                  var func = attrs.func;
                  var pageFunc = $parse(func);
                  pageFunc(scope.$parent);
              }

              scope.pageEmitter={
                  //分页事件
                  firstPage : function(){
                      scope.conf.pageNum=1;
                      reFreshBindList();
                  },
                  endPage : function(){
                      scope.conf.pageNum=scope.conf.pages;
                      reFreshBindList();
                  },
                  prevPage : function(){
                      scope.conf.pageNum--;
                      reFreshBindList();
                  },
                  nextPage : function(){
                      scope.conf.pageNum++;
                      reFreshBindList();
                  },
                  skipPage : function(event){
                      var num = scope.conf.skipToNum;
                      if(!num || Number(num)<1||Number(num)>scope.conf.pages){
                          scope.conf.skipToNum = '';
                          //数字输入错误以后给予提示
                          BtTipbar.errorTipbarWithTime(event.target,'请填写正确的页数!',3000)
                          return;
                      }
                      scope.conf.pageNum = scope.conf.skipToNum;
                      scope.conf.skipToNum = '';
                      reFreshBindList();
                  }
              };
            }


        };
    }
})();
/**=========================================================
 * 数字转中文大写的过滤器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('numberFilter', numberFilter);

    function numberFilter() {
        return filterFilter;

        ////////////////
        function filterFilter(data, props) {

          var result = '';

          if(data){

            console.log(1);

            var numMap = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];

            angular.forEach(data.split(''),function(number){
              result = result + numMap[Number(number)];
            });
            
          }
          return result;
          
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

    BtTipbar.$inject = ['$timeout','$document'];
    function BtTipbar($timeout,$document) {

    	// 错误提示
    	this.errorTipbarWithTime = function(element,msg,time){
    		if(!element){
    			return;
    		}
    		var tipbarElement = angular.element('<div class="tipbar-wrap">' + msg + '<div class="tipbar-wrap-arrow-left"></div></div>');
            angular.element(element).parent().append(tipbarElement);
    		// BtRouterService.getCurTab().append(tipbarElement);

    		//设置绝对定位
			var left = element.offsetLeft - tipbarElement[0].offsetWidth-8;
			var top = element.offsetTop + ((element.offsetHeight - tipbarElement[0].offsetHeight) /2);

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

        // 错误提示
        this.errorTipbar = function(element,msg){
            if(!element){
                return;
            }
            var tipbarElement = angular.element('<div class="tipbar-wrap">' + msg + '<div class="tipbar-wrap-arrow-left"></div></div>');
            angular.element(element).parent().append(tipbarElement);
            // BtRouterService.getCurTab().append(tipbarElement);

            //设置绝对定位
            var left = element.offsetLeft - tipbarElement[0].offsetWidth-8;
            var top = element.offsetTop + ((element.offsetHeight - tipbarElement[0].offsetHeight) /2);

            tipbarElement.css({top:top+'px',left:left+'px'});

            return tipbarElement;

        }

	}
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        //类别过滤器
        .filter('kindf',function(){
          return function(data,listName){
            if(!BTDict[listName]) return '----';
            return BTDict[listName].get(data);
          };
        })
        .service('BtUtilService', BtUtilService);

    BtUtilService.$inject = ['$http', '$location', '$q', '$cacheFactory','$log','$timeout','BtRouterService','$rootScope'];
    function BtUtilService($http, $location, $q, $cacheFactory,$log,$timeout,BtRouterService,$rootScope) {

        // 打开模态对话框
        this.open = function(options,callback){
            options.callback = callback;
            $rootScope.$broadcast('addNewTab',options);
        };

        // 关闭模态对话框
        this.close = function(options,callback){
            BtRouterService.close(options,callback);
        }

        // 路由级别的页面跳转
        this.go = function(url,params){
            // 设置路由参数
            var domains = $location.absUrl().split(/bt_v=([^#]*)#/);
            if(domains.length ==1){
                domains = $location.absUrl().split(/#/);
                
            }
            domains[1] = 'bt_v=' + new Date().getTime() +'#/';
            domains[2] = url;
            domains[3] = '';
            if(params){
                domains[3] = [];
                angular.forEach(params,function(value, key){
                    domains[3].push(key + '=' + value);
                });
                domains[3] = '?' + domains[3].join('&');
            }
            
            // 刷新界面
            window.location.href = domains.join('');
        };

        var toggleSpin = undefined;
        // 遮罩层
        this.toggleSpin = function(type){
            if(toggleSpin){
                toggleSpin.remove();
            }else{
                toggleSpin = angular.element('<div class="bt-preloader"><img class="bt-loading-img" src="app/img/loading.gif" alt="正在加载中...." /></div>');
                BtRouterService.getCurTab().append(toggleSpin);
            }
        }

        // toaster方式的提示信息
        this.pop = function(msg,type){
            
        }

        // 父级和子集的iframe，后面同步需要用到
        var ifm,subHmtl;
        this.bindIframe = function(parentIfm,childIfm){
            ifm = parentIfm;
            subHmtl = childIfm;
        }
        //自适应iframe高度
        this.freshIframe = function(){
            $timeout(function(){
                ifm.css('height',subHmtl.scrollHeight +'px');
            },1);
        };

        //公共的控制台输出
        this.log = function(msg,type){
            var type = type || 'log';
            $log[type](msg);
        }

        var urlCache = {}; // 阻止post重复提交
        //post方法
        this.post = function(url,params){

            if(indexNum == 0){
                return this.get(url);
            }

            // 一分钟之内只能请求一次
            if(urlCache[url] && new Date().getTime() - urlCache[url] < 1000 * 60 ){
                return $q.reject(
                {
                    status:515,
                    data:'1分钟之类不允许重复提交'
                });
            }else{
                urlCache[url] = new Date().getTime();
            }
            
            return $http.post(getUrl(url),params)
                .then(function(response){

                    delete urlCache[url];
                    return response.data;
                },function(error){
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
        this.get = function(url,params){
            var config = {params:params};
            return $http.get(getUrl(url),config)
                .then(function(response){

                    return response.data;
                },function(error){

                    return $q.reject(error);
                });
        };

        /**
         * 获取http缓存数据
         * @param url
         * @returns json数据
         */
        this.cache = function (url) {
            var config = {cache:lru20};
            return $http.get(getUrl(url),config)
                .then(function(response){
                    return response.data;
                },errorHandler);
        };

        // 最近最少使用的缓存 Least Recently Used
        var lru20 = $cacheFactory('lru20',{capacity: 20});

        //0代表是测试环境，1代表是真实环境
        var indexNum = ($location.host() ===  'localhost' || $location.host().indexOf('static') === 0) ? 0:1;

        function getUrl(url) {
            var tmpUrl;
            if(angular.isArray(url)){
                tmpUrl = url[indexNum] || '/byte/'+url[0];
            }else{
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

    	// 效验
    	this.validate = function(options, context){
            // 重复提交效验
            if(options.isOnValid){
                return $q.reject({code:406,data:'请不要重复提交'});
            }else{
                options.isOnValid = true;
            }
            // 错误效验
            if(options.errorObj){
                options.isOnValid = false;
                if(angular.toJson(options.errorObj) === '{}' ){
                    return $q.when({code:200,data:'效验通过'});
                }else{
                    return $q.reject({code:407,data:'效验不通过'});
                }
            }else{
                options.context = context;
                options.errorObj = _valueValidate(options);
            }

            var errorObj = options.errorObj;
            var formEle = document.getElementById(options.formId);

            var children = formEle.getElementsByTagName('*');
            var elements = new Array();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var eleValue = child.getAttribute('ng-model') || child.getAttribute('bt-date');
                if(eleValue && options.BTmap[eleValue]){

                    var tipbarElement = null;
                    if(errorObj[eleValue]){
                        tipbarElement = BtTipbar.errorTipbar(child,errorObj[eleValue]);
                    }
                    _bindEvent(options.context , options.BTmap[eleValue] , errorObj , child , tipbarElement);
                }
            }

            // 恢复效验
            options.isOnValid = false;
            if(angular.toJson(options.errorObj) === '{}' ){
                return $q.when({code:200,data:'效验通过'});
            }else{
                return $q.reject({code:407,data:'效验不通过'});
            }
	   }

        // scope变量效验
        function _valueValidate(options){

            var errorObj = {};
            var elements = options.elements;
            options.BTmap = {};

            for (var i = elements.length - 1; i >= 0; i--) {
                
                options.BTmap[elements[i].name] = elements[i];

                var rules = elements[i].rules;
                for (var j = rules.length - 1; j >= 0; j--) {

                    var errMsg = _detailValidate(options.context,elements[i].name,rules[j]);
                    if(errMsg){
                        errorObj[elements[i].name] = errMsg;
                        break;
                    }
                }
            }
            return errorObj;
        }

        // 各种效验条件
        function _detailValidate(context,name,rule){
            var errMsg = undefined;
            switch (rule.name){
                case 'required':    //必填效验
                    var value = $parse(name)(context);
                    if(!value) {
                        errMsg = '此项必须填写';
                    }
                    break;
            }
            return errMsg;
        }

        // 绑定效验触发事件
        function _bindEvent(context, eleObj ,errObj, element, tipbarElement){
            var aElement = angular.element(element);
            var events = eleObj.events;
            aElement.bind('focus',focusEvent);
            for (var i = events.length - 1; i >= 0; i--) {
                aElement.bind(events[i],eventsBind);
            }

            function eventsBind(event){

                var rules = eleObj.rules;
                for (var i = rules.length - 1; i >= 0; i--) {
                    var errMsg = _detailValidate(context, eleObj.name, rules[i]);
                    if(errMsg){
                        errObj[eleObj.name] = errMsg;
                        tipbarElement = BtTipbar.errorTipbar(element,errMsg);
                        return;
                    }
                }
                delete errObj[eleObj.name];
            }

            function focusEvent(){
                if(tipbarElement)
                    tipbarElement.remove(); // 效验通过后移除
            }
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
            'btDict':             ['vendor/tools/dicTool.js'],
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
            //bulma css
            'bulma':              ['vendor/bulma/css/bulma.css'],
            //font-awesome 图标
            'font-awesome':       ['vendor/fontawesome/css/font-awesome.min.css'],
            //simple-line 图标
            'simple-line':              ['vendor/simple-line-icons/css/simple-line-icons.css']
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
                        if (typeof(name) !== 'undefined' && name.indexOf("/")>0)
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

                var ifm = angular.element(window.parent.document.getElementsByName('content_iframe'));
                var subHmtl = angular.element(document).find("html")[0];
                BtUtilService.bindIframe(ifm,subHmtl);

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
                            BtUtilService.freshIframe();
                            if(options.callback) options.callback();
                        });
                });

                scope.freshIframe = function(){
                    BtUtilService.freshIframe();
                };

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
                            BtUtilService.freshIframe();
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
                        scope.btTabs.pop().tabElment.remove();
                    }
                    if(callback) callback();
                    break;
                default: // 关闭最上层
                    var tabCurrent = scope.btTabs.pop();
                    scope.tabCurrent = scope.btTabs[scope.btTabs.length-1];
                    scope.freshIframe();
                    tabCurrent.tabElment.remove();
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
        this.getOptions = function(opts){

            var defer = $q.defer();

            var path = $location.path();
            var controllerName = path.substring(1).replace(/\//g,".");
            var btParams = $location.search();
            var modulePaht = 'modules' + path;

            var options = {
                templateUrl:modulePaht+ '/index.html',
                controller:controllerName
            };

            $http
                .get(modulePaht + '/index.json')
                .success(function(jsonData){
                    var exResolve = jsonData.initInfo.resolve;
                    exResolve.push(modulePaht + '/index.css');
                    exResolve.push(modulePaht + '/index.js');
                    options.resolve = angular.extend(helper.resolveFor(exResolve),{configVo:function(){
                        jsonData.configVo.btParams = btParams;
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
                }
            };

            // 加载html代码
            function loadTemplateUrl (tmpl, config) {
                var config = config || {};
                config.headers = config.headers || {};

                angular.extend(config.headers, {'Accept': 'text/html'});

                return $http.get(tmpl, config).then(function(res) {
                    
                    return res.data || '';
                });
            }
        }

        
    }
})();