import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import Assignment from "../models/assignment.model";

const worker = new Worker(
  "assessment-generation",

  async (job) => {
    try {
      const { assignmentId } = job.data;

      console.log("Processing Assignment:", assignmentId);

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "processing",
      });

      // Temporary fake AI generation

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const generatedPaper = [
        {
          title: "Section A",
          instruction: "Attempt all questions",
          questions: [
            {
              text: "Explain Operating System.",
              difficulty: "Easy",
              marks: 2,
            },

            {
              text: "Differentiate process and thread.",
              difficulty: "Medium",
              marks: 5,
            },
          ],
        },
      ];

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        generatedPaper,
      });

      console.log("Assignment completed:", assignmentId);
    } catch (error) {
      console.log(error);
    }
  },

  {
    connection: redisConnection,
  },
);

export default worker;
