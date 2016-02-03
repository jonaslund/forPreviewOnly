/**
 * For Preview Only website
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var fs = require("fs");
var pool = require("./lib/db");
var hostname = require("os").hostname();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat is so cute I die a little over and over', cookie: { maxAge: 6000000 }, saveUninitialized: true, resave: true}));

app.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
});

app.get('/', preview, function(req, res) {
  res.render('home');    
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



/**
 * init Loop – get all captions for current hour
 */

var events = [];
var nextShift = 0;
var totalSeconds = 0;
var secondsOffset = 6;

function initLoop(status) {
  var getHour = getHourSecondsInterval();
  totalSeconds = getHour[0];  

  pool.query("SELECT * FROM works WHERE totalSecondsStart > ? AND totalSecondsEnd < ?", [getHour[0], getHour[1]], function(works) {
    if(works) {    
      events = works;    
      
      nextShift = parseInt(events[0].totalSecondsStart) + secondsOffset;
      
      if(status !== "nostart") {
        eventLoop();
      }
    
    } else {
      setTimeout(function() {
        initLoop("start");
      }, 10000);
    }
  
  });  
}

/**
 * event loop – loop to find out when to switch captions or get new ones
 */

function eventLoop() {
  var d = new Date();
  totalSeconds++;  

  if(d.getSeconds() === 0 && d.getMinutes() === 0) {
    //new hour, reload initLoop;
    console.log("new hour!!!");
    initLoop("nostart");
  }
  
  if(totalSeconds > nextShift) {
    if(events.length > 1 ) {
      
      //emit new caption to all clients
      io.sockets.emit("subtitle", {data: events[0].title + " (" + events[0].year +"), " + events[0].artist});
      
      //remove sent caption from array
      events.shift(); 

      if(events[0] !== undefined) {
        nextShift = parseInt(events[0].totalSecondsStart) + secondsOffset;
      }      
    }
  } 

  setTimeout(function() {
    eventLoop();    
  }, 1000);
}

function getHourSecondsInterval() {
  var d = new Date();
  var totalBeginSeconds = (d.getHours()*60*60)+(d.getMinutes()*60)+d.getSeconds();
  var totalEndSeconds = (d.getHours()*60*60)+3600;

  return [totalBeginSeconds, totalEndSeconds];
}

io.on('connection', function (socket) {
  // socket.emit("subtitle", {data: events[0].title + " (" + events[0].year +"), " + events[0].artist});
});

/**
 * Start initLoop with start flag
 */
initLoop("start");


/**
 * Secret Preview Link Hash
 */

app.get("/preview/t0asfn15888sdannn", function(req, res) {
  req.session.preview = "yes";
  res.redirect("/");
});

function preview(req, res, next) {  
  return next();
  // var hostname = require("os").hostname();  
  // if(req.session.preview === "yes") {
  //   return next();      
  // } else {
    
  //   if(hostname === "airbiz.local") {
  //     next();
  //   } else {
  //     res.render("preview");    
  //  }
  
  //  return;
  // }
}

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
