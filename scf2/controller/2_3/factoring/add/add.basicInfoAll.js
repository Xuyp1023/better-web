
define(function(require,exports,module){

	exports.installController = function(mainApp,common,validate,tipbar,loading,comdirect,dialog){

		mainApp.controller('add.basicInfoAll',['$scope','http','$rootScope','$route','cache','commonService','$location',function($scope,http,$rootScope,$route,cache,commonService,$location){
      /*  VM绑定区域  */
      $scope.factorTypeList = BTDict.FactorType.toArray('value','name');
      $scope.ActionModelList = BTDict.ActionModel.toArray('value','name');
      $scope.financeTypeList = BTDict.FinanceType.toArray('value','name');
      $scope.financeModelList = BTDict.FinanceModel.toArray('value','name');
      $scope.financerTypeList = BTDict.FinancerTypeList.toArray('value','name');
      // 新的5种融资模式      
      $scope.newModelList = BTDict.NewFinanceModel.toArray('value','name');
      $scope.tempObject=[];
      $scope.infoList = []; 
      $scope.assetDictList = []; 
      $scope.relationDictList = []; 
      
      $scope.info = {
            factorNo:'',           
            factorType:$scope.factorTypeList[0].value,
            actionModel:$scope.ActionModelList [0].value,            
            financeType:$scope.financeTypeList [0].value,
            financeModel:$scope.financeModelList [0].value,
            // receivableRequestType:$scope.newModelList [0].value,
            id:'',
            coreCredict1:"own",
            coreCredict:'1',
            isShow:0  
      };

      // 核心企业假数据
      $scope.coreList=[
        {"custName":"广东德豪润达电气股份有限公司"},
        {"custName":"广西建集团责任有限公司"}
      ]; 

      //解决ng-show和ng-if冲突添加的对象 
      $scope.tmpVo = {};        
			
      //分页数据
  		$scope.listPage = {
  			pageNum: 1,
  			pageSize: 10,
  			pages: 1,
  			total: 1
  		};
      $scope.step=$scope.step||1;       
      // 融资清单设置类型
      $scope.setSelectDisabled=function(){
        // console.log(2);
        var m=$scope.tempObject.join(",");        
        if(m.indexOf(1)!=-1){
          $scope.selected=true;
        }else{
          $scope.selected=false;
        }
      }
     
      // 单选
      $scope.selectOne=function(){
        var count=$("#td>input[type='checkbox']:checked").length;
        if(count==$scope.coreList.length){
          $scope.tmpVo.tmpCheckbox=true;
        }else{
          $scope.tmpVo.tmpCheckbox=false;
        }
      }

      //选择按钮，全选和去除全选
      $scope.toggleCheckbox = function(){
        angular.forEach($scope.coreList,function(row){          
          row.isSelected = $scope.tmpVo.tmpCheckbox;
        });
      };

      // 定制步骤
      $scope.next=function(target){
        var $target=$(target);
        //设置校验项 | 校验
        validate.validate($('#basic-info'),validOption1);
        var valid = validate.validate($('#basic-info'));
        if(!valid) return;
        
        //每次点击下一步时,将填写的信息保存
        if($scope.step==1){
            if($scope.info.id){
              // var tempInfo=cache.get('tempInfo');              
              http.post(BTPATH.SAVE_MODIFY_PRODUCT_CONFIG,$scope.info).success(function(data){
                if(common.isCurrentData(data)){
                  $scope.$apply(function(){
                    $scope.info = data.data;
                    // cache.put("tempInfo",data.data);
                    $scope.stepCache();  
                    });
                }else{
                  tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
                }
              });
            }else{
              // var tempInfo1=cache.get('tempInfo1');
              $scope.info.businStatus = 0;
              http.post(BTPATH.ADD_PRODUCT_CONFIG,$scope.info).success(function(data){
                  if((data!==undefined)&&(data.data!==undefined)&&(data.data!=='')&&(data.code === 200)){
                    $scope.$apply(function(){
                      $scope.stepCache(); 
                      $scope.info = data.data;
                      // 将信息缓存，以便返回这步，做信息查询条件用
                      // cache.put("tempInfo1",data.data); 
                    });
                  }else{
                    tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
                  }                 
               });
            }           
        } 

        // 在第二步时，将清单信息保存作为依据··· 
        if($scope.step==2){
            var $target=$(target);
            // 效验有无百分比
            validate.validate($('#fund_search_way'),validOption2);
            var valid = validate.validate($('#fund_search_way'));
            if(!valid) return;
            //保存基本信息 
            $scope.info.receivableRequestType = $scope.info.receivableRequestType || $scope.newModelList [0].value;
            http.post(BTPATH.SAVE_MODIFY_PRODUCT_CONFIG,$scope.info).success(function(data){
              if(common.isCurrentData(data)){
                //清单信息保存 
                $scope.clickStep2(target);  
              }else{
                tipbar.errorTopTipbar($target,'保存基本信息失败,服务器返回:'+data.message,3000,9992);
              }             
          });   
        }  

        // 点击下一步时，缓存信息
        // cache.put("info",$scope.info);       
      }

      // 点击下一步的步数缓存和界面高度调整
      $scope.stepCache=function(){
        $scope.step++;        
        cache.put("type",{"step":$scope.step});
          setTimeout(function(){
            common.resizeIframeListener();
          },1);
      }

      // 在点击下一步时(第2步)将清单信息保存的处理      
      $scope.clickStep2=function(target){
        var $target=$(target);
        var listId=[];
        var types=[];       
        angular.forEach($scope.assetDictList,function(row,index){
          if(row.checkOne){
            listId.push(row.id);
            types.push($scope.tempObject[index]);
          }              
        });

        // console.log(common.connectArray(types,listId));
        // 清单列表有无选择效验
        if (listId.length <= 0) {
            tipbar.errorTopTipbar($target,'请选择需要选择的清单列表！',3000,9992);
            return;
        }

        if(!ArrayPlus(types).isContain('1')){
            tipbar.errorTopTipbar($target,'请选择一个作为主体资产的清单列表！',3000,9992);
            return;  
        }

        var paramData = {
            "productCode":$scope.info.productCode,
            "listIdType":common.connectArray(types,listId).join(",")
        };
        // 保存清单信息
        http.post(BTPATH.ADD_PRODUCT_ASSETDICT_RELATION, paramData).success(function(data){
          if(common.isCurrentData(data)){
            $scope.$apply(function(){
              $scope.stepCache();  
            });
          }else{
            tipbar.errorTopTipbar($target,'保存清单信息失败,服务器返回:'+data.message,3000,9992);
          }
        });
      }

      //点击上一步执行的操作
      $scope.pre=function(){             
        if(cache.get("type")&&cache.get("type").step){
          $scope.step--;
          cache.remove("type");
          cache.put("type",{"step":$scope.step});
          setTimeout(function(){
            common.resizeIframeListener();
          },1);           
        }
      } 

      //返回按钮
      $scope.goBackMake=function(){
        window.location.href='?rn'+new Date().getTime()+'#/factoring/add.customization';
            setTimeout(function(){
            common.resizeIframeListener();
          },1);
      }

      // 完成定制按钮          
      $scope.addInfo = function(target){ 

        var $target = $(target);
        var custNo=[];
        angular.forEach($scope.coreList,function(row){
          if(row.isSelected){
            custNo.push(row.value);
          }
        });

        // 核心企业有无选择效验
        if (custNo.length <= 0) {
            tipbar.errorTopTipbar($target,'请选择需要选择的清单列表！',3000,9992);
            return;
        } 

        // 保存核心企业信息
        var paramData = {
            "productCode":$scope.info.productCode,
            "custNo":custNo.join(",")
        };



        //完整保存保理产品信息，并提示
        $scope.info.businStatus=0;
        http.post(BTPATH.SAVE_MODIFY_PRODUCT_CONFIG,$scope.info).success(function(data){
            if(data&&(data.code === 200)){
              http.post(BTPATH.ADD_PRODUCT_CORE_RELATION, paramData).success(function(data){
                if(common.isCurrentData(data)){
                    cache.remove("info");
                    tipbar.infoTopTipbar('定制编辑成功!',{});
                    $scope.queryList(true);
                    $location.path('/factoring/add.customization');
                    common.resizeIframeListener();
                }else{
                  tipbar.errorTopTipbar($target,'保存核心企业信息失败,服务器返回:'+data.message,3000,9992);
                }
              });              
            }else{
               tipbar.errorTopTipbar($target,'完整保存基本信息,服务器返回:'+data.message,3000,9992);
            }
        });
      };

      /*  业务处理绑定区域  */
      $scope.queryList = function(flag){    
        var $mainTable = $('#search_info .main-list');
        loading.addLoading($mainTable,common.getRootPath());
        $scope.listPage.flag = flag? 1 : 2;
        http.post(BTPATH.QUERY_AGREEMENT_STANDARD,$.extend({},$scope.listPage,$scope.searchData))
          .success(function(data){            
            loading.removeLoading($mainTable);
            if(common.isCurrentData(data)){
              $scope.$apply(function(){
                $scope.infoList = common.cloneArrayDeep(data.data);
                if(flag){
                  $scope.listPage = data.page;
                }
              });
            }
        });
      };

      //校验配置1
      var validOption1 = {
           elements: [/* {
                name: 'info.productCode',
                rules: [{name: 'required'}],
                events: ['blur']
            },*/{
                name: 'info.productName',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.ratio',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.minDays',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.maxDays',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.minFactorAmmount',
                rules: [{name: 'required'}],
                events: ['blur']
            },{
                name: 'info.maxFactorAmmount',
                rules: [{name: 'required'}],
                events: ['blur']
            }/*,{
                name: 'info.actionModel',
                rules: [{name: 'required'}],
                events: ['blur']
            }*/,{
                name: 'info.custName',
                rules: [{name: 'required'}],
                events: ['blur']
            }/*,{
                name: 'info.financeProportion',
                rules: [{name: 'required'}],
                events: ['blur']
            }*//*,{
                name: 'info.coreCredict',
                rules: [{name: 'required'}],
                events: ['blur']
            }*/],
            errorPlacement: function(error, element) {
                var label = element.parents('td').prev().text().substr(0);
                tipbar.errorLeftTipbar(element,label+error,0,99999);
            }
      };

            //校验配置2
      var validOption2 = {
           elements: [{
                name: 'info.financeProportion',
                rules: [{name: 'required'}],
                events: ['blur']
            }],
            errorPlacement: function(error, element) {
                var label = element.parents('td').prev().text().substr(0);
                tipbar.errorLeftAdjust(element,label+error,0,99999,'fund_search_way');
            }
      };

			/*!入口*/ /*控制器执行入口*/
			$scope.$on('$routeChangeSuccess',function(){
        commonService.queryBaseInfoList(BTPATH.QUERY_DIC_ADDACCCOUNTCOMLIST,{},$scope,'factorList').success(function(){
          $scope.info.factorNo = $scope.factorList.length>0?$scope.factorList[0].value:'';          
        });

        commonService.queryBaseInfoList(BTPATH.FIND_ALL_ASSETDICT,{productCode:$scope.info.productCode},$scope,'assetDictList');
       
        commonService.queryBaseInfoList(BTPATH.QUERY_FACTOR_CORELIST,{factorNo:$scope.info.factorNo},$scope,'coreList');

				$scope.queryList(true);
        // var info=cache.get("info");
        // if(info&&info.productCode){
        //   $scope.info=info;
        // }
				/*公共绑定*/
				$scope.$on('ngRepeatFinished',function(){
					common.resizeIframeListener();
				});   

			});
		}]);

	};

});
