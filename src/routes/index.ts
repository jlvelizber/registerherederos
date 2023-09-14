import express from "express";
import UserRoutes from "./UserRoutes";
import CampusRoutes from "./CampusRoutes";
import KidRoutes from "./KidRoutes";
import CampusServicesRoutes from "./CampusServicesRoutes";
import RegisterRoutes from "./RegisterRoutes";
import AuthRoutes from "./AuthRoutes";
import { validarJWT } from "../middlewares";

const appRoutes = express();

appRoutes.use("/users", [validarJWT], UserRoutes);
appRoutes.use("/campus", [validarJWT], CampusRoutes);
appRoutes.use("/campus-services", [validarJWT], CampusServicesRoutes);
appRoutes.use("/kids", [validarJWT], KidRoutes);
appRoutes.use("/registers", [validarJWT], RegisterRoutes);
appRoutes.use("/auth", AuthRoutes);

export default appRoutes;
