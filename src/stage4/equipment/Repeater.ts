import { NetworkCable } from './NetworkCable';
import { NetData, NetworkPort } from './NetworkPort';

export class Repeater {
  private port1: NetworkPort;
  private port2: NetworkPort;

  constructor() {
    this.port1 = new NetworkPort();
    this.port2 = new NetworkPort();
    this.listenPort();
  }

  private async listenPort() {
    let data1: NetData;
    let data2: NetData;

    this.port1.onReceiveData(async data => {
      data1 = data;
      if (data !== data2) {
        this.port2.sendData(data);
      }
    });

    this.port2.onReceiveData(async data => {
      data2 = data;
      if (data1 !== data) {
        this.port1.sendData(data);
      }
    });
  }

  linkPort1(cable: NetworkCable) {
    this.port1.linkNetworkCable(cable);
  }

  linkPort2(cable: NetworkCable) {
    this.port2.linkNetworkCable(cable);
  }

  unlinkPort1() {
    this.port1.unlink();
  }

  unlinkPort2() {
    this.port2.unlink();
  }
}
