import express from "express";
import { Module } from "../../Modules/Data/Models/Module.js";
import bodyParser from "body-parser";

const router = express.Router();
router.get("/all", async (_req, res) => {
    const response = await Module.getAll();
    return res.send(response);
});

// get module by name
router.get("/", async (req, res) => {
    const name = req.query.name ?? undefined;
    const author = req.query.author ?? undefined;
    const version = req.query.version ?? undefined;

    // make sure they are all strings or undefined
    if (typeof name !== "string" && name !== undefined) {
        return res.status(400).send("name must be a string");
    }
    if (typeof author !== "string" && author !== undefined) {
        return res.status(400).send("author must be a string");
    }
    if (typeof version !== "string" && version !== undefined) {
        return res.status(400).send("version must be a string");
    }


    const rsp = await Module.get({name, author, version});
    if (rsp === undefined) {
      return res.status(404).send("Module not found");
    };
    const {codePath, locked, ...response} = rsp;
    return res.send(response);
});

router.post("/", async (req, res) => {
    const {codePath, locked, ...response} = await Module.post(req.body);
    return res.send(response);
});

router.post("/:id", bodyParser.text({type: "*/*"}), async (req, res) => {
    const response = await Module.saveModuleText(req.params.id, req.body);
    if (response === 1) {
        return res.status(404).send("Module not found");
    } else if (response === 2) {
        return res.status(403).send("Module is locked please update to a new version");
    }
    return res.status(200).send("Module saved");
});

router.get("/:id", async (req, res) => {
    const response = await Module.getModuleText(req.params.id);
    if (response === undefined) {
        return res.status(404).send("Module not found");
    }
    return res.send(response);
});

export default router;