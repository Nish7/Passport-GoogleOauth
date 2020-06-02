const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport);

app.use(express.urlencoded({ extended: false }));

// app.use(
// 	session({
// 		secret: 'secret!',
// 		resave: true,
// 		saveUninitialized: true,
// 	})
// ); // session secret

app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connected'))
	.catch((err) => console.log(err));

app.use(morgan('tiny'));

// Mount router
const router = require('./routes');
app.use('/auth/google', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log('App listening on port 8080!');
});
