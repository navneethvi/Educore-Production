"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseConsumer = void 0;
const kafkaClient_1 = require("../kafkaClient");
const common_1 = require("@envy-core/common");
const consumer_controller_1 = __importDefault(require("../../controllers/consumer.controller"));
const courseConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield kafkaClient_1.consumer.run({
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, message, }) {
                try {
                    switch (topic) {
                        case "tutor-created":
                            yield consumer_controller_1.default.handleTutorCreated(message);
                            break;
                        case "student-created":
                            yield consumer_controller_1.default.handleStudentCreated(message);
                            break;
                        default:
                            common_1.logger.warn(`Unhandled topic: ${topic}`);
                    }
                }
                catch (error) {
                    if (error instanceof Error) {
                        common_1.logger.error(`Error processing message from topic ${topic}: ${error.message}`);
                    }
                    else {
                        common_1.logger.error(`Unexpected error processing message from topic ${topic}: ${String(error)}`);
                    }
                }
            }),
        });
    }
    catch (error) {
        if (error instanceof Error) {
            common_1.logger.error(`Error running Kafka consumer: ${error.message}`);
        }
        else {
            common_1.logger.error(`Unexpected error running Kafka consumer: ${String(error)}`);
        }
    }
});
exports.courseConsumer = courseConsumer;
