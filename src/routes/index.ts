import express from "express";
import Box from "./box"
import Run from "./box/controllers/run"

const router = express.Router();

router.use('/box', Box);

export default router;