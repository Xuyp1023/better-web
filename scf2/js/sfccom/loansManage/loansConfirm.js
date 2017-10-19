/*
  放款确认 (保理公司)
  @author: herb
*/
define(function(require,exports,module){
	require.async(['dicTool','bootstrap',"datePicker"],function(){
	require.async(['BTDictData'],function(){
	var validate = require("validate");
    var tipbar = require("tooltip");
    var common = require("common");
    var loading = require("loading");
    var comdirect = require("direct");
    var comservice = require("service_s2");
    var dialog = require("dialog");
    var upload = require("upload");
    var comfilter = require("filter");
    var BTPATH = require("path_s2");
    var pages = require("pages");
    var date = require("date");
    require('modal');

	//定义模块
	var mainApp = angular.module('mainApp',['pagination','modal','date','upload']);
	
	//扩充公共指令库|过滤器|服务
	comdirect.direcPlus(mainApp);
	comfilter.filterPlus(mainApp);
  comservice.servPlus(mainApp);
	

	//控制器区域
	mainApp.controller('mainController',['$scope','http','commonService','detailShow',function($scope,http,commonService,detailShow){
		/*VM绑定区域*/
		//分页数据
		$scope.listPage = {
			pageNum: 1,
			pageSize: 10,
			pages: 1,
			total: 1
		};

    //授信方式
    $scope.creditModes = BTDict.CreditMode.toArray('value','name');
    //融资类型
    $scope.requestTypes = BTDict.RaiseCapitalType.toArray('value','name').slice(0,3);
    //期限单位
    $scope.periodUnits = BTDict.PeriodUnit.toArray('value','name');

    //融资状态列表  从后台接口查取
    $scope.requestStatus = [];


		//融资列表
		$scope.infoList = [];
    //融资详情
    $scope.financeInfo = {};
    //审贷详情（贷款方案）
    $scope.loanInfo = {};
    //是否存在黑名单
    $scope.blackExist = '';
    //审批信息
    $scope.auditInfo = {};
    
    /*关联信息*/
    $scope.orderList = [];//订单列表
    $scope.recieveList = [];//应收账款列表
    $scope.billList = [];//票据列表
    //重置数据
    function resetData(){
      //置空关联列表
      $scope.orderList = [];  
      $scope.recieveList = [];
      $scope.billList = []; 
    }

    //申请材料列表
    $scope.applyDocList = [];
    //合同（协议）列表
    $scope.contractList = [];

    //其他资料列表
    $scope.otherInfoList = [];
    //单个其他资料
    $scope.otherInfo = {};
    $scope.otherInfoAttach = [];


		//查询所需信息
		$scope.searchData = {
        requestNo:'',
        //申请时间
        GTErequestDate:new Date().getSubDate('MM',3).format('YYYY-MM-DD'),
        LTErequestDate:new Date().format('YYYY-MM-DD'),
        //申请类型
        requestType:'',
        lastStatus:3 //放款中
  	};


   /* 关联列表 配置 */
    var _linkedConfig = {
      1:{
        type:'order',
        list_name:'orderList'   //列表VM名称
      },
      2:{
        type:'bill',
        list_name:'billList'    //列表VM名称
      },
      3:{
        type:'recieve',
        list_name:'recieveList'     //列表VM名称
      },
      4:{ //供应商融资，也是查询订单列表
        type:'order',
        list_name:'orderList'   //列表VM名称
      }
    };
    // 关联类型（即融资申请类型）
    $scope.linkedType = '';


    //查询供应商融资申请
    $scope.searchList = function(){
      $scope.listPage.pageNum = 1;
      $scope.queryList(true);
    };


    //获取融资申请列表
    $scope.queryList = function(flag){
      //弹出弹幕加载状态
      $scope.listPage.flag = flag? 1 : 2;
      loading.addLoading($('#search_info table'),common.getRootPath());
      $.post(BTPATH.QUERY_FINANCE_LIST,$.extend({},$scope.searchData,$scope.listPage),function(data){
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



    //------------------------------------------- 其他资料相关 --------------------------------------------------

    //查询补充资料列表
    $scope.queryOtherInfoList = function(requestNo){
      if(!requestNo) return;
      http.post(BTPATH.QUERY_OTHER_FILE_LIST,{"requestNo":requestNo}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope.otherInfoList = common.cloneArrayDeep(data.data);
            });
          }  
      });
    };


    //补充其他资料
    $scope.addOtherFileInfo = function(){
      var fileId = ArrayPlus($scope.otherInfoAttach).extractChildArray('id',true),
        requestNo = $scope.financeInfo.requestNo;
      var param = $.extend({
        requestNo:requestNo,
        fileId :fileId
      },$scope.otherInfo);
      http.post(BTPATH.SAVE_OTHER_FILE_INFO,param).success(function(data){
          if(data && data.code === 200){
            tipbar.infoTopTipbar('补充资料成功!',{});
              //刷新其他资料列表
            $scope.queryOtherInfoList(requestNo);
            $scope.closeRollModal("add_other_file_box");
          }
      });
    };


    //删除其他资料
    $scope.deleteOtherFile = function(item){
      // dialog.confirm('确认删除附加资料?',function(){
        http.post(BTPATH.DELETE_OTHER_FILE_INFO,{"otherId":item.id}).success(function(data){
            if(data&& data.code === 200){
              //刷新其他资料列表
              $scope.queryOtherInfoList(item.requestNo);
            }   
        });
      // });  
    };



    //------------------------------------------- 融资相关查询 --------------------------------------------------

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


    //查询融资详情 传入申请单编号
    $scope.queryFinanceInfo = function(requestNo){
      var promise = http.post(BTPATH.QUERY_FINANCE_DETAIL,{"requestNo":requestNo}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope.financeInfo = data.data;
            });
          }   
      });
      return promise;
    };


    //查询审贷详情（贷款方案）
    $scope.queryLoanSchemeInfo = function(requestNo){
      var promise = http.post(BTPATH.FIND_LOAN_SCHEME_DETAIL,{"requestNo":requestNo}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                $scope.loanInfo = data.data;
                //当前审贷信息中没有相关数据，从融资申请中获取
                if(!$scope.loanInfo.creditMode){
                  $scope.loanInfo = $.extend({},$scope.loanInfo,{
                    "requestBalance":$scope.financeInfo.balance,
                    "period":$scope.financeInfo.period,
                    "periodUnit":$scope.financeInfo.periodUnit,
                    "creditMode":$scope.financeInfo.creditMode
                  });
                }
            });
          }   
      });
      return promise;
    };


    //检查黑名单是否存在
    $scope.checkBlacklist = function(){
      //参数 name:机构名称
      http.post(BTPATH.CHECK_BLACK_LIST,{"name":$scope.financeInfo.custName}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
                //1:存在  0：不存在
                $scope.blackExist = data.data ==="0" ? "不存在" : "存在";
            });
          }   
      });
    };



    

    //------------------------------------------- 放款相关方法 --------------------------------------------------

    //放款确认
    $scope.submitLoanEnsure = function(target){
      //设置校验项|校验
      validate.validate($('#approve_handle_loan'),validOption);
      var valid = validate.validate($('#approve_handle_loan'));
      if(!valid) return;

      http.post(BTPATH.FINANCE_LOAN_ENSURE,$.extend({requestNo:$scope.financeInfo.requestNo},$scope.auditInfo)).success(function(data){
          if(data&&(data.code === 200)){
            tipbar.infoTopTipbar('放款成功!',{});
            //刷新列表
            $scope.queryList(false);
            $scope.closeRollModal('loan_action_box');
          }else{
            tipbar.errorTopTipbar($(target),'放款失败,服务器返回:'+data.message,3000,9992);
          } 
      });
    };


    //放款确认前的操作
    $scope.loanEnsureBefore = function(){
      //默认 “放款金额” 为 审批金额,默认 “放款时间” 为当前时间
      var balance = $scope.financeInfo.approvedBalance,
        requestNo = $scope.financeInfo.requestNo,
        defaultDate = new Date().format('YYYY-MM-DD');
      $scope.auditInfo.loanBalance = balance;
      $scope.auditInfo.loanDate = defaultDate;
      //带出手续费
      $scope.calculatServiceFee(requestNo,balance);
      //带出到期日期
      $scope.calculatEndDate(requestNo,defaultDate).success(function(){
        //带出利息，其他费用
        $scope.calculatInsterest(requestNo,balance);
      });
      
      //监听 实际放款日期和金额
      $scope.$watch('auditInfo.loanBalance', function(newValue,oldValue){
        var requestNo = $scope.financeInfo.requestNo;
        if(newValue && newValue!==oldValue){
          $scope.calculatServiceFee(requestNo,newValue);
          $scope.calculatInsterest(requestNo,newValue);
        }
      });
      $scope.$watch('auditInfo.loanDate', function(newValue,oldValue){
        var requestNo = $scope.financeInfo.requestNo,
          balance = $scope.financeInfo.approvedBalance;
        if(newValue && newValue!==oldValue){
          $scope.calculatEndDate(requestNo,newValue).success(function(){
            //利息，其他费用变化
            // $scope.calculatInsterest(requestNo,balance);
          });
        }
      });
      //监听 到期日期
      $scope.$watch('auditInfo.endDate', function(newValue,oldValue){
        var requestNo = $scope.financeInfo.requestNo,
          balance = $scope.financeInfo.approvedBalance;
        if(newValue && newValue!==oldValue){
          //利息，其他费用变化
          $scope.calculatInsterest(requestNo,balance);
        }
      });
    };


    //计算结束日期
    $scope.calculatEndDate = function(requestNo,loanDate){
      var promise = http.post(BTPATH.CALCULATE_END_DATE,{requestNo:requestNo,loanDate:loanDate}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
              $scope.auditInfo.endDate = data.data.endDate;
            });
          }
      });
      return promise;
    };

    //计算手续费
    $scope.calculatServiceFee = function(requestNo,loanBalance){
      http.post(BTPATH.CALCULATE_SERVICE_FEE,{requestNo:requestNo,loanBalance:loanBalance}).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
              $scope.auditInfo.servicefeeBalance = data.data.servicefeeBalance;
            });
          }
      });
    };

    //计算利息和其他费用
    $scope.calculatInsterest = function(requestNo,loanBalance){
      var param = {
        requestNo:requestNo,
        loanBalance:loanBalance,
        loanDate:$scope.auditInfo.loanDate,
        endDate:$scope.auditInfo.endDate
      };
      http.post(BTPATH.CALCULATE_INSTEREST,param).success(function(data){
          if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
            $scope.$apply(function(){
              $scope.auditInfo.interestBalance = data.data.interestBalance;   //利息
              $scope.auditInfo.managementBalance = data.data.managementBalance; //其他费用
            });
          }
      });
    };





    //-----------------------------------  协议查看相关 --------------------------------------

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


    //合同相关文件展示（通过 请求编号和 协议类型 查找）
    $scope.getStaticPageByRequestNo = function(){
      var param={
        requestNo:$scope.financeInfo.requestNo,
        agreeType:2 //'2','三方协议'
      };
      $.post(BTPATH.FIND_AGREE_PAGE_BY_REQUESTNO,param,function(data){
        if(data && data.code === 200){
          //获取iframe
          $detail_iframe = $(document.getElementById("detail_iframe").contentWindow.document);
          //动态修改iframe中内容
          $detail_iframe.find("body").html(data.data);
        }
      },'json');
    };


    //查看协议详情
    $scope.showAgreeInfo = function(data){
      $scope.AgreementDetail = $.extend({},data);
      //获取静态页面
      if(data){
        $scope.getStaticPage(); //通过appNo
      }else{
        $scope.getStaticPageByRequestNo();//通过requestNo
      }
      $scope.openRollModal("look_agree_info_box");
    };





		/*------------------------------------ 弹板相关操作 -----------------------------------------*/

    // 融资依赖详情查看 
    $scope.showfactorProofDetail = function(type,data){
        detailShow.getFinanceCredentialDetail($scope,type,data.id);
    };


    //开启放款
    $scope.openLoanBox= function(data){
      var requestNo = data.requestNo;
      //查询融资详情
      $scope.queryFinanceInfo(requestNo).success(function(data){
        resetData();
        //查询黑名单是否存在
        $scope.checkBlacklist();
        //查询关联列表（订单|应收账款|票据）
        $scope.querySelectList(data.data);
        //查询其他资料列表
        commonService.queryBaseInfoList(BTPATH.QUERY_OTHER_FILE_LIST,{requestNo:requestNo},$scope,'otherInfoList');
        //申请材料列表
        commonService.queryBaseInfoList(BTPATH.QUERY_REQUEST_ATTACH_LIST,{requestNo:requestNo},$scope,'applyDocList');
        //合同列表(协议列表)
        commonService.queryBaseInfoList(BTPATH.FIND_ELEC_AGREE_BY_REQUESTNO,{requestNo:requestNo,signType:''},$scope,'contractList');
        //查询审贷方案详情
        $scope.queryLoanSchemeInfo(requestNo).success(function(){
          //审贷信息 默认值
          $scope.loanInfo.approvedPeriodUnit = $scope.loanInfo.approvedPeriodUnit||$scope.periodUnits[0].value;//审贷期限单位
          $scope.loanInfo.creditMode = $scope.loanInfo.creditMode||$scope.financeInfo.creditMode;   //授信类型
          //放款前数据处理
          $scope.loanEnsureBefore();
          $scope.openRollModal('loan_action_box');
          common.resizeIframeListener();
        });
      });
    };


    //打开补充资料 box
    $scope.addOtherFileBox = function(){
      //设置节点
      $scope.otherInfo ={
        node:$scope.financeInfo.tradeStatus
      };
      //置空附件
      $scope.otherInfoAttach = [];
      $scope.openRollModal("add_other_file_box");
    };


    //开启上传
    $scope.openUpload = function(event,type,typeName,list){
      $scope.uploadConf = {
        //上传触发元素
        event:event.target||event.srcElement,
        //上传附件类型
        type:type,
        //类型名称
        typeName:typeName,
        //存放上传文件
        uploadList:$scope[list]
      };
    };

    



    //--------------------------------------- 页面初始化 --------------------------------------

    //初始化页面
    commonService.initPage(function(){
      //获取融资状态列表  生成字典|FlowTypeDic
      commonService.queryBaseInfoList(BTPATH.QUERY_TRADESTATUS,'',$scope,'requestStatus','FlowTypeDic',{
        name:'nodeCustomName',
        value:'sysNodeId',
        isChange:true
      }).success(function(){
        // 查询融资列表        
        $scope.queryList(true);
      });
    });


    //校验配置(放款确认)
    var validOption = {
          elements: [{
              name: 'auditInfo.loanBalance',
              rules: [{name: 'required'},{name: 'money'}],
              events: ['blur']
          },{
              name: 'auditInfo.servicefeeBalance',
              rules: [{name: 'required'},{name: 'money'}],
              events: ['blur']
          },{
              name: 'auditInfo.interestBalance',
              rules: [{name: 'required'},{name: 'money'}],
              events: ['blur']
          },{
              name: 'auditInfo.managementBalance',
              rules: [{name: 'required'},{name: 'money'}],
              events: ['blur']
          }],
          errorPlacement: function(error, element) {
              var label = element.parents('td').prev().text().substr(0);
              tipbar.errorLeftTipbar(element,label+error,0,99999);
          }
    };




	}]);


	//手动装载angular模块
	angular.bootstrap($('#container'),['mainApp']);
});
});
});

