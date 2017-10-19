/**
 * <p>系统全局常量包装对象</p>
 * 存放系统全局常量，每个常量为KGC对象的一个属性，这些属性的值在运行期间不允许改变，新增常量属性时，
 * 按照【属性前缀_属性名: 属性值，  // 描述】的格式定义常量属性名称;所有常量属性值要左对齐，所有描述要左对象.
 */
var KGC = {
    // 登录密码类型
    PwdType_Query: "1", // 查询密码
    PwdType_Trade: "0", // 交易密码

    // 监护人信息启用标志
    Transactor_None: "0", // 不显示监护人
    Transactor_Used: "1", // 输入显示监护人
    Transactor_Must: "2", // 必须输入监护人

    //推荐信息启用标志
    Refer_None: "0", // 不显示推荐信息
    Refer_Used: "1", // 输入显示推荐信息
    Refer_Must: "2", // 必须输入推荐信息

    // 表格统计类型
    SumType_Sum: "S", // 求和
    SumType_Count: "C", // 计数
    SumType_Avg: "A", // 平均值
    SumType_Min: "N", // 最小值
    SumType_Max: "X", // 最大值
    SumType_Text: "T", // 文本

    // 基金类型
    FT_Normal: "0", // 股票型基金
    FT_ShortBond: "1", // 债券型基金
    FT_Currency: "2", // 货币市场基金
    FT_Bond: "3", // 混合型基金
    FT_Professional: "4", // 专户基金
    FT_Index: "5", // 指数型基金
    FT_QDII: "6", // QDII基金

    // 基金状态
    FS_OnTrade: "0", // 交易
    FS_OnIssue: "1", // 发行
    FS_IssueSucc: "2", // 发行成功
    FS_IssueFail: "3", // 发行失败
    FS_OffTrade: "4", // 基金停止交易
    FS_OffBid: "5", // 停止申购
    FS_OffRedeem: "6", // 停止赎回
    FS_OnSetBal: "7", // 权益登记
    FS_OnDivdent: "8", // 红利发放
    FS_CloseFund: "9", // 基金封闭
    FS_EndFund: "a", // 基金终止

    // 支付方式
    PW_BankCard: "1", // 银行卡支付
    PW_Remit: "2", // 汇款支付
    PW_MoneyFund: "3", // 货币基金支付

    // 业务代码
    BC_SubCode: "20", // 认购
    BC_BidCode: "22", // 申购
    BC_RedeemCode: "24", // 赎回
    BC_SavePlan: "39", // 定投

    // 收费类型
    ST_Before: "A", // 前收费
    ST_After: "B", // 后收费

    // 赎回时收费类型显示方式
    STDW_None: "0", // 是否显示收费类型
    STDW_Before: "1", // 收费类型按前收费显示
    STDW_After: "2", // 收费类型按后收费显示
    STDW_Support: "3", // 显示支持的收费类型

    // 格式化字符串
    FMT_Currency: "#,##0.00", // 金额格式化化字符串
    FMT_Float2: "#,##0.##", // 格式化浮点数:最多两位小数 + 千分位
    FMT_Float3: "#,##0.###", // 格式化浮点数:最多三位小数 + 千分位
    FMT_FixedFloat2: "#,##0.00", // 格式化浮点数:固定两位小数 + 千分位
    FMT_FixedFloat3: "#,##0.000", // 格式化浮点数:固定三位小数 + 千分位

    // 风险评测方式
    REW_Internal: "0", // 内部评测
    REW_External: "1", // 外部评测

    // 基金参考费率显示方式
    FDW_SingleRow: "0", // 根据金额和支付网点返回单一费率
    FDW_Table: "1", // 显示费率表

    // 其它常量
    GO_True: "Y", // true的字符标识
    GO_False: "N", // false的字符标识
    GO_MinorFlag: "1", // 未成年标志
    GO_IdCardFlag: "0", // 身份证标识
    GO_PayWay: "payway", // 支付方式单选按钮组名称
    GO_AmountFormat: "#,##0.00", // 系统默认金额格式化掩码

    //定投投资方式
    IM_ImVarVol: "1", // 按递增金额扣款
    IM_ImFixVal: "2", // 按后续投资金额不变

    //风险等级判定标致
    RL_Normal: "0", //用户风险状态正常
    RL_Small: "1", //风险等级过低
    RL_UnEvaluate: "2", //未评估
    RL_StaleDated: "3"                          //评估过期
};


/**
 * <p>系统公用函数封装对象</p>
 */
if (typeof KGF == "undefined")
    var KGF = {};
/**
 * 获得页面宽度和高度
 * @returns 页面宽高对象
 */
KGF.getPageSize = function () {
    var iWidth = 0;
    var iHeight = 0;
    if (window.innerWidth) {
        iWidth = window.innerWidth;
        iHeight = window.innerHeight;
    } else if (document.compatMode == 'CSS1Compat') {
        iWidth = document.documentElement.clientWidth;
        iHeight = document.documentElement.clientHeight;
    } else if (document.body) {
        iWidth = document.body.clientWidth;
        iHeight = document.body.clientHeight;
    }
    return {width: iWidth, height: iHeight};
};

// 判断变量是否为空:null、undefine、nan、空字符串
KGF.isEmpty = function (value) {
    if (value === null || value === undefined || value === "" || value === "undefined" || value === undefined|| value === " ") {
        return true;
    } else if ((value instanceof Number || typeof(value) === "number") && isNaN(value)) {
        return true;
    } else {
        return false;
    }
};
//校验邮件地址
KGF.isEmail = function (v) {
    if (KGF.isEmpty(v))
        return true;
    var reEmail = /^(?:[\w-]+\.?)*[\w-]+@(?:\w+-?\w+\.)+\w+$/;
    return reEmail.test(v);
};
//校验手机号码
KGF.isMobile = function (v) {
    if (KGF.isEmpty(v))
        return true;
    var reMobile = /^(13|14|15|17|18)(\d{9})$/;
    return reMobile.test(v);
};
// 检查s是否为由数字字符组成字符串
KGF.isNumberStr = function (s) {
    return /[^\d]/g.test(s);
};

// 检查s是否为数字、字母字符串
KGF.isLetterNumber = function (s) {
    return /[\W]/g.test(s);
};

// 检查s是否是中文字符串
KGF.isChinse = function (s) {
    var reg = /^[\u4E00-\u9FA5]*$/g;
    if (KGF.browser.isFirefox())
        return  s.match(reg);
    else
        return reg.test(s);
};

// 检查输入是否是无效密码字符
KGF.isValidPwd = function (s) {
    return /^[a-zA-Z0-9_@;:'"=+-`!#$%^&*(,<.>?)]/.test(s);
};

// 判断输入的年份是否是闰年
KGF.isLeapYear = function (iYear) {
    if (iYear <= 0)
        return false;
    return   (iYear % 4 == 0 && iYear % 100 != 0) || (iYear % 400 == 0);
};
//处理input输入框默认值
KGF.disposeInputDef = function () {
    $(function () {
        $("input[type='text']").each(function () {
            if (!KGF.isEmpty($(this).val())) {
                var defVlaue = $(this).val();
                $(this).bind({
                    focus: function () {
                        if (this.value != ""&&this.value==defVlaue) {
                            this.value = "";
                        }
                    },
                    blur: function () {
                        if (this.value == "") {
                            this.value = defVlaue;
                        }
                    }
                });
            };
        });
    })
}
/**
 * 简单检查输入的身份证号是否无效，有效返回false，无效返回true
 */
KGF.isValidIDCardNo = function (code) {
    var Errors = new Array("true",
        "身份证号码位数不对,必须是15位或者18位!",
        "身份证号码出生年月日格式不对!",
        "身份证号码校验位错误!",
        "身份证地区非法!",
        "15位身份证号码由数字组成!",
        "18位身份证号码前17位由数字组成,第18位可以是数字或者大写\"X\"!");
    if (code.length != 15 && code.length != 18) {// 身份证长度不正确
        return Errors[1];
    }
    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    }
    var Y, JYM;
    var S, M;
    var ereg;
    var idcard_array = new Array();
    idcard_array = code.split("");
    // 地区检验
    if (area[parseInt(code.substr(0, 2))] == null)
        return Errors[4];
    // 身份号码位数及格式检验
    switch (code.length) {
        case 15:
            if (!/^[0-9]{15}$/.test(code)) {
                return Errors[5];
            }
            var sBirthday = "19" + code.substr(6, 2) + "-"
                + Number(code.substr(8, 2)) + "-"
                + Number(code.substr(10, 2));
            var d = new Date(sBirthday.replace(/-/g, "/"));
            var flag = (sBirthday != (d.getFullYear() + "-"
                + (d.getMonth() + 1) + "-" + d.getDate()));
            if (!flag)
                return Errors[0];
            else
                return Errors[2];
            break;
        case 18:
            if (!/^[0-9]{17}([0-9X])$/.test(code)) {
                return Errors[6];
            }

            var sBirthday = code.substr(6, 4) + "-"
                + Number(code.substr(10, 2)) + "-"
                + Number(code.substr(12, 2));
            var d = new Date(sBirthday.replace(/-/g, "/"));
            var flag = (sBirthday != (d.getFullYear() + "-"
                + (d.getMonth() + 1) + "-" + d.getDate()));
            if (!flag) {// 测试出生日期的合法性
                // 计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10]))
                    * 7
                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11]))
                    * 9
                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12]))
                    * 10
                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13]))
                    * 5
                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14]))
                    * 8
                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15]))
                    * 4
                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16]))
                    * 2 + parseInt(idcard_array[7]) * 1
                    + parseInt(idcard_array[8]) * 6
                    + parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                // 判断校验位
                if (M == idcard_array[17])
                    return Errors[0];// 检测ID的校验位
                else
                    return Errors[3];
            } else
                return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
};

