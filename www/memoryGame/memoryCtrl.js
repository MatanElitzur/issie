angular.module('memoryModule').controller('MemoryCtrl', ['$scope', '$http', 'jsonLoaderService', function($scope, $http, jsonLoaderService){
  $scope.images = [];
  $scope.flipedImages = [];

  $scope.flippedImage = "http://placehold.it/50x50";
  //$scope.flippedImage = "https://static-s.aa-cdn.net/img/ios/348862738/d3649f309860422d070114af40962512";

  $scope.loadImages = function() {
    for(var i = 0; i < 16; i++) {
      $scope.images.push({id: i, src:  $scope.flippedImage});
      //$scope.images.push({id: i, src: "./memoryGame/img/Barot_Bellingham_tn.jpg"});
    }
  }

  $scope.toggleImage = function(image) {
    var tileIndex = event.toElement.id;
    var curImg=  $scope.images[tileIndex];
    if(curImg.src === $scope.flippedImage) {
      //curImg.src = "./memoryGame/img/Barot_Bellingham_tn.jpg";
      curImg.src = $scope.flipedImages[tileIndex].src;
    } else {
      curImg.src = $scope.flippedImage;
    }
  };



  $http.get('./memoryGame/data.json')
    .then(function(res){
      $scope.imagesData = res.data.imagesData;
      //$scope.makeGrid($scope.imagesData);
      for(var i = 0; i < $scope.imagesData.length; i++) {
        var imgSrc = "./memoryGame/img/" + $scope.imagesData[i].fileName;
        $scope.flipedImages.push({id: i*2, src:  imgSrc});
        $scope.flipedImages.push({id: i*2+1, src:  imgSrc});
      }
      $scope.flipedImages =  $scope.shuffle($scope.flipedImages);
    });


  $scope.shuffle = function (array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

/*

 $scope.Tile = function(title) {
 this.title = title;
 this.flipped = false;
 }
  $scope.makeDeck = function(tileNames) {
    var tileDeck = [];
    tileNames.forEach(function(name) {
      tileDeck.push(new Tile(name.fileName));
      tileDeck.push(new Tile(name.fileName));
    });

    return tileDeck;

  $scope.makeGrid = function(tileDeck) {
    var gridDimension = Math.sqrt(tileDeck.length),
      grid = [];

    for (var row = 0; row < gridDimension; row++) {
      grid[row] = [];
      for (var col = 0; col < gridDimension; col++) {
        grid[row][col] = $scope.removeRandomTile(tileDeck);
      }
    }

    return grid;
  }


  $scope.removeRandomTile = function(tileDeck) {
    var i = Math.floor(Math.random()*tileDeck.length);
    return tileDeck.splice(i, 1)[0];
  }
*/




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
