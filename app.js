var Board = require('./bin/Board.js');
var debug = require('debug')('battleship:app');
var logger = require('morgan');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var app = express();


/////////////////////////
// BATTLESHIP SETTINGS //
/////////////////////////

var config = {
  "size": 10, // our board size (only a square grid is allowed)
  "fleet": { // boats that we want on the board
    "carrier": 1,
    "battleship": 1,
    "submarine": 1,
    "destroyer": 2,
    "patrol_boat": 1,
  },
  "shipsLengths": { // how long each boat is
    "carrier": 5,
    "battleship": 4,
    "submarine": 3,
    "destroyer": 3,
    "patrol_boat": 2
  }
};

// here we go!
app.locals.game = new Board(config);

debug('Game ID: ' + app.locals.game._id);


///////////////////
// Express setup //
///////////////////

// Routes
var client = require('./routes/client'); // Client page route

var game = require('./routes/game');
var fire = require('./routes/fire');

// Middlewares
app.use(favicon(path.join(__dirname + '/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Public folder setup
app.use(express.static(path.join(__dirname, 'public')));

// Attach views
app.use('/', client); // Client page view

// Attach routes
app.use('/api/game', game);
app.use('/api/fire', fire);

// Catch 404 and next() to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler development (will print stacktrace)
app.use(function(err, req, res) {
  res.status(err.status || 500);

  res.render('error', {
    message: err.message,
    error: err
  });

});

module.exports = app;
