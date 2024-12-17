import journalingModel from "../../models/journaling.js";

export const getJorunalData = async (req, res) => {
  const apiKey = req.headers["api-key"];
  if (!apiKey) {
    return res.status(400).json({
      status: 400,
      msg: "Item are required",
    });
  }
  try {
    const data = await journalingModel.findOne({
      where: {  apiKey: apiKey },
      attributes: ["id","title","content", "analysisResult", "createdAt"],
    });
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
