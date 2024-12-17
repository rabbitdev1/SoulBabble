import recommendationsModel from "../../models/recommendations.js";

export const getDetailRecommedationData = async (req, res) => {
  const apiKey = req.headers["api-key"];
  const { id } = req.body;
  if (!apiKey || !id) {
    return res.status(400).json({
      status: 400,
      msg: "Item are required",
    });
  }
  try {
    const data = await recommendationsModel.findOne({
      where: { apiKey: apiKey, id: id },
      attributes: ["id", "recommendedAction", "url", "type", "createdAt"],
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
