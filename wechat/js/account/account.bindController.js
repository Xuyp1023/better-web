/*

@author binhg
*/

exports.installController = function(mainApp,common){

	mainApp.controller('account.bindController',['$scope','muiSupport','http','$rootScope','$route','cache',function($scope,muiSupport,http,$rootScope,$route,cache){
		/*私有属性区域*/
		//交易密码
		$scope.info = {
			password : ''
		};

		//验证交易密码
		$scope.checkPwd = function(){
			http.post(BTPATH.CHECK_FRISTLOGIN_TRADEPASS,{tradePassword:$scope.info.password}).success(function(data){
				if(common.isCurrentResponse(data)){
					window.location.href = '#/register/accountSuccess';
				}else{
					mui.alert('您输入的密码有误，请重新输入!','温馨提示!');
				}
			});
		};

		//切换密码栏可见
		$scope.toggleEye = function(model,attr){
			var name = model + '.' + attr,
				eyeAttr = attr + 'Eye';
			$scope[model][eyeAttr] = !$scope[model][eyeAttr];
			if(console) console.info($scope[model][eyeAttr]);
			var input = document.querySelector("[ng-model='"+ name +"']");
			input.type = $scope[model][eyeAttr] ? 'text' : 'password';
		};

		//改变文本框类型
		$rootScope.typeChange = function(target){
			target.type = 'password';
			$(target).unbind("focus");
		};


		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){

		});

	}]);

};
