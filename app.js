/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
var levelup = require('levelup')
var userDB = levelup('./db/users')
var groupDB = levelup('./db/groups')
var problemDB = levelup('./db/problems')
var solutionDB = levelup('./db/solutions')
var thoughtDB = levelup('./db/thoughts')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3010);
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
var user = require('./routes/user'),
  group = require('./routes/group'),
  problem = require('./routes/problem'),
  solution = require('./routes/solution'),
  thought = require('./routes/thought');

app.get('/users.json', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.adduser);
app.get('/authenticate', user.authenticate);
//app.put('/users/:id', user.updateUser);
//app.delete('/users/:id', user.deleteUser);

app.get('/groups', group.list);
app.get('/groups', group.findAll);
app.get('/groups/:id', group.findById);
app.post('/groups', group.addGroup);
app.put('/groups/:id', group.updateGroup);
app.delete('/groups/:id', group.deleteGroup);

app.get('/problems', problem.list);
app.get('/problems', problem.findAll);
app.get('/problems/:id', problem.findById);
app.post('/problems', problem.addProblem);
app.put('/problems/:id', problem.updateProblem);
app.delete('/problems/:id', problem.deleteProblem);

app.get('/solutions', solution.list);
app.get('/solutions', solution.findAll);
app.get('/solutions/:id', solution.findById);
app.post('/solutions', solution.addSolution);
app.put('/solutions/:id', solution.updateSolution);
app.delete('/solutions/:id', solution.deleteSolution);

app.get('/thoughts', thought.list);
app.get('/thoughts', thought.findAll);
app.get('/thoughts/:id', thought.findById);
app.post('/thoughts', thought.addThought);
app.put('/thoughts/:id', thought.updateThought);
app.delete('/thoughts/:id', thought.deleteThought);

var allowCrossDomain = function(req, res, next) {
  console.log("Allowing cross domain.")
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
