import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { MultiplayerGame } from "./game/multiplayerGame.js";
import { HostMaster } from "./gameMaster/hostMaster.js";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
const game = new MultiplayerGame(server, new HostMaster(server));

app.use("/", express.static("./dist"));

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve("./index.html"));
});

app.get("/play", (req: Request, res: Response) => {
  res.sendFile(path.resolve("./play.html"));
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
