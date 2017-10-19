/*
还款计划 
作者:bhg
*/
define("p/provider/1.0.0/repayPlan-debug", [ "./libs/validate-debug", "./libs/tooltip-debug", "./libs/common-debug", "./libs/dialog-debug", "dialogEx-debug", "./libs/loading-debug", "./libs/commondirect-debug" ], function(require, exports, module) {
    require.async([ "dicTool-debug", "bootstrap-debug", "datePicker-debug" ], function() {
        require.async([ "BTDictData-debug" ], function() {
            var validate = require("./libs/validate-debug");
            var tipbar = require("./libs/tooltip-debug");
            var common = require("./libs/common-debug");
            var loading = require("./libs/loading-debug");
            var comdirect = require("./libs/commondirect-debug");
            require("angular-debug");
            //定义模块
            var mainApp = angular.module("mainApp", []);
            //扩充公共指令库
            comdirect.direcPlus(mainApp);
            //兼容IE模式
            // .config(function($sceProvider){
            // 	$sceProvider.enabled(false);
            // })
            //控制器区域
            mainApp.controller("testController", function($scope) {
                /*VM绑定区域*/
                //分页数据
                $scope.tradeListPage = {
                    pageNum: 1,
                    pageSize: 10,
                    pages: 1,
                    total: 1
                };
                //搜索所需信息
                $scope.searchData = {
                    GTEtradeDate: new Date().getSubDate("MM", 3).format("YYYY-MM-DD"),
                    LTEtradeDate: new Date().format("YYYY-MM-DD"),
                    applyCode: "",
                    reCode: ""
                };
                /*事件处理区域*/
                //查看详情按钮
                $scope.showDetail = function(event) {
                    var target = $(event.target || event.srcElement);
                    $("#fix_operator_info_box").height($("body").height()).slideDown();
                };
                //关闭下拉帘
                $scope.backForward = function() {
                    $("#fix_operator_info_box").slideUp();
                };
                //日期处理
                $scope.dateEmitter = {
                    changeDateInfo: function(event) {
                        var target = event.target || event.srcElement;
                        var dateName = $(target).attr("dateName"), dateData = $(target).attr("dateData");
                        $scope[dateData][dateName] = target.value;
                    }
                };
                //分页事件
                $scope.pageEmitter = {
                    firstPage: function() {
                        currentData.tradeListPage.pageNum = 1;
                        _personModule.reFreshTradList(false);
                    },
                    endPage: function() {
                        currentData.tradeListPage.pageNum = currentData.tradeListPage.pages;
                        _personModule.reFreshTradList(false);
                    },
                    prevPage: function() {
                        currentData.tradeListPage.pageNum--;
                        _personModule.reFreshTradList(false);
                    },
                    nextPage: function() {
                        currentData.tradeListPage.pageNum++;
                        _personModule.reFreshTradList(false);
                    },
                    skipPage: function(data, event) {
                        var pageNum = $('#fund_list_page [name="skipToPageNum"]').val();
                        if (isNaN(pageNum) || pageNum.split(".").length > 1 || Number(pageNum) < 1 || Number(pageNum) > currentData.tradeListPage.pages) {
                            $('#fund_list_page [name="skipToPageNum"]').val("");
                            tipbar.errorTipbar($(event.target), "请填写正确的页数!", 1e3);
                            return;
                        }
                        currentData.tradeListPage.pageNum = Number($('#fund_list_page [name="skipToPageNum"]').val()).toFixed(0);
                        $('#fund_list_page [name="skipToPageNum"]').val("");
                        _personModule.reFreshTradList(false);
                    }
                };
                /*外部事件绑定*/
                window.dateEmitter = {
                    changeDateInfo: function() {}
                };
            });
            //手动装载angular模块
            angular.bootstrap($("#container"), [ "mainApp" ]);
        });
    });
});

