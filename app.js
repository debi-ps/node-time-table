const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
const PORT = config.get('app.port');

mongoose.connect(config.get('db.url'), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.listen(PORT, () => {
	console.log('Application is started on port ' + PORT);
});

app.get('/ping', async (req, res) => res.send('pong'));