/**
 * 从身份证号码中取出生日
 */
KGF.getBirthdayFormIdNo = function (sIdNo) {
    //15位号码
    if (sIdNo.length == 15)
        return "19" + sIdNo.substr(6, 6);
    //18位号码
    return sIdNo.substr(6, 8);
};

/**
 * 判断是否成年人
 */
KGF.isAdult = function (sBirthday, sServerDate) {
    var year = sServerDate.substr(0, 4);
    var month = sServerDate.substring(4, 2);
    var day = sServerDate.substring(6, 2);
    var birthyear = sBirthday.substr(0, 4);
    var birthmonth = sBirthday.substr(4, 2);
    var birthday = sBirthday.substr(6, 2);
    var flag = year - birthyear;

    return flag > 18 || ((flag == 18) && (birthday < month)) || ((flag == 18) && (birthday == month) && (birthday < day));
};

/**
 * 转换boolean类型为int
 */
KGF.boolToInt = function (bValue) {
    return bValue ? 1 : 0;
};

/**
 * 字符串转换为数值，如果sValue不是数值，则返回nDefault
 */
KGF.strToNumber = function (sValue, nDefault) {
    var fValue = Number(sValue);
    return isNaN(sValue) ? nDefault : fValue;
};

/**
 * 检查value1是否为null、undefined、NaN、Finite，如果是则转换为value2，否则返回原值
 */
KGF.checkEmpty = function (value1, value2) {
    return (value1 == null) ? value2 : value1;
};

/**
 * 跳转到指定URL
 */
KGF.gotoPage = function (url) {
    window.location.href = encodeURI(url);
};

KGF.gotoPageEx = function (sMenuId, url, bIsIG) {
    if (top != window) {
        if (top.oFrame)
            top.oFrame.loadPage(sMenuId, url);
    } else {
        if (bIsIG) {
            top.oFrame.loadPage(sMenuId, url);
        } else {
            KGF.gotoPage(url);
        }
    }
};
/**
 * 打开一个窗体,显示url
 * features: 一个可选的字符串，声明了新窗口要显示的标准浏览器的特征。
 */
KGF.openDlg = function (url, features) {
    window.open(url, "", features);
};
/**
 * 构建URL查询串
 * @param oData 数据源，可以是对象，ListMap
 * @param aParams 参数名数组
 * @return 返回构建的查询串，不带？
 */
KGF.buildUrlSearch = function (oData, aParams) {
    if (!(aParams instanceof Array) || aParams.length <= 0) return "";
    // 处理第一个
    var i, sSearch = aParams[0] + "=";
    if (oData instanceof ListMap) {
        sSearch += oData.get(aParams[0]);
        for (i = 1; i < aParams.length; i++) {
            sSearch += "&" + aParams[i] + "=" + oData.get(aParams[i]);
        }
    } else if (oData instanceof Object || typeof oData == "object") {
        sSearch += oData[aParams[0]];
        for (i = 1; i < aParams.length; i++) {
            sSearch += "&" + aParams[i] + "=" + oData[aParams[i]];
        }
    } else {
        sSearch = "";
        KDlg.info("无效的数据类型：oData");
    }
    return sSearch;
};

/**
 * 获取证书查询串
 * @returns {String}
 */
KGF.getSecurityUrlParam = function () {
    //TODO
};

/**
 * 获取对象属性值列表
 * @param {object} obj
 * @param {array|string} aPropertyNames 待获取属性值的属性名称数组,必须
 * @return {array} 属性值数组
 */
KGF.getObjectPropVal = function (obj, aPropertyNames) {
    var aValue = [];
    if (obj) {
        if ($.isArray(aPropertyNames)) {    // 数组，多个属性
            for (var i = 0; i < aPropertyNames.length; i++) {
                aValue.push(obj[aPropertyNames[i]]);
            }
        } else {    // 字符串，一个属性
            aValue.push(obj[aPropertyNames]);
        }
    }
    return aValue;
};

/**
 * 检查对象数组中是否存在指定的对象
 * @param aoData 一维数组对象
 * @param sKeyName 对象键值属性名称数组
 * @param sKeyValue 对象键值属性值数组
 * @returns true/false
 */
KGF.checkObjectExits = function (aoData, aKeyName, aKeyValue) {
    if (aoData instanceof Array && aKeyName.length == aKeyValue.length) {
        var i, j, bFlag;
        var iCount = aoData.length;
        for (i = 0; i < iCount; i++) {
            bFlag = true;
            for (j = 0; j < aKeyName.length; j++) {
                if (aoData[i][aKeyName[j]] != aKeyValue[j]) {
                    bFlag = false;
                    break;
                }
            }
            if (bFlag) return true;
        }
        return false;
    } else {
        return false;
    }
};

/**
 * 从数组中查找对象并返回
 * @param aoData 一维数组对象
 * @param sKeyName 对象键值属性名称数组
 * @param sKeyValue 对象键值属性值数组
 * @returns 返回对象
 */
KGF.getObjectFromArray = function (aoData, aKeyName, aKeyValue) {
    if (aoData instanceof Array && aKeyName.length == aKeyValue.length) {
        var i, j, bFlag;
        var iCount = aoData.length;
        for (i = 0; i < iCount; i++) {
            bFlag = true;
            for (j = 0; j < aKeyName.length; j++) {
                if (aoData[i][aKeyName[j]] != aKeyValue[j]) {
                    bFlag = false;
                    break;
                }
            }
            if (bFlag) return aoData[i];
        }
        return undefined;
    }
    return undefined;
};

/**
 * 用数据字典sDictName翻译数组中所有对象指定属性<srong>sPropertyName的值，
 * 并将翻译值作为对象新属性sNewPropertyName的属性值。
 * @param {array} aoData 对象数组
 * @param {ListMap} oDict 数据字典列表
 * @param {string} sPropertyName 翻译的属性名称
 * @param {string} sNewPropertyName 存储翻译值的属性名称
 */
KGF.transferObjectArrayProperty = function (aoData, oDict, sPropertyName, sNewPropertyName) {
    var i, o, v, iCount = aoData.length;
    for (i = 0, len = iCount; i < len; i++) {
        o = aoData[i];
        v = o[sPropertyName];
        o[sNewPropertyName] = oDict.get(v, v);
    }
};
/**
 * 将数字转换为大写份额
 * @param aMount
 * @param sSuffix
 */
KGF.capitalShare=function(aMount,sSuffix){

        //字符长度
    function LengthB(str) {
        var p1 = new RegExp('%u..', 'g');
        var p2 = new RegExp('%.', 'g');
        return escape(str).replace(p1, '').replace(p2, '').length;
    }

    var low;
    var i, k, j, l_xx1;
    var cap = "", xx1, unit;
    var a = ("" + aMount).replace(/(^0*)/g, "").split(".");

    var digits = "零壹贰叁肆伍陆柒捌玖";
    var units = "份 点拾佰仟万拾佰仟亿拾佰仟万拾佰仟";
    var digit;
    low = parseFloat(aMount);
    if (isNaN(low)) {
        return "";
    }

    xx1 = Math.round(low * 100.0) + "";
    l_xx1 = xx1.length;

    for (i = 0; i < l_xx1; i++) {
        j = l_xx1 - 1 - i;
        unit = units.substr(j, 1);
        // 生成大写单位，即'..份拾...'
        k = parseInt(xx1.substr(i, 1));
        digit = digits.substr(k, 1);
        // 生成大写数字, 即'零壹贰叁...'
        cap = cap + digit + unit;
    }

    cap = cap.replace(" ", "");
    cap = cap.replace(/零拾|零佰|零仟/g, "零");
    cap = cap.replace(/零+/g, "零");
    cap = cap.replace(/零亿/g, "亿");
    cap = cap.replace(/零万/g, "万");
    cap = cap.replace(/零点/g, "点");
    cap = cap.replace(/零份/g, "份");
    cap = cap.replace(/亿万/g, "亿");
    cap = cap.replace(/^壹拾/, "拾");
    cap = cap.replace(/点份$/, "份整");
    cap = cap.replace(/份整$/, "");
    cap = cap.replace(/零$/, "");
    cap = cap.replace(/份$/, "");
    if (a.length > 1 && LengthB(a[1]) > 2) {
        cap = '小数点位数不应超过2位';
        return cap;
    }
    if (a.length > 1 && LengthB(a[0]) == 0 && a[1].charAt(0) != '0') {
        cap = cap.replace("", "零点");
    }
    if (a.length > 1 && LengthB(a[0]) == 0 && a[1].charAt(0) == '0') {
        cap = cap.replace("", "零点零");
    }
    if (cap != "" || cap.length > 0) {
        cap = cap + sSuffix;
    }
    return cap;

}



