angular.module('todo', [
  'restangular'
]);

angular.module('todo').config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost:3000/api/v1');
  RestangularProvider.setRestangularFields({ id: "_id" });
});

angular.module('todo').service('Tasks', function (Restangular) {
  var self = this,
      tasks = Restangular.all('tasks');

  this.model = tasks.getList().$object;

  this.post = function (task) {
    tasks.post(task).then(function (res) {
      self.model.unshift(res);
    });
  };

  this.remove = function (task) {
    task.remove();
    self.model.splice(self.model.indexOf(task), 1);
  };

});

angular.module('todo').controller('ListCtrl', function ($scope, Tasks, $log) {

  $scope.tasksList = Tasks;

  $scope.saveTask = function (taskName) {
    var newTask = {name: taskName };
    Tasks.post(newTask);
    $scope.newTask = '';
  };

  $scope.remove = function (task) {
    Tasks.remove(task);
  };

});