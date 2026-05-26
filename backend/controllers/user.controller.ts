import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { signupSchema, signinSchema } from "../validations/user.validation";

export const signup = async (req: Request, res: Response) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        errors: validationResult.error.issues[0]?.message,
      });
      return;
    }

    const { name, email, password } = validationResult.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
      return;
    }

    const hashedPassword = await argon2.hash(password);

    const userData: any = {
      email,
      password: hashedPassword,
    };
    if (name !== undefined) {
      userData.name = name;
    }

    const newUser = await User.create(userData);

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "12345",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        schoolName: newUser.schoolName,
        schoolAddress: newUser.schoolAddress,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        errors: validationResult.error.issues[0]?.message,
      });
      return;
    }

    const { email, password } = validationResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        schoolName: user.schoolName,
        schoolAddress: user.schoolAddress,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during sign in",
    });
  }
};

export const updateSchoolInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { schoolName, schoolAddress } = req.body;

    if (!schoolName || typeof schoolName !== "string" || schoolName.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: "School name is required and must be at least 2 characters long",
      });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    user.schoolName = schoolName.trim();
    if (schoolAddress !== undefined) {
      user.schoolAddress = typeof schoolAddress === "string" ? schoolAddress.trim() : "";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "School profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        schoolName: user.schoolName,
        schoolAddress: user.schoolAddress,
      },
    });
  } catch (error) {
    console.error("Update School Info Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during school profile update",
    });
  }
};
