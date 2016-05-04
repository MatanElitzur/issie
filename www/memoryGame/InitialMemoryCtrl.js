angular.module('initialMemoryModule').controller('InitialMemoryCtrl', ['$ionicHistory','$ionicPlatform' , function($ionicHistory, $ionicPlatform){
  var vm = this;

  var isWebView = ionic.Platform.isWebView(); // Check if we are running within a WebView (such as Cordova or PhoneGap).
  vm.iconHeight = true;
  $ionicPlatform.ready(function() {
    if(isWebView) {
      vm.iconHeight = false;
    }
  });

  vm.goBack = function() {
    $ionicHistory.goBack();
  }

  vm.canvasDraw = function() {
    canvasDraw1();
    canvasDraw2();
  }

  function canvasDraw1() {
    var canvas = document.getElementById('canvasDraw1');
    if (canvas.getContext){
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
      ctx.moveTo(110,75);
      ctx.arc(75,75,35,0,Math.PI,false);  // Mouth (clockwise)
      ctx.moveTo(65,65);
      ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
      ctx.moveTo(95,65);
      ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
      ctx.stroke();
    }
  }

  function canvasDraw2() {
    var canvas = document.getElementById('canvasDraw2');
    if (canvas.getContext){
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
      ctx.moveTo(110,75);
      ctx.arc(75,75,35,0,Math.PI,false);  // Mouth (clockwise)
      ctx.moveTo(65,65);
      ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
      ctx.moveTo(95,65);
      ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
      ctx.stroke();

      var ctx1 = canvas.getContext('2d');
      ctx1.strokeStyle = "green";
      ctx1.lineWidth = 5;
      ctx1.beginPath();
      //ctx1.arc(75,75,50,0,Math.PI*2,true); // Outer circle
      ctx1.arc(185,75,50,0,Math.PI*2,true); // Outer circle
      ctx1.moveTo(220,75);
      ctx1.arc(185,75,35,0,Math.PI,false);  // Mouth (clockwise)
      ctx1.moveTo(175,65);
      ctx1.arc(170,65,5,0,Math.PI*2,true);  // Left eye
      ctx1.moveTo(205,65);
      ctx1.arc(200,65,5,0,Math.PI*2,true);  // Right eye
      ctx1.stroke();

    }
  }

}]);
