angular.module('UsersListModule', [])

  .constant("ISSIE_COVER_IMAGE", "../memoryGame/coverImg/coverImage.png")

  .filter('filterMissingImage',['ISSIE_COVER_IMAGE', function(ISSIE_COVER_IMAGE){
    //// Create the return function and set the required parameter name to **input**
    return function(input){
      var out = [];
      // Using the angular.forEach method, go through the array of data and check if it's a lotto image
      angular.forEach(input, function(user) {
        if(user.img == undefined){
          user.img = ISSIE_COVER_IMAGE;
        }
        out.push(user);
      })
      return out;
    };
  }])

  .controller('UsersListCtrl', ['PlayersListFactory', '$scope', '$ionicModal', '$ionicHistory', '$ionicPopup', 'ImageService', "ISSIE_COVER_IMAGE",/*'ADD_CHANGE_DIALOG',*/
    function(PlayersListFactory, $scope, $ionicModal, $ionicHistory, $ionicPopup, ImageService, ISSIE_COVER_IMAGE /*, ADD_CHANGE_DIALOG*/) {

      var currentEditUser;
      $scope.imagesData = null;
      // Get list from storage
      $scope.list = PlayersListFactory.getList();

      $scope.user = {
        name: '',
        play: false,
        img: ISSIE_COVER_IMAGE
      };

      (function(){
        ImageService.getAllImagesFromDB().then(function(result){
          $scope.imagesData = result;
        });

        displayAddChangeModal();
        displayAllImagesModal();

      })()

      // Load the add / change dialog from the given template URL
      $ionicModal.fromTemplateUrl('usersListItems/add-change-dialog.html', function(modal) {
        $scope.addDialog = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      $scope.showAddChangeDialog = function(action) {
        $scope.action = action;
        if(action === 'add')
          initUserVariabels()
        $scope.addDialog.show();
      };

      //Display all images modal
      function displayAllImagesModal() {
        $ionicModal.fromTemplateUrl('usersListItems/add-change-userImage.html', function(modal) {
          $scope.addEditUserImageModal = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });
      }

      //Display user modal
      function displayAddChangeModal() {
        $ionicModal.fromTemplateUrl('usersListItems/add-change-dialog.html', function(modal) {
          $scope.addDialog = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });
      }

      $scope.showAddChangeUserImageModal = function(action) {
        $scope.addEditUserImageModal.show();
      };

      function initUserVariabels(){
        $scope.user.name = "";
        $scope.user.play = false;
        $scope.user.img = ISSIE_COVER_IMAGE;
    }

      $scope.leaveAddChangeDialog = function() {
        // Remove dialog
        $scope.addDialog.remove();
        // Reload modal template to have cleared form
        displayAddChangeModal();
      };

      $scope.leaveAddChangeUserImage = function(){
        $scope.addEditUserImageModal.remove();
        displayAllImagesModal();
      }

      $scope.$on('$destroy', function() {
        $scope.addDialog.remove();
        $scope.addEditUserImageModal.remove();
      });

      $scope.goBack = function(){
        $ionicHistory.goBack();
      }

      // Used to cache the empty form for Edit Dialog
      $scope.saveEmpty = function(form) {
        $scope.form = angular.copy(form);
      }

      $scope.addItem = function(form) {
        if(form.userName.$modelValue) {
          var newUser = {};
          // Add values from form to object
          newUser.name = form.userName.$modelValue;
          newUser.play = form.play.$modelValue;
          if(ISSIE_COVER_IMAGE != form.userImg.$modelValue) {
            newUser.img = form.userImg.$modelValue;
          }
          // If this is the first item it will be the default item
          if ($scope.list.length == 0) {
            newUser.play = true;
            PlayersListFactory.addToPlayersList(newUser);
          }
          else {
            // Remove old default entry from list and add the new one
            if (newUser.play) {
              PlayersListFactory.arrangePlayersList(newUser);
              PlayersListFactory.addToPlayersList(newUser);
            }
          }
          // Save new list in scope and factory
          $scope.list.push(newUser);
          PlayersListFactory.setList($scope.list);
          // Close dialog
          $scope.leaveAddChangeDialog();
        }
      };

      $scope.deleteUser = function(){
        var deleteUserPopup = $ionicPopup.confirm({
          title: "<div class='icon ion-alert-circled'> מחק </div>" ,
          template: "<div style='direction: rtl;'> המשתמש ימחק </div>",
          cancelText: ' לא ',
          okText: ' אישור '
        });

        deleteUserPopup.then(function(res) {
          if(res) {
            PlayersListFactory.deleteUserFromList(currentEditUser);
            // Close dialog
            $scope.leaveAddChangeDialog();
          }
        });
      }
/*
      function deleteUserFromList() {
        var indexOfCurrentUserInPlayersList = playersList.indexOf(currentEditUser);
        if(indexOfCurrentUserInPlayersList != -1){
          playersList.splice(indexOfCurrentUserInPlayersList,1);
        }
        // Search current edit user
        var currentEditUserIndex = $scope.list.indexOf(currentEditUser);
        // Destroy current edit user
        $scope.list.splice(currentEditUserIndex, 1);
        // Save list in factory
        ListFactory.setList($scope.list);
      }
*/

      $scope.makeDefault = function(user) {
        PlayersListFactory.makePlayerDefault(user);
      }
 /*
      $scope.makeDefault = function(user) {
        var indexOfUser = playersList.indexOf(user);
        var newDefaultIndex = $scope.list.indexOf(user);

        if(user.play){
          //Remove play
          playersList.splice(indexOfUser,1);
          $scope.list[newDefaultIndex].play = false;
        }
        else{
          //Add play
          ListFactory.arrangePlayersList(user);
          $scope.list[newDefaultIndex].play = true;
          if(indexOfUser == -1){
            ListFactory.addToPlayersList(user);
          }
        }

        ListFactory.setList($scope.list);
      }
   */
/*
      function arrangePlayersList(user) {
        if(playersList.length == 2) {
          var indexOfUserInPlayerList = playersList.indexOf(user);
          if(indexOfUserInPlayerList == -1) {
            //The player is not in the playersList therefore we remove the oldest player from
            // the playersList
            var firstPlayerToRemoveObj = playersList[0];
            var firstPlayerToRemoveObjIndex = $scope.list.indexOf(firstPlayerToRemoveObj);
            $scope.list[firstPlayerToRemoveObjIndex].play = false;
            ListFactory.setList($scope.list);
            playersList.shift(); // Remove the first user to make place for a new default user
          }
          else{
            ////The player is in the playersList
            var indexOfUser = $scope.list.indexOf(user);
            $scope.list[indexOfUser].play = false;
            ListFactory.setList($scope.list);
          }
        }
      }
*/
      $scope.showEditItem = function(user) {
        currentEditUser = user;
        //currentEditUser = angular.copy(item);
        //currentEditUser.name = item.userName;
        //currentEditUser.play = item.play;
        //currentEditUser.img = item.img;

        $scope.user.name = user.name;
        $scope.user.play = user.play;
        $scope.user.img = user.img;
        // Open dialog
        $scope.showAddChangeDialog('change');
      }

      $scope.editItem = function(form) {
        var user = {};
        user.name = form.userName.$modelValue;
        user.play = form.play.$modelValue;
        if(ISSIE_COVER_IMAGE != form.userImg.$modelValue) {
          user.img = form.userImg.$modelValue;
        }
        var editIndex = $scope.list.indexOf(currentEditUser);
        //var editIndex = ListFactory.getList().indexOf(currentEditUser);
        $scope.list[editIndex] = user;
        PlayersListFactory.arrangePlayersList(user);
        PlayersListFactory.setList($scope.list);
        $scope.leaveAddChangeDialog();
      }

      $scope.editUserImage = function(image) {
        $scope.user.img = image;
        $scope.leaveAddChangeUserImage();
      }



    }
  ]);
