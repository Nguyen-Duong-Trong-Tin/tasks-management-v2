import { Express } from "express";

import userRoutes from "./user.route";
import taskRoutes from "./task.route";

const mainRoutesV1 = (app: Express) => {
  const prefix = "/api/v1";

  app.use(prefix + "/users", userRoutes);
  app.use(prefix + "/tasks", taskRoutes);
}

export default mainRoutesV1;