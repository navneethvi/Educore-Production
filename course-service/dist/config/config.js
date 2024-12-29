"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    port: process.env.PORT || 3003,
    mongo: {
        uri: process.env.MONGO_URI
    },
    redis: {
        url: process.env.REDIS_URL
    },
    kafka: {
        broker: process.env.KAFKA_BROKER || 'localhost:9092'
    },
};
