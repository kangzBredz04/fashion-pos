import express from "express";
import { register, login, myAccount, logout } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/myaccount", myAccount);
router.post("/logout", logout);

export default router;
