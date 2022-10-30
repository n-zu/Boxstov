import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from "path";
import * as http from "http";
import cors from "cors";
import {MultiplayerGame} from "./game";
import {HostMaster} from "./gameMaster/hostMaster";

dotenv.config();

const hostId = Math.random().toString(36).substring(7);
const app: Express = express();
const server = http.createServer(app)
const port = process.env.PORT;
const game = new MultiplayerGame(server, new HostMaster(hostId));

app.use(cors())

app.use('/', express.static(path.join(__dirname, '../client')))

app.get('/health-check', (req: Request, res: Response) => {
    res.send('OK')
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/getState', (req: Request, res: Response) => {

});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} with hostId ${hostId}`);
});