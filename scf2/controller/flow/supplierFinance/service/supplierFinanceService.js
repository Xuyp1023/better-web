/*
* 供应商融资流程 - 公用模块
* 作者: herb
*/

define(function(require,exports,module){

	exports.servPlus = function(mainApp,common){

		// 关联列表 配置  list_name|列表VM名称
		var _linkedConfig = {
			1:{
				type:'order',
				list_name:'orderList'	
			},
			2:{
				type:'bill',
				list_name:'billList'	
			},
			3:{
				type:'recieve',
				list_name:'recieveList'
			}
		};



		mainApp.service('flowService',['http','commonService',function(http,commonService){

			return {
				getAllList:function($scope){					
			      // 列表文件配置
			      $scope.listConfig=[
			        {'listName':'accountList',path:'',dicetype:'2',id:'list_table_1','listMap':'assetInfo.basedataMap.receivableList'},
			        {'listName':'contractList',path:'',dicetype:'3',id:'list_table_2','listMap':'assetInfo.basedataMap.agreementList'},
			        {'listName':'billList',path:'',dicetype:'4',id:'list_table_3','listMap':'assetInfo.basedataMap.invoiceList'},
			        {'listName':'orderList',path:'',dicetype:'5',id:'list_table_4','listMap':'assetInfo.basedataMap.orderList'},
			        {'listName':'recheckList',path:'',dicetype:'6',id:'list_table_5'},
			        {'listName':'outboundList',path:'',dicetype:'7',id:'list_table_6'},
			        {'listName':'otherList',path:'',dicetype:'其它附件',id:'list_table_7'}
			       
		      	]
			      // 控制资产列表显隐对象
			      $scope.tempObj={
			        list_table_1:0,
			        list_table_2:0,
			        list_table_3:0,
			        list_table_4:0,
			        list_table_5:0,
			        list_table_6:0,
			        list_table_7:1
			      }
					// $scope.lists=[{isMain:1,name:'贸易合同'},{isMain:0,name:'应收账款'},{isMain:0,name:'对账单'},{isMain:0,name:'其它附件'}];
			          for(var j=0;j<$scope.lists.length;j++){
			              for(var i=0,current=$scope.listConfig;i<current.length;i++){
			                  if($scope.lists[j].dictType==current[i].dicetype){
			                    var id=current[i].id;
			                    $scope.$apply(function(){
			                    	$scope.tempObj[id]=1;
			                    })
			                    			                    
			                    // 发出http请求
			                    if($scope.lists[j].assetType==1){
			                    	// console.log(i);
			                    	$scope.tempName=$scope.listConfig[i].listMap;
			                    	//console.log($scope.tempName);
			                      // angular.element("#list_table").after('<p>hello</p>');
			                      var ele=document.getElementById(''+id);
			                      var parent=document.getElementById('list_tables');
			                      // var ele1=document.getElementById('list_table_1');  
			                      parent.insertBefore(ele,parent.childNodes[0]);
			                    }

			                    // angular.element('#'+id).remove();
			                  }
			              }
			          }

			          setTimeout(function(){
			            common.resizeIframeListener();			            
			          },1)
				},
				
				//查询融资详情 传入申请单编号
				queryFinanceInfo : function($scope,requestNo){
					var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
					    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					      $scope.$apply(function(){
					          $scope.financeInfo = data.data;
					      });
					    }   
					});
					return promise;
				},

				//查询融资详情 传入申请单编号
				queryInfo : function($scope,requestNo){
					var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
					    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					      $scope.$apply(function(){
					          $scope.info = data.data;

					           //银行账号信息
					           http.post(BTPATH.FIND_CUSTMECH_BANK_ACCOUNT,{bankAcco:data.data.suppBankAccount}).success(function(data){
			                       $scope.info.bankAccoName=data.data.bankAccoName ;
			                       $scope.info.bankName=data.data.bankName; 
					          })

					           //授信余额
					           http.post(BTPATH.QUERY_COMP_QUOTA,{custNo:$scope.info.custNo}).success(function(data){
					               $scope.info.creditBalance= data.data.creditBalance;
					           });

					           
					      });
					    }   
					});
					return promise;
				},


		        //查询关联列表（订单|应收账款|票据）
		        querySelectList : function($scope,info){
		        	//置空关联类型
		        	$scope.linkedType = '';
		        	var requestType = info.data.requestType,requestNo = info.data.requestNo,
		        		config = _linkedConfig[requestType];
				  	if(requestType && config){
		        		//设置关联类型
		        		$scope.linkedType = config.type;
		        		http.post(BTPATH.FIANACE_REQUEST_LINKED_LIST,{"requestType":requestType,"requestNo":requestNo}).success(function(data){
		        		    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		        		      $scope.$apply(function(){
		        		          $scope[config.list_name] = common.cloneArrayDeep(data.data);
		        		      });
		        		    }   
		        		});
		        	}
		        },


				//查询审贷详情（贷款方案）
				queryLoanSchemeInfo : function($scope,requestNo){
					var promise = http.post(BTPATH.FIND_LOAN_SCHEME_DETAIL,{"requestNo":requestNo}).success(function(data){
					    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
					      $scope.$apply(function(){
					          $scope.loanInfo = data.data;
					      });
					    }   
					});
					return promise;
				},


		        //检查黑名单是否存在
		        checkBlacklist : function($scope){
		        	//参数 name:机构名称
		        	http.post(BTPATH.CHECK_BLACK_LIST,{"name":$scope.financeInfo.custName}).success(function(data){
		        	    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		        	      $scope.$apply(function(){
		        	      	  //1:存在	0：不存在
		        	          $scope.blackExist = data.data ==="0" ? "不存在" : "存在";
		        	      });
		        	    }   
		        	});
		        },


		       



		        //---------------------------------协议查看相关 ------------------------------------

		        
		        //合同相关文件展示
		        getStaticPage : function($scope){
		        	//获取iframe
		        	var $detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
		        	$.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
		        		if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
		        			//动态修改iframe中内容
		        			$detail_iframe.find("body").html(data.data);
		        		}else{
		        			//动态修改iframe中内容
		        			$detail_iframe.find("body").html("");
		        		}
		        	},'json');
		        },


		        //合同相关文件展示（通过 请求编号和 协议类型 查找）
		        getStaticPageByRequestNo : function($scope,agreeType){
		        	var param={
		        		requestNo:$scope.financeInfo.requestNo,
		        		agreeType:agreeType
		        	};
		        	$.post(BTPATH.FIND_AGREE_PAGE_BY_REQUESTNO,param,function(data){
		        		if(data && data.code === 200){
		        			//获取iframe
		        			$detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
		        			//动态修改iframe中内容
		        			$detail_iframe.find("body").html(data.data);
		        		}
		        	},'json');
		        }



			};

		}]);


	};
});
