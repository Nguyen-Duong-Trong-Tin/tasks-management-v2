import { Express } from "express";

import userRoutes from "./user.route";

const mainRoutesV1 = (app: Express) => {
  const prefix = "/api/v1";

  app.use(prefix + "/users", userRoutes);
}

export default mainRoutesV1;