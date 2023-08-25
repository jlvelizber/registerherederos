import express from "express";
import UserRoutes from "./UserRoutes";
import CampusRoutes from "./CampusRoutes";
import KidRoutes from "./KidRoutes";

const appRoutes = express();

appRoutes.use("/users", UserRoutes);
appRoutes.use("/campus", CampusRoutes);
appRoutes.use("/kids", KidRoutes);

export default appRoutes;
