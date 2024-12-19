import express from "express";
import { getUserData } from "../controllers/UsersController/getUserData.js";
import { handleGoogleLogin } from "../controllers/UsersController/handleGoogleLogin.js";
import { getEmotionData } from "../controllers/TrackingMoodController/getEmotionData.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { getJorunalData } from "../controllers/JournalingController/getJournalData.js";
import { getRecommedationData } from "../controllers/RecommendationController/getRecommendationData.js";
import { getTrackingMoodData } from "../controllers/TrackingMoodController/getTrackingMoodData.js";
import { getDetailRecommedationData } from "../controllers/RecommendationController/getDetailRecommendation.js";
import { getDetailJournal } from "../controllers/JournalingController/getDetailJournal.js";
import { getNotificationData } from "../controllers/Notification/getNotificationData.js";
import { setEmotionData } from "../controllers/TrackingMoodController/setEmotionData.js";
import { setProcessNLP } from "../controllers/TrackingMoodController/setProccesNLP.js";
import { getRecommendations } from "../controllers/TrackingMoodController/getRecommendations.js";

const router = express.Router();

// Define the routes
router.post("/user", isAuthenticated, getUserData); 
router.post("/handleLogin", handleGoogleLogin); 
router.post("/getEmotion", isAuthenticated, getEmotionData); 
router.post("/getJournalingData", isAuthenticated, getJorunalData); 
router.post("/getDetailJournaling", isAuthenticated, getDetailJournal); 
router.post("/getRecommedationData", isAuthenticated, getRecommedationData); 
router.post("/getDetailRecommedation", isAuthenticated, getDetailRecommedationData); 
router.post("/getTrackingMoodData", isAuthenticated, getTrackingMoodData); 
router.post("/getNotification", isAuthenticated, getNotificationData);
 
router.post("/setEmotion", isAuthenticated, setEmotionData); 
router.post("/setProcessNLP", isAuthenticated, setProcessNLP); 
router.post("/getRecommendations", isAuthenticated, getRecommendations); 

export default router;
