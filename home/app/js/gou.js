(function(){
  var _isTest = (location.href.indexOf('localhost') == -1 && location.href.indexOf('static') == -1) ? false: true;
  var baseUrl = _isTest ? '': '..';

  window._baseUrl = baseUrl;
  window._isTest = _isTest; // 将post转化成get，因为没有nginx

  window.BTServerPath = {
    UserAuthor: baseUrl + (_isTest ? 'server/http/test/authorAll.json' :'')
  }

  // 获取用户权限
  if(window.parent && window.parent.UserAuthor){
    window._userAuthor = window.parent.UserAuthor;
  }else{
    $.getJSON(window.BTServerPath.UserAuthor,function(jsonData){
      if(jsonData.code == 200){
        window._userAuthor = window.parent.UserAuthor = jsonData.data;
      }
    });
  }
  
})();