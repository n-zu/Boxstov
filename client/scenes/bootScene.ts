import { Scene } from 'phaser'
import Peer from "peerjs";

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' })

    const peer = new Peer()
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id)
    });
  }
}