/**
 * 将人民币金额转换为大写
 * @param fAmount
 * @returns {sring}
 */
KGF.capitalRMB = function (aMount, sSuffix) {




    //字符长度
    function LengthB(str) {
        var p1 = new RegExp('%u..', 'g');
        var p2 = new RegExp('%.', 'g');
        return escape(str).replace(p1, '').replace(p2, '').length;
    }

    function covert(aMount){
        if(isNaN(aMount)) {
            return "不是一个有效的数字，请重新输入！";
        }
        var money1 = new Number(aMount);
        if(money1> 1000000000000000000) {
            return"您输入的数字太大，重新输入！";

        }
        var a = ("" + aMount).replace(/(^0*)/g, "").split(".");
        if (a.length > 1 && LengthB(a[1]) > 2) {
            cap = '小数点位数不应超过2位';
            return cap;
        }
        var monee = Math.round(money1*100).toString(10)
        var i,j;
        j=0;
        var leng = monee.length;
        var monval="";
        for( i=0;i<leng;i++)
        {
            monval= monval+to_upper(monee.charAt(i))+to_mon(leng-i-1);
        }
        return repace_acc(monval);
    }
    function to_upper( a)
    {
        switch(a){
            case '0' : return '零'; break;
            case '1' : return '壹'; break;
            case '2' : return '贰'; break;
            case '3' : return '叁'; break;
            case '4' : return '肆'; break;
            case '5' : return '伍'; break;
            case '6' : return '陆'; break;
            case '7' : return '柒'; break;
            case '8' : return '捌'; break;
            case '9' : return '玖'; break;
            default: return '' ;
        }
    }
    function to_mon(a){
        if(a>10){ a=a - 8;
            return(to_mon(a));}
        switch(a){
            case 0 : return '分'; break;
            case 1 : return '角'; break;
            case 2 : return '圆'; break;
            case 3 : return '拾'; break;
            case 4 : return '佰'; break;
            case 5 : return '仟'; break;
            case 6 : return '万'; break;
            case 7 : return '拾'; break;
            case 8 : return '佰'; break;
            case 9 : return '仟'; break;
            case 10 : return '亿'; break;
        }
    }
    function repace_acc(Money){
        Money=Money.replace("零分","");
        Money=Money.replace("零角","零");
        var yy;
        var outmoney;
        outmoney=Money;
        yy=0;
        while(true){
            var lett= outmoney.length;
            outmoney= outmoney.replace("零圆","圆");
            outmoney= outmoney.replace("零万","万");
            outmoney= outmoney.replace("零亿","亿");
            outmoney= outmoney.replace("零仟","零");
            outmoney= outmoney.replace("零佰","零");
            outmoney= outmoney.replace("零零","零");
            outmoney= outmoney.replace("零拾","零");
            outmoney= outmoney.replace("亿万","亿零");
            outmoney= outmoney.replace("万仟","万零");
            outmoney= outmoney.replace("仟佰","仟零");
            yy= outmoney.length;
            if(yy==lett) break;
        }
        yy = outmoney.length;
        if ( outmoney.charAt(yy-1)=='零'){
            outmoney=outmoney.substring(0,yy-1);
        }
        yy = outmoney.length;
        if ( outmoney.charAt(yy-1)=='圆'){
            //outmoney=outmoney +'整';
	    outmoney=outmoney;
        }
        return outmoney;
    }
    return covert(aMount);
};

/**
 * 格式化数字
 * @param fData 待格式的数字
 * @param sFormat 格式化掩码，支持：#，0.等字符，可选，则默认KGC.GO_AmountFmt：
 *          ‘#’一位数字，如果是数字末尾且是0则不显示，‘，’分位标志，‘0’一位数字，‘.’小数点，例1234567.1204格式化如下：
 *          #,###（#,###.#0）     1,234,567      #,###.0#            1,234,567.12
 *          #,###.##            1,234,567.12   #,###.0##        1,234,567.12
 *          #,###.00            1,234,567.12
 */
