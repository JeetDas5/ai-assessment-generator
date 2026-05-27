import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: String,
  difficulty: String,
  marks: Number,
  answer: String,
});

const SectionSchema = new mongoose.Schema({
  title: String,
  instruction: String,
  questions: [QuestionSchema],
});

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    questionTypes: [
      {
        type: String,
      },
    ],
    totalQuestions: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    instructions: String,
    uploadedFile: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    generatedPaper: [SectionSchema],
    error: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Assignment", AssignmentSchema);
