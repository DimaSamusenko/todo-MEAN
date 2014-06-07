angular.module('extensions.restangular.auto-update', [
  'restangular'
]);

angular.module('extensions.restangular.auto-update')
  .factory('RestangularAutoUpdate', function RestangularAutoUpdate(Restangular) {

    // properties

    var _routes = [];

    // helper

    // TODO: setParentList needed for https://github.com/mgonto/restangular/issues/727.
    function setParentList(restangularizedElement, collection) {
      return Restangular.restangularizeElement(
        restangularizedElement.parentResource,
        restangularizedElement.plain(),
        restangularizedElement.route,
        restangularizedElement.fromServer,
        collection,
        restangularizedElement.reqParams
      );
    }

    // auto-update

    Restangular.setOnElemRestangularized(function(elem, isCollection, route) {
      // only add auto-update to registered routes
      if (!_.contains(_routes, route)) { return elem; }

      if (isCollection) {
        // auto-update on collection.post
        elem.post = _.wrap(elem.post, function(post, elementToPost, queryParams, headers) {
          return post(elementToPost, queryParams, headers).then(function(response) {
            // TODO: setParentList needed for https://github.com/mgonto/restangular/issues/727.
            elem.push(setParentList(response, elem));
            return elem;
          });
        });
      } else {
        // auto-update on model.get
        elem.get = _.wrap(elem.get, function(get, queryParams, headers) {
          return get(queryParams, headers).then(function(response) {
            if (elem.getParentList) {
              var parentList = elem.getParentList();
              // TODO: setParentList needed for https://github.com/mgonto/restangular/issues/727.
              parentList[parentList.indexOf(elem)] = setParentList(response, parentList);
            }
            return elem;
          });
        });

        // auto-update on model.remove
        elem.remove = _.wrap(elem.remove, function(remove, queryParams, headers) {
          return remove(queryParams, headers).then(function(response) {
            if (elem.getParentList) {
              var parentList = elem.getParentList();
              parentList.splice(parentList.indexOf(elem), 1);
            }
            return elem;
          });
        });
      }

      return elem;
    });

    // methods

    function addRoute(route) {
      _routes.push(route);
    }

    // service

    return {
      addRoute: addRoute
    };
  });