import express from "express";
import { Login } from "./controller/authController.js";
import { request, getRequests, updateStatus } from "./controller/requestController.js";
const router = express.Router();

router.post("/api/login", Login);
router.post("/api/request", request);
router.get("/api/get-requests", getRequests);
router.post("/api/update-status", updateStatus);

export default router;
