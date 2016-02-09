app.controller('LottoCtrl',  function(ImageService,$scope, $window, $ionicPlatform,$ionicHistory) {

  $scope.$on('$ionicView.loaded', function refreshImage() {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $scope.removedPictures = Array();
    $scope.addedPictures = Array();
    $scope.imagesData = Array();
    ImageService.getAllImagesFromDB().then(function(result){
      var index=0;
      for(i=0; i<result.length;i++)
      {
        var currentImage = result[i];
        if(currentImage.addToGameObj.lotto!=undefined) {
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
      $scope.removedPictures.push($scope.pairImage.id.toString());
      var imageToRemove = document.getElementById($scope.pairImage.id);
      $scope.addedPictures.splice($scope.addedPictures.indexOf($scope.pairImage.id.toString()), 1);
      var imageContainer = imageToRemove.parentElement;
      imageContainer.removeChild(imageToRemove);
      if ($scope.addedPictures.length == 0) {
        alert("Finishhh!!!");
        $scope.initialize();

      }
      else {
        $scope.refresh();
      }
    }else{
      var highlightBack = move(document.getElementById($event.currentTarget.id))
        .set('background', document.getElementById($event.currentTarget.id).style.background)
        .duration('0.2s')
        .end();

      var highlight = move(document.getElementById($event.currentTarget.id))
        .set('background', '#B9F6CA')
        .duration('0.2s')
        .then(highlightBack)
        .end();

    }
  }

  $scope.initialize = function initialize(){
    for(i=0; i<$scope.imagesData.length;i++)
    {
      $scope.addedPictures.push($scope.imagesData[i].id.toString());
    }
    $scope.removedPictures = [];
    var tempImg = document.getElementById("tempimg").getElementsByTagName("img")[1];
    $scope.pairImage = $scope.imagesData[Math.floor(Math.random() * $scope.imagesData.length)];
    var tempId = $scope.pairImage.id;
    tempImg.id = 'gen' + tempId;

    tempImg.className = 'lotto';
    var tempSrc = $scope.pairImage.image;
    tempImg.src = tempSrc;
    $window.location.reload(true);
  }

});


