import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";
import { MultiplayerGame } from "./game/multiplayerGame.js";
import { HostMaster } from "./gameMaster/hostMaster.js";

const PORT = process.env.PORT || 9208;

dotenv.config();

console.log("Starting server...");

try {
  let server;
  const app = express();
  if (process.env.PRIVATE_KEY && process.env.CERTIFICATE) {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY);
    const certificate = fs.readFileSync(process.env.CERTIFICATE);
    const credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
  } else {
    server = http.createServer(app);
  }

  const game = new MultiplayerGame(server, new HostMaster(server));
  app.use("/", express.static("./dist"));

  app.get("/health", (req: Request, res: Response) => {
    res.send("OK");
  });

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
} catch (err) {
  console.log(err);
}
