app.controller('LottoCtrl',  function(ImageService,$scope, $window, $ionicPlatform,$ionicHistory) {
  var removedPicturesIndexes = Array(); //removed pictures indexes
  var displayedPicturesIndexes = Array();  //displayed pictures indexes
  var tempImg;
  var pairImage;
  $scope.$on('$ionicView.loaded', function refreshImage() {


    $scope.imagesData = Array();
    ImageService.getAllImagesFromDB().then(function(result){
      var index=0;
      for(i=0; i<result.length;i++)
      {
        var currentImage = result[i];
        if(currentImage.addToGameObj.lotto!=undefined) {
          currentImage.id = index;
          displayedPicturesIndexes.push(index.toString());
          index++;
          $scope.imagesData.push(currentImage);
        }
      }
      tempImg = document.getElementById("tempimg").getElementsByTagName("img")[1];
      firstImage();

    });

  });


  $scope.pickImage = function pickImage() {
    var lastId = tempImg.id.split('gen')[1];
    var tempId = displayedPicturesIndexes[Math.floor(Math.random() * displayedPicturesIndexes.length)];
    while (tempId == lastId || removedPicturesIndexes.indexOf(tempId) > -1)
      tempId = displayedPicturesIndexes[Math.floor(Math.random() * displayedPicturesIndexes.length)];
    tempImg.id = 'gen' + tempId;
    pairImage = document.getElementById(tempId);
    tempImg.src = pairImage.src;

  };

  $scope.evaluate = function evaluate($event) {
    if ($event.currentTarget.id == pairImage.id) {
      removedPicturesIndexes.push(pairImage.id.toString());
      var imageToRemove = document.getElementById(pairImage.id);
      displayedPicturesIndexes.splice(displayedPicturesIndexes.indexOf(pairImage.id.toString()), 1);
      var imageContainer = imageToRemove.parentElement;
      imageContainer.removeChild(imageToRemove);
      if (displayedPicturesIndexes.length == 0) {
        alert("Finishhh!!!");
        $scope.restart();

      }
      else {
        $scope.pickImage();
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

  $scope.restart = function restart(){
    shuffle($scope.imagesData);
    displayedPicturesIndexes = [];
    removedPicturesIndexes = [];
    for(i=0; i<$scope.imagesData.length;i++)
    {
         displayedPicturesIndexes.push($scope.imagesData[i].id.toString());
    }
    firstImage();
  }

  var firstImage = function firstImage(){
    pairImage = $scope.imagesData[Math.floor(Math.random() * $scope.imagesData.length)];
    tempImg.id = 'gen' + pairImage.id;
    tempImg.src = pairImage.image;
  }

  var shuffle = function shuffle(array){
    for(i=array.length-1; i>0;i--){
      var pos = Math.floor(Math.random() * i);
      var temp = array[pos];
      array[pos] =  array[i];
      array[i] = temp;
    }
  }

});


