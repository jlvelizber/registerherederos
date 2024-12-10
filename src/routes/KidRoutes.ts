import { Router } from "express";
import KidController from "../controllers/KidController";

const router = Router();

router.get("/", KidController.list);
router.get("/findkids", KidController.queryKids)
router.get("/:id", KidController.get);
router.post("/", KidController.save);
router.delete("/:id", KidController.delete);
router.put("/:id", KidController.update);
router.post("/export/:campusId", KidController.exportKidsByCampus);


export default router;
