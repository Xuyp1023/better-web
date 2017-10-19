/*
* 业务公用服务模块设置
* 作者: binhg
*/

define(function(require,exports,module){

	exports.servPlus = function(mainApp,isSpa){
		/*
		HTTP AJAX相关框架，返回promise对象
		*/
		mainApp.service('http',['$q',function($q){
			if(typeof window.parent.$$$ajaxTokenMap !== 'object'){
				window.parent.$$$ajaxTokenMap = {};
			}

			//创建存入
			function setTokenMap(){
				if(typeof window.parent.$$$ajaxTokenMap !== 'object'){
					window.parent.$$$ajaxTokenMap = {};
				}
			}


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

			//禁用
			return {
				/*
				  POST 方式
				*/
				post : function(url,params,responseType,tokenFlag){
					setTokenMap();
					//判断是否频繁提交
					if((!!tokenFlag)&&(window.parent.$$$ajaxTokenMap[tokenFlag] === window.parent.$$$ajaxTokenMap[tokenFlag+'prev'])){
						return;
					}
					tokenFlag = tokenFlag||'default';
					params.AjaxToken = window.parent.$$$ajaxTokenMap[tokenFlag];
					window.parent.$$$ajaxTokenMap[tokenFlag+'prev'] = window.parent.$$$ajaxTokenMap[tokenFlag];
					return ajax('POST',url,params,responseType).complete(function(){
						window.parent.$$$ajaxTokenMap[tokenFlag] = new Date().getTime();
					});
				},

				/*
				GET 方式
				*/
				get : function(url,params,responseType,tokenFlag){
					setTokenMap();
					//判断是否频繁提交
					if((!!tokenFlag)&&(window.parent.$$$ajaxTokenMap[tokenFlag] === window.parent.$$$ajaxTokenMap[tokenFlag+'prev'])){
						return;
					}
					tokenFlag = tokenFlag||'default';
					params.AjaxToken = window.parent.$$$ajaxTokenMap[tokenFlag];
					window.parent.$$$ajaxTokenMap[tokenFlag+'prev'] = window.parent.$$$ajaxTokenMap[tokenFlag];
					return ajax('GET',url,params,responseType).complete(function(){
						window.parent.$$$ajaxTokenMap[tokenFlag] = new Date().getTime();
					});;
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
				},

				/**
				*初始化发送token
				**/
				initTokenMap : function(flagList){
					setTokenMap();
					if(typeof flagList !== 'object'||!(flagList instanceof Array)){
						throw new Error('请传入正确的Token代称的列表!');
					}
					window.parent.$$$ajaxTokenMap['default'] = new Date().getTime();
					for (var i = 0; i < flagList.length; i++) {
						var flag = flagList[i];
						window.parent.$$$ajaxTokenMap[flag] = new Date().getTime();
					}
				},

				/**
				*刷新Token
				**/
				reFreshToken : function(flag){
					setTokenMap();
					window.parent.$$$ajaxTokenMap[flag] = new Data().getTime();
				}

			};
		}])
		/**
		*公用服务方法集
		**/
		.service('commonService',['$rootScope','http',function($rootScope,http){
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
					http.post(path,param,function(data){
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
					var promise = http.ajax({
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
		
		.service('toLoad',['$rootScope',function($rootScope){
			var toggleSpin=undefined;			
			return{				
		        // 遮罩层
		        toggleSpin:function(type){
		            if(toggleSpin){
		                toggleSpin.remove();
		            }else{
		                toggleSpin = angular.element('<div class="bt-preloader"><img class="bt-loading-img" src="img/loading.gif" alt="正在加载中...." /></div>');
		                $(document).find('body').append(toggleSpin);
		            }
		        }
			}
		}])
		//form特殊操作相关
		.service('form',['$parse',function($parse){
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
				},

				//checkbox专用方法集
				installCheckboxTools : function($scope){
					function _addKey4ArrayObj(array,keyName,defaultValue){
						var targetArray = [];
						for (var i = 0; i < array.length; i++) {
							var temp = array[i];
							temp[keyName] = defaultValue;
							targetArray.push(temp);
						}
						return targetArray;
					}
					$scope.$$changeIsAllChecked = function(target,allCheckVm,checkboxVmList,checkProperName){
						if(!target.checked){
							$parse(allCheckVm).assign($scope,false);
						}else{
							var checkboxList = $parse(checkboxVmList)($scope),
							isAllCheck = true;
							for (var i = 0; i < checkboxList.length; i++) {
								var checkbox = checkboxList[i];
								if(!checkbox[checkProperName]){
									isAllCheck = false;
								}
							}
							$parse(allCheckVm).assign($scope,isAllCheck);
						}
					};

					$scope.$$toggleAllChecked = function(allCheckVm,checkboxVmList,checkProperName){
						if($parse(allCheckVm)($scope)){
							$parse(checkboxVmList).assign($scope,_addKey4ArrayObj($parse(checkboxVmList)($scope),checkProperName,true));
						}else{
							$parse(checkboxVmList).assign($scope,_addKey4ArrayObj($parse(checkboxVmList)($scope),checkProperName,false));
						}
					};
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
			}
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


		.service('detailShow',['commonService',function(commonService){
			return {
				/*
					查询 融资凭据详情  订单|汇票|应收
				*/
				getFinanceCredentialDetail: function($scope,type,id){
					var config = {
						order:{
							    url:BTPATH.FIND_ORDER_DETAIL,
							    box_id:'proof_order_detail_box'
							},
						draft:{
							    url:BTPATH.FIND_DRAFT_DETAIL,
							    box_id:'proof_draft_detail_box'
							},
						recieve:{
							    url:BTPATH.FIND_RECIEVE_DETAIL,
							    box_id:'proof_recieve_detail_box'
							}
						},
						url = config[type].url,
						box_id = config[type].box_id;

					return $.post(url,{id:id},function(data){
						if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
							$scope.$apply(function(){
								$scope.proof_info = data.data;
							});
						}
						//查询 其他资料 和 附件信息
					    commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{id:data.batchNo},$scope,'proof_infoFileList').success(function(){
					      	commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{id:data.otherBatchNo},$scope,'proof_otherFileList').success(function(){
					          $scope.openRollModal(box_id);
					        });
					    });

					},'json');
				}
			};
		}])


		.service('cache',['$rootScope',function($rootScope){
			if(typeof window.parent.$$$cache !== 'object'){
				window.parent.$$$cache = {};
			}
			return {
				//存储缓存值
				put:function(key,value){
					var isObject = typeof value === 'object';
					window.parent.$$$cache[key] = isObject?angular.extend({},value):value;
				},
				//获取缓存值
				get:function(key){
					return window.parent.$$$cache[key];
				},
				remove:function(key){
					delete window.parent.$$$cache[key];
				}


			};
		}])

		/*上传相关组件*/
		.service('upload',['$rootScope',function($rootScope){
			return {
				regUpload:function($scope){

					//开启上传(下拉选择附件) 多种类型
				    $scope.openUploadDropdown = function(event,typeList,list,isNew){
					     $scope.uploadConf = {
					        //上传触发元素
					        event:event.target||event.srcElement,
					        //存放上传文件
					        uploadList:$scope[list],
					        //附件类型列表
					        typeList:$scope[typeList]
					     };
					     // if(isNew) $scope.uploadConf.imgPath = 'img/operator.png';
				    };

				    //开启上传 单个		isNew|该参数已弃用
				    $scope.openUpload = function(event,type,typeName,list,isNew){
				    	$scope.uploadConf = {
				    		//上传触发元素
				    		event:event.target||event.srcElement,
				    		//上传附件类型
				    		type:type,
				    		//类型名称
				    		typeName:typeName,
				    		//存放上传文件
				    		uploadList:$scope[list]
				    	};
				    	// if(isNew) $scope.uploadConf.imgPath = 'img/operator.png';
				    };

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


		/**
		*统一获取auth信息
		**/
		// if(!isSpa){
		// 	mainApp.run(['$rootScope','http',function($rootScope,http){
		// 		$rootScope.$auth = {};
		// 		http.post(BTPATH.QUERY_ATTACHMENT_LIST,{}).success(function(data){
		// 			if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		// 				$rootScope.$auth = data.data;
		// 			}
		// 		});
		//
		// 	}]);
		// }

	};
});
