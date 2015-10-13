// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'homeModule', 'lottoModule', 'memoryModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

//UI router
.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider.
		state('home',{
			url: '/home',
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl'
		})
		.state('memory', {
			url: '/memory',
			templateUrl: 'memoryGame/memory.html',
			controller: 'MemoryCtrl'
		})
		.state('lotto', {
			url: '/lotto',
		    templateUrl: 'lottoGame/lotto.html',
			controller: 'LottoCtrl'
		})
		.state('memoryconfig', {
			url: '/memoryconfig',
			templateUrl: 'memoryGame/memoryConfig.html',
			controller: 'MemoryConfigCtrl'
		})
		$urlRouterProvider.otherwise('/home');
	
});


