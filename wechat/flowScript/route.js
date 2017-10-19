/*
整体项目的路由导航
@author binhg
*/

exports.installRoute = function(mainApp){
	mainApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider.when('/home',{
			templateUrl: 'views/home/home.html',
			controller: 'homeController',
			title:'企e金服供应链金融'
		})
		//demo
		.when('/bill',{
		 	templateUrl: 'views/bill/bill.html',
		 	controller: 'billController',
		 	title:'企e金服票据池'
		})

		/**
		*流程相关路由
		**/
		//待办流程列表
		.when('/flow/todoList',{
			templateUrl: 'views/flow/todoFlow.html',
			controller: 'todoFlowController',
			title:'待办任务列表'
		})
		//已办流程列表
		.when('/flow/didList',{
			templateUrl: 'views/flow/didFlow.html',
			controller: 'didFlowController',
			title:'已办任务列表'
		})
		//流程审批记录
		.when('/flow/flowRecord',{
			templateUrl: 'views/flow/flowRecord.html',
			controller: 'flowRecordController',
			title:'审批历史记录'
		})

		.when('/finance/detail',{
		 	templateUrl: 'views/financeFlow/financeDetail.html',
		 	controller: 'flow.financeDetailController',
		 	title:'融资详情'
		})

		.when('/finance/audit',{
		 	templateUrl: 'views/financeFlow/financeAudit.html',
		 	controller: 'flow.financeAuditController',
		 	title:'融资审批'
		})
	


		//容错路径
		.otherwise({
			redirectTo:'/home'
		});


	}]);
};
