const dotenv = require('dotenv');
const https = require('https');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

const { clusteringApp } = require('./app');

const privateKey = fs.readFileSync('./privateKey.pem');
const certificate = fs.readFileSync('./certificate.pem');

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = async () => {
  dotenv.config({ path: '.env' });

  const port = process.env.APP_PORT || 3000;
  const app = clusteringApp();
  app.use(cors());
  app.options('*', cors());

  const server = https
    .createServer(
      {
        key: privateKey,
        cert: certificate,
      },
      app
    )
    .listen(port, () => {
      console.log(`App running on port ${chalk.redBright(port)}...`);
    });

  // const server = app.listen(port, () => {
  //   console.log(`App running on port ${chalk.redBright(port)}...`);
  // });

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
if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  // Setup server configurations and share port address for incoming requests
  setTimeout(() => {
    setUpExpress();
  }, 700);
}
