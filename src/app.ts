import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { APP_PORT } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});

export default app
