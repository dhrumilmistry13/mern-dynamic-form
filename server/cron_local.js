const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const i18next = require('i18next');
const backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const { run } = require('./cron-jobs/cron-jobs');
const app = express();
app.use(middleware.handle(i18next));
dotenv.config();
i18next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './lang/{{lng}}/backend.json',
    },
  });
app.use(middleware.handle(i18next));

const app = express();
app.use(middleware.handle(i18next));

dotenv.config();

i18next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './lang/{{lng}}/backend.json',
    },
  });

app.use(middleware.handle(i18next));

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = async () => {
  dotenv.config({ path: '.env' });

  const port = 3006;

  const server = app.listen(port, () => {
    console.log(`App running on port ${chalk.redBright(port)}...`);
  });

  // In case of an error
  app.on('error', (appErr, appCtx) => {
    console.error('app error', appErr.stack);
    console.error('on url', appCtx.req.url);
    console.error('with headers', appCtx.req.headers);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log(chalk.bgRed('UNHANDLED REJECTION! 💥 Shutting down...'));
    console.log(err.name, err.message);

    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

// Setup server configurations and share port address for incoming requests
setUpExpress();
run();
