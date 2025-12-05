import cors from "cors";

import express from "express";

import { errorHandler } from "./middlewares/responseHandler.js";

import authRoutes from "./routes/auth.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import usersAccountsRoutes from "./routes/usersAccounts.routes.js";
import companiesAccountsRoutes from "./routes/companiesAccounts.routes.js";

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(errorHandler);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", usersAccountsRoutes);
app.use("/api/companies", companiesAccountsRoutes);

export default app;
