import { Op } from "sequelize";
import trackingMoodModel from "../../models/trackingMood.js";
import { adjustEndOfDay, adjustStartOfDay, formatDate } from "../../utils/date.js";

export const getTrackingMoodData = async (req, res) => {
  const apiKey = req.headers["api-key"];
  const { startDate, endDate } = req.body;

  if (!apiKey) {
    return res.status(400).json({
      status: 400,
      msg: "API key is required",
    });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({
      status: 400,
      msg: "Start date and end date are required",
    });
  }

  try {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        status: 400,
        msg: "Invalid date format. Please provide valid start and end dates (DD-MM-YYYY).",
      });
    }

    const adjustedStartDate = adjustStartOfDay(start);
    const adjustedEndDate = adjustEndOfDay(end);

    const data = await trackingMoodModel.findAll({
      where: {
        apiKey: apiKey,
        createdAt: {
          [Op.between]: [adjustedStartDate, adjustedEndDate],
        },
      },
      attributes: ["id", "emotionName", "resultedEmotion", "createdAt"],
    });

    if (data.length === 0) {
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
    console.error("Error fetching mood tracking data:", error);

    return res.status(500).json({
      status: 500,
      msg: "Internal Server Error. Please try again later.",
    });
  }
};
