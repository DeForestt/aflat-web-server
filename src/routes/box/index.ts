import express from "express";
import Run from "./controllers/run";

const router = express.Router();

router.get("/", async (_req, res) => {
  const response = {'testBox': 'testing'};
  return res.send(response);
});

router.post("/run",async (_req, res) => {
  const response = await Run(_req);
  return res.send(response);
});

export default router;