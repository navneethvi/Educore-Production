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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectConsumer = exports.sendMessage = exports.connectProducer = exports.producer = exports.consumer = exports.kafka = void 0;
const common_1 = require("@envy-core/common");
const kafkajs_1 = require("kafkajs");
exports.kafka = new kafkajs_1.Kafka({
    clientId: "course-service",
    brokers: [
        "kafka-0.kafka-svc.kafka.svc.cluster.local:9092",
        "kafka-1.kafka-svc.kafka.svc.cluster.local:9092",
        "kafka-2.kafka-svc.kafka.svc.cluster.local:9092",
    ],
    logLevel: kafkajs_1.logLevel.INFO,
});
exports.consumer = exports.kafka.consumer({ groupId: "course-group" });
exports.producer = exports.kafka.producer();
const connectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.producer.connect();
        common_1.logger.info("Connected to Kafka producer");
    }
    catch (error) {
        common_1.logger.error("Error connecting to Kafka producer:");
        console.log(error);
    }
});
exports.connectProducer = connectProducer;
const sendMessage = (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        common_1.logger.info(`Message sent to topic ${topic}`);
        console.log("topic : ", topic, "   message : ", message);
    }
    catch (error) {
        common_1.logger.error("Error sending message:");
        console.log(error);
    }
});
exports.sendMessage = sendMessage;
const connectConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.consumer.connect();
    common_1.logger.info("Connected to Kafka consumer");
    yield exports.consumer.subscribe({ topic: "student-created", fromBeginning: true });
    yield exports.consumer.subscribe({ topic: "tutor-created", fromBeginning: true });
});
exports.connectConsumer = connectConsumer;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.connectProducer)();
        yield (0, exports.sendMessage)("test", { hello: "world" });
    }
    catch (error) {
        common_1.logger.error("Error in Kafka producer flow:");
        console.log(error);
    }
});
run();
