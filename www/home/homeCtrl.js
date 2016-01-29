angular.module('homeModule').controller('HomeCtrl',['$scope', '$state', function($scope, $state){
	    $scope.memoryImgPath = "home/img/memory.gif";
        $scope.lottoImgPath = "home/img/lotto.jpg";
		$scope.test = function(){
			$state.href();
		};
}]);
