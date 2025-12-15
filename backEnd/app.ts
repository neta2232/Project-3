import express from "express";
import cors from "cors";
import { appConfig } from "./src/utils/config";
import { vacationsRoutes } from "./src/controllers/vacationsControllers";
import { userRoutes } from "./src/controllers/userController";
import { errorHandler } from "./src/middlewares/errorHandler";
import fileUpload from "express-fileupload";

const server = express();

server.use(cors({   origin: ["http://localhost:5173", "http://63.178.226.68" ]}));
server.use(express.json());
server.use(fileUpload());
server.use(vacationsRoutes);
server.use(userRoutes);

server.use(errorHandler);

server.listen(appConfig.port, () => {
    console.log(`Express server started on http://localhost:${appConfig.port}`);
    console.log("Connecting to DB");
});
