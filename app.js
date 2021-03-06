const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// DB Config
const settings = require('./config/settings');
const mongoConfig = settings.mongoConfig;

let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
mongoose.connect(fullMongoUrl);

require('./config/passport')(passport);
const Campaign = require('./models/campaign');

const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const expressHandlebars = require('express-handlebars');

app.use(morgan('dev'));
app.use('/public', static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({ secret: 'dungeoncrawlersbiggestsecretsession', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app, passport);
io.on('connection', function(socket){
  console.log('a user connected');
});
http.listen(3000, () => {
    console.log('We have got a server running on http://localhost:3000');
});
