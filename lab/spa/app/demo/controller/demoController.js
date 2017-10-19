define(function(require, exports, module) {
    exports.installController = function(mainApp, common, validate, tipbar, loading, comdirect, dialog) {

        mainApp.controller('demoController', ['$scope','commonService', function($scope,commonService) {

            $scope.name = 'demo';

            console.log(commonService.queryBaseInfoList);

        }]);

    };

});
