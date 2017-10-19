/*
* 供应商融资流程 - 公用模块
* 作者: herb
*/

define(function(require,exports,module){

	exports.servPlus = function(mainApp,common){

		mainApp.service('flowService',['http','commonService',function(http,commonService){

			return {
				
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


		        //查询关联列表（订单）
		        querySelectList : function($scope,info){
		        	var requestType = info.data.requestType,requestNo = info.data.requestNo;
				  	if(!requestType) return;
	        		http.post(BTPATH.FIANACE_REQUEST_LINKED_LIST,{"requestType":requestType,"requestNo":requestNo}).success(function(data){
	        		    if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
	        		      $scope.$apply(function(){
	        		          $scope.orderList = common.cloneArrayDeep(data.data);
	        		      });
	        		    }   
	        		});
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
