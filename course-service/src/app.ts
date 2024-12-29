import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import { ErrorHandler } from '@envy-core/common';
import { connectConsumer } from './events/kafkaClient';
import { logger } from '@envy-core/common';
import connectDB from './config/database';
import { courseConsumer } from './events/consumer/consumers';
import Router from './routes/routes';

// Initialize the app
const app = express();

// Load environment variables
configDotenv();

// Middleware setup
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://frontend-svc.default.svc.cluster.local:5173'],
    credentials: true, // Allow cookies and credentials
  })
);

// Body parsers
app.use(express.json({ limit: '900mb' }));
app.use(express.urlencoded({ limit: '900mb', extended: true }));

// Routes setup
app.get('/', (req, res) => {
  res.json('helloooo');
});
app.use('/api/course', Router);

// Global error handler
app.use(ErrorHandler.handleError);

// Connect to Kafka consumer and DB, then start the server
const port = 3003;

connectConsumer()
  .then(() => {
    courseConsumer();
  })
  .catch((error) => {
    logger.error('Kafka consumer connection error:');
    console.log(error);
  });

connectDB();

// Start the Express server
app.listen(port, () => {
  logger.info(`Course Service is running on http://localhost:${port}`);
});

export default app;
