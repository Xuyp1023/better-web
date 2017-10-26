/**=========================================================
 * 常见的过滤器
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.filter('downf', function () {
			return function (data) {
				return '../Platform/CustFile/fileDownload?id=' + data;
			};
		})
		.filter('datef', function () {
			return function (data) {
				if (!data) return '----';
				data += '';
				var newDate = '';
				newDate += (data.substr(0, 4) + '-' + data.substr(4, 2) + '-' + data.substr(6));
				return newDate;
			};
		})
		.filter('percentf', function () {
			return function (data) {
				if(data+''==='0'||data+''==='') return '----';
				return data+'%';
			};
		})
		.filter('point4f', function () {
			return function (data) {
				return Number(data).toFixed(4);
			};
		})
		.filter('kindf', function () {
			return function (data,pros) {

				if(!window.BTDict) return data;
				var result = BTDict[pros].get(data + '');
				return result;
			};
		});
})();