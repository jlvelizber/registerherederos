import express, { Application, Request, Response } from "express";
import routes from "./src/routes";
import cors from "cors";
const app: Application = express();

// Directorio publico
app.use(express.static("public"));

// Middleware
app.use(express.json());

app.use(cors());

// ROUTES
app.use("/api/v2", routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  // console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
