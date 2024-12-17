import { generateApiKey } from "../middleware/generateApiKey.js";
import userModel from "../models/users.js";

export const getUserData = async (req, res) => {
  try {
    const { userID } = req.body;
    const apiKey = req.headers["api-key"];
    if (!userID || !apiKey) {
      return res.status(400).json({
        status: 400,
        msg: "Item are required",
      });
    }
    const user = await userModel.findOne({
      where: { UID: userID, apiKey: apiKey },
      attributes: ["fullName", "email", "photoUrl"],
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        msg: "User or API key not found",
      });
    }
    res.status(200).json({
      status: 200,
      msg: "Data retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);

    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};

export const handleGoogleLogin = async (req, res) => {
  try {
    const { UID, fullName, email, photoUrl } = req.body;

    if (!UID || !fullName || !email) {
      return res.status(400).json({
        status: 400,
        msg: "All input fields are required",
      });
    }

    const existingUser = await userModel.findOne({
      where: { UID },
      attributes: ["UID", "apiKey"],
    });

    if (existingUser) {
      return res.status(200).json({
        status: 200,
        msg: "Data retrieved successfully",
        data: existingUser,
      });
    }

    const apiKey = generateApiKey(20);

    const newUser = await userModel.create({
      UID,
      fullName,
      email,
      photoUrl,
      apiKey,
    });

    return res.status(201).json({
      status: 201,
      msg: "User registered successfully",
      data: { UID: newUser.UID, apiKey: newUser.apiKey },
    });
  } catch (error) {
    console.error("Error handling login:", error);

    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};
