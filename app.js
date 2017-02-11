(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        foundMenu: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'menu',
      bindToController: true
    };

    return ddo;
  }


  function FoundItemsDirectiveController() {
    var list = this;

    list.errorMessage = function() {
      var foundList = list.foundMenu;
      if (foundList.length == 0) {
        // console.log("false");
        return true;
      }
      return false;
    }
  }


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowIt = this;

    narrowIt.searchItem = "";

    narrowIt.found = MenuSearchService.displayMatchedMenu();
    // console.log(narrowIt.found);

    narrowIt.narrowItClick = function (searchItem) {
      MenuSearchService.getMatchedMenuItems(searchItem);

    }

    narrowIt.removeItem = function(itemIndex) {
      MenuSearchService.removeItem(itemIndex);
    }
  }


  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath)
  {
    var service = this;
    var matchFound = [];

    service.getAllMenuItems = function() {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });
      // console.log(response);

      return response;
    };

    service.getMatchedMenuItems = function(searchItem) {
      // matchFound = [];
      searchItem = searchItem.toLowerCase();
      if (searchItem == "") {
          matchFound = [];
      } else {
        var promise = service.getAllMenuItems();

        promise.then(function (matchedItem) {
          var listMenu = matchedItem.data.menu_items;

          //  if string not found, will return -1
          for (var i = 0; i < listMenu.length; i++) {
            var menuSearch = listMenu[i].description;

            if (menuSearch.toLowerCase().indexOf(searchItem) !== -1) {
              matchFound.push(listMenu[i]);
            }
          }

        })
        .catch(function(error) {
          // narrowIt.errorMessage = true;
          console.log("error");
        });
      }


    };

    service.removeItem = function (itemIndex) {
      matchFound.splice(itemIndex, 1);
    };

    service.displayMatchedMenu = function() {
      console.log(matchFound);
      return matchFound;
    }


  }

})();
