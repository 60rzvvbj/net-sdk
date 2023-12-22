import { NetData, NetworkPort } from '../../equipment/NetworkPort';
import { getNetData } from '../../utils/getNetData';
import { StringTranslate } from '../app/StringTranslate';

export type MessageCallback = (str: string) => void;
export type ListenMessageCallback = (data: NetData[]) => void;

export interface MessageHandlerPlugin {
  createMessage: (data: NetData[]) => NetData[];
  analysisMessage: (data: NetData[]) => NetData[] | null;
}

export interface LastMessageHandlerPlugin {
  createMessage: (data: NetData[]) => NetData[];
  listenMessage: (port: NetworkPort, cb: ListenMessageCallback) => void;
}

export class MessageHandler {
  private port: NetworkPort;
  private cb: MessageCallback;
  private translate: StringTranslate;
  private plugins: [...MessageHandlerPlugin[], LastMessageHandlerPlugin];

  constructor(port: NetworkPort, plugins: [...MessageHandlerPlugin[], LastMessageHandlerPlugin]) {
    this.port = port;
    this.cb = () => {};
    this.translate = new StringTranslate();
    this.plugins = plugins;
    this.listen();
  }

  private listen() {
    const lastPlugin = this.plugins[this.plugins.length - 1] as LastMessageHandlerPlugin;
    lastPlugin.listenMessage(this.port, data => {
      let netData: NetData[] | null = data;
      for (let i = this.plugins.length - 2; i >= 0; i--) {
        if (!netData) {
          break;
        }
        netData = (this.plugins[i] as MessageHandlerPlugin).analysisMessage(netData);
      }
      if (netData) {
        let str = this.translate.msgToString(netData);
        this.cb(str);
      }
    });
  }

  sendMessage(str: string) {
    let netData = this.translate.stringToMsg(str);
    for (let i = 0; i < this.plugins.length; i++) {
      netData = this.plugins[i].createMessage(netData);
    }
    let key = Math.floor(Math.random() * 10);
    this.csmacdSend(netData, key);
  }

  onMessage(cb: MessageCallback) {
    this.cb = cb;
    return () => {
      this.cb = () => {};
    };
  }

  private async csmacdSend(data: NetData[], key: number): Promise<void> {
    let len = Math.floor(Math.random() * 20 + 5) * 2;
    let pre = new Array(len).fill(0);
    let now = 0;

    // 先听再发
    while (true) {
      const data = await this.port.getData();
      if (data === pre[now]) {
        now++;
        if (now === pre.length) {
          break;
        }
      } else {
        now = 0;
      }
    }

    let conflict = false;

    // 边听边发
    for (let i = 0; i < data.length; i++) {
      const res = await this.port.sendData(data[i]);
      if (!res) {
        // 冲突停止
        conflict = true;
        break;
      }
    }

    if (conflict) {
      // 发一条混乱数据告知其它方冲突了
      let arr: NetData[] = getNetData('111111111111111100000000');
      for (let i = 0; i < arr.length; i++) {
        await this.port.sendData(arr[i]);
      }

      // 随机等待一段时间
      const random = Math.floor(Math.random() * 150 + 30);
      for (let i = 0; i < random; i++) {
        await this.port.getData();
      }

      // 重新发
      return this.csmacdSend(data, key);
    }

    return;
  }
}
