import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from "path";
import * as http from "http";
import cors from "cors";

import geckos from '@geckos.io/server';

import {iceServers} from "@geckos.io/server";

dotenv.config();

const hostId = "efoppiano";
const app: Express = express();
const server = http.createServer(app)
const port = process.env.PORT;
//const game = new MultiplayerGame(server, new HostMaster(hostId));

const io = geckos({
  iceServers: iceServers,

});

io.addServer(server);

io.onConnection(channel => {
  console.log("onConnection");
  channel.onDisconnect(() => {
    console.log("onDisconnect");
  });
});

app.use(cors())

app.use("/id", (req: Request, res: Response) => {

});

app.use('/', express.static('./dist'))

app.get('/health', (req: Request, res: Response) => {
    res.send('OK')
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve('./index.html'));
});

app.get('/play', (req: Request, res: Response) => {
  res.sendFile(path.resolve('./play.html'));
});

app.get('/getState', (req: Request, res: Response) => {

});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} with hostId ${hostId}`);
});