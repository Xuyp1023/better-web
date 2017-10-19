var core_hasOwn = Object.prototype.hasOwnProperty,
    core_toString = Object.prototype.toString;
var class2type = {};
var typeList = "Boolean Number String Function Array Date RegExp Object".split(" ");
for (var i = 0; i < typeList.length; i++) {
    var __tempType = typeList[i];
    class2type[ "[object " + __tempType + "]" ] = __tempType.toLowerCase();
}
var dicQuery = {
    type: function( obj ) {
        return obj == null ?
            String( obj ) :
            class2type[ core_toString.call(obj) ] || "object";
    },
    isFunction: function( obj ) {
        return dicQuery.type(obj) === "function";
    },
    isArray: Array.isArray || function( obj ) {
        return dicQuery.type(obj) === "array";
    },
    isWindow: function( obj ) {
        return obj != null && obj == obj.window;
    },
    isPlainObject: function( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || dicQuery.type(obj) !== "object" || obj.nodeType || dicQuery.isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for ( key in obj ) {}

        return key === undefined || core_hasOwn.call( obj, key );
    },
};
dicQuery.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !dicQuery.isFunction(target) ) {
        target = {};
    }

    // extend dicQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( dicQuery.isPlainObject(copy) || (copyIsArray = dicQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && dicQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && dicQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = dicQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

var KGF = {};
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
function ListMap() {
    var sKeyName = "key";        // 索引属性名称
    var sValueName = "value";    // 默认值属性名称
    var oParent = {};            // 数据项MapItem.prototype的值（数据项对象的父类）
    var aoMap = [];              // 存放数据项对象的数组

    // 根据入参构建数据项对象的父类（合并所有数据对象的属性到父类中）
    var iBegin = null;
    var iArgLen = arguments.length;
    if (dicQuery.type(arguments[0]) == "string") {
        sKeyName = arguments[0];
        if (dicQuery.type(arguments[1]) == "string") {
            if (iArgLen > 0) {
                sValueName = arguments[1];
                iBegin = 2;
            } else
                iBegin = 1;
        }
        for (var i = iBegin; i < iArgLen; i++) {
            if (dicQuery.type(arguments[i]) == "object")
                dicQuery.extend(oParent, arguments[i]);
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
    dicQuery.extend(oParent, o);

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

    /*
	转换为Array对象
    */
    this.toArray =  function(keyName,valueName){
    	var json = this.toJSON();
    	var targetArray = [];
    	for(var index in json){
    		var temp = {};
    		temp[keyName] = index;
    		temp[valueName] = json[index];
    		targetArray.push(temp);
    	}
    	return targetArray;
    };
}

window.ListMap = ListMap;