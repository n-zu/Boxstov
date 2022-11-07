import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import { MultiplayerGame } from "./game/multiplayerGame.js";
import { HostMaster } from "./gameMaster/hostMaster.js";

const PORT = 9208;

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = PORT;
const game = new MultiplayerGame(server, new HostMaster(server));

app.use("/", express.static("./dist"));

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
