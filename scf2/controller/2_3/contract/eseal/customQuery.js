
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.esealCustomQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.statusList = BTDict.ContractStamperBusinStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      $scope.attachList = [];

      $scope.custList = [];

			$scope.searchData = {
        GTEoriginDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEoriginDate:new Date().format('YYYY-MM-DD'),
				LIKEcustName:'',
				businStatus:'00'
			};

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      $scope.detailInfo = {};

      $scope.uploadFlag = false;

      $scope.makeInfo = {
        fileName:'',
        fileId:''
      };

      $scope.newInfo = {
        custNo:null,
        name:'',
        originFileId:'',
        originFileName:'',
        fileId:'',
        fileName:''
      };

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CONTRACT_STAMPER_ALL_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

      $scope.checkStamper = function() {
        http.post(BTPATH.FIND_CONTRACT_STAMPER_CHECK/*2*/, {custNo: $scope.newInfo.custNo}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.uploadFlag = data.data;
              console.log(data);
            });
          }
        });
      };


      $scope.uploadNew = function(target) {
        $target = $(target);

        http.post(BTPATH.SAVE_ADD_CONTRACT_STAMPER/*2*/, $.extend({},$scope.newInfo)).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.makeInfo = data.data;
              $scope.closeRollModal('cEsealNew_box');
              tipbar.infoTopTipbar('制作合同印章成功!',{});
              $scope.queryList(true);
            });
          } else {
            tipbar.errorTopTipbar($target,'制作合同印章失败,服务器返回:'+data.message,3000,9992);
          }
        });
      };

      $scope.uploadMake = function(target) {
        $target = $(target);
         http.post(BTPATH.SAVE_MAKE_CONTRACT_STAMPER/*2*/, {id:$scope.makeInfo.id, fileId: $scope.makeInfo.fileId}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.makeInfo = data.data;
              $scope.closeRollModal('cEsealMake_box');
              tipbar.infoTopTipbar('制作合同印章成功!',{});
              $scope.queryList(true);
            });
          } else {
            tipbar.errorTopTipbar($target,'制作合同印章失败,服务器返回:'+data.message,3000,9992);
          }
        });
      };

    
    //查看印章详情
      $scope.lookSeal = function(item){
        http.post(BTPATH.FIND_CONTRACT_STAMPER_DETAIL/*2*/, {id:item.id}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.detailInfo = data.data;
              $scope.openRollModal('cEsealDetail_box');
            });
          } else {
            //tipbar.errorTopTipbar($target,'合同印章上传失败,服务器返回:'+data.message,3000,9992);
          }
        });
        
      };

      //新增
      $scope.newSeal = function(){
       commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:''},$scope,'custList').success(function(){
          $scope.newInfo.custNo = $scope.custList[0] ? $scope.custList[0].value : ''; 
          $scope.checkStamper();
          $scope.openRollModal('cEsealNew_box');
        });
      };

      //制作
      $scope.makeSeal = function(item){
        http.post(BTPATH.FIND_CONTRACT_STAMPER_DETAIL/*2*/, {id:item.id}).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.makeInfo = data.data;
              $scope.openRollModal('cEsealMake_box');
            });
          } else {
            //tipbar.errorTopTipbar($target,'合同印章上传失败,服务器返回:'+data.message,3000,9992);
          }
        });
        
      }

      //开启上传
      $scope.openUpload = function(event,type,typeName,list,voName){
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
          callback:callback(list,type,voName)
        };

      
        //上传回调 替换元素
        function callback(list,type,voName){
          return function(){
            var addItem = $scope[list].pop();
            
            if(voName == 'makeFile'){
              $scope.makeInfo.fileId = addItem.id;
              $scope.makeInfo.fileName = addItem.fileName;
            } else if(voName == 'newFile'){
              $scope.newInfo.fileId = addItem.id;
              $scope.newInfo.fileName = addItem.fileName;
            } else if (voName == "newOriginFile") {
              $scope.newInfo.originFileId = addItem.id;
              $scope.newInfo.originFileName = addItem.fileName;
            }
          };
        }
      };

      //删除附件项
      $scope.delUploadItem = function(voName){
        $scope.attachList = [];
        if(voName == 'makeFile'){
          $scope.makeInfo.fileId = null;
          $scope.makeInfo.fileName = null;
        } else if(voName == 'newFile'){
          $scope.newInfo.fileId = null;
          $scope.newInfo.fileName = null;
        } else if (voName == "newOriginFile") {
          $scope.newInfo.originFileId = null;
          $scope.newInfo.originFileName = null;
        }
      };


			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
				
				$scope.queryList(true);
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
