const express = require('express');
const mongoose = require('mongoose');
const noblox = require('noblox.js');

console.log('Starting app...');

const app = express();

app.use(express.json());

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roblox-discord-sync';

console.log('Connecting to mongodb...');

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

// Noblox.js
if (process.env.NOBLOX_COOKIE) {
    noblox.setCookie(process.env.NOBLOX_COOKIE);
    console.log(`Logged in on Roblox as ${currentUser.UserName} [${currentUser.UserID}]`)
}else{
    console.log('No cookie set, not logged in on Roblox');
}


//app.use

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({ error: 'Not found' });
}
);

//error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500).json({ error: err });
}
);

