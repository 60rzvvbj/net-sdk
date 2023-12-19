import { NetworkPort } from './NetworkPort';
import { NetworkCable } from './NetworkCable';
import { MessageController } from '../software/MessageController';
import { BiteFilling } from '../software/BiteFillingPlugin';
import { Manchester } from '../software/Manchester';
import { CrcCheck } from '../software/CrcCheck';
import { getNetData } from '../utils/getNetData';

const CRC_KEY = getNetData('110011010101');

export type ComputerListenMsgCallback = (str: string) => void;

export class Computer {
  private port: NetworkPort;
  private massageController: MessageController;
  private closeListen: () => void;

  constructor() {
    this.port = new NetworkPort();
    this.massageController = new MessageController(this.port, [
      new CrcCheck(CRC_KEY),
      new BiteFilling(),
      new Manchester(),
    ]);
    this.closeListen = () => {};
  }

  linkCable(cable: NetworkCable) {
    this.port.linkNetworkCable(cable);
  }

  unlinkCable() {
    this.port.unlink();
  }

  sendMsg(str: string) {
    this.massageController.sendMessage(str);
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.closeListen = this.massageController.onMessage(cb);
  }

  close() {
    this.closeListen();
  }
}
