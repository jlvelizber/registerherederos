import { Router } from "express";
import RegisterController from "../controllers/RegisterController";


const router = Router();

router.get("/", RegisterController.list);
router.get("/:id", RegisterController.get);
router.post("/", RegisterController.save);
router.delete("/:id", RegisterController.delete);
router.put("/:id", RegisterController.update);

export default router;
