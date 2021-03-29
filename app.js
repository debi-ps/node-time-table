const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requireAuth, assignUser } = require('./middleware/auth.middleware');

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
	console.log(`Application is started on port ${PORT}`);
});

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(assignUser);

// auth
app.use(require('./routes/auth.routes'));
