import { Router } from "express";
import authRouter from './router/auth.router.js';
const apiRouter = Router();
apiRouter.use("/auth", authRouter);
export default apiRouter;
//# sourceMappingURL=index.router.js.map