define("p/provider/1.0.0/libs/validate-debug", [], function(require, exports, module) {
    //私有方法以及对象定义区
    var _tools = {
        isEmpty: function(element) {
            return element.val() === "" || element.val() === null || element.val() === undefined;
        },
        packageValidAttr: function(formJQ, options) {
            var elements = options.elements, inputElements = formJQ.find(":input");
            inputElements.each(function() {
                //检测原有options是否已有该项检测
                var valid = $(this).attr("valid"), name = $(this).attr("name"), isExists = false;
                if (valid && valid !== "") {
                    valid = JSON.parse(valid.replace(/'/g, '"'));
                    for (var index in elements) {
                        var tempEle = elements[index];
                        if (tempEle.name === name) {
                            isExists = true;
                            var rules = tempEle.rules;
                            for (var indexR in rules) {
                                var tempRule = rules[indexR];
                                for (var indexV in valid) {
                                    var tempValid = valid[indexV];
                                    if (indexV === tempRule.name) {
                                        delete valid[indexV];
                                    }
                                }
                            }
                            //处理过滤后的valid对象
                            for (var indexVa in valid) {
                                var tempVa = valid[indexVa];
                                elements[index].rules.push({
                                    name: indexVa,
                                    message: tempVa === true ? "" : tempVa
                                });
                            }
                        }
                    }
                    //如果不存在该项验证
                    if (!isExists) {
                        //处理valid对象
                        var newRules = [];
                        for (var indexVal in valid) {
                            var tempVal = valid[indexVal];
                            newRules.push({
                                name: indexVal,
                                message: tempVal === true ? "" : tempVal
                            });
                        }
                        options.elements.push({
                            name: name,
                            rules: newRules,
                            events: [ "blur" ]
                        });
                    }
                }
            });
            return options;
        }
    };
    var _regRules = {
        required: function(element, params, message) {
            //兼容IE8及以下的placeholder插件干扰
            if ($.browser.msie && Number($.browser.version) < 9) {
                if (element.attr("placeholder") && element.attr("placeholder") === element.val()) {
                    return !message || message === "" ? "此项必须填写" : message;
                }
            }
            if (element.val() !== null && element.val() !== "" && element.val() !== undefined) {
                return true;
            } else {
                return !message || message === "" ? "此项必须填写" : message;
            }
        },
        repwd: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (!_tools.isEmpty(params.target) && params.target.val() === element.val()) {
                return true;
            } else {
                return !message || message === "" ? "请保持密码与确认密码的一致性" : message;
            }
        },
        min: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (isNaN(element.val()) || !isNaN(element.val()) && !isNaN(params.min) && Number(element.val()) >= Number(params.min)) {
                return true;
            } else {
                return !message || message === "" ? "此项可填写的数值不低于" + params.min : message;
            }
        },
        strmin: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (element.val().length >= params.strmin) {
                return true;
            } else {
                return !message || message === "" ? "此项可填写的长度必须大于或等于" + params.strmin : message;
            }
        },
        max: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (isNaN(element.val()) || !isNaN(element.val()) && !isNaN(params.max) && Number(element.val()) <= Number(params.max)) {
                return true;
            } else {
                return !message || message === "" ? "此项可填写的数值不高于" + params.max : message;
            }
        },
        strmax: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (element.val().length <= params.strmax) {
                return true;
            } else {
                return !message || message === "" ? "此项可填写的长度必须小于或等于" + params.max : message;
            }
        },
        money: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (/^([1-9]\d+\.?(\d{1,2})?)$|^([0-9]\.?(\d{1,2})?)$/.test(element.val())) {
                return true;
            } else {
                return !message || message === "" ? "请填写正确的数值(例如8888888.88,正数且小数点后保留两位)" : message;
            }
        },
        email: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(element.val())) {
                return true;
            } else {
                return !message || message === "" ? "请填写格式正确的邮箱" : message;
            }
        },
        mobile: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(element.val())) {
                return true;
            } else {
                return !message || message === "" ? "请填写格式正确的手机号码" : message;
            }
        },
        phone: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (/^((\d{3,4}-)?\d{7,8})$|^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(element.val())) {
                return true;
            } else {
                return !message || message === "" ? "请填写格式正确的电话号码" : message;
            }
        },
        fax: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(element.val())) {
                return true;
            } else {
                return !message || message === "" ? "请填写格式正确的传真号码" : message;
            }
        },
        zipcode: function(element, params, message) {
            if (_tools.isEmpty(element)) {
                return true;
            }
            if (/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(element.val())) {
                return true;
            } else {
                return !message || message === "" ? "请填写格式正确的邮编号码" : message;
            }
        },
        minlength: function(element, params, message) {}
    };
    //全局变量定义区
    window.validateCache = {};
    //验证规则缓存
    //表单验证框架
    exports.validate = function(formJQ, options) {
        if (arguments.length > 1) {
            //进行元素属性验证定义打包
            options = _tools.packageValidAttr(formJQ, options);
            //保存到全局暂存区
            validateCache[formJQ.attr("id")] = options;
            //进行验证规则配置
            for (var i = 0; i < options.elements.length; i++) {
                var tempElement = options.elements[i];
                var obj = formJQ.find('[name="' + tempElement.name + '"]');
                if (obj.length > 0) obj.each(function(index) {
                    obj[index].tempElement = tempElement;
                });
                //验证条件事件群体绑定
                for (var j = 0; j < tempElement.events.length; j++) {
                    var tempEvent = tempElement.events[j];
                    obj.bind(tempEvent, function() {
                        var tempElement = this.tempElement;
                        //规则遍历处理
                        for (var i = 0; i < tempElement.rules.length; i++) {
                            var tempRule = tempElement.rules[i];
                            var result = _regRules[tempRule.name]($(this), tempRule.params, tempRule.message);
                            if (result !== true) {
                                options.errorPlacement(result, $(this));
                                break;
                            }
                        }
                    });
                }
            }
        } else if (arguments.length > 0) {
            var optionsRe = validateCache[formJQ.attr("id")];
            var noError = true;
            //无错误标志
            for (var k = 0; k < optionsRe.elements.length; k++) {
                var tempElementRe = optionsRe.elements[k];
                //判断无name属性元素并过滤
                if (!tempElementRe.name || tempElementRe.name === "") continue;
                var objRe = formJQ.find('[name="' + tempElementRe.name + '"]');
                //规则遍历处理
                for (var l = 0; l < tempElementRe.rules.length; l++) {
                    var tempRule = tempElementRe.rules[l];
                    var result = _regRules[tempRule.name](objRe, tempRule.params, tempRule.message);
                    if (result !== true) {
                        optionsRe.errorPlacement(result, objRe);
                        noError = false;
                        break;
                    }
                }
            }
            return noError;
        }
    };
    //清除表单验证事件绑定
    exports.cleanValidate = function(formJQ, nameList, eventsList, isAll) {
        if (formJQ.is("form") && isAll) {
            formJQ.find(":input").each(function() {
                if (eventsList === null || eventsList === undefined) {
                    $(this).unbind();
                } else {
                    for (var j = 0; j < eventsList.length; j++) {
                        var evntName = eventsList[j];
                        $(this).unbind(evntName);
                    }
                }
            });
        } else if (formJQ.is("form") && !isAll) {
            for (var i = 0; i < nameList.length; i++) {
                var temp = nameList[i];
                if (eventsList === null || eventsList === undefined || eventsList[temp] === undefined || eventsList[temp] === null) {
                    formJQ.find('[name="' + temp + '"]').unbind();
                } else {
                    for (var j = 0; j < eventsList[temp].length; j++) {
                        var evntName = eventsList[temp][j];
                        formJQ.find('[name="' + temp + '"]').unbind(evntName);
                    }
                }
            }
        }
    };
});

