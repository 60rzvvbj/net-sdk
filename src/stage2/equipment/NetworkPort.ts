import { NetworkCable, NetworkCableState } from './NetworkCable';
import { timeLine } from '../utils/timeLine';

export type NetworkPortReceiveDataCallback = (state: NetworkCableState) => void;

// 网口
export class NetworkPort {
  private receiveDataCallback: NetworkPortReceiveDataCallback | null;
  private networkCable: NetworkCable | null;
  private listening: boolean;

  constructor() {
    this.receiveDataCallback = null;
    this.networkCable = null;
    this.listening = false;
  }

  private async listen() {
    this.listening = true;
    while (true) {
      if ((this.listening as boolean) === false) {
        break;
      }
      await timeLine.next();
      if (this.networkCable && this.receiveDataCallback) {
        const state = this.networkCable.getState();
        this.receiveDataCallback(state);
      }
    }
  }

  private closeListen() {
    this.listening = false;
  }

  linkNetworkCable(nc: NetworkCable) {
    this.networkCable = nc;
    this.listen();
  }

  unlink() {
    this.closeListen();
    this.networkCable = null;
  }

  onReceiveData(cb: NetworkPortReceiveDataCallback) {
    this.receiveDataCallback = cb;
    return () => {
      this.receiveDataCallback = null;
    };
  }

  async sendData(data: NetworkCableState[]) {
    if (this.networkCable) {
      await this.send(data);
    }
  }

  private async send(data: NetworkCableState[]) {
    for (let i = 0; i < data.length; i++) {
      await timeLine.nextSend();
      this.networkCable?.changeState(data[i]);
    }
  }
}
