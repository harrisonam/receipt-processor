import express from "express";

import * as receiptController from "../controllers/receipt.controller";

const router = express.Router();

router.post("/process", receiptController.createReceiptRecord);

router.get("/:id/points", receiptController.getReceiptRecord);

export default router;