define("p/provider/1.0.0/libs/tooltip-debug", [], function(require, exports, module) {
    /*私有方法*/
    var _personCurrent = {
        tipabarBind: function(element, tipbarElement, time, zIndex, callback) {
            //自设定定位层
            if (zIndex) {
                tipbarElement.css("zIndex", zIndex);
            }
            //对按钮进行特殊处理
            if (element.is("button")) {
                setTimeout(function() {
                    tipbarElement.remove();
                    if (callback) {
                        callback();
                    }
                }, 3e3);
            }
            //定时关闭效果
            if (time && time !== 0 && !isNaN(time)) {
                setTimeout(function() {
                    tipbarElement.remove();
                    if (callback) {
                        callback();
                    }
                }, time);
            }
            //清除绑定的多余事件
            element.one("focus", function() {
                tipbarElement.remove();
            });
            window.onresize = function() {
                //设置绝对定位
                var left = element.offset().left + element.outerWidth() + 8;
                var top = element.offset().top + element.height() / 2 - 10;
                tipbarElement.css({
                    top: top + "px",
                    left: left + "px"
                });
            };
        }
    };
    /*公用方法*/
    //右方错误提示框
    exports.errorTipbar = function(element, message, time, zIndex) {
        if (element.length < 1) {
            if (console) console.log("创建提示框时找不到响应对象，其选择器为:" + element.selector);
            return;
        }
        var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow"></div></div>');
        tipbarElement.appendTo($("body"));
        //设置绝对定位
        var left = element.offset().left + element.outerWidth() + 8;
        var top = element.offset().top + element.height() / 2 - 10;
        tipbarElement.css({
            top: top + "px",
            left: left + "px"
        });
        _personCurrent.tipabarBind(element, tipbarElement, time, zIndex);
    };
    //上方错误提示框
    exports.errorTopTipbar = function(element, message, time, zIndex, callback) {
        if (element.length < 1) {
            if (console) console.log("创建提示框时找不到响应对象，其选择器为:" + element.selector);
            return;
        }
        var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow-top"></div></div>');
        tipbarElement.appendTo($("body"));
        //设置绝对定位
        var left = element.offset().left + 10;
        var top = element.offset().top - tipbarElement.outerHeight() - 10;
        tipbarElement.css({
            top: top + "px",
            left: left + "px"
        });
        _personCurrent.tipabarBind(element, tipbarElement, time, zIndex, callback);
    };
    //左方信息提示框
    exports.errorLeftTipbar = function(element, message, time, zIndex) {
        if (element.length < 1) {
            if (console) console.log("创建提示框时找不到响应对象，其选择器为:" + element.selector);
            return;
        }
        var tipbarElement = $('<div mapping="tipbar" class="tipbar-wrap">' + message + '<div class="tipbar-wrap-arrow-left"></div></div>');
        tipbarElement.appendTo($("body"));
        //设置绝对定位
        var left = element.offset().left - tipbarElement.outerWidth() - 8;
        var top = element.offset().top + element.height() / 2 - 10;
        tipbarElement.css({
            top: top + "px",
            left: left + "px"
        });
        _personCurrent.tipabarBind(element, tipbarElement, time, zIndex);
    };
    //页面上方弹出信息提示
    exports.infoTopTipbar = function(message, params) {
        var _default_params = {
            msg_box_cls: "alert alert-success alert-block",
            msg_box_width: "80%",
            slideDownTime: 500,
            during: 1500,
            slideUpTime: 500,
            fontColor: "rgb(70, 136, 71)",
            inIframe: false
        };
        var newParams = $.extend(_default_params, params || {});
        //兼容资金管理系统措施
        var bfsFrame = $(window.parent.document).find("iframe").filter("#mainshow");
        if (bfsFrame.length > 0) newParams.inIframe = true;
        //设置标识
        var flag = newParams.msg_box_cls.split(" ").join("-");
        var tipbarElement = $('<div mapping="' + flag + '" class="' + newParams.msg_box_cls + '"><p>' + message + "</p></div>");
        tipbarElement.css({
            width: newParams.msg_box_width,
            position: "fixed",
            zIndex: 800,
            textAlign: "center",
            top: 0,
            left: "50%",
            color: newParams.fontColor,
            display: "none"
        }).appendTo(newParams.inIframe ? $("body") : $(window.parent.document.body)).css("marginLeft", "-" + tipbarElement.outerWidth() / 2 + "px").slideDown(newParams.slideDownTime, function() {
            window.setTimeout(function() {
                tipbarElement.slideUp(newParams.slideUpTime, function() {
                    tipbarElement.remove();
                });
            }, newParams.during);
        });
        //页面卸载时启动自我销毁
        $(window).unload(function() {
            tipbarElement.remove();
        });
        return tipbarElement;
    };
    //自定义框元素弹出效果
    exports.boxTopTipbar = function(element, targetObject, closeElement, params) {
        var _default_params = {
            wrapCss: {
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 900,
                display: "none",
                backgroundColor: "white"
            },
            closeSelector: ".close-tipbar",
            slideDownSpeed: "slow",
            slideUpSpeed: "slow"
        };
        var newParams = $.extend(true, _default_params, params === null || params === undefined ? {} : params), tipbarElement = $("<div></div>");
        //前置处理
        if (targetObject.css("position") === "static") {
            targetObject.css("position", "relative").attr("isStatic", "true");
        }
        element = $(element.html());
        //增加信息操作
        tipbarElement.css(newParams.wrapCss).css({
            width: targetObject.width() + "px",
            height: targetObject.height() + "px"
        }).appendTo(targetObject).append(element).slideDown(newParams.slideDownSpeed);
        //创建关闭事件
        var closeHandle = function() {
            if (targetObject.attr("isStatic") === "true") {
                targetObject.css("position", "static").attr("isStatic", "false");
            }
            tipbarElement.slideUp(newParams.slideUpSpeed, function() {
                $(this).remove();
            });
        };
        if (closeElement) {
            closeElement.click(function() {
                closeHandle();
            });
        } else {
            $(element).find(newParams.closeSelector).click(function() {
                closeHandle();
            });
        }
    };
    exports.cleanPageTip = function() {
        $('[mapping="tipbar"]').remove();
    };
});

