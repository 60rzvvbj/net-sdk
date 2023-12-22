import { NetworkPort } from './NetworkPort';
import { NetworkCable } from './NetworkCable';
import { MessageHandler } from '../software/core/MessageHandler';
import { BiteFilling } from '../software/core/BiteFillingPlugin';
import { Manchester } from '../software/core/Manchester';
import { CrcCheck } from '../software/core/CrcCheck';
import { getNetData } from '../utils/getNetData';
import { NetEquip } from './NetEquip';
import { MacFrameHandler } from '../software/mac/MacFrameHandler';
import { Protocol } from '../software/ProtocolManager';

const CRC_KEY = getNetData('110011010101');

export type ComputerListenMsgCallback = (str: string) => void;

export class Computer extends NetEquip {
  private port: NetworkPort;
  private massageHandler: MessageHandler;
  private macFrameHandler: MacFrameHandler;
  private cb: (data: string) => void;

  constructor() {
    super();
    this.port = new NetworkPort();
    this.massageHandler = new MessageHandler(this.port, [new CrcCheck(CRC_KEY), new BiteFilling(), new Manchester()]);
    this.macFrameHandler = new MacFrameHandler(this.getMacAddress(), this.massageHandler);
    this.cb = () => {};
    this.listen();
  }

  private async listen() {
    while (true) {
      const res = await this.macFrameHandler.onMessage();
      this.cb(res);
    }
  }

  linkCable(cable: NetworkCable) {
    this.port.linkNetworkCable(cable);
  }

  unlinkCable() {
    this.port.unlink();
  }

  sendMsg(data: string, macAddress: string) {
    this.macFrameHandler.sendMacFrame(data, macAddress);
  }

  listenMsg(cb: ComputerListenMsgCallback) {
    this.cb = cb;
    return () => {
      this.cb = () => {};
    };
  }

  close() {
    this.cb = () => {};
  }
}
