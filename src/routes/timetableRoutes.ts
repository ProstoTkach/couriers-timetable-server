import { Router } from "express";
import { getTimetableHandler, addTimetableHandler, getTimetableEntryByIdHandler , updateTimetableEntryHandler , deleteTimetableEntryHandler} from "../controllers/timetableController";

const router = Router();

router.get("/timetable", getTimetableHandler);
router.post("/timetable", addTimetableHandler);

router.get("/timetable/:id", getTimetableEntryByIdHandler); 
router.put("/timetable/:id", updateTimetableEntryHandler); 
router.delete("/timetable/:id", deleteTimetableEntryHandler);

export default router;
