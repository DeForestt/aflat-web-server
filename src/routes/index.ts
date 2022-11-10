import express from "express";
import Box from "./box/index.js";
import Modules from "./modules/index.js";

const router = express.Router();

router.use('/box', Box);
router.use('/modules', Modules);

export default router;