angular.module('memoryModule').controller('MemoryCtrl', [ 'ImageService', '$timeout', '$ionicPlatform', '$cordovaNativeAudio', '$ionicHistory', '$ionicPopup', '$q', 'GameConfigService' , function( ImageService, $timeout, $ionicPlatform, $cordovaNativeAudio, $ionicHistory, $ionicPopup, $q, GameConfigService){
  var vm = this;
  vm.memoryImagesMatrix = [];
  var firstImage = null;
  var secondImage = null;
  var imagesData = null;
  var flippedImage = "./memoryGame/coverImg/coverImage.png";
  var isWebView = ionic.Platform.isWebView(); // Check if we are running within a WebView (such as Cordova or PhoneGap).

  $ionicPlatform.ready(function() {
    if(isWebView) {
      $cordovaNativeAudio.preloadSimple('imagesPaired', 'audio/tada.mp3');
      $cordovaNativeAudio.preloadSimple('failedImagesPairing', 'audio/MirrorShattering.mp3');
    }
  });

  vm.goBack = function(){
    $ionicHistory.goBack();
  }

  vm.getImages = function(){
    ImageService.getAllImagesFromDB().then(function(result){
      imagesData = result;
      initMemoryImagesMatrix();
    });
  }

  function initMemoryImagesMatrix(){
    var j = -1;
    var numberOfMemoryImages = 0;
    vm.memoryImagesMatrix = [];
    var gameDifficulty = GameConfigService.getGameDifficulty() / 2;
    for(var i = 0; i < imagesData.length && gameDifficulty > 0; i++) {
      if(imagesData[i].addToGameObj.memory){
        vm.memoryImagesMatrix.push({index: ++j, src:  flippedImage, image: imagesData[i].image, isPaired: false, isFlipped: false });
        numberOfMemoryImages++;
        vm.memoryImagesMatrix.push({index: ++j, src:  flippedImage, image: imagesData[i].image, isPaired: false, isFlipped: false });
        gameDifficulty--;
      }
    }
    
    vm.memoryImagesMatrix =  shuffle(vm.memoryImagesMatrix);
  }

  function shuffle(array) {
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

   function Step(src, index) {
    this.src = src;
    this.index = index;
  }

  vm.toggleImage = function(image) {
      if(!image.isPaired){
          if((firstImage == null) && (!image.isFlipped)){
            image.src = image.image;
            image.isFlipped = true;
            firstImage = image;
          }
          else if((firstImage != null) && (secondImage == null) && (!image.isFlipped)) {
            image.src = image.image;
            image.isFlipped = true;
            secondImage = image;
            //checkIfImagesAreEqual;
            if(firstImage.src === secondImage.src){
               theImagesAreEqual(image);
            }
            else {
               theImagesAreNotEqual(image);
            }
          }
      }
  }


  function theImagesAreEqual(image) {
   $timeout(function(){
     if(isWebView) {
        $cordovaNativeAudio.play('imagesPaired');
     }
     image.isPaired = true;
     image.animate = true;
     setImageInMatrixAsPaired(firstImage.index);
     /*
     setImageInMatrixAsPaired(firstImage.index);
     hideImages();
     initImages();
     //TODO: Animation for success
     if(isAllImagesPaired()) {
        shuffleImagesToPlayAgainPopup();
     }
     */
   }, 500).then(function(){
     $timeout(function(){
       hideImages();
       initImages();
       //TODO: Animation for success
       if(isAllImagesPaired()) {
         shuffleImagesToPlayAgainPopup();
       }

     },1500);
   });
  }

  /*
  function theImagesAreEqual(image){
    $q.when(displayImagesEqualAnimation(image)).then(function(){
      initImages();
      //TODO: Animation for success
      if(isAllImagesPaired()) {
        shuffleImagesToPlayAgainPopup();
      }
    });

  }

  function displayImagesEqualAnimation(image) {
    $timeout(function(){
      if(isWebView) {
        $cordovaNativeAudio.play('imagesPaired');
      }
      image.isPaired = true;
      image.animate = true;
      setImageInMatrixAsPaired(firstImage.index);
      hideImages();
    }, 500);
  }
*/
  function hideImages() {
    firstImage.hideImage = true;
    secondImage.hideImage = true;
  }

  function isAllImagesPaired() {
    var gameOver = true;
    for(var i = 0 ; i < vm.memoryImagesMatrix.length ; i++){
      if(vm.memoryImagesMatrix[i].isPaired === false){
        gameOver = false;
        break;
      }
    }

    return gameOver;
  }

  function shuffleImagesToPlayAgainPopup() {
    var gameOverPopup = $ionicPopup.confirm({
      title: "<div class='icon ion-happy-outline'> כל הכבוד </div>" ,
      okText: ' שחק שוב ',
      cancelText: ' לא '
    });

    gameOverPopup.then(function(res) {
      if(res) {
        initMemoryImagesMatrix();
        vm.memoryImagesMatrix = shuffle(vm.memoryImagesMatrix);
      }
    });
  }

  function theImagesAreNotEqual(image){
      $timeout(function(){
      //The images are not equal
        if(isWebView) {
          $cordovaNativeAudio.play('failedImagesPairing');
        }
        image.src = flippedImage;
        image.isFlipped = false;
        setImageAsFlippedImage(firstImage.index);
        initImages();
    }, 1000);
  }

  function initImages(){
    firstImage = null;
    secondImage = null;
  }

  function setImageInMatrixAsPaired(indexOfImage){
      for(var i = 0 ; i < vm.memoryImagesMatrix.length ; i++){
           if(vm.memoryImagesMatrix[i].index === indexOfImage){
             vm.memoryImagesMatrix[i].isPaired = true;
             vm.memoryImagesMatrix[i].animate = true;
             break;
           }
      }
  }

  function setImageAsFlippedImage(indexOfImage){
    for(var i = 0 ; i < vm.memoryImagesMatrix.length ; i++){
      if(vm.memoryImagesMatrix[i].index === indexOfImage){
        vm.memoryImagesMatrix[i].src = flippedImage;
        vm.memoryImagesMatrix[i].isFlipped = false;
        break;
      }
    }
  }


}]);
