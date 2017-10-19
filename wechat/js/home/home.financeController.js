
exports.installController = function(mainApp, common){

	mainApp.controller('home.financeController',['$scope','muiSupport','http','$location',function($scope,muiSupport,http,$location){
		/*VM绑定区域*/


		//提醒列表
		$scope.todoTaskCount = '0';
		//
		$scope.creditInfo = {
			'creditLimit':0,
			'creditUsed':0,
			'creditBalance':0,
		};

		//查看详情
		$scope.lookDetail = function(item){

		};

		//查看待办
		$scope.lookTodo = function(){
			window.location.href="flow.html#/flow/todoList";
		};


		$scope.queryTodoTaskCount = function() {
			http.post(BTPATH.QUERY_WORKFLOW_CURRENT_TASK_COUNT,{})
		    .success(function(data){
		      if(common.isCurrentData(data)){
		        $scope.$apply(function(){
		        	if (data.data && data.data === 0)
		        		$scope.todoTaskCount = '0';
		        	else if (data.data && data.data < 100)
						$scope.todoTaskCount = '' + data.data;
					else if (data.data && data.data > 100)
						$scope.todoTaskCount = '99+';
					else $scope.todoTaskCount = '0';
		        });
		      }   
		  });
		};

		$scope.findCreditSum = function() {
			return http.post(BTPATH.FIND_CREDIT_SUM,{}).success(function(data){
		      if(common.isCurrentData(data)){
		        $scope.$apply(function(){
		        	$scope.creditInfo = data.data;
		        });
		      }   
		  });
		};
		

		//切换home页
		$scope.switch = function(flag){
			$location.path("home/"+flag);
		};


		//===================================== 	水池动效start	======================================================
		function drawPool(ratio){
			var canvas = document.getElementById("pool");
			if(!ratio || !canvas) return;
			var ctx = canvas.getContext("2d");
			//获取canvas 宽 高
			canvas.width = canvas.parentNode.offsetWidth;
			canvas.height = canvas.parentNode.offsetHeight;

			//与顶部的高度差
			var topGap = (1 - ratio) * canvas.height;

			//角度换算值
			var step = 0;
			// var lines = ["rgba(0,222,255, 0.2)", "rgba(157,192,249, 0.2)"];

			var lines = ["#C2E8FB", "#ACE0F8"];
			// var lines = ["#C2E8FB","#ACEOF8"];
			
			var loop = function(){
				//清除所有矩形
				ctx.clearRect(0,0,canvas.width,canvas.height);
				//角度变化
				step++;
				//遍历绘图
				for(var i=0; i<lines.length ;i++){
					ctx.fillStyle = lines[i];
					//根据角度计算值 cos/sin
					var angle = (step + i*180 )*Math.PI/180;
					var leftHeight = Math.sin(angle) * 10;
					var rightHeight = Math.cos(angle) * 10;
					//开始绘制路径
					ctx.beginPath();
					//左上角
					ctx.moveTo(0, topGap +leftHeight);
					//右上角 绘制S曲线
					ctx.bezierCurveTo(canvas.width /2, topGap+leftHeight, canvas.width / 2,topGap+rightHeight, canvas.width, topGap+rightHeight);
					// ctx.lineTo(canvas.width, canvas.height/2+rightHeight);
					//右下角
					ctx.lineTo(canvas.width, canvas.height);
					//左下角
					ctx.lineTo(0, canvas.height);
					//闭合路径
					ctx.closePath();
					//填充路径 
					ctx.fill();
				}
				setTimeout(function(){
					loop(ctx);
				},10);
			};
			//开始
			loop();
		}
		//===================================== 	水池动效end	======================================================

 
		/*控制器执行入口*/
		$scope.$on('$routeChangeSuccess',function(){
			//绘图 传入	可用授信额度/当前授信总额 比例（小数）
			$scope.queryTodoTaskCount();
			$scope.findCreditSum().success(function(){
				if($scope.creditInfo.creditUsed && $scope.creditInfo.creditLimit){
					drawPool($scope.creditInfo.creditUsed / $scope.creditInfo.creditLimit);
				}
			});
		});


	}]);

}; 