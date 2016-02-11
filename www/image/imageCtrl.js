angular.module('imageModule').controller('ImageCtrl', ['$q' ,'$cordovaImagePicker','$cordovaFile', 'ImageService', '$scope', 'MAX_NUMBER_OF_IMAGES_TO_ADD', '$ionicPopup', '$timeout', 'MEMORY_GAME_NAME', 'LOTTO_GAME_NAME', '$ionicHistory', function( $q ,$cordovaImagePicker ,$cordovaFile, ImageService, $scope, MAX_NUMBER_OF_IMAGES_TO_ADD, $ionicPopup, $timeout, MEMORY_GAME_NAME, LOTTO_GAME_NAME, $ionicHistory){
  var vm = this;
  vm.images = [];
  var counterForDeleteButton = 0;
  vm.deleteButtonDisable = true;

  var options = {
    maximumImagesCount: 10,
    width: 800,
    height: 800,
    quality: 80
  };

  vm.goBack = function(){
    $ionicHistory.goBack();
  }

  vm.showDeleteOptions = function(){
     if(vm.images.length == 0){
        var noImagesPopup = $ionicPopup.show({
          title: 'אין תמונות למחיקה'
        });

        $timeout(function() {
          noImagesPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
     }
     else{
        $scope.varShowDeleteOptions = !$scope.varShowDeleteOptions;
     }
  }

  vm.showTrashCanIcon = function(){
    removeCheckedImagesForDelete();
    vm.deleteButtonDisable = true;
    counterForDeleteButton = 0;
    vm.showDeleteOptions();
  }

  vm.getImages = function() {
    var deferred = $q.defer();
    ImageService.getAllImagesFromDB().then(function(result){
      vm.images = result;
      deferred.resolve();
    });
    return deferred.promise;
  }
  //For the first time get all images from filesystem
  //vm.getImages();

  vm.imagePicker = function(){
    if(vm.images.length < MAX_NUMBER_OF_IMAGES_TO_ADD){
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for(var i = 0 ; i < results.length ; i++){
            console.log('Image URI: ' + results[i]);
            copyFile(results[i]);
          }
        }, function (error){
          console.log('Image Picker Error: ' + error);
        });
     }
     else{
        var alertPopup = $ionicPopup.alert({
        title: 'מקסימום תמונות',
        template:  'אי אפשר יותר להעלות תמונות'
        });
     }
  }

  vm.addCounterForDeleteButton = function(imageObj){
    if(imageObj.checkedToDelete){
      counterForDeleteButton++;
    }
    else{
      counterForDeleteButton--;
    }

    if(counterForDeleteButton == 0){
      vm.deleteButtonDisable = true;
    }
    else{
      vm.deleteButtonDisable = false;
    }
  }

  vm.deleteImages = function(){
      var deleteImagesPopup = $ionicPopup.confirm({
        title: "<div class='icon ion-alert-circled'> מחק </div>" ,
        template: 'התמונות שנבחרו ימחקו להמשיך',
        cancelText: ' לא ',
        okText: ' אישור '
      });

      deleteImagesPopup.then(function(res) {
        if(res) {
          deleteCheckedImages();
          vm.showTrashCanIcon();
        } else {
          vm.showTrashCanIcon();
        }
      });
  }

  function deleteCheckedImages(){
      for(var i = 0 ; i < vm.images.length ; i++){
          if(vm.images[i].checkedToDelete){
             removeImageFromFileSystem(vm.images[i]).then(function(imageObj){
                //Remove image from database
                ImageService.deleteImage(imageObj).then(function(success){
                    console.log('Success to delete image from database, success: ' + success.ok);
                }, function(error){
                    console.log('Failed to delete image from database, Error: ' + error);
                });
             });
          }
      }
  }

  function removeImageFromFileSystem(imageObj){
    var deferred = $q.defer();
    var nameOfFile = imageObj.image.substr(imageObj.image.lastIndexOf('/') + 1);
    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, nameOfFile)
      .then(function (success) {
        console.log("Success to delete image from file system: " + imageObj.image);
        deferred.resolve(imageObj);
      }, function (error) {
        console.log("Error while trying to delete image from file system: " + imageObj.image + " Error: " + error);
        //deferred.reject();
      });
      return deferred.promise;
  }

  vm.refreshImages = function(){
    vm.getImages().finally(function(){
        // Stop the ion-refresher from spinning)
        $scope.$broadcast('scroll.refreshComplete');
        console.log('Image refresher finished');
    });
  }

 function removeCheckedImagesForDelete(){
    for(var i = 0 ; i < vm.images.length ; i++){
        vm.images[i].checkedToDelete = false;
    }
  }

  function copyFile(imageUrl) {
    return $q(function(resolve, reject) {
      var nameOfFile = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
      var nameOfFilePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
      var newNameOfFile = makeid() + nameOfFile;
      //path, fileName, newPath, newFileName
      $cordovaFile.copyFile(nameOfFilePath, nameOfFile,  cordova.file.externalApplicationStorageDirectory, newNameOfFile)
        .then(function(info) {
          var imageForGameObj = {};
          imageForGameObj[LOTTO_GAME_NAME] = true;
          imageForGameObj[MEMORY_GAME_NAME] = true;
          ImageService.addImage(ImageService.addJsonFormat(cordova.file.externalApplicationStorageDirectory + newNameOfFile, false, imageForGameObj));
          resolve();
        }, function(error) {
           var stringError = 'Failed to copy image: ' + imageUrl + " To cordova.file.dataDirectory " + cordova.file.dataDirectory + "new filename is: " + newNameOfFile + " Error: " + error;
           console.log(stringError);
           var alertPopup = $ionicPopup.alert({
              title: ' שגיאה בעת העתקת תמונה ',
              template:  stringError
           });
          reject();
        });
    })
  }

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i=0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


}]);
