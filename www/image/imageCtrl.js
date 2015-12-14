angular.module('imageModule').controller('ImageCtrl', ['$q' ,'$cordovaImagePicker','$cordovaFile', 'ImageService', '$scope', function( $q ,$cordovaImagePicker ,$cordovaFile, ImageService, $scope){

  var vm = this;
  vm.images = [];

  var options = {
    maximumImagesCount: 10,
    width: 800,
    height: 800,
    quality: 80
  };

  vm.getImages = function() {
    var deferred = $q.defer();
    ImageService.getAllImages().then(function(result){
      vm.images = result;
      deferred.resolve();
    });
    return deferred.promise;
  }
  //For the first time get all images from filesystem
  vm.getImages();

  vm.imagePicker = function(){
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

  vm.deleteImages = function(){
      //isCheckedToDelete
      for(var i = 0 ; i < vm.images.length ; i++){
          if(vm.images[i].isCheckedToDelete){
            console.log('Delete image: ' + vm.images[i].imageName);
          }
      }
  }

  vm.removeDeleteImagesCheckbox = function(){
    for(var i = 0 ; i < vm.images.length ; i++){
        vm.images[i].isCheckedToDelete = false;
    }
  }

  vm.refreshImages = function(){
    vm.getImages().finally(function(){
        // Stop the ion-refresher from spinning)
        $scope.$broadcast('scroll.refreshComplete');
        console.log('Image refresher finished');
    });
  }

  function copyFile(imageUrl) {
    return $q(function(resolve, reject) {
      var nameOfFile = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
      var nameOfFilePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
      var newNameOfFile = makeid() + nameOfFile;
      //path, fileName, newPath, newFileName
      $cordovaFile.copyFile(nameOfFilePath, nameOfFile, /*cordova.file.dataDirectory*/ cordova.file.externalApplicationStorageDirectory, newNameOfFile)
        .then(function(info) {
          ImageService.addImage(addJsonFormat(cordova.file.externalApplicationStorageDirectory + newNameOfFile));
          resolve();
        }, function(error) {
          console.log('Failed to copy image: ' + imageUrl + " To cordova.file.dataDirectory " + cordova.file.dataDirectory + "new filename is: " + newNameOfFile + " Error: " + error);
          reject();
        });
    })
  }

  function addJsonFormat(parameterValue)
  {
      var imgObj = {};
      imgObj.image = parameterValue;
      return imgObj;
  }
  /*
   function onCopySuccess(entry) {
   vm.$apply(function () {
   vm.images.push(entry.nativeURL);
   window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(vm.images));
   });
   }

   function fail(error) {
   console.log("fail: " + error.code);
   }
   */
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i=0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


}]);
