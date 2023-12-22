import { NetworkPort } from './NetworkPort';
import { NetworkCable } from './NetworkCable';
import { MessageHandler } from '../software/core/MessageHandler';
import { BiteFilling } from '../software/core/BiteFillingPlugin';
import { Manchester } from '../software/core/Manchester';
import { CrcCheck } from '../software/core/CrcCheck';
import { getNetData } from '../utils/getNetData';
import { SwitchMacFrameHandler } from '../software/mac/SwitchMacFrameHandler';

const CRC_KEY = getNetData('110011010101');

export type ComputerListenMsgCallback = (str: string) => void;

export class Switch {
  private ports: NetworkPort[];
  private massageHandlers: MessageHandler[];
  private listens: (() => void)[];
  private map: Map<string, number>;
  private portCount: number;
  private macFrameHandler: SwitchMacFrameHandler;
  private equipId: string;

  constructor(portCount: number) {
    this.equipId = `${Math.floor(Math.random() * 100000)}`;
    this.portCount = portCount;
    this.ports = [];
    this.massageHandlers = [];
    this.listens = [];
    this.map = new Map();
    for (let i = 0; i < portCount; i++) {
      this.ports[i] = new NetworkPort();
      this.massageHandlers[i] = new MessageHandler(this.ports[i], [
        new CrcCheck(CRC_KEY),
        new BiteFilling(),
        new Manchester(),
      ]);
    }
    this.macFrameHandler = new SwitchMacFrameHandler();
    this.init();
  }

  init() {
    this.map.clear();
    for (let i = 0; i < this.portCount; i++) {
      this.massageHandlers[i].onMessage(str => {
        const macFrame = this.macFrameHandler.getMacFrameByString(str);
        if (!macFrame) {
          return;
        }
        if (macFrame.params && macFrame.params.eid === this.equipId) {
          return;
        }

        this.map.set(macFrame.fromAddress, i);

        let portIndex = this.map.get(macFrame.toAddress);
        macFrame.params = { ...macFrame.params, eid: this.equipId };
        let sendStr = this.macFrameHandler.toString(macFrame);
        if (portIndex !== undefined) {
          this.massageHandlers[portIndex].sendMessage(sendStr);
        } else {
          for (let j = 0; j < this.portCount; j++) {
            if (i !== j) {
              this.massageHandlers[j].sendMessage(sendStr);
            }
          }
        }
      });
    }
  }

  linkCable(cable: NetworkCable, index: number) {
    index--;
    this.ports[index].linkNetworkCable(cable);
  }

  unlinkCable(index: number) {
    index--;
    this.ports[index].unlink();
  }

  close() {
    for (let closeListen of this.listens) {
      if (closeListen) {
        closeListen();
      }
    }
  }
}
