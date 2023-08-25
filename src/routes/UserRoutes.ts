import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.get("/", UserController.list);
router.get("/:id", UserController.get);
router.post("/", UserController.save);
router.delete("/:id", UserController.delete);
router.put("/:id", UserController.update);

export default router;
