import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Assignment from "../models/assignment.model";
import { assignmentSchema } from "../validations/assignment.validation";
import { generationQueue } from "../queues/generation.queue";

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    let rawQuestionTypes = req.body.questionTypes;
    let parsedQuestionTypes: any = [];
    if (rawQuestionTypes) {
      if (Array.isArray(rawQuestionTypes)) {
        parsedQuestionTypes = rawQuestionTypes;
      } else if (typeof rawQuestionTypes === "string") {
        try {
          const parsed = JSON.parse(rawQuestionTypes);
          parsedQuestionTypes = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          parsedQuestionTypes = [rawQuestionTypes];
        }
      }
    }

    const validationInput = {
      ...req.body,
      totalQuestions: req.body.totalQuestions !== undefined ? Number(req.body.totalQuestions) : undefined,
      totalMarks: req.body.totalMarks !== undefined ? Number(req.body.totalMarks) : undefined,
      questionTypes: parsedQuestionTypes,
    };

    const validationResult = assignmentSchema.safeParse(validationInput);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const parsedData = validationResult.data;

    const createData: any = {
      title: parsedData.title,
      dueDate: parsedData.dueDate,
      questionTypes: parsedData.questionTypes,
      totalQuestions: parsedData.totalQuestions,
      totalMarks: parsedData.totalMarks,
    };

    if (parsedData.instructions !== undefined) {
      createData.instructions = parsedData.instructions;
    }
    if (req.file?.path !== undefined) {
      createData.uploadedFile = req.file.path;
    }
    if (req.user?.id !== undefined) {
      createData.createdBy = req.user.id;
    }

    const assignment = await Assignment.create(createData);

    const job = await generationQueue.add("generate-paper", {
      assignmentId: assignment._id,
    });

    res.status(201).json({
      success: true,
      message: "Assignment queued for creation",
      assignment,
      jobId: job.id,
    });
  } catch (error) {
    console.error("Create Assignment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create assignment due to an internal server error",
    });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const assignments = await Assignment.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get Assignments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
    });
  }
};

