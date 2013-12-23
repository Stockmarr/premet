angular.module('premet.controllers', [])

.controller('AppCtrl', function($scope) {
  $scope.toggleLeftMenu = function() {
    $scope.sideMenuController.toggleLeft();
  };
  $scope.toggleRightMenu = function() {
    $scope.sideMenuController.toggleRight();
  };
  
})

