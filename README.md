# Boxstov

Zombies survival co-op game using Phaser and WebRTC.

## Bootstrapping

- Open ports 9208/udp, 9208/tcp, 20000-25000/udp on the server (see [index.ts](server/src/index.ts) and [hostMaster.ts](server/src/gameMaster/hostMaster.ts))

## How To Use

### Requirements

This project requires `Node 18`

### Client

```bash
$ cd client
# Install dependencies
$ npm install
# Start the local development server
$ npm run start
```

### Server

```bash
$ cd server
# Install dependencies
$ npm install
# Start the local development server
$ npm run dev
```
