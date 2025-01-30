import connection from "../config/db";
import { ResultSetHeader } from 'mysql2';

interface Courier {
  id: number;
  name: string;
}

const unsafeKeywords = ['DROP', 'DELETE', '--', ';'];

export async function getCouriers(): Promise<Courier[]> {
  const [rows]: any[] = await connection.query("SELECT * FROM couriers");
  return rows;
}

export async function addCourier(name: string): Promise<Courier> {
  if (unsafeKeywords.some(keyword => name.toUpperCase().includes(keyword))) {
    throw new Error("Unsafe input detected.");
  }

  const [result] = await connection.query<ResultSetHeader>(
    "INSERT INTO couriers (name) VALUES (?)", [name]
  );
  
  const newCourierId = result.insertId;
  return { id: newCourierId, name };
}

export async function deleteCourier(id: number): Promise<void> {
  await connection.query("DELETE FROM couriers WHERE id = ?", [id]);
}
