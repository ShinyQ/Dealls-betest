import express from "express";
import { APP_PORT } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";

const app = express();

connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});
