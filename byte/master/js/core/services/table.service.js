(function () {
  'use strict';

  angular
    .module('app.core')
    .service('TableService', TableService);

  TableService.$inject = ['BtUtilService', '$templateCache', '$compile', '$filter'];
  function TableService(BtUtilService, $templateCache, $compile, $filter) {

    //设置table的行数据
    this.setRowData = setRowData;

    //查询列表数据
    this.searchRowData = function (tableParams, tmpPageElement, templateBody, headCheck) {

      var toggleSpin = tableParams.toggleSpin ? BtUtilService.addSpin(tmpPageElement.parent()) : undefined;

      BtUtilService.post(tableParams.searchUrl, angular.extend({}, tableParams.queryVo, { pageNum: tableParams.pageNum, pageSize: tableParams.pageSize }))
        .then(function (jsonData) {

          if (jsonData.code === 200) {

            //设置分页查询的参数
            tableParams.totalCount = jsonData.page.total;
            tableParams.pageSize = jsonData.page.pageSize;

            //更新分页按钮视图
            updatePagerElement(tableParams, tmpPageElement);

            //更新表体部分
            tableParams.rowData = jsonData.data;
            setRowData(tableParams, templateBody, headCheck);

            BtUtilService.freshIframe();

          }

          BtUtilService.removeSpin(toggleSpin);

        }, function () {
          BtUtilService.removeSpin(toggleSpin);
        });
    }

    //原生的分页组件
    this.searchPageData = function (tableParams, tmpPageElement, templateBody, headCheck) {

      BtUtilService.post(tableParams.searchUrl, angular.extend({}, tableParams.queryVo, { pageNum: tableParams.pageNum, pageSize: tableParams.pageSize }))
        .then(function (jsonData) {

          if (jsonData.code === 200) {

            //设置分页查询的参数
            tableParams.totalCount = jsonData.page.total;
            tableParams.pageSize = jsonData.page.pageSize;

            //更新分页按钮视图
            updatePagerElement(tableParams, tmpPageElement);

            //更新表体部分
            tableParams.rowData = jsonData.data;

            BtUtilService.freshIframe();

          }
        }, function () {
        });
    }

    function setRowData(tableParams, tbodyElement, headCheck) {

      if (tableParams.rowData.length === 0) {
        tbodyElement.empty();
        return false;
      }

      var tmpElementStr = '';

      var tmpTdElement = tableParams.tmpTdElement;
      var btIndex = -1;
      angular.forEach(tableParams.rowData, function (row) {
        btIndex++;
        var rowElement = tmpTdElement;
        if (row.colspan == 'all') { //自定义行数据
          rowElement = '<td colspan="' + tableParams.cols.length + '">' + template.compile(tableParams.colspan.all)(row) + '</td>';
        } else {
          var btColspan = -1;
          var temColspan = null;
          angular.forEach(tableParams.cols, function (col) {
            btColspan++;
            var tmpField = undefined;

            if (row.colspan) {
              temColspan = temColspan || tableParams.colspan[row.colspan];
              if (btColspan >= temColspan.startIndex && btColspan < temColspan.endIndex) {
                return;
              } else if (btColspan == temColspan.endIndex) {
                rowElement += '<td class="bt-align-center" colspan="' + (temColspan.endIndex - temColspan.startIndex + 1) + '">'
                  + template.compile(temColspan.html)(row) + '</td>';
                temColspan = null;
                return;
              }
            }

            switch (col.type) {
              case 'template': //自定义模板
                var render = template.compile(col.cellTemplate);
                var html = render(row);
                tmpField = html;
                break;
              case 'buttons':
                tmpField = [];
                angular.forEach(col.config, function (item) {
                  if (!item.show || eval(item.show)) {
                    var event = '';
                    if (item.event) {
                      event = ' ng-click="' + item.event + '(' + tableParams.tableName + '.rowData[' + btIndex + '],$event)"';
                    }
                    tmpField.push('<a class="bt-table-button"' + event + '>' + item.title + '</a>');
                  }
                });
                tmpField = tmpField.join('<div class="bt-table-hr"></div>');
                break;
              default:
                tmpField = eval('row.' + col.field) || '';
                break;
            }

            switch (col.filter) {
              case 'money':
                tmpField = $filter('currency')(tmpField, '');
                rowElement += '<td class="bt-align-right">' + tmpField + '</td>';
                break;
              case 'status':
                rowElement += '<td>' + getStatusHtml(tmpField) + '</td>';
                break;
              case 'custom':
                rowElement += '<td>' + col.getStatusHtml(tmpField) + '</td>';
                break;
              default:
                rowElement += '<td>' + tmpField + '</td>';
                break;
            }
          });
        }
        tmpElementStr += '<tr>' + rowElement + '</tr>';
      });
      var tbodyTmp = angular.element(tmpElementStr);
      tbodyElement.empty();
      tbodyElement.append(tbodyTmp);
      if (tableParams.parentScope) $compile(tbodyTmp)(tableParams.parentScope);

      // 子复选框的事件
      if (tableParams.rowSelection) {
        var trList = tbodyElement[0].getElementsByTagName("tr");
        for (var i = trList.length - 1; i >= 0; i--) {
          var checkbox = trList[i].firstChild.firstChild;
          angular
            .element(checkbox)
            .on('click', function ($event) {
              if (!$event.target.checked && headCheck.checked) {
                headCheck.checked = false;
              }
            });

          if (angular.isFunction(tableParams.rowIsOnOrOff) && tableParams.rowIsOnOrOff(tableParams.rowData[i])) {
            checkbox.checked = true;
          }
        }



      }
    }

    // 获取状态的html代码
    function getStatusHtml(status) {
      var rowElement = '';
      switch (status) {
        case '1':
          rowElement += '<span class="bt-table-status info"></span>已生效';
          break;
        case '2':
          rowElement += '<span class="bt-table-status error"></span>已生效2';
          break;
        case '3':
          rowElement += '<span class="bt-table-status warning"></span>已生效3';
          break;
        case '4':
          rowElement += '<span class="bt-table-status default"></span>已生效4';
          break;
        case '5':
          rowElement += '<span class="bt-table-status success"></span>已生效5';
          break;
      }
      return rowElement;
    }

    //更新分页按钮视图
    function updatePagerElement(tableParams, tmpPageElement) {
      var render = template.compile($templateCache.get('bulmaui-table/pager.html'));
      var config = {
        totalPages: Math.ceil(tableParams.totalCount / tableParams.pageSize),
        currentPage: tableParams.pageNum,
        listPages: []
      }

      if (config.totalPages < 6) {
        for (var i = 1; i <= config.totalPages; i++) {
          config.listPages.push(getPageHtmlByIndex(i, config.currentPage));
        }
      } else {
        config.listPages.push(getPageHtmlByIndex(1, config.currentPage));
        if (config.currentPage - 2 > 1) {
          config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
        }
        var middlePage = config.currentPage - 2 > 1 ? (config.currentPage + 2 < config.totalPages ? config.currentPage : config.totalPages - 2) : 1 + 2;
        config.listPages.push(getPageHtmlByIndex(middlePage - 1, config.currentPage));
        config.listPages.push(getPageHtmlByIndex(middlePage, config.currentPage));
        config.listPages.push(getPageHtmlByIndex(middlePage + 1, config.currentPage));
        if (config.currentPage + 2 < config.totalPages) {
          config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
        }
        config.listPages.push(getPageHtmlByIndex(config.totalPages, config.currentPage));
      }

      var html = render(config);
      tmpPageElement[0].innerHTML = html;
    }

    function getPageHtmlByIndex(index, currentIndex) {
      var is_current = (index == currentIndex) ? 'active' : '';
      return '<button class="bt-btn bt-small pagination-link ' + is_current + '">' + index + '</button>';
    }

  }
})();