// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova' ,'homeModule', 'lottoModule', 'memoryModule', 'memoryConfigModule', 'gamesServicesModule', 'imageModule', 'lottoConfigModule', 'UsersListModule', 'UsersListServices', 'initialMemoryModule'])

.constant('LOTTO_GAME_JSON','lottoGame/data.json')
.constant('MEMORY_GAME_JSON','memoryGame/data.json')
.constant('LOTTO_GAME_IMAGE_DIRECTORY','lottoGame/img/')
.constant('MEMORY_GAME_IMAGE_DIRECTORY','memoryGame/img/')
.constant('LOTTO_GAME_NAME','lotto')
.constant('MEMORY_GAME_NAME','memory')

.run(function($ionicPlatform, ImageService, LOTTO_GAME_JSON, MEMORY_GAME_JSON, LOTTO_GAME_IMAGE_DIRECTORY, MEMORY_GAME_IMAGE_DIRECTORY, LOTTO_GAME_NAME, MEMORY_GAME_NAME) {
  // we have to wait for the $ionicPlatform.ready event to make sure the device is ready.
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	  ImageService.initDB();
    ImageService.loadImagesFromJson(LOTTO_GAME_JSON, LOTTO_GAME_IMAGE_DIRECTORY, LOTTO_GAME_NAME);
    ImageService.loadImagesFromJson(MEMORY_GAME_JSON, MEMORY_GAME_IMAGE_DIRECTORY , MEMORY_GAME_NAME);
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
    .state('lottoConfig', {
      url: '/lottoConfig',
      templateUrl: 'lottoGame/lottoConfig.html'
    })
		.state('memoryConfig', {
			url: '/memoryConfig',
			templateUrl: 'memoryGame/memoryConfig.html'
		})
		.state('image', {
			url: '/image',
			templateUrl: 'image/image.html' /*,
			controller: 'ImageCtrl'*/
		})
		.state('user', {
			url: '/user',
			templateUrl: 'user/user.html',
			controller: 'UserCtrl'
		})
    .state('users', {
      url: '/users',
      templateUrl: 'usersListItems/list-template.html',
      controller: 'UsersListCtrl'
    })
    .state('initialMemory', {
      url: '/initialMemory',
      templateUrl: 'memoryGame/initialMemory.html'
    })
		$urlRouterProvider.otherwise('/home');

});


