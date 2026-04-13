import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  toggleFavorite,
  getAllMedia,
} from "../controllers/notesController.js";
import { uploadFiles } from "../controllers/uploadController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // protect all note routes

router.route("/")
  .get(getAllNotes)
  .post(createNote);

router.route("/media/all")
  .get(getAllMedia);

router.route("/upload")
  .post(upload.array("files", 10), uploadFiles);

router.route("/:id/favorite")
  .put(toggleFavorite);

router.route("/:id")
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

export default router;
