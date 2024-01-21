import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = fileURLToPath(new URL("../public", import.meta.url));
app.use(express.static(publicPath));

app.use(cors());

export { app };
