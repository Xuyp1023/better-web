/*
开户模块
作者:bhg
*/
define(function(require, exports, module) {
    require.async(['p/js/common/dicTool', 'l/bootstrap/js/bootstrap.min', 'l/My97DatePicker/4.8/WdatePicker', 'l/jquery-plugins/jquery.cookie'], function() {
        require.async(['BTDictData'], function() {
            var validate = require("m/sea_modules/validate");
            var tipbar = require("m/sea_modules/tooltip");
            var common =window.common = require("p/js/common/common");
            var loading = require("m/sea_modules/loading");
            var uploader = require("p/js/common/upload");

            //模块数据声明和初始化(Model)
            //上传框架标识
            window.uploadFlag = 0;
            window.uploadCallBack = {};
            window.currentData = {
                custInfo: {
                    certValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                    contCertValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                    lawCertValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                    identType:0,
                    fundList: '000'
                    // fundList: []
                },
                accountInfo: [],
                compListPage: {
                    pageNum: 1,
                    pageSize: 10,
                    pages: 1,
                    total: 1
                },
                compListAll: [],
                compList: [],
                bankList : [],
                fundCompInfoList: [],
                fundCompProList: [],
                //上传数据数组对象
                uploadList : [{
                	name:'企业有效营业执照(或民政部门注册登记证书)',
                	isUploaded : false,
                	id:'',
                	progress:'0%',
                	uploadId:'up_id1',
                	fileName:'暂未上传',
                	filePath:'',
                	type:'bizLicenseFile'
                },{
                	name:'企业组织机构代码证',
                	isUploaded : false,
                	id:'',
                	progress:'0%',
                	uploadId:'up_id2',
                	fileName:'暂未上传',
                	filePath:'',
                	type:'orgCodeFile'
                },{
                	name:'企业税务登记证',
                	isUploaded : false,
                	id:'',
                	progress:'0%',
                	uploadId:'up_id3',
                	fileName:'暂未上传',
                	filePath:'taxRegistFile',
                	type:'taxRegistFile'
                },{
                	name:'法定代表人身份证件',
                	isUploaded : false,
                	id:'',
                	progress:'0%',
                	uploadId:'up_id4',
                	fileName:'暂未上传',
                	filePath:'',
                	type:'representIdFile'
                },{
                	name:'银行开户确认文件',
                	isUploaded : false,
                	id:'',
                	progress:'0%',
                	uploadId:'up_id5',
                	fileName:'暂未上传',
                	filePath:'',
                	type:'bankAcctAckFile'
                },{
                	name:'经办人身份证件',
                	isUploaded : false,
                	id:'',
                	progress:'0%',
                	uploadId:'up_id6',
                	fileName:'暂未上传',
                	filePath:'',
                	type:'brokerIdFile'
                },{
                    name:'其他相关文件',
                    isUploaded : false,
                    id:'',
                    progress:'0%',
                    uploadId:'up_id7',
                    fileName:'暂未上传',
                    filePath:'',
                    type:'other'
                }]
            };

            //模块VM承载对象声明=>属性绑定、监控、event处理(ViewModel)
            window.viewModel = {
                //属性绑定监控
                regInfoBind: ko.observable(currentData.custInfo),
                accountInfoBind: ko.observableArray(currentData.accountInfo),
                // fundListBind: ko.observableArray(currentData.custInfo.fundList),
                compListPageBind: ko.observable(currentData.compListPage),
                compListBind: ko.observableArray(currentData.compList),
                bankListBind: ko.observableArray(currentData.bankList),
                fundCompInfoListBind: ko.observableArray(currentData.fundCompInfoList),
                fundCompProListBind: ko.observableArray(currentData.fundCompProList),
                uploadListBind : ko.observableArray(currentData.uploadList),

                //事件绑定
                nextStep: function(data, event) {
                    var target = $(event.srcElement ? event.srcElement : event.target),
                        tabIndex, tabRoute = $('#content .nav-tabs a');
                    tabIndex = Number(target.attr('target'));
                    var targetLink = tabRoute.eq(tabIndex);
                    var linkHref = targetLink.attr('href');
                    var tabContentFunc = (linkHref === undefined || linkHref === null) ? 'reg_company_info' : linkHref.split('#')[1];
                    var tabFunc = _personModule[tabContentFunc + '_func'];
                    tabFunc = (tabFunc === undefined || tabFunc === null) ? _personModule.finish_company_info_func : tabFunc;
                    var funcResult = tabFunc(target, targetLink);
                    if (funcResult) targetLink.tab('show');
                },
                setDateInfo: function(data, event) {
                    WdatePicker({
                        startDate: '%y-%M-%d',
                        dateFmt: 'yyyy-MM-dd',
                        readOnly: true
                    });
                },
                changeDateInfo: function(data, event) {
                    var targetElement = event.srcElement ? event.srcElement : event.target;
                    var dateName = $(targetElement).attr('dateName'),
                        dateData = $(targetElement).attr('dateData');
                    currentData[dateData][dateName] = targetElement.value;
                },
                checkNear: function(data, event) {
                    _personModule.checkNear($(event.srcElement ? event.srcElement : event.target).next(), data);
                },
                //暂存信息
                storgeInfo: function() {
                    try {
                        // var dataStr = common.serializeSingleObject(currentData.custInfo);
                        var custInfoStorge = $.extend(true,{},currentData.custInfo);
                        custInfoStorge.busyType = '01';
                        // custInfoStorge.fundList = custInfoStorge.fundList.toString();
                        custInfoStorge.fundList = '000';
                        //组装上传文件列表
                        // if(currentData.uploadList){
                        //     custInfoStorge.uploadList = common.formaterJsonUglify(currentData.uploadList);
                        // }
                        $.post(common.getRootPath() + '/SaleAccount/saveCustTempData?rn='+Math.random(), custInfoStorge, function(data) {
                            if (data.code === 200) {
                                //暂存成功处理
                                tipbar.infoTopTipbar('您的数据已成功暂存到服务器！', {});
                            } else {
                                tipbar.infoTopTipbar('数据暂存失败，错误信息:' + data.message + '请联系管理员！', {
                                    color: 'red'
                                });
                            }
                        }, 'json');
                    } catch (e) {
                        console.log(e);
                    }
                },
                toSelectComp: function() {
                    $('#comp_list_box').css('height', $(document.body).height()).slideDown(500);
                    tipbar.cleanPageTip();
                    currentData.compListPage.pageNum = 1;
                    _personModule.reFreshCorpInfoAll('', true);
                },
                showBankList:function() {
                    $('#bank_list_box').css('height', $(document.body).height()).slideDown(500);
                },
                //打开上传窗口
                openUploadBox: function(data,event){
                    var target = $(event.target||event.srcElement);
                    //关闭遮罩层
                    loading.removeLoading($('#upload_select_box'));
                    $('#upload_page').attr('src',common.getRootPath()+'/p/pages/upload/upload.html?rn='+Math.random());
                    uploadCallBack.uploadFunc = function(){
                        var uploadPage = $(window.frames.upload_page.document);
                        uploadPage.find('#file_name').html(data.name);
                        $('#upload_index').val(target.parents('tr').attr('index'));
                        // uploadPage.find('#fileTypeName').val(data.type);
                        //设置上传地址
                        uploadPage.find('#upload_form').attr('action',common.getRootPath()+'/SaleAccount/fileUpload?fileTypeName='+
                            data.type);
                        //释放确认上传按钮
                        $('#submit_upload_btn').fadeIn();
                    };
                    $('#upload_select_box').height($('#file_upload_box').height()).slideDown();
                },
                //确定上传
                confirmUpload : function(data,event){
                    var $target = $(event.target||event.srcElement);
                    var uploadPage = $(window.frames.upload_page.document),
                    fileData = uploadPage.find('[name="Filedata"]').val();
                    //校验是否选择文件
                    if(fileData===''){
                        tipbar.errorTopTipbar($target,'还未选取需要上传的文件，请检查!',3000,9999999);
                        return;
                    }
                    uploadPage.find('#upload_form').submit();
                    //隐藏上传按钮
                    $('#submit_upload_btn').fadeOut();
                    //生成上传状态
                    loading.addLoading($('#upload_select_box'),common.getRootPath());
                    uploadCallBack.uploadConfirmFunc = function(){
                        $('#upload_select_box').slideUp();
                        var info = {index:Number($('#upload_index').val()),target:$('#upload_table tr').eq(Number($('#upload_index').val()))};
                        var uploadOpenBtn = info.target.find('[mapping="upload_open_btn"]');
                        var uploadPage = $(window.frames.upload_page.document);
                        var resultStr = uploadPage.find('body').html();
                        //文件数据量过大(超过10M)，被nigix拦截返回信息
                        if(resultStr.indexOf('nginx')!==-1){
                            tipbar.errorLeftTipbar(uploadOpenBtn,'上传失败，服务端返回信息:文件大小过大(不能超过10MB)');
                            return;
                        }
                        var response = JSON.parse(resultStr);
                        //后端返回错误处理
                        if(response.code !== 200){
                            tipbar.errorLeftTipbar(uploadOpenBtn,'上传失败，服务端返回信息:'+response.message);
                            if(console) console.log(response);
                            // tipbar.infoTopTipbar('上传失败，服务端返回信息:'+response.message,{
                            //     msg_box_cls : 'alert alert-warning alert-block',
                            //     during:2000
                            // });
                            return;
                        }
                        currentData.uploadList[Number(info.index)].isUploaded = true;
                        currentData.uploadList[Number(info.index)].id = response.data.id;
                        currentData.uploadList[Number(info.index)].fileName = response.data.fileName;
                        currentData.uploadList[Number(info.index)].filePath = common.getRootPath()+'/SaleAccount/fileDownload?id='+response.data.id;
                        info.target.find('.pro-td>*,.modi-td>*').filter('object').css('display','none');
                        info.target.find('.pro-td>*,.modi-td>*').filter(':not(object)')
                        .toggle()
                        .filter('.pro-td a')
                        .attr('href',common.getRootPath()+'/SaleAccount/fileDownload?id='+response.data.id)
                        .html(response.data.fileName);
                        //上传成功后打印日志
                        if(console){
                        console.log(response);
                        }
                    };
                },
                //关闭上传窗口
                cancelUpload : function(){
                    $('#upload_select_box').slideUp();
                    common.cleanPageTip();
                },
                //删除上传
                removeUpload : function(data,event){
                    var target = $(event.srcElement||event.target).parents('tr'),
                    info = {
                        target:target,
                        index:target.attr('index')
                    };
                    currentData.uploadList[Number(info.index)].isUploaded = false;
                    currentData.uploadList[Number(info.index)].id = '';
                    currentData.uploadList[Number(info.index)].progress = '0%';
                    currentData.uploadList[Number(info.index)].fileName = '暂未上传';
                    currentData.uploadList[Number(info.index)].filePath = '#';
                    info.target.find('.pro-td>*,.modi-td>*').filter(':not(object)').toggle();
                    // info.target.find('.progress .bar').css('width','0%').next('span').html('0%');
                    //重新装载上传按钮
                    // var objectEle = target.find('.modi-td a').prev()[0];
                    // objectEle.parentNode.removeChild(objectEle);
                    // target.find('.modi-td a').before('<input type="hidden" id="'+data.uploadId+'" />');
                    // currentData.uploadParams.button_placeholder_id = data.uploadId;
                    // uploader.createUpload(currentData.uploadParams);
                },
                //上传Iframe加载监听
                uploadIframeLoad : function(){
                    var flag = $(window.frames.upload_page.document).find('#upload_flag').val();
                    if(flag==='upload'){
                        uploadCallBack.uploadFunc();
                    }else{
                        uploadCallBack.uploadConfirmFunc();
                    }
                },
                //查询机构
                searchComp: function() {
                    currentData.compListPage.pageNum = 1;
                    _personModule.reFreshCorpInfoAll($('#fast_cust_name').val(), true);
                },
                //选择机构
                selectComp: function(data,event) {
                    var corpId = data.id;
                    $.post(common.getBFSRootPath() + '/fund/corp.do?method=getCorpInfo', {
                        corpId: corpId
                    }, function(data) {
                        if (data.code === 200) {
                            currentData.custInfo = $.extend({
                                certValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                                contCertValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                                lawCertValidDate: new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'),
                                identType:0,
                                fundList:[]
                            }, data.data);
                            if (data.data&&data.data.cityNo&&data.data.cityNo !== '' && data.data.cityNo) {
                                //截取城市代码
                                data.data.provinceNo = data.data.cityNo.substr(0, 2) + '0000';
                                //设置市级连调
                                _personModule.initInfo($('[mapping="city"]'), BTDict.Provinces.getItem(data.data.provinceNo).citys);
                            }
                            viewModel.regInfoBind(currentData.custInfo);
                            viewModel.closeBox();
                        }
                    }, 'json');
                },
                //选择银行信息
                selectBank: function(data,event) {
                    currentData.custInfo.bankAccount = data.bankAccount;
                    currentData.custInfo.bankAcountName = data.bankAccountName;
                    viewModel.regInfoBind(currentData.custInfo);
                    viewModel.closeBankBox();
                },
                //关闭窗帘效果
                closeBox: function() {
                    $('#comp_list_box').slideUp(500);
                    validate.validate($('#finish_company_form'));
                },
                //关闭银行窗帘
                closeBankBox: function() {
                    $('#bank_list_box').slideUp(500);
                },
                //格式化基金公司
                formaterComp : function(data){
                    return BTDict.SaleAgency.get(data);
                },
                //分页事件
                firstPage: function() {
                    currentData.compListPage.pageNum = 1;
                    _personModule.reFreshCorpInfoAll($('#fast_cust_name').val(), false);
                },
                endPage: function() {
                    currentData.compListPage.pageNum = currentData.compListPage.pages;
                    _personModule.reFreshCorpInfoAll($('#fast_cust_name').val(), false);
                },
                prevPage: function() {
                    currentData.compListPage.pageNum--;
                    _personModule.reFreshCorpInfoAll($('#fast_cust_name').val(), false);
                },
                nextPage: function() {
                    currentData.compListPage.pageNum++;
                    _personModule.reFreshCorpInfoAll($('#fast_cust_name').val(), false);
                },
                skipPage: function(data, event) {
                    var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
                    if (isNaN(pageNum) || pageNum.split('.').length > 1 || Number(pageNum) < 1 || Number(pageNum) > currentData.compListPage.pages) {
                        $('#fund_list_page [name="skipToPageNum"]').val('');
                        tipbar.errorTopTipbar($(event.target), '请填写正确的页数!', 1000, 99999);
                        return;
                    }
                    currentData.compListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
                    $('#fund_list_page [name="skipToPageNum"]').val('');
                    _personModule.reFreshCorpInfoAll($('#fast_cust_name').val(), false);
                }
            };
            viewModel.refreshCookie = ko.computed({
                read: function() {

                },
                owner: viewModel
            });

            //定义私有属性以及方法
            var _personModule = {
                //各步骤前置处理方法
                finish_company_info_func: function(clickedButton) {
                    // viewModel.regInfoBind(currentData.custInfo);
                    // var validResult = validate.validate($('#reg_company_form'));
                    // if(!validResult){
                    // 	tipbar.errorTipbar(clickedButton,'有数据填写错误，请先进行检查！');
                    // 	return false;
                    // }
                    return true;
                },
                sign_agreement_func: function(target, targetLink) {
                    //刷新上传组件,重新组装还未上传的项的上传组件
                    // for(var i = 0; i < currentData.uploadList.length; i++) {
                    //     var tempUpload = currentData.uploadList[i];
                    //     currentData.uploadParams.button_placeholder_id = tempUpload.uploadId;
                    //     if(!tempUpload.isUploaded){
                    //         uploader.createUpload(currentData.uploadParams);
                    //     }
                    // }
                    //表单校验
                    var resultFormValid = validate.validate($('#finish_company_form'));
                    if (!resultFormValid) {
                        tipbar.errorTipbar(target, '有待填项还未正确填写,请检查!');
                        return false;
                    }
                    viewModel.regInfoBind(currentData.custInfo);
                    // viewModel.fundListBind(currentData.custInfo.fundList);
                    //进行用户以及银行账号合法判断
                    common.cleanPageTip();
                    _personModule.checkAccount($('[mapping="identNo"]').val(), function(data) {
                        if (data.code === 200) {
                            _personModule.checkBankAccount($('[mapping="bankAccount"]').val(), function(data) {
                                if (data.code === 200) {
                                    targetLink.tab('show');
                                } else {
                                    tipbar.errorTipbar(target, '用户银行账号无效,请检查');
                                    tipbar.errorTipbar($('[mapping="bankAccount"]'), '用户银行账号无效,请检查');
                                }
                            });
                        } else {
                            tipbar.errorTipbar(target, '用户营业执照号无效,请检查');
                            tipbar.errorTipbar($('[mapping="identNo"]'), '用户营业执照号无效,请检查');
                            _personModule.checkBankAccount($('[mapping="bankAccount"]').val(), function(data) {
                                if (data.code !== 200) {
                                    tipbar.errorTipbar($('[mapping="bankAccount"]'), '用户银行账号无效,请检查');
                                }
                            });
                        }
                    }, 'json');
                    return false;
                },
                pre_see_func: function(target, targetLink) {
                    //验证已选机构和协议信息
                    /*var AccountListLength = $('#sign_agreement .account-list input:checked').length;
                    if (AccountListLength < 1) {
                        tipbar.errorTopTipbar(target, '还未选择任何需开户的机构,请检查!');
                        return false;
                    }*/
                    if (!$('[mapping="isCheckPro"]').is(':checked')) {
                        tipbar.errorTopTipbar(target, '还未选择同意协议，无法进行预览!');
                        return false;
                    }
                    //上传的文件验证
                    /*for (var i = 0; i < currentData.uploadList.length-1; i++) {
                        var tempFile = currentData.uploadList[i];
                        if(!tempFile.isUploaded){
                           tipbar.errorTopTipbar(target, '还有开户所需资料文件'+tempFile.name+'未上传!');
                           return false; 
                        }
                    }*/
                    viewModel.regInfoBind(currentData.custInfo);
                    // viewModel.fundListBind(currentData.custInfo.fundList);
                    viewModel.uploadListBind(common.cloneArrayDeep(currentData.uploadList));
                    //设置未选中checkbox样式
                    common.setUncheckCss($('#pre_see input:checkbox'));
                    return true;
                },
                set_password_func: function() {
                    return true;
                },
                finish_crt_func: function(obj, link) {
                    //组装文件列表
                    // var fileList = '';
                    /*for (var i = 0; i < currentData.uploadList.length; i++) {
                        var tempFile = currentData.uploadList[i];
                        if(tempFile.isUploaded){
                            fileList+='&fileList='+tempFile.type+','+tempFile.id;
                        }
                    }*/
                    $.post(common.getRootPath() + '/SaleAccount/openOrg?rn=' + Math.random(), common.serializeSingleObject(currentData.custInfo)/*+fileList*/, function(data) {
                        if (data.code == 200) {
                            //组装基金公司code以及名称列表
                            var targetFundList = [];
                            for (var k = 0; k < currentData.custInfo.fundList.length; k++){
                                var tempFundList = currentData.custInfo.fundList[k];
                                targetFundList.push(tempFundList+';'+viewModel.formaterComp(tempFundList));
                            }
                            //组装返回数据
                            var tmpData = $.extend(true,{},data.data.tmpData);
                            delete data.data.tmpData;
                            $.extend(data.data,tmpData);
                            // data.data.fundList = targetFundList.join(',');
                            data.data.fundList = '000';
                            if(common.isBFS()){
                                $.post(common.getBFSRootPath()+'/fund/fundApp.do?method=mechOpenAcco',data.data,function(resultData){
                                    /*if(resultData&&resultData.code===200){
                                    }else{
                                       // tipbar.errorTipbar(obj, data.message||'未知错误!');
                                    }*/
                                });
                            }
                            link.tab('show');
                        } else {
                            tipbar.errorTipbar(obj, data.message);
                        }
                    }, 'json');
                },
                //公用绑定函数
                checkNear: function(element, obj) {
                    var data_bind = element.attr('data-bind');
                    var valueBind = data_bind.split('hecked:')[1];
                    var keyBind = valueBind.split(',')[0];
                    var key = keyBind.split('.')[1];
                    element[0].checked = !element[0].checked;
                    if (element.attr('index') !== undefined && element.attr('index') !== null && element.attr('index') !== '') {
                        if (element[0].checked === true) {
                            currentData.custInfo.fundList.push(element.val());
                        } else {
                            var fundList = [];
                            for (var i = 0; i < currentData.custInfo.fundList.length; i++) {
                                var temp = currentData.custInfo.fundList[i];
                                if (temp !== element.val()) {
                                    fundList.push(temp);
                                }
                            }
                            currentData.custInfo.fundList = fundList;
                        }
                    } else {
                        obj[key] = element[0].checked;
                    }
                },
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
                //验证用户是否有效
                checkAccount: function(identNo, callback) {
                    $.post(common.getRootPath() + '/SaleQuery/checkAccountExists?rn='+Math.random(), {
                        custType: '0',
                        identType: '0',
                        identNo: identNo
                    }, function(data) {
                        callback(data);
                    }, 'json');
                },
                //验证银行账号是否有效
                checkBankAccount: function(bankAccount, callback) {
                    $.post(common.getRootPath() + '/SaleQuery/checkAcooBankExists?rn='+Math.random(), {
                        netNo: '0101',
                        bankAccount: bankAccount
                    }, function(data) {
                        callback(data);
                    }, 'json');
                },
                //获取服务器暂存信息
                getServStorge: function() {
                    $.post(common.getRootPath() + '/SaleAccount/findCustTempData?rn='+Math.random(), {}, function(data) {
                        if (data.data&&data.data.tmpData&&data.code === 200) {
                            data.data = data.data.tmpData;
                            if (data.data && data.data.cityNo !== '' && data.data.cityNo) {
                                //截取城市代码
                                data.data.provinceNo = data.data.cityNo.substr(0, 2) + '0000';
                                //设置市级连调
                                _personModule.initInfo($('[mapping="city"]'), BTDict.Provinces.getItem(data.data.provinceNo).citys);
                            }
                            //设置基金公司联调
                            /*if(data.data&&data.data.fundList!==undefined&&data.data.fundList.length>1){
                                data.data.fundList = data.data.fundList.split(',');
                            }else if(data.data&&data.data.fundList!==undefined){
                                data.data.fundList = [];
                            }*/
                            //组装文件上传列表
                            // if(data.data&& data.data.uploadList){
                            //     data.data.uploadList = common.packageJsonFromUglify(data.data.uploadList);
                            //     currentData.uploadList = data.data.uploadList;
                            //     viewModel.uploadListBind(data.data.uploadList);
                            // }
                            //刷新银行信息
                            _personModule.reFreshBankInfoAll(function(){
                                if((!currentData.bankAccount)&&(currentData.bankAccount==='')&&(currentData.bankList.length>0)){
                                    data.data.bankAccount = currentData.bankList[0].bankAccount;
                                    data.data.custInfo.bankAcountName = currentData.bankList[0].bankAccountName;
                                }
                                currentData.custInfo = $.extend(currentData.custInfo,data.data);
                                viewModel.regInfoBind(currentData.custInfo);
                                // viewModel.fundListBind(currentData.custInfo.fundList);
                                tipbar.infoTopTipbar('发现服务器暂存信息，已载入！', {
                                    inIframe: true
                                });
                            });
                        
                            
                        }
                        /*else{
                        								//如果没有服务器暂存，则启用本地暂存
                        								var custInfo = JSON.parse($.cookie('custInfo'));
                        								if(custInfo&&!common.isEmptyObject(custInfo)){
                        									currentData.custInfo = custInfo;
                        									viewModel.regInfoBind(custInfo);
                        								}
                        								tipbar.infoTopTipbar('未发现服务器暂存信息，使用本地缓存的用户填写信息！',{inIframe:true});
                        							}*/

                    }, 'json');
                },
                //刷新可选机构信息
                reFreshCorpInfoAll: function(corpCode, flag) {
                    //弹出弹幕加载状态
                    loading.addLoading($('.corp-info-list'), common.getRootPath());
                    $.post(common.getBFSRootPath() + '/fund/corp.do?method=queryCorpList',
                        $.extend(currentData.compListPage, {
                            corpCode: '',
                            corpName:corpCode
                        }),
                        function(data) {
                            //关闭加载状态弹幕
                            loading.removeLoading($('.corp-info-list'));
                            viewModel.compListBind(common.cloneArrayDeep(data.data));
                            if (flag) {
                                currentData.compListPage = data.page;
                                viewModel.compListPageBind(data.page);
                            } else {
                                viewModel.compListPageBind(currentData.compListPage);
                            }
                            // common.resizeIframe();
                        }, 'json');
                },
                //刷新可选银行账户信息
                reFreshBankInfoAll: function(callback) {
                    //弹出弹幕加载状态
                    loading.addLoading($('.corp-info-list'), common.getRootPath());
                    $.post(common.getRootPath() + '/CustTemp/queryBank',{},
                        function(data) {
                            //关闭加载状态弹幕
                            loading.removeLoading($('.corp-info-list'));
                            currentData.bankList = common.cloneArrayDeep(data.data);
                            viewModel.bankListBind(currentData.bankList);
                            if(callback) callback();
                            // common.resizeIframe();
                        }, 'json');
                },
                //刷新基金机构列表
                reFreshFundCompany: function() {
                    var fundCompListInfo = BTDict.SaleAgency.toArray('value', 'text'),
                        fundCompList = $('#fund_comp_list');
                    fundCompList.html('');
                    for (var index in fundCompListInfo) {
                        var temp = fundCompListInfo[index];
                        fundCompList.append('<li objValue="' + temp.value + '"><a href="#">' + temp.text + '</a></li>');
                    }
                    fundCompList.find('li').click(function() {
                        $('#fund_comp_name').html($(this).text());
                        var agencyNo = $(this).attr('objValue');
                        $.post(common.getRootPath() + '/SaleQuery/querySaleAgencyInfoWithFile', {
                            agencyNo: agencyNo
                        }, function(data) {
                            if (data.code === 200) {
                                var compInfoList = data.data.files;
                                if (compInfoList) {
                                    currentData.fundCompInfoList = ArrayPlus(compInfoList).objectChildFilter('paperType', '0');
                                    currentData.fundCompProList = ArrayPlus(compInfoList).objectChildFilter('paperType', '1');
                                } else {
                                    currentData.fundCompInfoList = [];
                                    currentData.fundCompProList = [];
                                }
                                viewModel.fundCompInfoListBind(common.cloneArrayDeep(currentData.fundCompInfoList));
                                viewModel.fundCompProListBind(common.cloneArrayDeep(currentData.fundCompProList));
                                $('#comp_info_box').css('height', $('#content').height()).slideDown(500);
                                tipbar.cleanPageTip();
                            }
                        }, 'json');
                    });

                },
                //装载上传设置以及按钮
                installUpload : function(){
                	var params = currentData.uploadParams = {
                		//进度条控制
                		upload_progress_handler : function(file,up,total){
                			var info = uploader.tools.getUploadInfo(file);
                			if(!info) return;
                			var formatPer = Number(up/total).toFixed(2)*100+'%';
                			currentData.uploadList[Number(info.index)].progress = formatPer;
                			info.target.find('.progress .bar')
                			.css('width',formatPer)
                			.next('span').html(formatPer);
                		},
                		//上传成功
                		upload_success_handler : function(file,response){
                            response = JSON.parse(response);
                			if(response.code !== 200){
                				tipbar.infoTopTipbar('上传失败，服务端返回信息:'+response.message,{
                					msg_box_cls : 'alert alert-warning alert-block',
                					during:2000
                				});
                				return;
                			}
                			var info = uploader.tools.getUploadInfo(file);
                			currentData.uploadList[Number(info.index)].isUploaded = true;
                			currentData.uploadList[Number(info.index)].id = response.data.id;
                            currentData.uploadList[Number(info.index)].fileName = response.data.fileName;
                            currentData.uploadList[Number(info.index)].filePath = common.getRootPath()+'/SaleAccount/fileDownload?id='+response.data.id;
                            info.target.find('.pro-td>*,.modi-td>*').filter('object').css('display','none');
                			info.target.find('.pro-td>*,.modi-td>*').filter(':not(object)')
                			.toggle()
                			.filter('.pro-td a')
                			.attr('href',common.getRootPath()+'/SaleAccount/fileDownload?id='+response.data.id)
                			.html(file.name);
                			//上传成功后刷新队列
                			if(console){
                			console.log(response);
                			}
                		}
                	};
                	//装载上传按钮
                	for (var i = 0; i < currentData.uploadList.length; i++) {
                		var tempUpload = currentData.uploadList[i];
                        params.button_placeholder_id = tempUpload.uploadId;
                		uploader.createUpload(params);
                	}
                }

            };

            /*表单验证*/
            validate.validate($('#reg_company_form'), {
                elements: [{
                    name: 'c_apply_code',
                    rules: [{
                        name: 'required',
                        message: ''
                    }],
                    events: ['blur']
                }, {
                    name: 'mobileNo',
                    rules: [{
                        name: 'required',
                        message: ''
                    }],
                    events: ['blur']
                }],
                errorPlacement: function(error, element) {
                    tipbar.errorTipbar(element, error);
                }
            });

            validate.validate($('#finish_company_form'), {
                elements: [{
                    name: 'phone',
                    rules: [{
                        name: 'phone'
                    }],
                    events: ['blur']
                }, {
                    name: 'contFax',
                    rules: [{
                        name: 'fax'
                    }],
                    events: ['blur']
                }, {
                    name: 'contEmail',
                    rules: [{
                        name: 'email'
                    }],
                    events: ['blur']
                }, {
                    name: 'contMobileNo',
                    rules: [{
                        name: 'mobile'
                    }],
                    events: ['blur']
                }, {
                    name: 'faxNo',
                    rules: [{
                        name: 'fax'
                    }],
                    events: ['blur']
                }, {
                    name: 'contPhone',
                    rules: [{
                        name: 'phone'
                    }],
                    events: ['blur']
                }],
                errorPlacement: function(error, element) {
                    var label = element.parents('td').prev().text().substr(1);
                    tipbar.errorLeftTipbar(element, label + error);
                }
            });


            ko.applyBindings(viewModel);
            /*公共事件绑定*/
            $('#finish_company_form,#sign_agreement_table').find('.double-check-sp').click(function(event) {
                var dateName = $(this).parent().find('input').attr('dateName'),
                    dateData = $(this).parent().find('input').attr('dateData');
                var that = $(this);
                if (that.is('.active')) {
                    that.removeClass('active');
                    that.parent().find('input').val(new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD'));
                    currentData[dateData][dateName] = new Date().getSubDate('YYYY', -5).format('YYYY-MM-DD');
                } else {
                    that.addClass('active');
                    that.parent().find('input').val('2099-12-31');
                    currentData[dateData][dateName] = '2099-12-31';
                }
            });
            $('#finish_company_info input:checkbox:enabled,#sign_agreement .company-info input:checkbox:enabled')
                .prev('span').css('cursor', 'pointer').click(function() {
                    _personModule.checkNear($(this).next(), currentData.custInfo);
                });
            $('#sign_agreement .checkPro input:checkbox:enabled').next('span').css('cursor', 'pointer').click(function() {
                _personModule.checkNear($(this).prev(), currentData.custInfo);
            });

            $('#reg_company_info,#finish_company_info,#sign_agreement').find(':input')
                .live('blur', function() {
                    var custInfoStr = JSON.stringify(currentData.custInfo);
                    $.cookie('custInfo', custInfoStr, {
                        expires: 7
                    });
                });
            //绑定账号校验
            $('[mapping="identNo"]').blur(function() {
                var _that = $(this);
                _personModule.checkAccount($(this).val(), function(data) {
                    if (data.code !== 200) {
                        tipbar.errorTipbar(_that, '该用户为无效用户,请重新填写');
                    }
                });
            });
            //绑定银行号码校验
            $('[mapping="bankAccount"]').blur(function() {
                var _that = $(this);
                _personModule.checkBankAccount($(this).val(), function(data) {
                    if (data.code !== 200) {
                        tipbar.errorTipbar(_that, '该账号为无效账号，请重新填写');
                    }
                });
            });

            /*信息初始化*/

            /*初始化字典信息*/
            //设置各项字典信息初始化
            _personModule.initInfo($('[mapping="initBank"]'), BTDict.SaleBankCode);
            _personModule.initInfo($('[mapping="province"]'), BTDict.Provinces);
            _personModule.initInfo($('[mapping="city"]'), BTDict.Provinces.getItem($('[mapping="province"]').val()).citys);
            _personModule.initInfo($('[mapping="identity"]'), BTDict.PersonIdentType);
            //初始化基金可选列表
            _personModule.initFundCompList();
            $('[mapping="province"]').change(function() {
                var dicData = BTDict.Provinces.getItem($(this).val()).citys;
                _personModule.initInfo($('[mapping="city"]'), dicData);
            });
            //初始化基金机构信息
            _personModule.reFreshFundCompany();
            //获取暂存信息
            _personModule.getServStorge();

            //初始化上传按钮
            // _personModule.installUpload();

        });
    });

});
