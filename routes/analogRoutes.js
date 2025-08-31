import { Router } from "express";
import analogController from "../controllers/analogController.js";

const router = Router();


// Get all analog data
router.get('/', analogController.getAllData);

// Get only voltage data
router.get('/voltage', analogController.getVoltageData);

// Get only current data
router.get('/current', analogController.getCurrentData);

// Get only frequency data
router.get('/frequency', analogController.getFrequencyData);

// Get only phase difference data
router.get('/phase', analogController.getPhaseDifferenceData);

// Get analog data by ID
router.get('/:id', analogController.getDataById);

// Get statistics about the analog data
router.get('/stats/summary', analogController.getStats);

// export to csv
router.get('/export/csv', analogController.exportToCSV);

// Delete all analog data (use with caution)
router.delete('/', analogController.deleteAllData);

export default router;