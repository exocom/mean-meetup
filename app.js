'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express(),
    server = http.Server(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.use(express.favicon());
app.use(express.logger('dev'));
var bodyParser = express.bodyParser();

app.use(function(req,res,next){
    if(req.get('content-type') && req.get('content-type').indexOf('multipart/form-data') === 0) {
        return next();
    }
    bodyParser(req,res,next);
});
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

require('./api/routes')(app); // API routes

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});