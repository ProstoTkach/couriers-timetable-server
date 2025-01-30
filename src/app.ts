import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import timetableRoutes from "./routes/timetableRoutes";
import courierRoutes from "./routes/courierRoutes";

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST","PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

app.use(timetableRoutes);
app.use(courierRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
