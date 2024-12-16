// src/routes/index.js
import express from "express";
import { getUserData, handleGoogleLogin } from "../controllers/UsersController.js";

const router = express.Router();

// Define the routes
router.post("/user", getUserData); 
router.post("/handleLogin", handleGoogleLogin); 


export default router;
