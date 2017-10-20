/**=========================================================
 * 时间选择的指令
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('btPager', btPager);

  btPager.$inject = ['$parse', 'TableService', '$timeout'];
  function btPager($parse, TableService, $timeout) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var tableParams = $parse(attrs.btPager)(scope);
        if (!tableParams) return;

        element.on('click', function (e) {
          //分页查询按钮点击事件
          if (e.target.nodeName == 'BUTTON') {
            var aElement = angular.element(e.target);

            var tmpPageNum = tableParams.pageNum;
            if (aElement.hasClass('pagination-link')) {//具体的分页数
              tmpPageNum = parseInt(aElement.text());
            } else if (aElement.hasClass('pagination-previous')) {//上一页
              tmpPageNum--;
            } else if (aElement.hasClass('pagination-next')) {//下一页
              tmpPageNum++;
            }
            if (tmpPageNum != tableParams.pageNum) {
              tableParams.pageNum = tmpPageNum;
              TableService.searchPageData(tableParams, element);
            }
          }
        });

        tableParams.setDatasource = function (params) {

          tableParams.pageNum = tableParams.initPageNum || 1;
          tableParams.pageSize = tableParams.initPageSize || 10;

          tableParams.queryVo = params.queryVo;
          tableParams.searchUrl = params.searchUrl;

          TableService.searchPageData(tableParams, element);
        }

        if (tableParams.initOver) {
          tableParams.initOver();
        }

      }
    };
  }
})();