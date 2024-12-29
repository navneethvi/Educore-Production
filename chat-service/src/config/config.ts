export const config = {
  port: process.env.PORT || 3004,
  mongo: {
    uri: "mongodb+srv://navaneethvinod18:navaneethunni@cluster0.vxc99.mongodb.net/Chat"
  },
  kafka: {
    broker: process.env.KAFKA_BROKER
  },
};