KGF.fmtNumber = function (fData, sFormat) {
    var arrTemp;
    var sInt, sFloat, sFmt, sSign;
    var fmtInt = "", fmtFloat = "";
    sSign = fData >= 0 ? "" : "-";
    fData = Math.abs(fData);
    var sData = fData.toString();
    if (arguments.length == 1) {
        sFormat = KGC.GO_AmountFormat;
    }
    arrTemp = sFormat.match(/[\#\,0\.]+/);
    if (arrTemp != null) {
        sFmt = arrTemp[0];
    } else {
        sFmt = KGC.GO_AmountFormat;
    }
    var reDecimal = /\./;
    if (reDecimal.test(sFmt)) {
        arrTemp = sFmt.split(".");
        fmtInt = arrTemp[0];
        fmtFloat = arrTemp[1];
    } else {
        fmtInt = sFmt;
    }

    if (reDecimal.test(sData)) {
        if (fmtFloat != "") {
            arrTemp = sData.split(".");
            var iPow10 = Math.pow(10, fmtFloat.length);  //10的fmtFloat.length次方
            var fTemp = Math.round(parseFloat("0." + arrTemp[1]) * iPow10) / iPow10;
            sInt = (Math.floor(fData) + Math.floor(fTemp)).toString();
            if (fTemp == 1) {
                fTemp = "1.0";
            }
            if (fTemp == 0||fTemp == 1)
                sFloat = "0";
            else
                sFloat = fTemp.toString().split(".")[1];
        } else {
            sInt = Math.round(fData).toString();
            sFloat = "";
        }
    } else {
        sInt = sData;
        sFloat = "";
    }

    if (fmtInt != "") {
        var iCommaLen = null;
        var iZeroCount = fmtInt.match(/0*$/)[0].length;
        if (/,/g.test(fmtInt)) {
            iCommaLen = fmtInt.match(/,[^,]*/)[0].length - 1;
        }
        var reg = new RegExp("(\\d{" + iCommaLen + "})", "g");
        if (sInt.length < iZeroCount) {
            sInt = new Array(iZeroCount + 1).join("0") + sInt;
            sInt = sInt.substr(sInt.length - iZeroCount, iZeroCount);
        }
        if (iCommaLen > 0) {
            var idx = sInt.length % iCommaLen;
            sInt = sInt.substr(0, idx) + sInt.substring(idx).replace(reg, ",$1");
        }
        sInt = sInt.replace(/^,/, "");
    }

    if (fmtFloat != "") {
        var iZeroCount = fmtFloat.match(/^0*/)[0].length;
        if (sFloat.length < iZeroCount) {
            sFloat = sFloat + new Array(iZeroCount + 1).join("0");
            if (fmtFloat.length > iZeroCount) {
                var sTemp1 = sFloat.substring(0, iZeroCount);
                var sTemp2 = sFloat.substring(iZeroCount, fmtFloat.length);
                sFloat = sTemp1 + sTemp2.replace(/0*$/, "");
            } else {
                sFloat = sFloat.substring(0, iZeroCount);
            }
        } else {
            sFloat = sFloat.substring(0, fmtFloat.length);
        }
    } else {
        sFloat = "";
    }

    if (sFloat == "") {
        sData = sInt;
    } else {
        sData = sInt + "." + sFloat;
    }
    if (sFormat != sFmt) {
        sData = sFormat.replace(sFmt, sData);
    }
    return sSign + sData;
};

/**
 * 格式化整型日期,仅检查位数和字符有效性，如果无效返回
 * @param date 可以是Date、int、string类型
 * @param sSplit 分隔符,默认'-','CN'表示用年月日分隔
 * @returns string
 */
KGF.fmtDate = function (date, sSplit) {
    var sDate, sY, sM, sD;
    if (jQuery.type(date) === "date") {
        sY = date.getFullYear();
        sM = date.getMonth() + 1 + "";
        if (sM.length === 1) {
            sM = "0" + sM;
        }

        sD = date.getDate() + "";
        if (sD.length === 1)
            sD = "0" + sD;
    } else {
        sDate = date.toString();
        if (/^\d{8}$/.test(sDate)) {
            sY = sDate.substring(0, 4);
            sM = sDate.substring(4, 6);
            sD = sDate.substring(6, 8);
        } else
            return "-";
    }

    if (sSplit === "CN") {
        sDate = sY + "年" + sM + "月" + sD + "日";
    } else if(sSplit === "MD"){//只显示月日
        sDate =  sM + "月" + sD + "日";
    }else {
        if (sSplit === "" || sSplit == null) {
            sSplit = "-";
        }
        sDate = sY + sSplit + sM + sSplit + sD;
    }
    return sDate;
};
/*把年份变成字符串形式  Add  By Congsd 2014-12-09*/
KGF.fmtDateNoSplit = function (date) {
    var sDate, sY, sM, sD;
    if (jQuery.type(date) === "date") {
        sY = date.getFullYear();
        sM = date.getMonth() + 1 + "";
        if (sM.length === 1) {
            sM = "0" + sM;
        }

        sD = date.getDate() + "";
        if (sD.length === 1)
            sD = "0" + sD;
    }
    sDate = sY + sM + sD;
    return sDate;
};


/**
 * 格式化整型时间,仅检查位数有效性
 * @param time 可以是Date、int、string类型
 * @param sSplit 分隔符,默认':','CN'表示用时分秒分隔
 * @returns string
 */
KGF.fmtTime = function (time, sSplit) {
    var sTime, sH, sM, sS;
    if (jQuery.type(time) === "date") {
        sH = time.getHours();
        if (sH.length === 1) {
            sH = "0" + sH;
        }
        sM = time.getMinutes();
        if (sM.length === 1) {
            sM = "0" + sM;
        }
        sS = time.getSeconds();
        if (sS.length === 1) {
            sS = "0" + sS;
        }
    } else {
        sTime = time.toString();
        if (sTime.length === 5) {
            sTime = "0" + sTime;
        }
        if (/^\d{6}$/.test(sTime)) {
            sH = sTime.substring(0, 2);
            sM = sTime.substring(2, 4);
            sS = sTime.substring(4, 6);
        } else if (/^\d{2}:\d{2}:\d{2}$/.test(sTime)) {
            sH = sTime.substring(0, 2);
            sM = sTime.substring(3, 5);
            sS = sTime.substring(6, 8);
        }
        else {
            return "-";
        }
    }

    if (sSplit == "CN") {
        sTime = sH + "时" + sM + "分" + sS + "秒";
    } else {
        if (sSplit == "" || sSplit == null) {
            sSplit = ":";
        }
        sTime = sH + sSplit + sM + sSplit + sS;
    }
    return sTime;
};

/**
 * 获取项目根路径
 * @returns webpath
 */

KGF.getRootPathEx = function () {
    return KGP.WEBPATH;
};

KGF.getRootPath = function () {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return window.location.protocol + '//' + window.location.host + '/' + webName;
     //return window.location.protocol + '//' + window.location.host; //用域名访问，没有根目录时用这个
};
function ListMap() {
    var sKeyName = "key";        // 索引属性名称
    var sValueName = "value";    // 默认值属性名称
    var oParent = {};            // 数据项MapItem.prototype的值（数据项对象的父类）
    var aoMap = [];              // 存放数据项对象的数组

    // 根据入参构建数据项对象的父类（合并所有数据对象的属性到父类中）
    var iBegin = null;
    var iArgLen = arguments.length;
    if (jQuery.type(arguments[0]) == "string") {
        sKeyName = arguments[0];
        if (jQuery.type(arguments[1]) == "string") {
            if (iArgLen > 0) {
                sValueName = arguments[1];
                iBegin = 2;
            } else
                iBegin = 1;
        }
        for (var i = iBegin; i < iArgLen; i++) {
            if (jQuery.type(arguments[i]) == "object")
                jQuery.extend(oParent, arguments[i]);
        }
    }
    var o = null;
    eval("o={'" + sKeyName + "':'','" + sValueName + "':''}");
    o.getKey = function () {
        return this[sKeyName];
    };
    o.getValue = function () {
        return this[sValueName];
    };
    jQuery.extend(oParent, o);

    /**
     * 内部数据项类，该类继承于oParent
     */
    function MapItem() {
    }

    MapItem.prototype = oParent;

    /**
     * 根据索引属性的属性值查找数据项
     * @param vKey 数据项索引属性值
     * @returns 返回其索引位置，未找到返回-1
     */
    this.find = function (vKey) {
        for (var i = 0; i < aoMap.length; i++) {
            if (aoMap[i][sKeyName] == vKey)
                return i;
        }
        return -1;
    };

    /**
     * 通过数据项在数组中的索引获取映射项，如果索引越界，返回undefined
     * @param {number} iIndex 数据项索引
     * @returns {object} 数据项对象
     */
    this.items = function (iIndex) {
        if (KGF.isEmpty(iIndex)) return undefined;
        if (iIndex < aoMap.length && iIndex >= 0)
            return aoMap[iIndex];
        return undefined;
    };

    /**
     * 通过索引属性值获取该数据项的默认属性值，未找到返回undefined或defaultValue
     * @param vKey 数据项索引属性值
     * @param vDefaultValue 未找到默认返回值
     * @returns 默认属性值
     */
    this.get = function (vKey, vDefaultValue) {
        if ((!vKey) && (vKey != "")) return vDefaultValue;

        var i = this.find(vKey);
        return i >= 0 ? aoMap[i][sValueName] : vDefaultValue;
    };

    /**
     * 通过索引属性值获取该数据项的指定属性的属性，未找到返回undefined或defaultValue
     * @param vKey 数据项索引属性值
     * @param {string} sPropName 返回数据项该属性的属性值
     * @param vDefaultValue 未找到默认返回值
     * @returns 指定属性值
     */
    this.getValue = function (vKey, sPropName, vDefaultValue) {
        if ((!vKey) && (vKey != "")) return vDefaultValue;

        var i = this.find(vKey);
        if (i >= 0) {
            var item = aoMap[i];
            return item.hasOwnProperty(sPropName) ? item[sPropName] : vDefaultValue;
        } else
            return vDefaultValue;
    };

    /**
     * 通过索引属性值获取该数据项并返回，未找到返回undefined或defaultValue
     * @param vKey 数据项索引属性的属性值
     * @param vDefaultValue 未找到默认返回值
     * @returns 数据项对象
     */
    this.getItem = function (vKey, vDefaultValue) {
        if ((!vKey) && (vKey != "")) return vDefaultValue;

        var i = this.find(vKey);
        return i >= 0 ? aoMap[i] : vDefaultValue;
    };

    /**
     * 设置指定数据项默认属性的属性值，如果该数据项不存在则添加
     * @param vKey 数据项索引属性值
     * @param value 默认属性的属性值
     */
    this.set = function (vKey, value) {
        if ((!vKey) && (vKey != "")) return;

        var i = this.find(vKey);
        if (i >= 0)
            aoMap[i][sValueName] = value;
        else {
            var item = new MapItem();
            item[sKeyName] = vKey;
            item[sValueName] = value;
            aoMap.push(item);
        }
    };

    /**
     * 返回指定索引位置的数据项的索引属性值，如果索引越界，返回vDefaultValue
     * @param {number} iIndex 数据对象索引
     * @param vDefaultValue 未找到默认返回值
     * @returns 索引属性值
     */
    this.getKey = function (iIndex, vDefaultValue) {
        var o = this.items(iIndex);
        if (o) {
            return o[sKeyName];
        } else
            return vDefaultValue;
    };

    /**
     * 设置指定数据项指定属性的属性值，如果该数据项不存在则添加
     * @param vKey 数据项索引属性值
     * @param {string} sPropName 返回数据项该属性的属性值
     * @param value 属性值
     */
    this.setValue = function (vKey, sPropName, value) {
        if ((!vKey) && (vKey != "")) return;

        var i = this.find(vKey);
        if (i >= 0)
            aoMap[i][sPropName] = value;
        else {
            var item = new MapItem();
            item[sKeyName] = vKey;
            //if (oParent.hasOwnProperty(sPropName))
            item[sPropName] = value;
            aoMap.push(item);
        }
    };

    /**
     * 设置更新数据项，不存在则添加
     * @param {MapItem} o 数据项对象
     */
    this.setItem = function (o) {
        if (KGF.isEmpty(o)) return;

        // 检查该对象是否包含索引属性名称，不存在则退出
        var vKey = undefined;
        if (o.hasOwnProperty(sKeyName))
            vKey = o[sKeyName];
        if ((!vKey) && (vKey != "")) return;

        var item;
        var i = this.find(vKey);
        if (i >= 0) {
            item = aoMap[i];
        } else {
            item = new MapItem();
            aoMap.push(item);
        }
        // 赋值
        var prop = null;
        for (prop in o) {
            if (oParent.hasOwnProperty(prop)) {
                item[prop] = o[prop];
            }
        }
    };

    /**
     * 移除指定的数据项
     * @param vKey 数据项索引属性值
     */
    this.del = function (vKey) {
        if ((!vKey) && (vKey != "")) return;
        var i = this.find(vKey);
        if (i >= 0)
            aoMap.splice(i, 1);
    };

    /**
     * 返回列表中数据项的数目
     */
    this.count = function () {
        return aoMap.length;
    };

    /**
     * 将oList中的数据项添加到当前列表中，oData为ListMap类型或对象类型
     * @param {ListMap|object} oData 数据项列表
     */
    this.assigned = function (oData) {
        if (oData instanceof ListMap) {
            var iCount = oData.count();
            for (var i = 0; i < iCount; i++) {
                this.setItem(oData.items(i));
            }
        } else if (typeof(oData) === "object") {
            for (var sProp in oData) {
                this.set(sProp, oData[sProp]);
            }
        } else
            throw new Error("oData type error.");
    };

    /**
     * 解析字符串，插入到列表中，字符串格式：key1|value1;key2|value2;...
     * @param {string} sValue
     * @param {string} sSplitChar 每对key/valu之间的分隔符，可选，默认为分号(;)
     */
    this.parse = function (sValue, sSplitChar) {
        if (arguments.length == 1) {
            sSplitChar = ";";
        }
        var aItem;
        var aValue = sValue.split(sSplitChar);
        for (var i = 0; i < aValue.length; i++) {
            aItem = aValue[i].split("|");
            this.set(aItem[0], aItem[1]);
        }
    };

    /**
     * 检查数据项列表是否为空
     * @returns {boolean} false-非空，true-空
     */
    this.isEmpty = function () {
        return aoMap.length <= 0;
    };

    /**
     * 清除映射列表
     */
    this.clear = function () {
        aoMap.length = 0;
    };

    /**
     * 将列表项中的数据转换为JSON对象，转换原则：
     * 以索引属性的属性值为对象属性名，默认属性的属性值为对象属性值，
     * 将列表中的数据项对象的索引属性和默认属性转换为JSON对象
     */
    this.toJSON = function () {
        var oItem;
        var oJSON = {};
        for (var i = 0; i < this.count(); i++) {
            oItem = this.items(i);
            oJSON[oItem[sKeyName]] = oItem[sValueName];
        }
        return oJSON;
    };

    /**
     * 将列表项中的数据转换为JSON对象
     * Key加上"param."前缀
     */
    this.toParamJSON = function () {
        var oItem;
        var oJSON = {};
        for (var i = 0; i < this.count(); i++) {
            oItem = this.items(i);
            oJSON["param." + oItem[sKeyName]] = oItem[sValueName];
        }
        return oJSON;
    };

    /**
     * 以索引属性的属性值为参数名，默认属性的属性值为参数值，将列表中的数据项对象转换为URL查询字符串，
     * 返回查询串中首尾不带？和&；如果列表为空则返回空字符串""
     * @returns {string} URL查询串
     */
    this.toUrlParamStr = function () {
        var oItem;
        var sParams = "";
        var iCount = this.count();
        var sKeyName = this.getKeyName();
        var sValueName = this.getValueName();
        // 取第一个参数
        if (iCount > 0) {
            oItem = this.items(0);
            sParams = oItem[sKeyName] + "=" + oItem[sValueName];
        } else {
            return "".toString();
        }
        // 取剩余参数
        for (var i = 1; i < iCount; i++) {
            oItem = this.items(i);
            sParams += "&" + oItem[sKeyName] + "=" + oItem[sValueName];
        }
        return sParams.toString();
    };

    /**
     * 检查ListMap中的数据项对象是否有指定的属性名称
     * @param {string} sPropertyName 属性名称
     * @returns {boolean} false-不包含，true-包含
     */
    this.itemHasProperty = function (sPropertyName) {
        return (oParent.hasOwnProperty(sPropertyName));
    };

    /**
     * 返回数据项的索引属性名称
     * @returns 属性名称
     */
    this.getKeyName = function () {
        return sKeyName;
    };

    /**
     * 返回数据项的默认值的属性名称
     * @returns 属性名称
     */
    this.getValueName = function () {
        return sValueName;
    };
}
var BTDict = new BetterDictionary(); 
function BetterDictionary() { 
	  //投资人学历;
	  this.InvestEducation = new ListMap();
	  this.InvestEducation.set('01','研究生');
	  this.InvestEducation.set('02','大学本科');
	  this.InvestEducation.set('03','大学专科');
	  this.InvestEducation.set('04','中专或技校');
	  this.InvestEducation.set('09','文盲或半文盲');
	  this.InvestEducation.set('06','高中');
	  this.InvestEducation.set('07','初中');
	  this.InvestEducation.set('08','小学');
	  this.InvestEducation.set('05','技工学校');

	  //投资人职业代码;
	  this.InvestVocation = new ListMap();
	  this.InvestVocation.set('01','党政机关、事业单位');
	  this.InvestVocation.set('02','企业单位');
	  this.InvestVocation.set('06','其他');
	  this.InvestVocation.set('04','学生');
	  this.InvestVocation.set('05','军人');
	  this.InvestVocation.set('03','自由业主');

	  //行业类型;
	  this.InvestCorpVocate = new ListMap();
	  this.InvestCorpVocate.set('0','金融行业');

	  //销售系统业务代码定义;
	  this.SaleBusinCode = new ListMap();
	  this.SaleBusinCode.set('20','认购');
	  this.SaleBusinCode.set('22','申购');
	  this.SaleBusinCode.set('24','赎回');
	  this.SaleBusinCode.set('A9','经办人资料维护');
	  this.SaleBusinCode.set('B1','客户资料修改');
	  this.SaleBusinCode.set('01','基金账户开户');
	  this.SaleBusinCode.set('02','基金账户销户');
	  this.SaleBusinCode.set('04','基金账户冻结');
	  this.SaleBusinCode.set('05','基金账户解冻');
	  this.SaleBusinCode.set('06','基金账户挂失');
	  this.SaleBusinCode.set('08','基金账户登记');
	  this.SaleBusinCode.set('09','交易账户销户');
	  this.SaleBusinCode.set('14','账户资料核对');
	  this.SaleBusinCode.set('25','预约赎回');
	  this.SaleBusinCode.set('42','强行赎回');
	  this.SaleBusinCode.set('63','定期定额赎回');
	  this.SaleBusinCode.set('93','ETF一次赎回');
	  this.SaleBusinCode.set('26','转托管');
	  this.SaleBusinCode.set('27','转托管转入');
	  this.SaleBusinCode.set('28','转托管转出');
	  this.SaleBusinCode.set('30','认购结果');
	  this.SaleBusinCode.set('31','基金份额冻结');
	  this.SaleBusinCode.set('32','基金份额解冻');
	  this.SaleBusinCode.set('33','非交易过户');
	  this.SaleBusinCode.set('35','非交易过户出');
	  this.SaleBusinCode.set('36','基金转换');
	  this.SaleBusinCode.set('37','基金转换入');
	  this.SaleBusinCode.set('43','分红');
	  this.SaleBusinCode.set('44','强行调增');
	  this.SaleBusinCode.set('45','强行调减');
	  this.SaleBusinCode.set('51','批量开户');
	  this.SaleBusinCode.set('53','撤预约单');
	  this.SaleBusinCode.set('58','变更交易账户');
	  this.SaleBusinCode.set('60','定投协议撤销');
	  this.SaleBusinCode.set('61','定投协议变更');
	  this.SaleBusinCode.set('95','赎回支付');
	  this.SaleBusinCode.set('69','定赎/定转开通');
	  this.SaleBusinCode.set('70','定赎/定转撤销');
	  this.SaleBusinCode.set('71','定期赎回变更');
	  this.SaleBusinCode.set('92','ETF二次申购');
	  this.SaleBusinCode.set('80','确权');
	  this.SaleBusinCode.set('A1','客户联合开户');
	  this.SaleBusinCode.set('A2','客户销户');
	  this.SaleBusinCode.set('A4','客户冻结');
	  this.SaleBusinCode.set('A5','客户解冻');
	  this.SaleBusinCode.set('A6','客户密码修改');
	  this.SaleBusinCode.set('A8','客户银行卡资料修改');
	  this.SaleBusinCode.set('B4','客户挂失');
	  this.SaleBusinCode.set('B5','客户解挂');
	  this.SaleBusinCode.set('B6','注销银行卡');
	  this.SaleBusinCode.set('C2','份额调增');
	  this.SaleBusinCode.set('C3','份额调减');
	  this.SaleBusinCode.set('G1','定时定额暂停');
	  this.SaleBusinCode.set('G2','定时定额恢复');
	  this.SaleBusinCode.set('G4','定时赎回恢复');
	  this.SaleBusinCode.set('B8','客户解锁');
	  this.SaleBusinCode.set('03','账户信息修改');
	  this.SaleBusinCode.set('07','基金账户解挂失');
	  this.SaleBusinCode.set('39','定期定额申购');
	  this.SaleBusinCode.set('94','ETF二次赎回');
	  this.SaleBusinCode.set('29','设置分红方式');
	  this.SaleBusinCode.set('34','非交易过户入');
	  this.SaleBusinCode.set('38','基金转换出');
	  this.SaleBusinCode.set('49','基金募集失败');
	  this.SaleBusinCode.set('59','定投协议开通');
	  this.SaleBusinCode.set('96','销交易账户');
	  this.SaleBusinCode.set('91','ETF一次申购');
	  this.SaleBusinCode.set('A3','增加银行卡');
	  this.SaleBusinCode.set('A7','客户更换银行卡');
	  this.SaleBusinCode.set('B2','客户密码重置');
	  this.SaleBusinCode.set('B9','客户实时资料修改');
	  this.SaleBusinCode.set('G3','定时赎回暂停');
	  this.SaleBusinCode.set('C5','银行卡签约');
	  this.SaleBusinCode.set('C6','银行卡解约');
	  this.SaleBusinCode.set('98','T+0快速赎回');
	  this.SaleBusinCode.set('C7','客户密码解锁');
	  this.SaleBusinCode.set('C4','银行卡身份证转换');

	  //产品状态定义;
	  this.fundStatus = new ListMap();
	  this.fundStatus.set('0','交易');
	  this.fundStatus.set('1','发行');
	  this.fundStatus.set('2','发行成功');
	  this.fundStatus.set('3','发行失败');
	  this.fundStatus.set('4','基金停止交易');
	  this.fundStatus.set('a','基金终止');
	  this.fundStatus.set('6','停止赎回');
	  this.fundStatus.set('7','权益登记');
	  this.fundStatus.set('8','红利发放');
	  this.fundStatus.set('9','基金封闭');
	  this.fundStatus.set('5','停止申购');

	  //银行;
	  this.BankCode = new ListMap();
	  this.BankCode.set('022','邮政储蓄');
	  this.BankCode.set('939','深圳农村商业银行');
	  this.BankCode.set('024','深圳平安银行');
	  this.BankCode.set('921','宁波银行');
	  this.BankCode.set('901','长沙商行');
	  this.BankCode.set('904','南京银行');
	  this.BankCode.set('919','富滇银行');
	  this.BankCode.set('903','上海农村商业银行');
	  this.BankCode.set('915','浙商银行');
	  this.BankCode.set('940','重庆银行');
	  this.BankCode.set('941','大连银行');
	  this.BankCode.set('942','哈尔滨银行');
	  this.BankCode.set('943','江苏银行');
	  this.BankCode.set('944','洛阳银行');
	  this.BankCode.set('946','青岛银行');
	  this.BankCode.set('907','温州银行');
	  this.BankCode.set('948','乌鲁木齐商业银行');
	  this.BankCode.set('949','汉口银行');
	  this.BankCode.set('951','浙江稠州商业银行');
	  this.BankCode.set('952','浙江民泰商业银行');
	  this.BankCode.set('953','临商银行');
	  this.BankCode.set('950','东莞银行');
	  this.BankCode.set('954','张家港农村商业银行');
	  this.BankCode.set('098','北京农村商业银行');
	  this.BankCode.set('002','中国工商银行');
	  this.BankCode.set('003','中国农业银行');
	  this.BankCode.set('004','中国银行');
	  this.BankCode.set('005','中国建设银行');
	  this.BankCode.set('006','中国交通银行');
	  this.BankCode.set('007','光大银行');
	  this.BankCode.set('008','招商银行');
	  this.BankCode.set('009','民生银行');
	  this.BankCode.set('010','兴业银行');
	  this.BankCode.set('011','深圳发展银行');
	  this.BankCode.set('012','浦发银行');
	  this.BankCode.set('013','广发银行');
	  this.BankCode.set('014','中国民生银行');
	  this.BankCode.set('999','其他');
	  this.BankCode.set('025','北京银行');
	  this.BankCode.set('905','金华商业银行');
	  this.BankCode.set('016','上海银行');
	  this.BankCode.set('017','华夏银行');
	  this.BankCode.set('019','信用社');
	  this.BankCode.set('020','华一银行');
	  this.BankCode.set('015','中信实业银行');
	  this.BankCode.set('938','渤海银行');
	  this.BankCode.set('911','杭州银行');
	  this.BankCode.set('021','平安银行');
	  this.BankCode.set('916','烟台银行');
	  this.BankCode.set('945','齐商银行');
	  this.BankCode.set('023','汇丰银行');

	  //客户账户状态定义;
	  this.custAccountStatus = new ListMap();
	  this.custAccountStatus.set('0','正常');
	  this.custAccountStatus.set('1','普通冻结');
	  this.custAccountStatus.set('2','司法冻结');
	  this.custAccountStatus.set('6','复核锁定');
	  this.custAccountStatus.set('4','挂失');
	  this.custAccountStatus.set('5','锁定');
	  this.custAccountStatus.set('3','销户');

	  //交易账户状态定义;
	  this.tradeAccountStatus = new ListMap();
	  this.tradeAccountStatus.set('0','正常');
	  this.tradeAccountStatus.set('1','待确认');
	  this.tradeAccountStatus.set('8','复核锁定');
	  this.tradeAccountStatus.set('3','销户');
	  this.tradeAccountStatus.set('7','开户失败');
	  this.tradeAccountStatus.set('2','销户中');

	  //基金账户状态定义;
	  this.fundAccountStatus = new ListMap();
	  this.fundAccountStatus.set('0','正常');
	  this.fundAccountStatus.set('1','待确认');
	  this.fundAccountStatus.set('2','销户中');
	  this.fundAccountStatus.set('7','复核锁定');
	  this.fundAccountStatus.set('4','司法冻结');
	  this.fundAccountStatus.set('5','普通冻结');
	  this.fundAccountStatus.set('6','挂失');
	  this.fundAccountStatus.set('3','销户');

	  //客户类别定义;
	  this.CustWorkType = new ListMap();
	  this.CustWorkType.set('1','个人');
	  this.CustWorkType.set('0','机构');

	  //投资人年收入;
	  this.InvestIncoming = new ListMap();
	  this.InvestIncoming.set('01','2万以下');
	  this.InvestIncoming.set('03','10-20万');
	  this.InvestIncoming.set('05','50万以上');
	  this.InvestIncoming.set('02','2-10万');
	  this.InvestIncoming.set('04','20-50万');

	  //账户经办人识别方式;
	  this.InvestContIdentifyType = new ListMap();
	  this.InvestContIdentifyType.set('2','印鉴');
	  this.InvestContIdentifyType.set('4','证件');
	  this.InvestContIdentifyType.set('1','书面委托');
	  this.InvestContIdentifyType.set('3','密码');

	  //销售商代码;
	  this.SaleAgency = new ListMap();
	  this.SaleAgency.set('269','民生加银');
	  this.SaleAgency.set('209','大成基金');
	  this.SaleAgency.set('211','易方达基金');
	  this.SaleAgency.set('011','福建兴业银行');
	  this.SaleAgency.set('601','国泰君安证券股份公司');
	  this.SaleAgency.set('602','华夏证券公司');
	  this.SaleAgency.set('605','广发证券公司');
	  this.SaleAgency.set('606','中信证券股份公司');
	  this.SaleAgency.set('607','中国银河证券有限公司');
	  this.SaleAgency.set('609','联合证券有限公司');
	  this.SaleAgency.set('014','民生银行');
	  this.SaleAgency.set('603','国信证券');
	  this.SaleAgency.set('613','兴业证券');
	  this.SaleAgency.set('615','广东证券');
	  this.SaleAgency.set('205','博时基金');
	  this.SaleAgency.set('608','海通证券');
	  this.SaleAgency.set('622','渤海证券');
	  this.SaleAgency.set('624','华泰证券');
	  this.SaleAgency.set('629','汉唐证券');
	  this.SaleAgency.set('630','北京证券');
	  this.SaleAgency.set('631','东方证券');
	  this.SaleAgency.set('623','大鹏证券');
	  this.SaleAgency.set('634','长城证券');
	  this.SaleAgency.set('645','金信证券');
	  this.SaleAgency.set('650','东莞证券');
	  this.SaleAgency.set('208','嘉实基金');
	  this.SaleAgency.set('999','证券交易所');
	  this.SaleAgency.set('202','南方基金');
	  this.SaleAgency.set('604','招商证券股份公司');
	  this.SaleAgency.set('206','鹏华基金');
	  this.SaleAgency.set('614','长江证券');
	  this.SaleAgency.set('610','申银万国');
	  this.SaleAgency.set('625','山西证券');
	  this.SaleAgency.set('635','光大证券');
	  this.SaleAgency.set('646','平安证券');
	  this.SaleAgency.set('652','国都证券');

	  //默认交易手段;
	  this.SaleDefAcceptModes = new ListMap();
	  this.SaleDefAcceptModes.set('0','柜台');
	  this.SaleDefAcceptModes.set('1','电话');
	  this.SaleDefAcceptModes.set('5','机构');
	  this.SaleDefAcceptModes.set('3','传真');
	  this.SaleDefAcceptModes.set('4','手机');
	  this.SaleDefAcceptModes.set('2','网上交易');

	  //个人证件类型;
	  this.PersonIdentType = new ListMap();
	  this.PersonIdentType.set('0','身份证');
	  this.PersonIdentType.set('1','护照');
	  this.PersonIdentType.set('2','军官证');
	  this.PersonIdentType.set('3','士兵证');
	  this.PersonIdentType.set('4','港澳居民来往内地通行证');
	  this.PersonIdentType.set('A','台胞证');
	  this.PersonIdentType.set('6','外国护照');
	  this.PersonIdentType.set('7','其它');
	  this.PersonIdentType.set('8','文职证');
	  this.PersonIdentType.set('9','警官证');
	  this.PersonIdentType.set('5','户口本');

	  //机构证件类型;
	  this.OrgIdentType = new ListMap();
	  this.OrgIdentType.set('0','组织机构代码证');
	  this.OrgIdentType.set('1','营业执照');
	  this.OrgIdentType.set('2','行政机关');
	  this.OrgIdentType.set('3','社会团体');
	  this.OrgIdentType.set('8','其它');
	  this.OrgIdentType.set('5','武警');
	  this.OrgIdentType.set('6','下属机构');
	  this.OrgIdentType.set('7','基金会');
	  this.OrgIdentType.set('4','军队');


	 this.Provinces = new ListMap('id', 'name', {id: '', name: '', citys: null});
	   var citys;
	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '110000', name: '北京市', citys: citys});
	   citys.set('110100', '市辖区');
	   citys.set('110200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '120000', name: '天津市', citys: citys});
	   citys.set('120100', '市辖区');
	   citys.set('120200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '130000', name: '河北省', citys: citys});
	   citys.set('130100', '石家庄市');
	   citys.set('130200', '唐山市');
	   citys.set('130300', '秦皇岛市');
	   citys.set('130400', '邯郸市');
	   citys.set('130500', '邢台市');
	   citys.set('130600', '保定市');
	   citys.set('130700', '张家口市');
	   citys.set('130800', '承德市');
	   citys.set('130900', '沧州市');
	   citys.set('131000', '廊坊市');
	   citys.set('131100', '衡水市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '140000', name: '山西省', citys: citys});
	   citys.set('140100', '太原市');
	   citys.set('140200', '大同市');
	   citys.set('140300', '阳泉市');
	   citys.set('140400', '长治市');
	   citys.set('140500', '晋城市');
	   citys.set('140600', '朔州市');
	   citys.set('140700', '晋中市');
	   citys.set('140800', '运城市');
	   citys.set('140900', '忻州市');
	   citys.set('141000', '临汾市');
	   citys.set('141100', '吕梁市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '150000', name: '内蒙古自治区', citys: citys});
	   citys.set('150100', '呼和浩特市');
	   citys.set('150200', '包头市');
	   citys.set('150300', '乌海市');
	   citys.set('150400', '赤峰市');
	   citys.set('150500', '通辽市');
	   citys.set('150600', '鄂尔多斯市');
	   citys.set('150700', '呼伦贝尔市');
	   citys.set('150800', '巴彦淖尔市');
	   citys.set('150900', '乌兰察布市');
	   citys.set('152200', '兴安盟');
	   citys.set('152500', '锡林郭勒盟');
	   citys.set('152900', '阿拉善盟');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '210000', name: '辽宁省', citys: citys});
	   citys.set('210100', '沈阳市');
	   citys.set('210200', '大连市');
	   citys.set('210300', '鞍山市');
	   citys.set('210400', '抚顺市');
	   citys.set('210500', '本溪市');
	   citys.set('210600', '丹东市');
	   citys.set('210700', '锦州市');
	   citys.set('210800', '营口市');
	   citys.set('210900', '阜新市');
	   citys.set('211000', '辽阳市');
	   citys.set('211100', '盘锦市');
	   citys.set('211200', '铁岭市');
	   citys.set('211300', '朝阳市');
	   citys.set('211400', '葫芦岛市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '220000', name: '吉林省', citys: citys});
	   citys.set('220100', '长春市');
	   citys.set('220200', '吉林市');
	   citys.set('220300', '四平市');
	   citys.set('220400', '辽源市');
	   citys.set('220500', '通化市');
	   citys.set('220600', '白山市');
	   citys.set('220700', '松原市');
	   citys.set('220800', '白城市');
	   citys.set('222400', '延边朝鲜族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '230000', name: '黑龙江省', citys: citys});
	   citys.set('230100', '哈尔滨市');
	   citys.set('230200', '齐齐哈尔市');
	   citys.set('230300', '鸡西市');
	   citys.set('230400', '鹤岗市');
	   citys.set('230500', '双鸭山市');
	   citys.set('230600', '大庆市');
	   citys.set('230700', '伊春市');
	   citys.set('230800', '佳木斯市');
	   citys.set('230900', '七台河市');
	   citys.set('231000', '牡丹江市');
	   citys.set('231100', '黑河市');
	   citys.set('231200', '绥化市');
	   citys.set('232700', '大兴安岭地区');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '310000', name: '上海市', citys: citys});
	   citys.set('310100', '市辖区');
	   citys.set('310200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '320000', name: '江苏省', citys: citys});
	   citys.set('320100', '南京市');
	   citys.set('320200', '无锡市');
	   citys.set('320300', '徐州市');
	   citys.set('320400', '常州市');
	   citys.set('320500', '苏州市');
	   citys.set('320600', '南通市');
	   citys.set('320700', '连云港市');
	   citys.set('320800', '淮安市');
	   citys.set('320900', '盐城市');
	   citys.set('321000', '扬州市');
	   citys.set('321100', '镇江市');
	   citys.set('321200', '泰州市');
	   citys.set('321300', '宿迁市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '330000', name: '浙江省', citys: citys});
	   citys.set('330100', '杭州市');
	   citys.set('330200', '宁波市');
	   citys.set('330300', '温州市');
	   citys.set('330400', '嘉兴市');
	   citys.set('330500', '湖州市');
	   citys.set('330600', '绍兴市');
	   citys.set('330700', '金华市');
	   citys.set('330800', '衢州市');
	   citys.set('330900', '舟山市');
	   citys.set('331000', '台州市');
	   citys.set('331100', '丽水市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '340000', name: '安徽省', citys: citys});
	   citys.set('340100', '合肥市');
	   citys.set('340200', '芜湖市');
	   citys.set('340300', '蚌埠市');
	   citys.set('340400', '淮南市');
	   citys.set('340500', '马鞍山市');
	   citys.set('340600', '淮北市');
	   citys.set('340700', '铜陵市');
	   citys.set('340800', '安庆市');
	   citys.set('341000', '黄山市');
	   citys.set('341100', '滁州市');
	   citys.set('341200', '阜阳市');
	   citys.set('341300', '宿州市');
	   citys.set('341500', '六安市');
	   citys.set('341600', '亳州市');
	   citys.set('341700', '池州市');
	   citys.set('341800', '宣城市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '350000', name: '福建省', citys: citys});
	   citys.set('350100', '福州市');
	   citys.set('350200', '厦门市');
	   citys.set('350300', '莆田市');
	   citys.set('350400', '三明市');
	   citys.set('350500', '泉州市');
	   citys.set('350600', '漳州市');
	   citys.set('350700', '南平市');
	   citys.set('350800', '龙岩市');
	   citys.set('350900', '宁德市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '360000', name: '江西省', citys: citys});
	   citys.set('360100', '南昌市');
	   citys.set('360200', '景德镇市');
	   citys.set('360300', '萍乡市');
	   citys.set('360400', '九江市');
	   citys.set('360500', '新余市');
	   citys.set('360600', '鹰潭市');
	   citys.set('360700', '赣州市');
	   citys.set('360800', '吉安市');
	   citys.set('360900', '宜春市');
	   citys.set('361000', '抚州市');
	   citys.set('361100', '上饶市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '370000', name: '山东省', citys: citys});
	   citys.set('370100', '济南市');
	   citys.set('370200', '青岛市');
	   citys.set('370300', '淄博市');
	   citys.set('370400', '枣庄市');
	   citys.set('370500', '东营市');
	   citys.set('370600', '烟台市');
	   citys.set('370700', '潍坊市');
	   citys.set('370800', '济宁市');
	   citys.set('370900', '泰安市');
	   citys.set('371000', '威海市');
	   citys.set('371100', '日照市');
	   citys.set('371200', '莱芜市');
	   citys.set('371300', '临沂市');
	   citys.set('371400', '德州市');
	   citys.set('371500', '聊城市');
	   citys.set('371600', '滨州市');
	   citys.set('371700', '菏泽市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '410000', name: '河南省', citys: citys});
	   citys.set('410100', '郑州市');
	   citys.set('410200', '开封市');
	   citys.set('410300', '洛阳市');
	   citys.set('410400', '平顶山市');
	   citys.set('410500', '安阳市');
	   citys.set('410600', '鹤壁市');
	   citys.set('410700', '新乡市');
	   citys.set('410800', '焦作市');
	   citys.set('410900', '濮阳市');
	   citys.set('411000', '许昌市');
	   citys.set('411100', '漯河市');
	   citys.set('411200', '三门峡市');
	   citys.set('411300', '南阳市');
	   citys.set('411400', '商丘市');
	   citys.set('411500', '信阳市');
	   citys.set('411600', '周口市');
	   citys.set('411700', '驻马店市');
	   citys.set('419000', '省直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '420000', name: '湖北省', citys: citys});
	   citys.set('420100', '武汉市');
	   citys.set('420200', '黄石市');
	   citys.set('420300', '十堰市');
	   citys.set('420500', '宜昌市');
	   citys.set('420600', '襄阳市');
	   citys.set('420700', '鄂州市');
	   citys.set('420800', '荆门市');
	   citys.set('420900', '孝感市');
	   citys.set('421000', '荆州市');
	   citys.set('421100', '黄冈市');
	   citys.set('421200', '咸宁市');
	   citys.set('421300', '随州市');
	   citys.set('422800', '恩施土家族苗族自治州');
	   citys.set('429000', '省直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '430000', name: '湖南省', citys: citys});
	   citys.set('430100', '长沙市');
	   citys.set('430200', '株洲市');
	   citys.set('430300', '湘潭市');
	   citys.set('430400', '衡阳市');
	   citys.set('430500', '邵阳市');
	   citys.set('430600', '岳阳市');
	   citys.set('430700', '常德市');
	   citys.set('430800', '张家界市');
	   citys.set('430900', '益阳市');
	   citys.set('431000', '郴州市');
	   citys.set('431100', '永州市');
	   citys.set('431200', '怀化市');
	   citys.set('431300', '娄底市');
	   citys.set('433100', '湘西土家族苗族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '440000', name: '广东省', citys: citys});
	   citys.set('440100', '广州市');
	   citys.set('440200', '韶关市');
	   citys.set('440300', '深圳市');
	   citys.set('440400', '珠海市');
	   citys.set('440500', '汕头市');
	   citys.set('440600', '佛山市');
	   citys.set('440700', '江门市');
	   citys.set('440800', '湛江市');
	   citys.set('440900', '茂名市');
	   citys.set('441200', '肇庆市');
	   citys.set('441300', '惠州市');
	   citys.set('441400', '梅州市');
	   citys.set('441500', '汕尾市');
	   citys.set('441600', '河源市');
	   citys.set('441700', '阳江市');
	   citys.set('441800', '清远市');
	   citys.set('441900', '东莞市');
	   citys.set('442000', '中山市');
	   citys.set('445100', '潮州市');
	   citys.set('445200', '揭阳市');
	   citys.set('445300', '云浮市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '450000', name: '广西壮族自治区', citys: citys});
	   citys.set('450100', '南宁市');
	   citys.set('450200', '柳州市');
	   citys.set('450300', '桂林市');
	   citys.set('450400', '梧州市');
	   citys.set('450500', '北海市');
	   citys.set('450600', '防城港市');
	   citys.set('450700', '钦州市');
	   citys.set('450800', '贵港市');
	   citys.set('450900', '玉林市');
	   citys.set('451000', '百色市');
	   citys.set('451100', '贺州市');
	   citys.set('451200', '河池市');
	   citys.set('451300', '来宾市');
	   citys.set('451400', '崇左市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '460000', name: '海南省', citys: citys});
	   citys.set('460100', '海口市');
	   citys.set('460200', '三亚市');
	   citys.set('460300', '三沙市');
	   citys.set('469000', '省直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '500000', name: '重庆市', citys: citys});
	   citys.set('500100', '市辖区');
	   citys.set('500200', '县');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '510000', name: '四川省', citys: citys});
	   citys.set('510100', '成都市');
	   citys.set('510300', '自贡市');
	   citys.set('510400', '攀枝花市');
	   citys.set('510500', '泸州市');
	   citys.set('510600', '德阳市');
	   citys.set('510700', '绵阳市');
	   citys.set('510800', '广元市');
	   citys.set('510900', '遂宁市');
	   citys.set('511000', '内江市');
	   citys.set('511100', '乐山市');
	   citys.set('511300', '南充市');
	   citys.set('511400', '眉山市');
	   citys.set('511500', '宜宾市');
	   citys.set('511600', '广安市');
	   citys.set('511700', '达州市');
	   citys.set('511800', '雅安市');
	   citys.set('511900', '巴中市');
	   citys.set('512000', '资阳市');
	   citys.set('513200', '阿坝藏族羌族自治州');
	   citys.set('513300', '甘孜藏族自治州');
	   citys.set('513400', '凉山彝族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '520000', name: '贵州省', citys: citys});
	   citys.set('520100', '贵阳市');
	   citys.set('520200', '六盘水市');
	   citys.set('520300', '遵义市');
	   citys.set('520400', '安顺市');
	   citys.set('520500', '毕节市');
	   citys.set('520600', '铜仁市');
	   citys.set('522300', '黔西南布依族苗族自治州');
	   citys.set('522600', '黔东南苗族侗族自治州');
	   citys.set('522700', '黔南布依族苗族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '530000', name: '云南省', citys: citys});
	   citys.set('530100', '昆明市');
	   citys.set('530300', '曲靖市');
	   citys.set('530400', '玉溪市');
	   citys.set('530500', '保山市');
	   citys.set('530600', '昭通市');
	   citys.set('530700', '丽江市');
	   citys.set('530800', '普洱市');
	   citys.set('530900', '临沧市');
	   citys.set('532300', '楚雄彝族自治州');
	   citys.set('532500', '红河哈尼族彝族自治州');
	   citys.set('532600', '文山壮族苗族自治州');
	   citys.set('532800', '西双版纳傣族自治州');
	   citys.set('532900', '大理白族自治州');
	   citys.set('533100', '德宏傣族景颇族自治州');
	   citys.set('533300', '怒江傈僳族自治州');
	   citys.set('533400', '迪庆藏族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '540000', name: '西藏自治区', citys: citys});
	   citys.set('540100', '拉萨市');
	   citys.set('540200', '日喀则市');
	   citys.set('542100', '昌都地区');
	   citys.set('542200', '山南地区');
	   citys.set('542400', '那曲地区');
	   citys.set('542500', '阿里地区');
	   citys.set('542600', '林芝地区');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '610000', name: '陕西省', citys: citys});
	   citys.set('610100', '西安市');
	   citys.set('610200', '铜川市');
	   citys.set('610300', '宝鸡市');
	   citys.set('610400', '咸阳市');
	   citys.set('610500', '渭南市');
	   citys.set('610600', '延安市');
	   citys.set('610700', '汉中市');
	   citys.set('610800', '榆林市');
	   citys.set('610900', '安康市');
	   citys.set('611000', '商洛市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '620000', name: '甘肃省', citys: citys});
	   citys.set('620100', '兰州市');
	   citys.set('620200', '嘉峪关市');
	   citys.set('620300', '金昌市');
	   citys.set('620400', '白银市');
	   citys.set('620500', '天水市');
	   citys.set('620600', '武威市');
	   citys.set('620700', '张掖市');
	   citys.set('620800', '平凉市');
	   citys.set('620900', '酒泉市');
	   citys.set('621000', '庆阳市');
	   citys.set('621100', '定西市');
	   citys.set('621200', '陇南市');
	   citys.set('622900', '临夏回族自治州');
	   citys.set('623000', '甘南藏族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '630000', name: '青海省', citys: citys});
	   citys.set('630100', '西宁市');
	   citys.set('630200', '海东市');
	   citys.set('632200', '海北藏族自治州');
	   citys.set('632300', '黄南藏族自治州');
	   citys.set('632500', '海南藏族自治州');
	   citys.set('632600', '果洛藏族自治州');
	   citys.set('632700', '玉树藏族自治州');
	   citys.set('632800', '海西蒙古族藏族自治州');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '640000', name: '宁夏回族自治区', citys: citys});
	   citys.set('640100', '银川市');
	   citys.set('640200', '石嘴山市');
	   citys.set('640300', '吴忠市');
	   citys.set('640400', '固原市');
	   citys.set('640500', '中卫市');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '650000', name: '新疆维吾尔自治区', citys: citys});
	   citys.set('650100', '乌鲁木齐市');
	   citys.set('650200', '克拉玛依市');
	   citys.set('652100', '吐鲁番地区');
	   citys.set('652200', '哈密地区');
	   citys.set('652300', '昌吉回族自治州');
	   citys.set('652700', '博尔塔拉蒙古自治州');
	   citys.set('652800', '巴音郭楞蒙古自治州');
	   citys.set('652900', '阿克苏地区');
	   citys.set('653000', '克孜勒苏柯尔克孜自治州');
	   citys.set('653100', '喀什地区');
	   citys.set('653200', '和田地区');
	   citys.set('654000', '伊犁哈萨克自治州');
	   citys.set('654200', '塔城地区');
	   citys.set('654300', '阿勒泰地区');
	   citys.set('659000', '自治区直辖县级行政区划');

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '710000', name: '台湾省', citys: citys});

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '810000', name: '香港特别行政区', citys: citys});

	   citys = new ListMap('id', 'name');
	   this.Provinces.setItem({id: '820000', name: '澳门特别行政区', citys: citys});


}