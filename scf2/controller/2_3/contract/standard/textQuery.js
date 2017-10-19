
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('contract_2_3.standardTextQuery',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
			// ContractTemplateAuditStatus
      $scope.auditStatusList = BTDict.ContractTemplateAuditStatus.toArray('value','name');

      $scope.infoList = [];

      $scope.custList = [];

      $scope.typeList = [];

      $scope.contractList = [];

      $scope.info = {
        custNo:null,
        custName:null,
        index: null,
        selectInfo:{
        },
        uploadInfo:{
          templateId:null,
          originTemplateId:null,
          originSimpleId:null,
          originSignerCount:0,
          originNoPattern:'',
          originComment:''
        }
      };

      $scope.infoDetail={};

			$scope.searchData = {
				GTEoriginDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
				LTEoriginDate:new Date().format('YYYY-MM-DD'),
				textAuditStatus:''
			};
      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10
  		};

      $scope.attachList = [];

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_CONTRACT_TEXT_LIST/*2*/,$.extend({},$scope.listPage,$scope.searchData))
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


      // unused list
      $scope.unusedInfoList = [];

      $scope.unusedListPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.unusedSearchData = {
          typeId: null
      }

      /*  业务处理绑定区域  */
      $scope.queryUnusedList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.unusedListPage.flag = flag? 1 : 2;/*1*/
        http.post(BTPATH.QUERY_TEMPLATE_UNUSED_CONTRACT_TEMPLATE_LIST/*2*/,$.extend({},$scope.unusedListPage,$scope.unusedSearchData, {custNo:$scope.info.custNo}))
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


    //上传或重新上传
    $scope.uploadBox = function(item,target){

      if (item) {
        http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: item.id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){

                $scope.info.selectInfo = data.data;
                $scope.info.uploadInfo.templateId = $scope.info.selectInfo.id;
                $scope.info.uploadInfo.originTemplateId = $scope.info.selectInfo.originTemplateId;
                $scope.info.uploadInfo.originSimpleId = $scope.info.selectInfo.originSimpleId;
                $scope.info.uploadInfo.originSignerCount = $scope.info.selectInfo.originSignerCount;
                $scope.info.uploadInfo.originNoPattern = $scope.info.selectInfo.originNoPattern;
                $scope.info.uploadInfo.originComment = $scope.info.selectInfo.originComment;

                $scope.uploadInfo["template"] = $scope.info.selectInfo.originTemplateId;
                $scope.uploadInfo['templateName'] = $scope.info.selectInfo.originTemplateName;

                $scope.uploadInfo["simple"] = $scope.info.selectInfo.originSimpleId;
                $scope.uploadInfo['simpleName'] = $scope.info.selectInfo.originSimpleName;

                $scope.openRollModal('upload_box');

              });
            } else {

            }
        });  
          


      } else {

        if($scope.info.index === null){
          var $target = $(target);
          tipbar.errorLeftTipbar($target,'请选择',3000,9992);
          return ;
        }

        http.post(BTPATH.FIND_CONTRACT_TEMPLATE_DETAIL/*2*/,{id: $scope.unusedInfoList[$scope.info.index].id}).success(function(data){
            if(common.isCurrentData(data)){
              $scope.$apply(function(){

                $scope.info.selectInfo = data.data;
                $scope.info.uploadInfo.templateId = $scope.info.selectInfo.id;
                $scope.info.uploadInfo.originTemplateId = $scope.info.selectInfo.originTemplateId;
                $scope.info.uploadInfo.originSimpleId = $scope.info.selectInfo.originSimpleId;
                $scope.info.uploadInfo.originSignerCount = $scope.info.selectInfo.originSignerCount;
                $scope.info.uploadInfo.originNoPattern = $scope.info.selectInfo.originNoPattern;
                $scope.info.uploadInfo.originComment = $scope.info.selectInfo.originComment;

                $scope.openRollModal('upload_box');
          
                $("#select_box").removeData("prev-box");
                $("#upload_box").data("prev-box","body");
              });
            } else {

            }
        });  
       
      }
      $scope.uploadInfo = {};
    };

      //新增合同文本
    $scope.addNewBox = function(){
      // 重新查询未使用列表  
      $scope.openRollModal('select_box');
      $scope.unusedListPage.pageNum = 1;
      $scope.info.index = null;
      $scope.unusedSearchData.typeId = null;
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
                $scope.infoDetail = data.data;/*3*/
                $scope.queryLog(data.data.id);
                $scope.openRollModal('detail_box');
              });
            } else {

            }
        });
      };


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
            if(voName == 'template'){
              $scope.info.uploadInfo.originTemplateId = addItem.id;
            }else{
              $scope.info.uploadInfo.originSimpleId = addItem.id;
            }
            
          //   //如果未上传或上传失败，返回
          //   // if(ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type).length<=1) return;
          //   //删除新添加的，并将其值赋给原有的
          //   var addItem = $scope[list].pop(),
          //     preItem = ArrayPlus($scope[list]).objectChildFilter('fileInfoType',type)[0];
          //   $scope[list] = ArrayPlus($scope[list]).replaceChild('fileInfoType',type,$.extend(addItem,{
          //     'fileDescription':preItem.fileDescription //类型名称
          //   }));
          };
        }
      };


      //删除附件项
      $scope.delUploadItem = function(voName){
        $scope.attachList = [];
        $scope.uploadInfo[voName] = null;
        $scope.uploadInfo[voName+'Name'] = null;
        if(voName == 'template'){
              $scope.info.uploadInfo.originTemplateId = null;
            }else{
              $scope.info.uploadInfo.originSimpleId = null;
            }
      };

      //上传表单提交
      $scope.submitBox = function(target){
        //设置校验项 | 校验
        validate.validate($('#upload_box'),validOption);
        var valid = validate.validate($('#upload_box'));
        if(!valid) return;

        var $target = $(target);
        http.post(BTPATH.SAVE_UPLOAD_CONTRACT_TEXT,$scope.info.uploadInfo)
           .success(function(data){
            if(data&&(data.code === 200)){
              tipbar.infoTopTipbar('标准合同文本上传成功!',{});
              $scope.queryList(true);
              $scope.closeRollModal("upload_box");
            }else{
              tipbar.errorTopTipbar($target,'标准合同文本上传失败,服务器返回:'+data.message,3000,9992);
            }
           });
      }

      // 下载合同相关文件
      $scope.downloadSel=function(target){  
          addIds=[$scope.infoDetail.originSimpleId,$scope.infoDetail.originTemplateId];
          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=标准合同文本与样例";
          window.location.href=$scope.downListUrl;
       }

      var validOption = {
          elements: [{
              name: 'info.uploadInfo.originSingerCount',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name: 'info.uploadInfo.originNoPattern',
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
          commonService.queryBaseInfoList(BTPATH.FIND_ENABLE_AGREEMENTTYPE,{},$scope,'contractList').success(function(){
				  commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
          commonService.queryBaseInfoList(BTPATH.QUERY_CONTRACT_TYPE_SIMPLE_LIST,{},$scope,'typeList','TypeListDict').success(function(){
            $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
            $scope.info.custNo = $scope.custList[0] ? $scope.custList[0].value : '';
            $scope.info.custName = $scope.custList[0] ? $scope.custList[0].name : '';
            $scope.queryList(true);
          });
        });
      });
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
