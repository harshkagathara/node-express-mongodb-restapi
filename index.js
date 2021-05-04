const express = require('express');
const bodyParser = require('body-parser');
require('./app/DB.js');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

require('./app/Routes/note.routes.js')(app);

app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});