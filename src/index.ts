import "reflect-metadata";
import express, { ErrorRequestHandler } from "express";

import receipts from "./routes/receipts.router";

const PORT: number = 3000;

const app = express();

app.use(express.json());

app.use("/receipts", receipts);

// Catch-all error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500);
  res.render("error", { error: err });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
