angular.module('imageModule').controller('ImageCtrl', ['$scope' ,'$cordovaImagePicker','$cordovaFile', 'ImageService', function($scope ,$cordovaImagePicker ,$cordovaFile, ImageService){

    $scope.images = [];

    function getImages() {
        $scope.images = ImageService.getImages();
    }

    $scope.imagePicker = function(){
        $cordovaImagePicker.getPictures(
            function(results){
                for(var i = 0 ; i < results.length ; i++){
                    console.log('Image URI: ' + results[i]);
                    //$scope.images.push(results[i]);
                    //createFileEntry(results[i]);
                    copyFile(results[i]);
                }
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            }, function (error){
                console.log('Error: ' + error);
            }
        );
    }

/*
    function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
    }
*/
    function copyFile(imageUrl) {
        return $q(function(resolve, reject) {
            var nameOfFile = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
            var nameOfFilePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
            var newNameOfFile = makeid() + nameOfFile;
                                 //path, fileName, newPath, newFileName
            $cordovaFile.copyFile(nameOfFilePath, nameOfFile, cordova.file.dataDirectory, newNameOfFile)
                .then(function(info) {
                    ImageService.addImage(newName);
                    resolve();
                }, function(e) {
                    reject();
                });

/*
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;

        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                fileEntry.copyTo(
                    fileSystem2,
                    newName,
                    onCopySuccess,
                    fail
                );
            },
            fail);*/
        })
    }
/*
    function onCopySuccess(entry) {
        $scope.$apply(function () {
            $scope.images.push(entry.nativeURL);
            window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify($scope.images));
        });
    }

    function fail(error) {
        console.log("fail: " + error.code);
    }
*/
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }





}]);
