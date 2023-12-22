import { NetworkCable, NetworkCableState } from './NetworkCable';

export type NetData = 0 | 1;
export type NetworkPortReceiveDataCallback = (state: NetData) => void;

// 网口
export class NetworkPort {
  private receiveDataCallback: NetworkPortReceiveDataCallback | null;
  private networkCable: NetworkCable | null;

  constructor() {
    this.receiveDataCallback = null;
    this.networkCable = null;
  }

  private async listen() {
    while (true) {
      if (this.networkCable) {
        const state = await this.networkCable.getState();
        this.receiveDataCallback?.(state === NetworkCableState.High ? 1 : 0);
      } else {
        break;
      }
    }
  }

  linkNetworkCable(nc: NetworkCable) {
    this.networkCable = nc;
    this.listen();
  }

  unlink() {
    this.networkCable = null;
  }

  onReceiveData(cb: NetworkPortReceiveDataCallback) {
    this.receiveDataCallback = cb;
    return () => {
      this.receiveDataCallback = null;
    };
  }

  async getData(): Promise<NetData> {
    return (await this.networkCable?.getState()) === NetworkCableState.High ? 1 : 0;
  }

  async sendData(data: NetData) {
    return await this.networkCable?.changeState(data ? NetworkCableState.High : NetworkCableState.Low);
  }
}
