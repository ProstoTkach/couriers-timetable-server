import { Router } from "express";
import { getCouriersHandler, addCourierHandler, deleteCourierHandler } from "../controllers/couriersController";

const router = Router();

router.get("/couriers", getCouriersHandler);
router.post("/couriers", addCourierHandler);
router.delete("/couriers/:id", deleteCourierHandler);

export default router;
