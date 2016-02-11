angular.module('homeModule').controller('HomeCtrl',['$state', '$timeout', '$scope', function($state, $timeout, $scope){
  var vm = this;
  vm.animateMemoryGame = false;
  vm.animateLottoGame = false;

  vm.navigateMemory = function() {
    vm.animateMemoryGame = true;
    $timeout(function(){
      $state.go('memory');
    }, 2000);

    $timeout(function(){
      vm.animateMemoryGame = false;
    }, 4000);
  }

  vm.navigateLotto = function() {
    vm.animateLottoGame = true;
    $timeout(function(){
      $state.go('lotto');
    }, 2000);

    $timeout(function(){
      vm.animateLottoGame = false;
    }, 4000);
  }
  /*
	    $scope.memoryImgPath = "home/img/memory.gif";
        $scope.lottoImgPath = "home/img/lotto.jpg";
		$scope.test = function(){
			$state.href();
		};
  */
}]);
