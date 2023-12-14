import { NetworkPort } from './NetworkPort';
import { NetworkCable, NetworkCableEnd, NetworkCableState } from './NetworkCable';
export type ComputerListenMsgCallback = (state: NetworkCableState) => void;

export class Computer {
  private port: NetworkPort;
  private closeListen: () => void;

  constructor() {
    this.port = new NetworkPort();
    this.closeListen = () => {};
  }

  linkCable(cable: NetworkCable, end: NetworkCableEnd) {
    this.port.linkNetworkCable(cable, end);
  }

  unlinkCable() {
    this.port.unlink();
  }

  sendMsg(msg: NetworkCableState[]) {
    msg.forEach(data => {
      this.port.sendData(data);
    });
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.closeListen = this.port.onReceiveData(cb);
  }

  close() {
    this.closeListen();
  }
}
