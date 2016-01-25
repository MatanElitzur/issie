angular.module('lottoConfigModule').controller('LottoConfigCtrl', ['$q' ,'$http' ,'ImageService' ,'$scope' ,'$ionicPopup', function( $q , $http, ImageService, $scope, $ionicPopup) {

  var vm = this;
  vm.images = [];
  //vm.imagesFromDB = [];
  vm.imagesDataFromJson = [];

  vm.init = function(){
//      getImages().then(function(success){
          getLottoImagesFromFS().then(function(success){
              console.log('Success to get images from json file, success: ' + success);
              addLottoImagesFromJsonToDatabase().then(function(success){
                 //vm.images = vm.imagesFromDB;
                getImages();
                 console.log('Success to add images to database, success: ' + success);
              }, function(error){
                 console.log('Failed to add images from json to database, Error: ' + error);
              })
          }, function(error){
            console.log('Failed to get images from json file, Error: ' + error);
          })
 //     })
  }

  vm.toggleImage = function(imageObj){
    imageObj.addToLottoGame = !imageObj.addToLottoGame;
    ImageService.updateImage(imageObj);
  }

  function getImages(){
    var deferred = $q.defer();
    ImageService.getAllImages().then(function(result){
      //vm.imagesFromDB = result;
      vm.images = result;
      deferred.resolve();
    });
    return deferred.promise;
  }

  function getLottoImagesFromFS(){
    return $http.get('lottoGame/data.json')
                .then(function(res){
                      vm.imagesDataFromJson = res.data.imagesData;
               });
  }

  function addLottoImagesFromJsonToDatabase(){
    var deferred = $q.defer();
      ImageService.getAllImages().then(function(imagesFromDB){
        for(var i = 0 ; i < vm.imagesDataFromJson.length ; i++){
          var nameOfFileFromJson = vm.imagesDataFromJson[i].fileName.substr(vm.imagesDataFromJson[i].fileName.lastIndexOf('/') + 1);
          var imageExistsInDB = false;
          for(var j = 0 ; j < imagesFromDB.length ; j++){
            var nameOfFileFromDB = imagesFromDB[j].image.substr(imagesFromDB[j].image.lastIndexOf('/') + 1);
            if(nameOfFileFromJson == nameOfFileFromDB){
              //Image exists in DB
              imageExistsInDB = true;
              break;
            }
          }

          if(imageExistsInDB == false){
            //Add image to db
            ImageService.addImage(ImageService.addJsonFormat('lottoGame/img/' + nameOfFileFromJson, true,
              vm.imagesDataFromJson[i].addToLottoGame,
              vm.imagesDataFromJson[i].addToMemoryGame));
          }
        }
        deferred.resolve();
      });
    /*
      for(var i = 0 ; i < vm.imagesDataFromJson.length ; i++){
          var nameOfFileFromJson = vm.imagesDataFromJson[i].fileName.substr(vm.imagesDataFromJson[i].fileName.lastIndexOf('/') + 1);
          var imageExistsInDB = false;
          for(var j = 0 ; j < vm.imagesFromDB.length ; j++){
              var nameOfFileFromDB = vm.imagesFromDB[j].image.substr(vm.imagesFromDB[j].image.lastIndexOf('/') + 1);
              if(nameOfFileFromJson == nameOfFileFromDB){
                //Image exists in DB
                imageExistsInDB = true;
                break;
              }
          }

          if(imageExistsInDB == false){
             //Add image to db
            ImageService.addImage(ImageService.addJsonFormat('lottoGame/img/' + nameOfFileFromJson, true,
                                                             vm.imagesDataFromJson[i].addToLottoGame,
                                                             vm.imagesDataFromJson[i].addToMemoryGame));
          }
      }

      deferred.resolve();
     */
    return deferred.promise;
  }


}]);
