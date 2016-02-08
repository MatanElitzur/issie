app.controller('LottoCtrl',  function(ImageService,$scope, $ionicGesture, $http,$window, $ionicPlatform, $timeout) {

  $scope.$on('$ionicView.enter', function refreshImage() {

    $scope.removedPictures = Array();
    $scope.addedPictures = Array();
    $scope.imagesData = Array();
    ImageService.getAllImagesFromDB().then(function(result){
      var index=0;
      for(i=0; i<result.length;i++)
      {
        var currentImage = result[i];
        if(currentImage.addToGameObj.lotto) {
          currentImage.id = index;
          $scope.addedPictures.push(index.toString());
          index++;
          $scope.imagesData.push(currentImage);
        }
      }
      var tempImg = document.getElementById("tempimg").getElementsByTagName("img")[1];
      $scope.pairImage = $scope.imagesData[Math.floor(Math.random() * $scope.imagesData.length)];
      var tempId = $scope.pairImage.id;
      tempImg.id = 'gen' + tempId;

      tempImg.className = 'lotto';
      var tempSrc = $scope.pairImage.image;
      tempImg.src = tempSrc;
    });

  });


  $scope.refresh = function refreshImage() {
    var tempImg = document.getElementById("tempimg").getElementsByTagName("img")[1];
    var lastId = document.getElementById("tempimg").getElementsByTagName("img")[1].id.split('gen')[1];
    var totalPictures = $scope.addedPictures.length;
    var tempId = $scope.addedPictures[Math.floor(Math.random() * totalPictures)];
    while (tempId == lastId || $scope.removedPictures.indexOf(tempId) > -1)
      tempId = $scope.addedPictures[Math.floor(Math.random() * totalPictures)];
    tempImg.id = 'gen' + tempId;
    tempImg.removeAttribute("style");
    tempImg.className = document.getElementById("tempimg").getElementsByTagName("img")[1].className;
    var tempSrc = document.getElementById(tempId).src;
    tempImg.src = tempSrc;
    $scope.pairImage = document.getElementById(tempId);
  };

  $scope.evaluate = function evaluate($event) {
    if ($event.currentTarget.id == $scope.pairImage.id) {
      alert("bravooo");
      $scope.removedPictures.push($scope.pairImage.id.toString());
      var imageToRemove = document.getElementById($scope.pairImage.id);
      $scope.addedPictures.splice($scope.addedPictures.indexOf($scope.pairImage.id.toString()), 1);
      imageToRemove.parentElement.removeChild(imageToRemove);
      if ($scope.addedPictures.length == 0) alert("Finishhh!!!");
      else {
        $scope.refresh();
      }
    }
  }

});


