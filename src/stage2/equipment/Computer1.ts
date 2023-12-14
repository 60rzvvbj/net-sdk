import { NetworkPort } from './NetworkPort';
import { NetworkCable, NetworkCableState } from './NetworkCable';
export type ComputerListenMsgCallback = (state: NetworkCableState) => void;

export class Computer {
  private port: NetworkPort;
  private closeListen: () => void;

  constructor() {
    this.port = new NetworkPort();
    this.closeListen = () => {};
  }

  linkCable(cable: NetworkCable) {
    this.port.linkNetworkCable(cable);
  }

  unlinkCable() {
    this.port.unlink();
  }

  sendMsg(msg: NetworkCableState[]) {
    this.port.sendData(msg);
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.closeListen = this.port.onReceiveData(cb);
  }

  close() {
    this.closeListen();
  }
}
