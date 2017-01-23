var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('dist/front'))

// viewed at http://localhost:80
app.get('/', function(req, res) {
    res.sendFile(path.join('./front/index.html'));
});

app.listen(8090);
