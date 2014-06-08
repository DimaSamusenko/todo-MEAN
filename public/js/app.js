angular.module('todo', [
  'ui.router',
  'restangular'
]);

angular.module('todo').config(function ($locationProvider, $urlRouterProvider, $stateProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('http://localhost:3000/api/v1');
  RestangularProvider.setRestangularFields({ id: "_id" });

  $locationProvider.hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('main', {
      url        : '/',
      templateUrl: 'views/partial-main.html'
    });
});

angular.module('todo').service('Tasks', function (Restangular) {
  var self = this,
      tasks = Restangular.all('tasks');

  this.model = tasks.getList().$object;

  this.add = function (task) {
    tasks.post(task).then(function (res) {
      self.model.unshift(res);
    });
  };

  this.remove = function (task) {
    task.remove();
    self.model.splice(self.model.indexOf(task), 1);
  };

  this.update = function (task) {
    task.save();
  }

});

angular.module('todo').controller('ListCtrl', function ($scope, Tasks, $log) {

  $scope.tasksList = Tasks;

  $scope.done = function (task) {
    task.is_done = !task.is_done;
    Tasks.update(task);
  };

  $scope.addTask = function (taskName) {
    var newTask = {name: taskName };
    Tasks.add(newTask);
    $scope.newTask = '';
  };

  $scope.remove = function (task) {
    Tasks.remove(task);
  };

});