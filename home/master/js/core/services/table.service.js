(function() {
    'use strict';

    angular
        .module('app.core')
        .service('TableService', TableService);

    TableService.$inject = ['BtUtil' ,'$templateCache','$compile','$filter'];
    function TableService(BtUtil ,$templateCache,$compile,$filter) {

      //查询列表数据
      this.searchRowData = function(tableParams ,tmpPageElement ,templateBody,headCheck){

        BtUtil.post(tableParams.searchUrl,angular.extend({},tableParams.queryVo,{pageNum:tableParams.pageNum,pageSize:tableParams.pageSize}))
          .then(function(jsonData){

            //设置分页查询的参数
            tableParams.totalCount = jsonData.page.totalCount;
            tableParams.pageSize = jsonData.page.pageSize;

            //更新表体部分
            tableParams.rowData = jsonData.data;

            //更新分页按钮视图
            updatePagerElement(tableParams ,tmpPageElement);

          },function(){
          });
      }

      //更新分页按钮视图
      function updatePagerElement(tableParams ,tmpPageElement){
        var render = template.compile($templateCache.get('gou/pager.html'));
        var config = {
          totalPages: Math.ceil( tableParams.totalCount / tableParams.pageSize ),
          currentPage: tableParams.pageNum,
          listPages:[]
        }

        if(config.totalPages < 6){
          for(var i=1;i<=config.totalPages;i++){
            config.listPages.push(getPageHtmlByIndex(i,config.currentPage));
          }
        }else {
          config.listPages.push(getPageHtmlByIndex(1,config.currentPage));
          if(config.currentPage -2 > 1){
            config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
          }
          var middlePage = config.currentPage - 2 > 1 ? (config.currentPage + 2 < config.totalPages ? config.currentPage:config.totalPages-2):1+2;
          config.listPages.push(getPageHtmlByIndex(middlePage-1,config.currentPage));
          config.listPages.push(getPageHtmlByIndex(middlePage,config.currentPage));
          config.listPages.push(getPageHtmlByIndex(middlePage+1,config.currentPage));
          if(config.currentPage +2 < config.totalPages){
            config.listPages.push('<span class="bt-ellipsis pagination-ellipsis"></span>');
          }
          config.listPages.push(getPageHtmlByIndex(config.totalPages,config.currentPage));
        }

        var html = render(config);  
        tmpPageElement[0].innerHTML = html;
      }

      function getPageHtmlByIndex(index,currentIndex){
        var is_current = (index==currentIndex)?'active':'';
        return '<button class="bt-btn bt-small pagination-link '+ is_current +'">'+ index +'</button>';
      }

    }
})();