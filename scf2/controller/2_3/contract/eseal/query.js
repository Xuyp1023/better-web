
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.esealQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.statusList = BTDict.AgreementStandardStatus.toArray('value','name');

      $scope.custList = [];


      $scope.infoList = [];

      $scope.info = {
        custNo:null,
        name:null,
        originFileId:null,
        originFileName:null
      };

      $scope.detailInfo = {};

      $scope.uploadFlag = false;

			$scope.searchData = {
				custNo:null
			};

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      $scope.attachList = [];

      $scope.checkStamper = function() {
        http.post(BTPATH.FIND_CONTRACT_STAMPER_CHECK/*2*/, {custNo: $scope.info.custNo}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.uploadFlag = data.data;
              console.log(data);
            });
          }
        });
      };

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
  			http.post(BTPATH.QUERY_CONTRACT_STAMPER_OWN_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
  				.success(function(data){
  					//关闭加载状态弹幕
  					loading.removeLoading($mainTable);
  					if(common.isCurrentData(data)){
  						$scope.$apply(function(){
  							$scope.infoList = common.cloneArrayDeep(data.data);/*3*/
  							if(flag/*1*/){
  								$scope.listPage = data.page;/*4*/
  							}
  						});
  					}
  			});
  		};

      //上传印章
      $scope.uploadSeal = function(target){
        var $target = $(target);
        http.post(BTPATH.SAVE_ADD_OWN_CONTRACT_STAMPER/*2*/, $.extend({}, $scope.info)).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              tipbar.infoTopTipbar('合同印章上传成功!',{});
              $scope.closeRollModal('esealNew_box');
              $scope.queryList(true);
            });
          } else {
            tipbar.errorTopTipbar($target,'合同印章上传失败,服务器返回:'+data.message,3000,9992);
          }
        });
      };

      //开启上传
      $scope.openUpload = function(event,type,typeName,list){
        $scope.uploadConf = {
          //上传触发元素
          event:event.target||event.srcElement,
          //上传附件类型
          type:type,
          //类型名称
          typeName:typeName,
          //存放上传文件
          uploadList:$scope[list],
          //回调
          callback:callback(list,type,$scope.info)
        };

      
        //上传回调 替换元素
        function callback(list,type,voName){
          return function(){
            var addItem = $scope[list].pop();
            $scope.info.originFileId = addItem.id;
            $scope.info.originFileName = addItem.fileName;
      
          };
        }
      };

      //删除附件项
      $scope.delUploadItem = function(voName){
        $scope.attachList = [];
        $scope.info.originFileId = null;
        $scope.info.originFileName = null;
      };

      
      //查看印章详情
      $scope.lookSealDetail = function(item){
         http.post(BTPATH.FIND_CONTRACT_STAMPER_DETAIL/*2*/, {id:item.id}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.detailInfo = data.data;
              $scope.openRollModal('esealDetail_box');
            });
          } else {
            //tipbar.errorTopTipbar($target,'合同印章上传失败,服务器返回:'+data.message,3000,9992);
          }
        });
         
        
      }

			//新增印章
      $scope.newEseal = function(target) {
       $scope.openRollModal('esealNew_box');
       $scope.checkStamper();
      }


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
					$scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
          $scope.info.custNo = $scope.custList[0] ? $scope.custList[0].value : ''; 
          $scope.queryList(true);
				});
				
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
