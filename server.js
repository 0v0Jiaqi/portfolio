const express = require('express');
const app = express();
app.use(express.static(__dirname + '/src'));
app.get('/', function(req, res) {
res.sendFile(__dirname + '/src/index.html');
});
let server = app.listen(8888, function(){
console.log("App server is running on port 8888");
});
