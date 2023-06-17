const dotenv = require('dotenv');
const chalk = require('chalk');
const cluster = require('cluster');
const totalCPUs = 1;

const { clusteringApp } = require('./app');

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = () => {
  dotenv.config({ path: '.env' });
  console.log(`Worker ${process.pid} started`);
  const app = clusteringApp();
  const port = process.env.APP_PORT || 3003;

  const server = app.listen(port, () => {
    console.log(`App running on port ${chalk.redBright(port)}...`);
  });
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
  setUpExpress();
}
