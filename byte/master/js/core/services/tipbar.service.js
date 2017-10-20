/**=========================================================
 * tools提示的服务
 =========================================================*/
(function () {
	'use strict';

	angular
		.module('app.core')
		.service('BtTipbar', BtTipbar);

	BtTipbar.$inject = ['$timeout', '$document', '$q'];
	function BtTipbar($timeout, $document, $q) {

		// 全局的消息提示
		this.pop = function (type, title, body, timeout) {
			window.parent.pop(type, title, body, timeout);
		}

		// 按钮点击的警告
		this.tipbarWarning = function (element, msg, time) {
			if (!element) {
				return;
			}
			var tipbarElement = angular.element('<div class="tipbar-wrap">' + msg + '<div class="tipbar-wrap-arrow-left"></div></div>');
			angular.element(element).parent().append(tipbarElement);

			//设置绝对定位
			var left = element.getBoundingClientRect().left - tipbarElement[0].offsetWidth - 8;
			var top = element.getBoundingClientRect().top + document.body.scrollTop + ((element.offsetHeight - tipbarElement[0].offsetHeight) / 2);

			tipbarElement.css({ top: top + 'px', left: left + 'px' });

			var timeout = $timeout(function () {
				tipbarElement.remove();
				$document.off('click', removeTipbar);
			}, time || 3000);

			$timeout(function () {
				$document.on('click', removeTipbar);
			}, 1);

			function removeTipbar() {
				$timeout.cancel(timeout);
				tipbarElement.remove();
				$document.off('click', removeTipbar);
			}
		}

		// 弹出框确认
		this.tipbarDialog = function (element, msg, remark) {
			if (!element || element.getAttribute("bt-dialog") == 'true') {
				return $q.reject();
			} else {
				element.setAttribute("bt-dialog", true);
			}
			var defer = $q.defer();
			var tipbarElement = angular.element('<div class="bt-dialog"><div class="bt-dialog-arrow"></div><div class="bt-dialog-content">' +
				'<span class="bt-dialog-icon"></span>' + msg + '</div>' +
				(!remark ? '' : '<div class="bt-dialog-remark"><span>' + remark + '</span></div>') +
				'<div class="bt-dialog-button"><button class="bt-btn bt-small dialog-cancle">取消</button><button class="bt-btn bt-btn-info dialog-confirm">确认</button></div></div>');
			angular.element(element).parent().append(tipbarElement);

			//设置绝对定位
			var left = element.getBoundingClientRect().left + element.offsetWidth - tipbarElement[0].offsetWidth + 20;
			var top = element.getBoundingClientRect().top + document.body.scrollTop - tipbarElement[0].offsetHeight - 20;

			tipbarElement.css({ top: top + 'px', left: left + 'px' });

			tipbarElement
				.on('click', function (event) {
					if (angular.element(event.target).hasClass('dialog-confirm')) {
						tipbarElement.remove();
						element.setAttribute("bt-dialog", false);
						defer.resolve();
					} else if (angular.element(event.target).hasClass('dialog-cancle')) {
						tipbarElement.remove();
						element.setAttribute("bt-dialog", false);

						defer.reject();
					}
				});

			return defer.promise;
		};

	}
})();