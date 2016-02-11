angular.module('memoryConfigModule')
  .filter('displayMemoryImages',['MEMORY_GAME_NAME', function(MEMORY_GAME_NAME){
    //// Create the return function and set the required parameter name to **input**
    return function(input){
      var out = [];
      // Using the angular.forEach method, go through the array of data and check if it's a lotto image
      angular.forEach(input, function(imageObject) {
        if(imageObject.addToGameObj.hasOwnProperty(MEMORY_GAME_NAME)){
          out.push(imageObject)
        }
      })

      return out;
    };
  }])

  .controller('MemoryConfigCtrl', ['$scope', 'ImageService', '$ionicHistory', function($scope, ImageService, $ionicHistory){
  var vm = this;
  vm.images = [];

  vm.toggleImage = function(imageObj){
    imageObj.addToGameObj.memory = !imageObj.addToGameObj.memory;
    ImageService.updateImage(imageObj);
  }

  vm.getImages = function(){
    ImageService.getAllImagesFromDB().then(function(result){
      vm.images = result;
    });
  }

   vm.goBack = function(){
     $ionicHistory.goBack();
   }


  }]);
