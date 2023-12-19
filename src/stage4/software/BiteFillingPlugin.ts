import { NetData, NetworkPort } from '../equipment/NetworkPort';
import { getNetData } from '../utils/getNetData';
import { ListenMessageCallback, MessageControllerPlugin } from './MessageController';

const flag: NetData[] = getNetData('01111110');

export class BiteFilling implements MessageControllerPlugin {
  createMessage(msg: NetData[]) {
    const res: NetData[] = [];
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
    return res;
  }

  analysisMessage(data: NetData[]) {
    let index = 0;
    let listening = false;
    let msg: NetData[] = [];

    for (let state of data) {
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
          let res: NetData[] = [];
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
          return res;
        } else {
          listening = true;
        }
        index = 0;
      }
    }
    console.log('DEBUG: ', '比特填充解析失败');
    return null;
  }
}
