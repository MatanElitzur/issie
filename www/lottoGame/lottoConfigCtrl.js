angular.module('lottoConfigModule')
  .filter('displayLottoImages',['LOTTO_GAME_NAME', function(LOTTO_GAME_NAME){
        //// Create the return function and set the required parameter name to **input**
        return function(input){
            var out = [];
            // Using the angular.forEach method, go through the array of data and check if it's a lotto image
            angular.forEach(input, function(imageObject) {
              //'lotto' LOTTO_GAME_NAME
              if(imageObject.addToGameObj.hasOwnProperty(LOTTO_GAME_NAME)){
                out.push(imageObject)
              }
            })

            return out;
        };
  }])
  .controller('LottoConfigCtrl', ['ImageService' ,'$scope', function(ImageService, $scope) {

  var vm = this;
  vm.images = [];

  vm.toggleImage = function(imageObj){
    imageObj.addToGameObj.lotto = !imageObj.addToGameObj.lotto;
    ImageService.updateImage(imageObj);
  }

  vm.getImages = function(){
    ImageService.getAllImagesFromDB().then(function(result){
       vm.images = result;
    });
  }


}]);
