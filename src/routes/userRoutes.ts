import { Router } from "express";
import userController from "../controllers/userController";
import { authenticateJWT } from "../middlewares/auth";

const router: Router = Router();

router.get("/", authenticateJWT, userController.getUsers);
router.get("/filter", authenticateJWT, userController.getUserByFilter);
router.post("/", userController.createUser);
router.put("/:id", authenticateJWT, userController.updateUser);
router.delete("/:id", authenticateJWT, userController.deleteUser);

export default router;
