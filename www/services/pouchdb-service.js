angular.module('gamesServicesModule').service('ImageService', ['$q', '$http', function($q, $http) {
    var imageService = this;
    var _db;

    // We'll need this later.
    var _images;

  imageService.initDB  = function() {
        // Creates the database or opens if it already exists
        //Create a WebSQL-only Pouch (e.g. when using the SQLite Plugin for Cordova/PhoneGap):
        _db = new PouchDB('images', {adapter: 'websql'});
       /* On a mobile device the adapter will be displayed as websql even if it is using SQLite,
          so to confirm that it is actually using SQLite you'll have to do this*/
        _db.info().then(console.log.bind(console));
       //To remove all content from DB remove comment from the following lines and deploy to device then
       //commant the lines and again deploy to device
       //_db.destroy();
       //_db = new PouchDB('images', {adapter: 'websql'});

      getAllImagesFromRepositories();
  }

  imageService.addImage = function(imgObj) {
        //with the post method, PouchDB will generate an _id for you
        $q.when(_db.post(imgObj)).then(function(succees){
          console.log('Succeed to add image: ' + imgObj.image + " to pouchdb database");
        }, function(error){
          console.log('Failed to add image: ' + imgObj.image + " to pouchdb database "+ " Error: " + error);
        });
    }

  imageService.updateImage = function(imgObj){
      var imageToUpdate = imageService.addJsonFormat(imgObj.image, imgObj.imageFromJsonFile, imgObj.addToLottoGame, imgObj.addToMemoryGame);
      $q.when(_db.put(imageToUpdate, imgObj._id,imgObj._rev)).then(function(succees){
        console.log('Succeed to update image: ' + imgObj.image + " to pouchdb database");
      }, function(error){
        console.log('Failed to update image: ' + imgObj.image + " to pouchdb database "+ " Error: " + error);
      });
    }

  imageService.addJsonFormat = function(imageFullPath, imageFromJsonFile, addToLottoGame, addToMemoryGame)
    {
      var imgObj = {};
      imgObj.image = imageFullPath;
      imgObj.imageFromJsonFile = imageFromJsonFile;
      imgObj.addToLottoGame = addToLottoGame;
      imgObj.addToMemoryGame = addToMemoryGame;
      return imgObj;
    }

  imageService.deleteImage = function(image) {
        return $q.when(_db.remove(image));
    }

  imageService.getAllImagesFromDB = function() {
        if (!_images) {
            return $q.when(_db.allDocs({ include_docs: true}))
                .then(function(docs) {
                   // Each row has a .doc object and we just want to send an
                   // array of birthday objects back to the calling controller,
                   // so let's map the array to contain just the .doc objects.
                    _images = docs.rows.map(function(row) {
                                return row.doc;
                                //return /*cordova.file.dataDirectory*/ cordova.file.externalApplicationStorageDirectory + row.doc /*row.doc.imageName*/;
                             });

                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true})
                        .on('change', onDatabaseChange);

                    //var promise = addFilesystemPath();
                    //return promise;
                    return _images;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_images);
        }
    }

    function onDatabaseChange(change) {
        var index = findIndex(_images, change.doc._id);
        var image = _images[index];

        if (change.deleted) {
            if (image) {
                _images.splice(index, 1); // delete
            }
        } else {
            if (image && image._id === change.doc._id) {
                _images[index] = change.doc; // update
            } else {
                _images.splice(index, 0, change.doc) // insert
            }
        }
    }

// Binary search, the array is by default sorted by _id.
    function findIndex(array, id) {
        var low = 0, high = array.length, mid;
        while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }

  function getAllImagesFromRepositories(){
    getLottoImagesFromFS().then(function(imagesDataFromJson){
      console.log('Success to get images from json file');
      addLottoImagesFromJsonToDatabase(imagesDataFromJson).then(function(){
        console.log('Success to add images to database');
      }, function(error){
        console.log('Failed to add images from json to database, Error: ' + error);
      })
    }, function(error){
      console.log('Failed to get images from json file, Error: ' + error);
    })
  }

  function getLottoImagesFromFS(){
    var deferred = $q.defer();
    /*return*/ $http.get('lottoGame/data.json')
      .then(function(res){
        //imagesDataFromJson = res.data.imagesData;
        deferred.resolve(res.data.imagesData);
      });
    return deferred.promise;
  }

  function addLottoImagesFromJsonToDatabase(imagesDataFromJson){
    var deferred = $q.defer();
    imageService.getAllImagesFromDB().then(function(imagesFromDB){
      for(var i = 0 ; i < imagesDataFromJson.length ; i++){
        var nameOfFileFromJson = imagesDataFromJson[i].fileName.substr(imagesDataFromJson[i].fileName.lastIndexOf('/') + 1);
        var imageExistsInDB = false;
        for(var j = 0 ; j < imagesFromDB.length ; j++){
          var nameOfFileFromDB = imagesFromDB[j].image.substr(imagesFromDB[j].image.lastIndexOf('/') + 1);
          if(nameOfFileFromJson == nameOfFileFromDB){
            //Image exists in DB
            imageExistsInDB = true;
            break;
          }
        }

        if(imageExistsInDB == false){
          //Add image to db
          imageService.addImage(imageService.addJsonFormat('lottoGame/img/' + nameOfFileFromJson, true,
            imagesDataFromJson[i].addToLottoGame,
            imagesDataFromJson[i].addToMemoryGame));
        }
      }
      deferred.resolve();
    });
    return deferred.promise;
  }
}]);
