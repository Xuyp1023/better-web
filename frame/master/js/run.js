(function () {
  'use strict';

  angular
    .module('app.frame')
    .run(frameRun);

  frameRun.$inject = ['$timeout'];
  function frameRun($timeout) {

    // 暴露给内容区的消息提示方法
    window.pop = function (type, title, body, timeout) {

      var popStr = '<div class="bt-pop bt-pop-' + (type || 'info') + '"><span class="bt-pop-close"></span><div class="bt-pop-title">' +
        '<span class="bt-pop-icon icon"></span>' + (title || '') +
        '</div><div class="bt-pop-content"><span>' + (body || '') + '</span></div></div>';
      var popEle = angular.element(popStr);

      angular.element(document.body).append(popEle);
      var timeRemove = $timeout(function () {
        popEle.remove();
      }, timeout || 3000);
      popEle
        .on('click', function (event) {
          if (angular.element(event.target).hasClass('bt-pop-close')) {
            $timeout.cancel(timeRemove);
            // 点击按钮移除消息提示
            popEle.remove();
          }

        });
      popEle
        .on('mouseout', function (event) {
          timeRemove = $timeout(function () {
            popEle.remove();
          }, timeout || 3000);
        });
      popEle
        .on('mouseover', function (event) {
          $timeout.cancel(timeRemove);
        });
    }
  }
})();