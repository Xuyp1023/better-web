/*
测试使用模块 
作者:bhg
*/
define(function(require,exports,module){
	require('angular');
	angular.module('testModule',[])
	//兼容IE模式
	.config(function($sceProvider){
		$sceProvider.enabled(false);
	})
	//控制器区域
	.controller('testController',function($scope){
		//VM绑定区域
		$scope.test={
			testName : '张三',
			testAge : 19
		};
		//事件处理区域
		$scope.changeData = function(){
				$scope.test.testName = '李四';
		};
		$scope.printPdf = function(){
			var srcFile ='https://test.qiejf.com/better/开户和交易测试完整操作流程.pdf';
			var pdf = document.getElementById("createPDF");
			if (pdf !== undefined && pdf !== null) {//判断pdf对象是否存在，如果存在就删除该对象
				var parentNode = pdf.parentNode;
				parentNode.removeChild(pdf);
		    }
			var p = document.createElement("object");
			p.id = "createPDF";
			p.classid = "CLSID:CA8A9780-280D-11CF-A24D-444553540000";
			p.width = 1;
			p.height = 1;
			p.src = srcFile;
			document.body.appendChild(p);
			p.print();
		};
		//外部事件绑定
		$('#testchange').click(function(){
			$scope.$apply(function(){
				$scope.test={
					testName : '李四',
					testAge : 20,
					tetsHeight : 19
				};
			});
		});
	});

	//手动装载angular模块
	angular.bootstrap($('#testId'),['testModule']);
});

