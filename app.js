(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };

    return ddo;
  }


  function FoundItemsDirectiveController() {
    var list = this;

    list.errorMessage = function() {

      var text = list.found;
      console.log("text:" + text);
      if (text.length == 0) {
        return true;
      }
      return false;
    }
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowIt = this;

    narrowIt.searchItem = "";

    narrowIt.narrowItClick = function (searchItem) {
      searchItem = searchItem.toLowerCase();
      var promise = MenuSearchService.getMatchedMenuItems(searchItem);
      // console.log(promise);
      promise.then(function (matchedItem) {
        var matchFound = [];
        for (var i = 0; i < matchedItem.length; i++) {

          //  if not found, will return -1
          if (matchedItem[i].description.toLowerCase().indexOf(searchItem) !== -1 ) {
            matchFound.push(matchedItem[i]);
          }
        }

        narrowIt.found = matchFound;
        console.log("found");
        console.log(narrowIt.found);
      })
      .catch(function(error) {
        narrowIt.errorMessage = error.message;
        console.log("error");
      });
      // console.log(narrowIt.found);
    }

    narrowIt.onRemove = function(itemIndex) {
      MenuSearchService.removeItem(itemIndex);
    }
  }


  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath)
  {
    var service = this;

    service.getMatchedMenuItems = function(searchItem) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
        // params: {
        //   description: searchItem
        // }
      });

      return response.then(function(result) {
        return result.data.menu_items;
      })
      console.log(response);

      // return response;
    };

    service.removeItem = function (itemIndex) {
      items.splice(itemIndex, 1);
    };

  }

})();
