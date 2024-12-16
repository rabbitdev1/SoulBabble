import databaseConnection from "../../config/Database.js";

import userModel from "../models/users.js";
import trackingMoodModel from "../models/trackingMood.js";
import emotionModel from "../models/emotion.js";
import recommendationsModel from "../models/recommendations.js";
import journalingModel from "../models/journaling.js";
import trainingDataModel from "../models/trainingData.js";
import annModel from "../models/annModel.js";
// Function to synchronize all models
export const syncModels = async () => {
    try {
        await databaseConnection.authenticate(); // Authenticate the database connection
        console.log("Database connection authenticated successfully.");

        // Sync all models in a sequential order
        await userModel.sync();
        console.log("User model synced.");

        await trackingMoodModel.sync();
        console.log("Tracking Mood model synced.");

        await emotionModel.sync();
        console.log("Emotion model synced.");

        await recommendationsModel.sync();
        console.log("Recommendations model synced.");

        await journalingModel.sync();
        console.log("Journaling model synced.");

        await trainingDataModel.sync();
        console.log("Training Data model synced.");

        await annModel.sync();
        console.log("ANN Model synced.");

        console.log("All models synchronized successfully.");
    } catch (error) {
        console.error("Unable to synchronize models with the database:", error);
        process.exit(1); // Exit if there's an issue connecting
    }
};
