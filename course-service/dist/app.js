"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("@envy-core/common");
const kafkaClient_1 = require("./events/kafkaClient");
const common_2 = require("@envy-core/common");
const database_1 = __importDefault(require("./config/database"));
const consumers_1 = require("./events/consumer/consumers");
const routes_1 = __importDefault(require("./routes/routes"));
// Initialize the app
const app = (0, express_1.default)();
// Load environment variables
(0, dotenv_1.configDotenv)();
// Middleware setup
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
// Body parsers
app.use(express_1.default.json({ limit: '900mb' }));
app.use(express_1.default.urlencoded({ limit: '900mb', extended: true }));
// Routes setup
app.get('/', (req, res) => {
    res.json('helloooo');
});
app.use('/api/course', routes_1.default);
// Global error handler
app.use(common_1.ErrorHandler.handleError);
// Connect to Kafka consumer and DB, then start the server
const port = 3003;
(0, kafkaClient_1.connectConsumer)()
    .then(() => {
    (0, consumers_1.courseConsumer)();
})
    .catch((error) => {
    common_2.logger.error('Kafka consumer connection error:');
    console.log(error);
});
(0, database_1.default)();
// Start the Express server
app.listen(port, () => {
    common_2.logger.info(`Course Service is running on http://localhost:${port}`);
});
exports.default = app;
