import bcrypt from "bcrypt"
import { z } from "zod"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

const registerSchema=z.object({
    name: z.string().trim().nonempty("Name is required"),
  email: z.string().trim().email("Invalid email format").nonempty("Email is required"),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z.string().min(5, "Password must be at least 5 characters"),
})

export const registerUser=async(req,res)=>{
 try {
   //validate input
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {

      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, email, phone, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const loginSchema=z.object({
  email: z.string().trim().email("Invalid email format").nonempty("Email is required"),
  password: z.string().min(5, "Password must be at least 5 characters"),
})

export const loginUser=async(req,res)=>{
 try {
   
    //validate input

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesnot exist please register" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken =jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    
    const refreshToken =jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    console.log("accessToken",accessToken)
        console.log("refreshToken",refreshToken)
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Access token refreshed" });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("accessToken").clearCookie("refreshToken").json({ message: "Logged out" });
};

export const getUserId=(req,res)=>{
 res.json(req.user.id) 
}