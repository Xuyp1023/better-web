
define(function(require,exports,module){

  exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

    mainApp.controller('check.certificat',['$scope','http','$rootScope','$route','cache','commonService',function($scope,http,$rootScope,$route,cache,commonService){
      /*  VM绑定区域  */
      $scope.infoList = [];

      $scope.custList = [];

      $scope.statusList = BTDict.VerifySignCertStatus.toArray('value','name');

      $scope.typeList = BTDict.VerifySignCertType.toArray('value','name');

      $scope.searchData = {
        GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTEregDate:new Date().format('YYYY-MM-DD'),
        LIKEcustName:"",
        businStatus:""
      };

      //分页数据
      $scope.listPage = {
        pageNum: 1,
        pageSize: 10
      };

      $scope.currentItem = {};

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag/*1*/){
        //弹出弹幕加载状态
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_VERIFY_SIGN_CERT_LIST/*2*/,$.extend({},$scope.searchData, $scope.listPage))
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

      //添加证书
      $scope.addBox = function(){
          $scope.currentItem = {
            custNo: $scope.custList[0] ? $scope.custList[0].value : '',
            type: $scope.typeList[0] ? $scope.typeList[0].value : ''
          };
          $scope.openRollModal('add_box');
      }
      //编辑证书
      $scope.editBox = function(item){
          $scope.currentItem = angular.copy(item);
          $scope.openRollModal('edit_box');
      }
      $scope.saveCert = function(target,index){

         var $target = $(target);

         var itemId = '#certificat-info' + index;

        //设置校验项 | 校验
        validate.validate($(itemId),validOption);
        var valid = validate.validate($(itemId));
        if(!valid) return;

        // 请求后台

        if (index == 1) {
          http.post(BTPATH.SAVE_ADD_VERIFY_SIGN_CERT/*2*/,$.extend({},$scope.currentItem))
          .success(function(data){
            //关闭加载状态弹幕
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                  tipbar.infoTopTipbar('添加成功!',{});
                  $scope.queryList(true);
                  $scope.closeRollModal("add_box");
                });
              } else {
                tipbar.errorTopTipbar($target,'添加失败,服务器返回:'+data.message,3000,9992);
              }
          });
        } else {
          http.post(BTPATH.SAVE_EDIT_VERIFY_SIGN_CERT/*2*/,$.extend({},$scope.currentItem))
            .success(function(data){
              //关闭加载状态弹幕
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                  tipbar.infoTopTipbar('修改成功!',{});
                  $scope.queryList(true);
                  $scope.closeRollModal("edit_box");
                });
              } else {
                tipbar.errorTopTipbar($target,'修改失败,服务器返回:'+data.message,3000,9992);
              }
          });
        }
      }
      //校验配置1
      var validOption = {
           elements: [{
              name: 'info.interestRate',
              rules: [{name: 'required'}],
              events: ['blur']
            }],
            errorPlacement: function(error, element) {
                var label = element.parents('td').prev().text().substr(0);
                tipbar.errorLeftTipbar(element,label+error,0,99999);
            }
      };

      $scope.operFlag = 0;
      //查看详情
      $scope.lookDetail = function(item) {
        $scope.currentItem = $.extend({}, item);
        $scope.operFlag = 0;
        $scope.openRollModal('detail_box');
      }
      // 启用证书模态框
      $scope.activeCertModal = function(item) {
        $scope.currentItem = $.extend({}, item);
        $scope.operFlag = 1;
        $scope.openRollModal('detail_box');
      }
      // 禁用证书模态框
      $scope.disableCertModal = function(item) {
        $scope.currentItem = $.extend({}, item);
        $scope.operFlag = 2;
        $scope.openRollModal('detail_box');
      }
      // 请求后台，启用
      $scope.enableCert = function(target){
        var $target = $(target);
        http.post(BTPATH.SAVE_ENABLE_VERIFY_SIGN_CERT/*2*/,{id: $scope.currentItem.id})
            .success(function(data){
              //关闭加载状态弹幕
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                  tipbar.infoTopTipbar('启用成功!',{});
                  $scope.queryList(true);
                  $scope.closeRollModal("detail_box");
                });
              } else {
                tipbar.errorTopTipbar($target,'启用失败,服务器返回:'+data.message,3000,9992);
              }
          });
      }
      // 请求后台，停用
      $scope.disableCert = function(target){
        var $target = $(target);
        http.post(BTPATH.SAVE_DISABLE_VERIFY_SIGN_CERT/*2*/,{id: $scope.currentItem.id})
            .success(function(data){
              //关闭加载状态弹幕
              if(common.isCurrentData(data)){
                $scope.$apply(function(){
                  tipbar.infoTopTipbar('禁用成功!',{});
                  $scope.queryList(true);
                  $scope.closeRollModal("detail_box");
                });
              } else {
                tipbar.errorTopTipbar($target,'禁用失败,服务器返回:'+data.message,3000,9992);
              }
          });
      }

      /*!入口*/ /*控制器执行入口*/
      $scope.$on('$routeChangeSuccess',function(){
        commonService.queryBaseInfoList(BTPATH.QUERY_ALL_CUST_LIST,{},$scope,'custList').success(function(){
          
        });
        $scope.queryList(true);
        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
          common.resizeIframe();
        });

      });
    }]);

  };

});
