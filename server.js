var express = require('express');
var app = express();

var appDirectory = __dirname + '\\app';
app.use(express.static(appDirectory));
console.log('server using static ' + appDirectory);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening on port ' + port);