import express from "express";
import mediaController from "../controllers/media.controller.js";

const router = express.Router();

router.get("/movie/list", mediaController.getGenres);

export default router;
