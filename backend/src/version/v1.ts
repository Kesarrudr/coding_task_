import { Router } from "express";
import {
  AdminController,
  HealthCheckController,
  UserController,
} from "../controller";

const router = Router();

router.use("/health", HealthCheckController);
router.use("/user", UserController);
router.use("/admin", AdminController);

export { router as V1Route };
