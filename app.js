var connect = require('connect'),
	http = require('http'),
	PORT = 8000;

connect()
	.use(connect.static(__dirname + '/public'))
	.listen(PORT);

console.log('listening on port ' + PORT)