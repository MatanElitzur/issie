angular.module('userModule').controller('UserCtrl', ['$scope', '$http', 'jsonLoaderService', function($scope, $http, jsonLoaderService){
    $scope.imagesData = jsonLoaderService.loadJson('lottoGame/data.json');

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
}]);
