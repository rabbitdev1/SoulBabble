import emotionModel from "../../models/emotion.js";

export const getEmotionData = async (req, res) => {
  try {
    const data = await emotionModel.findAll(); 
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 404,
        msg: "Data not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      msg: "Data retrieved successfully.",
      data: data,
    });

  } catch (error) {
    console.error("Error fetching user data:", error);

    return res.status(500).json({
      status: 500,
      msg: "Internal Server Error. Please try again later.",
    });
  }
};
