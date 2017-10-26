/**=========================================================
 * 文件上传的指令
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('btUpload', btUpload);

    btUpload.$inject = ['$parse', 'BtUtil','$timeout'];
    function btUpload($parse, BtUtil,$timeout) {
    	return {
            restrict: 'A',
    		link: function(scope, element, attrs){

                var accept = attrs.accept || '*';
                var fileTypeName = attrs.fileTypeName || 'otherFile';

                initUpload();

                function initUpload(){

                    var inputEle = angular.element('<input class="bt-unvisitable" type="file" accept="' + accept + '" name="Filedata" />');
                    if(!angular.isUndefined(attrs.multiple)){
                        inputEle.attr('multiple','multiple');
                    }
                    inputEle
                        .on('change',function($event){
                            
                            element.addClass('bt-upload-ing');
                            $timeout(function(){
                                submitForm(inputEle);
                            },200);
                            
                        });
                    element.append(inputEle);
                }

                var iframe,form;
                function submitForm(input){
                    var actionUrl = BtUtil.getUrl(['../scf2/testdata/uploadR.html?fileTypeName=','../Platform/CustFile/fileUpload?fileTypeName=']) +fileTypeName;
                    form = angular.element('<form  style="display:none;" action="'+actionUrl+'" method="post" enctype="multipart/form-data" target="bt_upload_frame"></form>');
                    iframe = angular.element('<iframe name="bt_upload_frame" style="display: none;">');
                    form.append(input);
                    angular.element(document.body).prepend(form);
                    angular.element(document.body).prepend(iframe);

                    iframe
                        .on('load',iframeLoad);

                    form[0].submit();
                }

                function clean(){
                    iframe.remove();
                    form.remove();
                }

                function iframeLoad($event){
                    var iDocument = $event.target.contentWindow.document;
                    var resultStr = iDocument.body.innerHTML;
                    if(resultStr.length !== 0 && resultStr.indexOf("{") ==-1){
                        resultStr = {code:500,message:'响应的是html代码'}
                        // 响应的是html代码，失败
                    }else{
                        resultStr = angular.fromJson(resultStr);
                    }
                    element.removeClass('bt-upload-ing');
                    switch (attrs.uploadType){
                        case 'table':
                            if(resultStr.code == 200){ // 上传成功响应
                                element.addClass('bt-upload-success');
                                $parse(attrs.btUpload).assign(scope,resultStr.data);
                                clean();
                                $timeout(function(){
                                    element.removeClass('bt-upload-success');
                                    var deleteEle = angular.element('<a class="bt-table-button">删除</a>');
                                    deleteEle
                                        .on('click',function(){
                                            
                                            scope.$apply(function(){
                                                $parse(attrs.btUpload).assign(scope,undefined);
                                            });
                                            deleteEle.remove();
                                            element.text('上传');
                                            initUpload();
                                        });
                                    element.text('');
                                    element.parent().prepend(deleteEle);
                                },900);
                            }else{ // 上传失败响应
                                element.addClass('bt-upload-fail');
                                clean();
                                $timeout(function(){
                                    element.removeClass('bt-upload-fail');
                                    element.text('重新上传');
                                    initUpload();
                                },900);
                            }
                            break;
                        default:
                            if(resultStr.code == 200){ // 上传成功响应
                                element.addClass('bt-upload-success');
                                var btModel = $parse(attrs.btUpload)(scope);
                                btModel.push(resultStr.data);
                                clean();
                                $timeout(function(){
                                    element.removeClass('bt-upload-success');
                                    initUpload();
                                },900);
                            }else{ // 上传失败响应
                                 element.addClass('bt-upload-fail');
                                 clean();
                                 $timeout(function(){
                                    element.removeClass('bt-upload-fail');
                                    initUpload();
                                },900);
                            }
                            break;
                    }
                }
    		}
    	}
    }

})();
