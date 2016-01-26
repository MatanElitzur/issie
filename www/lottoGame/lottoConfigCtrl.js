angular.module('lottoConfigModule').controller('LottoConfigCtrl', ['ImageService' ,'$scope', function(ImageService, $scope) {

  var vm = this;
  vm.images = [];

  vm.toggleImage = function(imageObj){
    imageObj.addToLottoGame = !imageObj.addToLottoGame;
    ImageService.updateImage(imageObj);
  }

  vm.getImages = function(){
    ImageService.getAllImagesFromDB().then(function(result){
       vm.images = result;
    });
  }


}]);
