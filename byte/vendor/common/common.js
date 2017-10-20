(function () {	
		//判断数组包含关系
		window.isContain = function(arr,str){
			for (var i = 0; i < arr.length;i++) {
				var temp = arr[i];
				if(temp === str) return true;
			}
			return false;
		}
		// 取出数组中属性(id)
		window.getAttr = function(arr,prop,flag) {
			flag =  flag || true;
			if(arr.length==0) {
				return false;
			}
			var arrList=[];
			for(var i=0,len=arr.length; i<len; i++) {
				arrList.push(arr[i][prop]);
			}
			return flag? arrList:arrList.join(",");
		}
})();