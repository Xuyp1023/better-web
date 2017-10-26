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