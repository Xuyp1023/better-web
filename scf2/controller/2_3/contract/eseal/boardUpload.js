
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.esealBoardUpload',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			$scope.auditStatusList = BTDict.ContractTemplateAuditStatus.toArray('value','name');

      $scope.signatorys = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];

      $scope.factorCustList = [];
      $scope.infoList = [];
      $scope.unusedInfoList = [];
      $scope.attachList = [];

      $scope.info = {
        selectInfo:{},
        uploadInfo:{
          templateId:null,
          templateFileId:null,
          common:""
        },
        stampPlaces:[],
        index:null
      };
			$scope.searchData = {
				GTEmakeDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEmakeDate:new Date().format('YYYY-MM-DD'),
				custNo:'',
				templateAuditStatus:null
			};

      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};

      $scope.unusedListPage = {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 1
      };

      $scope.unusedSearchData = {
        custNo:''
      }

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
  			//弹出弹幕加载状态
  			var $mainTable = $('#search_info .main-list');
  			loading.addLoading($mainTable,common.getRootPath());
  			$scope.listPage.flag = flag? 1 : 2;/*1*/
  			http.post(BTPATH.QUERY_CONTRACT_TEMPLATE_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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

      /*  业务处理绑定区域  */
      $scope.queryUnusedList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.unusedListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CONTRACT_UNUSED_TEXT_LIST/*2*/,$.extend({},$scope.unusedListPage,$scope.unusedSearchData))
          .success(function(data){
            //关闭加载状态弹幕
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.unusedInfoList = common.cloneArrayDeep(data.data);/*3*/
                if(flag/*1*/){
                  $scope.unusedListPage = data.page;/*4*/
                }
              });
            }
        });
      };

      //下载合同相关文件
      $scope.downloadSel=function(){  
          addIds=[$scope.info.selectInfo.originSimpleId,$scope.info.selectInfo.originTemplateId];
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=标准合同文本和样例";
          window.location.href=$scope.downListUrl;
       }
       //下载电子合同模板文件
      $scope.downloadTemplate=function(){  
          addIds=[$scope.info.selectInfo.templateId];
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=电子合同模板";
          window.location.href=$scope.downListUrl;
       }


      //上传或重新上传
    $scope.uploadBox = function(item){
      $scope.openRollModal('upload_box');
      if (item) {
        http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: item.id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info.selectInfo = data.data;
                $scope.info.uploadInfo.templateId = $scope.info.selectInfo.id;
                $scope.info.uploadInfo.templateFileId = $scope.info.selectInfo.templateFileId;
                $scope.info.uploadInfo.common =  $scope.info.selectInfo.common;

                $scope.uploadInfo = {};
                $scope.uploadInfo["template"] = $scope.info.selectInfo.templateId;
                $scope.uploadInfo["templateName"] = $scope.info.selectInfo.templateName;
                $scope.info.uploadInfo.templateFileId = $scope.info.selectInfo.templateId;

                $scope.info.stampPlaces = $scope.info.selectInfo.stampPlaces;
              });
            } else {

            }
        });
        
      } else {
        http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: $scope.unusedInfoList[$scope.info.index].id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info.selectInfo = data.data;
                $scope.info.uploadInfo.templateId = $scope.info.selectInfo.id;
                $scope.info.uploadInfo.templateFileId = $scope.info.selectInfo.templateFileId;

               
                  $scope.info.stampPlaces = $scope.info.selectInfo.stampPlaces;
             
              });
            } else {

            }
        });
    

        $("#select_box").removeData("prev-box");
        $("#upload_box").data("prev-box","body");
      }
      
      $scope.uploadInfo = {}; 
      
    };


			  //新增合同文本
    $scope.addNewBox = function(){
      // 查询
      $scope.openRollModal('select_box');
      $scope.unusedListPage.pageNum = 1;
      $scope.info.index = null;
      $scope.unusedSearchData.custNo = null;
      $scope.queryUnusedList(true);
    };

    //放弃
    $scope.goBack = function(){
      $scope.closeRollModal("upload_box");
    };

     $scope.templateLogList = [];
    $scope.queryLog = function(templateId) {
       http.post(BTPATH.QUERY_CONTRACT_TEMPLATE_LOG_LIST/*2*/,{templateId: templateId}).success(function(data){
        if(common.isCurrentData(data)){
          $scope.$apply(function(){
            $scope.templateLogList = data.data;
          });
        }
      });
    };

      //查看详情
      $scope.lookDetail = function(item){
        http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: item.id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.info.selectInfo = data.data;

                $scope.queryLog(data.data.id);
                
                $scope.info.stampPlaces = $scope.info.selectInfo.stampPlaces;

                $scope.openRollModal('detail_box');
              });
            } else {

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
            $scope.uploadInfo[voName] = addItem.id;
            $scope.uploadInfo[voName+'Name'] = addItem.fileName;
            $scope.info.uploadInfo.templateFileId = addItem.id;
         
          };
        }
      };

      //查看签章位置
      $scope.lookKeyWord = function(){
        $scope.openRollModal('keywordDetail_box');
      };
      //返回到查询界面
      $scope.goToSearch = function(){
        $scope.closeRollModal('keywordDetail_box');
      };

      //设置签章位置
      $scope.setKeyWord = function(){
        console.log($scope.info.stampPlaces);
        $scope.openRollModal('keyword_box');
      };
      //签章位置提交和返回
      $scope.goToUpload = function(submit){

        if (submit == true) { // 提交位置信息

          http.post(BTPATH.SAVE_STAMP_PLACE_CONTRACT_TEMPLATE/*2*/,{templateId: $scope.info.uploadInfo.templateId, stampPlaces:angular.toJson($scope.info.stampPlaces)}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.closeRollModal("keyword_box");
              });
            } else {
              
            }
          });

        } else { // 关闭
          $scope.closeRollModal("keyword_box");
        }
      };


      //删除附件项
      $scope.delUploadItem = function(voName){
        $scope.attachList = [];
        $scope.uploadInfo[voName] = null;
        $scope.uploadInfo[voName+'Name'] = null;
        $scope.info.uploadInfo.templateFileId = undefined;
      };

      //上传表单提交
      $scope.submitBox = function(target){

        //设置校验项 | 校验
        validate.validate($('#upload_box'),validOption);
        var valid = validate.validate($('#upload_box'));
        if(!valid) return;

        var $target = $(target);

        http.post(BTPATH.SAVE_UPLOAD_CONTRACT_TEMPLATE,$scope.info.uploadInfo)
           .success(function(data){
              if(data&&(data.code === 200)){
                tipbar.infoTopTipbar('上传标准合同模板成功!',{});
                $scope.queryList(true);
                $scope.closeRollModal("upload_box");
              }else{
                tipbar.errorTopTipbar($target,'上传标准合同模板失败,服务器返回:'+data.message,3000,9992);
              }
           });
      }


      var validOption = {
          elements: [{
              name: 'info.uploadInfo.templateFileId',
              rules: [{name: 'required'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
        commonService.queryBaseInfoList(BTPATH.FIND_CUST_BY_PLATFORM,{custType:'3'},$scope,'factorCustList').success(function(){
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
