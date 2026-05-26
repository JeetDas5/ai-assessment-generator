import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import { assignmentSchema } from "../validations/assignment.validation";
import { generationQueue } from "../queues/generation.queue";

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const parsedData = assignmentSchema.parse({
      ...req.body,
      totalQuestions: Number(req.body.totalQuestions),
      totalMarks: Number(req.body.totalMarks),
      questionTypes: JSON.parse(req.body.questionTypes),
    });

    const assignment = await Assignment.create({
      ...parsedData,
      uploadedFile: req.file?.path,
    });

    const job = await generationQueue.add("generate-paper", {
      assignmentId: assignment._id,
    });

    res.status(201).json({
      success: true,
      assignment,
      jobId: job.id,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
    });
  }
};
