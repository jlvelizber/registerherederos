import express from "express";
import UserRoutes from "./UserRoutes";
import CampusRoutes from "./CampusRoutes";
import KidRoutes from "./KidRoutes";
import CampusServicesRoutes from "./CampusServicesRoutes";
import RegisterRoutes from "./RegisterRoutes";

const appRoutes = express();

appRoutes.use("/users", UserRoutes);
appRoutes.use("/campus", CampusRoutes);
appRoutes.use("/campus-services", CampusServicesRoutes);
appRoutes.use("/kids", KidRoutes);
appRoutes.use("/registers", RegisterRoutes);

export default appRoutes;
