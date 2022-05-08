import express, { json } from 'express';
import mongoose from 'mongoose';
import nobloxJs from 'noblox.js';
import aws from 'aws-sdk';
import user_router from './routes/user_router.js';

console.log('Starting app...');

const app = express();

app.use(json());

const db_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/roblox-discord-sync';

console.log('Connecting to mongodb...');

mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

// Noblox.js
if (process.env.NOBLOX_COOKIE) {
    nobloxJs.setCookie(process.env.NOBLOX_COOKIE);
    console.log(`Logged in on Roblox as ${currentUser.UserName} [${currentUser.UserID}]`)
}else{
    console.log('No cookie set, not logged in on Roblox');
}

// AWS
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', user_router);

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

