import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from '@/routes/auth.route'
import passRoutes from '@/routes/pass.route'

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ status: true, ts: new Date().toISOString() }),
);

app.use('/api/auth',   authRoutes)
app.use('/api/passes',   passRoutes)

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`),
);
