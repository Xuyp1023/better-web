/*
企业认证
作者:hrb
*/
define(function(require,exports,module){
    require.async(['dicTool','bootstrap'],function(){
    require.async(['BTDictData'],function(){
	var validate = require("./libs/validate");
    var tipbar = require("./libs/tooltip");
    var common = require("./libs/common");
    var loading = require("./libs/loading");
    var comdirect = require("./libs/commondirect");
    var comfilter = require("./libs/commonfilter");
    var BTPATH = require("./libs/commonpath");
    var upliad = require("./libs/uploads");
   
    require('angular');

    //定义模块
    var mainApp = angular.module('mainApp',['upload']);

    //扩充公共指令库
    comdirect.direcPlus(mainApp);

    //扩充公共过滤器
    comfilter.filterPlus(mainApp);


    //控制器区域
    mainApp.controller('mainController',['$scope',function($scope){

        //查询
        $scope.searchData = {
            custNo:''
        };

        //账户列表
        $scope.custList = [];

        //上传框架标识
        $scope.uploadCallBack = {};

        //认证类型
        $scope.uploadType = initUploadType();

        //已上传的认证文件列表及相关信息
        $scope.uploadList = createUploadList();

        //是否正在上传
        $scope.uploading = false;

        //上传完成标志
        $scope.uploadComplete = false;

        //上传配置
        $scope.uploadConf={};
        //开启上传
        $scope.openUpload = function(event,type,typeName,list,topBox){
            //回调
            var callback = (function(scope){
                return function(){
                    //上传结束
                    scope.uploading = false;
                };
            })($scope);

            $scope.uploadConf = {
                //上传触发元素
                event:event.target||event.srcElement,
                //上传附件类型
                type:type,
                //类型名称
                typeName:typeName,
                //存放上传文件
                uploadList:$scope.uploadList[type].list,
                //当前页面div
                topBox:'file_upload_box',
                //错误提示方式 note/slide
                prompt:'slide',
                //是否显示标题
                showTitle:false,
                //触发组件动作
                watch:Math.random(),
                //回调
                callback:callback
            };
            //正在上传
            $scope.uploading = true;
        };

    
        //初始化认证类型
        function initUploadType(){  
            var tArr = [
                //基本认证项
                'officeSiteFile','orderFlowFile','bankFlowFile','bizLicenseFile','orgCodeFile','taxRegistFile','representIdFile','bankAcctAckFile','brokerIdFile',
                //保理认证项
                'signCertificateFile','signStampFile','controllerldFile','corporationBankAccountFlow',
                'corporationAuthorizeLetter','corporationCertificate','corporationCreditReport','companyRule','companyFinancialStatement',
                'companyCreditReport','companyTaxCertificate','coupleIdFile',
                'accountsReceivableDetailFile','proveAssetsFile','shareholderResolutionFile','capitalReportFile',
                //基金申请材料
                'authorizeFile','serviceContractFile'
            ];
            return tArr;
        }


        //为所有认证类型构建对象
        function createUploadList(){
            var list = {};
            for (var i in $scope.uploadType) {
                //认证类型
                var type = $scope.uploadType[i];
                list[type] = {
                    type:type,
                    status:0,
                    list:[]
                };
            }
            return list;
        }


        //判断是否上传完成(所有认证项都已提交审核）
        $scope.uploadStatusJudge = function(){
            //遍历判断认证状态
            for(var i in $scope.uploadType){
                var type = $scope.uploadType[i];
                var status = $scope.uploadList[type].status;
                // "0"表示尚未审批  "9"表示审批失败 
                if(status==="0" || status===0 || status==="9" || status===9){
                    return false;
                }
            }
            $scope.uploadComplete = true;
        };


        //判断当前认证项是否可以上传文件( single:只允许上传单个文件 )
        $scope.itemUpload = function(type,single){
            var length = $scope.uploadList[type].list.length;
            var status = $scope.uploadList[type].status;
            //当前状态只有为（未审批或审批失败），才允许上传
            if(status==="0" || status===0 || status==="9" || status===9){
                // single为true 且已上传文件
                if(single && length!==0){
                    return false;
                }
                return true;
            }
            return false;
        };


        //判断当前认证项是否可以删除附件
        /*$scope.itemDelete = function(type){
            var status = $scope.uploadList[type].status;
            //当前状态只有为（未审批或审批失败），才允许操作
            if(status==="0" || status===0 || status==="9" || status===9){
                return true;
            }
            return false;
        };*/



        //页面初始化加载认证信息  
        $scope.initCertificateInfo = function(callback){
            //账户切换，置空认证信息，重新加载
            $scope.uploadList=createUploadList();
            $.post(BTPATH.INIT_CERTIFICATE_INFO,$scope.searchData,function(data){
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.data.length!==0)&&(data.code === 200)){
                   $scope.$apply(function(){
                        //遍历上传类型
                        for (var i in $scope.uploadType) {
                            var type = $scope.uploadType[i];
                            //获取类型详情
                            var detail =  ArrayPlus(data.data).objectChildFilter('workType',type)[0];
                            if(!detail){
                                continue;
                            }
                            var fileArray = [];
                            //类型对应的文件列表
                            for(var j in detail.fileList){
                                var splitArr = detail.fileList[j].split(":");
                                fileArray.push({
                                    id:splitArr[0],
                                    fileName:splitArr[1]
                                });
                            }
                            $scope.uploadList[type] = {
                                type:type,
                                status:detail.auditStatus,
                                list:fileArray
                            };
                        }
                        if(callback) callback();
                   });
                }
            },"json");
        };


        //获取核心企业账户列表
        $scope.queryCustList = function(callback){
            $.post(BTPATH.CUST_PATH,{},function(data){
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                    $scope.$apply(function(){
                        $scope.custList = data.data;
                        $scope.searchData.custNo = data.data[0].value;
                    });
                    if(callback) callback();
                }
            },'json');
        };


        //账号切换
        $scope.changeCust = function(){
            //初始化认证信息
            $scope.initCertificateInfo(function(){
                //判断认证状态
                $scope.uploadStatusJudge();
            });
        };



        //提交认证信息
        $scope.submitCertificate = function(target){
            $(target).hide();
            var postParam = [];
            //遍历已上传的认证信息
            for (var i in $scope.uploadList) {
                var item = $.extend({},$scope.uploadList[i]);
                //文件id集合
                item.id = ArrayPlus(item.list).extractChildArray('id',true);
                //判断认证信息是否存在为空的项
                /*if(!item.id){
                    $(target).show();
                    tipbar.errorLeftTipbar($(target),'请上传完整的认证信息！',3000,999999);
                    return;
                }*/
                delete item.list;
                postParam.push(item);
            }

            $.post(BTPATH.SUBMIT_CERTIFICATE_INFO,$.extend({"param":postParam},$scope.searchData),function(data){
                if(data&&(data.code === 200)){
                    $(target).show();
                    tipbar.infoTopTipbar('提交认证成功！', {});
                }else{
                    $(target).show();
                    tipbar.errorLeftTipbar($(target),'提交认证失败，服务端返回信息:'+data.message,3000,999999);
                }
                
            },"json");

        };


        //删除上传附件
        $scope.removeUpload = function(data,type,event){
            var target = $(event.srcElement||event.target).parents('tr');
            var uploadType = type;
            $scope.uploadList[uploadType].list.pop(data);
        };

        //切换面板
        $scope.switchTab = function(event) {
            var $target = $(event.srcElement ? event.srcElement : event.target);
            $target.tab('show');
        };

        /*公共绑定*/
        $scope.$on('ngRepeatFinished',function(){
            common.resizeIframeListener();  
        });

        //初始化账户列表
        $scope.queryCustList(function(){
            //初始化认证信息
            $scope.initCertificateInfo(function(){
                //判断认证状态
                $scope.uploadStatusJudge();
            });
        });
        

        
       


    }]);

   	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);

});
});
});