/**
*项目内公用组件
*作者:bhg
*/
define("p/provider/1.0.0/libs/common-debug", [ "p/provider/1.0.0/libs/tooltip-debug", "p/provider/1.0.0/libs/dialog-debug", "dialogEx-debug" ], function(require, exports, module) {
    var tipbar = require("p/provider/1.0.0/libs/tooltip-debug");
    //内部变量及方法
    var _commonModel = {
        token: "",
        //设置文件头
        setAjaxHeader: function(token) {
            $.ajaxSetup({
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("token", token);
                }
            });
        },
        //获取token并设置
        getRemoteToken: function() {
            $.ajax({
                url: exports.getRootPath() + "/p/testdata/testToken.json",
                type: "post",
                dataType: "json",
                async: false,
                success: function(data) {
                    _commonModel.setAjaxHeader(data.token);
                }
            });
        }
    };
    //获取当前项目地址URL
    exports.getRootPath = function() {
        //js获取项目根路径，如： http://localhost:8083/uimcardprj
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
        //兼容BFS代理路径
        var BFSPath = location.href.indexOf("qiejf") === -1 ? "/better" : "";
        // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
        // 	BFSPath += '/'+window.parent.pathFlag.path;
        // }
        return localhostPaht + projectName + BFSPath;
    };
    //获取BFS项目URL
    exports.getBFSRootPath = function() {
        //js获取项目根路径，如： http://localhost:8083/uimcardprj
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
        //兼容BFS代理路径
        var BFSPath = location.href.indexOf("qiejf") === -1 ? "/fund" : "";
        // if(window.parent&&window.parent.pathFlag&&window.parent.pathFlag.isBFS === true){
        // 	BFSPath += '/'+window.parent.pathFlag.path;
        // }
        return localhostPaht + projectName;
    };
    //判断是否为BFS
    exports.isBFS = function() {
        if (location.href.indexOf("qiejf.com") !== -1) {
            return false;
        }
        return true;
    };
    //数组截断
    exports.splitArray = function(preArray, splitNum) {
        var targetArrayList = [];
        for (var i = 0; i < preArray.length; ) {
            var temp = preArray.slice(i, i + splitNum);
            targetArrayList.push(temp);
            i += splitNum;
        }
        return targetArrayList;
    };
    //数组深度克隆
    exports.cloneArrayDeep = function(preArray) {
        var targetArray = [];
        for (var i = 0; i < preArray.length; i++) {
            var item = preArray[i];
            if (item instanceof Array) {
                item = arguments.callee(item);
            } else if (item instanceof Object) {
                item = $.extend(true, {}, item);
            }
            targetArray.push(item);
        }
        return targetArray;
    };
    //组装checkBox的值
    exports.pakageCheckBoxValue = function(checkBoxList) {
        var valueArray = {};
        checkBoxList.each(function(index) {
            valueArray[index] = this.checked;
        });
        return valueArray;
    };
    //填充checkBox的值
    exports.setCheckBoxValue = function(checkBoxList, valueArray) {
        checkBoxList.each(function(index) {
            this.checked = valueArray[index];
        });
    };
    //为未选中的单选框添加虚化样式
    exports.setUncheckCss = function(checkBoxList) {
        checkBoxList.prev("span").removeClass("unchecked").end().filter(":not(:checked)").prev("span").addClass("unchecked");
    };
    //为所有的单、复选框设置文字联动选中
    exports.setUnionCheck = function(checkBoxList) {
        checkBoxList.filter(":not(.right-text-checkbox)").prev("span").css("cursor", "pointer").click(function() {
            $(this).next(":checkbox")[0].checked = !$(this).next(":checkbox")[0].checked;
        });
        checkBoxList.filter(".right-text-checkbox").next("span").css("cursor", "pointer").click(function() {
            $(this).prev(":checkbox")[0].checked = !$(this).prev(":checkbox")[0].checked;
        });
    };
    //数组中对象批处理加值
    exports.addKey4ArrayObj = function(array, keyName, defaultValue) {
        var targetArray = [];
        for (var i = 0; i < array.length; i++) {
            var temp = array[i];
            temp[keyName] = defaultValue;
            targetArray.push(temp);
        }
        return targetArray;
    };
    //UI处理:重新调节父iframe
    exports.resizeIframe = function(speed) {
        var height = $(document).find("body").outerHeight() + 20, content_iframe = $(window.parent.document).find("#content_iframe");
        if (height < content_iframe.height()) return;
        toHeight = height - content_iframe.height() > 0 ? "+=" + (height - content_iframe.height()) : "-=" + (content_iframe.height() - height);
        content_iframe.animate({
            height: toHeight + "px"
        }, speed || 1500);
    };
    /**
	*数据格式化区块
	*/
    //格式化日期
    exports.formaterDate = function(data) {
        if (data.split("-").length > 1) return data;
        data += "";
        var newDate = "";
        newDate += data.substr(0, 4) + "-" + data.substr(4, 2) + "-" + data.substr(6);
        return newDate;
    };
    //4位小数点格式化
    exports.formaterPoint4 = function(data) {
        return Number(data).toFixed(4);
    };
    //2位小数点格式化
    exports.formaterPoint2 = function(data) {
        return Number(data).toFixed(2);
    };
    //数字千位符格式化
    exports.formaterThounthand = function(data, placeholder) {
        data = Number(data).toFixed(placeholder || 2) + "";
        var dataStrArr = data.split(".");
        data = dataStrArr[0];
        var dataStrUNPlus = "";
        if (data.substr(0, 1) === "-") {
            dataStrUNPlus = data.substr(0, 1);
            data = data.substr(1);
        }
        var tempEnd = dataStrArr[1] || "", tempResultArr = [];
        for (var i = data.length; i > -3; ) {
            if (data.length <= 3) {
                tempResultArr.push(data);
                break;
            }
            i -= 3;
            tempResultArr.push(data.substr(i, 3));
            if (i <= 3 && i > 0) {
                tempResultArr.push(data.substr(0, i));
                break;
            }
        }
        return dataStrUNPlus + tempResultArr.reverse().join(",") + "." + tempEnd;
    };
    //百分号格式化
    exports.formaterPercent = function(data) {
        return data + "%";
    };
    //序列化单层对象为标准查询字符串
    exports.serializeSingleObject = function(object) {
        var paramStr = "";
        var num = 0;
        for (var index in object) {
            var temp = object[index];
            if (typeof temp === "object" && temp instanceof Array) {
                temp = temp.join(",");
            }
            if (typeof temp !== "function" || typeof temp !== "object") {
                if (num === 0) {
                    paramStr += index + "=" + temp;
                    num++;
                } else {
                    paramStr += "&" + index + "=" + temp;
                }
            }
        }
        return paramStr;
    };
    //判断对象是否没有任何Own属性和方法
    exports.isEmptyObject = function(object) {
        var isEmpty = true;
        for (var index in object) {
            isEmpty = false;
        }
        return isEmpty;
    };
    //格式化json各类对象为无法被过滤字段
    exports.formaterJsonUglify = function(object) {
        return JSON.stringify(object).replace(/\{/g, "$left_quote$").replace(/\}/g, "$right_quote$").replace(/"/g, "$double_quote$").replace(/:/g, "=").replace(/\[/g, "$left_middle_quote$").replace(/\]/g, "$right_middle_quote$");
    };
    //组装格式化的json各类对象字符串
    exports.packageJsonFromUglify = function(dataStr) {
        dataStr = dataStr.replace(/\$left_quote\$/g, "{").replace(/\$right_quote\$/g, "}").replace(/\$double_quote\$/g, '"').replace(/=/g, ":").replace(/\$left_middle_quote\$/, "[").replace(/\$right_middle_quote\$/, "]");
        return JSON.parse(dataStr);
    };
    //获取日期信息
    exports.getToday = function() {
        return new Date();
    };
    exports.getCurrentDate = function() {
        var today = new Date();
        return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    };
    //当月拥有天数
    exports.getMonthDay = function(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    };
    //删除所有提示框
    exports.cleanPageTip = function() {
        $('[mapping="tipbar"]').remove();
    };
    /*js原生对象扩展*/
    //Date对象拓展
    $.extend(Date.prototype, {
        //日期格式化
        format: function(formatStr) {
            formatStr = formatStr || "YYYY-MM-DD HH:mm:SS";
            var FullYearIndex = formatStr.indexOf("YYYY"), monthIndex = formatStr.indexOf("MM"), dayIndex = formatStr.indexOf("DD"), hourIndex = formatStr.indexOf("HH"), miniteIndex = formatStr.indexOf("mm"), secondIndex = formatStr.indexOf("SS");
            if (FullYearIndex !== -1) {
                formatStr = formatStr.replace("YYYY", this.getFullYear() + "");
            }
            if (monthIndex !== -1) {
                var thisMonth = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1 + "";
                formatStr = formatStr.replace("MM", thisMonth);
            }
            if (dayIndex !== -1) {
                var thisDay = this.getDate() < 10 ? "0" + this.getDate() : this.getDate() + "";
                formatStr = formatStr.replace("DD", thisDay);
            }
            if (hourIndex !== -1) {
                var thisHours = this.getHours() < 10 ? "0" + this.getHours() : this.getHours() + "";
                formatStr = formatStr.replace("HH", thisHours);
            }
            if (miniteIndex !== -1) {
                var thisMinites = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes() + "";
                formatStr = formatStr.replace("mm", thisMinites);
            }
            if (secondIndex !== -1) {
                var thisSecond = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds() + "";
                formatStr = formatStr.replace("SS", thisSecond);
            }
            return formatStr;
        },
        //日期前驱范围计算
        getSubDate: function(flag, subNum) {
            var FullYearNum = this.getFullYear(), monthNum = this.getMonth(), dayNum = this.getDate(), thisMonthAllDays = new Date(this.getFullYear(), this.getMonth(), 0).getDate(), prevMonthAllDays = new Date(this.getFullYear(), this.getMonth() - 1, 0).getDate();
            if (flag === "YYYY") {
                FullYearNum -= subNum;
            }
            if (flag === "MM") {
                monthNum -= subNum;
                if (monthNum === 0) {
                    FullYearNum -= 1;
                } else if (monthNum < 0) {
                    monthNum += 11;
                    FullYearNum -= 1;
                }
                if (dayNum > new Date(FullYearNum, monthNum + 1, 0).getDate()) {
                    dayNum = new Date(FullYearNum, monthNum + 1, 0).getDate();
                }
            }
            if (flag === "DD") {
                dayNum -= subNum;
                if (dayNum === 0) {
                    dayNum = prevMonthAllDays;
                    monthNum -= 1;
                } else if (dayNum < 0) {
                    dayNum = prevMonthAllDays + dayNum;
                    monthNum -= 1;
                }
                if (monthNum === 0) {
                    FullYearNum -= 1;
                } else if (monthNum < 0) {
                    monthNum += 11;
                    FullYearNum -= 1;
                }
            }
            return new Date(FullYearNum, monthNum, dayNum);
        },
        //获取当月拥有天数
        getMonthDay: function() {
            return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
        }
    });
    //Array对象拓展,避免遍历问题，不采用原生拓展
    window.ArrayPlus = function(obj) {
        return $.extend(obj, {
            //过滤数组中子元素
            objectChildFilter: function(queryKey, queryValue) {
                var resultArray = [];
                for (var index in this) {
                    var tempItem = this[index];
                    if (tempItem[queryKey] && (tempItem[queryKey] + "").indexOf(queryValue + "") !== -1) {
                        resultArray.push(tempItem);
                    }
                }
                return resultArray;
            },
            //子元素对象中新增属性
            addKey4ArrayObj: function(keyName, defaultValue) {
                var targetArray = [];
                for (var i = 0; i < this.length; i++) {
                    var temp = this[i];
                    temp[keyName] = defaultValue;
                    targetArray.push(temp);
                }
                return targetArray;
            },
            //数组截断
            splitBy: function(splitNum) {
                var targetArrayList = [];
                for (var i = 0; i < this.length; ) {
                    var temp = this.slice(i, i + splitNum);
                    targetArrayList.push(temp);
                    i += splitNum;
                }
                return targetArrayList;
            }
        });
    };
    //公用全局方法或者属性以及初始化
    //token处理
    _commonModel.getRemoteToken();
    window.setInterval(function() {
        _commonModel.getRemoteToken();
    }, 6e5);
    //视框自动调节大小
    $(".nav-tabs").on("shown", function() {
        exports.resizeIframe();
        exports.cleanPageTip();
    });
    //AJAX信息全局操作
    $.ajaxSetup({
        error: function() {
            if (console) console.log(arguments);
        },
        complete: function(data) {
            var resp = data.responseText;
            try {
                var respData = JSON.parse(resp);
                if (respData.code === 401) {
                    var dialog = require("p/provider/1.0.0/libs/dialog-debug");
                    dialog.alert("您还未登录或已退出登录，请先执行登录操作!", function() {
                        var path = window.parent.location.href.split("/");
                        path.pop();
                        if (!exports.isBFS()) window.parent.location.replace(path.join("/") + "/login.html");
                    });
                }
            } catch (e) {}
        }
    });
});

