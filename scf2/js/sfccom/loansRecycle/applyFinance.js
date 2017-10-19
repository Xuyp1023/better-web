/*
  供应商/经销商融资列表
  @anthor:tanp
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
    var date = require("date");
    var multiple =require("multiSelect");
    require('modal');
    require('date');

  //定义模块
  var mainApp = angular.module('mainApp',['pagination','modal','date','multiple']);

  //扩充公共服务|指令|过滤器
  comservice.servPlus(mainApp);
  comdirect.direcPlus(mainApp);
  comfilter.filterPlus(mainApp);

  //控制器区域
  mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){
    // 融资企业|保理公司|核心企业
    $scope.custList = [];
    $scope.factorList = [];
    $scope.coreCustList = [];
    //融资状态;
    $scope.requestTypeList = BTDict.RequestQueryStatus.toArray('value','name').slice(1,3);

    //还款类型列表
    $scope.paymentTypes =[];
    //还款人列表
    $scope.payCustList = [];

    /*VM绑定区域*/
    $scope.searchData = {
      custNo:'',
      coreCustNo:'',
      factorNo:'',
      requestType:$scope.requestTypeList[0].value
    };
    //分页数据
    $scope.listPage = {
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1
    };
    //供应商融资申请列表
    $scope.infoList = [];
    //单个供应商融资申请信息
    $scope.info = {};
    //还款详情
    $scope.paymentInfo={};
    //发货通知单列表
    $scope.sendNoticeList = [];
    //选择的发货通知单
    $scope.deliverys = '';

    $scope.contractList = [];   //合同列表
    $scope.paymentRecordList = [];  //还款记录列表
    $scope.pressMoneyList = [];   //催收列表
    $scope.exemptList = [];     //豁免列表
    
    //催收详情
    $scope.pressMoneyInfo = {};
    //催收企业列表
    $scope.pressCmpList = [];
    //豁免详情
    $scope.exemptInfo = {};


    //区分不同库户类型标志
    $scope.custTypeInfo = (function(){
      var custFlag = location.hash.substr(1),
          custTypeInfo = {},
          isSupplier = custFlag === 'supplier';
      custTypeInfo.cust_list_path = isSupplier?BTPATH.QUERY_DIC_SUPPLIERLIST:BTPATH.QUERY_DIC_AGENCYLIST;
      custTypeInfo.cust_type = isSupplier?'supplier':'agency';
      custTypeInfo.cust_type_name = isSupplier?'供应商':'经销商';

      $scope.searchData.custType = isSupplier?'1':'2';
      return custTypeInfo;
    })();




    //------------------------------------ （融资依据） ------------------------------------
    //订单列表
    $scope.orderList = [];
    //应收账款列表
    $scope.recieveList = [];
    //票据列表
    $scope.billList = [];

    /* 关联列表 配置 */
    var _linkedConfig = {
      1:{
        type:'order',
        list_name:'orderList'     //列表VM名称
      },
      2:{
        type:'bill',
        list_name:'billList'      //列表VM名称
      },
      3:{
        type:'recieve',
        list_name:'recieveList'    //列表VM名称
      },
      4:{ //供应商融资，也是查询订单列表
        type:'order',
        list_name:'orderList'       //列表VM名称
      }
    };
    // 关联类型（即融资申请类型）
    $scope.linkedType = '';



    /*事件处理区域*/
    //查询供应商融资申请
    $scope.searchList = function(){
      $scope.listPage.pageNum = 1;
      $scope.queryList(true);
    };


    //改变机构的联动
    $scope.changeCust = function(){
      //根据保理公司查询核心企业列表
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList').success(function(){
            // $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
            $scope.searchData.coreCustNo = '';
      });
      //根据核心企业查询融资企业列表
      $scope.changeCore();
    };

    //核心企业变化
    $scope.changeCore = function(){
      //根据核心企业查询融资企业列表
      commonService.queryBaseInfoList($scope.custTypeInfo.cust_list_path,{coreCustNo:$scope.searchData.coreCustNo},$scope,'custList').success(function(){
            // $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value:'' ;
            $scope.searchData.custNo = '';
      });
    };


    //获取融资申请列表
    $scope.queryList = function(flag){
      //弹出弹幕加载状态
      $scope.listPage.flag = flag? 1 : 2;
      loading.addLoading($('#search_info table'),common.getRootPath());
      $.post(BTPATH.QUERY_CORE_ENTERPRISEREQUEST,$.extend({},$scope.searchData,$scope.listPage),function(data){
        //关闭加载状态弹幕
        loading.removeLoading($('#search_info table'));
        if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
          $scope.$apply(function(){
            $scope.infoList = common.cloneArrayDeep(data.data);
            if(flag){
              $scope.listPage = data.page;
            }
          });
        }
      },'json');
    };






    //-------------------------------------融资详情相关操作 start ------------------------------


    //查询融资详情 传入申请单编号
    $scope.queryFinanceInfo = function(requestNo){
      var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope.info = data.data;
            });
          }  
      });
      return promise;
    };


    //查询关联列表（订单|应收账款|票据）
    $scope.querySelectList = function(data){
      //置空关联类型
      $scope.linkedType = '';
      var requestType = data.requestType,
            requestNo = data.requestNo,
            config = _linkedConfig[requestType];
      if(requestType && config){
        //设置关联类型
        $scope.linkedType = config.type;
        http.post(BTPATH.FIANACE_REQUEST_LINKED_LIST,{"requestType":requestType,"requestNo":requestNo}).success(function(data){
            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
              $scope.$apply(function(){
                  $scope[config.list_name] = common.cloneArrayDeep(data.data);
              });
            }   
        });
      }
    };



    //-------------------------------------还款相关操作 start ------------------------------

    //监听，填写实际还款日期
    $scope.$watch("paymentInfo.payDate",function(newValue,oldValue){
        if(newValue && newValue!==oldValue){
          //查询还款类型
          $scope.calculatePayType(newValue);
        }
    });

    //根据实际还款日期查询还款类型
    $scope.calculatePayType = function(payDate){
      //申请单号
      var requestNo = $scope.info.requestNo;
      var promise = http.post(BTPATH.CALCULAT_PAY_TYPE,{requestNo:requestNo,payDate:payDate}).done(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope.paymentTypes = common.cloneArrayDeep(data.data);
                //默认选中第一种还款方式
                $scope.paymentInfo.payType = $scope.paymentInfo.payType || data.data[0].value;
                //还款方式改变带出其他信息
                $scope.payTypeChange();
            });
          }   
      });
      return promise;
    };


    //监听 “还款总额”   查询还款详情  （提前还款不监听 总额）
    $scope.$watch("paymentInfo.totalBalance",function(newValue,oldValue){
        var payType = $scope.paymentInfo.payType; //还款方式
        //提前还款，不做操作
        if(payType*1 === 2) return;

        if(!newValue || newValue===oldValue) return;

        //经销商还款
        if(payType*1 === 6){
            $scope.calculateInterest();
        }//正常还款（“还款总额” 不能大于 "未还合计" 金额）
        else if(payType*1 === 1){
            var maxBalance = $scope.info.payPlan.surplusTotalBalance; //未还合计
            if(newValue > maxBalance) $scope.paymentInfo.totalBalance = maxBalance;
            //新值大于 最大金额 
            if(oldValue == maxBalance && newValue > maxBalance) return;
            //旧值大于 最大金额
            if(oldValue > maxBalance && newValue == maxBalance) return;
            //正常还款
            $scope.calculateSupplyInterest();
        }
    });


    //还款方式变化
    $scope.payTypeChange = function(){
      var payType = $scope.paymentInfo.payType; //还款方式
      //经销商还款
      if(payType*1 === 6){
          //查询经销商还款详情
          $scope.calculateInterest().done(function(){
            common.resizeIframeListener();
            multiple.resizeWidth();
          });
          //查询发货通知单
          $scope.querySendNoticeList();
          return;
      }
      //查询还款金额
      $scope.queryPaymentInfo().done(function(){
        common.resizeIframeListener();
      });
    };



    //还款类型变化 查询还款金额（供应商） 传入申请单编号,还款类别，保理公司编号
    $scope.queryPaymentInfo = function(){
      var param = {
        requestNo:$scope.info.requestNo,
        payType:$scope.paymentInfo.payType,
        payDate:$scope.paymentInfo.payDate,
        factorNo:$scope.info.factorNo,
        totalBalance:$scope.paymentInfo.totalBalance
      };
      var promise = http.post(BTPATH.QUERY_REPAYMENT_FEE,param).done(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                //已有 还款方式 和 实际还款日期 | 计划还款时间 | 还款总额
                $scope.paymentInfo = $.extend(data.data,{
                  payType:$scope.paymentInfo.payType,
                  payDate:$scope.paymentInfo.payDate,
                  planPayDate:$scope.paymentInfo.planPayDate
                });
                //还款人列表( 融资企业 + 核心企业 )
                var custList = new ListMap();
                custList.set($scope.info.custNo,$scope.info.custName);
                custList.set($scope.info.coreCustNo,$scope.info.coreCustName);
                $scope.payCustList = custList.toArray("value","name");
                //默认选中第一个
                $scope.paymentInfo.payCustNo = $scope.payCustList[0] ? $scope.payCustList[0].value : '';
            });
          }   
      });
      return promise;
    };



    //根据还款总额分配还款金额 （经销商）
    $scope.calculateInterest = function(){
      var param = {
            requestNo:$scope.info.requestNo,
            payDate:$scope.paymentInfo.payDate,
            payType:$scope.paymentInfo.payType,
            totalBalance:$scope.paymentInfo.totalBalance
          };
      var promise = http.post(BTPATH.QUERY_SELLER_REPAYMENT_FEE,param).done(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                //已有 还款方式 和 实际还款日期 | 计划还款时间 | 还款总额
                $scope.paymentInfo = $.extend(data.data,{
                  payType:$scope.paymentInfo.payType,
                  payDate:$scope.paymentInfo.payDate,
                  planPayDate:$scope.paymentInfo.planPayDate,
                  //已有还款总额就不带出
                  totalBalance:$scope.paymentInfo.totalBalance ? $scope.paymentInfo.totalBalance : data.data.totalBalance
                });
                $scope.paymentInfo.ratio = $scope.info.payPlan.ratio;
                $scope.paymentInfo.managementRatio = $scope.info.payPlan.managementRatio;
                //还款人列表( 融资企业)
                var custList = new ListMap();
                //经销商融资还款人只能是经销商,不能是核心企业
                custList.set($scope.info.custNo,$scope.info.custName);
                $scope.payCustList = custList.toArray("value","name");
                //默认选中第一个
                $scope.paymentInfo.payCustNo = $scope.payCustList[0] ? $scope.payCustList[0].value : '';
            });
          }   
      });
      return promise;
    };


    //根据还款总额分配还款金额 （供应商）
    $scope.calculateSupplyInterest = function(){
      var param = {
            requestNo:$scope.info.requestNo,
            payDate:$scope.paymentInfo.payDate,
            payType:$scope.paymentInfo.payType,
            totalBalance:$scope.paymentInfo.totalBalance
          };
      var promise = http.post(BTPATH.QUERY_SUPPLY_REPAYMENT_FEE,param).done(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                //已有 还款方式 和 实际还款日期 | 计划还款时间 | 还款总额
                $scope.paymentInfo = $.extend(data.data,{
                  payType:$scope.paymentInfo.payType,
                  payDate:$scope.paymentInfo.payDate,
                  planPayDate:$scope.paymentInfo.planPayDate,
                  //已有还款总额就不带出
                  totalBalance:$scope.paymentInfo.totalBalance ? $scope.paymentInfo.totalBalance : data.data.totalBalance
                });
                $scope.paymentInfo.ratio = $scope.info.payPlan.ratio;
                $scope.paymentInfo.managementRatio = $scope.info.payPlan.managementRatio;
                //还款人列表( 融资企业 + 核心企业 )
                var custList = new ListMap();
                custList.set($scope.info.custNo,$scope.info.custName);
                custList.set($scope.info.coreCustNo,$scope.info.coreCustName);
                $scope.payCustList = custList.toArray("value","name");
                //默认选中第一个
                $scope.paymentInfo.payCustNo = $scope.payCustList[0] ? $scope.payCustList[0].value : '';
            });
          }   
      });
      return promise;
    };


    //确认还款
    $scope.saveRepayment = function(target){
        $scope.paymentInfo.requestNo = $scope.info.requestNo;
        $scope.paymentInfo.planId = $scope.paymentInfo.payPlanId;

        var payType = $scope.paymentInfo.payType; //还款方式
        //经销商还款,必须要选择发货通知单
        if(payType*1 === 6 && !$scope.deliverys){
          tipbar.errorLeftTipbar($(target),'请先选择发货通知单！',3000,999999);
          return false;
        }
        //经销商还款,还款金额不能小于利息和其他费用之和
        var interestBalance = $scope.paymentInfo.interestBalance*1,
            managementBalance = $scope.paymentInfo.managementBalance*1,
            totalBalance = $scope.paymentInfo.totalBalance*1;
        if(payType*1 === 6 &&　totalBalance < interestBalance + managementBalance){
          tipbar.errorLeftTipbar($(target),'还款金额不能小于利息和其他费用之和！',3000,999999);
          return false;
        }
        http.post(BTPATH.SAVE_REPAYMENT_RECORD,$scope.paymentInfo).success(function(data){
            if(data && data.code === 200){
              $scope.$apply(function(){
                  tipbar.infoTopTipbar('确认还款成功!',{});
                  var requestNo = $scope.info.requestNo;
                  //刷新融资详情信息
                  $scope.queryFinanceInfo(requestNo);
                  //刷新还款记录列表
                  commonService.queryBaseInfoList(BTPATH.FIND_PAYMENT_RECORD_LIST,{requestNo:requestNo},$scope,'paymentRecordList');
                  //还款后刷新
                  $scope.queryList(false);
                  $scope.closeRollModal("payment_info_box");
              });
            }else{
                tipbar.errorTopTipbar($(target),'确认还款失败,服务器返回:'+data.message,3000,9999);
            }
        });
    };


    //查询发货通知单列表
    $scope.querySendNoticeList = function(){
      //所属企业编号
      var factorNo = $scope.info.factorNo;
      var promise = http.post(BTPATH.QUERY_DROPDOWN_DEVLILIST,{factorNo:factorNo}).done(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope.sendNoticeList = common.cloneArrayDeep(data.data);
            });
          }   
      });
      return promise;
    };






    //---------------------------------- 催收相关 -------------------------start

    //查询催收列表数据 ( todo )
    /*$scope.queryPressMoney = function(requestNo){
        http.post(BTPATH.FIND_PRESS_MONEY_LIST,{requestNo:requestNo}).success(function(data){
            if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
              $scope.$apply(function(){
                  $scope.pressMoneyList = common.cloneArrayDeep(data.data);
              });
            }   
        });
    };*/


    //新增催收
    $scope.addPressMoney = function(target){
        http.post(BTPATH.ADD_PRESS_MONEY_INFO,$scope.pressMoneyInfo).success(function(data){
            if(data&&(data.code === 200)){
                //刷新催收列表
                commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{
                    requestNo:$scope.info.requestNo
                },$scope,'pressMoneyList');
                //关闭面板
                $scope.closeRollModal("add_collrecord_info_box");
                tipbar.infoTopTipbar('新增催收成功!',{});
            }else{
                tipbar.errorTopTipbar($(target),'新增催收失败,服务器返回:'+data.message,3000,9992);
            }
         });
    };  


    //修改催收
    $scope.updatePressMoney = function(target){
        http.post(BTPATH.UPDATE_PRESS_MONEY_INFO,$scope.pressMoneyInfo).success(function(data){
            if(data&&(data.code === 200)){
                //刷新催收列表
                commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{
                    requestNo:$scope.info.requestNo
                },$scope,'pressMoneyList');
                //关闭面板
                $scope.closeRollModal("edit_collrecord_info_box");
                tipbar.infoTopTipbar('修改催收成功!',{});
            }else{
                tipbar.errorTopTipbar($(target),'修改催收失败,服务器返回:'+data.message,3000,9992);
            }
         });
    };


    //删除催收
    $scope.deletePressMoney = function(item){
        dialog.confirm('是否确认删除该条记录!',function(){
            http.post(BTPATH.DELETE_PRESS_MONEY_INFO,{id:item.id}).success(function(data){
                if(data&&(data.code === 200)){
                    //刷新催收列表
                    commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{
                        requestNo:$scope.info.requestNo},$scope,'pressMoneyList');
                    tipbar.infoTopTipbar('删除催收成功!',{});
                }
             });
        });
    };



    //---------------------------------协议查看相关 ------------------------------------
    
    //合同相关文件展示
    $scope.getStaticPage = function(){
      //获取iframe
      var $detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
      $.post(BTPATH.GET_STATIC_PAGE,{"appNo":$scope.AgreementDetail.appNo},function(data){
        if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
          //动态修改iframe中内容
          $detail_iframe.find("body").html(data.data);
        }else{
          //动态修改iframe中内容
          $detail_iframe.find("body").html("");
        }
      },'json');
    };


    //查看协议详情
    $scope.showAgreeInfo = function(data){
      $scope.AgreementDetail = $.extend({},data);
      //获取静态页面
      $scope.getStaticPage(); //通过appNo
      $scope.openRollModal("look_agree_info_box");
    };



    //---------------------------------- 豁免相关 -------------------------start


    //新增豁免
    $scope.addExemptInfo = function(target){
        $scope.exemptInfo.totalBalance = $scope.exemptInfo.managementBalance + $scope.exemptInfo.latefeeBalance +　
              $scope.exemptInfo.penaltyBalance+ $scope.exemptInfo.interestBalance + $scope.exemptInfo.principalBalance;
        http.post(BTPATH.ADD_EXEMPT_INFO,$scope.exemptInfo).success(function(data){
            if(data&&(data.code === 200)){
                var requestNo = $scope.info.requestNo;
                //刷新融资详情信息
                $scope.queryFinanceInfo(requestNo);
                //刷新豁免列表
                commonService.queryBaseInfoList(BTPATH.FIND_EXEMPT_LIST,{requestNo:requestNo},$scope,'exemptList');
                //关闭面板
                $scope.closeRollModal("add_intexem_info_box");
                tipbar.infoTopTipbar('新增豁免成功!',{});
            }else{
                tipbar.errorTopTipbar($(target),'新增豁免失败,服务器返回:'+data.message,3000,9992);
            }
         });
    };




    //---------------------------弹板操作-------------------------start
    


    //查看单个供应商融资申请详情
    $scope.showInfoDetail = function(data){
      $scope.queryFinanceInfo(data.requestNo).success(function(){
        //查询关联列表（订单|应收|汇票）
        $scope.querySelectList(data);
        //还款记录列表
        commonService.queryBaseInfoList(BTPATH.FIND_PAYMENT_RECORD_LIST,{requestNo:data.requestNo},$scope,'paymentRecordList');
        //豁免列表
        commonService.queryBaseInfoList(BTPATH.FIND_EXEMPT_LIST,{requestNo:data.requestNo},$scope,'exemptList');
        //催收列表
        commonService.queryBaseInfoList(BTPATH.FIND_PRESS_MONEY_LIST,{requestNo:data.requestNo},$scope,'pressMoneyList');
        //合同列表(协议列表)
        commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:data.requestNo,signType:''},$scope,'contractList');
      });
      $scope.openRollModal('fix_operator_info_box');
    };


    //还款
    $scope.openPaymentBox= function(){
      $scope.openRollModal('payment_info_box');
      //置空
      //还款方式
      $scope.paymentTypes =[];
      //还款人列表
      $scope.payCustList = [];
      //还款信息
      var nowDate = new Date().format("YYYY-MM-DD");
      $scope.paymentInfo = {
          payDate:nowDate,
          planPayDate:$scope.info.payPlan.planDate/*,
          totalBalance:$scope.info.payPlan.surplusTotalBalance*/
      };
      //置空已选发货通知单
      $scope.deliverys = '';
      //根据还款时间，查询还款方式
      $scope.calculatePayType(nowDate);
    };
    

    //生成催收企业列表( 融资企业 + 核心企业 )
    function generatePressCmp(){
      var custList = new ListMap();
      custList.set($scope.info.custNo,$scope.info.custName);
      //经销商融资 还款人只能是经销商,不能是核心企业
      if($scope.custTypeInfo.cust_type!=="agency"){
        custList.set($scope.info.coreCustNo,$scope.info.coreCustName);
      }
      $scope.pressCmpList = custList.toArray("value","name");
    }


    //新增催收 box
    $scope.addCollRecordBox = function(){
      generatePressCmp();
      //重置数据
      $scope.pressMoneyInfo = {
          requestNo:$scope.info.requestNo,
          custNo:$scope.pressCmpList[0] ? $scope.pressCmpList[0].value : ''
      };
      $scope.openRollModal('add_collrecord_info_box');
    };


    //编辑催收 box
    $scope.editCollRecordBox = function(data){
      generatePressCmp();
      $scope.pressMoneyInfo = data;
      $scope.openRollModal('edit_collrecord_info_box');
    };


    //新增豁免 box
    $scope.addExemptBox = function(){
      //置空
      $scope.exemptInfo = {
        requestNo:$scope.info.requestNo,
        factorNo:$scope.info.factorNo
      };
      $scope.openRollModal('add_intexem_info_box');
    };


    // 融资依赖详情查看 
    $scope.showfactorProofDetail = function(type,data){
        detailShow.getFinanceCredentialDetail($scope,type,data.id);
    };

    //---------------------------弹板操作-------------------------end






    //--------------------------------------------------------页面初始化------------------------------------

    $scope.initPage = function(){
      //获取保理公司机构列表
      commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList','factorListDic').success(function(){
        $scope.searchData.factorNo =  common.filterArrayFirst($scope.factorList);
          //根据保理公司查询核心企业列表
          commonService.queryBaseInfoList(BTPATH.QUERY_DIC_FACOTRCORERELATION,{factorNo:$scope.searchData.factorNo},$scope,'coreCustList').success(function(){
            // $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
          //根据核心企业查询融资企业列表
          commonService.queryBaseInfoList($scope.custTypeInfo.cust_list_path,{coreCustNo:$scope.searchData.coreCustNo},$scope,'custList').success(function(){
            // $scope.searchData.custNo = $scope.custList[0] ? $scope.custList[0].value : '' ;
            //获取融资状态
            commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'','FlowTypeDic',{
              name:'nodeCustomName',
              value:'sysNodeId'
            }).success(function(){
              $scope.queryList(true);
            });
          });
        });
      });
    };

    /*数据初始区域*/
    $scope.initPage();


  }]);


  //手动装载angular模块
  angular.bootstrap($('#container'),['mainApp']);
});
});
});
