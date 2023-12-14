import { NetworkCable, NetworkCableEnd, NetworkCableLinkContext, NetworkCableState } from './NetworkCable';

export type NetworkPortReceiveDataCallback = (state: NetworkCableState) => void;

// 网口
export class NetworkPort {
  private linkCtx: NetworkCableLinkContext | null;
  private receiveDataCallback: NetworkPortReceiveDataCallback | null;

  constructor() {
    this.linkCtx = null;
    this.receiveDataCallback = null;
  }

  linkNetworkCable(nc: NetworkCable, end: NetworkCableEnd) {
    this.linkCtx = nc.link(end);

    if (!this.linkCtx) {
      return null;
    }

    this.linkCtx.onStateChange(state => {
      if (this.receiveDataCallback) {
        this.receiveDataCallback(state);
      }
    });
  }

  unlink() {
    if (this.linkCtx) {
      this.linkCtx.unlink();
    }
    this.linkCtx = null;
  }

  onReceiveData(cb: NetworkPortReceiveDataCallback) {
    this.receiveDataCallback = cb;
    return () => {
      this.receiveDataCallback = null;
    };
  }

  sendData(networkCableState: NetworkCableState) {
    if (this.linkCtx) {
      this.linkCtx.changeState(networkCableState);
    }
  }
}
