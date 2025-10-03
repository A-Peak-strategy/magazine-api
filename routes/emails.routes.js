// src/routes/emails.routes.js
import { Router } from "express";
import * as emailsController from "../controllers/emails.controller.js";

const router = Router();

/**
 * POST   /api/emails        -> add email (subscribe)
 * GET    /api/emails        -> list all emails
 * GET    /api/emails/check/:email -> check if exists
 * DELETE /api/emails        -> remove email (body: { email })
 */
router.post("/", emailsController.addEmail);
router.get("/", emailsController.getEmails);
router.get("/check/:email", emailsController.checkEmail);
router.delete("/", emailsController.removeEmail);

export default router;
