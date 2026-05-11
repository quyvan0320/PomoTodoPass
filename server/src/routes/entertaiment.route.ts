import { entertaimentController } from "@/controllers/entertaiment.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.patch("/:id/expire", authenticate, entertaimentController.expire);
router.post("/redeem", authenticate, entertaimentController.redeem);
router.get("/active", authenticate, entertaimentController.getActive);

export default router;
