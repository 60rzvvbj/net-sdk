import { NetworkCable } from './NetworkCable';
import { NetData, NetworkPort } from './NetworkPort';

export class Hub {
  private ports: NetworkPort[];

  constructor(portCount: number) {
    this.ports = [];
    for (let i = 0; i < portCount; i++) {
      this.ports.push(new NetworkPort());
    }
    this.listenPort();
  }

  private async listenPort() {
    const datas: NetData[] = [];

    for (let i = 0; i < this.ports.length; i++) {
      const port = this.ports[i];
      port.onReceiveData(async data => {
        datas[i] = data;
        for (let j = 0; j < this.ports.length; j++) {
          if (i !== j) {
            if (datas[j] !== data) {
              this.ports[j].sendData(data);
            }
          }
        }
      });
    }
  }

  linkPort(cable: NetworkCable, index: number) {
    index--;
    this.ports[index].linkNetworkCable(cable);
  }

  unlinkPort(index: number) {
    index--;
    this.ports[index].unlink();
  }
}
