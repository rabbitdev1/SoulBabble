import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import router from "./src/routes/index.js";
import { syncModels } from "./src/services/syncModels.js";  // Changed to services folder
import { timezoneMiddleware } from "./src/middleware/timezoneMiddleware.js"; // Import timezoneMiddleware

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic middleware
app.get('/', (req, res) => {
    res.send('JANGAN GANGGU');
});

// Use the timezone middleware
app.use(timezoneMiddleware); 

// Set up other middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Server startup function
const startServer = async () => {
    try {
        await syncModels(); // Sync models before starting the server

        const port = process.env.DEV_PORT || 3000; // Default port
        const hostname = process.env.DEV_HOSTNAME || 'localhost'; // Default hostname

        app.listen(port, hostname, () =>
            console.log(`Server running at http://${hostname}:${port}`)
        );
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit if the server fails to start
    }
};

startServer();
