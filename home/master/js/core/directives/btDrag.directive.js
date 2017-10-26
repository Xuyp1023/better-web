/**=========================================================
 * 拖动的指令
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('btDrag', btDrag);

  btDrag.$inject = ['$parse', '$document', '$timeout'];
  function btDrag($parse, $document, $timeout) {

    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link(scope, element, attrs, controller) {

      var dragElm = element;
      var startX = 0, startY = 0;
      var startDrag=false;
      var maxLeft =0,maxTop =0;
      element.css({
        cursor: 'move'
      });

      //查找要拖拽的内容
      for (var i = 0; i < 6; i++) {//最高找上面6级
        if (dragElm.hasClass("bt-modal-content")) {
          break;
        }
        dragElm = dragElm.parent();
      }

      setTimeout(function(){
        dragElm.css({
            top:dragElm[0].offsetTop + 'px',
            left:dragElm[0].offsetLeft + 'px',
            bottom:undefined,right:undefined,margin:0
        });
        maxLeft = document.body.clientWidth-dragElm[0].offsetWidth;
        maxTop = (dragElm.parent()[0].firstElementChild || dragElm.parent()[0].firstChild).offsetHeight-dragElm[0].offsetHeight;
      },100);

      element.on('mousedown', function (event) {
        startX = event.clientX-dragElm[0].offsetLeft;
        startY = event.clientY-dragElm[0].offsetTop;
        event.preventDefault();
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
        startDrag=true;
      });

      function mouseup() {
        startDrag=false;
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }

      function mousemove(event) {
        if (startDrag) {

          var tmpX = event.clientX-startX;
          tmpX = tmpX >0 ? (tmpX<maxLeft  ? tmpX: maxLeft):0;
          var tmpY = event.clientY-startY;
          tmpY = tmpY >0 ? (tmpY<maxTop  ? tmpY: maxTop):0;

          angular.element(dragElm).css({
              left:tmpX + 'px',
              top:tmpY + 'px'
          });
          // //Disable element/text selection.
          window.getSelection().removeAllRanges();
        }
      }
    }
  }
})();
