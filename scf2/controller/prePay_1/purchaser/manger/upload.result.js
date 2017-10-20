
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('upload.result',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */

      
      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 30,
        pages: 1,
        total: 1
      }; 

      $scope.uploads = {};
      $scope.isSubmit = true;   
     
      // 文件改变时触发
      window.fileChange = function(input){
        if(!input.value){ $scope.uploads.id = '' ;return;}
        $scope.isSubmit = false;
        var form = document.getElementById('uploadForm');
        form.action = BTPATH.UPLOAD_BACK_INFO + '?fileTypeName=otherFile';
        form.submit();                
      }
        //重置 
        function reset(){
          var ipt = document.getElementById('file');
          ipt.value = '';
          $scope.uploads={};
        }

      // 文件改变时重新触发
      window.iframeLoad = function(){
          var resultStr = window.frames['bt_upload_frame'].document.body.innerHTML;
          if(resultStr.length!=0){
              resultStr = JSON.parse(resultStr);
              if(resultStr.code == 200){
                  $scope.uploads.id = resultStr.data.id;
              }
          }  
      }
      // 提交
      $scope.submit = function(target, sourceFileid){
          var $target = $(target);
          if(!$scope.uploads.id){
              tipbar.errorLeftTipbar($target,"请选择文件",3000,9992);
              return;
          }
          http.post(BTPATH.SAVE_PAYFILE_SAVERESOLVEFILE,{fileItemId : $scope.uploads.id, sourceFileId : sourceFileid})
         .success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('提交成功!',{});
            reset();            
            $scope.closeRollModal("upload_file");
            $scope.queryList(true);
          }else{
            tipbar.errorTopTipbar($target,'提交失败,服务器返回:'+data.message,3000,9992);
          }
         });
      }


      // 初始化查条件对象
      $scope.searchData = {   

        businStatus : '1',
        regDate : new Date().format('YYYY-MM-DD'),
        infoType : '0',
        lockedStatus : '0'

      };

      $scope.uploadInfo = {};

       $scope.upload = function(data){
          $scope.uploadInfo = data;
          $scope.openRollModal('upload_file');
       } 
        
       $scope.goBack = function(){
          history.go(-1);
       } 
      
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
            
            http.post(BTPATH.QUERY_PAYFILE_QUERYFILELISTBYMAP,$.extend({},$scope.listPage,$scope.searchData))
              .success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($mainTable);
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                    $scope.historyList = common.cloneArrayDeep(data.data);                    
                    
                  });
                }   
            });
          };

    

      
      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        
              
        $scope.queryList(true); 
        setTimeout(function(){
          common.resizeIframe();
        },500) 
        
        $scope.$on('ngRepeatFinished',function(){
          setTimeout(function(){
            common.resizeIframe();
          },500) 
        });

      });
    }]);

  };

});
