
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('check.mailSelect',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.isDisabled=false;

      $scope.typeList = [];

      $scope.searchData = {
        billMonth:new Date().format('YYYY-MM'),
        ownCustNo:null,
			  businStatus:'2'
		};

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      function judgeEmpty(){
        var codes=ArrayPlus($scope.infoList).extractChildArray('refNo',true);
        if(codes.length==0){
          $scope.isDisabled=true;
        }else{
          $scope.isDisabled=false;
        }
      }

  		/*  业务处理绑定区域  */
      $scope.queryList = function(flag){

        if(!$scope.searchData.billMonth || !$scope.searchData.ownCustNo){
          return;
        }
         $scope.listPage.flag = flag? 1 : 2;
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			http.post(BTPATH.QUERY_DELIVERY_MONTHLY_STATEMENT_AUDITED_LIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
                judgeEmpty();
  							 if(flag/*1*/){
                  $scope.listPage = data.page;/*4*/
                }
  						});
  					}
  			});
  		};

      /*  业务处理绑定区域  */

      //选择按钮，全选和去除全选
      $scope.toggleCheckbox = function(){
      	angular.forEach($scope.infoList,function(row){
      		row.isSelected = $scope.tmpCheckbox;
		});
      };

      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };

      /*  业务处理绑定区域  */
      $scope.queryDetailList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.detailListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail_List/*2*/,$.extend({},$scope.detailListPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.detailInfoList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.detailListPage = data.page;/*4*/
                }
              });
            }
        });
      };

      // 移除月账单
      $scope.removeBill = function(target,item) {
        var $target = $(target);
        //前端判断是否是最后一条月账单

        //移除单条记录
         http.post(BTPATH.SAVE_DELIVERY_RECORD_REMOVE_MONTHLY_STATEMENT/*2*/,{statementId:item.id})
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.deliveryRecordInfo = data.data;/*3*/
                $scope.openRollModal('mailCheck_box');
              });
            }else{

              tipbar.errorTopTipbar($target,data.message,3000,9992);
            }
        });

      }

      //查看月账单详情
      $scope.lookMonthDetail = function(target,itemId){

              $scope.detailInfo = item;
              $scope.openRollModal('monthDetail_box');
              //$scope.queryDetailList(true);
        };

         //查询月账单详情
      $scope.lookDetail = function(target,monthlyId){
        
         $scope.openRollModal('monthDetail_box');
         http.post(BTPATH.FIND_MONTHLY_STATEMENT_ID,{"monthlyId":monthlyId})
          .success(function(data){
              $scope.$apply(function(){
                $scope.detailInfo = data.data;
                $scope.detailInfoList = common.cloneArrayDeep($scope.detailInfo.dailyList);/*3*/
              });
        });
      }

      
      $scope.lookDayDetail = function(target,item){
         $scope.dailyStatementId=item.dailyStatementId;
         http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail,{"dailyStatementId":item.dailyStatementId})
          .success(function(data){

              $scope.$apply(function(){

                $scope.dayDetailInfo = data.data;

              });
              $scope.openRollModal('dayDetail_box');
              $scope.queryDetailList(true);
        });
      }
      $scope.detailListPage = {
        pageNum: 1,
        pageSize: 10
      };
      /*  业务处理绑定区域   */
      $scope.queryDetailList = function(flag){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.detailListPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_QH_CHECK_DAY_Detail_List,$.extend({},{"dailyStatementId":$scope.dailyStatementId},$scope.detailListPage))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.dayDetailInfoList = common.cloneArrayDeep(data.data);
                if(flag){
                  $scope.detailListPage = data.page;
                }
              });
            }
        });
      };

     
      // 查看详情
      //$scope.lookMonthDetail = function(){

       //http.post(BTPATH.QUERY_QH_CHECK_DAY_List/*2*/,$.extend({},$scope.searchData))
         // .success(function(data){
           // //关闭加载状态弹幕
          //  if(common.isCurrentData(data)){
             // $scope.$apply(function(){
            //    $scope.checkDetailInfoList = common.cloneArrayDeep(data.data);/*3*/
             //   $scope.openRollModal('detail_box');
             // });
            //}
       // });


        
     // };

      $scope.mailCheck = function(target){

        var $target = $(target);
        var addIds = "";
        angular.forEach($scope.infoList,function(row){
          if(row.isSelected){
            addIds=addIds+row.id+",";
          }
        });

        if (addIds.length <= 0) {
            tipbar.errorTopTipbar($target,'请选择要投递的账单！',3000,9992);
            return;
        }

        http.post(BTPATH.SAVE_DELIVERY_RECORD/*2*/,$.extend({monthList:addIds},$scope.searchData))
          .success(function(data){
            //关闭加载状态弹幕
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.deliveryRecordInfo = data.data;/*3*/
                $scope.openRollModal('mailCheck_box');
              });
            }
        });
        
      };

			//投递账单
			$scope.addInfo = function(target,refNo,description){

				var $target = $(target);
				http.post(BTPATH.SAVE_EXPRESS_DELIVERY_RECORD,{refNo:refNo,description:description}).success(function(data){
					if(data&&(data.code === 200)){
						tipbar.infoTopTipbar('投递成功!',{});
						$scope.$apply(function(){
							$location.path("/1qh-mobile/check.mail");
						});
						//window.location.href = '#/1qh-mobile/check.mail';
					}else{
						tipbar.errorTopTipbar($target,'对账单提交失败:'+data.message,3000,9992);
					}
				});
			};

			$scope.goBack = function(){
				$location.path("/1qh-mobile/check.mail");
			};

      $scope.queryUnusedList=function (flag){

        $scope.queryList(flag);

      }

      // 监听付款日期值的变化
      $scope.$watch('searchData.billMonth', function(newValue, oldValue) {
        $scope.queryList(true);
      });



			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){

                // $scope.searchData.custNo=$route.current.pathParams.custNo;
        //         commonService.queryBaseInfoList(BTPATH.QUERY_CONTRACT_TYPE_SIMPLE_LIST,{},$scope,'typeList','TypeListDict').success(function(){
    				// commonService.queryBaseInfoList(BTPATH.QUERY_CONTRACT_TYPE_SIMPLE_LIST,{},$scope,'typeList').success(function(){
    				//     $scope.queryList();
    				// });
        //         });
          commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:2},$scope,'coreCustList').success(function(){
          // $scope.searchData.ownCustNo = $scope.coreCustList[0] ? $scope.coreCustList[0].value : '';
          $scope.queryList(true);
        });
			
				/*公共绑定*/
				common.resizeIframeListener();
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});

			});
		}]);

	};

});
