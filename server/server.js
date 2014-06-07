var express = require('express'),
  mongoose = require("mongoose"),
  cors = require('cors'),
  bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/github-todo');

var app = express();
app.use(cors());
app.use(bodyParser());

var config = {
  api: '/api/v1'
};

var Schema = mongoose.Schema;

var TaskModel = new Schema({
  name: { type: String, required: true },
  created: { type: Date, default: Date.now }
});
var Task = mongoose.model('Task', TaskModel);


app.get(config.api + '/tasks', function (req, res) {
  Task.find(function (err, tasks) {
    res.send(tasks);
  });
});

app.post(config.api + '/tasks', function (req, res) {
  var task = new Task({name: req.body.name});
  task.save(function (err) {
    res.send(task);
  });
});

app.post(config.api + '/tasks', function (req, res) {
  var task = new Task({name: req.body.name});
  task.save(function (err) {
    res.send(200);
  });
});

app.delete(config.api + '/tasks/:id', function (req, res) {
  Task.findById(req.params.id, function (err, task) {
    task.remove(function (err) {
      res.send(200);
    });
  });
});

app.listen(3000);