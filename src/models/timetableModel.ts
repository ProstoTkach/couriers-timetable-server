import connection from "../config/db";
import { RowDataPacket } from 'mysql2';

interface TimetableEntry {
    courier_id: number;
    destination_name: string;
    start_time: string;
    end_time: string;
}

export async function getTimetable(date?: string): Promise<TimetableEntry[]> {
    let query = `
        SELECT 
            t.id, 
            c.name AS courier_name, 
            t.destination_name, 
            t.start_time, 
            t.end_time 
        FROM timetable t
        JOIN couriers c ON t.courier_id = c.id
    `;
    let values: any[] = [];

    if (date) {
        query += " WHERE DATE(t.start_time) = ?";
        values.push(date);
    }

    try {
        const [rows]:  any[] = await connection.query(query, values);
        return rows;
    } catch (error) {
        console.error("Error fetching timetable:", error);
        throw new Error("Error fetching timetable. Please try again later.");
    }
}

export async function checkTimeOverlap(courier_id: number, start_time: string, end_time: string) {
    const query = `
        SELECT * FROM timetable
        WHERE courier_id = ? 
        AND (
            (start_time <= ? AND end_time > ?) OR 
            (start_time < ? AND end_time >= ?) OR
            (start_time >= ? AND start_time < ?)
        )
    `;
    try {
        const [rows]: any[] = await connection.query(query, [courier_id, start_time, start_time, end_time, end_time, start_time, end_time]);
        return rows.length > 0;
    } catch (error) {
        console.error("Error checking time overlap:", error);
        throw new Error("Error checking time overlap. Please try again later.");
    }
}

export async function addTimetableEntry(entry: TimetableEntry) {
    const { courier_id, destination_name, start_time, end_time } = entry;

    const query = `
        INSERT INTO timetable (courier_id, destination_name, start_time, end_time)
        VALUES (?, ?, ?, ?)
    `;
    try {
        const [result] = await connection.query(query, [courier_id, destination_name, start_time, end_time]);
        return result;
    } catch (error) {
        console.error("Error adding timetable entry:", error);
        throw new Error("Error adding timetable entry. Please try again later.");
    }
}

export async function getTimetableEntryById(id: number) {
    const [rows]: [RowDataPacket[], any] = await connection.query("SELECT * FROM timetable WHERE id = ?", [id]);
    if (!rows.length) throw new Error("Entry not found.");
    return rows[0];
}

export async function updateTimetableEntry(id: number, data: { [key: string]: any }) {
    const { courier_id, destination_name, start_time, end_time } = data;

    const query = "UPDATE timetable SET courier_id = ?, destination_name = ?, start_time = ?, end_time = ? WHERE id = ?";
    try {
        const result = await connection.query(query, [courier_id, destination_name, start_time, end_time, id]);
        return result[0];
    } catch (error) {
        console.error("Error updating timetable entry:", error);
        throw new Error("Error updating timetable entry. Please try again later.");
    }
}

export async function deleteTimetableEntry(id: number) {
    const entry = await getTimetableEntryById(id);
    if (!entry) throw new Error("Entry not found.");
    await connection.query("DELETE FROM timetable WHERE id = ?", [id]);
}
