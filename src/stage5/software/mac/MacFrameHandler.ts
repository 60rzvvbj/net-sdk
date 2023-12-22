import { PromiseContext, getPromise } from '../../utils/promise';
import { Protocol } from '../ProtocolManager';
import { MessageHandler } from '../core/MessageHandler';
import { PureMacFrameHandler } from './PureMacFrameHandler';
import { MacAddress, MacFrame } from './type';

export class MacFrameHandler extends PureMacFrameHandler {
  private mac: MacAddress;
  private messageHandler: MessageHandler;
  private onMessagePromise: PromiseContext<string>;

  constructor(mac: MacAddress, messageHandler: MessageHandler) {
    super();
    this.mac = mac;
    this.messageHandler = messageHandler;
    this.onMessagePromise = getPromise<string>();
    this.listen();
  }

  private listen() {
    this.messageHandler.onMessage(data => {
      const macFrame = this.stringToMacFrame(data);
      if (!macFrame || macFrame.toAddress !== this.mac) {
        return;
      }
      this.onMessagePromise.resolve(macFrame.data);
      this.onMessagePromise = getPromise<string>();
    });
  }

  sendMacFrame(data: string, targetMac: MacAddress, params?: { [key: string]: string }) {
    const macFrame: MacFrame = {
      data,
      fromAddress: this.mac,
      toAddress: targetMac,
      protocol: Protocol.MAC,
      params,
    };
    this.messageHandler.sendMessage(this.macFrameToString(macFrame));
  }

  onMessage(): Promise<string> {
    return this.onMessagePromise.promise;
  }
}
