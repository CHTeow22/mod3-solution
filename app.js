(function () {
  'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html'
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowIt = this;

  narrowIt.narrowItClick = function (searchItem) {
    if (searchItem.length == 0) {
      narrowIt.message = "Nothing found";
    }
    MenuSearchService.getMatchedMenuItems(searchItem)
  }

}


function MenuSearchService()
{
  var service = this;

  service.getMatchedMenuItems = function(searchItem) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      params: {
        category: searchItem
      }
    });

    return response;
  };

}

})();
