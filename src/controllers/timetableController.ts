import { Request, Response } from "express";
import { getTimetable,checkTimeOverlap, addTimetableEntry } from "../models/timetableModel";
import { getTimetableEntryById, updateTimetableEntry, deleteTimetableEntry } from "../models/timetableModel";

export async function getTimetableHandler(req: Request, res: Response) {
    try {
        const { date } = req.query;
        const timetable = await getTimetable(date as string);
        res.json(timetable);
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function addTimetableHandler(req: Request, res: Response) {
  try {
      const { courier_id, destination_name, start_time, end_time } = req.body;

      if (!courier_id || !destination_name || !start_time || !end_time) {
          res.status(400).json({ error: "All fields are required" });
          return;
      }

      if (new Date(start_time) >= new Date(end_time)) {
          res.status(400).json({ error: "End time must be later than start time." });
          return;
      }
      
      if (await checkTimeOverlap(courier_id, start_time, end_time)) {
          res.status(400).json({ error: "The selected time overlaps with an existing entry for this courier." });

          return;
      }

      await addTimetableEntry({ courier_id, destination_name, start_time, end_time });
      res.status(201).json({ message: "Timetable entry added successfully" });
  } catch (error) {
      console.error("Error adding timetable entry:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTimetableEntryByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const entry = await getTimetableEntryById(parseInt(id));
    res.json(entry);
  } catch (error) {
    console.error("Error fetching timetable entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateTimetableEntryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    
    await updateTimetableEntry(parseInt(id), data);
    res.status(200).json({ message: "Timetable entry updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteTimetableEntryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await deleteTimetableEntry(parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
