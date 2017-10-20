/**=========================================================
 * 青海移动-佣金导入控制器
 =========================================================*/
(function() {
    'use strict';

    angular
        .module(ApplicationConfiguration.applicationModuleName)
        .controller('scf.commission.import', MainController);

    MainController.$inject = ['$scope', 'BtUtilService','configVo','$timeout','toaster','$location'];
    function MainController($scope, BtUtilService,configVo,$timeout,toaster,$location) {

        activate();

        //  获取license
        BtUtilService
            .post(configVo.BTServerPath.Find_License)
            .then(function(jsonData){
                config.license = jsonData.data;

                try{
                    TCA.config(config);
                    
                }catch(e){
                    if (e instanceof TCACErr) {
                      window.location.href="modules/scf/commission/import/404.html";
                      return;
                      // alert(e.toStr());
                    } else {
                      alert("初始化证书失败");
                    }
                  }
                $timeout(function(){
                    refreshCertList(); // 刷新证书列表
                },100);
            });

        //  下拉数据-操作企业
        BtUtilService
            .post(configVo.BTServerPath.Query_Company_List)
            .then(function(jsonData){
                $scope.companyList = jsonData.data;

                // // 默认选择青海分公司
                $scope.importVo.custNo = $scope.companyList[0].value;
            });

        //查找佣金文件导出模版
        BtUtilService
            .post(configVo.BTServerPath.Find_template_file)
            .then(function(jsonData){
                if(jsonData.code == 200){
                   // 默认选择青海分公司
                    $scope.templateId=jsonData.data.id;
                }
            });


            

        ////////////////
        //初始化方法开始
        function activate() {

            // 提交文件导入
            $scope.submitImport = function(){

                var btParams = $location.search() || {};
                              
                BtUtilService
                    .post(configVo.BTServerPath.Submit_Import,angular.extend({},$scope.importVo,btParams))
                    .then(function(jsonData){
                        if(jsonData.code == 200){
                           // 默认选择青海分公司
                            // document.getElementById("fileToP1rResult").innerHTML = '提交成功';
                            toaster.pop('success', "", '提交成功');
                            window.location.href = "../scf2/home.html#/prePay_1/account.details";
                        }else{
                            toaster.pop('error', "", jsonData.message);
                        }
                    });
            };

            // 提交文件导入
            $scope.goBack = function(){
                window.location.href = "../scf2/home.html#/prePay_1/account.details";
            };

            // 初始化页面显示数据
            $scope.importVo = {};

            // 文件选择事件
            window.fileChange = function(input){
                if(!input.value){return;}
                var iForm = input.parentElement;
                iForm.submit();
            };

            window.iframeLoad = function(iframe,index){
                var iDocument = iframe.contentWindow.document;
                var resultStr = iDocument.body.innerHTML;
                if(resultStr.length !== 0){
                    if(resultStr.indexOf("{") ==-1){
                        resultStr = { "message":"上传文件成功", "data":{ "id":11616, "batchNo":"", "fileName":"相关文件.doc", "fileType":"tar.gz", "fileNo":"", "filePath":"/20160401/edcc61453cab438f989ee7fa4c8b41f8", "fileLength":204944, "regDate":"", "regTime":"", "fileInfoType":"CustOwnBrand", "fileInfo":"", "inner":false }, "page":"", "code":200 };
                    }else{
                        resultStr = angular.fromJson(resultStr);
                    }
                    // 上传成功响应
                    if(resultStr.code == 200){

                        FileP1SignData();
                        if(document.getElementById("fileToP1rResult").innerHTML == 'invalid'){
                            toaster.pop('error', "", '签名失败');
                        }else{
                            $scope.$apply(function(){
                                $scope.importVo.fileId = resultStr.data.id;
                                $scope.importVo.signature = document.getElementById("fileToP1SignData").value;
                                  
                                // $scope.importVo.infoType=3;
                                toaster.pop('success', "", '签名成功');
                            });
                        }
                    }else{ // 上传失败响应
                        // tipbar.errorLeftTipbar($("#bt_upload_label"+index),resultStr.message,3000);
                    }
                }else{
                    // document.getElementById("fileToP1SignData").innerHTML = resultStr;
                }
            };

        } // 初始化结束
    }

})();
