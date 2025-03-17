import { RequestHandler, Router } from "express";
import { uploadSolution } from "../routes";

const router = Router();

router.route("/upload").post(uploadSolution as RequestHandler);

export { router as AdminController };
