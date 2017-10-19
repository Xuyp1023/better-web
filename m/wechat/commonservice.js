/*
* 业务公用服务模块设置
* 作者: binhg
*/

define(function(require,exports,module){

	exports.servPlus = function(mainApp){

		mainApp.service('commonService',['$rootScope',function($rootScope){
			return {
				/*
				 *加载各类字典列表
				*/
				queryDicList:function(path,param,dicName,callback,config){
					var _config = {
						name:'name',
						value:'value'
					};
					$.extend(_config,config);
					$.post(path,param,function(data){
						if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
							if(dicName){
								//填充字典数据
								var tempCustInfo = new ListMap();
								for(var index in data.data){
									var temp = data.data[index];
									tempCustInfo.set(temp[_config.value],temp[_config.name]);
								}
								BTDict[dicName] = tempCustInfo;
							}
							if(callback) callback(data.data);
						}
					},'json');
				},
				/*
				@param
					path 访问路径
					param 参数
					$scope 对应的作用域对象
					properName 要赋值得对象名
					dicName 字典名称
					config 补充参数

				@return AJAX的promise对象
				*/
				queryBaseInfoList : function(path,param,$scope,properName,dicName,config){
					var _config = {
						name:'name',
						value:'value',
						isChange:false//是否改装成name,value双值对
					};
					$.extend(_config,config||{});
					var promise = $.ajax({
						url:path,
						data:param,
						type:'POST',
						dataType:'json'
					});
					promise.success(function(data){
						if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
								var queue = [];
								if(dicName&&(dicName.length>0)){
									//填充字典数据
									var tempCustInfo = new ListMap();
									for(var index in data.data){
										var temp = data.data[index];
										tempCustInfo.set(temp[_config.value],temp[_config.name]);
										if(_config.isChange){
											queue.push({
												name:temp[_config.name],
												value:temp[_config.value]
											});
										}
									}
									BTDict[dicName] = tempCustInfo;
								}
								if((!!$scope)&&(!!properName)&&(properName.length>0)){
									$scope.$apply(function(){
										if(_config.isChange){
											$scope[properName] = queue;
										}else{
											$scope[properName] = data.data;
										}
									});
								}
						}
					});

					return promise;
				},

				/*
				*公用页面初始化方法
				*/
				initPage : function(call){
					call();
				}
			};

		}])
		/*
		HTTP AJAX相关框架，返回promise对象
		*/
		.service('http',['$q',function($q){
			//公用ajax方法
			function ajax(type,url,params,responseType){
				responseType = responseType||'json';
				return $.ajax({
					url:url,
					type:type,
					data:params,
					dataType:responseType
				});
			};
			return {
				/*
				  POST 方式
				*/
				post : function(url,params,responseType){
					return ajax('POST',url,params,responseType).success(function(data){
						if((!!data)&&(data.code === 401)){
							window.location.href = './index.html#/accountBind';
						}
					});
				},

				/*
				GET 方式
				*/
				get : function(url,params,responseType){
					return ajax('GET',url,params,responseType).success(function(data){
						if((!!data)&&(data.code === 401)){
							window.location.href = './index.html#/accountBind';
						}
					});
				},

				/*ajax 方法*/
				ajax : function(config){
					if(config.success||config.error||config.complete){
						try{
							delete config.success;
							delete config.error;
							delete config.complete;
						}catch(e){
							if(console) console.log('http服务:非promise回调函数销毁异常!');
						}
					}
					return $.ajax(config);
				}
			};
		}])


		//form特殊操作相关
		.service('form',[function(){
			return {
				/*
				getCheckedList
				@param
				@flag 是否只存储选中的checkbox的值  true是只存储
				*/
				getCheckedList : function($checkBoxList,config,flag){
					var _config = {
						trueFlag:false,
						falseFlag:false
					},
					resultArray = [];
					$.extend(_config,config||{});
					$checkBoxList.each(function(){
						var $that = $(this);
						if(this.checked === true){
							if(_config.trueFlag||(_config.trueFlag === 0)){
								resultArray.push(_config.trueFlag);
							}else{
								resultArray.push(this.value);
							}
						}else{
							if(!flag){
								if(_config.falseFlag||(_config.falseFlag === 0)){
									resultArray.push(_config.falseFlag);
								}else{
									resultArray.push('none');
								}
							}
						}
					});
					return resultArray;
				},
				/*
				setCheckedList
				*/
				setCheckedList : function($checkBoxList,config,checkedArray,flag){
					var _config = {
						trueFlag:false,
						falseFlag:false
					},
					resultArray = [];
					$.extend(_config,config||{});
					$checkBoxList.each(function(index){
						var $that = $(this);
						if(flag){
							for (var i = 0; i < checkedArray.length; i++) {
								var temp = checkedArray[i];
								if(temp+'' === this.value+''){
									this.checked = true;
								}else{
									this.checked = false;
								}
							}
						}else{
							var tempRe = checkedArray[index];
							if(_config.trueFlag||_config.trueFlag === 0){
								if(tempRe+'' === _config.trueFlag+''){
									this.checked = true;
								}else{
									this.checked = false;
								}
							}else{
								if(tempRe+'' === this.value+''){
									this.checked = true;
								}else{
									this.checked = false;
								}
							}
						}
					});
					return resultArray;
				},
				//获取所有的checkbox的值的数组或字符串
				getCheckboxValueArray:function($checkboxList,flag){
					var targetArray = [];
					$checkboxList.each(function(){
						if(this.checked){
							targetArray.push(this.value);
						}
					});
					return flag?targetArray.join(','):targetArray;
				}


			};
		}])

		.service('easyPlugin',function(){
			/*
			拆装ID并且组装方法
			*/
			function pakageTreeArray($treeElement,treeData){
				var targetArray = [];
				for (var i = 0; i < treeData.length; i++) {
					var temp = treeData[i];
					targetArray.push(temp);
					var tempData = $treeElement.tree('getData',temp.target),
						tempChildren = tempData.children;
					if(tempChildren&&(tempChildren.length>0)){
						targetArray = targetArray.concat(arguments.callee($treeElement,tempChildren));
					}
				}
				return targetArray
			}
			/*获取所有已选择的或半选的数据*/
			function pakageChekcedId(treeData,properName){
				var targetArray = [];
				for (var i = 0; i < treeData.length; i++) {
					var temp = treeData[i],
						$temp = $(temp.target);
					if($temp.find('.tree-checkbox1,.tree-checkbox2').length>0){
						targetArray.push(temp[properName||'id']);
					}
				}
				return targetArray.join(',');
			};
			return {
				/*
				获取tree所有选中与半选的ID
				*/
				getTreeCheckedId:function($treeElement){
					var roots = $treeElement.tree('getRoots');
					return pakageChekcedId(pakageTreeArray($treeElement,roots));
				}
			};
		})

		.service('muiSupport',['$timeout',function($timeout){
			return {
				/*
				 创建slide
				*/
				slide : function(selector,interval){
					interval = interval||5000;
					if(!mui){
						if(console) console.info('mui并未加载完成');
						return;
					}
					mui.init({swipeBack:true});
					var slider = mui(selector);
					slider.slider({
						interval:interval
					});

				},
				/*
				创建单项选择器
				*/
				singleSelect : function(listData){
					mui.init();
					var picker = new mui.PopPicker();
					picker.setData(listData);
					return picker;
				},
				//单时间控制
				dateSelect : function(config){
					mui.init();
					var _callee = arguments.callee;
					config.endYear = !!config.endYear?config.endYear:2099;
					config.beginYear = !!config.beginYear?config.beginYear:1900;
					var picker = new mui.DtPicker(config);
					picker.beginShow = function($scope,endPickerName,endDate,showFunc){
						this.show(function(res){
							var year = Number(res.y.text),
									month = Number(res.m.text),
									day = Number(res.d.text);
							$scope[endPickerName].dispose();
							$scope[endPickerName] = _callee({
								type:'date',
								value:endDate,
								beginYear:year,
								beginMonth:month,
								beginDay:day
							});
							if(typeof showFunc === 'function') showFunc(res);
						});
					};
					picker.endShow = function($scope,startPickerName,startDate,showFunc){
						this.show(function(res){
							var year = Number(res.y.text),
									month = Number(res.m.text),
									day = Number(res.d.text);
							$scope[startPickerName].dispose();
							$scope[startPickerName] = _callee({
								type:'date',
								value:startDate,
								endYear:year,
								endMonth:month,
								endDay:day
							});
							if(typeof showFunc === 'function') showFunc(res);
						});
					};
					return picker;
				},
				//创建关联日期列表
				crtLinkDate: function(startDate,endDate,splitFlag){
					splitFlag = splitFlag||'-';
					var startArray = startDate.split(splitFlag);
					var endArray = endDate.split(splitFlag);
					var begin = this.dateSelect({
						type:'date',
						value:startDate,
						endYear:Number(endArray[0]),
						endMonth:Number(endArray[1]),
						endDay:Number(endArray[2])
					});
					var end = this.dateSelect({
						type:'date',
						value:endDate,
						beginYear:Number(startArray[0]),
						beginMonth:Number(startArray[1]),
						beginDay:Number(startArray[2])
					});
					return {
						begin:begin,
						end:end
					};
				},

				/*展示浏览进度条*/
				showBar : function(){
					$('#progress').show();
				},
				/*隐藏浏览进度条*/
				hideBar : function(){
					$timeout(function(){
						$('#progress').hide();
					},1000);
				}
			};
		}])

		.service('cache',['$rootScope',function($rootScope){
			$rootScope.$$$cache = {};
			return {
				//存储缓存值
				put:function(key,value){
					$rootScope.$$$cache[key] = angular.extend({},value);
				},
				//获取缓存值
				get:function(key){
					return $rootScope.$$$cache[key];
				},
				remove:function(){
					delete $rootScope.$$$cache[key];
				},
				getParam:function(){
					var search = location.search,
						paramExpr = search.match(/([a-zA-Z0-9_]+=[a-zA-Z0-9_]+)/g),
						params= {};
					if(!!paramExpr){
						for (var i = 0; i < paramExpr.length; i++) {
							var expr = paramExpr[i];
							var set = expr.split('=');
							params[set[0]] = set[1]?set[1]:'';
						}
					}
					return params;
				}


			};
		}])

		//子组件与父组件互取数据
		.service('scopeBridge',[function(){
				return {
					/**
					*获取父scope对象
					*@param scope 传入要处理的scope上下文
					**/
					getParent:function(scope){
						return scope.$parent;
					},
					/**
					*获取首个子作用域
					*@param scope 传入要处理的scope上下文
					**/
					getChildHead:function(scope){
						return scope.$$childHead;
					},
					/**
					*获取尾部子作用域
					*@param scope 传入要处理的scope上下文
					**/
					getChildTail:function(scope){
						return scope.$$childTail;
					},
					/**
					*获取当前路由子作用域
					*@param scope 传入要处理的scope上下文
					**/
					getRouteScope:function($route){
						try{
							return $route.current.scope;
						}catch(e){}
						return {};
					},
					/**
					*获取父作用域某项值
					*@param
					*scope 传入要处理的scope上下文
					*properName 要获取到的作用域下的某项的属性名
					**/
					getParentProp:function(scope,properName){
						var scope = scope.$parent;
						if(scope&&scope[properName]) return angular.copy(scope[properName]);
						return {};
					},
					/**
					*获取头部子作用域某项值
					*scope 传入要处理的scope上下文
					*properName 要获取到的作用域下的某项的属性名
					**/
					getChildHeadProp:function(scope,properName){
						var scope = scope.$$childHead;
						if(scope&&scope[properName]) return angular.copy(scope[properName]);
						return {};
					},
					/**
					*获取尾部子作用域某项值
					*scope 传入要处理的scope上下文
					*properName 要获取到的作用域下的某项的属性名
					**/
					getChildTailProp:function(scope,properName){
						var scope = scope.$$childTail;
						if(scope&&scope[properName]) return angular.copy(scope[properName]);
						return {};
					}
				};
			}]);



	};
});
