import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: String,
  difficulty: String,
  marks: Number,
});

const SectionSchema = new mongoose.Schema({
  title: String,
  instruction: String,
  questions: [QuestionSchema],
});

const AssignmentSchema = new mongoose.Schema(
  {
    title: String,
    dueDate: Date,
    instructions: String,
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    generatedPaper: [SectionSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Assignment", AssignmentSchema);
