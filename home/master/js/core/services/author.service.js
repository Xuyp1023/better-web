/**=========================================================
 * 服务-core-权限控制
 =========================================================*/
 (function () {
  'use strict';

  angular
    .module('app.core')
    .service('Author', Author);

  Author.$inject = ['$timeout'];
  function Author($timeout) {

    var userAuthor = window._userAuthor;

    /**
     * 检查权限
     */
    this.checkAuthor = function(domTree, options){

      var btns = domTree.find('[bt-author]');
      $.each(btns,function(index, item){
        var value = item.getAttribute('bt-author');
        var keys = value.split('-');
        var obj = userAuthor[keys[0]];
        if(obj && obj[keys[1]]){
        }else{
          item.remove();
        }
      });
    };

  }
})();