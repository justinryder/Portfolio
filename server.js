var path = require('path'),
    express = require('express'),
    app = express()

var appDirectory = path.join(__dirname, 'app')
app.use(express.static(appDirectory))
console.log('server using static ' + appDirectory)

app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(appDirectory, '404.html'))
})

var port = 80
app.listen(port)
console.log('server listening on port ' + port)
