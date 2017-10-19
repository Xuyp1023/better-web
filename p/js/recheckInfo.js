/*
开户模块
作者:bhg
*/
define(function(require, exports, module) {
    require.async(['p/js/common/dicTool', 'l/bootstrap/js/bootstrap.min', 'l/My97DatePicker/4.8/WdatePicker', 'l/jquery-plugins/jquery.cookie'], function() {
        require.async(['BTDictData'], function() {
            var validate = require("m/sea_modules/validate");
            var tipbar = require("m/sea_modules/tooltip");
            var common = require("p/js/common/common");
            var loading = require("m/sea_modules/loading");
            var uploader = require("p/js/common/upload");

            //模块数据声明和初始化(Model)
            window.currentData = {
                custInfo: {
                    certValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                    contCertValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                    lawCertValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                    identType:0,
                    // address: "广东深圳XXXXXX",
                    // bankAccount: "621700550321784",
                    // bankAddress: "广东深圳车公庙",
                    // bankName: "广东深圳车公庙分行泰然支行",
                    // c_apply_code: "7A6AH7SSA7",
                    // c_busy_code: "43234242123131233",
                    // identNo: "887878321-4",
                    // bankAcountName: "张三",
                    // c_tax_code: "A4546512324565321",
                    // c_type_1: false,
                    // c_type_2: true,
                    // c_type_4: true,
                    // checker: "李四",
                    // checkerCertValidDate: "2020-05-14",
                    // contEmail: "test@mail.com",
                    // contIdentNo: "425225197002058754",
                    // contIdentType1: true,
                    // contMobileNo: "18858562012",
                    // contName: "王五",
                    // contPhone: "13565244528",
                    // contFax:"0755-12345678",
                    // custName: "XXX有限公司",
                    // faxNo: "0755-12345678",
                    // checkerIdentType1:true,
                    // checkerIdentCode:"430135199007288547",
                    // lawIdentNo: "4302321313211332",
                    // lawIdentType1: true,
                    // lawName: "赵六",
                    // mobileNo: "17065872654",
                    // phone: "0755-35648597",
                    // zipCode: "518000",
                    fundList: []
                },
                accountInfo: [],
                fundCompInfoList: [],
                fundCompProList: [],
                flowInfoList : [],
                //交易单据详情
                tradeInfo : {},
                //审批详情
                recheckInfo :{}
            };

            //模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
            window.viewModel = {
                //属性绑定监控
                regInfoBind: ko.observable(currentData.custInfo),
                accountInfoBind: ko.observableArray(currentData.accountInfo),
                fundListBind: ko.observableArray(currentData.custInfo.fundList),
                fundCompInfoListBind: ko.observableArray(currentData.fundCompInfoList),
                fundCompProListBind: ko.observableArray(currentData.fundCompProList),
                uploadListBind : ko.observableArray(currentData.uploadList),
                tradeInfoBind : ko.observable(currentData.tradeInfo),
                flowInfoListBind : ko.observableArray(currentData.flowInfoList),
                recheckInfoBind : ko.observable(currentData.recheckInfo),

                //事件绑定
                //审核操作
                recheck : function(data,event){
                    var target = $(event.target||event.srcElement);
                    currentData.recheckInfo.status = $('#recheck_list_line input:checked').val();
                    $.post(common.getRootPath()+'/flow/flowAduit',currentData.recheckInfo,function(data){
                        if(data.code === 200){
                            tipbar.errorTopTipbar(target,'审核成功,即将跳转!');
                            $('#unrecheck_info_box input').attr('disabled',true);
                            setTimeout(function(){
                                history.back();
                            },1500);
                        }else{
                            tipbar.errorTopTipbar(target,'审核失败,原因:'+data.message);
                        }
                    },'json');
                },

                //格式化基金公司
                formaterComp : function(data){
                    return BTDict.SaleAgency.get(data);
                },
                //净值格式化
                parseNetValue : function(data){
                    if(data.netValue){
                        return common.formaterPoint4(data.netValue);
                    }else{
                        return '----';
                    }
                },
                //申请状态格式化
                parseStaus : function(data){
                    if(data.tradeStatus){
                        return BTDict.SaleBusinFlag.get(data.tradeStatus);
                    }else{
                        return '----';
                    }
                },
                //业务类型
                parseBusiFlag : function(data){
                    if(!data) return '----';
                    return BTDict.SaleBusinCode.get(data);
                },
                //交易账户格式化
                parseCustNo : function(data){
                    if(!data) return;
                    return BTDict.CustInfo.get(data)||'----';
                },
                //基金详情查询地址格式化
                formaterFundDetail : function(data){
                    return common.getRootPath()+'/p/pages/queryInfo/queryFund.html#'+data.fundCode;
                },
                //百分号格式化
                formaterPercent :function(data){
                    if(data+''==='0') return '----';
                    return data+'%';
                },
                //四位符格式化
                formaterPoint4 : function(data){
                    return Number(data).toFixed(4);
                },
                //日期格式化
                formaterDate : function(data){
                    if(!data||data === '') return '----';
                    data+='';
                    var newDate = '';
                    newDate+=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6));
                    return newDate;
                },
                //日期加时间格式件
                formaterDateTime : function(data){
                    if(!data||data === '') return '----';
                    data+='';
                    var newDate = '',
                    newTime = data.split(' ')[1];
                    newDate=(data.substr(0,4)+'-'+data.substr(4,2)+'-'+data.substr(6,2));
                    newTime=(newTime.substr(0,2)+':'+newTime.substr(2,2)+':'+newTime.substr(4));
                    return newDate+' '+newTime;
                },
                //风险等级格式化
                formaterRiskLvel : function(data){
                    return BTDict.SaleRiskLevel.get(data+'');
                },

                //审批状态格式化
                formaterFlowAuditStatus : function(data){
                    return BTDict.FlowAuditStatus.get(data+'');
                },

                //申购金额格式化
                formaterMoney : function(data){
                    if(!data) return;
                    return common.formaterThounthand(common.formaterPoint2(data));
                }
            };

            //定义私有属性以及方法
            var _personModule = {
                //各步骤前置处理方法
                //公用绑定函数
                //初始化地址、银行、证件类型等信息
                initInfo: function(targetElement, dicData, defaultElement, textName, valueName) {
                    var text = textName || 'text',
                        value = valueName || 'value',
                        dicArray = dicData.toArray(value, text),
                        defaultHtml = defaultElement || '';
                    targetElement.html('').append(defaultHtml);
                    for (var i = 0; i < dicArray.length; i++) {
                        var tempDic = dicArray[i];
                        targetElement.append('<option value="' + tempDic[value] + '">' + tempDic[text] + '</option>');
                    }
                },
                //初始化基金公司可选列表
                initFundCompList : function(){
                    var data = BTDict.SaleAgency.toArray('value', 'text');
                    if (currentData.accountInfo.length < 1) {
                        currentData.accountInfo = common.splitArray(data, 5);
                    }
                    viewModel.accountInfoBind(currentData.accountInfo);
                },
                //信息初始化
                initElseInfo : function(targetElement,dicData,defaultElement,textName,valueName){
                    var text = textName || 'name',
                    value =  valueName || 'value',
                    dicArray = dicData,
                    defaultHtml = defaultElement||''; 
                    targetElement.html('').append(defaultHtml);
                    for (var i = 0; i < dicArray.length; i++) {
                        var tempDic = dicArray[i];
                        targetElement.append('<option value="'+tempDic[value]+'">'+tempDic[text]+'</option>');
                    }
                },
                //刷新交易账户列表
                reFreshTradeAcoount : function(){
                    $.post(common.getRootPath()+'/SaleQuery/queryCustInfo',{},function(data){
                        var tempCustInfo = new ListMap();
                        for(var index in data.data){
                            var temp = data.data[index];
                            tempCustInfo.set(temp.value,temp.name);
                        }
                        BTDict.CustInfo = tempCustInfo;
                    },'json');
                },
                //获取到开户单据数据
                showOpenOrgInfo : function(params){
                    $.post(common.getRootPath() + '/SaleAccount/findCustTempData?rn='+Math.random(), params, function(data) {
                        if (data && data.code === 200) {
                            data.data = data.data.tmpData;
                            if (data.data && data.data.cityNo !== '' && data.data.cityNo) {
                                //截取城市代码
                                data.data.provinceNo = data.data.cityNo.substr(0, 2) + '0000';
                                //设置市级连调
                                _personModule.initInfo($('[mapping="city"]'), BTDict.Provinces.getItem(data.data.provinceNo).citys);
                            }
                            currentData.custInfo = $.extend(currentData.custInfo,data.data);
                            currentData.custInfo.fundList = currentData.custInfo.fundList.split(',');
                            viewModel.regInfoBind(currentData.custInfo);
                            viewModel.fundListBind(currentData.custInfo.fundList);
                        }
                    }, 'json');
                },
                //获取交易单据信息
                showTradeInfo : function(params){
                    $.post(common.getRootPath() + '/SaleQuery/queryTradeRequestByRequestNo?rn='+Math.random(), params, function(data) {
                        if (data && data.code === 200) {
                            data.data = data.data;
                            currentData.tradeInfo = $.extend({},data.data);
                            viewModel.tradeInfoBind(currentData.tradeInfo);
                        }
                    }, 'json');
                },
                //获取到单据的流程信息
                getFlowInfo : function(id){
                    $.post(common.getRootPath()+'/flow/selectFlowTaskExecutor',{id:id},function(data){
                        if(data&&data.code === 200){
                            currentData.flowInfoList = data.data;
                            viewModel.flowInfoListBind(currentData.flowInfoList);
                            common.resizeIframe();
                        }
                    },'json');
                },
                //获取服务器暂存信息
                getRecheckInfo: function() {
                    //获取到参数
                    var paramStr = location.href.split('param=')[1],
                    requestNo = paramStr.split(',')[0],
                    businFlag = paramStr.split(',')[1];
                    if(businFlag === '08'){
                        $('#pre_see').show();
                        $('#openRequestNo').html('单据号:'+requestNo);
                        _personModule.showOpenOrgInfo({requestNo:requestNo,businFlag:businFlag});
                    }else if(businFlag.indexOf('22')!== -1){
                        $('#tradeDetailBox').show();
                        $('#tradeRequestNo').html('单据号:'+requestNo);
                        _personModule.showTradeInfo({requestNo:requestNo});
                    }
                    //进行审核条件控制
                    var isRecheck = paramStr.split(',')[2]||null,
                    id = paramStr.split(',')[3]||null;
                    currentData.recheckInfo.id = id;
                    //刷新流程历史
                    if(isRecheck&&isRecheck === 'recheck'){
                        $('#recheck_info_box').show();
                    }else if(isRecheck&&isRecheck === 'unrecheck'){
                        $('#recheck_info_box').show().find('.center-buttons').hide();
                        $('#unrecheck_info_box').show();
                    }
                    if(isRecheck) _personModule.getFlowInfo(id);
                },
                //公用绑定函数
                checkNear: function(element, obj) {
                    if(!obj){
                        element[0].checked = !element[0].checked;
                        return;
                    }
                    var data_bind = element.attr('data-bind');
                    var valueBind = data_bind.split('hecked:')[1];
                    var keyBind = valueBind.split(',')[0];
                    var key = keyBind.split('.')[1];
                    if(element.is(':radio')){
                        element[0].checked = true;
                        obj[key] = element.val();
                        //进行操作员选择框联动
                        var eleName = element.attr('name');
                        if(eleName === 'businClass'||eleName === 'aduitType'){
                            _personModule.selectOperator();
                        }
                        return;
                    }
                    element[0].checked = !element[0].checked;
                    if (element[0].checked === true) {
                        currentData.flowData[key].push(element.val());
                    } else {
                        var ruleList = [];
                        for (var i = 0; i < currentData.flowData[key].length; i++) {
                            var temp = currentData.flowData[key][i];
                            if (temp !== element.val()) {
                                ruleList.push(temp);
                            }
                        }
                        currentData.flowData[key] = ruleList;
                    }
                }

            };

            ko.applyBindings(viewModel);
            /*公共事件绑定*/
            //绑定账号校验

            /*信息初始化*/
            $('[mapping="goback"]').click(function(){
                history.back();
            });

            $('#recheck_list_line input:radio:enabled')
                .prev('span').css('cursor', 'pointer').click(function() {
                    _personModule.checkNear($(this).next(), null);
             });

            //默认选择 通过
            $('#recheck_list_line input:radio').eq(0).prop('checked',true);

            /*初始化字典信息*/
            //设置各项字典信息初始化
            _personModule.initInfo($('[mapping="initBank"]'), BTDict.SaleBankCode);
            _personModule.initInfo($('[mapping="province"]'), BTDict.Provinces);
            _personModule.initInfo($('[mapping="city"]'), BTDict.Provinces.getItem($('[mapping="province"]').val()).citys);
            _personModule.initInfo($('[mapping="identity"]'), BTDict.PersonIdentType);
            //刷新基金公司可选列表
            _personModule.initFundCompList();
            $('[mapping="province"]').change(function() {
                var dicData = BTDict.Provinces.getItem($(this).val()).citys;
                _personModule.initInfo($('[mapping="city"]'), dicData);
            });
            _personModule.reFreshTradeAcoount();
            //获取暂存信息
            _personModule.getRecheckInfo();
            


        });
    });

});
