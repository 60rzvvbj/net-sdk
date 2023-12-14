import { NetworkCableState } from '../equipment/NetworkCable';
import { NetworkPort } from '../equipment/NetworkPort';

const flag: NetworkCableState[] = [0, 1, 1, 1, 1, 1, 1, 0];

export type FillingMessageCallback = (msg: NetworkCableState[]) => void;

export class Filling {
  private nowMsg: NetworkCableState[] = [];
  private networkPort: NetworkPort;

  constructor(networkPort: NetworkPort) {
    this.networkPort = networkPort;
  }

  async sendFillingMsg(msg: NetworkCableState[]) {
    this.nowMsg = msg;
    const res: NetworkCableState[] = [];
    res.push(...flag);
    let count = 0;
    for (let i = 0; i < msg.length; i++) {
      if (msg[i] === 0) {
        count = 0;
        res.push(0);
      } else {
        count++;
        res.push(1);
        if (count === 5) {
          res.push(0);
          count = 0;
        }
      }
    }
    res.push(...flag);
    await this.networkPort.sendData(res);
  }

  onMessage(cb: FillingMessageCallback) {
    let index = 0;
    let listening = false;
    let msg: NetworkCableState[] = [];
    return this.networkPort.onReceiveData(state => {
      if (listening) {
        msg.push(state);
      }
      if (state === flag[index]) {
        index++;
      } else {
        index = 0;
        if (state === flag[index]) {
          index++;
        }
      }

      if (index === flag.length) {
        if (listening) {
          listening = false;
          let res: NetworkCableState[] = [];
          let count = 0;
          // 剔除后面 8 位
          msg = msg.slice(0, msg.length - 8);
          for (let i = 0; i < msg.length; i++) {
            if (msg[i] === 0) {
              res.push(0);
              count = 0;
            } else {
              count++;
              res.push(1);
              if (count === 5) {
                i++;
                count = 0;
              }
            }
          }
          // 如果不是自己发的，则接收消息
          if (res.join('') !== this.nowMsg.join('')) {
            cb(res);
          }
          msg = [];
        } else {
          listening = true;
        }
        index = 0;
      }
    });
  }
}
