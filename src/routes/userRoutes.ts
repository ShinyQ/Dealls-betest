import { Router } from "express";
import userController from "../controllers/userController";

const router: Router = Router();

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
