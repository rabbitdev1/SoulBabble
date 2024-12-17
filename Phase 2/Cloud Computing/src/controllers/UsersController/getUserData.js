import userModel from "../../models/users.js";

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
