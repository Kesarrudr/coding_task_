import { RequestHandler, Router } from "express";
import { HealthCheck } from "../routes";

const router = Router();

router.route("/").get(HealthCheck as RequestHandler);

export { router as HealthCheckController };
