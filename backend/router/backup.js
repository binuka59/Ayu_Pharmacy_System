import express from "express";
import { backupDatabase, restoreDatabase } from  "../controller/backupController.js";


const router = express.Router();

router.get("/backups", backupDatabase);
router.post("/restore", restoreDatabase);

export default router;