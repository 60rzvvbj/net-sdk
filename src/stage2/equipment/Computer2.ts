import { NetworkPort } from './NetworkPort';
import { NetworkCable, NetworkCableState } from './NetworkCable';
import { Filling } from '../software/filling';
export type ComputerListenMsgCallback = (msg: NetworkCableState[]) => void;

export class Computer {
  private port: NetworkPort;
  private fillingSoftware: Filling;
  private closeListen: () => void;

  constructor() {
    this.port = new NetworkPort();
    this.fillingSoftware = new Filling(this.port);
    this.closeListen = () => {};
  }

  linkCable(cable: NetworkCable) {
    this.port.linkNetworkCable(cable);
  }

  unlinkCable() {
    this.port.unlink();
  }

  async sendMsg(msg: NetworkCableState[]) {
    await this.fillingSoftware.sendFillingMsg(msg);
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.closeListen = this.fillingSoftware.onMessage(cb);
  }

  close() {
    this.closeListen();
  }
}