define("p/provider/1.0.0/libs/dialog-debug", [ "dialogEx-debug" ], function(require, exports, module) {
    var dialog = require("dialogEx-debug");
    //确认框
    exports.confirm = function(msg, okFun, cancelFun) {
        dialog({
            title: "提示信息",
            content: msg || "提示信息",
            width: 300,
            fixed: true,
            okValue: "确定",
            ok: okFun || function() {},
            cancelValue: "取消",
            cancel: cancelFun || function() {}
        }).showModal();
    };
    //提示框
    exports.tip = function(msg, closeTime, callback) {
        var d = dialog({
            title: "提示信息",
            content: msg || "提示信息",
            width: 300,
            fixed: true,
            close: callback || null
        }).showModal();
        setTimeout(function() {
            d.close().remove();
        }, closeTime * 1e3);
    };
    //警告框
    exports.alert = function(msg, fun) {
        dialog({
            title: "警告信息",
            content: msg || "警告信息",
            width: 300,
            fixed: true,
            ok: fun || null
        }).showModal();
    };
    //错误框
    exports.error = function(msg, okfun) {
        dialog({
            title: "错误提示",
            content: msg || "错误提示",
            width: 300,
            fixed: true,
            ok: okfun || true
        }).showModal();
    };
    //成功提示
    exports.success = function(msg, closeTime, callback) {
        var d = dialog({
            title: "成功提示",
            content: msg || "成功提示",
            width: 300,
            fixed: true,
            close: callback || null
        }).showModal();
        setTimeout(function() {
            d.close().remove();
        }, closeTime * 1e3);
    };
});

