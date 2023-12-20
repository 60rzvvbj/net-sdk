import { NetworkPort } from './NetworkPort';
import { NetworkCable } from './NetworkCable';
import { MessageController } from '../software/MessageController';
import { BiteFilling } from '../software/BiteFillingPlugin';
import { Manchester } from '../software/Manchester';
import { CrcCheck } from '../software/CrcCheck';
import { getNetData } from '../utils/getNetData';
import { MacFrameController } from '../software/MacFrameController';

const CRC_KEY = getNetData('110011010101');

export type ComputerListenMsgCallback = (str: string) => void;

export class Switch {
  private ports: NetworkPort[];
  private massageControllers: MessageController[];
  private listens: (() => void)[];
  private map: Map<string, number>;
  private portCount: number;
  private macFrameController: MacFrameController;

  constructor(portCount: number) {
    this.portCount = portCount;
    this.ports = [];
    this.massageControllers = [];
    this.listens = [];
    this.map = new Map();
    for (let i = 0; i < portCount; i++) {
      this.ports[i] = new NetworkPort();
      this.massageControllers[i] = new MessageController(this.ports[i], [
        new CrcCheck(CRC_KEY),
        new BiteFilling(),
        new Manchester(),
      ]);
    }
    this.macFrameController = new MacFrameController();
    this.init();
  }

  init() {
    const cmtPrefix = `${Math.floor(Math.random() * 100000)}`;
    this.map.clear();
    for (let i = 0; i < this.portCount; i++) {
      this.massageControllers[i].onMessage(str => {
        const macFrame = this.macFrameController.stringToMacFrame(str);
        if (!macFrame || !macFrame.id) {
          return;
        }
        if (macFrame.id.split('_')[0] === cmtPrefix) {
          return;
        }

        this.map.set(macFrame.fromAddress, i);

        let portIndex = this.map.get(macFrame.toAddress);
        macFrame.id = `${cmtPrefix}_${Math.random()}`;
        let sendStr = this.macFrameController.macFrameToString(macFrame);
        if (portIndex !== undefined) {
          this.massageControllers[portIndex].sendMessage(sendStr);
        } else {
          for (let j = 0; j < this.portCount; j++) {
            if (i !== j) {
              this.massageControllers[j].sendMessage(sendStr);
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
