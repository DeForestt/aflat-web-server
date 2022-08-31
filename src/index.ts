import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json"
import cors from "cors";
import https from "https";


import Router from "./routes";

const PORT = process.env.PORT || 8000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(cors());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(Router);

app.get("/", (_req, res) => {
  res.send({
    'message': 'welcome'
  });
})

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    console.log(`Find server docs at http://localhost:${PORT}/docs`);
  });

https.createServer(app).listen(HTTPS_PORT, () => {
  console.log("Server is running on port", HTTPS_PORT);
  console.log(`Find server docs at http://localhost:${HTTPS_PORT}/docs`);
});