/*
遮罩层效果插件
作者: binhg
*/
define("p/provider/1.0.0/libs/loading-debug", [], function(require, exports, module) {
    //增加遮罩类型加载效果
    exports.addLoading = function(element, basePath) {
        var elementPosition = element.css("position"), loadingWidth, loadingHeight, loadingLeft, loadingTop;
        if (elementPosition === "static") {
            element.css("position", "relative").attr("isStatic", "true");
        }
        if (element.is("table")) {
            var tbody = element.find("tbody:visible");
            if (tbody.find("tr td").length < 1) return;
            loadingHeight = tbody.height() + "px";
            loadingWidth = element.width() + "px";
            loadingLeft = tbody.position().left + "px";
            loadingTop = tbody.position().top + "px";
        } else {
            loadingHeight = "100%";
            loadingWidth = "100%";
            loadingLeft = 0;
            loadingTop = 0;
        }
        var loadingElement = $('<div mapping="loading"></div>');
        element.append(loadingElement);
        // loadingElement.hide();
        loadingElement.css({
            opacity: .2,
            cursor: "pointer",
            background: "black",
            position: "absolute",
            left: loadingLeft,
            top: loadingTop,
            zIndex: 9999,
            width: loadingWidth,
            height: loadingHeight
        });
        var loginIcon = $('<img src="' + basePath + '/p/img/loading.gif" alt="正在加载中...." />');
        loadingElement.append(loginIcon);
        loginIcon.css({
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "50px",
            height: "50px"
        }).css({
            marginLeft: "-" + loginIcon.width() / 2 + "px",
            marginTop: "-" + loginIcon.height() / 2 + "px"
        });
    };
    exports.removeLoading = function(element, callback) {
        setTimeout(function() {
            if (element.attr("isStatic") === "true") {
                element.css("position", "static").removeAttr("isStatic");
            }
            element.find('[mapping="loading"]').remove();
            if (callback) callback();
        }, 200);
    };
});

