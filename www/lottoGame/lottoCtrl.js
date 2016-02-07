app.controller('LottoCtrl',  function($scope, $ionicGesture, $http,$window, $ionicPlatform) {
  $scope.$on('$ionicView.enter', function refreshImage() {
    //var tempImg = document.createElement("img");
    $scope.removedPictures = Array();
    $scope.addedPictures = Array();

    var allPictures = document.getElementsByClassName("row lotto")[0].getElementsByTagName("img");
    for (var i = 0; i < allPictures.length; i++) {
      $scope.addedPictures.push(allPictures[i].id);
    }
    var tempImg = document.getElementById("tempimg").getElementsByTagName("img")[1];
    var tempId = $scope.addedPictures[Math.floor(Math.random() * allPictures.length)];
    tempImg.id = 'gen' + tempId;
    /*var style = document.createElement('style');
     style.type = 'text/css';
     style.innerHTML = "img.bottom {  border: 1px solid #cccccc;padding : 10px 10px 10px 10px;\
     -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,1), inset 0 2px 1px rgba(255,255,255,.5), inset 0 -9px 2px rgba(0,0,0,.6), inset 0 -12px 2px rgba(255,255,255,.3);\
     -moz-box-shadow: inset 0 0 4px rgba(0,0,0,1), inset 0 2px 1px rgba(255,255,255,.5), inset 0 -9px 2px rgba(0,0,0,.6), inset 0 -12px 2px rgba(255,255,255,.3);\
     -box-shadow: inset 0 0 4px rgba(0,0,0,1), inset 0 2px 1px rgba(255,255,255,.5), inset 0 -9px 2px rgba(0,0,0,.6), inset 0 -12px 2px rgba(255,255,255,.3);\
     -webkit-border-radius: 20px;\
     -moz-border-radius: 20px;\
     border-radius: 20px}";
     document.getElementsByTagName('head')[0].appendChild(style);*/

    tempImg.className = 'lotto';
    $scope.pairImage = document.getElementById(tempId);
    var tempSrc = $scope.pairImage.src;
    tempImg.src = tempSrc;
    //var directoryReader = fs.root.createReader();


  });
  $http.get('/lottoGame/data.json')
    .then(function (res) {
      $scope.imagesData = res.data.imagesData;
    });


  $scope.refresh = function refreshImage() {
    var tempImg = document.getElementById("tempimg").getElementsByTagName("img")[1];
    var lastId = document.getElementById("tempimg").getElementsByTagName("img")[1].id.split('gen')[1];
    var totalPictures = $scope.addedPictures.length;
    var tempId = $scope.addedPictures[Math.floor(Math.random() * totalPictures)];
    while (tempId == lastId || $scope.removedPictures.indexOf(tempId.toString()) > -1)
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
      $scope.removedPictures.push($scope.pairImage.id);
      $scope.addedPictures.splice($scope.addedPictures.indexOf($scope.pairImage.id).toString(), 1);
      $scope.pairImage.parentElement.removeChild($scope.pairImage);
      if ($scope.addedPictures.length == 0) alert("Finishhh!!!");
      else {
        $scope.refresh();
      }
    }
  }

});


