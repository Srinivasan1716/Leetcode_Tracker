import { Request, Response } from "express";
import { createUser, getAllUsers } from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await createUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};