/*angular公用指令
作者:binhg
*/
define("p/provider/1.0.0/libs/commondirect-debug", [], function(require, exports, module) {
    //扩充指令入口
    exports.direcPlus = function(moduleApp) {
        /*ngFocus*/
        moduleApp.directive("ngFocus", [ "$parse", function($parse) {
            return function(scope, element, attr) {
                var fn = $parse(attr["ngFocus"]);
                element.bind("focus", function(event) {
                    scope.$apply(function() {
                        fn(scope, {
                            $event: event
                        });
                    });
                });
            };
        } ]);
        /*ngBlur*/
        moduleApp.directive("ngBlur", [ "$parse", function($parse) {
            return function(scope, element, attr) {
                var fn = $parse(attr["ngBlur"]);
                element.bind("blur", function(event) {
                    scope.$apply(function() {
                        fn(scope, {
                            $event: event
                        });
                    });
                });
            };
        } ]);
        /*ngLoad*/
        moduleApp.directive("ngLoad", [ "$parse", function($parse) {
            return function(scope, element, attr) {
                var fn = $parse(attr["ngLoad"]);
                element.bind("load", function(event) {
                    scope.$apply(function() {
                        fn(scope, {
                            $event: event
                        });
                    });
                });
            };
        } ]);
    };
});
