import { RequestHandler, Router } from "express";
import { changeSolutions, uploadSolution } from "../routes";

const router = Router();

router.route("/upload").post(uploadSolution as RequestHandler);
router.route("/update").post(changeSolutions as RequestHandler);

export { router as AdminController };
