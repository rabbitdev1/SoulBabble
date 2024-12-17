import { generateApiKey } from "../../middleware/generateApiKey.js";
import userModel from "../../models/users.js";
import jwt from "jsonwebtoken";

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

    let userData;

    if (existingUser) {
      userData = existingUser;
    } else {
      const apiKey = generateApiKey(20);

      userData = await userModel.create({
        UID,
        fullName,
        email,
        photoUrl,
        apiKey,
      });
    }

    const payload = {
      UID: userData.UID,
      fullName: userData.fullName,
      email: userData.email,
      apiKey: userData.apiKey,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    return res.status(200).json({
      status: 200,
      msg: "User logged in successfully",
      data: {
        UID: userData.UID,
        fullName: userData.fullName,
        email: userData.email,
        apiKey: userData.apiKey,
        token,
      },
    });
  } catch (error) {
    console.error("Error handling login:", error);

    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};
