import { Request, Response } from "express";
import { getCouriers, addCourier, deleteCourier } from "../models/courierModel";

export async function getCouriersHandler(req: Request, res: Response) {
    try {
        const couriers = await getCouriers();
        res.json(couriers);
    } catch (error) {
        console.error("Error fetching couriers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function addCourierHandler(req: Request, res: Response) {
    try {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ error: "Courier name is required" });
            return;
        }

        const newCourier = await addCourier(name);
        res.status(201).json(newCourier);
    } catch (error) {
        console.error("Error adding courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteCourierHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await deleteCourier(parseInt(id));
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
