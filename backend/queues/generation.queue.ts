import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const generationQueue = new Queue(
  "assessment-generation",
  {
    connection: redisConnection as any,
  }
);