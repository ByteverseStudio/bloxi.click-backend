import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import aws from 'aws-sdk';
import user_router from './routes/user_router.js';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

console.log('Starting app...');

const app = express();

app.use(express.json());

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  

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


// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/user', user_router);

//404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.status(500).json({ message: err.message, id: res.sentry });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started...');
});

