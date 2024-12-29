import { logger } from "@envy-core/common";
import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["kafka-srv:9092"],
  logLevel: logLevel.INFO,
});

export const consumer = kafka.consumer({ groupId: "payment-group" });

export const connectConsumer = async () => {
  await consumer.connect();
  logger.info("Connected to Kafka consumer");

  await consumer.subscribe({ topic: "student-created", fromBeginning: true });
  await consumer.subscribe({ topic: "course-created", fromBeginning: true });
  await consumer.subscribe({ topic: "course-updated", fromBeginning: true });
  await consumer.subscribe({ topic: "tutor-created", fromBeginning: true });
};
