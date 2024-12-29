import Redis from "ioredis";
import { CreateStudentDto } from "../dtos/student.dto";
import { sendMessage } from "../events/kafkaClient";
import { CreateTutorDto } from "../dtos/tutor.dto";

import { IOtpService } from "../interfaces/otp.service.interface";
import { logger } from "@envy-core/common";

const redis = new Redis({
  host: "redis-svc", 
  port: 6379,         
});

redis.on("error", (err) => {
  logger.error("Redis Client Error:", err);
});

let isRedisConnected = false;

redis.on('connect', () => {
  isRedisConnected = true;
  logger.info("Connected to Redis");
});

redis.on('close', () => {
  isRedisConnected = false;
  logger.info("Redis connection closed");
});

(async () => {
  try {
    if (!isRedisConnected) {  
      await redis.connect();
    } else {
      logger.info("Redis is already connected");
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

export class OtpService implements IOtpService {
  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await redis.setex(`otp:${email}`, 300, otp);
    console.log("Otp generated and seted in redis : ", otp);
    return otp;
  }

  async storeUserDataWithOtp(
    userData: CreateStudentDto | CreateTutorDto,
    otp: string
  ): Promise<void> {
    await redis.setex(
      `user:${userData.email}:${otp}`,
      300,
      JSON.stringify(userData)
    );
    await redis.setex(
      `userData:${userData.email}`,
      300,
      JSON.stringify(userData)
    );
    await sendMessage("email-verification", { email: userData.email, otp });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await redis.get(`otp:${email}`);
    return storedOtp === otp;
  }

  async getUserDataByOtp(
    email: string,
    otp?: string
  ): Promise<CreateStudentDto | CreateTutorDto> {
    const key = otp ? `user:${email}:${otp}` : `userData:${email}`;
    const userData = await redis.get(key);
    if (userData) {
      return JSON.parse(userData);
    }
    throw new Error("User data not found");
  }

  async storeVerifiedUserData(
    email: string,
    userData: CreateStudentDto | CreateTutorDto
  ): Promise<void> {
    await redis.setex(
      `verifiedUserData:${email}`,
      300,
      JSON.stringify(userData)
    );
  }

  async getVerifiedUserData(email: string): Promise<CreateStudentDto> {
    const userData = await redis.get(`verifiedUserData:${email}`);
    if (userData) {
      return JSON.parse(userData);
    }
    throw new Error("Verified user data not found");
  }

  async deleteUserOtpAndData(email: string, otp: string): Promise<void> {
    await redis.del(`otp:${email}`);
    await redis.del(`user:${email}:${otp}`);
    await redis.del(`userData:${email}`);
    console.log(`Deleted OTP and user data keys for email: ${email}`);
  }

  async deleteVerifiedUserData(email: string): Promise<void> {
    await redis.del(`verifiedUserData:${email}`);
    console.log(`Deleted verified user data key for email: ${email}`);
  }

  async generateAccRecoverOtp(email: string): Promise<string> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await redis.setex(`otp:${email}`, 300, otp);
    console.log("Otp generated and seted in redis : ", otp);
    await sendMessage("email-verification", { email, otp });
    return otp;
  }

  async deleteOtp(email: string): Promise<void> {
    await redis.del(`otp:${email}`);
  }
}
