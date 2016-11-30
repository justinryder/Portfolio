var path = require('path');
var express = require('express');
var app = express();

var appDirectory = path.join(__dirname, 'app');
app.use(express.static(appDirectory));
console.log('server using static ' + appDirectory);

var port = 80;
app.listen(port);
console.log('server listening on port ' + port);
