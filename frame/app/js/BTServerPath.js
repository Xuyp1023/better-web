(function () {
  'use strict';

  var _isTest = location.href.indexOf('static') == -1 ? false: true;
  var baseUrl = _isTest ? '': '..';

  window._isTest = _isTest; // 将post转化成get，因为没有nginx

  window.BTServerPath = {
    UserInfo: baseUrl + (_isTest ? 'server/http/frame/user-info.json' :''),
    Query_Company_List: baseUrl + (_isTest ? 'server/http/frame/company-list.json' :''),
    Notify_Msg: baseUrl + (_isTest ? 'server/http/frame/notify-msg.json' :''),
    logout: baseUrl + (_isTest ? '/logout' :'')
  }

  window.logout_htnm = '../p/pages/login.html';

  window.menuConfig = {
    menuid: 6,
    sidebarMenuUrl:[
      ["server/menus/sidebar-wechat.json","home1.html#/welcome"],
      ["server/menus/sidebar-scf.json","home.html#/welcome"],
      ["server/menus/sidebar-basic.json","welcome3"],
      ["server/menus/sidebar-finance.json","home1.html#/welcome"],
      ["server/menus/sidebar-menu5.json","welcome"],
      ["server/menus/sidebar-demo.json","welcome"]
    ],
    siberbarRealUrl: baseUrl + "/Platform/CustOperator/findSysMenuByMenuId"
  }

})();