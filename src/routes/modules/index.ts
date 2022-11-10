import express from "express";
import { Module } from "../../Modules/Data/Models/Module.js";

const router = express.Router();

router.get("/all", async (_req, res) => {
    const response = await Module.getAll();
    return res.send(response);
});

// get module by name
router.get("/", async (req, res) => {
    const name = req.query.name ?? "";
    if (name === "") {
        return res.status(400).send("No name provided");
    }; 
    if (typeof name !== "string") {
        return res.status(400).send("Name must be a string");
    }
    const response = await Module.getByName(name);
    if (response === undefined) {
      return res.status(404).send("Module not found");
    };
    return res.send(response);
});

router.post("/", async (req, res) => {
    const response = await Module.post(req.body);
    return res.send(response);
});

export default router;