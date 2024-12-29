export const config = {
    port: process.env.PORT || 3001,
    mongo: {
      uri: process.env.MONGO_URI
    },
    redis: {
      url: "redis://redis-svc:6379"
    },
    kafka: {
      broker: process.env.KAFKA_BROKER || 'localhost:9092'
    },
    JWT_SECRET: process.env.JWT_AUTHSECRET,
    JWT_REFRESH: process.env.JWT_REFRESH_SECRET
  };
  