import express from 'express';

import {
  getAllCustomers,
  getAllModels,
  getAllStorages,
  getAllBoardTypes,
  createCustomer,
  createModel,
  createStorage,
  createBoardType,
  getReflowTable,
  createReflowTable,
  clearReflowTable
} from '../controllers/userController.js';

import { getHistory, getAllProfilers, createProfiler, getReflowTableusingProfile, clearHistoryTable } from '../controllers/userController.js';

const router = express.Router();


router.get("/customers",getAllCustomers); // Get all customers
router.get("/models", getAllModels); // Get all models
router.get("/storages", getAllStorages); // Get all storages  
router.get("/boardTypes", getAllBoardTypes); // Get all board types
router.get("/reflowtable",getReflowTable); // Get reflow table data (assuming this is defined in your controller)
router.get("/reflowtable/:profiler_name", getReflowTableusingProfile); // Get reflow table data by profiler name (assuming this is defined in your controller)
router.get("/history", getHistory); // Get history data (assuming this is defined in your controller)
router.get("/profilers", getAllProfilers); // Get all profilers (assuming this is defined in your controller)

router.post("/customer", createCustomer); // Create a new customer  
router.post("/model", createModel); // Create a new model
router.post("/storage", createStorage); // Create a new storage 
router.post("/boardType", createBoardType); // Create a new board type
router.post("/reflowtable",createReflowTable); // Create a new reflow table (assuming this is defined in your controller)
router.post("/profilers", createProfiler); // Create a new profiler (assuming this is defined in your controller)



router.delete("/reflowtable", clearReflowTable);
router.delete("/history", clearHistoryTable); // Clear history (assuming this is defined in your controller)
export default router;
