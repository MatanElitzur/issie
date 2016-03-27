angular.module('UsersListServices', [])
  .factory('PlayersListFactory', function() {

    var list = [];
    var playersList = [];

    var listStore = localStorage.getItem("list");
    if (listStore != null && listStore != '' && angular.isArray(angular.fromJson(listStore))) {
      list = angular.fromJson(listStore);
      initPlayerList();
    }

    function initPlayerList() {
      angular.forEach(list , function (currentUser){
          if(currentUser.play){
            playersList.push(currentUser);
          }
        });
      }

    var listSrv = {
      setList: function(newList) {
        list = newList;
        localStorage.setItem("list", angular.toJson(list));
        return true;
      },
      getList: function() {
        if (list != null) {
          return list;
        } else {
          return [];
        }
      },
      addToPlayersList: function(player) {
        playersList.push(player);
      },
      getPlayersList: function() {
        return playersList;
      },
      arrangePlayersList: function(user) {
        if(playersList.length == 2) {
          var indexOfUserInPlayerList = playersList.indexOf(user);
          if(indexOfUserInPlayerList == -1) {
            //The player is not in the playersList therefore we remove the oldest player from
            // the playersList
            var firstPlayerToRemoveObj = playersList[0];
            var firstPlayerToRemoveObjIndex = list.indexOf(firstPlayerToRemoveObj);
            list[firstPlayerToRemoveObjIndex].play = false;
            this.setList(list);
            playersList.shift(); // Remove the first user to make place for a new default user
          }
          else{
            ////The player is in the playersList
            var indexOfUser = list.indexOf(user);
            list[indexOfUser].play = false;
            this.setList(list);
          }
        }
      },
      deleteUserFromList: function(currentEditUser) {
        var indexOfCurrentUserInPlayersList = playersList.indexOf(currentEditUser);
        if(indexOfCurrentUserInPlayersList != -1){
          playersList.splice(indexOfCurrentUserInPlayersList,1);
        }
        // Search current edit user
        var currentEditUserIndex = list.indexOf(currentEditUser);
        // Destroy current edit user
        list.splice(currentEditUserIndex, 1);
        // Save list in factory
        this.setList(list);
      },
      makePlayerDefault: function(user) {
        var indexOfUser = playersList.indexOf(user);
        var newDefaultIndex = list.indexOf(user);

        if(user.play){
          //Remove play
          playersList.splice(indexOfUser,1);
          list[newDefaultIndex].play = false;
        }
        else{
          //Add play
          this.arrangePlayersList(user);
          list[newDefaultIndex].play = true;
          if(indexOfUser == -1){
            this.addToPlayersList(user);
          }
        }

        this.setList(list);
      }


  };

    return listSrv;
  });
