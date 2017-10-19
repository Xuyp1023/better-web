define(function(require, exports, module) {
    exports.installController = function(mainApp, common, validate, tipbar, loading, comdirect, dialog) {

        mainApp.controller('demo.testController', ['$scope', function($scope) {

            $scope.name = 'demoTest';

        }]);

    };

});
