import { Router } from "express";

import AuthController from "../controllers/AuthController";
import { validarJWT } from "../middlewares";

const router = Router();

router.post("/login", AuthController.loginUsuario);
router.post("/revalidate", [ validarJWT ]  , AuthController.revalidarToken);

export default router;
