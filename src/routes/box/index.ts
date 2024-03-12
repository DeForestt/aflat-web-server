import express from "express";
import Run from "./controllers/run.js";
import { setDockerCleanupInterval } from "Modules/RunDocker.js";

const router = express.Router();

setDockerCleanupInterval();

router.get("/", async (_req, res) => {
  const response = {'testBox': 'testing'};
  return res.send(response);
});

router.post("/run", (_req, res) => {
  const response = Run(_req);
  return res.send(response);
});

export default router;