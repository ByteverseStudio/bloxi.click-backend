import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import aws from 'aws-sdk';
import user_router from './routes/user_router.js';
import error_handler, { error } from './utils/error_handler.js';

console.log('Starting app...');

const app = express();

app.use(express.json());

const db_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxi';

console.log('Connecting to mongodb...');

mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

// AWS
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/user', user_router);

app.use(error_handler.notFoundHandler);
app.use(error_handler.errorLogger);
app.use(error_handler.errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started...');
});

