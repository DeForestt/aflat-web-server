import express from "express";
import { Module } from "../../Modules/Data/Models/Module.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const response = {'TestModules': 'testing'};
  return res.send(response);
});

router.get("/all", async (_req, res) => {
    const response = await Module.getAll();
    return res.send(response);
});

export default router;