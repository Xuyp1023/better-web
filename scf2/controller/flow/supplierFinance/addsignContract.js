
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('addsignContract',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
        $scope.infoList = [];
        $scope.uploadList = [];
        $scope.attachList = [];

       var bbb=Math.floor(Math.random()*10+1);
       $scope.aaa= bbb;


       
       $scope.searchData = {
        GTEorderDate:''
       }
       $scope.addinfolist = function(){
          if($scope.infoList.length<=9){
           var j = {};
           $scope.infoList.push(j);
         }else if($scope.infoList.length>9){
            tipbar.infoTopTipbar('信息列表已达上限!',{});
         }
       }
       $scope.deleinfo = function($index){
          $scope.infoList.splice(this.$index,1);
       }
       $scope.addsignContract = function(){
        window.location.href = '../scf2/home1.html#?rn='+new Date().getTime()+'/#/scf/contract/econtractsetstamp';
       }
       $scope.gobeak = function(){
        window.location.href = '../scf2/home.html#/flow/supplierFinance/launchSignContract';
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
 
        }
      };


      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
  
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
