import { NetworkPort } from './NetworkPort';
import { NetworkCable, NetworkCableState } from './NetworkCable';
import { Filling } from '../software/filling';
import { StringTranslate } from '../software/stringTranslate';
export type ComputerListenMsgCallback = (str: string) => void;

export class Computer {
  private port: NetworkPort;
  private fillingSoftware: Filling;
  private stringTranslateSoftware: StringTranslate;
  private closeListen: () => void;

  constructor() {
    this.port = new NetworkPort();
    this.fillingSoftware = new Filling(this.port);
    this.stringTranslateSoftware = new StringTranslate();
    this.closeListen = () => {};
  }

  linkCable(cable: NetworkCable) {
    this.port.linkNetworkCable(cable);
  }

  unlinkCable() {
    this.port.unlink();
  }

  async sendMsg(str: string) {
    const msg = this.stringTranslateSoftware.stringToMsg(str);
    await this.fillingSoftware.sendFillingMsg(msg);
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.closeListen = this.fillingSoftware.onMessage(msg => {
      const str = this.stringTranslateSoftware.msgToString(msg);
      cb(str);
    });
  }

  close() {
    this.closeListen();
  }
}
