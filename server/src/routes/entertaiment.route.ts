import { entertaimentController } from "@/controllers/entertaiment.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/redeem", authenticate, entertaimentController.redeem);

export default router;
