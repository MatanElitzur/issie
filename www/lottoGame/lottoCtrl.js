app.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        $scope.$apply('onDragStart()');
        return false;
      },
      false
    );

    el.addEventListener(
      'touchmoe',
      function(e) {
        this.classList.remove('drag');
        $scope.$apply('onDrag()');
      },
      false
    );
  }
});

app.controller('LottoCtrl',['$scope', '$ionicGesture','$http', '$window' , function($scope, $ionicGesture, $http, $window, $interval) {
  $scope.$on('$ionicView.enter',function refreshImage(){
    //var tempImg = document.createElement("img");
    var tempImg  = document.getElementById("tempimg").getElementsByTagName("img")[1];
    var tempId = Math.floor( Math.random() * 8 );
    tempImg.id = 'gen'+  tempId;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "img.bottom {  border: 1px solid #cccccc;padding : 10px 10px 10px 10px;\
      -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,1), inset 0 2px 1px rgba(255,255,255,.5), inset 0 -9px 2px rgba(0,0,0,.6), inset 0 -12px 2px rgba(255,255,255,.3);\
      -moz-box-shadow: inset 0 0 4px rgba(0,0,0,1), inset 0 2px 1px rgba(255,255,255,.5), inset 0 -9px 2px rgba(0,0,0,.6), inset 0 -12px 2px rgba(255,255,255,.3);\
      -box-shadow: inset 0 0 4px rgba(0,0,0,1), inset 0 2px 1px rgba(255,255,255,.5), inset 0 -9px 2px rgba(0,0,0,.6), inset 0 -12px 2px rgba(255,255,255,.3);\
      -webkit-border-radius: 20px;\
      -moz-border-radius: 20px;\
      border-radius: 20px;\
      width: 30%;\
      height: 40%;\
      display: block;\
      float:left;\
      margin-left: 33%;\
      margin-top: 8%;\
      position:absolute}";
    document.getElementsByTagName('head')[0].appendChild(style);

    tempImg.className = 'bottom';
    var tempSrc = document.getElementById(tempId).src;
    tempImg.src = tempSrc;

  });

  $http.get('./lottoGame/data.json')
    .then(function(res){
      $scope.imagesData = res.data.imagesData;
    });

  $http.get('js/data.json').success(function(data){
    $scope.artists = data.speakers;

    $scope.onItemDelete = function(item){
      $scope.artists.splice($scope.artists.indexOf(item), 1);
    }

    $scope.doRefresh = function(){
      $http.get('js/data.json').success(function(data){
        $scope.artists = data.speakers;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.toggleStar = function(item){
      item.star = !item.star;
    }

    $scope.moveItem = function(item, fromIndex, toIndex){
      $scope.artists.splice(fromIndex ,1 );
      $scope.artists.splice(toIndex, 0 , item );
    }
  });
  $scope.refresh = function refreshImage(){
    var tempImg  = document.getElementById("tempimg").getElementsByTagName("img")[1];
    var lastId = document.getElementById("tempimg").getElementsByTagName("img")[1].id.split('gen')[1];
    var tempId = Math.floor( Math.random() * 8 );
    while(tempId==lastId)
      tempId = Math.floor( Math.random() * 8 );
    tempImg.id = 'gen'+  tempId;
    tempImg.removeAttribute("style");
    tempImg.className =  document.getElementById("tempimg").getElementsByTagName("img")[1].className;
    var tempSrc = document.getElementById(tempId).src;
    tempImg.src = tempSrc;


  }
  $scope.lastEventCalled = 'Try to Drag the content up, down, left or rigth';
  var element = angular.element(document.querySelector('#tempid'));
  var events = [{
    event: 'dragup'
  },{
    event: 'dragdown'
  },{
    event: 'dragleft'
  },{
    event: 'dragright'
  },
    {
      event: 'dragstart'
    }];

  angular.forEach(events, function(obj){
    $ionicGesture.on(obj.event, function (event) {
      $scope.$apply(function () {
        $scope.lastEventCalled = obj.text;
        if(event.type=='dragstart') {
          $scope.offsetx = event.gesture.center.pageX-event.srcElement.getBoundingClientRect().left;
          $scope.offsety =  event.gesture.center.pageY-event.srcElement.getBoundingClientRect().right;
          event.srcElement.style.marginLeft = "0px";
        }
        event.srcElement.style.left = event.gesture.center.pageX+"px";
        event.srcElement.style.bottom = $window.innerHeight - event.gesture.center.pageY+"px";
      });
    }, element);
  });
}]);


