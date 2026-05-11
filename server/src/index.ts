import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "@/routes/auth.route";
import passRoutes from "@/routes/pass.route";
import taskRoutes from "@/routes/task.route";
import timepointRoutes from "@/routes/timepoint.route";

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ status: true, ts: new Date().toISOString() }),
);

app.use("/api/auth", authRoutes);
app.use("/api/passes", passRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timepoints", timepointRoutes);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`),
);
