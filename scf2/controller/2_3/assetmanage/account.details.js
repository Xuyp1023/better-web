
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('assetmanage.account.details',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */


      //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
      $scope.loanInfo = {};
			$scope.statusList = BTDict.FactorCoreCustInfo.toArray('value','name');
      $scope.receiver = BTDict.CoreStatus.toArray('value','name');
      $scope.infoList = [];
      $scope.info = {};
      $scope.editInfo = {};
      $scope.deleInfo = {};
      $scope.addInfo = {};
      $scope.searchData = {
          GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
          LTEregDate:new Date().format('YYYY-MM-DD'),
          isAudit : 'false'
      };

      //登记账款
      $scope.addInfoBox = function(){

         $scope.addInfo = {}; 
         $scope.addInfo.coreCustNo = $scope.searchData.coreCustNo;
         $scope.addInfo.custNo = common.filterArrayFirst($scope.receiver);
         $scope.addInfo.endDate = '';
         $scope.openRollModal('add_box');

      }

      //编辑票据
      $scope.editInfoBox = function(data){
          data.custNo = data.custNo +'';
          $scope.editInfo = data;
          //$scope.editinfo.coreCustNo = $scope.searchData.coreCustNo;
          //$scope.editinfo.custNo = $scope.searchData.custNo;
          //查询附件列表
          //   commonService.queryBaseInfoList(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:$scope.info.batchNo},$scope,'uploadList');
          $scope.openRollModal('edit_box');
       };
      //票据作废
      $scope.delInfo = function(data){

         $scope.deleInfo = data;
         //$scope.deleInfo.coreCustNo = $scope.searchData.coreCustNo;
         //$scope.deleInfo.custNo = $scope.searchData.custNo;
         $scope.openRollModal('delete_box');

      }

      //打开详情
      $scope.detailsBox = function(data){
        // $scope.info = $.extend(data,{modiType:'details'});
        // $scope.$$emiterBoxEnabled(); 
        $scope.loanInfo=data;
        // 查询附件列表
        //commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList');
        $scope.openRollModal('detail_box');
      }

       //账款登记|保存并确认
    $scope.addInfoFun = function(target,flag){
      var $target = $(target);

      validate.validate($('#add_box'),validOption);
      var valid = validate.validate($('#add_box'));
      if(!valid) return;
      
      //$scope.loanInfo.fileList = ArrayPlus($scope.infoFileList).extractChildArray('id',true);

        $scope.addInfo.confirmFlag = flag;  
       
      // $scope.info.custNo =
      http.post(BTPATH.SAVE_ADD_RECEIVABLE_CORE,$scope.addInfo)
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('应付账款登记成功!',{});
            
            $scope.closeRollModal('add_box');
            // setTimeout(function(){
            //   window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/account.details';              
            // },1000)
            
            $scope.queryList(true);
          }else{
            tipbar.errorTopTipbar($target,'应付账款登记失败,服务器返回:'+data.message,3000,9992);
          }
         });
    };


     //账款修改并确认
        $scope.modiInfo =function(target,flag){

          //数据校验--------
          validate.validate($('#edit_box'),validOptione);
          var valid = validate.validate($('#edit_box'));
          if(!valid) return;
          //------------------
           var $target = $(target);
            $scope.editInfo.confirmFlag=flag;

             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.SAVE_MODIFY_RECEIVABLE_CORE,$scope.editInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    
                   tipbar.infoTopTipbar('应付账款修改成功!',{});
                    
                    
                    $scope.closeRollModal('edit_box');
                    // setTimeout(function(){
                    //       window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/account.details';              
                    // },1000)
                    // window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/account.details';
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'应付账款修改失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
        }
        //账款修改
        $scope.editInfot =function(target,flag){

          //数据校验--------
          validate.validate($('#edit_box'),validOptione);
          var valid = validate.validate($('#edit_box'));
          if(!valid) return;
          //------------------
           var $target = $(target);
            $scope.editInfo.confirmFlag='false';
             // $scope.info.fileList = ArrayPlus($scope.uploadList).extractChildArray('id',true);
              http.post(BTPATH.SAVE_MODIFY_RECEIVABLE_CORE,$scope.editInfo)
                 .success(function(data){
                  if(data&&(data.code === 200)){
                    tipbar.infoTopTipbar('应付账款修改成功!',{});
                    setTimeout(function(){
                        window.location.href = '../scf2/home.html?rn='+new Date().getTime()+'/#/assetmanage/account.details';
                    },1000)
                    
                    $scope.queryList(true);
                  }else{
                    tipbar.errorTopTipbar($target,'应付账款修改失败,服务器返回:'+data.message,3000,9992);
                  }
                 });
        }

    //作废账款
    $scope.deleteInfot = function(item,target){
        dialog.confirm('是否确认作废该应付账款,该操作无法恢复!',function(){
        var $target = $(target);
        http.post(BTPATH.SAVE_DELETE_ANNUL_RECEIVABLE_CORE,{refNo:item.refNo,version:item.version})
           .success(function(data){
            if(data&&(data.code === 200)){
               $scope.closeRollModal('delete_box');
              $scope.queryList(true);
              tipbar.infoTopTipbar('作废应付账款成功!',{});
            }else{
              tipbar.errorTopTipbar($target,'作废应付账款失败,服务器返回:'+data.message,3000,9992);
            }
           });
      });
    };

    
       //点击查询
       $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };

            //刷新列表
            $scope.queryList = function(flag){
            //弹出弹幕加载状态
            var $mainTable = $('#search_info .main-list');
            loading.addLoading($mainTable,common.getRootPath());
            $scope.listPage.flag = flag? 1 : 2;
            $scope.searchData.isAudit = false;
            http.post(BTPATH.QUERY_INEFFECTIVE_RECEIVABLE_CORE,$.extend({},$scope.listPage,$scope.searchData))
              .success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($mainTable);
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                    $scope.infoList = common.cloneArrayDeep(data.data);
                    if(flag){
                      $scope.listPage = data.page;
                    }
                  });
                }   
            });
          };

          //校验配置
         var validOption = {
          elements: [{
              name: 'addInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'addInfo.endDate',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'addInfo.surplusBalance',
              rules: [{name: 'required'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };

        var validOptione = {
          elements: [{
              name: 'editInfo.balance',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'editInfo.endDate',
              rules: [{name: 'required'}],
              events: ['blur']
          },{
              name:'editInfo.surplusBalance',
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


				 commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
          //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
            $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_SUPPLIERLIST,{coreCustNo:$scope.searchData.coreCustNo},$scope,'receiver').success(function(){
                /*$scope.searchData.custNo = common.filterArrayFirst($scope.receiver);
                $scope.searchData.custNo = $scope.searchData.custNo>0?$scope.searchData.custNo[0].value:'';*/
                $scope.queryList(true);
          });
        });
       

				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframe();
				});

			});
		}]);

	};

});
