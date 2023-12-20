import { NetworkPort } from './NetworkPort';
import { NetworkCable } from './NetworkCable';
import { MessageController } from '../software/MessageController';
import { BiteFilling } from '../software/BiteFillingPlugin';
import { Manchester } from '../software/Manchester';
import { CrcCheck } from '../software/CrcCheck';
import { getNetData } from '../utils/getNetData';
import { NetEquip } from './NetEquip';
import { MacFrame, MacFrameController } from '../software/MacFrameController';

const CRC_KEY = getNetData('110011010101');

export type ComputerListenMsgCallback = (str: string) => void;

export class Computer extends NetEquip {
  private port: NetworkPort;
  private massageController: MessageController;
  private macFrameController: MacFrameController;
  private closeListen: () => void;

  constructor() {
    super();
    this.port = new NetworkPort();
    this.massageController = new MessageController(this.port, [
      new CrcCheck(CRC_KEY),
      new BiteFilling(),
      new Manchester(),
    ]);
    this.macFrameController = new MacFrameController();
    this.closeListen = () => {};
  }

  linkCable(cable: NetworkCable) {
    this.port.linkNetworkCable(cable);
  }

  unlinkCable() {
    this.port.unlink();
  }

  sendMsg(data: string, macAddress: string) {
    const macFrame: MacFrame = {
      fromAddress: this.getMacAddress(),
      toAddress: macAddress,
      data,
    };
    const str = this.macFrameController.macFrameToString(macFrame);
    this.massageController.sendMessage(str);
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.closeListen = this.massageController.onMessage(str => {
      const macFrame = this.macFrameController.stringToMacFrame(str);
      if (!macFrame) {
        return;
      }
      if (macFrame.toAddress !== this.getMacAddress()) {
        return;
      }
      cb(macFrame.data);
    });
  }

  close() {
    this.closeListen();
  }
}
