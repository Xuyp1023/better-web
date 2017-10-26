/**=========================================================
 * http请求
 =========================================================*/
(function () {
	'use strict';

	angular
		.module(ApplicationConfiguration.applicationModuleName)
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', 'configVo', '$http'];
	function MainController($scope, configVo, $http) {

		activate();

		////////////////
		//初始化方法开始
		function activate() {

			$scope.upload = function () {
				var fileInput = $('<input type="file" name="Filedata" />');

				// ie9 必须要label触发才可以

				fileInput
					.on('change', function ($event) {
						var actionUrl = configVo.modulePaht + '/temp/xxxxxxxxxxxxx';
						var form = $('<form  style="display:none;" action="'+actionUrl+'" method="post" enctype="multipart/form-data" ></form>');
						form.append(fileInput);
						form.append($('<input name="type" value="1">'));

						var iframe = $('<iframe name="bt_upload_frame" style="display: none;">');
						$(document.body).prepend(form);
						$(document.body).prepend(iframe);
						form.submit();
					});

				fileInput.click();
			};

		} // 初始化结束
	}

})();
