angular.module('memoryModule').controller('MemoryCtrl', ['$scope', '$http', 'jsonLoaderService', function($scope, $http, jsonLoaderService){
  $scope.images = [];

  //$scope.flippedImage = "http://placehold.it/50x50";
  $scope.flippedImage = "https://static-s.aa-cdn.net/img/ios/348862738/d3649f309860422d070114af40962512";

  $scope.loadImages = function() {
    for(var i = 0; i < 16; i++) {
      $scope.images.push({id: i, src:  $scope.flippedImage});
      //$scope.images.push({id: i, src: "./memoryGame/img/Barot_Bellingham_tn.jpg"});

    }
  }
  $scope.toggleImage = function(x) {
    alert(x + " was clicked");
  }







  $scope.toggleImage1 = function(image) {
    var curImg=  $scope.images[event.toElement.id];
    if(curImg.src === $scope.flippedImage) {
      curImg.src = "./memoryGame/img/Barot_Bellingham_tn.jpg";
    } else {
      curImg.src = $scope.flippedImage;
    }
  };


  $scope.imagesData = jsonLoaderService.loadJson('memoryGame/data.json');
	$http.get('js/data.json').success(function(data){
		$scope.artists = data.speakers;





		$scope.onItemDelete = function(item){
			$scope.artists.splice($scope.artists.indexOf(item), 1);
		}

		$scope.doRefresh = function(){
        $http.get('js/data.json').success(function(data){
				$scope.artists = data.speakers;
				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		$scope.toggleStar = function(item){
			item.star = !item.star;
		}

		$scope.moveItem = function(item, fromIndex, toIndex){
			$scope.artists.splice(fromIndex ,1 );
			$scope.artists.splice(toIndex, 0 , item );
		}


	});
}]);
