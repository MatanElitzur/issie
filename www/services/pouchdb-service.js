angular.module('gamesServicesModule').factory('ImageService', ['$q', function($q) {
    var _db;

    // We'll need this later.
    var _images;

    return {
        initDB: initDB,

        // We'll add these later.
        getAllImages: getAllImages,
        addImage: addImage,
        deleteImage: deleteImage
    };

    function initDB() {
        // Creates the database or opens if it already exists
        //Create a WebSQL-only Pouch (e.g. when using the SQLite Plugin for Cordova/PhoneGap):
        _db = new PouchDB('images', {adapter: 'websql'});
       /* On a mobile device the adapter will be displayed as websql even if it is using SQLite,
          so to confirm that it is actually using SQLite you'll have to do this*/
        _db.info().then(console.log.bind(console));

        //_db.destroy();
        //_db = new PouchDB('images', {adapter: 'websql'});
    };

    function addImage(imgObj) {
        //with the post method, PouchDB will generate an _id for you
        $q.when(_db.post(imgObj)).then(function(succees){
          console.log('Succeed to add image: ' + imgObj.image + " to pouchdb database");
        }, function(error){
          console.log('Failed to add image: ' + imgObj.image + " to pouchdb database "+ " Error: " + error);
        });
    };

    function deleteImage(image) {
        return $q.when(_db.remove(image));
    };

    function getAllImages() {
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
    };

    function onDatabaseChange(change) {
        var index = findIndex(_images, change.doc.id);
        var image = _images[index];

        if (change.deleted) {
            if (image) {
                _images.splice(index, 1); // delete
            }
        } else {
            if (image && image._id === change.doc.id) {
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

}]);
