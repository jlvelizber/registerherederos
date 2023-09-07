import { Router } from "express";
import CampusServicesController from "../controllers/CampusServicesController";


const router = Router();

router.get("/:campusId", CampusServicesController.list);
router.get("/:campusId/:id", CampusServicesController.get);
router.post("/:campusId", CampusServicesController.save);
router.delete("/:campusId/:id", CampusServicesController.delete);
router.put("/:campusId/:id", CampusServicesController.update);

export default router;
