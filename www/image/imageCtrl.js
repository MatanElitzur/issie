angular.module('imageModule').controller('ImageCtrl', ['$scope' ,'$cordovaFile','$http','$ionicPlatform','$window', '$rootScope', function($scope ,$cordovaFile ,$http, $ionicPlatform, $window, $rootScope){

    var IMAGE_STORAGE_KEY = 'images';
    $scope.images = [];

    function getImages() {
        var localStorageImages = window.localStorage.getItem(IMAGE_STORAGE_KEY);
        if (localStorageImages) {
            $scope.images = JSON.parse(localStorageImages);
        } else {
            $scope.images = [];
        }
        return $scope.images;
    }

    $scope.imagePicker = function(){
        window.imagePicker.getPictures(
            function(results){
                for(var i = 0 ; i < results.length ; i++){
                    console.log('Image URI: ' + results[i]);
                    //$scope.images.push(results[i]);
                    createFileEntry(results[i]);
                }
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            }, function (error){
                console.log('Error: ' + error);
            }
        );
    }


    function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
    }

    function copyFile(fileEntry) {
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
            fail);
    }

    function onCopySuccess(entry) {
        $scope.$apply(function () {
            $scope.images.push(entry.nativeURL);
            window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify($scope.images));
        });
    }

    function fail(error) {
        console.log("fail: " + error.code);
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i=0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }



    /*	$ionicPlatform.ready(function() {

     //show('Accessing Filesystem.. Please wait');
     $window.requestFileSystem($window.LocalFileSystem.PERSISTENT, 0, function(fs) {
     //console.log("fs", fs);

     var directoryReader = fs.root.createReader();

     directoryReader.readEntries(function(entries) {
     var arr = [];
     processEntries(entries, arr); // arr is pass by refrence
     $scope.files = arr;
     //$rootScope.hide();
     },
     function(error) {
     console.log(error);
     });
     },
     function(error) {
     console.log(error);
     });

     $scope.showSubDirs = function(file) {

     if (file.isDirectory || file.isUpNav) {
     if (file.isUpNav) {
     processFile(file.nativeURL.replace(file.actualName + '/', ''));
     } else {
     processFile(file.nativeURL);
     }
     } else {
     if (hasExtension(file.name)) {
     if (file.name.indexOf('.mp4') > 0) {
     // Stop the audio player before starting the video
     $scope.stopAudio();
     VideoPlayer.play(file.nativeURL);
     } else {
     fsResolver(file.nativeURL, function(fs) {
     //console.log('fs ', fs);
     // Play the selected file
     AudioSvc.playAudio(file.nativeURL, function(a, b) {
     //console.log(a, b);
     $scope.position = Math.ceil(a / b * 100);
     if (a < 0) {
     $scope.stopAudio();
     }
     if (!$scope.$$phase) $scope.$apply();
     });

     $scope.loaded = true;
     $scope.isPlaying = true;
     $scope.name = file.name;
     $scope.path = file.fullPath;

     // show the player
     $scope.player();

     $scope.pauseAudio = function() {
     AudioSvc.pauseAudio();
     $scope.isPlaying = false;
     if (!$scope.$$phase) $scope.$apply();
     };
     $scope.resumeAudio = function() {
     AudioSvc.resumeAudio();
     $scope.isPlaying = true;
     if (!$scope.$$phase) $scope.$apply();
     };
     $scope.stopAudio = function() {
     AudioSvc.stopAudio();
     $scope.loaded = false;
     $scope.isPlaying = false;
     if (!$scope.$$phase) $scope.$apply();
     };

     });
     }
     } else {
     $rootScope.toggle('Oops! We cannot play this file :/', 3000);
     }

     }

     }

     function fsResolver(url, callback) {
     $window.resolveLocalFileSystemURL(url, callback);
     }

     function processFile(url) {
     fsResolver(url, function(fs) {
     //console.log(fs);
     var directoryReader = fs.createReader();

     directoryReader.readEntries(function(entries) {
     if (entries.length > 0) {
     var arr = [];
     // push the path to go one level up
     if (fs.fullPath !== '/') {
     arr.push({
     id: 0,
     name: '.. One level up',
     actualName: fs.name,
     isDirectory: false,
     isUpNav: true,
     nativeURL: fs.nativeURL,
     fullPath: fs.fullPath
     });
     }
     processEntries(entries, arr);
     $scope.$apply(function() {
     $scope.files = arr;
     });

     $ionicScrollDelegate.scrollTop();
     } else {
     $rootScope.toggle(fs.name + ' folder is empty!', 2000);
     }
     },
     function(error) {
     console.log(error);
     });
     });
     }

     function hasExtension(fileName) {
     var exts = ['.jpg', '.png'];
     return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
     }

     function processEntries(entries, arr) {

     for (var i = 0; i < entries.length; i++) {
     var e = entries[i];

     // do not push/show hidden files or folders
     if (e.name.indexOf('.') !== 0) {
     arr.push({
     id: i + 1,
     name: e.name,
     isUpNav: false,
     isDirectory: e.isDirectory,
     nativeURL: e.nativeURL,
     fullPath: e.fullPath
     });
     }
     }
     return arr;
     }

     });*/

}]);
