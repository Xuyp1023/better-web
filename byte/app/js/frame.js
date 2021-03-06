/**=========================================================
 * frame.js
 =========================================================*/
(function(){
	'use strict';

	angular.module('app.frame',[]);

  angular
        .module('app.frame')
        .run(frameRun);

  frameRun.$inject = ['$timeout'];
  function frameRun($timeout) {   

    window.dialog = function(msg){
      var dialogStr = '<div class="bt-dialog"><div class="bt-dialog-background"></div><div class="bt-pop bt-pop-warning"><span class="bt-pop-close"></span><div class="bt-pop-title">'+
        '<span class="bt-pop-icon icon"></span>提示信息'+
        '</div><div class="bt-pop-content"><span>'+ (msg|| '') +'</span></div>'+
        '<div class="bt-dialog-button"><button autofocus="autofocus" class="dialog-confirm">重新登录</button></div></div></div>';
      var dialogEle = angular.element(dialogStr);

      angular.element(document.body).append(dialogEle);
      angular.element(dialogEle.find('span')[0])
      .on('click',function(event){
        // 点击按钮移除消息提示
        dialogEle.remove();
      });
      angular.element(dialogEle.find('button')[0])
      .on('click',function(event){
        // 点击按钮移除消息提示
        location.href = '../p/pages/login.html';
      });
    }

    // 暴露给内容区的消息提示方法
    window.pop = function(type, title, body, timeout){

      var popStr = '<div class="bt-pop bt-pop-'+(type || 'info')+'"><span class="bt-pop-close"></span><div class="bt-pop-title">'+
                    '<span class="bt-pop-icon icon"></span>'+(title || '')+
                    '</div><div class="bt-pop-content"><span>'+ (body|| '') +'</span></div></div>';
      var popEle = angular.element(popStr);
      
      angular.element(document.body).append(popEle);
      var timeRemove = $timeout(function(){
        popEle.remove();
      },timeout || 3000);
      popEle
        .on('click',function(event){
          if(angular.element(event.target).hasClass('bt-pop-close')){
            $timeout.cancel(timeRemove);
            // 点击按钮移除消息提示
            popEle.remove();
          }
          
      });
      popEle
        .on('mouseout',function(event){
          timeRemove = $timeout(function(){
            popEle.remove();
          },timeout || 3000);
        });
      popEle
        .on('mouseover',function(event){
          $timeout.cancel(timeRemove);
        });
    }

  }

  angular
    .module('app.frame')
    .config(frameConfig);

  frameConfig.$inject = ['$httpProvider'];
  function frameConfig($httpProvider){
    $httpProvider.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};
    $httpProvider.defaults.transformRequest = function(obj){    // 只有post方法要用到这个
        var str = [];
        for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }
  }

  angular
    .module('app.frame')
    .controller('HeaderController',HeaderController);

  HeaderController.$inject = ['$scope', 'BtUtilService',"$rootScope",'$timeout','$interval'];
  function HeaderController($scope, BtUtilService,$rootScope,$timeout,$interval) {

    activate();

    var BTServerPath = {
      UserInfo : ['server/http/frame/user-info.json'],
      Query_Company_List:["server/btDict/qh/commission/company-list.json","/Platform/BaseInfo/queryCustSelect"],
      Notify_Msg:['server/http/frame/notify-msg.json']
    };
    

    // 初始化用户信息
    BtUtilService
      .post(BTServerPath.UserInfo)
      .then(function(jsonData){
        $scope.userInfo = jsonData;
      });

    // 初始化公司信息
    BtUtilService
      .post(BTServerPath.Query_Company_List)
      .then(function(jsonData){
        $scope.companyList = jsonData.data;
        $scope.companyInfo = jsonData.data[0];
      });

    // 初始化菜单信息
    BtUtilService
      .post(['server/config/frame.json'])
      .then(function(jsonData){
        BTServerPath.sidebarMenuUrl = jsonData.sidebarMenuUrl;
        BTServerPath.siberbarRealUrl = jsonData.siberbarRealUrl;
        notifyMenu(jsonData.menuid,true);
      });

    // 定时获取消息
    getMsgNotify();
    $interval(getMsgNotify,1000*60*20); // 20分钟一次

    function activate() {
      // 退出登录
      $scope.logout = function(){
        // 弹出框确认

        // 请求后台
        BtUtilService
        .post('/logout')
        .then(function(jsonData){
          if(data.code === 401){
           window.location.href = '../p/pages/login.html';
          }
        },function(errorMsg){

        });
      };
      // 查看用户信息
      $scope.lookUserInfo = function(){
        
      };
      // 查看消息通知
      $scope.lookMsg = function(){
        // 定时任务获取
      };
      // 查看公司信息
      $scope.lookComList = function(){
        // 弹出框显示即可
      };
      // 切换二级菜单
      $scope.switchMenu = function(menuid){
        notifyMenu(menuid);
      };
    }

    // 定时获取消息
    function getMsgNotify(){
      BtUtilService
        .post(BTServerPath.Notify_Msg)
        .then(function(jsonData){
          $scope.msgInfo = jsonData;
        });
    }

    // 通知二级菜单切换
    function notifyMenu(menuid,flag){
      $scope.menuid = menuid;
      var menuObj = {menuid:menuid,sidebarMenuUrl:[BTServerPath.sidebarMenuUrl[menuid-1][0],BTServerPath.siberbarRealUrl],
        welcome:BTServerPath.sidebarMenuUrl[menuid-1][1],flag:flag}
      $rootScope.$broadcast('notifyMenu',menuObj);
    }

  }


	angular
		.module('app.frame')
		.controller('SidebarController',SidebarController);

	SidebarController.$inject = ['$scope', 'BtUtilService','$location'];
  function SidebarController($scope, BtUtilService,$location) {

  	activate();

  	function activate() {

      // 开启监听
      $scope.$on('notifyMenu', function(event,options) {

        BtUtilService
          .post(options.sidebarMenuUrl,{menuId:options.menuid})
          .then(function(jsondata){
            $scope.menuItems = jsondata;
            if(!options.flag){
              forwardView({url:options.welcome});
            }
          });
      });
  		
  		$scope.activeMenu = {};

  		$scope.mianMenuC = function(item){
  			
  			if(item.children){
          if($scope.activeMenu.openItem === item.$$hashKey){
            $scope.activeMenu.openItem = undefined;
          }else {
            $scope.activeMenu.openItem = item.$$hashKey;
          }
  			}else {
          $scope.activeMenu.openItem = undefined;
  				$scope.activeMenu.activeItem = item.$$hashKey;
  				$scope.activeMenu.activeSubItem = undefined;
  				forwardView(item);
  			}
  		};

  		$scope.subMenuC = function(subItem, item){
  			$scope.activeMenu.activeItem = item.$$hashKey;
				$scope.activeMenu.activeSubItem = subItem.$$hashKey;
  			forwardView(subItem);
  		};

  		$scope.getMenuItemPropClasses = function(item){
  			if(item.heading){
  				return 'nav-heading';
  			}else {
  				return ($scope.activeMenu.activeItem===item.$$hashKey ? ' active' : '');
  			}
  		}

  		//页面跳转
  		function forwardView(item){
        var iframes = angular.element(document)
          .find("iframe");
        var url = item.url,hash='';
        if(url.indexOf('#')!== -1){
          hash = url.split('#')[1];
          url = url.split('#')[0];
        }
  			iframes[0].src = url + '?bt_v=' + (new Date().getTime()) + '#' + hash;
  		}

  	}

  }

  angular
    .module('app.frame')
    .service('BtUtilService', BtUtilService);

  BtUtilService.$inject = ['$http', '$location', '$q', '$cacheFactory','$log','$timeout','$rootScope'];
  function BtUtilService($http, $location, $q, $cacheFactory,$log,$timeout,$rootScope) {
    var indexNum = ($location.host() ===  'localhost' || $location.host().indexOf('static') === 0 || $location.host().indexOf('chenlq') === 0) ? 0:1;
    var urlCache = {};
    //post方法
    this.post = function(url,params){

        if(indexNum == 0){
            return this.get(url,params);
        }

        // 一分钟之内只能请求一次
        if(urlCache[url] && new Date().getTime() - urlCache[url] < 1000 * 60 ){
            return $q.reject(
            {
                status:515,
                data:'1分钟之类不允许重复提交'
            });
        }else{
            urlCache[url] = new Date().getTime();
        }
        
        return $http.post(getUrl(url),params)
            .then(function(response){

                delete urlCache[url];
                return response.data;
            },function(error){
                delete urlCache[url];
                return $q.reject(error);
            });
    };
    /**
    get方法
    url:路径地址
    params:路径参数
    cache:缓存
    */
    this.get = function(url,params){
      var config = {params:params};
      return $http.get(getUrl(url),config)
          .then(function(response){

              return response.data;
          },function(error){

              return $q.reject(error);
          });
    };

    function getUrl(url) {
      var tmpUrl;
      if(angular.isArray(url)){
          tmpUrl = url[indexNum] || '/byte/'+url[0];
      }else{
          tmpUrl = url;
      }
      return ['','..'][indexNum] + tmpUrl;
    }
  }

	angular.element(document).ready(function (){
		//初始化项目
	  angular.bootstrap(document, ['app.frame']);
	});

})();