angular.module('homeModule').controller('HomeCtrl',['$state', '$timeout', '$scope', function($state, $timeout, $scope){
  var vm = this;
  vm.animateHinge = false;

  vm.navigateMemory = function() {
    vm.animateHinge = true;
    $timeout(function(){
      $state.go('memory');
    }, 2000);

    $timeout(function(){
      vm.animateHinge = false;
    }, 4000);
  }

  vm.navigateLotto = function() {
    vm.animateHinge = true;
    $timeout(function(){
      $state.go('lotto');
    }, 2000);

    $timeout(function(){
      vm.animateHinge = false;
    }, 4000);
  }
  
}]);
