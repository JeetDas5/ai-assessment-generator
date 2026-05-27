import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import Assignment from "../models/assignment.model";
import { notifyAssignmentUpdate } from "../config/socket";
import fs from "fs";
import { SmartPDFParser } from "pdf-parse-new";
import { OpenAI } from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const worker = new Worker(
  "assessment-generation",
  async (job) => {
    const { assignmentId } = job.data;
    console.log("Processing Assignment Generation:", assignmentId);

    try {
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "processing",
      });
      notifyAssignmentUpdate(assignmentId, "processing");

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment with ID ${assignmentId} not found`);
      }

      let textContent = "";
      if (assignment.uploadedFile) {
        console.log("Reading uploaded file:", assignment.uploadedFile);
        if (fs.existsSync(assignment.uploadedFile)) {
          if (assignment.uploadedFile.endsWith(".pdf")) {
            const dataBuffer = fs.readFileSync(assignment.uploadedFile);
            const parser = new SmartPDFParser();
            const parsedData = await parser.parse(dataBuffer);
            textContent = parsedData.text;
            console.log(
              "PDF parsed successfully. Characters extracted:",
              textContent.length,
            );
          } else {
            textContent = fs.readFileSync(assignment.uploadedFile, "utf-8");
            console.log(
              "Text file parsed successfully. Characters extracted:",
              textContent.length,
            );
          }
        } else {
          console.warn(
            "Uploaded file not found on disk:",
            assignment.uploadedFile,
          );
        }
      }

      const prompt = `You are an expert assessment creator. Your task is to generate a premium-quality structured question paper based on the following details.

Assessment Details:
- Title/Topic: ${assignment.title}
- Total Questions: ${assignment.totalQuestions}
- Total Marks: ${assignment.totalMarks}
- Question Types: ${assignment.questionTypes ? assignment.questionTypes.join(", ") : "Any"}
- Additional Instructions: ${assignment.instructions || "None"}
${textContent ? `\nReference Material/Document Context:\n${textContent}\n` : ""}

Guidelines:
1. Divide the assignment into logical sections (e.g., "Section A", "Section B") depending on the number of questions and question types.
2. Provide a clear instruction for each section (e.g., "Attempt all questions").
3. Each question must have:
   - "text": The complete question text.
   - "difficulty": "Easy", "Moderate", or "Hard".
   - "marks": A positive number representing the weight of the question.
   - "answer": A comprehensive, detailed, step-by-step correct answer, key explanation, or solution guidelines for grading.
4. IMPORTANT: Ensure that the sum of marks of all generated questions in all sections EXACTLY equals ${assignment.totalMarks}.
5. IMPORTANT: Ensure that the total number of questions across all sections EXACTLY equals ${assignment.totalQuestions}.
6. Only generate questions that belong to the requested question types: ${assignment.questionTypes ? assignment.questionTypes.join(", ") : "Any"}.
7. Base the questions on the reference material provided if present; otherwise, generate highly accurate questions based on the Title/Topic.

You must return a raw JSON object matching this schema:
{
  "generatedPaper": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "...",
          "difficulty": "Easy",
          "marks": 5,
          "answer": "Detailed step-by-step correct answer..."
        }
      ]
    }
  ]
}`;

      console.log("Requesting completion from OpenAI...");
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional educational tool designed to generate valid assessment papers in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const rawJson = response.choices[0]?.message?.content;
      if (!rawJson) {
        throw new Error("Failed to receive structured content from OpenAI");
      }

      console.log("OpenAI raw response received:", rawJson);
      const data = JSON.parse(rawJson);

      if (!data.generatedPaper || !Array.isArray(data.generatedPaper)) {
        throw new Error(
          "AI output structure was invalid: 'generatedPaper' is missing or not an array",
        );
      }

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        generatedPaper: data.generatedPaper,
      });

      console.log("Assignment completed:", assignmentId);
      notifyAssignmentUpdate(assignmentId, "completed", {
        generatedPaper: data.generatedPaper,
      });
    } catch (error: any) {
      console.error(
        "Worker Execution Error for Assignment:",
        assignmentId,
        error,
      );
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "failed",
        error: errorMessage,
      });

      notifyAssignmentUpdate(assignmentId, "failed", { error: errorMessage });
    }
  },
  {
    connection: redisConnection as any,
  },
);

export default worker;
