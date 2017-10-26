(function () {
	// 字典表的工具类
	function ListMap(argument) {

		var codeList = [];

		this.find = function (vKey) {
			for (var i = 0; i < codeList.length; i++) {
				if (codeList[i].key == vKey)
					return i;
			}
			return -1;
		};

		this.get = function (vKey, vDefaultValue) {
			if ((!vKey) && (vKey != "")) return vDefaultValue;

			var i = this.find(vKey);
			return i >= 0 ? codeList[i].value : vDefaultValue;
		};

		this.getItem = function (vKey) {

			var i = this.find(vKey);
			return i >= 0 ? codeList[i] : undefined;
		};

		this.set = function (key, value) {
			codeList.push({ key: key, value: value });
		}

		this.setItem = function (obj) {
			codeList.push(obj);
		}

		this.toArray = function (keyName, valueName) {

			if (keyName && !codeList[0].key) {
				angular.forEach(codeList, function (row) {
					row.key = row[keyName];
					row.value = row[valueName];
				})
			}
			return codeList;
		}
	}
	window.ListMap = ListMap;
})();
