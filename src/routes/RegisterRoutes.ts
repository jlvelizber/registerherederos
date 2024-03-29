import { Router } from "express";
import RegisterController from "../controllers/RegisterController";


const router = Router();

router.get("/", RegisterController.list);
router.get("/query", RegisterController.queryReporter);
router.get("/:id", RegisterController.get);
router.post("/", RegisterController.save);
router.delete("/:id", RegisterController.delete);
router.put("/:id", RegisterController.update);
router.post("/export-query", RegisterController.exportXlSQueryReporter)

export default router;
