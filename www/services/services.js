//angular.module('services', ['ionic']);
angular.module('gamesServicesModule', [])
//jsonUrl --> 'js/data.json'
.service('jsonLoaderService', ['$http', function($http){
    this.loadJson = function(jsonUrl) {
		$http.get(jsonUrl).success(function(data) { 
			return data.imagesData;
		})
    }
}]);
