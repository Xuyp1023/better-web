/**=========================================================
 * 数字转中文大写的过滤器
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('btnumber', btnumber)
    .filter('btmoeny', btmoeny);

  // 235500001.11  235,500,001.11元
  btnumber.$inject = ['$sce', '$filter'];
  function btnumber($sce, $filter) {
    return function (data, props) {
      if (!data) return '';
      var dataStr = $filter('number')(data, 2).split('.');
      var textHtml = '<big><b>' + dataStr[0] + '.</b></big><small>' + dataStr[1] + '元</small>';
      return $sce.trustAsHtml(textHtml);
    };
  }

  btmoeny.$inject = ['$filter'];
  function btmoeny($filter) {
    return function (data, props) {
      if (!data) return '';
      var dataStr = $filter('number')(data, 2).split('.');
      var numMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      var weightMap = ['圆', '万', '亿', '万'];
      var result = '';

      //角、分
      var pinyS = dataStr[1].split('');
      if (pinyS[0] != 0) {
        result = result + numMap[pinyS[0]] + '角';
      }
      if (pinyS[1] != 0) {
        result = result + numMap[pinyS[1]] + '分';
      }
      //圆
      var yuanstr = data.toString().split('.')[0];
      if (yuanstr == '0') {
        return result || '零圆'; // 0元
      }

      var tempResult = getAllValue(yuanstr.split(''));
      return tempResult;

      function getAllValue(yuans) {
        var result = '';
        for (var i = yuans.length - 1; i >= 0; i--) {

          var yuansWeight = '';
          switch ((yuans.length - 1 - i) % 4) {
            case 0:
              yuansWeight = weightMap[(yuans.length - 1 - i) / 4];
              if(yuans[i] !=0 ){
                yuansWeight = numMap[yuans[i]] +yuansWeight;
              }
              break;
            case 1:
              if(yuans[i] !=0){
                yuansWeight = numMap[yuans[i]] +'拾';
              }else if(yuans[i-1] != 0 && yuans[i+1] != 0){
                yuansWeight = '零';
              }
              break;
            case 2:
              if(yuans[i] !=0){
                yuansWeight = numMap[yuans[i]] +'佰';
              }else if(yuans[i-1] !=0 && (yuans[i+1] != 0 || yuans[i+1] != 0)){
                yuansWeight = '零';
              }
              break;
            case 3:
              if(yuans[i] !=0){
                yuansWeight = numMap[yuans[i]] +'仟';
              }else if(yuans[i+1] !=0 || yuans[i+2] != 0 || yuans[i+3] != 0){
                yuansWeight = '零';
              }
              break;
          }
          result = yuansWeight + result;
        }
        return result;
      }
    };
  }

})();