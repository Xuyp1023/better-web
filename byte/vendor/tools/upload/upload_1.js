/**=========================================================
 * 
 =========================================================*/
(function(){

    window.iframeLoad = function(iframe,index){
        var iDocument = iframe.contentWindow.document;
        var resultStr = iDocument.body.innerHTML;
        if(resultStr.length !== 0){
            if(resultStr.indexOf("{") ==-1){
                    resultStr = { "message":"上传文件成功", "data":{ "id":11616, "batchNo":"", "fileName":"相关文件.doc", "fileType":"tar.gz", "fileNo":"", "filePath":"/20160401/edcc61453cab438f989ee7fa4c8b41f8", "fileLength":204944, "regDate":"", "regTime":"", "fileInfoType":"CustOwnBrand", "fileInfo":"", "inner":false }, "page":"", "code":200 };
                }else{
                    resultStr = angular.fromJson(resultStr);
                }
                // 上传成功响应
                if(resultStr.code == 200){
                    currentData.agreeInfo['attachName' + index] = resultStr.data.fileName;
                    currentData.agreeInfo['attachUrl' + index] = resultStr.data.filePath;
                    viewModel.agreeInfoBind(currentData.agreeInfo);
                }else{ // 上传失败响应
                    tipbar.errorLeftTipbar($("#bt_upload_label"+index),resultStr.message,3000);
                }
        }else{

        }
    };
    window.fileChange = function(input){
        if(!input.value){return;}
        var iForm = input.parentElement;
        iForm.submit();
    };

})();

