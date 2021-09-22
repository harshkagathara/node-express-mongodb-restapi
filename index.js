const express = require('express');
const bodyParser = require('body-parser');
require('./App/DB.js');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
require('./App/Routes/note.routes.js')(app);

app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});