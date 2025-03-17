import { RequestHandler, Router } from "express";
import { BookMark, ContestData, SignIn, SignUp } from "../routes";
import { userAuthMiddleWare } from "../middlewares/auth.middleware";

const router = Router();
const middleware = [userAuthMiddleWare as RequestHandler];

router.route("/signup").post(SignUp as RequestHandler);
router.route("/signin").post(SignIn as RequestHandler);
router.route("/bookmark").post(...middleware, BookMark as RequestHandler);
router.route("/contest").get(...middleware, ContestData as RequestHandler);

export { router as UserController };
