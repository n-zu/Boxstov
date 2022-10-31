import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from "path";
import http from "http";
import geckos from '@geckos.io/server'
import { iceServers } from '@geckos.io/server'
import {MultiplayerGame} from "./game/multiplayerGame.js";
import {HostMaster} from "./gameMaster/hostMaster.js";

dotenv.config();

const app: Express = express();
const server = http.createServer(app)
const port = process.env.PORT;
const game = new MultiplayerGame(server, new HostMaster(server));

const io = geckos({
  iceServers: iceServers
})
io.addServer(server)

io.onConnection(channel => {
  console.log('new connection')
  // @ts-ignore
  channel.on('join', (id: string) => {
    console.log('join', id)
  });
  channel.emit("msg", "Hello from server");
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

server.listen(port);
