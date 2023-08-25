import { Router } from "express";
import CampusController from "../controllers/CampusController";

const router = Router();

router.get("/", CampusController.list);
router.get("/:id", CampusController.get);
router.post("/", CampusController.save);
router.delete("/:id", CampusController.delete);
router.put("/:id", CampusController.update);

export default router;
