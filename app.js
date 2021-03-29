const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/auth.middleware');

const app = express();
const PORT = config.get('app.port');

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

mongoose.connect(config.get('db.url'), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.listen(PORT, () => {
	console.log('Application is started on port ' + PORT);
});

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// routes
app.get('/ping', async (req, res) => res.send('pong'));

// auth ping
app.get('/auth-ping', requireAuth, async (req, res) => res.send('auth-pong'));

// cookies
app.get('/set-cookie', async (req, res) => {
	// res.setHeader('Set-Cookie', 'newUser=true');

	res.cookie('newUserOld', false, {
		maxAge: 1000 * 60 * 60 * 24, // one day
		secure: true,
		httpOnly: true,
	});

	res.send("you've got a cookie");
});

app.get('/read-cookie', async (req, res) => {
	const cookies = req.cookies;

	console.log(cookies.newUser);

	res.json(cookies);
});

// auth
app.use(require('./routes/auth.routes'));
