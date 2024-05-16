import { Router } from "express";
import userController from "../controllers/userController";
import { authenticateJWT } from "../middlewares/auth";

const router: Router = Router();

router.get("/", userController.getUsers);
router.get("/filter", authenticateJWT, userController.getUserByFilter);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
