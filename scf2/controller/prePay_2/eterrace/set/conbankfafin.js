
define(function (require, exports, module) {
    
      exports.installController = function (mainApp, common, validate, tipbar, loading, comdirect, dialog) {
    
        mainApp.controller('set.conbankfafintw', ['$scope', 'http', '$rootScope', '$route', 'cache', 'commonService', '$location', '$filter', function ($scope, http, $rootScope, $route, cache, commonService, $location, $filter) {
    
          // 供应商报价列表
          $scope.infoList = [];
           $scope.statusList = BTDict.ReceivbaleRequestModeFourStatus.toArray('value','name');
          var dddd = new Date();
          dddd.setDate(1);
    
           // 初始化查条件对象
           $scope.searchData = {
            GTEregDate:dddd.getSubDate('MM',0).format('YYYY-MM-DD'),
            LTEregDate:new Date().getSubDate('MM',-3).format('YYYY-MM-DD'),
            isCust:false
           }; 
           
           $scope.info = {};

            //分页数据
          $scope.listPage = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
          };
          //分页数据1
          $scope.listPage1 = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
          };
           //分页数据2
           $scope.listPage2 = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
          };
           //分页数据3
           $scope.listPage3 = {
            pageNum: 1,
            pageSize: 10,
            pages: 1,
            total: 1
          };

          $scope.allTotalbalance=0;
          $scope.infoSure = {};

           // 计算当前资产总额的方法
            $scope.countTotalBalance = function(){
              // var z=$scope.tempName;
              // console.log(z);
              // 解析主体资产的scope信息
              var zz = $scope.infoSure.asset.basedataMap.receivableList;
              if(zz){
                  $scope.allTotalbalance=0;
                for (var i =0; i<zz.length;i++) {
                  if(! isNaN(parseFloat(zz[i].balance))){
                    $scope.allTotalbalance +=Number(zz[i].balance);

                  }
                }
                //console.log($scope.info.totalBalance);
              }

            }     
    
          //打开确认
          $scope.mine = function(dataInfo){

            http.post(BTPATH.FIND_RECEIVABLE_REQUEST_FINDONEBYREQUESTFOUR,{requestNo:dataInfo.requestNo}).success(function(data){
                    $scope.$apply(function(){
                      $scope.infoSure=data.data;
                      $scope.countTotalBalance();
                      $scope.openRollModal('suer_box');

                    })
                    
                    
                }); 
            
          }
          //确认
            $scope.confirm=function(target,anRequestNo){          
                var $target=$(target);          
                http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVECONFIRMRECEIVABLEREQUESTFOUR/*2*/,{requestNo:anRequestNo})
                .success(function(data){   
                    if(common.isCurrentData(data)){
                        $scope.closeRollModal('suer_box');
                        tipbar.infoTopTipbar('确认成功!',{});
                        $scope.queryList(true);
                    }else{
                    tipbar.errorTopTipbar($target,'确认失败:'+data.message,3000,9993);
                    }
                });
            }

            //拒绝
             $scope.reject=function(target,anRequestNo){          
                var $target=$(target);          
                http.post(BTPATH.SAVE_RECEIVABLE_REQUEST_SAVEREJECTRECEIVABLEREQUESTFOUR/*2*/,{requestNo:anRequestNo})
                .success(function(data){   
                    if(common.isCurrentData(data)){
                        
                        tipbar.infoTopTipbar('拒绝成功!',{});
                        $scope.closeRollModal('suer_box');
                        $scope.queryList(true);
                    }else{
                    tipbar.errorTopTipbar($target,'拒绝失败:'+data.message,3000,9993);
                    }
                });
            }

            $scope.uploadList=[];

            $scope.donwfile = function (dataInfo){

                       http.post(BTPATH.FIND_CONTRACT_LEDGER_CUSTFILEITEMS,{contractId:dataInfo.batchNo}).success(function(data){
                          $scope.uploadList = data.data;
                          var addIds=[];
                            angular.forEach($scope.uploadList,function(row){            
                              
                                  addIds.push(row.fileId);
                             
                            }); 

                          $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=基础合同资料";
                          window.location.href=$scope.downListUrl;
                       });
            }
            $scope.donwtowfile = function (dataInfo){
              
              http.post(BTPATH.QUERY_ATTACHMENT_LIST,{batchNo:dataInfo.batchNo}).success(function(data){
                $scope.uploadList = data.data;
                var addIds=[];
                  angular.forEach($scope.uploadList,function(row){            
                    
                        addIds.push(row.fileId);
                   
                  }); 

                $scope.downListUrl=BTPATH.DOWNLOAD_MUTLTIPLE_FILE + "?fileIdList=" + addIds.join(',') + "&fileName=应付发票清单";
                window.location.href=$scope.downListUrl;
             });
            }
          //打开详情
          $scope.details = function(dataInfo){

              http.post(BTPATH.FIND_RECEIVABLE_REQUEST_FINDONEBYREQUESTFOUR,{requestNo:dataInfo.requestNo}).success(function(data){
                     $scope.$apply(function(){
                        
                       
                       $scope.infoSure=data.data;
                     $scope.countTotalBalance();
                       $scope.openRollModal('detail_box');
                     })
                    
                 }); 
           
          }
          //查询产品列表 
          $scope.searchList = function () {
            $scope.listPage.pageNum = 1;
            $scope.queryList(true);
          };
    
           /*查询初始化*/
           $scope.queryList = function(flag){
            //弹出弹幕加载状态
            var $mainTable = $('#search_info .main-list');
            // loading.addLoading($mainTable,common.getRootPath());
            $scope.listPage.flag = flag? 1 : 2;
            http.post(BTPATH.QUERY_RECEIVABLE_REQUEST_FOUR,$.extend({},$scope.listPage,$scope.searchData))
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
         
          /*!入口*/ /*控制器执行入口*/
          $scope.$on('$routeChangeSuccess', function () {
    
            commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'coreCustList','CoreCustListDic').success(function(){
              //$scope.searchData.custNo = $scope.custList.length>0?$scope.custList[0].value:'';
                $scope.searchData.coreCustNo = common.filterArrayFirst($scope.coreCustList);
                 $scope.queryList(true);
            
            });
    
            /*公共绑定*/
            $scope.$on('ngRepeatFinished', function () {
              common.resizeIframe();
            });
          });
        }]);
      };
    });
    
    