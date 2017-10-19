/*
    公告管理
    作者:herb
*/
define(function(require,exports,module){
    require.async(['dicTool','bootstrap',"datePicker"],function(){
    require.async(['BTDictData'],function(){
    var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var dialog = require("dialog");
    var comfilter = require("filter");
    var comservice = require("service_s2");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var upload = require("upload");
    var modal = require('modal');
    var multiple = require("multiSelect");
    require('date');
    require('editor');
    var base64 = require('base64');

    //定义模块
    var mainApp = angular.module('mainApp',['modal','date','pagination','editor','upload','multiple']);

    //扩充公共指令库|过滤器|服务
    comdirect.direcPlus(mainApp);
    comfilter.filterPlus(mainApp);
    comservice.servPlus(mainApp);

    //控制器区域
    mainApp.controller('mainController',['$scope','commonService','http',function($scope,commonService,http){
        /*VM绑定区域*/

        //机构类型列表
        $scope.roleTypeList = BTDict.OrgRoleType.toArray('value','name');

        //公告列表
        $scope.noticeList = [];
        //公告详情
        $scope.noticeInfo = {};
        //机构列表
        $scope.custList = [];
        //关联机构列表
        $scope.linkedCustList = [];
        //附件类型
        $scope.attachTypes = BTDict.NoticeAttachment.toArray('value','name');
        //附件列表
        $scope.attachList = [];

        //查询条件
        $scope.searchData = {
            LIKEsubject : '',
            GTEregDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
            LTEregDate:new Date().format('YYYY-MM-DD')
        };

        //分页数据
        $scope.listPage = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
        };

        //检查机构类型
        $scope.checkOrgType = function(role){
            http.post(BTPATH.CHECK_ORG_TYPE,{role:role}).success(function(data){
                if(data.data){
                    $scope.$apply(function(){
                        //检查成功
                        $scope.currRole = role;
                    });
                }
            });
        };


        /*事件处理区域*/
        //查询资料代录
        $scope.searchList = function(){
            $scope.listPage.pageNum = 1;
            $scope.reFreshNoticeList(true);
        };


        //刷新公告列表数据
        $scope.reFreshNoticeList = function(flag){
            //是否需要分页信息 1：需要 2：不需要
            $scope.listPage.flag = flag ? 1 : 2;
            //弹出弹幕加载状态
            loading.addLoading($('#search_info table'),common.getRootPath());
            http.post(BTPATH.QUERY_NOTICE_LIST,$.extend({},$scope.listPage,$scope.searchData)).success(function(data){
                //关闭加载状态弹幕
                loading.removeLoading($('#search_info table'));
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                      $scope.noticeList = common.cloneArrayDeep(data.data);
                      if(flag){
                        $scope.listPage = data.page;
                      }
                  });
                }   
            });
        };


        //账户切换 关联客户改变
        $scope.custChange = function(custNo){
            $scope.getLinkedCust(custNo);
            //置空选择客户
            $scope.noticeInfo.targetCust = '';
        };


        //获取关联用户
        $scope.getLinkedCust = function(custNo,callback){
            var promise = $.Deferred();
            //当前机构为 “平台”
            if($scope.currRole==="PLATFORM_USER"){
                $scope.linkedCustList = $scope.roleTypeList;
                promise.resolve();
                return promise;
            }
            promise = http.post(BTPATH.QUERY_CUST_RELATION,{custNo:custNo}).success(function(data){
                if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                  $scope.$apply(function(){
                      $scope.linkedCustList = common.cloneArrayDeep(data.data);
                  });
                }   
            });
            return promise;
        };



        //获取公告详情     id|公告ID
        $scope.findNoticeDetail =function(item){
            if(!item.id) return;
            var promise = http.post(BTPATH.FIND_NOTICE_DETAIL,{id:item.id}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.noticeInfo = data.data;
                    });
                }   
            });
            return promise;
        };


        //查询附件列表
        $scope.queryAttachList = function(batchNo){
            if(!batchNo) return;
            http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:batchNo}).success(function(data){
                if(common.isCurrentData(data)){
                    $scope.$apply(function(){
                        $scope.attachList = common.cloneArrayDeep(data.data);
                    });
                }   
            });
        };


        //添加并发布公告
        $scope.submitPublishNotice = function(target){
            //设置校验项 | 校验
            validate.validate($('#addNotice_form'),validOption);
            var valid = validate.validate($('#addNotice_form'));
            if(!valid) return;

            var content = UE.loadEditor("noticeAddContent").getContent();
            if(!content){
                tipbar.errorTopTipbar($(target),'公告内容不能为空!',3000,9992);
                return;
            }
            var detailInfo = $scope.noticeInfo;
            detailInfo.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);    //附件Ids
            detailInfo.content = base64.uriBase64Encode(content);   //base64 压缩 content
            http.post(BTPATH.ADD_PUBLISH_NOTICE,detailInfo).success(function(data){
                if(data&&(data.code === 200)){
                    //刷新公告列表
                    $scope.reFreshNoticeList(true);
                    $scope.closeRollModal("add_notice_module_box");
                    tipbar.infoTopTipbar('公告发布成功!',{});
                }else{
                    tipbar.errorTopTipbar($(target),'公告发布失败,服务器返回:'+data.message,3000,9992);
                }
             });
        };


        //添加并暂存公告
        $scope.submitStoreNotice = function(target){
            //设置校验项 | 校验
            validate.validate($('#addNotice_form'),validOption);
            var valid = validate.validate($('#addNotice_form'));
            if(!valid) return;

            var content = UE.loadEditor("noticeAddContent").getContent();
            if(!content){
                tipbar.errorTopTipbar($(target),'公告内容不能为空!',3000,9992);
                return;
            }
            var detailInfo = $scope.noticeInfo;
            detailInfo.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);    //附件Ids
            detailInfo.content = base64.uriBase64Encode(content);   //base64 压缩 content
            http.post(BTPATH.ADD_STORE_NOTICE,detailInfo).success(function(data){
                if(data&&(data.code === 200)){
                    //刷新公告列表
                    $scope.reFreshNoticeList(true);
                    $scope.closeRollModal("add_notice_module_box");
                    tipbar.infoTopTipbar('公告暂存成功!',{});
                }else{
                    tipbar.errorTopTipbar($(target),'公告暂存失败,服务器返回:'+data.message,3000,9992);
                }
             });
        };


        //修改并发布公告
        $scope.modifyPublishNotice = function(target){
            //设置校验项 | 校验
            validate.validate($('#editNotice_form'),validOption);
            var valid = validate.validate($('#editNotice_form'));
            if(!valid) return;

            var content = UE.loadEditor("noticeEditContent").getContent();
            if(!content){
                tipbar.errorTopTipbar($(target),'公告内容不能为空!',3000,9992);
                return;
            }
            var detailInfo = $scope.noticeInfo;
            detailInfo.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);    //附件Ids
            detailInfo.content = base64.uriBase64Encode(content);   //base64 压缩 content
            http.post(BTPATH.EDIT_PUBLISH_NOTICE,detailInfo).success(function(data){
                if(data&&(data.code === 200)){
                    //刷新公告列表
                    $scope.reFreshNoticeList(true);
                    $scope.closeRollModal("edit_notice_module_box");
                    tipbar.infoTopTipbar('公告发布成功!',{});
                }else{
                    tipbar.errorTopTipbar($(target),'公告发布失败,服务器返回:'+data.message,3000,9992);
                }
             });
        };


        //修改并暂存公告
        $scope.modifyStoreNotice = function(target){
           //设置校验项 | 校验
            validate.validate($('#editNotice_form'),validOption);
            var valid = validate.validate($('#editNotice_form'));
            if(!valid) return;

            var content = UE.loadEditor("noticeEditContent").getContent();
            if(!content){
                tipbar.errorTopTipbar($(target),'公告内容不能为空!',3000,9992);
                return;
            }
            var detailInfo = $scope.noticeInfo;
            detailInfo.fileList = ArrayPlus($scope.attachList).extractChildArray('id',true);    //附件Ids
            detailInfo.content = base64.uriBase64Encode(content);   //base64 压缩 content
            http.post(BTPATH.EDIT_STORE_NOTICE,detailInfo).success(function(data){
                if(data&&(data.code === 200)){
                    //刷新公告列表
                    $scope.reFreshNoticeList(true);
                    $scope.closeRollModal("edit_notice_module_box");
                    tipbar.infoTopTipbar('公告暂存成功!',{});
                }else{
                    tipbar.errorTopTipbar($(target),'公告暂存失败,服务器返回:'+data.message,3000,9992);
                }
             });
        };



        //发布公告
        $scope.publishNotice = function(item){
            dialog.confirm('确认发布该条公告？',function(){
                http.post(BTPATH.PUBLISH_NOTICE,{id:item.id}).success(function(data){
                    if(common.isCurrentData(data)){
                        //刷新公告列表
                        $scope.reFreshNoticeList(false);
                        tipbar.infoTopTipbar('公告发布成功!',{});
                    }
                });
            });
        };


        //撤销公告
        $scope.cancelNotice = function(item){
            dialog.confirm('确认撤销该条公告？',function(){
                http.post(BTPATH.CANCEL_NOTICE,{id:item.id}).success(function(data){
                    if(common.isCurrentData(data)){
                        //刷新公告列表
                        $scope.reFreshNoticeList(false);
                        tipbar.infoTopTipbar('公告撤销成功!',{});
                    }
                });
            });
        };



        /*
         *模板显隐控制区域
        */
        //打开公告新增
        $scope.openNoticeAddBox = function(){
            $scope.openRollModal("add_notice_module_box",null,function(){
                multiple.resizeWidth();
            });
            var defCustNo = $scope.custList[0].value;
            //置空与默认值
            $scope.noticeInfo = {
                custNo:defCustNo
            };
            $scope.attachList = [];
            //查询关联客户
            $scope.getLinkedCust(defCustNo);
        };


        //打开公告编辑
        $scope.openNoticeEditBox = function(item){
            $scope.openRollModal("edit_notice_module_box",null,function(){
                multiple.resizeWidth();
            });
            // var defCustNo = $scope.custList[0].value;
            //置空附件列表
            $scope.attachList = [];
            $scope.noticeInfo = {};
            //获取公告详情
            $scope.findNoticeDetail(item).success(function(){
                //设置编辑器
                var content = base64.uriBase64Decode($scope.noticeInfo.content);
                UE.loadEditor("noticeEditContent").setContent(content);
                //查询附件列表
                $scope.queryAttachList($scope.noticeInfo.batchNo);
                //查询关联客户
                $scope.getLinkedCust($scope.noticeInfo.custNo);
            });
        };


        //打开公告详情
        $scope.openNoticeInfoBox = function(item){
            $scope.openRollModal("notice_detail_box",null,function(){
                multiple.resizeWidth();
            });
            //置空
            $scope.noticeInfo = {};
            $scope.attachList = [];
            UE.loadEditor("noticeInfoContent").setContent("");
            //获取公告详情
            $scope.findNoticeDetail(item).success(function(){
                //设置编辑器
                var content = base64.uriBase64Decode($scope.noticeInfo.content);
                var editorObj = UE.loadEditor("noticeInfoContent");
                editorObj.setContent(content);
                editorObj.disable();
                //查询附件列表
                $scope.queryAttachList($scope.noticeInfo.batchNo);
                //查询关联客户
                $scope.getLinkedCust($scope.noticeInfo.custNo).done(function(){
                    //获取公告范围
                    var targetCust = $scope.noticeInfo.targetCust,
                        targetName;
                    for(var i=0 ;i< $scope.linkedCustList.length ;i++){
                        var temp = $scope.linkedCustList[i];
                        if(targetCust.indexOf(temp.value)!==-1){
                            targetName = targetName ? targetName + "," + temp.name : temp.name ;
                        }
                    }
                    targetName = targetName || "默认发送给所有机构";
                    $scope.$apply(function(){
                        $scope.noticeInfo.targetCustName = targetName;
                    });
                });
            });
        };


        //开启上传(下拉选择附件类型)
        $scope.openUploadDropdown = function(event,typeList,list){
          $scope.uploadConf = {
            //上传触发元素
            event:event.target||event.srcElement, 
            //附件类型列表
            typeList:$scope[typeList],
            //存放上传文件
            uploadList:$scope[list]
          };
        };


        //校验配置
        var validOption = {
              elements: [{
                  name: 'noticeInfo.custNo',
                  rules: [{name: 'required'}],
                  events:['blur']
              },{
                  name: 'noticeInfo.subject',
                  rules: [{name: 'required'}],
                  events:['blur']
              }],
              errorPlacement: function(error, element) {
                  var label = element.parents('td').prev().text().substr(0);
                  tipbar.errorLeftTipbar(element,label+error,0,99999);
              }
        };


        //页面初始化
        commonService.initPage(function(){
            //当前操作员下机构
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'custList').success(function(){
               $scope.reFreshNoticeList(true);
            });
            //判断当前机构是不是“平台”
            $scope.checkOrgType("PLATFORM_USER");
        });

    }]);



    //手动装载angular模块
    angular.bootstrap($('#container'),['mainApp']);
});
});
});

