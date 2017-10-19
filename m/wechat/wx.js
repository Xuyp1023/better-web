/*
微信SDK调用工具
@author:binhg
*/
// var wx = require('wx_sdk');
 
/*
获取到签名数据
*/
function _initSign(moduleList,callback,isWx){
	var path = BTPATH.GET_WX_SIGN;
	if(isWx) path = BTPATH.GET_REGISTER_WX_SIGN;
	$.post(path,{url:window.location.href.split('#')[0]},function(data){
		if((data.code === 200)&&!$.isEmptyObject(data.data)){
			$.extend(data.data,{
				// debug:true,
				jsApiList:moduleList
			});
			wx.config(data.data);
			wx.ready(function(){
				if(callback) callback();
			});
		}
		
	},'json');

}



angular.module('wx',[])

.service('wx',[function(){

	return {

		//图片上传
		uploadImage:function(callback,isWx){
			isWx = isWx||false;
			_initSign(['chooseImage','uploadImage'],function(){

				wx.chooseImage({
				    count: 1,
				    sizeType: ['original', 'compressed'],
				    sourceType: ['album', 'camera'], 
				    success: function (res) {
				        var localId = res.localIds[0];
				        
				        //执行上传操作
				        wx.uploadImage({
				            localId: localId, 
				            isShowProgressTips: 1, // 默认为1，显示进度提示
				            success: callback
				        });

				    }
				});

			},isWx);

		},

		previewContractImg : function(signed,appNo, dataAttr){

			if(signed){
				var tUrl = [];
				angular.forEach(dataAttr, function(row){
	
					var tpUrl = '';
					// angular.forEach(row,function(value , key){
					// 	tpUrl =  tpUrl + '&' +  key + '=' + value
					// });
					// tpUrl = BTPATH.QUERY_CONTRACT_IMG + '?appNo=' +appNo + tpUrl;

					tpUrl = BTPATH.QUERY_CONTRACT_IMG + '/' +appNo + '/' + row.batchNo + '/' + row.id;
					$.trim(tpUrl);
					tUrl.push( tpUrl );
				})
				// tUrl = [BTPATH.QUERY_CONTRACT_IMG +'/2017101198bb97/1003530/1004013.jpeg',BTPATH.QUERY_CONTRACT_IMG +'/2017101198bb97/1003530/1004014.jpeg'];
				
				return tUrl;
			}else{
				var tUrl = appNo;

				alert(tUrl);

				_initSign(['previewImage'],function(){
					wx.previewImage({
						current:tUrl[0],
						urls:tUrl
					});
				});
			}
		},

		//图片下载
		previewImage : function(fileId){
			var url = BTServerPath.DOWNLOAD_PLUS_FILE+'?id='+fileId;
			_initSign(['previewImage'],function(){
				wx.previewImage({
					current:url,
					urls:[url]
				});
			});
		}

	};
}]);

