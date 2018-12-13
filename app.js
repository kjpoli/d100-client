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
const ObjectId = mongoose.Schema.Types.ObjectId;
require('./config/passport')(passport);
const Campaign = require('./models/campaign');
const camp = mongoose.model('Campaign');
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
io.on('connection', async function(socket){
    socket.on('getCampaign', (cid) => {
        console.log('requested campaign');
        var pkg = {};
        pkg.uid = '5af9b6cd592e3c31fb1d95a7';
        //camp.findById(cid, function (err, campaign) {
          //  if (err) {
            //    console.log("fuck");
            //} else {
                var c = { "_id" : "5af9bb661dc240370123c817", "players" : [ ], "notes" : [ ], "name" : "Ass 2", "dm" : "5af9b6cd592e3c31fb1d95a7", "attributeTemplate" : [ { "_id" : "5af9bb661dc240370123c818", "name" : "poop", "primary" : true } ], "characters" : [ { "notes" : [ ], "_id" : "5af9bb661dc240370123c819", "user" : "5af9b6cd592e3c31fb1d95a7", "name" : "Poop", "icon" : "css", "stats" : [ { "_id" : "5af9bb661dc240370123c81b", "name" : "str", "value" : 0, "primary" : true }, { "_id" : "5af9bb661dc240370123c81a", "name" : "dex", "value" : 99, "primary" : true } ], "inv" : [ ] } ], "__v" : 0 };
            pkg.campaign = c;
            //}
        //});
        console.log(pkg);
        io.emit('gameInit', pkg);
    });

    socket.on('testing', (id) => {
        console.log(id);
    });
    socket.on('btnVis', (id) => {
        socket.broadcast.emit('btnVis', id); 
    });
    socket.on('btnTurn', (id) => {
        socket.broadcast.emit('btnTurn', id); 
    });
    socket.on('btnInj', (id) => {
        socket.broadcast.emit('btnInj', id); 
    });
});
http.listen(3000, () => {
    console.log('We have got a server running on http://localhost:3000');
});
